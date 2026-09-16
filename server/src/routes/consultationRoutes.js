const express = require('express');
const consultationController = require('../controllers/consultationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware.protect);
router.get('/', consultationController.listConsultations);
router.get('/:id', consultationController.getConsultation);
router.post('/', authMiddleware.restrictTo('ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR'), consultationController.createConsultation);

module.exports = router;
