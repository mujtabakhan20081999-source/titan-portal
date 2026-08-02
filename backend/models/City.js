const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

citySchema.index({ name: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);
