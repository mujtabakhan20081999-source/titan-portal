const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  topics: { type: [topicSchema], default: [] },
});

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    modules: { type: [moduleSchema], default: [] },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
