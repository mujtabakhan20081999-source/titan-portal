const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedByName: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
    slotId: { type: String, trim: true, default: '' },
    course: { type: String, trim: true, default: '' },
    courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    batchName: { type: String, trim: true, default: '' },
    campus: { type: String, trim: true, default: '' },
    campusRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' },
    trainer: { type: String, trim: true, default: '' },
    schedule: { type: String, trim: true, default: '' },
    roll: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Dropout', 'Failed', 'Passed', 'Completed'],
      default: 'Pending',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, roll: 1 });
enrollmentSchema.index({ slot: 1, status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
