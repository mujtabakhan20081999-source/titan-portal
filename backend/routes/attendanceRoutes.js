const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      const records = await Attendance.find({ studentId: student.roll }).sort({ date: -1 });
      return res.json({ success: true, count: records.length, data: records });
    }

    const records = await Attendance.find().sort({ date: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const { studentId, studentName, trainer, trainerName, date, status, checkIn, checkOut, remarks } = req.body;
    if (!studentId || !status) {
      return res.status(400).json({ success: false, message: 'studentId and status are required' });
    }

    const student = await Student.findOne({ roll: String(studentId).trim() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found for the given studentId' });
    }

    const record = await Attendance.create({
      student: student._id,
      studentId: student.roll,
      studentName: student.name,
      trainer,
      trainerName,
      date,
      status,
      checkIn,
      checkOut,
      remarks,
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
