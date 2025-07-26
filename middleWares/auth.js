const jwt = require('jsonwebtoken');

const MedicalHistory = require('../Models/MedicalHistory');

exports.auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};
exports.isDoctor = (req, res, next) => {
  if (req.user.role === 'doctor') return next();
  return res.status(403).json({ message: 'Forbidden: Doctors only' });
};
exports.canDoctorEditReport = async (req, res, next) => {
  try {
    const history = await MedicalHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ message: 'Medical history not found' });

    const { reportId } = req.body;
    const targetReport = history.reports.find(
      (r) => r.report.toString() === reportId
    );

    if (!targetReport) return res.status(404).json({ message: 'Report not found in this history' });

    const MedicalReport = require('../models/MedicalReport');
    const reportDoc = await MedicalReport.findById(reportId);

    if (req.user.role === 'admin' || (req.user.role === 'doctor' && reportDoc.doctor.toString() === req.user.id)) {
      req.history = history;
      req.reportDoc = reportDoc;
      return next();
    }

    return res.status(403).json({ message: 'Forbidden: Not your report' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
