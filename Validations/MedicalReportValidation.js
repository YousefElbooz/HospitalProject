const mongoose = require('mongoose');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');
const MedicalTest = require('../Models/MedicalTest');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function validateReportInput(data, partial = false) {
  const { patient, doctor, relatedTests = [] } = data;

  if (!partial || patient) {
    if (!isValidId(patient) || !(await Patient.exists({ _id: patient }))) {
      throw new Error('Invalid or non-existing patient ID');
    }
  }

  if (!partial || doctor) {
    if (!isValidId(doctor) || !(await Doctor.exists({ _id: doctor }))) {
      throw new Error('Invalid or non-existing doctor ID');
    }
  }

  if (Array.isArray(relatedTests)) {
    for (const testId of relatedTests) {
      if (!isValidId(testId) || !(await MedicalTest.exists({ _id: testId }))) {
        throw new Error(`Invalid or non-existing related test ID: ${testId}`);
      }
    }
  }
}

module.exports = {
  isValidId,
  validateReportInput
};
