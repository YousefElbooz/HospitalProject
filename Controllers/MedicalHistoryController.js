const mongoose = require('mongoose');
const MedicalHistory = require('../Models/MedicalHistory');
const MedicalReport = require('../Models/MedicalReport');

const {
  isValidId,
  validateMedicalHistoryInput
} = require('../validators/medicalHistoryValidator');

const populateFields = 'patient doctor reports.report reports.report.relatedTests';

// GET all medical histories
exports.getAllHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.find().populate(populateFields);
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medical histories', details: err.message });
  }
};

// GET a single medical history by ID
exports.getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid history ID' });

    const history = await MedicalHistory.findById(id).populate(populateFields);
    if (!history) return res.status(404).json({ error: 'Medical history not found' });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving medical history', details: err.message });
  }
};

// CREATE a new medical history
exports.createHistory = async (req, res) => {
  try {
    await validateMedicalHistoryInput(req.body);

    const newHistory = new MedicalHistory(req.body);
    await newHistory.save();

    const populated = await MedicalHistory.findById(newHistory._id).populate(populateFields);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create medical history', details: err.message });
  }
};

// UPDATE an existing medical history
exports.updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid history ID' });

    const existing = await MedicalHistory.findById(id);
    if (!existing) return res.status(404).json({ error: 'Medical history not found' });

    const updated = await MedicalHistory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate(populateFields);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update medical history', details: err.message });
  }
};

// DELETE a medical history
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid history ID' });

    const deleted = await MedicalHistory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Medical history not found' });

    res.json({ message: 'Medical history deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete medical history', details: err.message });
  }
};

// UPDATE a specific report inside a medical history
exports.updateReportInHistory = async (req, res) => {
  const { reportId, updateData } = req.body;
  try {
    if (!req.reportDoc) {
      return res.status(400).json({ error: 'No report loaded from middleware' });
    }

    Object.assign(req.reportDoc, updateData);
    await req.reportDoc.save();

    const updatedHistory = await MedicalHistory.findById(req.history._id).populate(populateFields);
    res.json({ message: 'Report updated successfully', history: updatedHistory });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update report', details: err.message });
  }
};
