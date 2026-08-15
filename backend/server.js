require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testEmailConfiguration } = require('./utils/emailService');

const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const slotRoutes = require('./routes/slotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const masterRoutes = require('./routes/masterRoutes');
const trainerAttendanceRoutes = require('./routes/trainerAttendanceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Test email configuration
testEmailConfiguration().then(result => {
  if (result.success) {
    console.log('📧 ' + result.message);
  } else {
    console.warn('⚠️ Email configuration warning:', result.error);
  }
});

// Core middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route — confirms server + DB connection are alive
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    server: 'running',
    database: states[mongoose.connection.readyState] || 'unknown',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerAttendanceRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/master', masterRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TITAN Backend server running on port ${PORT}`);
});

// Prevent the process from silently dying on unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
