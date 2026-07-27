const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
});

// Logged-in student's own profile. This prevents a student portal from
// relying on placeholder data or exposing another student's record.
router.get('/me', protect, async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const { password, email, name, city, ...studentDetails } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await Student.findOne({ $or: [{ email: normalizedEmail }, { roll: studentDetails.roll }] });
    if (exists || await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ success: false, message: 'A student with this email or roll number already exists' });
    }
    const user = await User.create({ fullName: name, email: normalizedEmail, password, role: 'student', campus: city || '' });
    let student;
    try {
      student = await Student.create({ ...studentDetails, name, city, email: normalizedEmail, user: user._id });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    await User.findByIdAndDelete(student.user);
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
