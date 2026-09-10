const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hospital Management System API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', require('./authRoutes'));
router.use('/patients', require('./patientRoutes'));
router.use('/staff', require('./staffRoutes'));
router.use('/appointments', require('./appointmentRoutes')); // <-- NEW

module.exports = router;