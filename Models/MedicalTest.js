// models/MedicalTest.js
const mongoose = require("mongoose");

const medicalTestSchema = new mongoose.Schema({
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor:   { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  testType: { type: String, required: true },
  date:     { type: Date, default: Date.now },
  result:   { type: String },
  notes:    { type: String }
});

module.exports = mongoose.model("MedicalTest", medicalTestSchema);
