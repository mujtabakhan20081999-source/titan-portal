import { useState } from 'react';
import {
  Users, Clock, TrendingUp, Eye, Search,
  CheckCircle, XCircle, AlertCircle, BookOpen,
  ClipboardList, HelpCircle, BarChart2,
} from 'lucide-react';
import TopBar from '../components/TopBar';

/* ── static data ─────────────────────────────────── */

const studentsData = [
  { id: 1,  name: 'Abdul Jabbar',       roll: '477526', email: 'abjabbargopang@gmail.com',    status: 'ENROLLED', attendance: 92, course: 'MWAD' },
  { id: 2,  name: 'Abdul Rafay',        roll: '469955', email: 'rafaygameti0345@gmail.com',   status: 'ENROLLED', attendance: 88, course: 'MWAD' },
  { id: 3,  name: 'Abdul Salam Shaikh', roll: '475436', email: 'abdulsalam06699@gmail.com',   status: 'ENROLLED', attendance: 75, course: 'LGAL' },
  { id: 4,  name: 'Abdullah Khan',      roll: '470278', email: 'ak1636802@gmail.com',         status: 'ENROLLED', attendance: 95, course: 'MWAD' },
  { id: 5,  name: 'Aisha Siddiqui',     roll: '481234', email: 'aisha.s2345@gmail.com',       status: 'ENROLLED', attendance: 90, course: 'LGAL' },
  { id: 6,  name: 'Ali Hassan',         roll: '483421', email: 'ali.hassan456@gmail.com',     status: 'ENROLLED', attendance: 82, course: 'MWAD' },
  { id: 7,  name: 'Amna Fatima',        roll: '484567', email: 'amna.fatima789@gmail.com',    status: 'ENROLLED', attendance: 97, course: 'LGAL' },
  { id: 8,  name: 'Bilal Ahmed',        roll: '485678', email: 'bilal.a0345@gmail.com',       status: 'ENROLLED', attendance: 65, course: 'MWAD' },
  { id: 9,  name: 'Faisal Mehmood',     roll: '486789', email: 'faisal.m234@gmail.com',       status: 'ENROLLED', attendance: 88, course: 'MWAD' },
  { id: 10, name: 'Fatima Noor',        roll: '487890', email: 'fatima.noor12@gmail.com',     status: 'ENROLLED', attendance: 93, course: 'LGAL' },
  { id: 11, name: 'Hamid Raza',         roll: '488901', email: 'hamid.raza567@gmail.com',     status: 'ENROLLED', attendance: 78, course: 'MWAD' },
  { id: 12, name: 'Hassan Ali',         roll: '489012', email: 'hassan.ali890@gmail.com',     status: 'ENROLLED', attendance: 84, course: 'MWAD' },
  { id: 13, name: 'Hina Malik',         roll: '490123', email: 'hina.malik123@gmail.com',     status: 'ENROLLED', attendance: 91, course: 'LGAL' },
  { id: 14, name: 'Ibrahim Shah',       roll: '491234', email: 'ibrahim.shah456@gmail.com',   status: 'ENROLLED', attendance: 70, course: 'MWAD' },
  { id: 15, name: 'Imran Khan',         roll: '492345', email: 'imran.k2345@gmail.com',       status: 'ENROLLED', attendance: 86, course: 'MWAD' },
  { id: 16, name: 'Kashif Iqbal',       roll: '493456', email: 'kashif.iqbal@gmail.com',      status: 'ENROLLED', attendance: 79, course: 'LGAL' },
  { id: 17, name: 'Komal Shaukat',      roll: '494567', email: 'komal.shaukat@gmail.com',     status: 'ENROLLED', attendance: 96, course: 'LGAL' },
  { id: 18, name: 'Maria Khan',         roll: '495678', email: 'maria.khan999@gmail.com',     status: 'ENROLLED', attendance: 83, course: 'LGAL' },
  { id: 19, name: 'Muhammad Usman',     roll: '496789', email: 'musman2345@gmail.com',        status: 'ENROLLED', attendance: 72, course: 'MWAD' },
  { id: 20, name: 'Nadia Hussain',      roll: '497890', email: 'nadia.hussain@gmail.com',     status: 'ENROLLED', attendance: 89, course: 'LGAL' },
  { id: 21, name: 'Omar Farooq',        roll: '498901', email: 'omar.farooq@gmail.com',       status: 'ENROLLED', attendance: 94, course: 'MWAD' },
  { id: 22, name: 'Rabia Shahid',       roll: '499012', email: 'rabia.shahid@gmail.com',      status: 'ENROLLED', attendance: 87, course: 'LGAL' },
  { id: 23, name: 'Saad Nawaz',         roll: '500123', email: 'saad.nawaz123@gmail.com',     status: 'ENROLLED', attendance: 68, course: 'MWAD' },
  { id: 24, name: 'Sana Mirza',         roll: '501234', email: 'sana.mirza456@gmail.com',     status: 'ENROLLED', attendance: 98, course: 'LGAL' },
  { id: 25, name: 'Usman Ghani',        roll: '502345', email: 'usman.ghani789@gmail.com',    status: 'ENROLLED', attendance: 80, course: 'MWAD' },
];

const assignmentsData = [
  { id: 1, title: 'React JS Fundamentals',    course: 'MWAD', dueDate: '30 Jun 2026', submitted: 22, total: 30, status: 'Active'   },
  { id: 2, title: 'HTML & CSS Portfolio',     course: 'MWAD', dueDate: '25 Jun 2026', submitted: 28, total: 30, status: 'Active'   },
  { id: 3, title: 'JavaScript Basics Quiz',   course: 'LGAL', dueDate: '20 Jun 2026', submitted: 16, total: 18, status: 'Closed'   },
  { id: 4, title: 'Node.js REST API',         course: 'MWAD', dueDate: '10 Jul 2026', submitted: 5,  total: 30, status: 'Active'   },
  { id: 5, title: 'Creative AI Project',      course: 'LGAL', dueDate: '15 Jul 2026', submitted: 0,  total: 18, status: 'Upcoming' },
];

const quizzesData = [
  { id: 1, title: 'React Hooks & State',     course: 'MWAD', date: '25 Jun 2026', duration: '30 min', status: 'Scheduled', participants: 28 },
  { id: 2, title: 'CSS Flexbox & Grid',      course: 'MWAD', date: '18 Jun 2026', duration: '20 min', status: 'Completed', participants: 30 },
  { id: 3, title: 'Scratch Programming',     course: 'LGAL', date: '22 Jun 2026', duration: '15 min', status: 'Scheduled', participants: 12 },
  { id: 4, title: 'JavaScript ES6',          course: 'MWAD', date: '12 Jun 2026', duration: '25 min', status: 'Completed', participants: 29 },
  { id: 5, title: 'AI Concepts for Kids',    course: 'LGAL', date: '05 Jul 2026', duration: '20 min', status: 'Scheduled', participants: 0  },
];

const coursesProgress = [
  { id: 1, name: 'Modern Web Application Development', batch: 'Batch 3 – Female', enrolled: 30, progress: 25, present: 27, absent: 3  },
  { id: 2, name: 'Modern Web Application Development', batch: 'Batch 3 – Male',   enrolled: 30, progress: 25, present: 28, absent: 2  },
  { id: 3, name: 'Modern Web Application Development', batch: 'Batch 1 – Sukkur', enrolled: 30, progress: 10, present: 24, absent: 6  },
  { id: 4, name: 'Little Geniuses: Coding, Design & AI Fun Lab', batch: 'Batch 1 – Male',   enrolled: 4,  progress: 0,  present: 4,  absent: 0  },
  { id: 5, name: 'Little Geniuses: Coding, Design & AI Fun Lab', batch: 'Batch 1 – Female', enrolled: 8,  progress: 0,  present: 7,  absent: 1  },
  { id: 6, name: 'Little Geniuses: Coding, Design & AI Fun Lab', batch: 'Batch 1 – Female (2)', enrolled: 0, progress: 0, present: 0, absent: 0 },
];

const TABS = [
  { key: 'Students',        icon: <Users size={15} /> },
  { key: 'Attendance',      icon: <CheckCircle size={15} /> },
  { key: 'Assignments',     icon: <ClipboardList size={15} /> },
  { key: 'Quizzes',         icon: <HelpCircle size={15} /> },
  { key: 'Course Progress', icon: <BarChart2 size={15} /> },
];

/* ── helper: avatar initials ─────────────────────── */
function Avatar({ name, size = 34 }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const hue = name.charCodeAt(0) * 15;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 55%, 72%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── tab: Students ───────────────────────────────── */
function StudentsTab({ search }) {
  const filtered = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.includes(search) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
      {/* table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 2.5fr 1fr 80px',
        padding: '12px 20px', borderBottom: '1px solid #e8edf4',
        fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <span>Name</span><span>Roll Number</span><span>Email</span><span>Status</span><span>Action</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
          No students match your search.
        </div>
      ) : (
        filtered.map((s, i) => (
          <div key={s.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 2.5fr 1fr 80px',
            padding: '14px 20px', alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? '1px solid #f0f4fa' : 'none',
            background: i % 2 === 0 ? '#fff' : '#fafbff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={s.name} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{s.name}</span>
            </div>
            <span style={{ fontSize: 14, color: '#5F7A9E' }}>{s.roll}</span>
            <span style={{ fontSize: 13, color: '#5F7A9E' }}>{s.email}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
              border: '1.5px solid #2563eb', color: '#2563eb', borderRadius: 6,
              padding: '3px 10px', width: 'fit-content',
            }}>
              {s.status}
            </span>
            <button
              title="View student"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5F7A9E', cursor: 'pointer' }}
            >
              <Eye size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

/* ── tab: Attendance ─────────────────────────────── */
function AttendanceTab() {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const [marks, setMarks] = useState(() =>
    Object.fromEntries(studentsData.map((s) => [s.id, 'Present']))
  );
  const [saved, setSaved] = useState(false);

  const setMark = (id, val) => { setMarks((m) => ({ ...m, [id]: val })); setSaved(false); };

  const presentCount  = Object.values(marks).filter((v) => v === 'Present').length;
  const absentCount   = Object.values(marks).filter((v) => v === 'Absent').length;
  const lateCount     = Object.values(marks).filter((v) => v === 'Late').length;

  const btnStyle = (active, color) => ({
    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    border: `1.5px solid ${active ? color : '#e0e6f0'}`,
    background: active ? color : 'transparent',
    color: active ? '#fff' : '#aab4c4',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'Present', count: presentCount,  color: '#16a34a' },
            { label: 'Absent',  count: absentCount,   color: '#dc2626' },
            { label: 'Late',    count: lateCount,     color: '#d97706' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '8px 18px', border: '1px solid #e8edf4', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: '#5F7A9E', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#5F7A9E' }}>Date: <strong style={{ color: '#10375C' }}>{today}</strong></span>
          <button
            onClick={() => setSaved(true)}
            style={{
              background: '#2563eb', color: '#fff', borderRadius: 8,
              padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
            {saved ? 'Saved!' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 160px',
          padding: '12px 20px', borderBottom: '1px solid #e8edf4',
          fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span>Name</span><span>Roll Number</span><span>Mark Attendance</span>
        </div>
        {studentsData.map((s, i) => (
          <div key={s.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 160px',
            padding: '12px 20px', alignItems: 'center',
            borderBottom: i < studentsData.length - 1 ? '1px solid #f0f4fa' : 'none',
            background: i % 2 === 0 ? '#fff' : '#fafbff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={s.name} size={30} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{s.name}</span>
            </div>
            <span style={{ fontSize: 13, color: '#5F7A9E' }}>{s.roll}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={btnStyle(marks[s.id] === 'Present', '#16a34a')} onClick={() => setMark(s.id, 'Present')}>P</button>
              <button style={btnStyle(marks[s.id] === 'Absent',  '#dc2626')} onClick={() => setMark(s.id, 'Absent')}>A</button>
              <button style={btnStyle(marks[s.id] === 'Late',    '#d97706')} onClick={() => setMark(s.id, 'Late')}>L</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── tab: Assignments ────────────────────────────── */
function AssignmentsTab() {
  const statusColor = { Active: '#2563eb', Closed: '#6b7280', Upcoming: '#d97706' };
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr 100px',
        padding: '12px 20px', borderBottom: '1px solid #e8edf4',
        fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <span>Title</span><span>Course</span><span>Due Date</span><span>Submissions</span><span>Status</span>
      </div>
      {assignmentsData.map((a, i) => (
        <div key={a.id} style={{
          display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr 100px',
          padding: '16px 20px', alignItems: 'center',
          borderBottom: i < assignmentsData.length - 1 ? '1px solid #f0f4fa' : 'none',
          background: i % 2 === 0 ? '#fff' : '#fafbff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={16} color="#2563eb" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{a.title}</span>
          </div>
          <span style={{
            display: 'inline-flex', padding: '3px 8px', borderRadius: 6,
            fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb',
          }}>{a.course}</span>
          <span style={{ fontSize: 13, color: '#5F7A9E' }}>{a.dueDate}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, background: '#e8edf4', borderRadius: 999, height: 6, overflow: 'hidden', maxWidth: 100 }}>
              <div style={{
                width: `${a.total > 0 ? (a.submitted / a.total) * 100 : 0}%`,
                height: '100%', background: '#16a34a', borderRadius: 999,
              }} />
            </div>
            <span style={{ fontSize: 12, color: '#5F7A9E', whiteSpace: 'nowrap' }}>{a.submitted}/{a.total}</span>
          </div>
          <span style={{
            display: 'inline-flex', padding: '3px 10px', borderRadius: 6,
            fontSize: 11, fontWeight: 700, border: `1.5px solid ${statusColor[a.status]}`,
            color: statusColor[a.status], background: 'transparent', width: 'fit-content',
          }}>{a.status}</span>
        </div>
      ))}
    </div>
  );
}

/* ── tab: Quizzes ────────────────────────────────── */
function QuizzesTab() {
  const statusColor = { Scheduled: '#2563eb', Completed: '#16a34a' };
  const statusBg    = { Scheduled: '#eff6ff',  Completed: '#f0fdf4'  };
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr 1fr 100px',
        padding: '12px 20px', borderBottom: '1px solid #e8edf4',
        fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <span>Quiz Title</span><span>Course</span><span>Date</span><span>Duration</span><span>Participants</span><span>Status</span>
      </div>
      {quizzesData.map((q, i) => (
        <div key={q.id} style={{
          display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr 1fr 100px',
          padding: '16px 20px', alignItems: 'center',
          borderBottom: i < quizzesData.length - 1 ? '1px solid #f0f4fa' : 'none',
          background: i % 2 === 0 ? '#fff' : '#fafbff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={16} color="#9333ea" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{q.title}</span>
          </div>
          <span style={{
            display: 'inline-flex', padding: '3px 8px', borderRadius: 6,
            fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb',
          }}>{q.course}</span>
          <span style={{ fontSize: 13, color: '#5F7A9E' }}>{q.date}</span>
          <span style={{ fontSize: 13, color: '#5F7A9E' }}>{q.duration}</span>
          <span style={{ fontSize: 13, color: '#10375C', fontWeight: 600 }}>{q.participants}</span>
          <span style={{
            display: 'inline-flex', padding: '3px 10px', borderRadius: 6,
            fontSize: 11, fontWeight: 700,
            background: statusBg[q.status], color: statusColor[q.status],
            width: 'fit-content',
          }}>{q.status}</span>
        </div>
      ))}
    </div>
  );
}

/* ── tab: Course Progress ────────────────────────── */
function CourseProgressTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {coursesProgress.map((c, i) => {
        const attendanceRate = c.enrolled > 0 ? Math.round((c.present / c.enrolled) * 100) : 0;
        return (
          <div key={c.id} style={{
            background: '#fff', borderRadius: 16, border: '1px solid #e8edf4',
            padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={17} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#10375C' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#5F7A9E' }}>{c.batch} · {c.enrolled} students</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Course Progress', value: `${c.progress}%`, color: '#2563eb' },
                  { label: 'Attendance Rate', value: `${attendanceRate}%`, color: '#16a34a' },
                  { label: 'Present Today',   value: c.present, color: '#16a34a' },
                  { label: 'Absent Today',    value: c.absent,  color: '#dc2626' },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#5F7A9E' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#5F7A9E' }}>Course Completion</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10375C' }}>{c.progress}%</span>
              </div>
              <div style={{ background: '#e8edf4', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                <div style={{ width: `${c.progress}%`, height: '100%', background: '#2563eb', borderRadius: 999, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── main component ──────────────────────────────── */
function TeacherAttendance() {
  const [activeTab, setActiveTab] = useState('Students');
  const [search, setSearch] = useState('');

  const totalStudents  = studentsData.length;
  const avgAttendance  = Math.round(studentsData.reduce((s, x) => s + x.attendance, 0) / totalStudents);
  const presentToday   = studentsData.filter((s) => s.attendance >= 75).length;
  const todayPct       = Math.round((presentToday / totalStudents) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName="Sir Yasir Ali"
        userRole="Trainer"
        pageTitle="Student Attendance"
        pageSubtitle="View and manage student attendance records."
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: <Users size={22} color="#2563eb" />, bg: '#dbeafe', value: totalStudents, label: 'Total Students', sub: 'Active Enrollments' },
            { icon: <Clock size={22} color="#0891b2" />, bg: '#cffafe', value: `${todayPct}%`,  label: "Today's Attendance",  sub: 'Present Today'      },
            { icon: <TrendingUp size={22} color="#059669" />, bg: '#d1fae5', value: `${avgAttendance}%`, label: 'This Month Average', sub: 'Attendance Rate' },
          ].map((s) => (
            <div key={s.label} className="card card-padding" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#10375C', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#10375C', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#5F7A9E', marginTop: 1 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search row */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', borderBottom: '1px solid #e8edf4', flexWrap: 'wrap', gap: 8,
          }}>
            {/* tab buttons */}
            <div style={{ display: 'flex', gap: 0 }}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '14px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    color: activeTab === t.key ? '#2563eb' : '#5F7A9E',
                    background: 'transparent', border: 'none',
                    borderBottom: activeTab === t.key ? '2.5px solid #2563eb' : '2.5px solid transparent',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {t.icon}
                  {t.key}
                </button>
              ))}
            </div>

            {/* search */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f4f6ff', borderRadius: 8, padding: '7px 14px',
              border: '1px solid #e8edf4', my: 8,
            }}>
              <Search size={15} color="#5F7A9E" />
              <input
                type="search"
                placeholder="Search Students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 13, color: '#10375C', width: 180,
                }}
              />
            </label>
          </div>

          {/* tab content */}
          <div style={{ padding: 20 }}>
            {activeTab === 'Students'        && <StudentsTab search={search} />}
            {activeTab === 'Attendance'      && <AttendanceTab />}
            {activeTab === 'Assignments'     && <AssignmentsTab />}
            {activeTab === 'Quizzes'         && <QuizzesTab />}
            {activeTab === 'Course Progress' && <CourseProgressTab />}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TeacherAttendance;
