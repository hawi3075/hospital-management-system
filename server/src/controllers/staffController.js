const bcrypt = require('bcrypt');
const prisma = require('../utils/db');

// Create a hospital department
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await prisma.department.create({
      data: {
        name: req.body.name,
        description: req.body.description,
      }
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// Register a Doctor (Creates User -> Employee -> Doctor in one step)
exports.createDoctor = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, departmentId, specialization, licenseNumber } = req.body;

    // 1. Ensure the DOCTOR role exists
    let role = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: 'DOCTOR' } });
    }

    // 2. Hash the doctor's login password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Prisma Nested Write Transaction
    const doctorUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: role.id,
        employee: {
          create: {
            firstName,
            lastName,
            phone,
            position: 'Senior Medical Officer',
            departmentId: departmentId,
            doctor: {
              create: {
                specialization,
                licenseNumber
              }
            }
          }
        }
      },
      // Include the related data in the response so we can see it worked
      include: { 
        employee: { 
          include: { doctor: true, department: true } 
        } 
      }
    });

    res.status(201).json({
      success: true,
      data: doctorUser
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('Email or License Number already exists.');
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};