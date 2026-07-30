const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
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

trainerSchema.pre('validate', async function(next) {
  if (this.isNew && !this.employeeId) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
      const existing = await mongoose.models.Trainer.findOne({ employeeId: candidate }).lean();
      if (!existing) {
        this.employeeId = candidate;
        break;
      }
    }
    if (!this.employeeId) {
      this.employeeId = `EMP-${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Trainer', trainerSchema);
