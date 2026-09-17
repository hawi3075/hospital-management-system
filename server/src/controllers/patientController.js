const prisma = require('../utils/db');

exports.createPatient = async (req, res, next) => {
  try {
    // Generate a unique 6-digit patient ID
    const uniquePatientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;

    const patient = await prisma.$transaction(async (transaction) => {
      const createdPatient = await transaction.patient.create({
        data: {
          patientId: uniquePatientId,
          firstName: req.body.firstName,
          fatherName: req.body.fatherName,
          grandfatherName: req.body.grandfatherName,
          gender: req.body.gender,
          dateOfBirth: new Date(req.body.dateOfBirth),
          phone: req.body.phone,
          email: req.body.email,
          address: req.body.address,
          bloodGroup: req.body.bloodGroup,
        }
      });

      // Registration is the first clinical handoff: create a same-day intake item.
      const doctor = await transaction.doctor.findFirst({ include: { employee: true } });
      const department = doctor?.employee?.departmentId
        ? await transaction.department.findUnique({ where: { id: doctor.employee.departmentId } })
        : await transaction.department.findFirst();
      if (!doctor || !department) return createdPatient;

      const now = new Date();
      const queueDate = new Date(now); queueDate.setHours(0, 0, 0, 0);
      const last = await transaction.queueEntry.findFirst({ where: { queueDate }, orderBy: { token: 'desc' } });
      const appointment = await transaction.appointment.create({
        data: {
          patientId: createdPatient.id,
          doctorId: doctor.id,
          departmentId: department.id,
          date: now,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: req.body.chiefComplaint || 'New patient registration',
          status: 'WAITING',
        },
      });
      await transaction.queueEntry.create({ data: { appointmentId: appointment.id, queueDate, token: (last?.token || 0) + 1 } });
      return transaction.patient.findUnique({ where: { id: createdPatient.id }, include: { appointments: { include: { queueEntry: true } } } });
    });

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        contacts: true,
        appointments: { orderBy: { date: 'desc' }, take: 10 },
        consultations: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!patient) {
      const err = new Error('Patient not found.');
      err.statusCode = 404;
      return next(err);
    }

    if (req.user.role.name === 'PATIENT' && patient.userId !== req.user.id) {
      const err = new Error('You can only access your own patient record.');
      err.statusCode = 403;
      return next(err);
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};