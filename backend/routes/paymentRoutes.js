const express = require('express');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }
      filter.roll = student.roll;
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student || payment.roll !== student.roll) {
        return res.status(403).json({ success: false, message: 'Unauthorized to update this payment' });
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updatedPayment });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
