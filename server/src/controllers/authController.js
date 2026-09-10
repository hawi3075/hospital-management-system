const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/db');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, roleName } = req.body;

    // Auto-create role if it doesn't exist (useful for setup)
    const roleTarget = roleName || 'PATIENT';
    let role = await prisma.role.findUnique({ where: { name: roleTarget } });
    
    if (!role) {
      role = await prisma.role.create({ data: { name: roleTarget } });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: role.id,
      },
      include: { role: true },
    });

    const token = signToken(user.id);

    res.status(201).json({
      success: true,
      token,
      data: { id: user.id, email: user.email, role: user.role.name },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('Email already exists.');
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Please provide email and password.');
      err.statusCode = 400;
      return next(err);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      const err = new Error('Incorrect email or password.');
      err.statusCode = 401;
      return next(err);
    }

    if (!user.isActive) {
      const err = new Error('Your account has been deactivated.');
      err.statusCode = 401;
      return next(err);
    }

    const token = signToken(user.id);

    res.status(200).json({
      success: true,
      token,
      data: { id: user.id, email: user.email, role: user.role.name },
    });
  } catch (error) {
    next(error);
  }
};