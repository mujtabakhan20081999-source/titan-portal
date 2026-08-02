const mongoose = require('mongoose');

const trainerAttendanceCorrectionSchema = new mongoose.Schema(
  {
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerAttendance' },
    employeeId: { type: String, required: true, trim: true },
    trainerName: { type: String, trim: true, default: '' },
    campus: { type: String, trim: true, default: '' },
    date: { type: String, required: true, trim: true },
    currentCheckIn: { type: String, trim: true, default: '' },
    currentCheckOut: { type: String, trim: true, default: '' },
    proposedCheckIn: { type: String, trim: true, default: '' },
    proposedCheckOut: { type: String, trim: true, default: '' },
    proposedStatus: { type: String, trim: true, default: '' },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestedByName: { type: String, trim: true, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedByName: { type: String, trim: true, default: '' },
    reviewNote: { type: String, trim: true, default: '' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainerAttendanceCorrection', trainerAttendanceCorrectionSchema);
