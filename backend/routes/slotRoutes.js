const express = require('express');
const Slot = require('../models/Slot');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const slots = await Slot.find().sort({ createdAt: -1 });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const { course, trainer, campus, days, time, seats, classType, gender, start, end, whatsapp } = req.body;
    if (!course || !campus || !days || !time || Number(seats) <= 0) {
      return res.status(400).json({ success: false, message: 'Course, campus, days, time and seats are required' });
    }

    const count = await Slot.countDocuments();
    const slotId = `SLOT-${String(count + 1).padStart(3, '0')}`;

    const slot = await Slot.create({
      slotId,
      course,
      trainer: trainer || 'Assign later',
      campus,
      days,
      time,
      seats: Number(seats),
      filled: 0,
      status: 'Open',
      classType: classType || 'Onsite',
      gender: gender || 'Mixed',
      start: start ? new Date(start) : undefined,
      end: end ? new Date(end) : undefined,
      whatsapp,
    });

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const slot = await Slot.findOneAndUpdate({ slotId: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    if (slot.filled >= slot.seats) {
      slot.status = 'Closed';
      await slot.save();
    }
    res.json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const slot = await Slot.findOneAndDelete({ slotId: req.params.id });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
