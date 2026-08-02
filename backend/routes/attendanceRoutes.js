const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const { protect, authorize } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();

function startOfDay(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value) {
  const date = startOfDay(value);
  if (!date) return null;
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

async function paymentWarningForStudent(student) {
  const unpaid = await Payment.countDocuments({
    $or: [{ student: student._id }, { roll: student.roll }],
    status: { $in: ['UNPAID', 'Pending'] },
  });
  return {
    unpaid,
    warning: unpaid > 0 || student.pay === 'Pending' || student.pay === 'Not Generated',
    payStatus: student.pay,
  };
}

router.get('/', protect, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      const records = await Attendance.find({ student: student._id }).sort({ date: -1 });
      return res.json({ success: true, count: records.length, data: records });
    }

    const filter = {};
    if (req.query.roll) filter.studentId = String(req.query.roll).trim();
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = startOfDay(req.query.from);
      if (req.query.to) filter.date.$lte = endOfDay(req.query.to);
    }

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
});

router.get('/lookup/:roll', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const roll = String(req.params.roll).trim();
    const student = await Student.findOne({
      $or: [
        { roll: new RegExp(`^${roll}$`, 'i') },
        { name: new RegExp(roll, 'i') },
      ],
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const payment = await paymentWarningForStudent(student);
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const alreadyMarked = await Attendance.findOne({
      student: student._id,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    res.json({
      success: true,
      data: {
        student,
        payment,
        alreadyMarked: Boolean(alreadyMarked),
        todayRecord: alreadyMarked,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/summary/:roll', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ roll: String(req.params.roll).trim() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const records = await Attendance.find({ student: student._id }).sort({ date: -1 });
    const totals = { Present: 0, Leave: 0, Absent: 0, Late: 0 };
    records.forEach((r) => {
      if (totals[r.status] !== undefined) totals[r.status] += 1;
    });
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    const percent = total ? Math.round((totals.Present / total) * 100) : 0;

    const month = req.query.month; // YYYY-MM
    let calendar = records;
    if (month) {
      const [y, m] = month.split('-').map(Number);
      calendar = records.filter((r) => {
        const d = new Date(r.date);
        return d.getFullYear() === y && d.getMonth() + 1 === m;
      });
    }

    res.json({
      success: true,
      data: {
        student,
        totals,
        percent,
        total,
        records: calendar,
        allRecords: records,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  // Teachers mark class attendance; admins also use permission-aware checks below when role is admin.
  if (req.user.role === 'superadmin' || req.user.role === 'subadmin') {
    return requirePermission('Attendance', 'write')(req, res, () => markAttendance(req, res, next));
  }
  return markAttendance(req, res, next);
});

async function markAttendance(req, res, next) {
  try {
    const { studentId, status, checkIn, checkOut, remarks, date, slotId, force } = req.body;
    if (!studentId || !status) {
      return res.status(400).json({ success: false, message: 'studentId and status are required' });
    }

    const student = await Student.findOne({ roll: String(studentId).trim() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found for the given studentId' });
    }

    const markDate = startOfDay(date || new Date());
    const markEnd = endOfDay(date || new Date());
    const existing = await Attendance.findOne({
      student: student._id,
      date: { $gte: markDate, $lte: markEnd },
      ...(slotId ? { slotId } : {}),
    });

    if (existing && !force) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already marked for this student in this class/day',
        data: existing,
        duplicate: true,
      });
    }

    const payment = await paymentWarningForStudent(student);

    let record;
    if (existing && force) {
      existing.status = status;
      existing.checkIn = checkIn || existing.checkIn;
      existing.checkOut = checkOut || existing.checkOut;
      existing.remarks = remarks || existing.remarks;
      existing.markedBy = req.user.id;
      existing.markedByName = req.user.email || '';
      await existing.save();
      record = existing;
    } else {
      record = await Attendance.create({
        student: student._id,
        studentId: student.roll,
        studentName: student.name,
        date: markDate,
        status,
        checkIn,
        checkOut,
        remarks,
        slotId: slotId || student.slot || '',
        markedBy: req.user.id,
        markedByName: req.user.email || '',
      });
    }

    res.status(201).json({
      success: true,
      data: record,
      paymentWarning: payment.warning,
      payment,
    });
  } catch (error) {
    next(error);
  }
}

router.post('/multi', protect, authorize('superadmin', 'subadmin', 'teacher'), async (req, res, next) => {
  try {
    if (req.user.role === 'superadmin' || req.user.role === 'subadmin') {
      const { getPermissionsForRole, hasPermission } = require('../middleware/permissions');
      if (req.user.role !== 'superadmin') {
        const permissions = await getPermissionsForRole(req.user.role);
        if (!hasPermission(permissions, 'Attendance', 'write')) {
          return res.status(403).json({ success: false, message: 'Forbidden: missing write permission on Attendance' });
        }
      }
    }

    const { date, rolls, status = 'Present' } = req.body;
    if (!rolls) {
      return res.status(400).json({ success: false, message: 'rolls are required (comma-separated)' });
    }

    const rollList = String(rolls)
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const markDate = startOfDay(date || new Date());
    const markEnd = endOfDay(date || new Date());
    const results = { marked: [], skipped: [], notFound: [], unpaidWarnings: [] };

    for (const roll of rollList) {
      const student = await Student.findOne({ roll });
      if (!student) {
        results.notFound.push(roll);
        continue;
      }

      const existing = await Attendance.findOne({
        student: student._id,
        date: { $gte: markDate, $lte: markEnd },
      });
      if (existing) {
        results.skipped.push({ roll, reason: 'Already marked', record: existing });
        continue;
      }

      const payment = await paymentWarningForStudent(student);
      const record = await Attendance.create({
        student: student._id,
        studentId: student.roll,
        studentName: student.name,
        date: markDate,
        status,
        checkIn: status === 'Present' || status === 'Late' ? new Date().toLocaleTimeString() : null,
        remarks: 'Multi attendance',
        slotId: student.slot || '',
        markedBy: req.user.id,
        markedByName: req.user.email || '',
      });

      results.marked.push(record);
      if (payment.warning) results.unpaidWarnings.push({ roll, payStatus: payment.payStatus });
    }

    res.status(201).json({ success: true, data: results });
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
