const mongoose = require('mongoose');

const changeHistorySchema = new mongoose.Schema(
  {
    field: { type: String, default: 'record' },
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    note: { type: String, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedByName: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    roll: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    father: { type: String, trim: true, default: '' },
    fatherCnic: { type: String, trim: true, default: '' },
    fatherPhone: { type: String, trim: true, default: '' },
    cnic: { type: String, unique: true, sparse: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    address: { type: String, trim: true, default: '' },
    lastQualification: { type: String, trim: true, default: '' },
    computerLevel: { type: String, trim: true, default: '' },
    laptop: { type: String, enum: ['Yes', 'No', ''], default: '' },
    photoUrl: { type: String, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    country: { type: String, trim: true, default: 'Pakistan' },
    countryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    city: { type: String, trim: true, default: '' },
    cityRef: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    campus: { type: String, trim: true, default: '' },
    campusRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' },
    course: { type: String, trim: true, default: '' },
    courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    batch: { type: String, trim: true, default: '' },
    batchRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    slot: { type: String, trim: true, default: '' },
    slotRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
    meta: { type: String, trim: true, default: '' },
    sponsorship: { type: String, trim: true, default: '' },
    year: { type: Number, default: () => new Date().getFullYear() },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Completed', 'Dropped', 'Passed', 'Failed', 'Frozen'],
      default: 'Pending',
    },
    pay: {
      type: String,
      enum: ['Paid', 'Pending', 'Not Generated'],
      default: 'Pending',
    },
    changeHistory: { type: [changeHistorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
