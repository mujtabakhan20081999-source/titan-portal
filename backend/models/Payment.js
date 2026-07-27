const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, trim: true },
    voucher: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['PAID', 'UNPAID'], default: 'UNPAID' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
