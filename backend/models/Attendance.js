const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentId: { type: String, required: true, trim: true },
    studentName: { type: String, trim: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    trainerName: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Late'], default: 'Present' },
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },
    remarks: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
