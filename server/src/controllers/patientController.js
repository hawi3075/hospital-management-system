const prisma = require('../utils/db');

exports.createPatient = async (req, res, next) => {
  try {
    // Generate a unique 6-digit patient ID
    const uniquePatientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;

    const patient = await prisma.patient.create({
      data: {
        patientId: uniquePatientId,
        firstName: req.body.firstName,
        fatherName: req.body.fatherName,
        grandfatherName: req.body.grandfatherName,
        gender: req.body.gender, // Must be 'MALE', 'FEMALE', or 'OTHER' based on Prisma Enum
        dateOfBirth: new Date(req.body.dateOfBirth),
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        bloodGroup: req.body.bloodGroup, // Optional
      }
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