const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, trim: true },
    voucher: { type: String, required: true, unique: true, trim: true },
    paymentId: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['Registration', 'Monthly'], default: 'Monthly' },
    month: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['PAID', 'UNPAID', 'Pending'], default: 'UNPAID' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
