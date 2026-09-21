const prisma = require('../utils/db');

const appointmentIncludes = {
  patient: true,
  doctor: { include: { employee: true } },
  department: true,
  queueEntry: true,
  triageAssessment: true,
};

const parseAppointmentDate = (date, time) => {
  if (!date) return null;
  let normalizedTime = time;
  const twelveHourTime = String(time || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourTime) {
    let hour = Number(twelveHourTime[1]);
    const minutes = twelveHourTime[2];
    const meridiem = twelveHourTime[3].toUpperCase();
    if (hour < 1 || hour > 12) return null;
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    normalizedTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  }
  const parsed = new Date(normalizedTime ? `${date}T${normalizedTime}` : date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Standard production method
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, departmentId, date, time, reason } = req.body;
    
    const appointmentTime = parseAppointmentDate(date || req.body.appointmentDate, time);

    if (!patientId || !doctorId || !departmentId || !reason || !appointmentTime) {
      const err = new Error('Patient, doctor, department, date, and reason are required.');
      err.statusCode = 400;
      return next(err);
    }

    const conflict = await prisma.appointment.findFirst({
      where: { doctorId, date: appointmentTime, status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
    });
    if (conflict) {
      const err = new Error('This doctor already has an appointment at that time.');
      err.statusCode = 409;
      return next(err);
    }

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: patientId } },
        doctor: { connect: { id: doctorId } },
        department: { connect: { id: departmentId } }, // FIXED: Added department relation
        date: appointmentTime,
        time: time || 'TBD',
        reason
      },
      include: appointmentIncludes,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// Developer test method to auto-link the first available patient, doctor, and department
exports.scheduleTestAppointment = async (req, res, next) => {
  try {
    const patient = await prisma.patient.findFirst();
    const department = await prisma.department.findFirst();
    const doctor = await prisma.doctor.findFirst({
      include: { employee: true } // Fetch the employee record to get their departmentId
    });

    if (!patient || !doctor || !department) {
      const err = new Error('Database must have at least 1 patient, 1 doctor, and 1 department');
      err.statusCode = 400;
      return next(err);
    }

    // Connect the appointment to the doctor's specific department
    const targetDepartmentId = doctor.employee?.departmentId || department.id;

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: patient.id } },
        doctor: { connect: { id: doctor.id } },
        department: { connect: { id: targetDepartmentId } }, // FIXED: Added department relation
        date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 
        time: "10:00 AM", 
        reason: 'Initial Neurological Consultation'
      },
      include: {
        patient: true,
        doctor: { include: { employee: true } },
        department: true
      }
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.date) {
      const day = new Date(req.query.date);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: day, lt: nextDay };
    }
    if (req.user.role.name === 'PATIENT') where.patient = { userId: req.user.id };
    const appointments = await prisma.appointment.findMany({ where, include: appointmentIncludes, orderBy: { date: 'asc' } });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) { next(error); }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const allowed = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!allowed.includes(req.body.status)) {
      const err = new Error('Invalid appointment status.');
      err.statusCode = 400;
      return next(err);
    }
    const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data: { status: req.body.status }, include: appointmentIncludes });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) { next(error); }
};

exports.checkInAppointment = async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appointment) { const err = new Error('Appointment not found.'); err.statusCode = 404; return next(err); }
    if (await prisma.queueEntry.findUnique({ where: { appointmentId: appointment.id } })) { const err = new Error('Appointment is already in the queue.'); err.statusCode = 409; return next(err); }
    const queueDate = new Date(appointment.date); queueDate.setHours(0, 0, 0, 0);
    const last = await prisma.queueEntry.findFirst({ where: { queueDate }, orderBy: { token: 'desc' } });
    const result = await prisma.$transaction(async (transaction) => {
      const queueEntry = await transaction.queueEntry.create({ data: { appointmentId: appointment.id, queueDate, token: (last?.token || 0) + 1 } });
      const updatedAppointment = await transaction.appointment.update({ where: { id: appointment.id }, data: { status: 'WAITING' }, include: appointmentIncludes });
      return { appointment: updatedAppointment, queueEntry };
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};