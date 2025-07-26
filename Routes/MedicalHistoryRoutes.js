const { auth, isAdmin, isDoctor, canDoctorEditReport } = require('../middleWares/auth');
const medicalHistoryController = require("../Controllers/MedicalHistoryController");
const express = require('express');
const router = express();

router.get('/', medicalHistoryController.getAllHistories);
router.get('/:id', (req, res, next) => {
  next();
}, medicalHistoryController.getHistoryById);

router.post('/', medicalHistoryController.createHistory); 
router.delete('/:id', medicalHistoryController.deleteHistory); 
router.put('/:id', medicalHistoryController.updateHistory); 

router.put('/:id/report', canDoctorEditReport, medicalHistoryController.updateReportInHistory);

module.exports = router;