// models/MedicalHistory.js
const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },

  visitDate: { type: Date, default: Date.now },
  diagnosisSummary: { type: String },

  reports: [
    {
      report: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport", required: true }
    }
  ]
});

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
