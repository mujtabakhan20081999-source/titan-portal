const mongoose = require('mongoose');

const trainerAttendanceSchema = new mongoose.Schema(
  {
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    employeeId: { type: String, required: true, trim: true },
    trainerName: { type: String, trim: true, default: '' },
    campus: { type: String, trim: true, default: '' },
    date: { type: String, required: true, trim: true }, // YYYY-MM-DD
    checkIn: { type: String, trim: true, default: '' },
    checkOut: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Incomplete'],
      default: 'Incomplete',
    },
    remarks: { type: String, trim: true, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    markedByName: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

trainerAttendanceSchema.index({ trainer: 1, date: 1 }, { unique: true });
trainerAttendanceSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model('TrainerAttendance', trainerAttendanceSchema);
