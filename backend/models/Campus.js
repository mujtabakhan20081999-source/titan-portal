const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    address: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

campusSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Campus', campusSchema);
