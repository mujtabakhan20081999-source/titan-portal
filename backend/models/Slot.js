const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    slotId: { type: String, required: true, unique: true, trim: true },
    course: { type: String, required: true, trim: true },
    trainer: { type: String, trim: true, default: 'Assign later' },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
    campus: { type: String, required: true, trim: true },
    days: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    seats: { type: Number, required: true, default: 0, min: 0 },
    filled: { type: Number, required: true, default: 0, min: 0 },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    classType: { type: String, trim: true, default: 'Onsite' },
    gender: { type: String, trim: true, default: 'Mixed' },
    start: { type: Date },
    end: { type: Date },
    whatsapp: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
