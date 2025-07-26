const mongoose = require('mongoose');
const Doctor = require('../Models/Doctor');

// Validate ObjectId helper
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: err.message });
  }
};

// Get doctor by ID with validation
exports.getDoctorById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving doctor', details: err.message });
  }
};

// Create new doctor (prevent duplicate email)
exports.createDoctor = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findOne({ email: req.body.email?.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email is already in use by another doctor' });
    }

    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create doctor', details: err.message });
  }
};

// Update doctor with ID validation
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const updated = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update doctor', details: err.message });
  }
};

// Delete doctor with ID validation
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    await Doctor.findByIdAndDelete(id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor', details: err.message });
  }
};
