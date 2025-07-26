const mongoose = require('mongoose');
const Patient = require('../Models/Patient');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients', details: err.message });
  }
};

// GET patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid patient ID' });

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving patient', details: err.message });
  }
};

// CREATE new patient with unique email check
exports.createPatient = async (req, res) => {
  try {
    const existing = await Patient.findOne({ email: req.body.email?.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email is already registered' });

    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create patient', details: err.message });
  }
};

// UPDATE patient with ID validation
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid patient ID' });

    const existing = await Patient.findById(id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });

    const updated = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update patient', details: err.message });
  }
};

// DELETE patient with ID validation
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid patient ID' });

    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient', details: err.message });
  }
};
