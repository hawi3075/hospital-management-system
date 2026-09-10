const jwt = require('jsonwebtoken');
const prisma = require('../utils/db');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const err = new Error('You are not logged in. Please log in to get access.');
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!currentUser || !currentUser.isActive) {
      const err = new Error('The user belonging to this token no longer exists or is inactive.');
      err.statusCode = 401;
      return next(err);
    }

    req.user = currentUser; // Attach user to request object
    next();
  } catch (error) {
    const err = new Error('Invalid or expired token.');
    err.statusCode = 401;
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      const err = new Error('You do not have permission to perform this action.');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};