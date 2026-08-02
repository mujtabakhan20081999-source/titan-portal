import { useMemo, useState } from 'react';
import {
  ScanLine, Search, CheckCircle2, AlertTriangle, CalendarDays, Users, X,
} from 'lucide-react';

import { can } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';
import '../../styles/subadmin.css';

const DAY_HEADS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Deterministic demo attendance for a roll number (July 2026: 31 days, starts Wednesday).
function monthAttendance(roll) {
  const seed = [...roll].reduce((a, c) => a + c.charCodeAt(0), 0);
  const days = [];
  for (let d = 1; d <= 31; d++) {
    const weekday = (d + 1) % 7; // 1 Jul 2026 = Wednesday (Mon=0 → weekday 2 when d=1)
    if (weekday === 6) { days.push({ d, s: 'off' }); continue; } // Sunday off
    if (d > 18) { days.push({ d, s: 'future' }); continue; }     // "today" is 18 Jul
    const r = (seed * 31 + d * 7) % 20;
    days.push({ d, s: r < 14 ? 'p' : r < 16 ? 'l' : 'a' });
  }
  return days;
}

function SubAdminAttendance({ city, perms, students }) {
  const tabs = [
    can(perms, 'Attendance', 'mark') && 'Mark',
    can(perms, 'Attendance', 'read') && 'View',
    can(perms, 'Attendance', 'multi') && 'Multi',
  ].filter(Boolean);
  const [tab, setTab] = useState(tabs[0] || 'View');

  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  /* ── Mark ── */
  const [markRoll, setMarkRoll] = useState('');
  const [found, setFound] = useState(null);
  const [markErr, setMarkErr] = useState('');
  const [markedToday, setMarkedToday] = useState([]); // [{roll, name, av, time, course}]

  const find = () => {
    const q = markRoll.trim().toUpperCase();
    const s = students.find((x) => x.roll.toUpperCase() === q);
    if (!s) { setFound(null); setMarkErr(`No student with roll "${markRoll.trim()}" at ${city} Campus.`); return; }
    setMarkErr(''); setFound(s);
  };

  const mark = () => {
    if (!found) return;
    if (markedToday.some((m) => m.roll === found.roll)) { say('Already marked in this class — same student can\'t be marked twice.'); return; }
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMarkedToday((p) => [{ roll: found.roll, name: found.name, av: found.av, course: found.course, time }, ...p]);
    say('Attendance Marked ✔');
    setFound(null); setMarkRoll('');
  };

  /* ── View ── */
  const [viewRoll, setViewRoll] = useState('');
  const [viewStudent, setViewStudent] = useState(null);
  const [viewErr, setViewErr] = useState('');

  const lookUp = () => {
    const q = viewRoll.trim().toUpperCase();
    const s = students.find((x) => x.roll.toUpperCase() === q);
    if (!s) { setViewStudent(null); setViewErr(`No student with roll "${viewRoll.trim()}".`); return; }
    setViewErr(''); setViewStudent(s);
  };

  const cal = useMemo(() => (viewStudent ? monthAttendance(viewStudent.roll) : []), [viewStudent]);
  const totals = useMemo(() => ({
    p: cal.filter((x) => x.s === 'p').length,
    l: cal.filter((x) => x.s === 'l').length,
    a: cal.filter((x) => x.s === 'a').length,
  }), [cal]);
  const held = totals.p + totals.l + totals.a;
  const pct = held ? Math.round((totals.p / held) * 100) : 0;

  /* ── Multi ── */
  const [multiDate, setMultiDate] = useState('2026-07-18');
  const [multiRolls, setMultiRolls] = useState('');
  const [multiResult, setMultiResult] = useState(null);

  const markAll = () => {
    const items = multiRolls.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean);
    if (items.length === 0) { say('Enter at least one roll number.'); return; }
    const okRolls = [];
    const missing = [];
    items.forEach((r) => {
      if (students.some((s) => s.roll.toUpperCase() === r)) okRolls.push(r); else missing.push(r);
    });
    setMultiResult({ date: multiDate, marked: [...new Set(okRolls)], missing: [...new Set(missing)] });
    say(`${new Set(okRolls).size} marked, ${new Set(missing).size} not found.`);
  };

  return (
    <div className="ap-page subadmin-attendance-page">
      <div className="ap-head">
        <div>
          <h2>Attendance — {city} Campus</h2>
          <p>Mark by roll number, view history, or mark many students at once</p>
        </div>
        <div className="ap-tabs">
          {tabs.map((t) => (
            <button key={t} className={`ap-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'Mark' ? <ScanLine size={15} /> : t === 'View' ? <CalendarDays size={15} /> : <Users size={15} />} {t} Attendance
            </button>
          ))}
        </div>
      </div>

      {/* ── MARK ── */}
      {tab === 'Mark' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Mark by Roll Number</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: '1 1 220px' }}>
                <ScanLine size={16} color="#5F7A9E" />
                <input placeholder="Type or scan roll number (e.g. SUK-24-001)…" value={markRoll}
                  onChange={(e) => setMarkRoll(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && find()} />
              </label>
              <button className="btn-primary" onClick={find}><Search size={15} /> Find</button>
            </div>
            {markErr && <div className="ap-hint err" style={{ marginTop: 12 }}>{markErr}</div>}

            {found && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="att-profile">
                  <div className="att-profile-av" style={{ background: found.av }}>
                    {found.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="att-profile-name">{found.name}</div>
                    <div className="att-profile-meta">{found.roll} · {found.course} ({found.batch}) · {found.campus}</div>
                    {found.pay !== 'Paid' && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 7, padding: '4px 10px', borderRadius: 7, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: 11.5, fontWeight: 800 }}>
                        <AlertTriangle size={13} /> Fee {found.pay} — you can still mark
                      </div>
                    )}
                  </div>
                  <span className={`badge ${found.status === 'Enrolled' ? 'badge-blue' : 'badge-amber'}`}>{found.status}</span>
                </div>
                <button className="btn-primary" style={{ justifyContent: 'center', padding: '12px 14px', fontSize: 14 }} onClick={mark}>
                  <CheckCircle2 size={17} /> Mark Attendance
                </button>
              </div>
            )}
          </div>

          <div className="acard">
            <div className="acard-head">
              <span className="acard-title">Marked Today</span>
              <span className="badge badge-green">{markedToday.length}</span>
            </div>
            {markedToday.length === 0 ? (
              <div style={{ padding: '26px 0', textAlign: 'center', color: '#7286a3', fontWeight: 700, fontSize: 13 }}>No attendance marked yet today.</div>
            ) : markedToday.map((m) => (
              <div className="att-recent-row" key={m.roll}>
                <div className="att-recent-av" style={{ background: m.av }}>{m.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="atable-cell-strong">{m.name}</div>
                  <div className="atable-cell-sub">{m.roll} · {m.course}</div>
                </div>
                <span className="atable-cell-sub" style={{ fontWeight: 700 }}>{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW ── */}
      {tab === 'View' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Search Attendance</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: '1 1 220px' }}>
                <Search size={16} color="#5F7A9E" />
                <input placeholder="Roll number…" value={viewRoll}
                  onChange={(e) => setViewRoll(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && lookUp()} />
              </label>
              <button className="btn-primary" onClick={lookUp}><Search size={15} /> View</button>
            </div>
            {viewErr && <div className="ap-hint err" style={{ marginTop: 12 }}>{viewErr}</div>}

            {viewStudent && (
              <div style={{ marginTop: 16 }}>
                <div className="att-profile" style={{ marginBottom: 14 }}>
                  <div className="att-profile-av" style={{ background: viewStudent.av }}>
                    {viewStudent.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="att-profile-name">{viewStudent.name}</div>
                    <div className="att-profile-meta">{viewStudent.roll} · {viewStudent.course} ({viewStudent.batch})</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626' }}>{pct}%</div>
                    <div className="atable-cell-sub" style={{ fontWeight: 700 }}>Attendance</div>
                  </div>
                </div>
                <div className="amini-stats">
                  <div className="amini-item"><div className="amini-val" style={{ color: '#16a34a' }}>{totals.p}</div><div className="amini-label">Present</div></div>
                  <div className="amini-item"><div className="amini-val" style={{ color: '#d97706' }}>{totals.l}</div><div className="amini-label">Leave</div></div>
                  <div className="amini-item"><div className="amini-val" style={{ color: '#dc2626' }}>{totals.a}</div><div className="amini-label">Absent</div></div>
                </div>
              </div>
            )}
          </div>

          <div className="acard">
            <div className="acard-head">
              <span className="acard-title">July 2026</span>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700, color: '#5F7A9E' }}>
                <span style={{ color: '#15803d' }}>● Present</span>
                <span style={{ color: '#b45309' }}>● Leave</span>
                <span style={{ color: '#b91c1c' }}>● Absent</span>
              </div>
            </div>
            {!viewStudent ? (
              <div style={{ padding: '26px 0', textAlign: 'center', color: '#7286a3', fontWeight: 700, fontSize: 13 }}>Search a roll number to see the calendar.</div>
            ) : (
              <div className="att-cal">
                {DAY_HEADS.map((h) => <div key={h} className="att-cal-head">{h}</div>)}
                {/* 1 Jul 2026 = Wednesday → two leading blanks (Mon, Tue) */}
                {[0, 1].map((i) => <div key={`b${i}`} />)}
                {cal.map((x) => (
                  <div key={x.d} className={`att-cal-day ${x.s === 'off' || x.s === 'future' ? 'off' : x.s}`} title={x.s === 'p' ? 'Present' : x.s === 'l' ? 'Leave' : x.s === 'a' ? 'Absent' : ''}>
                    {x.d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MULTI ── */}
      {tab === 'Multi' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Multi Attendance</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="ap-field" style={{ maxWidth: 220 }}>
                <label>Date</label>
                <input type="date" value={multiDate} onChange={(e) => setMultiDate(e.target.value)} />
              </div>
              <div className="ap-field">
                <label>Roll numbers (separated by commas)</label>
                <textarea placeholder="SUK-24-001, SUK-24-002, SUK-24-003…" value={multiRolls} onChange={(e) => setMultiRolls(e.target.value)} />
              </div>
              <button className="btn-primary" style={{ justifyContent: 'center', padding: '12px 14px' }} onClick={markAll}>
                <Users size={16} /> Mark All Present
              </button>
            </div>
          </div>

          <div className="acard">
            <div className="acard-head"><span className="acard-title">Result</span></div>
            {!multiResult ? (
              <div style={{ padding: '26px 0', textAlign: 'center', color: '#7286a3', fontWeight: 700, fontSize: 13 }}>Marked and not-found counts will show here.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="amini-stats">
                  <div className="amini-item"><div className="amini-val" style={{ color: '#16a34a' }}>{multiResult.marked.length}</div><div className="amini-label">Marked</div></div>
                  <div className="amini-item"><div className="amini-val" style={{ color: '#dc2626' }}>{multiResult.missing.length}</div><div className="amini-label">Not Found</div></div>
                </div>
                {multiResult.marked.length > 0 && (
                  <div>
                    <div className="ap-hint" style={{ marginBottom: 6 }}>Marked present on {multiResult.date}:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {multiResult.marked.map((r) => <span key={r} className="badge badge-green">{r}</span>)}
                    </div>
                  </div>
                )}
                {multiResult.missing.length > 0 && (
                  <div>
                    <div className="ap-hint err" style={{ marginBottom: 6 }}><X size={11} style={{ display: 'inline' }} /> Not found at {city} Campus:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {multiResult.missing.map((r) => <span key={r} className="badge badge-grey">{r}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminAttendance;
