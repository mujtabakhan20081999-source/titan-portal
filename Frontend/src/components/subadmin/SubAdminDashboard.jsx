import { useState } from 'react';
import {
  Users, GraduationCap, CalendarClock, Wallet, ChevronLeft, ChevronRight,
  CalendarDays, Megaphone, BellRing, ReceiptText, Wrench, BookOpen,
} from 'lucide-react';

import titanLogo from '../../assets/TITAN LOGO without BG.png';
import { CITY_STATS } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/subadmin.css';

// Week of 13–19 Jul 2026 — "today" is Sat 18.
const WEEK = [
  { wd: 'Mon', dn: 13, ct: 4 },
  { wd: 'Tue', dn: 14, ct: 5 },
  { wd: 'Wed', dn: 15, ct: 4 },
  { wd: 'Thu', dn: 16, ct: 6 },
  { wd: 'Fri', dn: 17, ct: 4 },
  { wd: 'Sat', dn: 18, ct: 3, today: true },
  { wd: 'Sun', dn: 19, ct: 0, off: true },
];

const WEEK_BARS = [72, 64, 80, 58, 76, 88, 0]; // attendance % per day

function Ring({ pct, color = '#0A3D91', track = '#eef2f9', size = 62, stroke = 8, text = '#10375C' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="800" fill={text}>
        {pct}%
      </text>
    </svg>
  );
}

function SubAdminDashboard({ city, students, slots, onGoto }) {
  const cs = CITY_STATS[city] || {};
  const [controls, setControls] = useState({ registration: true, alerts: true, reminders: true, maintenance: false });
  const flip = (k) => setControls((p) => ({ ...p, [k]: !p[k] }));

  const seatsFilled = Math.round((slots.reduce((a, s) => a + s.filled, 0) / Math.max(1, slots.reduce((a, s) => a + s.seats, 0))) * 100);
  const attendancePct = 87;
  const pendingCount = students.filter((s) => s.status === 'Pending').length;

  const reports = [
    { icon: Users, bg: '#fff8e1', color: '#b45309', label: 'Total Students', pill: cs.students?.toLocaleString(), goto: 'Students' },
    { icon: GraduationCap, bg: '#dcfce7', color: '#16a34a', label: 'Enrolled', value: cs.enrolled?.toLocaleString(), goto: 'Students' },
    { icon: CalendarClock, bg: '#dbeafe', color: '#2563eb', label: 'Active Slots', value: cs.slots, goto: 'Slots' },
    { icon: Wallet, bg: '#ede9fe', color: '#7c3aed', label: 'Fee Collected', value: `Rs ${Math.round((cs.students * 620) / 1000)}K`, goto: 'Students' },
  ];

  const toggles = [
    { key: 'registration', label: 'Registration', icon: Megaphone, cls: 'blue' },
    { key: 'alerts', label: 'Smart Alerts', icon: BellRing, cls: 'gold' },
    { key: 'reminders', label: 'Fee Reminders', icon: ReceiptText, cls: 'cyan' },
    { key: 'maintenance', label: 'Maintenance', icon: Wrench, cls: 'grey', disabled: true },
  ];

  return (
    <div className="sapd">
      <div className="sapd-left">
        {/* Hero greeting */}
        <div className="sapd-hero">
          <h2>Hello, Sub Admin!</h2>
          <p>Welcome back to {city} Campus — {pendingCount} pending approval{pendingCount === 1 ? '' : 's'} waiting for you.</p>
          <img src={titanLogo} alt="" />
        </div>

        {/* Week strip */}
        <div className="sapd-card">
          <div className="sapd-week-head">
            <span className="sapd-sec-title">July 13–19</span>
            <button className="sapd-week-nav" aria-label="Previous week"><ChevronLeft size={15} /></button>
            <button className="sapd-week-nav" aria-label="Next week"><ChevronRight size={15} /></button>
            <button className="sapd-month-btn"><CalendarDays size={14} /> Month</button>
          </div>
          <div className="sapd-week">
            {WEEK.map((d) => (
              <div key={d.wd} className={`sapd-day${d.today ? ' today' : ''}${d.off ? ' off' : ''}`} title={d.off ? 'Off day' : `${d.ct} classes`}>
                <span className="wd">{d.wd}</span>
                <span className="dn">{d.dn}</span>
                <span className="ct">{d.off ? '—' : d.ct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campus reports */}
        <div className="sapd-card">
          <span className="sapd-sec-title">Campus Reports</span>
          <div className="sapd-reports">
            {reports.map((r) => {
              const Icon = r.icon;
              return (
                <button key={r.label} className="sapd-rep" onClick={() => onGoto(r.goto)}>
                  <div className="sapd-rep-ic" style={{ background: r.bg }}><Icon size={19} color={r.color} /></div>
                  <span>{r.label}</span>
                  {r.pill ? <span className="pill">{r.pill}</span> : <b>{r.value}</b>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Monitoring rings */}
        <div className="sapd-card">
          <span className="sapd-sec-title">Campus Monitoring</span>
          <div className="sapd-mon">
            <div className="sapd-ring-card">
              <Ring pct={64} color="#2563eb" />
              <div>
                <div className="t">Syllabus Progress</div>
                <div className="s">Average across courses</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 34, height: 34, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={16} color="#2563eb" />
              </div>
            </div>
            <div className="sapd-ring-card dark">
              <Ring pct={seatsFilled} color="#F3C623" track="rgba(255,255,255,0.25)" text="#ffffff" />
              <div>
                <div className="t">Seats Filled</div>
                <div className="s">{city} Campus · all slots</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sapd-right">
        {/* Quick controls */}
        <div className="sapd-card">
          <span className="sapd-sec-title">Quick Controls</span>
          <div className="sapd-toggles" style={{ marginTop: 15 }}>
            {toggles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.key} className={`sapd-tog ${t.cls}`}>
                  <div className="sapd-tog-head">
                    <div className="sapd-tog-ic"><Icon size={16} /></div>
                    <label className="sapd-sw">
                      <input type="checkbox" checked={controls[t.key]} disabled={t.disabled} onChange={() => flip(t.key)} />
                      <span className="sapd-sw-slider" />
                    </label>
                  </div>
                  <label>{t.label}</label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance statistics */}
        <div className="sapd-card">
          <span className="sapd-sec-title">Attendance Statistics</span>
          <div className="sapd-stats-top">
            <span className="sapd-stats-pct">{attendancePct}%</span>
            <span className="sapd-stats-note">this week · {city} Campus</span>
          </div>
          <div className="sapd-bars">
            {WEEK.map((d, i) => (
              <div key={d.wd} className={`sapd-bar-col${d.today ? ' today' : ''}`} title={d.off ? 'Off day' : `${WEEK_BARS[i]}%`}>
                <div className="sapd-bar-track">
                  <div className="sapd-bar-fill" style={{ height: `${WEEK_BARS[i]}%` }} />
                </div>
                <span className="bl">{d.wd.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubAdminDashboard;
