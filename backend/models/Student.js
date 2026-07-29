const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    roll: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    father: { type: String, trim: true },
    cnic: { type: String, unique: true, sparse: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    city: { type: String, trim: true },
    course: { type: String, trim: true },
    meta: { type: String, trim: true },
    status: { type: String, enum: ['Enrolled', 'Completed', 'Dropped'], default: 'Enrolled' },
    pay: { type: String, enum: ['Paid', 'Pending', 'Not Generated'], default: 'Not Generated' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
