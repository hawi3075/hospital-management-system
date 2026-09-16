const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Secure all appointment routes
router.use(authMiddleware.protect);

router.get('/', appointmentController.getAppointments);
router.patch('/:id/status', authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE'), appointmentController.updateAppointmentStatus);
router.post('/:id/check-in', authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'), appointmentController.checkInAppointment);

// Endpoint for our automated test
router.post('/test-schedule', 
  authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'), 
  appointmentController.scheduleTestAppointment
);

// Standard endpoint for the React frontend to use later
router.post('/', 
  authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST', 'PATIENT'), 
  appointmentController.createAppointment
);

module.exports = router;