const mongoose = require('mongoose');
const MedicalTest = require('../Models/MedicalTest');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');

const populateFields = 'patient doctor';
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await MedicalTest.find().populate(populateFields);
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tests', details: err.message });
  }
};

// GET test by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid test ID' });

    const test = await MedicalTest.findById(id).populate(populateFields);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test', details: err.message });
  }
};

// CREATE test with ID validation
exports.createTest = async (req, res) => {
  try {
    const { patient, doctor } = req.body;

    if (!isValidId(patient) || !(await Patient.exists({ _id: patient }))) {
      return res.status(400).json({ error: 'Invalid or non-existing patient ID' });
    }

    if (!isValidId(doctor) || !(await Doctor.exists({ _id: doctor }))) {
      return res.status(400).json({ error: 'Invalid or non-existing doctor ID' });
    }

    const newTest = new MedicalTest(req.body);
    await newTest.save();

    const populated = await MedicalTest.findById(newTest._id).populate(populateFields);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create test', details: err.message });
  }
};

// UPDATE test with ID + ref checks
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient, doctor } = req.body;

    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid test ID' });

    if (patient && (!isValidId(patient) || !(await Patient.exists({ _id: patient })))) {
      return res.status(400).json({ error: 'Invalid or non-existing patient ID' });
    }

    if (doctor && (!isValidId(doctor) || !(await Doctor.exists({ _id: doctor })))) {
      return res.status(400).json({ error: 'Invalid or non-existing doctor ID' });
    }

    const updated = await MedicalTest.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate(populateFields);

    if (!updated) return res.status(404).json({ error: 'Test not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update test', details: err.message });
  }
};

// DELETE test with ID check
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid test ID' });

    const deleted = await MedicalTest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Test not found' });

    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete test', details: err.message });
  }
};
