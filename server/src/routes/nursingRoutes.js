const express = require('express');
const controller = require('../controllers/nursingController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth.protect);
router.get('/triage', auth.restrictTo(...controller.nursingRoles), controller.getTriageQueue);
router.get('/doctor-queue', auth.restrictTo('DOCTOR'), controller.getDoctorQueue);
router.patch('/triage/:id', auth.restrictTo('TRIAGE_NURSE', 'CHARGE_NURSE', 'NURSE', 'ER_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'), controller.updateTriage);
router.get('/doctors', auth.restrictTo('TRIAGE_NURSE', 'CHARGE_NURSE', 'NURSE', 'ER_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'), controller.getDoctors);
router.get('/rooms', auth.restrictTo(...controller.nursingRoles), controller.getRooms);
router.get('/nurses', auth.restrictTo('CHARGE_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'), controller.getNurses);
router.post('/rooms/:roomId/assign', auth.restrictTo('CHARGE_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'), controller.assignPatientToRoom);
router.patch('/rooms/:roomId/status', auth.restrictTo('HOSPITAL_ADMIN', 'SUPER_ADMIN', 'ADMIN'), controller.updateRoomStatus);

module.exports = router;