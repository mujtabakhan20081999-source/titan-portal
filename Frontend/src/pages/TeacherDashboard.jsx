import { useState } from 'react';
import { BookOpen, Users, ClipboardList, Calendar, Clock, User, CalendarDays, ChevronRight } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import TeacherCourseDetail from '../components/dashboard/TeacherCourseDetail';

const courses = [
  {
    id: 1,
    name: 'Little Geniuses: Coding, Design & AI Fun Lab',
    type: 'LAB',
    gender: 'Male',
    campus: 'SMIT Ghotki Campus (Ghotki)',
    batch: 'Batch 1',
    progress: 0,
    enrolled: 4,
    schedule: 'Sat 04:00 PM – 06:00 PM | Sun 04:00 PM – 06:00 PM',
    started: '1 Jun 2026',
    bg: '#e8f5e9',
    border: '#a5d6a7',
    titleColor: '#1b5e20',
  },
  {
    id: 2,
    name: 'Little Geniuses: Coding, Design & AI Fun Lab',
    type: 'LAB',
    gender: 'Female',
    campus: 'SMIT Ghotki Campus (Ghotki)',
    batch: 'Batch 1',
    progress: 0,
    enrolled: 8,
    schedule: 'Sat 12:00 PM – 02:00 PM | Sun 12:00 PM – 02:00 PM',
    started: '1 Jun 2026',
    bg: '#e8eaf6',
    border: '#9fa8da',
    titleColor: '#1a237e',
  },
  {
    id: 3,
    name: 'Little Geniuses: Coding, Design & AI Fun Lab',
    type: 'LAB',
    gender: 'Female',
    campus: 'SMIT Ghotki Campus (Ghotki)',
    batch: 'Batch 1',
    progress: 0,
    enrolled: 0,
    schedule: 'Sat 10:00 AM – 12:00 PM | Sun 10:00 AM – 12:00 PM',
    started: '1 Jun 2026',
    bg: '#f5f5f5',
    border: '#e0e0e0',
    titleColor: '#37474f',
  },
  {
    id: 4,
    name: 'Modern Web Application Development',
    type: 'LAB',
    gender: 'Female',
    campus: 'SMIT Ghotki Campus (Ghotki)',
    batch: 'Batch 3',
    progress: 25,
    enrolled: 30,
    schedule: 'Sat 08:00 AM – 10:00 AM | Sun 08:00 AM – 10:00 AM',
    started: '1 Jan 2026',
    bg: '#fce4ec',
    border: '#f48fb1',
    titleColor: '#880e4f',
  },
  {
    id: 5,
    name: 'Modern Web Application Development',
    type: 'LAB',
    gender: 'Male',
    campus: 'SMIT Ghotki Campus (Ghotki)',
    batch: 'Batch 3',
    progress: 25,
    enrolled: 30,
    schedule: 'Sat 08:00 AM – 10:00 AM | Sun 08:00 AM – 10:00 AM',
    started: '1 Jan 2026',
    bg: '#e0f7fa',
    border: '#80deea',
    titleColor: '#004d40',
  },
  {
    id: 6,
    name: 'Modern Web Application Development',
    type: 'LAB',
    gender: 'Male',
    campus: 'Saylani TITAN Sukkur Campus (Sukkur)',
    batch: 'Batch 1',
    progress: 10,
    enrolled: 30,
    schedule: 'Sat 08:00 AM – 10:00 AM | Sun 08:00 AM – 10:00 AM',
    started: '1 Jun 2026',
    bg: '#f3e5f5',
    border: '#ce93d8',
    titleColor: '#4a148c',
  },
];

const weekDays = [
  { short: 'Sun', num: '14', active: false },
  { short: 'Mon', num: '15', active: false },
  { short: 'Tue', num: '16', active: false },
  { short: 'Wed', num: '17', active: true },
  { short: 'Thu', num: '18', active: false },
  { short: 'Fri', num: '19', active: true },
  { short: 'Sat', num: '20', active: true },
];

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
          <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>Progress</span>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 700 }}>{course.progress}% Completed</span>
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
          <span>Enrolled : <strong>{course.enrolled}</strong> students</span>
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

  const openCourse = (course) => {
    const code = course.name.toLowerCase().includes('modern web') ? 'MWAD' : 'LGAL';
    setSelectedCourse({ ...course, code });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName="Sir Yasir Ali"
        userRole="Trainer"
        pageTitle="Teacher Dashboard"
        pageSubtitle="Manage your courses, track student progress, and stay on top of your teaching schedule."
      />

      {selectedCourse ? (
        <div className="page-body" style={{ gap: 24 }}>
          <TeacherCourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
        </div>
      ) : (
      <div className="page-body" style={{ gap: 24 }}>

        <div className="flex-row-responsive" style={{ gap: 20, alignItems: 'stretch' }}>
          <div className="td-statbox-row" style={{ display: 'flex', flex: 3, gap: 20 }}>
            <StatBox icon={BookOpen}      value={6}   label="Active Courses"     iconBg="#dcfce7" iconColor="#16a34a" />
            <StatBox icon={Users}         value={102} label="Enrolled Students"  iconBg="#dbeafe" iconColor="#2563eb" />
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
            Active Courses
          </h2>
          <div className="grid-2">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} onOpen={() => openCourse(c)} />
            ))}
          </div>
        </div>

      </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
