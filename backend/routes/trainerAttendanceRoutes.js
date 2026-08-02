const express = require('express');
const Trainer = require('../models/Trainer');
const TrainerAttendance = require('../models/TrainerAttendance');
const TrainerAttendanceCorrection = require('../models/TrainerAttendanceCorrection');
const { protect, authorize } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');
const { applyCampusScope } = require('../utils/campusScope');
const { writeAuditLog } = require('../utils/auditLogger');

const router = express.Router();

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// List trainer attendance
router.get('/attendance', protect, authorize('superadmin', 'subadmin'), requirePermission('Trainers', 'read'), async (req, res, next) => {
  try {
    const filter = applyCampusScope(req, {});
    if (req.query.date) filter.date = req.query.date;
    if (req.query.employeeId) filter.employeeId = new RegExp(req.query.employeeId, 'i');
    const rows = await TrainerAttendance.find(filter).sort({ date: -1, createdAt: -1 }).limit(200);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

// Scan employee ID → check-in / check-out
router.post('/attendance/scan', protect, authorize('superadmin', 'subadmin'), requirePermission('Trainers', 'write'), async (req, res, next) => {
  try {
    const employeeId = String(req.body.employeeId || '').trim().toUpperCase();
    const action = String(req.body.action || 'check-in').toLowerCase();
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const trainerFilter = applyCampusScope(req, { employeeId: new RegExp(`^${employeeId}$`, 'i') });
    const trainer = await Trainer.findOne(trainerFilter);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'No trainer found with this Employee ID' });
    }

    const date = req.body.date || todayKey();
    let record = await TrainerAttendance.findOne({ trainer: trainer._id, date });
    if (!record) {
      record = new TrainerAttendance({
        trainer: trainer._id,
        employeeId: trainer.employeeId,
        trainerName: trainer.fullName,
        campus: trainer.campus,
        date,
        markedBy: req.user.id,
        markedByName: req.user.email || req.user.fullName || '',
      });
    }

    if (action === 'check-out' || action === 'checkout') {
      if (!record.checkIn) {
        return res.status(400).json({ success: false, message: 'Cannot check out before check-in' });
      }
      record.checkOut = req.body.time || nowTime();
      record.status = 'Present';
    } else {
      if (record.checkIn && !req.body.force) {
        return res.status(400).json({ success: false, message: 'Already checked in today', data: record });
      }
      record.checkIn = req.body.time || nowTime();
      if (!record.checkOut) record.status = 'Incomplete';
      else record.status = 'Present';
    }

    await record.save();
    await writeAuditLog({
      req,
      action: 'update',
      label: action === 'check-out' || action === 'checkout' ? 'Trainer Check-out' : 'Trainer Check-in',
      module: 'Trainers',
      entityType: 'TrainerAttendance',
      entityId: record._id,
      details: `${trainer.fullName} (${trainer.employeeId}) ${action} on ${date}`,
    });

    res.json({ success: true, data: record, trainer });
  } catch (error) {
    next(error);
  }
});

// Correction requests
router.get('/attendance/corrections', protect, authorize('superadmin', 'subadmin'), requirePermission('Trainers', 'read'), async (req, res, next) => {
  try {
    const filter = applyCampusScope(req, {});
    if (req.query.status) filter.status = req.query.status;
    const rows = await TrainerAttendanceCorrection.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post('/attendance/corrections', protect, authorize('superadmin', 'subadmin', 'teacher'), requirePermission('Trainers', 'write'), async (req, res, next) => {
  try {
    const employeeId = String(req.body.employeeId || '').trim();
    const date = req.body.date || todayKey();
    const reason = String(req.body.reason || '').trim();
    if (!employeeId || !reason) {
      return res.status(400).json({ success: false, message: 'employeeId and reason are required' });
    }

    const trainer = await Trainer.findOne(applyCampusScope(req, { employeeId: new RegExp(`^${employeeId}$`, 'i') }));
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const attendance = await TrainerAttendance.findOne({ trainer: trainer._id, date });
    const correction = await TrainerAttendanceCorrection.create({
      trainer: trainer._id,
      attendance: attendance?._id,
      employeeId: trainer.employeeId,
      trainerName: trainer.fullName,
      campus: trainer.campus,
      date,
      currentCheckIn: attendance?.checkIn || '',
      currentCheckOut: attendance?.checkOut || '',
      proposedCheckIn: req.body.proposedCheckIn || '',
      proposedCheckOut: req.body.proposedCheckOut || '',
      proposedStatus: req.body.proposedStatus || 'Present',
      reason,
      requestedBy: req.user.id,
      requestedByName: req.user.fullName || req.user.email || '',
    });

    res.status(201).json({ success: true, data: correction });
  } catch (error) {
    next(error);
  }
});

router.put('/attendance/corrections/:id', protect, authorize('superadmin', 'subadmin'), requirePermission('Trainers', 'update'), async (req, res, next) => {
  try {
    const correction = await TrainerAttendanceCorrection.findById(req.params.id);
    if (!correction) {
      return res.status(404).json({ success: false, message: 'Correction request not found' });
    }
    if (correction.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Request already reviewed' });
    }

    const decision = String(req.body.status || '').trim();
    if (!['Approved', 'Rejected'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'status must be Approved or Rejected' });
    }

    correction.status = decision;
    correction.reviewNote = req.body.reviewNote || '';
    correction.reviewedBy = req.user.id;
    correction.reviewedByName = req.user.fullName || req.user.email || '';
    correction.reviewedAt = new Date();
    await correction.save();

    if (decision === 'Approved') {
      let attendance = correction.attendance
        ? await TrainerAttendance.findById(correction.attendance)
        : await TrainerAttendance.findOne({ trainer: correction.trainer, date: correction.date });

      if (!attendance) {
        attendance = new TrainerAttendance({
          trainer: correction.trainer,
          employeeId: correction.employeeId,
          trainerName: correction.trainerName,
          campus: correction.campus,
          date: correction.date,
        });
      }

      if (correction.proposedCheckIn) attendance.checkIn = correction.proposedCheckIn;
      if (correction.proposedCheckOut) attendance.checkOut = correction.proposedCheckOut;
      attendance.status = correction.proposedStatus || 'Present';
      attendance.remarks = `Corrected: ${correction.reason}`;
      await attendance.save();
      correction.attendance = attendance._id;
      await correction.save();
    }

    await writeAuditLog({
      req,
      action: 'update',
      label: `Attendance Correction ${decision}`,
      module: 'Trainers',
      entityType: 'TrainerAttendanceCorrection',
      entityId: correction._id,
      details: `${correction.trainerName} ${correction.date} → ${decision}`,
    });

    res.json({ success: true, data: correction });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
