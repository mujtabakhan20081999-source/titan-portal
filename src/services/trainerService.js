const CAMPUSES = [
  'Sukkur Campus',
  'Karachi Campus',
  'Lahore Campus',
  'Islamabad Campus',
  'Multan Campus',
  'Other Campuses',
];

const sampleTrainers = [
  {
    id: 1,
    fullName: 'Hassan Raza',
    email: 'hassan.raza@titan.edu',
    employeeId: 'EMP-TR-1001',
    campus: 'Sukkur Campus',
    phoneNumber: '+92 300 1234567',
    joiningDate: '2024-01-15',
    status: 'Active',
    gender: 'Male',
    qualification: 'MSc Computer Science',
    experience: 6,
    salary: 85000,
    address: 'Sukkur, Sindh',
    profilePictureUrl: null,
  },
  {
    id: 2,
    fullName: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@titan.edu',
    employeeId: 'EMP-TR-1002',
    campus: 'Karachi Campus',
    phoneNumber: '+92 345 9876543',
    joiningDate: '2023-09-01',
    status: 'Inactive',
    gender: 'Female',
    qualification: 'MPhil Data Science',
    experience: 5,
    salary: 78000,
    address: 'Karachi, Sindh',
    profilePictureUrl: null,
  },
  {
    id: 3,
    fullName: 'Muhammad Usman',
    email: 'muhammad.usman@titan.edu',
    employeeId: 'EMP-TR-1003',
    campus: 'Lahore Campus',
    phoneNumber: '+92 312 1112223',
    joiningDate: '2024-03-20',
    status: 'Active',
    gender: 'Male',
    qualification: 'MSc Software Engineering',
    experience: 7,
    salary: 92000,
    address: 'Lahore, Punjab',
    profilePictureUrl: null,
  },
  {
    id: 4,
    fullName: 'Zainab Fatima',
    email: 'zainab.fatima@titan.edu',
    employeeId: 'EMP-TR-1004',
    campus: 'Islamabad Campus',
    phoneNumber: '+92 300 5550123',
    joiningDate: '2022-11-10',
    status: 'Active',
    gender: 'Female',
    qualification: 'MS Information Technology',
    experience: 4,
    salary: 74000,
    address: 'Islamabad',
    profilePictureUrl: null,
  },
  {
    id: 5,
    fullName: 'Omar Khalid',
    email: 'omar.khalid@titan.edu',
    employeeId: 'EMP-TR-1005',
    campus: 'Multan Campus',
    phoneNumber: '+92 301 2223334',
    joiningDate: '2023-05-18',
    status: 'Inactive',
    gender: 'Male',
    qualification: 'BS Computer Engineering',
    experience: 3,
    salary: 62000,
    address: 'Multan, Punjab',
    profilePictureUrl: null,
  },
  {
    id: 6,
    fullName: 'Noor Ahmed',
    email: 'noor.ahmed@titan.edu',
    employeeId: 'EMP-TR-1006',
    campus: 'Sukkur Campus',
    phoneNumber: '+92 344 1213141',
    joiningDate: '2021-08-25',
    status: 'Active',
    gender: 'Male',
    qualification: 'MSc Cyber Security',
    experience: 8,
    salary: 98000,
    address: 'Sukkur, Sindh',
    profilePictureUrl: null,
  },
  {
    id: 7,
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@titan.edu',
    employeeId: 'EMP-TR-1007',
    campus: 'Other Campuses',
    phoneNumber: '+92 333 7778889',
    joiningDate: '2024-06-05',
    status: 'Active',
    gender: 'Female',
    qualification: 'MSc Artificial Intelligence',
    experience: 2,
    salary: 68000,
    address: 'Remote / Other',
    profilePictureUrl: null,
  },
  {
    id: 8,
    fullName: 'Bilal Ahmed',
    email: 'bilal.ahmed@titan.edu',
    employeeId: 'EMP-TR-1008',
    campus: 'Karachi Campus',
    phoneNumber: '+92 306 9990001',
    joiningDate: '2020-02-12',
    status: 'Active',
    gender: 'Male',
    qualification: 'MS Data Science',
    experience: 10,
    salary: 110000,
    address: 'Karachi, Sindh',
    profilePictureUrl: null,
  },
  {
    id: 9,
    fullName: 'Sara Khan',
    email: 'sara.khan@titan.edu',
    employeeId: 'EMP-TR-1009',
    campus: 'Lahore Campus',
    phoneNumber: '+92 309 4506789',
    joiningDate: '2023-12-01',
    status: 'Inactive',
    gender: 'Female',
    qualification: 'MSc UI/UX Design',
    experience: 4,
    salary: 70000,
    address: 'Lahore, Punjab',
    profilePictureUrl: null,
  },
  {
    id: 10,
    fullName: 'Abdul Rehman',
    email: 'abdul.rehman@titan.edu',
    employeeId: 'EMP-TR-1010',
    campus: 'Islamabad Campus',
    phoneNumber: '+92 320 2468135',
    joiningDate: '2022-07-14',
    status: 'Active',
    gender: 'Male',
    qualification: 'MS Software Engineering',
    experience: 6,
    salary: 86000,
    address: 'Islamabad',
    profilePictureUrl: null,
  },
];

let memoryDb = [...sampleTrainers];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getCampuses() {
  return CAMPUSES;
}

export async function listTrainers() {
  await delay(550);
  return memoryDb;
}

export async function createTrainer(payload) {
  await delay(250);
  const employeeId = payload.employeeId?.trim();
  if (memoryDb.some((t) => t.employeeId === employeeId)) {
    const err = new Error('Employee ID must be unique');
    err.code = 'DUP_EMP_ID';
    throw err;
  }

  const nextId = memoryDb.length ? Math.max(...memoryDb.map((t) => t.id)) + 1 : 1;
  const created = {
    id: nextId,
    ...payload,
    employeeId,
    fullName: payload.fullName?.trim(),
    email: payload.email?.trim(),
    phoneNumber: payload.phoneNumber?.trim(),
    address: payload.address?.trim(),
    qualification: payload.qualification?.trim(),
    campus: payload.campus?.trim(),
  };
  memoryDb = [created, ...memoryDb];
  return created;
}

export async function updateTrainer(id, payload) {
  await delay(250);
  const targetIndex = memoryDb.findIndex((t) => t.id === id);
  if (targetIndex === -1) return null;

  const employeeId = payload.employeeId?.trim();
  if (memoryDb.some((t) => t.id !== id && t.employeeId === employeeId)) {
    const err = new Error('Employee ID must be unique');
    err.code = 'DUP_EMP_ID';
    throw err;
  }

  const updated = {
    ...memoryDb[targetIndex],
    ...payload,
    id,
    employeeId,
    fullName: payload.fullName?.trim(),
    email: payload.email?.trim(),
    phoneNumber: payload.phoneNumber?.trim(),
    address: payload.address?.trim(),
    qualification: payload.qualification?.trim(),
    campus: payload.campus?.trim(),
  };

  memoryDb = memoryDb.map((t) => (t.id === id ? updated : t));
  return updated;
}

export async function deleteTrainer(id) {
  await delay(200);
  const before = memoryDb.length;
  memoryDb = memoryDb.filter((t) => t.id !== id);
  return memoryDb.length !== before;
}

