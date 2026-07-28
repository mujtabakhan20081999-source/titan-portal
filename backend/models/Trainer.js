const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    campus: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },
    joiningDate: { type: Date },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    qualification: { type: String, trim: true },
    experience: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    address: { type: String, trim: true },
    profilePictureUrl: { type: String, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
