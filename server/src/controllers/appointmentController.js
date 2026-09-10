const prisma = require('../utils/db');

// Standard production method
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, departmentId, date, time, reason } = req.body;
    
    const appointmentTime = date || req.body.appointmentDate;

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: patientId } },
        doctor: { connect: { id: doctorId } },
        department: { connect: { id: departmentId } }, // FIXED: Added department relation
        date: new Date(appointmentTime),
        time: time || 'TBD',
        reason
      }
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