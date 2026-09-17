const express = require('express');
const controller = require('../controllers/clinicalWorkflowController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.use(auth.protect);
router.get('/lab-tests', controller.listLabTests);
router.get('/medicines', controller.listMedicines);
router.post('/lab-orders', auth.restrictTo(...controller.doctorRoles), controller.createLabOrder);
router.post('/radiology-orders', auth.restrictTo(...controller.doctorRoles), controller.createRadiologyOrder);
router.post('/prescriptions', auth.restrictTo(...controller.doctorRoles), controller.createPrescription);
router.patch('/lab-orders/:id/result', auth.restrictTo(...controller.labRoles), controller.completeLabOrder);
router.patch('/radiology-orders/:id/report', auth.restrictTo(...controller.radiologyRoles), controller.completeRadiologyOrder);

module.exports = router;
