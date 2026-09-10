const express = require('express');
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Only Super Admins can create departments and hire doctors
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('ADMIN'));

router.post('/departments', staffController.createDepartment);
router.post('/doctors', staffController.createDoctor);

module.exports = router;