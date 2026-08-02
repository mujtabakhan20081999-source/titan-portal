const express = require('express');
const Country = require('../models/Country');
const City = require('../models/City');
const Campus = require('../models/Campus');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Slot = require('../models/Slot');
const { protect, authorize } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();

const adminOnly = [protect, authorize('superadmin', 'subadmin')];

async function ensureSeedData() {
  let country = await Country.findOne({ name: 'Pakistan' });
  if (!country) {
    country = await Country.create({ name: 'Pakistan', code: 'PK' });
  }

  const cityNames = ['Sukkur', 'Karachi', 'Lahore', 'Islamabad', 'Multan'];
  const cities = {};
  for (const name of cityNames) {
    let city = await City.findOne({ name, country: country._id });
    if (!city) city = await City.create({ name, country: country._id });
    cities[name] = city;

    const campusName = `${name} Campus`;
    const existingCampus = await Campus.findOne({ name: campusName, city: city._id });
    if (!existingCampus) {
      await Campus.create({ name: campusName, city: city._id, address: `${name}, Pakistan` });
    }
  }

  const defaultCourses = [
    {
      name: 'Modern Web Application Development',
      modules: [
        { title: 'HTML & CSS', order: 1, topics: [{ title: 'Basics', order: 1 }, { title: 'Flexbox', order: 2 }] },
        { title: 'JavaScript', order: 2, topics: [{ title: 'ES6', order: 1 }, { title: 'DOM', order: 2 }] },
        { title: 'React', order: 3, topics: [{ title: 'Components', order: 1 }, { title: 'Hooks', order: 2 }] },
      ],
    },
    {
      name: 'Artificial Intelligence',
      modules: [
        { title: 'Python Basics', order: 1, topics: [{ title: 'Syntax', order: 1 }] },
        { title: 'ML Fundamentals', order: 2, topics: [{ title: 'Supervised Learning', order: 1 }] },
      ],
    },
    {
      name: 'Little Geniuses: Coding, Design & AI Fun Lab',
      modules: [
        { title: 'Intro to Coding', order: 1, topics: [{ title: 'Scratch', order: 1 }] },
      ],
    },
  ];

  for (const courseData of defaultCourses) {
    let course = await Course.findOne({ name: courseData.name });
    if (!course) {
      course = await Course.create(courseData);
    }
    for (const cityName of cityNames) {
      const campus = await Campus.findOne({ name: `${cityName} Campus` });
      if (!campus) continue;
      const batchName = 'Batch 1';
      const exists = await Batch.findOne({ name: batchName, course: course._id, campus: campus._id });
      if (!exists) {
        await Batch.create({
          name: batchName,
          course: course._id,
          campus: campus._id,
          year: new Date().getFullYear(),
        });
      }
    }
  }

  return { country, cities };
}

router.post('/seed', ...adminOnly, requirePermission('Settings', 'write'), async (req, res, next) => {
  try {
    await ensureSeedData();
    res.json({ success: true, message: 'Master data seeded successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/hierarchy', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const countries = await Country.find({ status: 'Active' }).sort({ name: 1 }).lean();
    const cities = await City.find({ status: 'Active' }).populate('country', 'name').sort({ name: 1 }).lean();
    const campuses = await Campus.find({ status: 'Active' }).populate('city', 'name').sort({ name: 1 }).lean();
    const courses = await Course.find({ status: 'Active' }).sort({ name: 1 }).lean();
    const batches = await Batch.find({ status: 'Active' })
      .populate('course', 'name')
      .populate('campus', 'name')
      .sort({ name: 1 })
      .lean();
    const slots = await Slot.find().sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      data: { countries, cities, campuses, courses, batches, slots },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/countries', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const data = await Country.find().sort({ name: 1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/cities', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    const data = await City.find(filter).populate('country', 'name').sort({ name: 1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/campuses', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const filter = {};
    if (req.query.city) filter.city = req.query.city;
    const data = await Campus.find(filter).populate('city', 'name').sort({ name: 1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/courses', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const data = await Course.find().sort({ name: 1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/courses', ...adminOnly, requirePermission('Slots', 'write'), async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

router.get('/batches', protect, async (req, res, next) => {
  try {
    await ensureSeedData();
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.campus) filter.campus = req.query.campus;
    const data = await Batch.find(filter).populate('course', 'name').populate('campus', 'name').sort({ name: 1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/batches', ...adminOnly, requirePermission('Slots', 'write'), async (req, res, next) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
});

router.get('/slots-by-filters', protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.campus) filter.campus = new RegExp(String(req.query.campus), 'i');
    if (req.query.course) filter.course = new RegExp(String(req.query.course), 'i');
    if (req.query.status) filter.status = req.query.status;
    const data = await Slot.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
module.exports.ensureSeedData = ensureSeedData;
