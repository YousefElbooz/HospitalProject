const mongoose = require('mongoose');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');
const MedicalTest = require('../Models/MedicalTest');
const MedicalReport = require('../Models/MedicalReport');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function validateMedicalHistoryInput(data) {
  const { patient, doctor, tests = [], reports = [] } = data;

  if (!isValidId(patient) || !(await Patient.exists({ _id: patient }))) {
    throw new Error('Invalid or non-existing patient ID');
  }

  if (!isValidId(doctor) || !(await Doctor.exists({ _id: doctor }))) {
    throw new Error('Invalid or non-existing doctor ID');
  }

  for (const testId of tests) {
    if (!isValidId(testId) || !(await MedicalTest.exists({ _id: testId }))) {
      throw new Error(`Invalid or non-existing test ID: ${testId}`);
    }
  }

  for (const { report, relatedTests = [] } of reports) {
    if (!isValidId(report) || !(await MedicalReport.exists({ _id: report }))) {
      throw new Error(`Invalid or non-existing report ID: ${report}`);
    }

    for (const testId of relatedTests) {
      if (!isValidId(testId) || !(await MedicalTest.exists({ _id: testId }))) {
        throw new Error(`Invalid or non-existing related test ID: ${testId}`);
      }
    }
  }
}

module.exports = {
  isValidId,
  validateMedicalHistoryInput
};
