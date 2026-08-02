const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: 'General' },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String, trim: true, default: '' },
    createdByEmail: { type: String, trim: true, default: '' },
    campus: { type: String, trim: true, default: '' },
    replies: [
      {
        body: String,
        by: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
