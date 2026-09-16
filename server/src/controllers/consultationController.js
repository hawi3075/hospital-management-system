const prisma = require('../utils/db');

const consultationInclude = {
  patient: true,
  doctor: { include: { employee: true } },
  appointment: true,
  vitalSigns: true,
  diagnoses: true,
  prescriptions: { include: { items: { include: { medicine: true } } } },
};

exports.listConsultations = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.patientId) where.patientId = req.query.patientId;
    if (req.query.doctorId) where.doctorId = req.query.doctorId;
    if (req.user.role.name === 'PATIENT') where.patient = { userId: req.user.id };
    const consultations = await prisma.consultation.findMany({ where, include: consultationInclude, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (error) { next(error); }
};

exports.getConsultation = async (req, res, next) => {
  try {
    const consultation = await prisma.consultation.findUnique({ where: { id: req.params.id }, include: consultationInclude });
    if (!consultation) { const err = new Error('Consultation not found.'); err.statusCode = 404; return next(err); }
    if (req.user.role.name === 'PATIENT' && consultation.patient.userId !== req.user.id) { const err = new Error('You can only access your own consultations.'); err.statusCode = 403; return next(err); }
    res.status(200).json({ success: true, data: consultation });
  } catch (error) { next(error); }
};

exports.createConsultation = async (req, res, next) => {
  try {
    const { appointmentId, patientId, doctorId, chiefComplaint, symptoms, examinationNotes, treatmentPlan, followUpDate, vitalSigns, diagnosis } = req.body;
    if (!appointmentId || !patientId || !doctorId || !chiefComplaint || !examinationNotes || !treatmentPlan) {
      const err = new Error('Appointment, patient, doctor, complaint, examination, and treatment plan are required.'); err.statusCode = 400; return next(err);
    }
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment || appointment.patientId !== patientId || appointment.doctorId !== doctorId) { const err = new Error('Appointment does not match the consultation participants.'); err.statusCode = 400; return next(err); }
    const consultation = await prisma.$transaction(async (transaction) => {
      const created = await transaction.consultation.create({
        data: {
          appointmentId, patientId, doctorId, chiefComplaint, symptoms: symptoms || '', examinationNotes, treatmentPlan,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          diagnoses: diagnosis ? { create: [{ description: diagnosis }] } : undefined,
          vitalSigns: vitalSigns ? { create: { bloodPressure: vitalSigns.bloodPressure, heartRate: Number(vitalSigns.heartRate), temperature: Number(vitalSigns.temperature), spo2: Number(vitalSigns.spo2), respiratoryRate: Number(vitalSigns.respiratoryRate), weight: Number(vitalSigns.weight), height: Number(vitalSigns.height) } } : undefined,
        }, include: consultationInclude,
      });
      await transaction.appointment.update({ where: { id: appointmentId }, data: { status: 'COMPLETED' } });
      return created;
    });
    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    if (error.code === 'P2002') { const err = new Error('This appointment already has a consultation.'); err.statusCode = 409; return next(err); }
    next(error);
  }
};
