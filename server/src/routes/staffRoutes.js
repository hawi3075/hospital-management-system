const express = require('express');
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Only Super Admins can create departments and hire doctors
router.use(authMiddleware.protect);

router.get('/departments', authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'TRIAGE_NURSE', 'CHARGE_NURSE', 'STAFF_NURSE', 'PATIENT'), staffController.getDepartments);
router.get('/doctors', authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'TRIAGE_NURSE', 'CHARGE_NURSE', 'STAFF_NURSE', 'PATIENT'), staffController.getDoctors);

router.use(authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN'));

router.post('/departments', staffController.createDepartment);
router.post('/doctors', staffController.createDoctor);

module.exports = router;