const express = require('express');
require('dotenv').config();
const connectDB = require('./Connections/db');

// Import Routes
const MedicalHistoryRouter = require('./Routes/MedicalHistoryRoutes');
const MedicalReportRouter = require('./Routes/MedicalReportRoutes');
const MedicalTestRouter = require('./Routes/MedicalTestsRoutes');
const PatientRouter = require('./Routes/PatientsRoutes');
const DoctorRouter = require('./Routes/DoctorRoutes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/medical-history', MedicalHistoryRouter);
app.use('/api/reports', MedicalReportRouter);
app.use('/api/tests', MedicalTestRouter);
app.use('/api/doctors', DoctorRouter);
app.use('/api/patients', PatientRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
