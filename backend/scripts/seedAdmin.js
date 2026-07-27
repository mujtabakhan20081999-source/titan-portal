require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.env.ADMIN_EMAIL || 'admin@titan.edu';
const password = process.env.ADMIN_PASSWORD || 'Admin@2026';

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  let admin = await User.findOne({ email });

  if (admin) {
    admin.fullName = 'TITAN Super Admin';
    admin.role = 'superadmin';
    admin.status = 'Active';
    admin.password = password;
    await admin.save();
  } else {
    admin = await User.create({
      fullName: 'TITAN Super Admin',
      email,
      password,
      role: 'superadmin',
      campus: 'Sukkur Campus',
    });
  }

  console.log(`Superadmin is ready: ${admin.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
