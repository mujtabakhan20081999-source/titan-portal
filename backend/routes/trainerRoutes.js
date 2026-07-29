const express = require('express');
const Trainer = require('../models/Trainer');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trainers
router.get('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/trainers/:id
router.get('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/trainers
router.post('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const { fullName, email, campus, dateOfBirth } = req.body;
    if (!fullName || !email || !campus || !dateOfBirth) {
      return res.status(400).json({ success: false, message: 'full name, email, campus and date of birth are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    // Teachers activate their account through Create Password after DOB verification.
    const temporaryPassword = require('crypto').randomBytes(24).toString('hex');
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: temporaryPassword,
      role: 'teacher',
      campus,
    });

    let trainer;
    try {
      trainer = await Trainer.create({ ...req.body, email: normalizedEmail, user: user._id });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/trainers/:id
router.put('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/trainers/:id
router.delete('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
