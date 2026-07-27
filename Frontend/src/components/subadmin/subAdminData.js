/* Sub-Admin shared constants and utilities.
   Mock data factory functions removed — components now fetch from real backend.
   Keep only configuration constants and helper functions. */

// Permission keys for the sub-admin account (Campus Manager).
// Menus and buttons show/hide based on these.
export const SUBADMIN_PERMISSIONS = {
  Dashboard: ['read'],
  Students: ['read', 'write', 'update', 'export'],
  Attendance: ['read', 'mark', 'multi'],
  Slots: ['read', 'write', 'update'],
  Trainers: ['read', 'update'],
  Updation: ['update'],
};

export const can = (perms, module, action) => (perms[module] || []).includes(action);

export const CITY_STATS = {
  Sukkur:    { students: 0, enrolled: 0, courses: 0, trainers: 0, slots: 0, regOpen: 0 },
  Karachi:   { students: 0, enrolled: 0, courses: 0, trainers: 0, slots: 0, regOpen: 0 },
  Lahore:    { students: 0, enrolled: 0, courses: 0, trainers: 0, slots: 0, regOpen: 0 },
  Islamabad: { students: 0, enrolled: 0, courses: 0, trainers: 0, slots: 0, regOpen: 0 },
  Multan:    { students: 0, enrolled: 0, courses: 0, trainers: 0, slots: 0, regOpen: 0 },
};

export const COURSES = ['Artificial Intelligence', 'Web Development', 'Python Programming', 'Data Science', 'Cyber Security', 'UI/UX Design', 'Graphic Design'];
export const BATCHES = ['Batch 1', 'Batch 2', 'Batch 3'];
export const STUDENT_STATUSES = ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Passed', 'Failed', 'Completed'];

const CITY_CODE = { Sukkur: 'SUK', Karachi: 'KHI', Lahore: 'LHE', Islamabad: 'ISB', Multan: 'MUX' };
export const cityCode = (city) => CITY_CODE[city] || 'GEN';

export const AV_COLORS = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];
