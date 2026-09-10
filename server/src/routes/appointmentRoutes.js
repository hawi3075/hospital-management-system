const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Secure all appointment routes
router.use(authMiddleware.protect);

// Endpoint for our automated test
router.post('/test-schedule', 
  authMiddleware.restrictTo('ADMIN', 'RECEPTIONIST'), 
  appointmentController.scheduleTestAppointment
);

// Standard endpoint for the React frontend to use later
router.post('/', 
  authMiddleware.restrictTo('ADMIN', 'RECEPTIONIST'), 
  appointmentController.createAppointment
);

module.exports = router;