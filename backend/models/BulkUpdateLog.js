const mongoose = require('mongoose');

const bulkUpdateLogSchema = new mongoose.Schema(
  {
    rolls: [{ type: String, trim: true }],
    updatedRolls: [{ type: String, trim: true }],
    missingRolls: [{ type: String, trim: true }],
    status: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: '' },
    campus: { type: String, trim: true, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BulkUpdateLog', bulkUpdateLogSchema);
