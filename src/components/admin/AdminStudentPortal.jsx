import { ClipboardList, CalendarCheck, BookOpen, Clock3, MapPin, FileText } from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const SCHEDULE = [
  { time: '10:00 AM - 12:00 PM', title: 'Artificial Intelligence', meta: 'Lecture 12 · Sukkur Campus', color: '#2563eb' },
  { time: '02:00 PM - 04:00 PM', title: 'Web Development', meta: 'Lab Session · Online', color: '#16a34a' },
];

const UPCOMING = [
  { title: 'AI Project - Part 2', due: 'Due 20 May, 2026', course: 'Artificial Intelligence', color: '#7c3aed' },
  { title: 'Python Quiz', due: 'Due 22 May, 2026', course: 'Python Programming', color: '#16a34a' },
  { title: 'Web Dev Assignment', due: 'Due 25 May, 2026', course: 'Web Development', color: '#2563eb' },
];

function RingStat({ value, total, label, color, bg, Icon }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="acard">
      <div className="ap-kpi">
        <div className="ap-kpi-ic" style={{ background: bg }}><Icon size={24} color={color} /></div>
        <div style={{ flex: 1 }}>
          <div className="ap-kpi-val">{value}<span style={{ fontSize: 16, color: '#7286a3' }}>/{total}</span></div>
          <div className="ap-kpi-label">{label}</div>
        </div>
      </div>
      <div className="ap-prog-track" style={{ marginTop: 12 }}>
        <div className="ap-prog-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color})` }} />
      </div>
    </div>
  );
}

export default function AdminStudentPortal() {
  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Student Dashboard</h2>
          <p>Welcome back, Anas Hassan</p>
        </div>
      </div>

      <div className="ap-3col">
        <RingStat value={65} total={80} label="Assignments Completed" color="#7c3aed" bg="#ede9fe" Icon={ClipboardList} />
        <RingStat value={9} total={13} label="Attendance Marked" color="#16a34a" bg="#dcfce7" Icon={CalendarCheck} />
        <div className="acard">
          <div className="ap-kpi">
            <div className="ap-kpi-ic" style={{ background: '#dbeafe' }}><BookOpen size={24} color="#2563eb" /></div>
            <div>
              <div className="ap-item-sub">Current Course</div>
              <div className="ap-kpi-val" style={{ fontSize: 19 }}>Artificial Intelligence</div>
              <div className="ap-item-sub" style={{ marginTop: 2 }}>Batch 01 · Morning</div>
            </div>
          </div>
        </div>
      </div>

      <div className="ap-2col-a">
        {/* Today's Schedule */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarCheck size={16} color="#0A3D91" /> Today's Schedule
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

        {/* Upcoming Assignments */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="#0A3D91" /> Upcoming Assignments
            </span>
            <span style={{ fontSize: 12, color: '#7286a3' }}>{UPCOMING.length} due</span>
          </div>
          <div className="ap-list">
            {UPCOMING.map((u, i) => (
              <div className="ap-item" key={i}>
                <div className="ap-item-ic" style={{ background: `${u.color}1a` }}><FileText size={19} color={u.color} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ap-item-title">{u.title}</div>
                  <div className="ap-item-sub">{u.course}</div>
                </div>
                <span className="badge badge-amber">{u.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
