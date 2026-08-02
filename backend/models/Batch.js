const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' },
    year: { type: Number, default: () => new Date().getFullYear() },
    status: { type: String, enum: ['Active', 'Inactive', 'Completed'], default: 'Active' },
  },
  { timestamps: true }
);

batchSchema.index({ name: 1, course: 1, campus: 1 }, { unique: true });

module.exports = mongoose.model('Batch', batchSchema);
