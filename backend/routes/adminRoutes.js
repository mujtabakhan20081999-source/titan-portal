const express = require('express');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Slot = require('../models/Slot');
const Permission = require('../models/Permission');
const { protect, authorize } = require('../middleware/auth');
const {
  ensureDefaultPermissions,
  DEFAULT_PERMISSIONS,
  getPermissionsForRole,
} = require('../middleware/permissions');

const router = express.Router();

const CITY_LIST = ['Sukkur', 'Karachi', 'Lahore', 'Islamabad', 'Multan'];
const CITY_REGEX = (city) => new RegExp(`^${city}( Campus)?$`, 'i');

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
    res.json({ success: true, data: { role: req.user.role, permissions } });
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

module.exports = router;
