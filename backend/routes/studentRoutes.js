const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
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

router.get('/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
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
    const { email, name, city, cnic, ...studentDetails } = req.body;
    if (!name || !studentDetails.roll || !studentDetails.dateOfBirth) {
      return res.status(400).json({ success: false, message: 'name, roll number and date of birth are required' });
    }

    const roll = String(studentDetails.roll).trim();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedCnic = cnic ? String(cnic).trim() : null;

    const existingStudent = await Student.findOne({
      $or: [
        { roll },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedCnic ? [{ cnic: normalizedCnic }] : []),
      ],
    });

    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'A student with this roll, email, or CNIC already exists' });
    }

    const userPayload = { fullName: name, role: 'student', campus: city || '' };
    if (normalizedEmail) userPayload.email = normalizedEmail;

    const user = await User.create(userPayload);

    let student;
    try {
      student = await Student.create({
        ...studentDetails,
        roll,
        name,
        city,
        email: normalizedEmail,
        cnic: normalizedCnic,
        user: user._id,
      });
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
