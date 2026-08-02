import { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  Building2,
  UserCog,
  CalendarClock,
  Megaphone,
  Eye,
  Pencil,
  Plus,
  Download,
  SlidersHorizontal,
  RotateCcw,
  CalendarDays,
  Wallet,
  ClipboardList,
  HelpCircle,
} from 'lucide-react';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import AdminSupport from '../components/admin/AdminSupport';
import AdminReports from '../components/admin/AdminReports';
import AdminAttendance from '../components/admin/AdminAttendance';
import AdminSlots from '../components/admin/AdminSlots';
import AdminUpdation from '../components/admin/AdminUpdation';
import AdminProfile from '../components/admin/AdminProfile';
import AdminTrainerPortal from '../components/admin/AdminTrainerPortal';
import AdminStudentPortal from '../components/admin/AdminStudentPortal';
import AdminSettings from '../components/admin/AdminSettings';
import AdminPermissions from '../components/admin/AdminPermissions';
import Trainers from './Trainers';
import Students from './Students';
import AuditLogs from './AuditLogs';
import { listStudents } from '../services/studentService';
import { listTrainers } from '../services/trainerService';
import { listSlots } from '../services/slotService';
import { listAttendance } from '../services/attendanceService';
import { listPayments } from '../services/paymentService';
import { getDashboard } from '../services/adminService';

import '../styles/admin.css';

// Topbar copy per sidebar page. Dashboard's subtitle is filled in at render time.
const PAGE_META = {
  Dashboard: { title: 'Dashboard', subtitle: '' },
  Students: { title: 'Students', subtitle: 'All campuses student directory' },
  Attendance: { title: 'Attendance', subtitle: 'Mark & review student attendance' },
  'Administration (Slots)': { title: 'Administration', subtitle: 'Class slots & schedules' },
  Updation: { title: 'Updation', subtitle: 'Bulk update student status' },
  Profile: { title: 'My Profile', subtitle: 'Your profile & permissions' },
  'Trainer Portal': { title: 'Trainer Portal', subtitle: 'Trainer overview' },
  'Student Portal': { title: 'Student Portal', subtitle: 'Student dashboard' },
  Settings: { title: 'Settings', subtitle: 'System configuration' },
  'Audit Logs': { title: 'Audit Logs', subtitle: 'System activity log' },
  Support: { title: 'Support', subtitle: 'Help & assistance center' },
  Permissions: { title: 'Permissions', subtitle: 'Manage role permissions' },
};

const stats = [
  {
    key: 'students',
    icon: Users,
    value: '4,658',
    label: 'Total Students',
    sub: 'All Time',
    bg: '#dbeafe',
    color: '#2563eb',
  },
  {
    key: 'enrolled',
    icon: GraduationCap,
    value: '2,945',
    label: 'Enrolled Students',
    sub: 'Currently Active',
    bg: '#dcfce7',
    color: '#16a34a',
  },
  {
    key: 'courses',
    icon: BookOpen,
    value: '56',
    label: 'Courses',
    sub: 'Total Courses',
    bg: '#ede9fe',
    color: '#7c3aed',
  },
  {
    key: 'cities',
    icon: MapPin,
    value: '12',
    label: 'Cities',
    sub: 'Active Cities',
    bg: '#fef3c7',
    color: '#d97706',
  },
  {
    key: 'campuses',
    icon: Building2,
    value: '24',
    label: 'Campuses',
    sub: 'Active Campuses',
    bg: '#e0f2fe',
    color: '#0891b2',
  },
  {
    key: 'trainers',
    icon: UserCog,
    value: '142',
    label: 'Trainers',
    sub: 'Active Trainers',
    bg: '#dbeafe',
    color: '#1150c0',
  },
  {
    key: 'slots',
    icon: CalendarClock,
    value: '87',
    label: 'Active Slots',
    sub: 'Running',
    bg: '#f0fdf4',
    color: '#16a34a',
  },
];

// Per-city figures shown when a sub-admin opens a single city's panel.
const CITY_DATA = {
  Sukkur:    { students: 1345, enrolled: 842, courses: 18, campuses: 6, trainers: 38, slots: 24 },
  Karachi:   { students: 986,  enrolled: 607, courses: 15, campuses: 5, trainers: 32, slots: 19 },
  Lahore:    { students: 754,  enrolled: 480, courses: 14, campuses: 4, trainers: 26, slots: 15 },
  Islamabad: { students: 632,  enrolled: 399, courses: 12, campuses: 3, trainers: 22, slots: 12 },
  Multan:    { students: 521,  enrolled: 318, courses: 10, campuses: 2, trainers: 18, slots: 10 },
};

const campuses = [
  { label: 'Sukkur Campus', value: 1345, color: '#0A3D91' },
  { label: 'Karachi Campus', value: 986, color: '#1150c0' },
  { label: 'Lahore Campus', value: 754, color: '#2563eb' },
  { label: 'Islamabad Campus', value: 632, color: '#3b82f6' },
  { label: 'Multan Campus', value: 521, color: '#60a5fa' },
  { label: 'Other Campuses', value: 420, color: '#F3C623' },
];

const courses = [
  { label: 'AI', value: 812 },
  { label: 'Web Dev', value: 694 },
  { label: 'Python', value: 612 },
  { label: 'Graphic Des.', value: 508 },
  { label: 'Data Science', value: 458 },
  { label: 'Cyber Sec.', value: 412 },
  { label: 'UI/UX', value: 376 },
  { label: 'Digital Mkt.', value: 301 },
  { label: 'Mobile App', value: 268 },
  { label: 'Other', value: 214 },
];

const students = [
  {
    roll: 'AI-24-001',
    name: 'Anas Hassan',
    father: 'Hassan Ali',
    cnic: '45601-1234567-1',
    phone: '0300-1234567',
    course: 'Artificial Intelligence',
    meta: 'Batch 01 / Morning',
    status: 'Enrolled',
    pay: 'Paid',
    av: '#2563eb',
  },
  {
    roll: 'WD-24-015',
    name: 'Zainab Fatima',
    father: 'Muhammad Iqbal',
    cnic: '42201-7654321-2',
    phone: '0345-9876543',
    course: 'Web Development',
    meta: 'Batch 02 / Evening',
    status: 'Enrolled',
    pay: 'Pending',
    av: '#db2777',
  },
  {
    roll: 'PY-24-032',
    name: 'Muhammad Usman',
    father: 'Usman Bhai',
    cnic: '38401-2345678-3',
    phone: '0312-1112223',
    course: 'Python Programming',
    meta: 'Batch 01 / Morning',
    status: 'Enrolled',
    pay: 'Paid',
    av: '#16a34a',
  },
  {
    roll: 'DS-24-008',
    name: 'Ayesha Siddiqui',
    father: 'Abdul Rehman',
    cnic: '40102-3456789-4',
    phone: '0301-7773332',
    course: 'Data Science',
    meta: 'Batch 03 / Evening',
    status: 'Enrolled',
    pay: 'Not Generated',
    av: '#d97706',
  },
];

const filters = [
  { label: 'City', value: 'All Cities' },
  { label: 'Campus', value: 'All Campuses' },
  { label: 'Course', value: 'All Courses' },
  { label: 'Batch', value: 'All Batches' },
  { label: 'Slot', value: 'All Slots' },
  { label: 'Status', value: 'All Statuses' },
  { label: 'Payment Status', value: 'All Payment Statuses' },
];

function DonutChart({ data, total }) {
  let acc = 0;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <g transform="rotate(-90 75 75)">
        {data.map((s) => {
          const pct = (s.value / total) * 100;
          const el = (
            <circle
              key={s.label}
              cx="75"
              cy="75"
              r="55"
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              pathLength="100"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-acc}
            />
          );
          acc += pct;
          return el;
        })}
      </g>
      <text x="75" y="70" textAnchor="middle" fontSize="22" fontWeight="800" fill="#10375C">
        {total.toLocaleString()}
      </text>
      <text x="75" y="90" textAnchor="middle" fontSize="11" fill="#7286a3">
        Students
      </text>
    </svg>
  );
}

function MiniCard({ icon: Icon, iconColor, iconBg, title, sub, items }) {
  return (
    <div className="acard">
      <div className="acard-head" style={{ marginBottom: 10 }}>
        <div>
          <div className="acard-title" style={{ fontSize: 14 }}>
            {title}
          </div>
          <div style={{ fontSize: 11.5, color: '#7286a3', marginTop: 2 }}>{sub}</div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={17} color={iconColor} />
        </div>
      </div>

      <div className="amini-stats">
        {items.map((it) => (
          <div key={it.label} className="amini-item">
            <div className="amini-val" style={{ color: it.color }}>
              {it.value}
            </div>
            <div className="amini-label">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPanel({ admin, onLogout, onChangeCity }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [databaseStudents, setDatabaseStudents] = useState([]);
  const [databaseTrainers, setDatabaseTrainers] = useState([]);
  const [databaseSlots, setDatabaseSlots] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [permissions, setPermissions] = useState(admin?.permissions || {});
  const [campusSort, setCampusSort] = useState('desc');
  const [courseSort, setCourseSort] = useState('desc');
  const [campusPage, setCampusPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [regOpenCount, setRegOpenCount] = useState(0);
  const chartPageSize = 5;

  useEffect(() => {
    setPermissions(admin?.permissions || {});
  }, [admin]);

  useEffect(() => {
    Promise.all([listStudents(), listTrainers(), listSlots(), listAttendance(), listPayments(), getDashboard().catch(() => null)])
      .then(([studentRows, trainerRows, slotRows, attendanceRows, paymentRows, dash]) => {
        setDatabaseStudents(studentRows || []);
        setDatabaseTrainers(trainerRows || []);
        setDatabaseSlots(slotRows || []);
        setAttendanceRecords(attendanceRows || []);
        setPaymentRecords(paymentRows || []);
        setRegOpenCount(dash?.stats?.regOpen ?? (slotRows || []).filter((s) => s.status === 'Open').length);
      })
      .catch(() => {
        setDatabaseStudents([]);
        setDatabaseTrainers([]);
        setDatabaseSlots([]);
        setAttendanceRecords([]);
        setPaymentRecords([]);
        setRegOpenCount(0);
      });
  }, []);

  const roleLabel = admin?.role === 'subadmin' ? 'Sub Admin' : 'Super Admin';
  const city = admin?.city || null;
  const cityData = city ? CITY_DATA[city] : null;

  // City-scoped stat cards for sub-admins; the global list for super admin.
  const displayStats = stats
    .filter((s) => !cityData || s.key !== 'cities')
    .map((s) => (cityData && cityData[s.key] != null
      ? { ...s, value: cityData[s.key].toLocaleString(), sub: `${city} Region` }
      : s))
    .map((s) => {
      const values = {
        students: databaseStudents.length,
        enrolled: databaseStudents.filter((student) => student.status === 'Enrolled').length,
        courses: new Set(databaseStudents.map((student) => student.course).filter(Boolean)).size,
        cities: new Set(databaseStudents.map((student) => student.city).filter(Boolean)).size,
        campuses: new Set(databaseStudents.map((student) => student.city).filter(Boolean)).size,
        trainers: databaseTrainers.length,
        slots: databaseSlots.length,
      };
      return { ...s, value: (values[s.key] ?? 0).toLocaleString(), sub: 'Live database' };
    });

  const donutCampusesAll = Object.entries(databaseStudents.reduce((counts, student) => {
    const campus = student.city || student.campus || 'Unassigned';
    counts[campus] = (counts[campus] || 0) + 1;
    return counts;
  }, {}))
    .map(([label, value], index) => ({ label, value, color: ['#0A3D91', '#2563eb', '#16a34a', '#d97706', '#7c3aed'][index % 5] }))
    .sort((a, b) => (campusSort === 'asc' ? a.value - b.value : b.value - a.value));

  const campusTotalPages = Math.max(1, Math.ceil(donutCampusesAll.length / chartPageSize));
  const donutCampuses = donutCampusesAll.slice((campusPage - 1) * chartPageSize, campusPage * chartPageSize);
  const totalStudents = donutCampusesAll.reduce((s, c) => s + c.value, 0);

  const dashboardCoursesAll = Object.entries(databaseStudents.reduce((counts, student) => {
    const course = student.course || 'Unassigned';
    counts[course] = (counts[course] || 0) + 1;
    return counts;
  }, {}))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => (courseSort === 'asc' ? a.value - b.value : b.value - a.value));

  const courseTotalPages = Math.max(1, Math.ceil(dashboardCoursesAll.length / chartPageSize));
  const dashboardCourses = dashboardCoursesAll.slice((coursePage - 1) * chartPageSize, coursePage * chartPageSize);
  const maxCourse = Math.max(1, ...dashboardCourses.map((c) => c.value), 1);

  const attendanceCounts = attendanceRecords.reduce((counts, record) => {
    const status = record.status || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const presentCount = attendanceCounts.Present || 0;
  const leaveCount = attendanceCounts.Leave || 0;
  const absentCount = attendanceCounts.Absent || 0;

  const collectedTotal = paymentRecords
    .filter((payment) => payment.status === 'PAID')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingTotal = paymentRecords
    .filter((payment) => payment.status === 'UNPAID')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const assignmentsSubmitted = databaseStudents.filter((student) => student.status === 'Enrolled').length;
  const assignmentsPending = databaseStudents.filter((student) => student.status === 'Dropped').length;
  const quizzesConducted = databaseSlots.length;
  const quizzesPending = databaseTrainers.filter((trainer) => trainer.status !== 'Active').length;

  const payBadge = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };

  // Pages that render a self-contained component inside the standard content wrapper.
  const PAGE_COMPONENTS = {
    Students: <Students />,
    Attendance: <AdminAttendance />,
    'Administration (Slots)': <AdminSlots city={city} />,
    Updation: <AdminUpdation />,
    Profile: <AdminProfile admin={admin} />,
    'Trainer Portal': <AdminTrainerPortal />,
    'Student Portal': <AdminStudentPortal />,
    Settings: <AdminSettings />,
    'Audit Logs': <AuditLogs admin={admin} />,
    Support: <AdminSupport />,
    Permissions: <AdminPermissions />,
  };

  const renderBody = () => {
    // Reports & Trainers manage their own headers (topbar hidden below).
    if (active === 'Reports') {
      return <AdminReports />;
    }

    if (active === 'Trainers') {
      return (
        <div className="admin-content">
          <Trainers />
        </div>
      );
    }

    if (PAGE_COMPONENTS[active]) {
      return <div className="admin-content">{PAGE_COMPONENTS[active]}</div>;
    }

    return (
      <div className="admin-content">
        <div className="admin-stats">
          {displayStats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="astat" key={s.label}>
                <div className="astat-icon" style={{ background: s.bg }}>
                  <Icon size={22} color={s.color} />
                </div>
                <div>
                  <div className="astat-val">{s.value}</div>
                  <div className="astat-label">{s.label}</div>
                  <div className="astat-sub">{s.sub}</div>
                </div>
              </div>
            );
          })}

          <div className="astat gold">
            <div className="astat-icon">
              <Megaphone size={22} color="#4a2f00" />
            </div>
            <div>
              <div className="astat-val">{regOpenCount.toLocaleString()}</div>
              <div className="astat-label">Registration Open</div>
              <div className="astat-sub">Slots Open</div>
            </div>
          </div>
        </div>

        <div className="admin-2col">
          <div className="acard">
            <div className="acard-head">
              <span className="acard-title">Students Per Campus</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select className="afilter-select" style={{ width: 'auto', minWidth: 120 }} value={campusSort} onChange={(e) => { setCampusSort(e.target.value); setCampusPage(1); }}>
                  <option value="desc">High → Low</option>
                  <option value="asc">Low → High</option>
                </select>
                <span style={{ fontSize: 12, color: '#7286a3' }}>Page {Math.min(campusPage, campusTotalPages)}/{campusTotalPages}</span>
              </div>
            </div>
            <div className="donut-row">
              <DonutChart data={donutCampuses} total={totalStudents} />
              <div className="donut-legend">
                {donutCampuses.map((c) => (
                  <div className="donut-leg-item" key={c.label}>
                    <span className="donut-leg-dot" style={{ background: c.color }} />
                    {c.label}
                    <span className="donut-leg-val">{c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn-ghost" type="button" disabled={campusPage <= 1} onClick={() => setCampusPage((p) => p - 1)}>Prev</button>
              <button className="btn-ghost" type="button" disabled={campusPage >= campusTotalPages} onClick={() => setCampusPage((p) => p + 1)}>Next</button>
            </div>
          </div>

          <div className="acard">
            <div className="acard-head">
              <span className="acard-title">Students Per Course</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select className="afilter-select" style={{ width: 'auto', minWidth: 120 }} value={courseSort} onChange={(e) => { setCourseSort(e.target.value); setCoursePage(1); }}>
                  <option value="desc">High → Low</option>
                  <option value="asc">Low → High</option>
                </select>
                <span style={{ fontSize: 12, color: '#7286a3' }}>Page {Math.min(coursePage, courseTotalPages)}/{courseTotalPages}</span>
              </div>
            </div>
            <div className="barchart">
              {dashboardCourses.map((c) => (
                <div className="bar-col" key={c.label}>
                  <span className="bar-val">{c.value}</span>
                  <div className="bar-fill" style={{ height: `${(c.value / maxCourse) * 140}px` }} />
                  <span className="bar-label">{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn-ghost" type="button" disabled={coursePage <= 1} onClick={() => setCoursePage((p) => p - 1)}>Prev</button>
              <button className="btn-ghost" type="button" disabled={coursePage >= courseTotalPages} onClick={() => setCoursePage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>

        <div className="admin-tablewrap">
          <div className="acard" style={{ padding: 0 }}>
            <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
              <div>
                <span className="acard-title">Students</span>
                <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>
                  Manage and view all regional students
                </div>
              </div>
              <div className="acard-tools">
                <button className="btn-primary">
                  <Plus size={15} /> Add Student
                </button>
                <button className="btn-ghost">
                  <Download size={15} /> Export CSV
                </button>
              </div>
            </div>

            <div className="admin-scroll-x">
              <div className="atable">
                <div className="atable-head">
                  <span>Roll No</span>
                  <span>Name</span>
                  <span>CNIC</span>
                  <span>Phone</span>
                  <span>Course / Batch</span>
                  <span>Status</span>
                  <span>Payment</span>
                  <span>Action</span>
                </div>

                {databaseStudents.map((s, index) => (
                  <div className="atable-row" key={s.roll}>
                    <span className="atable-cell-strong">{s.roll}</span>
                    <div className="atable-name">
                      <div className="atable-av" style={{ background: ['#2563eb', '#db2777', '#16a34a', '#d97706'][index % 4] }}>
                        {s.name
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="atable-cell-strong">{s.name}</div>
                        <div className="atable-cell-sub">{s.father}</div>
                      </div>
                    </div>
                    <span className="atable-cell">{s.cnic}</span>
                    <span className="atable-cell">{s.phone}</span>
                    <div>
                      <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>
                        {s.course}
                      </div>
                      <div className="atable-cell-sub">{s.meta}</div>
                    </div>
                    <span className="badge badge-blue">{s.status}</span>
                    <span className={`badge ${payBadge[s.pay]}`}>{s.pay}</span>
                    <div className="atable-actions">
                      <button title="View">
                        <Eye size={16} />
                      </button>
                      <button title="Edit">
                        <Pencil size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-head" style={{ marginBottom: 14 }}>
              <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <SlidersHorizontal size={16} color="#0A3D91" /> Filters
              </span>
              <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 11.5 }}>
                <RotateCcw size={13} /> Clear All
              </button>
            </div>

            <div className="afilter-group">
              <label className="afilter-label">Date Range</label>
              <input className="afilter-input" defaultValue="01 May 2026 - 31 May 2026" readOnly />
            </div>

            {filters.map((f) => (
              <div className="afilter-group" key={f.label}>
                <label className="afilter-label">{f.label}</label>
                <select className="afilter-select" defaultValue="all">
                  <option value="all">{f.value}</option>
                </select>
              </div>
            ))}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
              Apply Filters
            </button>
          </div>
        </div>

        <div className="admin-4col">
          <MiniCard
            icon={CalendarDays}
            iconColor="#2563eb"
            iconBg="#dbeafe"
            title="Today's Attendance"
            sub="All Campuses"
            items={[
              { label: 'Present', value: presentCount.toLocaleString(), color: '#16a34a' },
              { label: 'Leave', value: leaveCount.toLocaleString(), color: '#d97706' },
              { label: 'Absent', value: absentCount.toLocaleString(), color: '#dc2626' },
            ]}
          />

          <MiniCard
            icon={Wallet}
            iconColor="#16a34a"
            iconBg="#dcfce7"
            title="Fee Summary"
            sub="This Month"
            items={[
              { label: 'Collected', value: `Rs ${collectedTotal.toLocaleString('en-PK')}`, color: '#16a34a' },
              { label: 'Pending', value: `Rs ${pendingTotal.toLocaleString('en-PK')}`, color: '#dc2626' },
            ]}
          />

          <MiniCard
            icon={ClipboardList}
            iconColor="#7c3aed"
            iconBg="#ede9fe"
            title="Assignments"
            sub="Current term"
            items={[
              { label: 'Submitted', value: databaseStudents.filter((student) => student.pay === 'Paid').length.toLocaleString(), color: '#2563eb' },
              { label: 'Pending', value: databaseStudents.filter((student) => student.pay !== 'Paid').length.toLocaleString(), color: '#d97706' },
            ]}
          />

          <MiniCard
            icon={HelpCircle}
            iconColor="#0891b2"
            iconBg="#e0f2fe"
            title="Quizzes"
            sub="Live schedule"
            items={[
              { label: 'Conducted', value: databaseSlots.length.toLocaleString(), color: '#2563eb' },
              { label: 'Pending', value: databaseTrainers.filter((trainer) => trainer.status !== 'Active').length.toLocaleString(), color: '#d97706' },
            ]}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="admin-app">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        active={active}
        permissions={permissions}
        role={admin?.role || 'superadmin'}
        onSelect={(l) => {
          setActive(l);
          setSidebarOpen(false);
        }}
      />

      <div className={`admin-backdrop${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="admin-main">
        {active !== 'Trainers' && active !== 'Reports' && (
          <AdminTopBar
            title={PAGE_META[active]?.title || 'Dashboard'}
            subtitle={
              active === 'Dashboard' || !PAGE_META[active]
                ? `Welcome back, ${roleLabel}!${city ? ` Managing ${city} region.` : ''}`
                : PAGE_META[active].subtitle
            }
            roleLabel={roleLabel}
            city={city}
            onChangeCity={onChangeCity}
            onMenu={() => setSidebarOpen(true)}
            onLogout={onLogout}
          />
        )}

        {renderBody()}
      </div>
    </div>
  );
}

export default AdminPanel;

