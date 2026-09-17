const prisma = require('../utils/db');

const triageIncludes = {
  patient: true,
  doctor: { include: { employee: true } },
  department: true,
  queueEntry: true,
  triageAssessment: { include: { recordedBy: { select: { id: true, username: true, email: true, role: true } } } },
};

const nursingRoles = ['TRIAGE_NURSE', 'CHARGE_NURSE', 'STAFF_NURSE', 'ER_NURSE', 'NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'];

exports.getTriageQueue = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { status: 'WAITING' },
      include: triageIncludes,
      orderBy: { createdAt: 'asc' },
    });
    appointments.sort((left, right) => (left.queueEntry?.createdAt || left.createdAt) - (right.queueEntry?.createdAt || right.createdAt));
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

exports.getDoctorQueue = async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findFirst({ where: { employee: { userId: req.user.id } } });
    if (!doctor) { const error = new Error('No doctor profile is linked to this account.'); error.statusCode = 403; return next(error); }
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id, status: { in: ['WAITING', 'IN_CONSULTATION'] } },
      include: {
        patient: true,
        department: true,
        queueEntry: true,
        triageAssessment: { include: { recordedBy: { select: { id: true, username: true, role: true } } } },
        consultation: { include: { labOrders: { include: { test: true, result: true } }, radiologyOrders: { include: { report: true } }, prescriptions: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

exports.updateTriage = async (req, res, next) => {
  try {
    const { priority, assessmentNotes, bloodPressure, heartRate, temperature, spo2, respiratoryRate, doctorId } = req.body;
    if (!['CRITICAL', 'URGENT', 'STABLE'].includes(priority)) {
      const error = new Error('A valid acuity level is required.'); error.statusCode = 400; return next(error);
    }
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appointment) { const error = new Error('Appointment not found.'); error.statusCode = 404; return next(error); }
    const assessment = await prisma.triageAssessment.upsert({
      where: { appointmentId: req.params.id },
      create: { appointmentId: req.params.id, priority, assessmentNotes, bloodPressure, heartRate, temperature, spo2, respiratoryRate, recordedById: req.user.id },
      update: { priority, assessmentNotes, bloodPressure, heartRate, temperature, spo2, respiratoryRate, recordedById: req.user.id },
      include: { recordedBy: { select: { id: true, username: true, email: true, role: true } } },
    });
    const updated = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: 'WAITING', ...(doctorId ? { doctorId } : {}) }, include: triageIncludes });
    res.json({ success: true, data: { ...updated, triageAssessment: assessment } });
  } catch (error) { next(error); }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({ include: { employee: true }, orderBy: { employee: { lastName: 'asc' } } });
    res.json({ success: true, data: doctors });
  } catch (error) { next(error); }
};

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { ward: true, beds: { include: { admission: { include: { patient: true, assignedNurse: { include: { employee: true } } } } } } },
      orderBy: [{ displayOrder: 'asc' }, { number: 'asc' }],
    });
    res.json({ success: true, data: rooms });
  } catch (error) { next(error); }
};

exports.getNurses = async (req, res, next) => {
  try {
    const nurses = await prisma.user.findMany({
      where: { isActive: true, role: { name: { in: ['NURSE', 'TRIAGE_NURSE', 'CHARGE_NURSE', 'STAFF_NURSE', 'ER_NURSE'] } } },
      include: { employee: true, role: true },
      orderBy: { username: 'asc' },
    });
    res.json({ success: true, data: nurses.map(({ passwordHash, ...nurse }) => nurse) });
  } catch (error) { next(error); }
};

exports.assignPatientToRoom = async (req, res, next) => {
  try {
    const { appointmentId, nurseId } = req.body;
    const bed = await prisma.bed.findFirst({ where: { roomId: req.params.roomId, status: 'AVAILABLE' }, include: { room: true } });
    if (!bed) { const error = new Error('This room has no available bed.'); error.statusCode = 409; return next(error); }
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId }, include: { patient: true } });
    if (!appointment) { const error = new Error('Appointment not found.'); error.statusCode = 404; return next(error); }
    const result = await prisma.$transaction(async (transaction) => {
      const admission = await transaction.admission.create({ data: { patientId: appointment.patientId, bedId: bed.id, diagnosis: appointment.reason, assignedNurseId: nurseId || null } });
      await transaction.bed.update({ where: { id: bed.id }, data: { status: 'OCCUPIED' } });
      await transaction.appointment.update({ where: { id: appointmentId }, data: { status: 'IN_CONSULTATION' } });
      return admission;
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.updateRoomStatus = async (req, res, next) => {
  try {
    if (!['ACTIVE', 'MAINTENANCE', 'ISOLATION'].includes(req.body.status)) { const error = new Error('Invalid room status.'); error.statusCode = 400; return next(error); }
    const room = await prisma.room.update({ where: { id: req.params.roomId }, data: { status: req.body.status } });
    res.json({ success: true, data: room });
  } catch (error) { next(error); }
};

exports.nursingRoles = nursingRoles;