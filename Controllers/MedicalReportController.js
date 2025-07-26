const MedicalReport = require('../Models/MedicalReport');
const { isValidId, validateReportInput } = require('../validators/medicalReportValidator');

const populateFields = 'patient doctor relatedTests';

// GET all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find().populate(populateFields);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
};

// GET report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid report ID' });

    const report = await MedicalReport.findById(id).populate(populateFields);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report', details: err.message });
  }
};

// CREATE report with full reference validation
exports.createReport = async (req, res) => {
  try {
    await validateReportInput(req.body);

    const newReport = new MedicalReport(req.body);
    await newReport.save();

    const populatedReport = await MedicalReport.findById(newReport._id).populate(populateFields);
    res.status(201).json(populatedReport);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create report', details: err.message });
  }
};

// UPDATE report with reference validation
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid report ID' });

    await validateReportInput(req.body, true); // partial = true for update

    const updated = await MedicalReport.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate(populateFields);

    if (!updated) return res.status(404).json({ error: 'Report not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update report', details: err.message });
  }
};

// DELETE report with ID check
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid report ID' });

    const deleted = await MedicalReport.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Report not found' });

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report', details: err.message });
  }
};
