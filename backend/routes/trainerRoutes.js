const express = require('express');
const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Slot = require('../models/Slot');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');
const { applyCampusScope } = require('../utils/campusScope');

const router = express.Router();

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function generateEmployeeId() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await Trainer.findOne({ employeeId: id }).lean();
    if (!existing) return id;
  }
  return `EMP-${Date.now().toString().slice(-6)}`;
}

// @route   GET /api/trainers
router.get('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const filter = applyCampusScope(req, {});
    const trainers = await Trainer.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    next(error);
  }
});

// Logged-in teacher's own profile
router.get('/me', protect, authorize('teacher'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
});

router.put('/me', protect, authorize('teacher'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    }

    const updateData = { ...req.body };
    if (updateData.email) {
      updateData.email = String(updateData.email).trim().toLowerCase();
    }
    if (updateData.experience !== undefined) {
      updateData.experience = Number(updateData.experience) || 0;
    }
    if (updateData.socialLinks && typeof updateData.socialLinks !== 'object') {
      updateData.socialLinks = {};
    }

    await User.findByIdAndUpdate(trainer.user, {
      fullName: updateData.fullName || trainer.fullName,
      email: updateData.email || trainer.email,
    });

    const updatedTrainer = await Trainer.findByIdAndUpdate(trainer._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedTrainer });
  } catch (error) {
    next(error);
  }
});

router.get('/me/roster', protect, authorize('teacher'), async (req, res, next) => {
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

    const slotIds = slots.map((slot) => slot.slotId).filter(Boolean);
    const slotRefs = slots.map((slot) => slot._id);
    const studentFilter = {
      $or: [
        { slot: { $in: slotIds } },
        { slotRef: { $in: slotRefs } },
      ],
    };
    const students = await Student.find(studentFilter).sort({ name: 1 });

    res.json({ success: true, data: { trainer, slots, students } });
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
    const { fullName, email, campus, cnic } = req.body;
    if (!fullName || !email || !campus || !cnic) {
      return res.status(400).json({ success: false, message: 'full name, email, CNIC, and campus are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCnic = String(cnic).trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }
    if (await Trainer.findOne({ cnic: normalizedCnic })) {
      return res.status(400).json({ success: false, message: 'A trainer with this CNIC already exists' });
    }

    const employeeId = await generateEmployeeId();

    // Teachers activate via Create Password (email + joining date) or Forgot Password (CNIC + email + joining date).
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
      const payload = { ...req.body, email: normalizedEmail, cnic: normalizedCnic, employeeId, user: user._id };
      if (typeof payload.coursesTaught === 'string') {
        payload.coursesTaught = payload.coursesTaught.split(',').map((c) => c.trim()).filter(Boolean);
      }
      if (payload.hourlyRate !== undefined) payload.hourlyRate = Number(payload.hourlyRate) || 0;
      trainer = await Trainer.create(payload);
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
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const updateData = { ...req.body };
    if (updateData.email) {
      updateData.email = String(updateData.email).trim().toLowerCase();
    }
    if (typeof updateData.coursesTaught === 'string') {
      updateData.coursesTaught = updateData.coursesTaught.split(',').map((c) => c.trim()).filter(Boolean);
    }
    if (updateData.hourlyRate !== undefined) {
      updateData.hourlyRate = Number(updateData.hourlyRate) || 0;
    }
    if (updateData.cnic !== undefined) {
      updateData.cnic = String(updateData.cnic).trim();
      if (updateData.cnic) {
        const cnicTaken = await Trainer.findOne({
          cnic: updateData.cnic,
          _id: { $ne: trainer._id },
        });
        if (cnicTaken) {
          return res.status(400).json({ success: false, message: 'A trainer with this CNIC already exists' });
        }
      }
    }

    await User.findByIdAndUpdate(trainer.user, {
      fullName: updateData.fullName || trainer.fullName,
      email: updateData.email || trainer.email,
      campus: updateData.campus || trainer.campus,
    });

    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedTrainer });
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
    if (trainer.user) {
      await User.findByIdAndDelete(trainer.user);
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
