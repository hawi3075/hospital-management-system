const express = require('express');
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Require a valid JWT token for all routes below this line
router.use(authMiddleware.protect);

router.route('/')
  .post(
    authMiddleware.restrictTo('ADMIN', 'RECEPTIONIST'), 
    patientController.createPatient
  )
  .get(
    authMiddleware.restrictTo('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE'), 
    patientController.getAllPatients
  );

module.exports = router;