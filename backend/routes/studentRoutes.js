const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Slot = require('../models/Slot');
const Trainer = require('../models/Trainer');
const { protect, authorize } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');
const { studentCampusFilter } = require('../utils/campusScope');

const router = express.Router();
const adminRoles = authorize('superadmin', 'subadmin');

const ALLOWED_CITIES = ['Sukkur', 'Karachi'];
const ALLOWED_CAMPUSES = ALLOWED_CITIES.map((city) => `${city} Campus`);

function normalizeCityCampus(city, campus) {
  const rawCity = city ? String(city).trim() : '';
  const rawCampus = campus ? String(campus).trim() : '';
  let normalizedCity = rawCity.replace(/\s*Campus$/i, '').trim();
  let normalizedCampus = rawCampus;

  if (normalizedCity && !normalizedCampus) {
    normalizedCampus = `${normalizedCity} Campus`;
  }
  if (!normalizedCity && normalizedCampus) {
    normalizedCity = normalizedCampus.replace(/\s*Campus$/i, '').trim();
  }

  if (normalizedCity && !ALLOWED_CITIES.includes(normalizedCity)) {
    return null;
  }
  if (normalizedCampus && !ALLOWED_CAMPUSES.includes(normalizedCampus)) {
    return null;
  }

  return { city: normalizedCity, campus: normalizedCampus };
}

function dayRange(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return { $gte: date, $lt: next };
}

function pushHistory(student, entry) {
  student.changeHistory = student.changeHistory || [];
  student.changeHistory.unshift({
    ...entry,
    changedAt: new Date(),
  });
  if (student.changeHistory.length > 100) {
    student.changeHistory = student.changeHistory.slice(0, 100);
  }
}

async function createRegistrationVoucher(student) {
  const voucher = `REG-${student.roll}-${Date.now().toString().slice(-6)}`;
  const payment = await Payment.create({
    student: student._id,
    name: student.name,
    roll: student.roll,
    voucher,
    paymentId: `PID-${Date.now().toString().slice(-8)}`,
    type: 'Registration',
    month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    amount: 1000,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'UNPAID',
  });
  student.pay = 'Pending';
  await student.save();
  return payment;
}

function buildStudentFilter(query) {
  const filter = {};
  const {
    search, country, city, campus, course, batch, slot, status, pay,
    gender, laptop, year, sponsorship, from, to, paymentMonth,
  } = query;

  if (search) {
    const q = String(search).trim();
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { roll: new RegExp(q, 'i') },
      { cnic: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { father: new RegExp(q, 'i') },
    ];
  }
  if (country) filter.country = new RegExp(`^${country}$`, 'i');
  if (city) filter.city = new RegExp(city, 'i');
  if (campus) filter.campus = new RegExp(campus, 'i');
  if (course) filter.course = new RegExp(course, 'i');
  if (batch) filter.batch = new RegExp(batch, 'i');
  if (slot) filter.slot = new RegExp(slot, 'i');
  if (status) filter.status = status;
  if (pay) filter.pay = pay;
  if (gender) filter.gender = gender;
  if (laptop) filter.laptop = laptop;
  if (year) filter.year = Number(year);
  if (sponsorship) filter.sponsorship = new RegExp(sponsorship, 'i');
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
  }
  // paymentMonth filter applied after fetch if needed via payment join — keep as student.meta/year for now
  if (paymentMonth) filter.meta = new RegExp(paymentMonth, 'i');
  return filter;
}

router.get('/', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const filter = studentCampusFilter(req, buildStudentFilter(req.query));

    const [total, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/export', protect, adminRoles, requirePermission('Students', 'export'), async (req, res, next) => {
  try {
    const filter = studentCampusFilter(req, buildStudentFilter(req.query));
    const students = await Student.find(filter).sort({ createdAt: -1 }).lean();
    const header = [
      'Roll', 'Name', 'Father', 'CNIC', 'Phone', 'Email', 'City', 'Campus', 'Course', 'Batch', 'Slot',
      'Status', 'Payment', 'Gender', 'Laptop', 'Year',
    ];
    const rows = students.map((s) => [
      s.roll, s.name, s.father, s.cnic, s.phone, s.email, s.city, s.campus, s.course, s.batch, s.slot,
      s.status, s.pay, s.gender, s.laptop, s.year,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));

    const csv = [header.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students-export.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

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

router.get('/:id/details', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const [payments, enrollments, attendanceCount] = await Promise.all([
      Payment.find({ $or: [{ student: student._id }, { roll: student.roll }] }).sort({ createdAt: -1 }),
      Enrollment.find({ student: student._id }).sort({ createdAt: -1 }),
      require('../models/Attendance').countDocuments({ student: student._id }),
    ]);

    res.json({
      success: true,
      data: {
        student,
        personal: {
          name: student.name,
          father: student.father,
          cnic: student.cnic,
          fatherCnic: student.fatherCnic,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          photoUrl: student.photoUrl,
        },
        education: {
          lastQualification: student.lastQualification,
          computerLevel: student.computerLevel,
          laptop: student.laptop,
          course: student.course,
          batch: student.batch,
        },
        contact: {
          email: student.email,
          phone: student.phone,
          fatherPhone: student.fatherPhone,
          address: student.address,
          city: student.city,
          campus: student.campus,
          country: student.country,
        },
        courses: enrollments,
        payments,
        history: student.changeHistory || [],
        attendanceCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/audit-pdf', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id })).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const [payments, enrollments] = await Promise.all([
      Payment.find({ $or: [{ student: student._id }, { roll: student.roll }] }).lean(),
      Enrollment.find({ student: student._id }).lean(),
    ]);

    const lines = [
      'TITAN STUDENT AUDIT RECORD',
      '==========================',
      `Generated: ${new Date().toISOString()}`,
      '',
      'PERSONAL',
      `Name: ${student.name}`,
      `Father: ${student.father || '-'}`,
      `CNIC: ${student.cnic || '-'}`,
      `DOB: ${student.dateOfBirth || '-'}`,
      `Gender: ${student.gender || '-'}`,
      '',
      'CONTACT',
      `Email: ${student.email || '-'}`,
      `Phone: ${student.phone || '-'}`,
      `Address: ${student.address || '-'}`,
      `City: ${student.city || '-'}`,
      `Campus: ${student.campus || '-'}`,
      '',
      'ENROLLMENT',
      `Roll: ${student.roll}`,
      `Course: ${student.course || '-'}`,
      `Batch: ${student.batch || '-'}`,
      `Slot: ${student.slot || '-'}`,
      `Status: ${student.status}`,
      `Payment: ${student.pay}`,
      '',
      'COURSE HISTORY',
      ...enrollments.map((e) => `- ${e.course || '-'} | ${e.roll} | ${e.status} | ${e.schedule || '-'}`),
      '',
      'PAYMENTS',
      ...payments.map((p) => `- ${p.voucher} | ${p.type} | ${p.amount} | ${p.status} | ${p.month || '-'}`),
      '',
      'CHANGE HISTORY',
      ...(student.changeHistory || []).map((h) => `- ${h.changedAt}: ${h.field} ${h.from} -> ${h.to} by ${h.changedByName || 'system'}`),
    ];

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="audit-${student.roll}.txt"`);
    res.send(lines.join('\n'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/vouchers', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const payments = await Payment.find({ $or: [{ student: student._id }, { roll: student.roll }] }).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, adminRoles, requirePermission('Students', 'write'), async (req, res, next) => {
  try {
    const body = { ...req.body };
    const { email, name, cnic } = body;
    if (!name || !body.roll || !body.dateOfBirth) {
      return res.status(400).json({ success: false, message: 'name, roll number and date of birth are required' });
    }

    const roll = String(body.roll).trim();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedCnic = cnic ? String(cnic).trim() : null;
    const normalizedCity = body.city ? String(body.city).trim() : '';
    const normalizedCampus = body.campus ? String(body.campus).trim() : '';

    const normalized = normalizeCityCampus(normalizedCity, normalizedCampus);
    if (!normalized) {
      return res.status(400).json({ success: false, message: 'City must be Sukkur or Karachi and campus must match.' });
    }
    body.city = normalized.city;
    body.campus = normalized.campus;

    if (normalizedCnic && !/^\d{5}-\d{7}-\d$/.test(normalizedCnic)) {
      return res.status(400).json({ success: false, message: 'CNIC must look like 45601-1234567-1' });
    }
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email' });
    }

    const existingStudent = await Student.findOne({
      $or: [
        { roll },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedCnic ? [{ cnic: normalizedCnic }] : []),
        ...(body.phone ? [{ phone: String(body.phone).trim() }] : []),
      ],
    });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'A student with this roll, email, phone, or CNIC already exists' });
    }

    if (body.slotRef || body.slot) {
      const slot = body.slotRef
        ? await Slot.findById(body.slotRef)
        : await Slot.findOne({ slotId: body.slot });
      if (!slot) {
        return res.status(400).json({ success: false, message: 'Selected slot was not found' });
      }
      if (slot.status === 'Closed') {
        return res.status(400).json({ success: false, message: 'This slot is closed for registration' });
      }
      if (Number(slot.filled) >= Number(slot.seats)) {
        slot.status = 'Closed';
        await slot.save();
        return res.status(400).json({ success: false, message: 'This slot is full and closed for registration' });
      }
      body.slot = slot.slotId;
      body.slotRef = slot._id;
      body.course = body.course || slot.course;
      body.campus = body.campus || slot.campus;
      body.city = body.city || String(slot.campus || '').replace(/\s*Campus$/i, '').trim();
    }

    const user = await User.create({
      fullName: body.name,
      email: normalizedEmail,
      password: require('crypto').randomBytes(24).toString('hex'),
      role: 'student',
      campus: body.campus || body.city || '',
    });

    let student;
    try {
      student = await Student.create({
        ...body,
        roll,
        email: normalizedEmail,
        cnic: normalizedCnic,
        user: user._id,
        city: body.city || '',
        campus: body.campus || '',
        country: body.country || 'Pakistan',
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    const voucher = await createRegistrationVoucher(student);

    if (student.slotRef || student.slot) {
      const slotDoc = student.slotRef
        ? await Slot.findById(student.slotRef)
        : await Slot.findOne({ slotId: student.slot });
      if (slotDoc) {
        slotDoc.filled = Number(slotDoc.filled || 0) + 1;
        if (slotDoc.filled >= slotDoc.seats) {
          slotDoc.status = 'Closed';
        }
        await slotDoc.save();
      }
    }

    if (student.slot || student.slotRef || student.course) {
      await Enrollment.create({
        student: student._id,
        slot: student.slotRef || undefined,
        slotId: student.slot || '',
        course: student.course || '',
        courseRef: student.courseRef || undefined,
        batch: student.batchRef || undefined,
        batchName: student.batch || '',
        campus: student.campus || '',
        campusRef: student.campusRef || undefined,
        roll: student.roll,
        status: 'Pending',
        schedule: '',
        history: [{
          status: 'Pending',
          note: 'Enrollment created on registration',
          changedBy: req.user.id,
          changedByName: req.user.email || 'admin',
        }],
      });
    }

    res.status(201).json({ success: true, data: student, voucher });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, adminRoles, requirePermission('Students', 'update'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updateData = { ...req.body };
    delete updateData.changeHistory;
    delete updateData.user;

    if (updateData.email) updateData.email = String(updateData.email).trim().toLowerCase();
    const normalizedCity = updateData.city ? String(updateData.city).trim() : String(student.city).trim();
    const normalizedCampus = updateData.campus ? String(updateData.campus).trim() : String(student.campus).trim();
    const normalized = normalizeCityCampus(normalizedCity, normalizedCampus);
    if (!normalized) {
      return res.status(400).json({ success: false, message: 'City must be Sukkur or Karachi and campus must match.' });
    }
    updateData.city = normalized.city;
    updateData.campus = normalized.campus;
    if (updateData.appPassword) {
      const linkedUser = await User.findById(student.user).select('+password');
      if (linkedUser) {
        linkedUser.password = updateData.appPassword;
        linkedUser.status = 'Active';
        await linkedUser.save();
      }
      delete updateData.appPassword;
    }

    const tracked = ['status', 'pay', 'course', 'batch', 'slot', 'campus', 'city'];
    tracked.forEach((field) => {
      if (updateData[field] !== undefined && String(updateData[field]) !== String(student[field] ?? '')) {
        pushHistory(student, {
          field,
          from: String(student[field] ?? ''),
          to: String(updateData[field] ?? ''),
          note: req.body.historyNote || 'Updated by admin',
          changedBy: req.user.id,
          changedByName: req.user.email || 'admin',
        });
      }
    });

    Object.assign(student, updateData);
    await student.save();

    await User.findByIdAndUpdate(student.user, {
      fullName: student.name,
      email: student.email,
      campus: student.campus || student.city || '',
    });

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/vouchers', protect, adminRoles, requirePermission('Students', 'write'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const month = req.body.month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const amount = Number(req.body.amount) || 2000;
    const voucher = `MON-${student.roll}-${Date.now().toString().slice(-6)}`;

    const payment = await Payment.create({
      student: student._id,
      name: student.name,
      roll: student.roll,
      voucher,
      paymentId: `PID-${Date.now().toString().slice(-8)}`,
      type: 'Monthly',
      month,
      amount,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'UNPAID',
    });

    student.pay = 'Pending';
    pushHistory(student, {
      field: 'pay',
      from: student.pay,
      to: 'Pending',
      note: `Monthly voucher generated: ${voucher}`,
      changedBy: req.user.id,
      changedByName: req.user.email || 'admin',
    });
    await student.save();

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, adminRoles, requirePermission('Students', 'update'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    await Student.findByIdAndDelete(student._id);
    await Promise.all([
      User.findByIdAndDelete(student.user),
      Enrollment.deleteMany({ student: student._id }),
    ]);
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

// Get all enrollments for a student
router.get('/:id/enrollments', protect, adminRoles, requirePermission('Students', 'read'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollments = await Enrollment.find({ student: student._id })
      .populate('courseRef')
      .populate('batch')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
});

// Add a course enrollment for a student
router.post('/:id/enrollments', protect, adminRoles, requirePermission('Students', 'write'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const { course, courseRef, slot, slotRef, batch, batchName, campus, campusRef, status } = req.body;

    if (!course) {
      return res.status(400).json({ success: false, message: 'Course is required' });
    }

    // Check if student already enrolled in this course
    const existing = await Enrollment.findOne({
      student: student._id,
      course: course,
      status: { $ne: 'Dropout' }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Student is already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: student._id,
      course: course,
      courseRef: courseRef || undefined,
      slot: slotRef || undefined,
      slotId: slot || '',
      batch: batch || undefined,
      batchName: batchName || '',
      campus: campus || student.campus || '',
      campusRef: campusRef || undefined,
      roll: student.roll,
      status: status || 'Pending',
      schedule: '',
      history: [{
        status: status || 'Pending',
        note: 'Enrollment added by admin',
        changedBy: req.user.id,
        changedByName: req.user.email || 'admin',
        changedAt: new Date(),
      }],
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('courseRef')
      .populate('batch')
      .populate('slot');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

// Update an enrollment
router.put('/:id/enrollments/:enrollmentId', protect, adminRoles, requirePermission('Students', 'update'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, student: student._id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const { status, batch, batchName, campus, campusRef, slot, slotRef } = req.body;

    if (status && status !== enrollment.status) {
      enrollment.history = enrollment.history || [];
      enrollment.history.unshift({
        status: status,
        note: req.body.note || 'Status updated by admin',
        changedBy: req.user.id,
        changedByName: req.user.email || 'admin',
        changedAt: new Date(),
      });
      enrollment.status = status;
    }

    if (batch) enrollment.batch = batch;
    if (batchName) enrollment.batchName = batchName;
    if (campus) enrollment.campus = campus;
    if (campusRef) enrollment.campusRef = campusRef;
    if (slot) enrollment.slotId = slot;
    if (slotRef) enrollment.slot = slotRef;

    await enrollment.save();

    const populated = await Enrollment.findById(enrollment._id)
      .populate('courseRef')
      .populate('batch')
      .populate('slot');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

// Delete an enrollment
router.delete('/:id/enrollments/:enrollmentId', protect, adminRoles, requirePermission('Students', 'update'), async (req, res, next) => {
  try {
    const student = await Student.findOne(studentCampusFilter(req, { _id: req.params.id }));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, student: student._id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // If slot exists, decrease filled count
    if (enrollment.slot) {
      const slot = await Slot.findById(enrollment.slot);
      if (slot && slot.filled > 0) {
        slot.filled = Number(slot.filled) - 1;
        if (slot.status === 'Closed' && slot.filled < slot.seats) {
          slot.status = 'Open';
        }
        await slot.save();
      }
    }

    await Enrollment.findByIdAndDelete(enrollment._id);

    res.json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
