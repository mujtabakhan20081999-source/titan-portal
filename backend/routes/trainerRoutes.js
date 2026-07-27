const express = require('express');
const Trainer = require('../models/Trainer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trainers
router.get('/', protect, async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/trainers/:id
router.get('/:id', protect, async (req, res, next) => {
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
router.post('/', protect, async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/trainers/:id
router.put('/:id', protect, async (req, res, next) => {
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
router.delete('/:id', protect, async (req, res, next) => {
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
