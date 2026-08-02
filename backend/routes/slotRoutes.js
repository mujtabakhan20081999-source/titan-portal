const express = require('express');
const Slot = require('../models/Slot');
const Trainer = require('../models/Trainer');
const { protect, authorize } = require('../middleware/auth');
const { applyCampusScope } = require('../utils/campusScope');

const router = express.Router();

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function resolveTrainerAssignment(trainerName, trainerId) {
  let resolvedId = trainerId || null;
  let resolvedName = trainerName ? String(trainerName).trim() : '';

  if (resolvedId) {
    const byId = await Trainer.findById(resolvedId).lean();
    if (byId) {
      return { trainer: byId.fullName, trainerId: byId._id };
    }
  }

  if (resolvedName && resolvedName !== 'Assign later') {
    const byName = await Trainer.findOne({
      fullName: new RegExp(`^${escapeRegex(resolvedName)}$`, 'i'),
    }).lean();
    if (byName) {
      return { trainer: byName.fullName, trainerId: byName._id };
    }
  }

  return {
    trainer: resolvedName || 'Assign later',
    trainerId: null,
  };
}

router.get('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const filter = applyCampusScope(req, {});
    if (req.query.status) filter.status = req.query.status;
    if (req.query.campus) filter.campus = new RegExp(req.query.campus, 'i');
    const slots = await Slot.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    next(error);
  }
});

// Logged-in teacher's assigned slots only
router.get('/mine', protect, authorize('teacher'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    }

    const namePattern = new RegExp(`^${escapeRegex(trainer.fullName)}$`, 'i');
    const slots = await Slot.find({
      $or: [
        { trainerId: trainer._id },
        { trainer: namePattern },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: slots.length, data: slots, trainer });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const { course, trainer, trainerId, campus, days, time, seats, classType, gender, start, end, whatsapp } = req.body;
    if (!course || !campus || !days || !time || Number(seats) <= 0) {
      return res.status(400).json({ success: false, message: 'Course, campus, days, time and seats are required' });
    }

    const assignment = await resolveTrainerAssignment(trainer, trainerId);
    const count = await Slot.countDocuments();
    const slotId = `SLOT-${String(count + 1).padStart(3, '0')}`;

    const slot = await Slot.create({
      slotId,
      course,
      trainer: assignment.trainer,
      trainerId: assignment.trainerId,
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
    const updateData = { ...req.body };
    if (updateData.trainer !== undefined || updateData.trainerId !== undefined) {
      const assignment = await resolveTrainerAssignment(updateData.trainer, updateData.trainerId);
      updateData.trainer = assignment.trainer;
      updateData.trainerId = assignment.trainerId;
    }

    const slot = await Slot.findOneAndUpdate({ slotId: req.params.id }, updateData, {
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
