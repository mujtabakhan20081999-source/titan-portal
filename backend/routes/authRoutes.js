const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function dayRange(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  const nextDay = new Date(date);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  return { $gte: date, $lt: nextDay };
}

// @route   POST /api/auth/create-password
// A student verifies their roll number + DOB; a teacher verifies email + DOB.
router.post('/create-password', async (req, res, next) => {
  try {
    const { role, identifier, dateOfBirth, password } = req.body;
    if (!['student', 'teacher'].includes(role) || !identifier || !dateOfBirth || !password) {
      return res.status(400).json({ success: false, message: 'Role, identifier, date of birth and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const dob = dayRange(dateOfBirth);
    if (!dob) {
      return res.status(400).json({ success: false, message: 'Enter a valid date of birth' });
    }

    const account = role === 'student'
      ? await Student.findOne({ roll: String(identifier).trim(), dateOfBirth: dob })
      : await Trainer.findOne({ email: String(identifier).trim().toLowerCase(), dateOfBirth: dob });

    if (!account || !account.user) {
      return res.status(401).json({ success: false, message: 'The provided details do not match an account' });
    }

    const user = await User.findById(account.user).select('+password');
    if (!user || user.role !== role) {
      return res.status(401).json({ success: false, message: 'The provided details do not match an account' });
    }

    user.password = password;
    await user.save();
    res.json({ success: true, message: 'Password created successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, role, campus } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'fullName, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Public registration must never be able to mint an admin account. Admins
    // create student accounts through POST /api/students instead.
    const user = await User.create({ fullName, email, password, role: 'student', campus });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        campus: user.campus,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        campus: user.campus,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
