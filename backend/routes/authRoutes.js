const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const { protect } = require('../middleware/auth');
const { getPermissionsForRole, LABEL_TO_MODULE, hasPermission } = require('../middleware/permissions');
const { sendLoginEmail } = require('../utils/emailService');

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

async function userPayload(user) {
  const permissions = ['superadmin', 'subadmin', 'teacher'].includes(user.role)
    ? await getPermissionsForRole(user.role)
    : {};
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    campus: user.campus,
    status: user.status,
    permissions,
  };
}

router.post('/create-password', async (req, res, next) => {
  try {
    const { role, identifier, dateOfBirth, joiningDate, password } = req.body;
    const dateValue = role === 'teacher' ? (joiningDate || dateOfBirth) : dateOfBirth;

    if (!['student', 'teacher'].includes(role) || !identifier || !dateValue || !password) {
      return res.status(400).json({
        success: false,
        message: role === 'teacher'
          ? 'Role, email, joining date and password are required'
          : 'Role, CNIC, date of birth and password are required',
      });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const dateFilter = dayRange(dateValue);
    if (!dateFilter) {
      return res.status(400).json({
        success: false,
        message: role === 'teacher' ? 'Enter a valid joining date' : 'Enter a valid date of birth',
      });
    }

    const account = role === 'student'
      ? await Student.findOne({ cnic: String(identifier).trim(), dateOfBirth: dateFilter })
      : await Trainer.findOne({ email: String(identifier).trim().toLowerCase(), joiningDate: dateFilter });

    if (!account || !account.user) {
      return res.status(401).json({ success: false, message: 'The provided details do not match an account' });
    }

    const user = await User.findById(account.user).select('+password');
    if (!user || user.role !== role) {
      return res.status(401).json({ success: false, message: 'The provided details do not match an account' });
    }

    user.password = password;
    user.status = 'Active';
    await user.save();

    res.json({ success: true, message: 'Password created successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { role, cnic, email, dateOfBirth, joiningDate, password } = req.body;

    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be student or teacher' });
    }
    if (!cnic || !email || !password) {
      return res.status(400).json({ success: false, message: 'CNIC, email and new password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const dateValue = role === 'student' ? dateOfBirth : joiningDate;
    if (!dateValue) {
      return res.status(400).json({
        success: false,
        message: role === 'student' ? 'Date of birth is required' : 'Joining date is required',
      });
    }

    const dateFilter = dayRange(dateValue);
    if (!dateFilter) {
      return res.status(400).json({
        success: false,
        message: role === 'student' ? 'Enter a valid date of birth' : 'Enter a valid joining date',
      });
    }

    const normalizedCnic = String(cnic).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const account = role === 'student'
      ? await Student.findOne({ cnic: normalizedCnic, email: normalizedEmail, dateOfBirth: dateFilter })
      : await Trainer.findOne({ cnic: normalizedCnic, email: normalizedEmail, joiningDate: dateFilter });

    if (!account || !account.user) {
      return res.status(401).json({
        success: false,
        message: 'The provided details do not match an account. Please verify the information saved by admin.',
      });
    }

    const user = await User.findById(account.user).select('+password');
    if (!user || user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'The provided details do not match an account. Please verify the information saved by admin.',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'No password has been set yet. Please use Create Password first.',
      });
    }

    user.password = password;
    user.status = 'Active';
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    next(error);
  }
});

router.post('/admin-forgot-password', async (req, res, next) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ success: false, message: 'Email, full name and new password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
      role: { $in: ['superadmin', 'subadmin'] },
    }).select('+password');

    if (!user || String(user.fullName).trim().toLowerCase() !== String(fullName).trim().toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Admin details do not match any account' });
    }

    user.password = password;
    user.status = 'Active';
    await user.save();

    res.json({ success: true, message: 'Admin password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res) => {
  res.status(403).json({ success: false, message: 'Registration is disabled. Accounts may only be created by administrators.' });
});

router.post('/login', async (req, res, next) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.id;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required' });
    }

    let user = null;
    const isEmail = String(identifier).includes('@');

    if (isEmail) {
      user = await User.findOne({ email: identifier.toLowerCase().trim() }).select('+password');
    } else {
      const student = await Student.findOne({ cnic: String(identifier).trim() });
      if (student && student.user) {
        user = await User.findById(student.user).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid identifier or password' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Password not set. Please create your password first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid identifier or password' });
    }

    const token = signToken(user);
    const payload = await userPayload(user);

    // Send login email asynchronously (don't wait for it to complete)
    sendLoginEmail(user.email, user.fullName, user.role).catch(err => {
      console.warn('Failed to send login email:', err.message);
    });

    res.json({ success: true, token, user: payload });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const payload = await userPayload(user);
    const menu = Object.keys(LABEL_TO_MODULE).filter((label) => {
      const moduleName = LABEL_TO_MODULE[label];
      return user.role === 'superadmin' || hasPermission(payload.permissions, moduleName, 'read');
    });
    res.json({ success: true, data: { ...payload, menu } });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ok = await user.comparePassword(currentPassword);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

// Test email endpoint - for admin to test email configuration
router.post('/test-email', protect, async (req, res, next) => {
  try {
    // Only allow admins to test email
    if (!['superadmin', 'subadmin'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only administrators can test email configuration' 
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const result = await sendLoginEmail(
      email,
      'Test User',
      'student'
    );

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email',
        error: result.error 
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
