import { BookOpen, GraduationCap, ClipboardList, CalendarDays, Clock3, MapPin } from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const KPIS = [
  { label: 'Active Courses', value: 3, bg: '#dbeafe', color: '#2563eb', Icon: BookOpen },
  { label: 'Enrolled Students', value: 78, bg: '#dcfce7', color: '#16a34a', Icon: GraduationCap },
  { label: 'Total Assignments', value: 24, bg: '#ede9fe', color: '#7c3aed', Icon: ClipboardList },
];

const COURSES = [
  { name: 'Artificial Intelligence', students: 45, progress: 75, bg: '#dbeafe', color: '#2563eb' },
  { name: 'Python Programming', students: 20, progress: 87, bg: '#dcfce7', color: '#16a34a' },
  { name: 'Data Science', students: 13, progress: 45, bg: '#ede9fe', color: '#7c3aed' },
];

const SCHEDULE = [
  { time: '10:00 AM - 12:00 PM', title: 'Artificial Intelligence', meta: 'AI - Batch 01 · Sukkur Campus', color: '#2563eb' },
  { time: '02:00 PM - 04:00 PM', title: 'Data Science', meta: 'Data Science - Batch 03 · Online', color: '#7c3aed' },
  { time: '05:00 PM - 07:00 PM', title: 'Python Programming', meta: 'PY - Batch 02 · Karachi Campus', color: '#16a34a' },
];

export default function AdminTrainerPortal() {
  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Trainer Portal Overview</h2>
          <p>Welcome back, Ali Raza</p>
        </div>
        <button className="btn-primary"><CalendarDays size={15} /> View Calendar</button>
      </div>

      <div className="ap-3col">
        {KPIS.map((k) => (
          <div className="acard" key={k.label}>
            <div className="ap-kpi">
              <div className="ap-kpi-ic" style={{ background: k.bg }}><k.Icon size={24} color={k.color} /></div>
              <div>
                <div className="ap-kpi-val">{k.value}</div>
                <div className="ap-kpi-label">{k.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-2col-a">
        {/* My Courses */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title">My Courses</span>
            <span style={{ fontSize: 12, color: '#7286a3' }}>{COURSES.length} active</span>
          </div>
          <div className="ap-list">
            {COURSES.map((c) => (
              <div className="ap-item" key={c.name} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div className="ap-item-ic" style={{ background: c.bg }}><BookOpen size={20} color={c.color} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ap-item-title">{c.name}</div>
                    <div className="ap-item-sub">{c.students} Students</div>
                  </div>
                  <span className="atable-cell-strong" style={{ color: c.color }}>{c.progress}%</span>
                </div>
                <div className="ap-prog-track">
                  <div className="ap-prog-fill" style={{ width: `${c.progress}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays size={16} color="#0A3D91" /> Today's Schedule
            </span>
          </div>
          <div className="ap-list">
            {SCHEDULE.map((s, i) => (
              <div className="ap-item" key={i}>
                <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 999, background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: s.color, fontWeight: 700 }}>
                    <Clock3 size={13} /> {s.time}
                  </div>
                  <div className="ap-item-title" style={{ marginTop: 3 }}>{s.title}</div>
                  <div className="ap-item-sub" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} /> {s.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
