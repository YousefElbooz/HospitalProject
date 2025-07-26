const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  reportTitle: { type: String, required: true },
  reportDate: { type: Date, default: Date.now },
  content: { type: String, required: true },
  attachmentUrl: { type: String },
  relatedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "MedicalTest" }]

});

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
