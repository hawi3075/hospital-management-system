const prisma = require('../utils/db');

const doctorRoles = ['DOCTOR', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'];
const labRoles = ['LAB_TECHNICIAN', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'];
const radiologyRoles = ['RADIOLOGY_TECHNICIAN', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'];

const fail = (message, statusCode = 400) => { const error = new Error(message); error.statusCode = statusCode; return error; };

exports.listLabTests = async (req, res, next) => {
  try { res.json({ success: true, data: await prisma.labTest.findMany({ orderBy: { name: 'asc' } }) }); } catch (error) { next(error); }
};

exports.listMedicines = async (req, res, next) => {
  try { res.json({ success: true, data: await prisma.medicine.findMany({ where: { stock: { gt: 0 } }, orderBy: { name: 'asc' } }) }); } catch (error) { next(error); }
};

exports.createLabOrder = async (req, res, next) => {
  try {
    const { consultationId, testId } = req.body;
    if (!consultationId || !testId) return next(fail('Consultation and laboratory test are required.'));
    const order = await prisma.labOrder.create({ data: { consultationId, testId, doctorId: req.user.employee?.doctor?.id || req.body.doctorId }, include: { test: true, result: true } });
    res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
};

exports.createRadiologyOrder = async (req, res, next) => {
  try {
    const { consultationId, imagingType } = req.body;
    if (!consultationId || !imagingType) return next(fail('Consultation and imaging type are required.'));
    const consultation = await prisma.consultation.findUnique({ where: { id: consultationId } });
    if (!consultation) return next(fail('Consultation not found.', 404));
    const order = await prisma.radiologyOrder.create({ data: { consultationId, imagingType, doctorId: consultation.doctorId }, include: { report: true } });
    res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
};

exports.createPrescription = async (req, res, next) => {
  try {
    const { consultationId, medicineId, dosage, frequency, duration, quantity } = req.body;
    if (!consultationId || !medicineId || !dosage || !frequency || !duration || !quantity) return next(fail('Complete prescription details are required.'));
    const prescription = await prisma.prescription.create({ data: { consultationId, items: { create: [{ medicineId, dosage, frequency, duration, quantity: Number(quantity) }] } }, include: { items: { include: { medicine: true } } } });
    res.status(201).json({ success: true, data: prescription });
  } catch (error) { next(error); }
};

exports.completeLabOrder = async (req, res, next) => {
  try {
    const { findings, remarks, fileUrl } = req.body;
    if (!findings) return next(fail('Laboratory findings are required.'));
    const result = await prisma.$transaction(async (transaction) => {
      const created = await transaction.labResult.upsert({ where: { labOrderId: req.params.id }, create: { labOrderId: req.params.id, findings, remarks, fileUrl }, update: { findings, remarks, fileUrl } });
      await transaction.labOrder.update({ where: { id: req.params.id }, data: { status: 'COMPLETED' } });
      return created;
    });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.completeRadiologyOrder = async (req, res, next) => {
  try {
    const { findings, conclusion, imageFileUrl } = req.body;
    if (!findings || !conclusion) return next(fail('Radiology findings and conclusion are required.'));
    const result = await prisma.$transaction(async (transaction) => {
      const created = await transaction.radiologyReport.upsert({ where: { radiologyOrderId: req.params.id }, create: { radiologyOrderId: req.params.id, findings, conclusion, imageFileUrl }, update: { findings, conclusion, imageFileUrl } });
      await transaction.radiologyOrder.update({ where: { id: req.params.id }, data: { status: 'COMPLETED' } });
      return created;
    });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.doctorRoles = doctorRoles;
exports.labRoles = labRoles;
exports.radiologyRoles = radiologyRoles;
