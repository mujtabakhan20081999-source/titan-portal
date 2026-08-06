import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users, Clock, TrendingUp, Eye, Search,
  CheckCircle, XCircle, AlertCircle, BookOpen,
  ClipboardList, HelpCircle, BarChart2,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { listStudents } from '../services/studentService';
import { listAttendance, createAttendance } from '../services/attendanceService';
import { getMyTrainerRoster } from '../services/trainerService';

const TABS = [
  { key: 'Students',        icon: <Users size={15} /> },
  { key: 'Attendance',      icon: <CheckCircle size={15} /> },
  { key: 'Assignments',     icon: <ClipboardList size={15} /> },
  { key: 'Quizzes',         icon: <HelpCircle size={15} /> },
  { key: 'Course Progress', icon: <BarChart2 size={15} /> },
];

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

function StudentsTab({ search, students }) {
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase()) ||
    (s.cnic || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="table-scroll">
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 2.5fr 1fr 80px',
        padding: '12px 20px', borderBottom: '1px solid #e8edf4',
        fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <span>Name</span><span>Roll Number</span><span>CNIC</span><span>Status</span><span>Action</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
          No students match your search.
        </div>
      ) : (
        filtered.map((s, i) => (
          <div key={s._id || s.roll} style={{
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
            <span style={{ fontSize: 13, color: '#5F7A9E' }}>{s.cnic || ''}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
              border: '1.5px solid #2563eb', color: '#2563eb', borderRadius: 6,
              padding: '3px 10px', width: 'fit-content',
            }}>
              {s.status || 'ENROLLED'}
            </span>
            <button title="View student"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5F7A9E', cursor: 'pointer' }}
            >
              <Eye size={16} />
            </button>
          </div>
        ))
      )}
    </div>
    </div>
  );
}

function AttendanceTab({ students, attendanceRecords, onRefresh }) {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMarks(Object.fromEntries(students.map((s) => [s._id || s.roll, 'Present'])));
    setSaved(false);
  }, [students]);

  const setMark = (id, val) => { setMarks((m) => ({ ...m, [id]: val })); setSaved(false); };

  const presentCount = Object.values(marks).filter((v) => v === 'Present').length;
  const absentCount  = Object.values(marks).filter((v) => v === 'Absent').length;
  const lateCount    = Object.values(marks).filter((v) => v === 'Late').length;

  const saveAttendance = async () => {
    setSaving(true);
    try {
      for (const student of students) {
        const id = student._id || student.roll;
        const status = marks[id];
        await createAttendance({
          studentId: student.roll,
          studentName: student.name,
          trainerName: 'Teacher',
          date: new Date(),
          status,
          remarks: '',
        });
      }
      setSaved(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  const btnStyle = (active, color) => ({
    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    border: `1.5px solid ${active ? color : '#e0e6f0'}`,
    background: active ? color : 'transparent',
    color: active ? '#fff' : '#aab4c4',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            onClick={saveAttendance}
            disabled={saving}
            style={{
              background: '#2563eb', color: '#fff', borderRadius: 8,
              padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="table-scroll">
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 160px',
          padding: '12px 20px', borderBottom: '1px solid #e8edf4',
          fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span>Name</span><span>Roll Number</span><span>Mark Attendance</span>
        </div>
        {students.map((s, i) => {
          const id = s._id || s.roll;
          return (
            <div key={id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 160px',
              padding: '12px 20px', alignItems: 'center',
              borderBottom: i < students.length - 1 ? '1px solid #f0f4fa' : 'none',
              background: i % 2 === 0 ? '#fff' : '#fafbff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={s.name} size={30} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{s.name}</span>
              </div>
              <span style={{ fontSize: 13, color: '#5F7A9E' }}>{s.roll}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnStyle(marks[id] === 'Present', '#16a34a')} onClick={() => setMark(id, 'Present')}>P</button>
                <button style={btnStyle(marks[id] === 'Absent', '#dc2626')} onClick={() => setMark(id, 'Absent')}>A</button>
                <button style={btnStyle(marks[id] === 'Late', '#d97706')} onClick={() => setMark(id, 'Late')}>L</button>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function AssignmentsTab() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
      Assignments module coming soon — data will be managed from the admin panel.
    </div>
  );
}

function QuizzesTab() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
      Quizzes module coming soon — data will be managed from the admin panel.
    </div>
  );
}

function CourseProgressTab({ students, attendanceRecords }) {
  const courses = useMemo(() => {
    const map = {};
    (students || []).forEach((s) => {
      const course = s.course || 'Unassigned';
      if (!map[course]) map[course] = { name: course, enrolled: 0, present: 0, absent: 0 };
      map[course].enrolled += 1;
    });
    return Object.values(map);
  }, [students]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {courses.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
          No course data available.
        </div>
      ) : courses.map((c, i) => {
        const attendanceRate = c.enrolled > 0 ? Math.round((c.present / c.enrolled) * 100) : 0;
        return (
          <div key={c.name} style={{
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
                  <div style={{ fontSize: 12, color: '#5F7A9E' }}>{c.enrolled} students</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Enrolled', value: c.enrolled, color: '#2563eb' },
                  { label: 'Attendance Rate', value: `${attendanceRate}%`, color: '#16a34a' },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#5F7A9E' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeacherAttendance() {
  const [activeTab, setActiveTab] = useState('Students');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [trainerRoster, setTrainerRoster] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attendanceData, rosterData] = await Promise.all([
        listAttendance(),
        getMyTrainerRoster().catch(() => null),
      ]);
      setAttendanceRecords(attendanceData || []);
      setTrainerRoster(rosterData || null);
      setStudents(rosterData?.students || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setStudents([]);
      setAttendanceRecords([]);
      setTrainerRoster(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalStudents = students.length;
  const avgAttendance = totalStudents > 0
    ? Math.round(attendanceRecords.filter((r) => r.status === 'Present').length / Math.max(1, attendanceRecords.length) * 100)
    : 0;
  const assignmentCount = trainerRoster?.slots?.reduce((sum, slot) => sum + (Number(slot.filled) || 0), 0) || 0;

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName={storedUser.fullName || 'Trainer'}
        userRole="Trainer"
        pageTitle="Student Attendance"
        pageSubtitle="View and manage student attendance records."
      />

      <div className="page-body">
        <div className="ta-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: <Users size={22} color="#2563eb" />, bg: '#dbeafe', value: totalStudents, label: 'Total Students', sub: 'Active Enrollments' },
            { icon: <Clock size={22} color="#0891b2" />, bg: '#cffafe', value: attendanceRecords.length, label: "Total Records", sub: 'Attendance Entries' },
            { icon: <ClipboardList size={22} color="#9333ea" />, bg: '#ede9fe', value: assignmentCount, label: 'Assignments Count', sub: 'Based on roster' },
            { icon: <TrendingUp size={22} color="#059669" />, bg: '#d1fae5', value: `${avgAttendance}%`, label: 'Attendance Rate', sub: 'Present %' },
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

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4' }}>
          <div className="ta-tabbar" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 20px', borderBottom: '1px solid #e8edf4', flexWrap: 'wrap', gap: 8,
          }}>
            <div className="ta-tabs" style={{ display: 'flex', gap: 0 }}>
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

            <label className="ta-search" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f4f6ff', borderRadius: 8, padding: '7px 14px',
              border: '1px solid #e8edf4',
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

          <div style={{ padding: 20 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#5F7A9E', fontWeight: 700 }}>Loading data...</div>
            ) : (
              <>
                {activeTab === 'Students'        && <StudentsTab search={search} students={students} />}
                {activeTab === 'Attendance'      && <AttendanceTab students={students} attendanceRecords={attendanceRecords} onRefresh={fetchData} />}
                {activeTab === 'Assignments'     && <AssignmentsTab />}
                {activeTab === 'Quizzes'         && <QuizzesTab />}
                {activeTab === 'Course Progress' && <CourseProgressTab students={students} attendanceRecords={attendanceRecords} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;

