const express = require('express');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Slot = require('../models/Slot');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');
const SystemSettings = require('../models/SystemSettings');
const SupportTicket = require('../models/SupportTicket');
const BulkUpdateLog = require('../models/BulkUpdateLog');
const { protect, authorize } = require('../middleware/auth');
const {
  ensureDefaultPermissions,
  DEFAULT_PERMISSIONS,
  getPermissionsForRole,
  requirePermission,
} = require('../middleware/permissions');
const { writeAuditLog } = require('../utils/auditLogger');
const { studentCampusFilter } = require('../utils/campusScope');

const router = express.Router();

const CITY_LIST = ['Sukkur', 'Karachi'];
const CITY_REGEX = (city) => new RegExp(`^${city}( Campus)?$`, 'i');

async function getOrCreateSettings() {
  let doc = await SystemSettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await SystemSettings.create({ key: 'default' });
  }
  return doc;
}

router.get('/permissions', protect, authorize('superadmin'), async (req, res, next) => {
  try {
    await ensureDefaultPermissions();
    const docs = await Permission.find();
    const data = docs.reduce((acc, doc) => {
      acc[doc.role] = doc.permissions;
      return acc;
    }, {});
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/my-permissions', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const permissions = await getPermissionsForRole(req.user.role);
    res.json({ success: true, data: { role: req.user.role, permissions, campus: req.user.campus || '' } });
  } catch (error) {
    next(error);
  }
});

router.post('/permissions', protect, authorize('superadmin'), async (req, res, next) => {
  try {
    const { permissions } = req.body;
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({ success: false, message: 'Permissions payload is required' });
    }

    const updated = {};
    await Promise.all(
      Object.entries(permissions).map(async ([role, rolePermissions]) => {
        if (!DEFAULT_PERMISSIONS[role]) {
          throw new Error(`Unsupported role: ${role}`);
        }

        const permissionDoc = await Permission.findOneAndUpdate(
          { role },
          { permissions: rolePermissions },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        updated[role] = permissionDoc.permissions;
      })
    );

    await writeAuditLog({
      req,
      action: 'update',
      label: 'Permissions Updated',
      module: 'Settings',
      details: 'Role permissions updated',
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.get('/city-stats', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const stats = await Promise.all(
      CITY_LIST.map(async (city) => {
        const regex = CITY_REGEX(city);
        const studentCount = await Student.countDocuments({ city });
        const enrolledCount = await Student.countDocuments({ city, status: 'Enrolled' });
        const uniqueCourses = await Student.distinct('course', { city });
        const trainerCampuses = await Trainer.distinct('campus', { campus: regex });
        const slotCampuses = await Slot.distinct('campus', { campus: regex });
        const trainerCount = await Trainer.countDocuments({ campus: regex });
        const slotCount = await Slot.countDocuments({ campus: regex });
        const regOpenCount = await Slot.countDocuments({ campus: regex, status: 'Open' });

        const campusNames = new Set([...trainerCampuses, ...slotCampuses].filter(Boolean));
        return {
          city,
          campus: `${city} Campus`,
          students: studentCount,
          enrolled: enrolledCount,
          courses: uniqueCourses.filter(Boolean).length,
          trainers: trainerCount,
          slots: slotCount,
          regOpen: regOpenCount,
          campuses: campusNames.size,
        };
      })
    );

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Dashboard aggregates with sort + paging for campus/course charts
router.get('/dashboard', protect, authorize('superadmin', 'subadmin'), requirePermission('Dashboard', 'read'), async (req, res, next) => {
  try {
    const base = studentCampusFilter(req, {});
    const sortDir = String(req.query.sort || 'desc').toLowerCase() === 'asc' ? 1 : -1;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const chart = String(req.query.chart || 'campus'); // campus | course

    const [students, enrolled, trainers, slots, regOpen, paymentsPaid, paymentsUnpaid] = await Promise.all([
      Student.countDocuments(base),
      Student.countDocuments({ ...base, status: 'Enrolled' }),
      Trainer.countDocuments(req.user.role === 'subadmin' && req.user.campus
        ? { campus: CITY_REGEX(String(req.user.campus).replace(/\s*Campus$/i, '')) }
        : {}),
      Slot.countDocuments(req.user.role === 'subadmin' && req.user.campus
        ? { campus: CITY_REGEX(String(req.user.campus).replace(/\s*Campus$/i, '')) }
        : {}),
      Slot.countDocuments({
        status: 'Open',
        ...(req.user.role === 'subadmin' && req.user.campus
          ? { campus: CITY_REGEX(String(req.user.campus).replace(/\s*Campus$/i, '')) }
          : {}),
      }),
      Payment.countDocuments({ status: 'PAID' }),
      Payment.countDocuments({ status: 'UNPAID' }),
    ]);

    const groupField = chart === 'course' ? '$course' : '$city';
    const grouped = await Student.aggregate([
      { $match: base },
      {
        $group: {
          _id: { $ifNull: [groupField, 'Unassigned'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: sortDir, _id: 1 } },
    ]);

    const totalGroups = grouped.length;
    const start = (page - 1) * limit;
    const pageRows = grouped.slice(start, start + limit).map((row) => ({
      label: row._id || 'Unassigned',
      value: row.count,
    }));

    const cities = await Student.distinct('city', base);
    const campuses = await Student.distinct('campus', base);
    const courses = await Student.distinct('course', base);

    res.json({
      success: true,
      data: {
        stats: {
          students,
          enrolled,
          courses: courses.filter(Boolean).length,
          cities: cities.filter(Boolean).length,
          campuses: campuses.filter(Boolean).length || cities.filter(Boolean).length,
          trainers,
          slots,
          regOpen,
          paymentsPaid,
          paymentsUnpaid,
        },
        chart: {
          type: chart,
          sort: sortDir === 1 ? 'asc' : 'desc',
          page,
          limit,
          total: totalGroups,
          totalPages: Math.max(1, Math.ceil(totalGroups / limit)),
          rows: pageRows,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Real reports
router.get('/reports', protect, authorize('superadmin', 'subadmin'), requirePermission('Reports', 'read'), async (req, res, next) => {
  try {
    const campus = req.query.campus || '';
    const type = req.query.type || 'Enrollment Summary';
    const base = studentCampusFilter(req, campus ? { city: new RegExp(`^${String(campus).replace(/\s*Campus$/i, '')}$`, 'i') } : {});

    const [total, approved, pending, enrolled, passed, failed] = await Promise.all([
      Student.countDocuments(base),
      Student.countDocuments({ ...base, status: 'Approved' }),
      Student.countDocuments({ ...base, status: 'Pending' }),
      Student.countDocuments({ ...base, status: 'Enrolled' }),
      Student.countDocuments({ ...base, status: 'Passed' }),
      Student.countDocuments({ ...base, status: 'Failed' }),
    ]);

    const attendanceTotal = await Attendance.countDocuments({});
    const attendancePresent = await Attendance.countDocuments({ status: 'Present' });
    const payments = await Payment.find({}).sort({ createdAt: -1 }).limit(500);
    const paidAmount = payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + (p.amount || 0), 0);
    const unpaidAmount = payments.filter((p) => p.status === 'UNPAID').reduce((s, p) => s + (p.amount || 0), 0);

    const now = new Date();
    const period = `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`;

    const reports = [
      {
        id: 'enrollment',
        type: 'Enrollment Summary',
        period,
        campus: campus || 'All',
        total,
        approved: approved + enrolled,
        pending,
        passed,
        failed,
        createdAt: now.toISOString().slice(0, 10),
        status: 'Ready',
      },
      {
        id: 'attendance',
        type: 'Attendance Report',
        period,
        campus: campus || 'All',
        total: attendanceTotal,
        approved: attendancePresent,
        pending: Math.max(0, attendanceTotal - attendancePresent),
        createdAt: now.toISOString().slice(0, 10),
        status: 'Ready',
      },
      {
        id: 'payment',
        type: 'Payment Status',
        period,
        campus: campus || 'All',
        total: payments.length,
        approved: payments.filter((p) => p.status === 'PAID').length,
        pending: payments.filter((p) => p.status === 'UNPAID').length,
        paidAmount,
        unpaidAmount,
        createdAt: now.toISOString().slice(0, 10),
        status: 'Ready',
      },
      {
        id: 'trainers',
        type: 'Trainer Performance',
        period,
        campus: campus || 'All',
        total: await Trainer.countDocuments({}),
        approved: await Trainer.countDocuments({ status: 'Active' }),
        pending: await Trainer.countDocuments({ status: 'Inactive' }),
        createdAt: now.toISOString().slice(0, 10),
        status: 'Ready',
      },
    ];

    const filtered = type && type !== 'All'
      ? reports.filter((r) => r.type === type || type === 'All Types')
      : reports;

    res.json({ success: true, data: filtered.length ? filtered : reports });
  } catch (error) {
    next(error);
  }
});

// Audit logs
router.get('/audit-logs', protect, authorize('superadmin', 'subadmin'), requirePermission('Audit Logs', 'read'), async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.module) filter.module = req.query.module;
    if (req.query.search) {
      const q = new RegExp(req.query.search, 'i');
      filter.$or = [{ actorName: q }, { label: q }, { details: q }];
    }
    if (req.query.date) {
      const start = new Date(`${req.query.date}T00:00:00.000Z`);
      const end = new Date(`${req.query.date}T23:59:59.999Z`);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const [total, rows] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ]);

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      data: rows.map((log) => ({
        id: log._id,
        occurredAt: log.createdAt,
        user: log.actorName,
        userStatus: 'active',
        action: { type: log.action, label: log.label || log.action },
        details: log.details,
        module: log.module,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Settings
router.get('/settings', protect, authorize('superadmin', 'subadmin'), requirePermission('Settings', 'read'), async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', protect, authorize('superadmin'), requirePermission('Settings', 'update'), async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    const sections = ['general', 'email', 'sms', 'payment', 'backup'];
    sections.forEach((key) => {
      if (req.body[key] && typeof req.body[key] === 'object') {
        doc[key] = { ...(doc[key]?.toObject?.() || doc[key] || {}), ...req.body[key] };
      }
    });
    if (req.body.section && req.body.data) {
      doc[req.body.section] = { ...(doc[req.body.section]?.toObject?.() || doc[req.body.section] || {}), ...req.body.data };
    }
    await doc.save();
    await writeAuditLog({
      req,
      action: 'update',
      label: 'Settings Updated',
      module: 'Settings',
      details: `Updated ${req.body.section || 'settings'}`,
    });
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

router.post('/settings/backup', protect, authorize('superadmin'), requirePermission('Settings', 'update'), async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    doc.backup = { ...(doc.backup?.toObject?.() || doc.backup || {}), lastBackupAt: new Date() };
    await doc.save();
    await writeAuditLog({
      req,
      action: 'system',
      label: 'Backup Triggered',
      module: 'Settings',
      details: 'Manual backup timestamp recorded',
    });
    res.json({ success: true, data: doc.backup, message: 'Backup recorded' });
  } catch (error) {
    next(error);
  }
});

// Support tickets
router.get('/support', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const rows = await SupportTicket.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post('/support', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'subject and message are required' });
    }
    const ticket = await SupportTicket.create({
      subject,
      message,
      category: req.body.category || 'General',
      priority: req.body.priority || 'Medium',
      createdBy: req.user.id,
      createdByName: req.user.fullName || req.user.email || '',
      createdByEmail: req.user.email || '',
      campus: req.user.campus || '',
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

router.put('/support/:id', protect, authorize('superadmin', 'subadmin'), async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

// Bulk student status update
router.post('/bulk-status', protect, authorize('superadmin', 'subadmin'), requirePermission('Updation', 'update'), async (req, res, next) => {
  try {
    const rolls = Array.isArray(req.body.rolls)
      ? req.body.rolls.map((r) => String(r).trim()).filter(Boolean)
      : String(req.body.rolls || '')
        .split(/[\s,]+/)
        .map((r) => r.trim())
        .filter(Boolean);

    const status = String(req.body.status || '').trim();
    const message = String(req.body.message || '').trim();
    const allowed = ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Completed', 'Dropped', 'Passed', 'Failed', 'Frozen'];

    if (!rolls.length) {
      return res.status(400).json({ success: false, message: 'Provide at least one roll number' });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    const uniqueRolls = [...new Set(rolls.map((r) => r.toUpperCase()))];
    if (req.body.campus || req.body.city) {
      req.user.campus = req.user.campus || req.body.campus || req.body.city;
    }
    const filter = studentCampusFilter(req, {
      roll: { $in: uniqueRolls.map((r) => new RegExp(`^${r}$`, 'i')) },
    });

    const students = await Student.find(filter);
    const foundKeys = new Set(students.map((s) => String(s.roll).toUpperCase()));
    const updatedRolls = [];
    const missingRolls = uniqueRolls.filter((r) => !foundKeys.has(r));

    await Promise.all(
      students.map(async (student) => {
        const from = student.status;
        student.status = status;
        student.changeHistory = student.changeHistory || [];
        student.changeHistory.push({
          field: 'status',
          from,
          to: status,
          note: message || 'Bulk status update',
          changedBy: req.user.id,
          changedByName: req.user.fullName || req.user.email || 'admin',
        });
        await student.save();
        updatedRolls.push(student.roll);
      })
    );

    const history = await BulkUpdateLog.create({
      rolls: uniqueRolls,
      updatedRolls,
      missingRolls,
      status,
      message,
      campus: req.user.campus || '',
      updatedBy: req.user.id,
      updatedByName: req.user.fullName || req.user.email || 'admin',
    });

    await writeAuditLog({
      req,
      action: 'update',
      label: 'Bulk Status Update',
      module: 'Updation',
      details: `${updatedRolls.length} students → ${status}`,
      meta: { updatedRolls, missingRolls },
    });

    res.json({
      success: true,
      data: {
        updated: updatedRolls,
        missing: missingRolls,
        status,
        history,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/bulk-status/history', protect, authorize('superadmin', 'subadmin'), requirePermission('Updation', 'read'), async (req, res, next) => {
  try {
    const rows = await BulkUpdateLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
