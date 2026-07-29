require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const User = require('../models/User');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@titan.edu';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026';
const subadminEmail = process.env.SUBADMIN_EMAIL || 'subadmin@titan.edu';
const subadminPassword = process.env.SUBADMIN_PASSWORD || 'SubAdmin@2026';

async function seedUser({ email, password, fullName, role, campus }) {
  let user = await User.findOne({ email });

  if (user) {
    user.fullName = fullName;
    user.role = role;
    user.status = 'Active';
    user.campus = campus;
    user.password = password;
    await user.save();
  } else {
    user = await User.create({
      fullName,
      email,
      password,
      role,
      campus,
    });
  }

  return user;
}

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await seedUser({
    email: adminEmail,
    password: adminPassword,
    fullName: 'TITAN Super Admin',
    role: 'superadmin',
    campus: 'Sukkur Campus',
  });

  const subadmin = await seedUser({
    email: subadminEmail,
    password: subadminPassword,
    fullName: 'TITAN Sub Admin',
    role: 'subadmin',
    campus: 'Sukkur Campus',
  });

  console.log(`Superadmin is ready: ${admin.email}`);
  console.log(`Subadmin is ready: ${subadmin.email}`);

  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
