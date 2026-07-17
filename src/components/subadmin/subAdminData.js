/* Shared demo data for the Sub-Admin panel — everything is scoped to one
   city/campus, per the project brief ("only for their own campus"). */

// Permission list for the demo sub-admin account (Campus Manager).
// The menu and buttons show/hide based on this — not fixed in code.
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
  Sukkur:    { students: 1345, enrolled: 842, courses: 18, trainers: 38, slots: 24, regOpen: 6 },
  Karachi:   { students: 986,  enrolled: 607, courses: 15, trainers: 32, slots: 19, regOpen: 5 },
  Lahore:    { students: 754,  enrolled: 480, courses: 14, trainers: 26, slots: 15, regOpen: 4 },
  Islamabad: { students: 632,  enrolled: 399, courses: 12, trainers: 22, slots: 12, regOpen: 3 },
  Multan:    { students: 521,  enrolled: 318, courses: 10, trainers: 18, slots: 10, regOpen: 2 },
};

export const COURSES = ['Artificial Intelligence', 'Web Development', 'Python Programming', 'Data Science', 'Cyber Security', 'UI/UX Design', 'Graphic Design'];
export const BATCHES = ['Batch 1', 'Batch 2', 'Batch 3'];
export const STUDENT_STATUSES = ['Pending', 'Approved', 'Rejected', 'Enrolled', 'Passed', 'Failed', 'Completed'];

const CITY_CODE = { Sukkur: 'SUK', Karachi: 'KHI', Lahore: 'LHE', Islamabad: 'ISB', Multan: 'MUX' };
export const cityCode = (city) => CITY_CODE[city] || 'GEN';

const AV_COLORS = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];

const BASE_STUDENTS = [
  { name: 'Anas Hassan',     father: 'Hassan Ali',      gender: 'Male',   course: 'Artificial Intelligence', batch: 'Batch 1', status: 'Enrolled',  pay: 'Paid',          laptop: 'Yes' },
  { name: 'Zainab Fatima',   father: 'Muhammad Iqbal',  gender: 'Female', course: 'Web Development',         batch: 'Batch 2', status: 'Enrolled',  pay: 'Pending',       laptop: 'Yes' },
  { name: 'Muhammad Usman',  father: 'Usman Ghani',     gender: 'Male',   course: 'Python Programming',      batch: 'Batch 1', status: 'Enrolled',  pay: 'Paid',          laptop: 'No'  },
  { name: 'Ayesha Siddiqui', father: 'Abdul Rehman',    gender: 'Female', course: 'Data Science',            batch: 'Batch 3', status: 'Pending',   pay: 'Not Generated', laptop: 'Yes' },
  { name: 'Bilal Sheikh',    father: 'Tariq Sheikh',    gender: 'Male',   course: 'Cyber Security',          batch: 'Batch 1', status: 'Enrolled',  pay: 'Paid',          laptop: 'Yes' },
  { name: 'Hira Khan',       father: 'Imran Khan',      gender: 'Female', course: 'UI/UX Design',            batch: 'Batch 2', status: 'Approved',  pay: 'Pending',       laptop: 'No'  },
  { name: 'Saad Qureshi',    father: 'Naveed Qureshi',  gender: 'Male',   course: 'Web Development',         batch: 'Batch 1', status: 'Completed', pay: 'Paid',          laptop: 'Yes' },
  { name: 'Mariam Baig',     father: 'Asif Baig',       gender: 'Female', course: 'Graphic Design',          batch: 'Batch 3', status: 'Enrolled',  pay: 'Pending',       laptop: 'Yes' },
  { name: 'Hamza Memon',     father: 'Salim Memon',     gender: 'Male',   course: 'Artificial Intelligence', batch: 'Batch 2', status: 'Pending',   pay: 'Not Generated', laptop: 'No'  },
  { name: 'Fatima Noorani',  father: 'Zafar Noorani',   gender: 'Female', course: 'Python Programming',      batch: 'Batch 2', status: 'Enrolled',  pay: 'Paid',          laptop: 'Yes' },
];

export function makeStudents(city) {
  const code = cityCode(city);
  return BASE_STUDENTS.map((s, i) => ({
    ...s,
    roll: `${code}-24-${String(i + 1).padStart(3, '0')}`,
    cnic: `455${i % 10}1-98${i % 10}4321-${(i % 9) + 1}`,
    phone: `03${i % 10}1-5551${String(200 + i)}`,
    email: `${s.name.toLowerCase().replace(/[^a-z]+/g, '.')}@student.titan.edu`,
    campus: `${city} Campus`,
    av: AV_COLORS[i % AV_COLORS.length],
    joined: `0${(i % 8) + 1} Mar 2026`,
  }));
}

const BASE_TRAINERS = [
  { name: 'Ali Raza',     urdu: 'علی رضا',     courses: ['Artificial Intelligence', 'Python Programming'], phone: '0301-2223331' },
  { name: 'Sana Khan',    urdu: 'ثنا خان',     courses: ['Web Development', 'UI/UX Design'],               phone: '0302-2223332' },
  { name: 'Usman Ali',    urdu: 'عثمان علی',   courses: ['Python Programming', 'Data Science'],            phone: '0303-2223333' },
  { name: 'Fatima Noor',  urdu: 'فاطمہ نور',   courses: ['Data Science', 'Cyber Security'],                phone: '0304-2223334' },
  { name: 'Bilal Ahmed',  urdu: 'بلال احمد',   courses: ['Graphic Design', 'UI/UX Design'],                phone: '0305-2223335' },
];

export function makeTrainers(city) {
  const code = cityCode(city);
  return BASE_TRAINERS.map((t, i) => ({
    ...t,
    empId: `EMP-${code}-0${i + 1}`,
    email: `${t.name.toLowerCase().replace(/[^a-z]+/g, '.')}@titan.edu`,
    campus: `${city} Campus`,
    av: AV_COLORS[(i + 2) % AV_COLORS.length],
  }));
}

const SLOT_TIMES = ['09:00 AM - 11:00 AM', '11:30 AM - 01:30 PM', '02:00 PM - 04:00 PM', '04:30 PM - 06:30 PM', '07:00 PM - 09:00 PM', '10:00 AM - 12:00 PM'];
const SLOT_DAYS = ['Mon, Wed, Fri', 'Tue, Thu, Sat', 'Mon, Wed, Fri', 'Tue, Thu', 'Sat, Sun', 'Wed, Fri'];

export function makeSlots(city) {
  const code = cityCode(city);
  return BASE_TRAINERS.slice(0, 5).concat(BASE_TRAINERS[0]).map((t, i) => ({
    id: `${code}-SL-0${i + 1}`,
    course: t.courses[i % t.courses.length],
    trainer: t.name,
    days: SLOT_DAYS[i],
    time: SLOT_TIMES[i],
    classType: i % 2 === 0 ? 'Onsite' : 'Online',
    gender: i === 3 ? 'Female' : 'Mixed',
    filled: [19, 32, 24, 22, 40, 12][i],
    seats: [63, 32, 40, 30, 40, 28][i],
    open: [true, false, true, true, false, true][i],
    campus: `${city} Campus`,
  }));
}

export function makeRequests(city) {
  const code = cityCode(city);
  return [
    { id: `REQ-${code}-01`, trainer: 'Ali Raza',    empId: `EMP-${code}-01`, date: '12 Jul 2026', change: 'Absent → Present', reason: 'Was on campus but scanner was offline.', status: 'Pending' },
    { id: `REQ-${code}-02`, trainer: 'Sana Khan',   empId: `EMP-${code}-02`, date: '10 Jul 2026', change: 'Missing check-out', reason: 'Forgot to scan while leaving early class.', status: 'Pending' },
    { id: `REQ-${code}-03`, trainer: 'Usman Ali',   empId: `EMP-${code}-03`, date: '08 Jul 2026', change: 'Leave → Present',   reason: 'Leave was cancelled, took the class.', status: 'Approved' },
  ];
}

// Rough per-course student split for the campus bar chart.
const COURSE_SHARES = [0.21, 0.18, 0.16, 0.13, 0.12, 0.11, 0.09];
export function courseDistribution(city) {
  const total = CITY_STATS[city]?.students || 500;
  return COURSES.map((label, i) => ({ label, value: Math.round(total * COURSE_SHARES[i]) }));
}
