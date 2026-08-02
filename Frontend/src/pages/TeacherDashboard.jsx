import { useEffect, useState } from 'react';
import { BookOpen, Users, ClipboardList, Calendar, Clock, User, CalendarDays, ChevronRight } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import TeacherCourseDetail from '../components/dashboard/TeacherCourseDetail';
import { listMySlots } from '../services/slotService';

const CARD_THEMES = [
  { bg: '#e8f5e9', border: '#a5d6a7', titleColor: '#1b5e20' },
  { bg: '#e8eaf6', border: '#9fa8da', titleColor: '#1a237e' },
  { bg: '#fce4ec', border: '#f48fb1', titleColor: '#880e4f' },
  { bg: '#e0f7fa', border: '#80deea', titleColor: '#004d40' },
  { bg: '#f3e5f5', border: '#ce93d8', titleColor: '#4a148c' },
  { bg: '#fff3e0', border: '#ffcc80', titleColor: '#e65100' },
];

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function mapSlotToCourse(slot, index) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const seats = Number(slot.seats) || 0;
  const filled = Number(slot.filled) || 0;
  const progress = seats > 0 ? Math.min(100, Math.round((filled / seats) * 100)) : 0;

  return {
    id: slot._id || slot.slotId,
    slotId: slot.slotId,
    name: slot.course,
    type: (slot.classType || 'Onsite').toUpperCase(),
    gender: slot.gender || 'Mixed',
    campus: slot.campus,
    batch: slot.slotId || `Slot ${index + 1}`,
    progress,
    enrolled: filled,
    seats,
    schedule: `${slot.days || '—'} | ${slot.time || '—'}`,
    started: formatDate(slot.start),
    status: slot.status || 'Open',
    days: slot.days || '',
    time: slot.time || '',
    ...theme,
  };
}

function buildWeekDays(slots) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const assignedDays = slots
    .flatMap((slot) => String(slot.days || '').split(/[,|/]/))
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  return dayNames.map((short, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const full = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const active = assignedDays.some(
      (day) => day.includes(short.toLowerCase()) || day.includes(full.slice(0, 3)) || day.includes(full)
    );
    return {
      short,
      num: String(date.getDate()).padStart(2, '0'),
      active,
    };
  });
}

function StatBox({ icon: Icon, value, label, iconBg, iconColor }) {
  return (
    <div className="card card-padding" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={24} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#10375C', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: '#5F7A9E', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function CourseCard({ course, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      style={{
        background: course.bg,
        border: `1.5px solid ${course.border}`,
        borderRadius: 16,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
        boxShadow: hover ? '0 10px 24px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
    >

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: course.titleColor, lineHeight: 1.4 }}>
            {course.name}
          </h3>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#666',
            background: 'rgba(0,0,0,0.07)',
            borderRadius: 6,
            padding: '2px 8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {course.batch}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{course.type} | {course.gender}</p>
        <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{course.campus}</p>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>Enrollment</span>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 700 }}>{course.progress}% Filled</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.10)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div style={{
            width: `${course.progress}%`,
            height: '100%',
            background: '#22c55e',
            borderRadius: 999,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444' }}>
          <User size={13} color="#888" />
          <span>Enrolled : <strong>{course.enrolled}</strong> / {course.seats} students</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444' }}>
          <Clock size={13} color="#888" />
          <span>Schedule: {course.schedule}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444' }}>
          <CalendarDays size={13} color="#888" />
          <span>Started On: {course.started}</span>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 2, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.08)',
        fontSize: 13, fontWeight: 700, color: course.titleColor,
      }}>
        <span>View Students & Manage</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const result = await listMySlots();
        if (!mounted) return;
        setTrainer(result.trainer || null);
        setCourses((result.data || []).map(mapSlotToCourse));
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load your assigned slots.');
        setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openCourse = (course) => {
    const code = course.name.toLowerCase().includes('modern web') ? 'MWAD' : 'LGAL';
    setSelectedCourse({ ...course, code });
  };

  const displayName = trainer?.fullName || storedUser.fullName || 'Trainer';
  const weekDays = buildWeekDays(courses);
  const totalStudents = courses.reduce((sum, course) => sum + (Number(course.enrolled) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName={displayName}
        userRole="Trainer"
        pageTitle="Teacher Dashboard"
        pageSubtitle="Manage your assigned slots, track student enrollment, and stay on top of your teaching schedule."
      />

      {selectedCourse ? (
        <div className="page-body" style={{ gap: 24 }}>
          <TeacherCourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
        </div>
      ) : (
      <div className="page-body" style={{ gap: 24 }}>

        <div className="flex-row-responsive" style={{ gap: 20, alignItems: 'stretch' }}>
          <div className="td-statbox-row" style={{ display: 'flex', flex: 3, gap: 20 }}>
            <StatBox icon={BookOpen}      value={loading ? '—' : courses.length} label="Assigned Slots"     iconBg="#dcfce7" iconColor="#16a34a" />
            <StatBox icon={Users}         value={loading ? '—' : totalStudents} label="Enrolled Students"  iconBg="#dbeafe" iconColor="#2563eb" />
            <StatBox icon={ClipboardList} value={0}   label="Total Assignments"  iconBg="#f3e8ff" iconColor="#9333ea" />
          </div>

          <div className="card card-padding" style={{ flex: 1.1, minWidth: 210 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Calendar size={15} color="#10375C" />
              <span style={{ fontWeight: 700, fontSize: 13, color: '#10375C' }}>Teaching Schedule</span>
            </div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
              {weekDays.map((d) => (
                <div
                  key={d.short}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '7px 6px',
                    borderRadius: 10,
                    background: d.active ? '#16a34a' : 'transparent',
                    color: d.active ? '#fff' : '#888',
                    fontSize: 10,
                    minWidth: 30,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{d.short}</span>
                  <span style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{d.num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontWeight: 700, fontSize: 17, color: '#10375C', marginBottom: 16 }}>
            Assigned Slots
          </h2>

          {error && (
            <div className="card card-padding" style={{ color: '#b91c1c', marginBottom: 16 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="card card-padding" style={{ color: '#5F7A9E' }}>Loading your assigned slots…</div>
          ) : courses.length === 0 ? (
            <div className="card card-padding" style={{ color: '#5F7A9E' }}>
              No slots have been assigned to you yet. Please contact administration.
            </div>
          ) : (
            <div className="grid-2">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} onOpen={() => openCourse(c)} />
              ))}
            </div>
          )}
        </div>

      </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
