import { useMemo, useState } from 'react';
import {
  ScanLine, Search, CheckCircle2, AlertTriangle, CalendarDays, Users,
} from 'lucide-react';

import { can } from './subAdminData';
import {
  lookupAttendanceStudent,
  getAttendanceSummary,
  createAttendance,
  createMultiAttendance,
} from '../../services/attendanceService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';
import '../../styles/subadmin.css';

const DAY_HEADS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function SubAdminAttendance({ city, perms, students }) {
  const tabs = [
    can(perms, 'Attendance', 'write') || can(perms, 'Attendance', 'mark') ? 'Mark' : null,
    can(perms, 'Attendance', 'read') ? 'View' : null,
    can(perms, 'Attendance', 'write') || can(perms, 'Attendance', 'multi') ? 'Multi' : null,
  ].filter(Boolean);
  const [tab, setTab] = useState(tabs[0] || 'View');

  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const [markRoll, setMarkRoll] = useState('');
  const [found, setFound] = useState(null);
  const [markErr, setMarkErr] = useState('');
  const [markedToday, setMarkedToday] = useState([]);
  const [busy, setBusy] = useState(false);

  const find = async () => {
    const q = markRoll.trim();
    if (!q) return;
    setBusy(true);
    try {
      const data = await lookupAttendanceStudent(q);
      const s = data.student || data;
      if (s.city && s.city !== city && !(s.campus || '').includes(city)) {
        setFound(null);
        setMarkErr(`Student is not at ${city} Campus.`);
        return;
      }
      setMarkErr('');
      setFound(s);
    } catch (err) {
      setFound(null);
      setMarkErr(err?.response?.data?.message || `No student with roll "${q}" at ${city} Campus.`);
    } finally {
      setBusy(false);
    }
  };

  const mark = async () => {
    if (!found) return;
    setBusy(true);
    try {
      const res = await createAttendance({
        studentId: found.roll,
        status: 'Present',
        force: false,
      });
      if (res.paymentWarning || res.warning) say(res.paymentWarning || res.warning);
      else say('Attendance Marked ✔');
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setMarkedToday((p) => [{ roll: found.roll, name: found.name, av: '#0A3D91', course: found.course, time }, ...p]);
      setFound(null);
      setMarkRoll('');
    } catch (err) {
      say(err?.response?.data?.message || 'Mark failed.');
    } finally {
      setBusy(false);
    }
  };

  const [viewRoll, setViewRoll] = useState('');
  const [viewStudent, setViewStudent] = useState(null);
  const [viewErr, setViewErr] = useState('');
  const [summary, setSummary] = useState(null);

  const lookUp = async () => {
    const q = viewRoll.trim();
    setBusy(true);
    try {
      const data = await getAttendanceSummary(q);
      setViewStudent(data.student || students.find((s) => s.roll.toUpperCase() === q.toUpperCase()) || { roll: q, name: data.student?.name });
      setSummary(data);
      setViewErr('');
    } catch (err) {
      setViewStudent(null);
      setSummary(null);
      setViewErr(err?.response?.data?.message || `No attendance for "${q}".`);
    } finally {
      setBusy(false);
    }
  };

  const calDays = useMemo(() => {
    const calendar = summary?.calendar || summary?.days || [];
    if (Array.isArray(calendar) && calendar.length) return calendar;
    return [];
  }, [summary]);

  const totals = useMemo(() => ({
    p: summary?.present ?? calDays.filter((x) => x.s === 'p' || x.status === 'Present').length,
    l: summary?.leave ?? calDays.filter((x) => x.s === 'l' || x.status === 'Leave').length,
    a: summary?.absent ?? calDays.filter((x) => x.s === 'a' || x.status === 'Absent').length,
  }), [summary, calDays]);
  const held = totals.p + totals.l + totals.a;
  const pct = held ? Math.round((totals.p / held) * 100) : 0;

  const [multiDate, setMultiDate] = useState(new Date().toISOString().slice(0, 10));
  const [multiRolls, setMultiRolls] = useState('');
  const [multiResult, setMultiResult] = useState(null);

  const markAll = async () => {
    const items = multiRolls.split(',').map((x) => x.trim()).filter(Boolean);
    if (items.length === 0) { say('Enter at least one roll number.'); return; }
    setBusy(true);
    try {
      const res = await createMultiAttendance({ rolls: items.join(','), date: multiDate, status: 'Present' });
      setMultiResult({
        date: multiDate,
        marked: (res.data?.marked || []).map((m) => m.studentId || m.roll || m),
        missing: res.data?.notFound || res.data?.missing || [],
      });
      say('Multi attendance submitted.');
    } catch (err) {
      say(err?.response?.data?.message || 'Multi mark failed.');
    } finally {
      setBusy(false);
    }
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

      {tab === 'Mark' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Mark by Roll Number</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: 1, minWidth: 200 }}>
                <Search size={16} />
                <input value={markRoll} onChange={(e) => setMarkRoll(e.target.value)} placeholder="Enter roll number" onKeyDown={(e) => e.key === 'Enter' && find()} />
              </label>
              <button className="btn-primary" disabled={busy} onClick={find}>Find</button>
            </div>
            {markErr && <div className="ap-hint err" style={{ marginTop: 10 }}><AlertTriangle size={14} /> {markErr}</div>}
            {found && (
              <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: '#f8fbff', border: '1px solid #dbe7f8' }}>
                <div style={{ fontWeight: 800, color: '#10375C' }}>{found.name}</div>
                <div style={{ fontSize: 12.5, color: '#7286a3' }}>{found.roll} · {found.course}</div>
                <button className="btn-primary" style={{ marginTop: 12 }} disabled={busy} onClick={mark}><CheckCircle2 size={15} /> Mark Present</button>
              </div>
            )}
          </div>
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Marked Today</span></div>
            {markedToday.length === 0 ? (
              <div style={{ color: '#7286a3', fontWeight: 700, padding: 20, textAlign: 'center' }}>No marks yet in this session.</div>
            ) : markedToday.map((m) => (
              <div key={`${m.roll}-${m.time}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f4fa' }}>
                <span style={{ fontWeight: 700 }}>{m.name} ({m.roll})</span>
                <span style={{ color: '#7286a3' }}>{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'View' && (
        <div className="acard">
          <div className="acard-head"><span className="acard-title">View Attendance</span></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <label className="admin-search" style={{ flex: 1, minWidth: 200 }}>
              <Search size={16} />
              <input value={viewRoll} onChange={(e) => setViewRoll(e.target.value)} placeholder="Roll number" onKeyDown={(e) => e.key === 'Enter' && lookUp()} />
            </label>
            <button className="btn-primary" disabled={busy} onClick={lookUp}>Lookup</button>
          </div>
          {viewErr && <div className="ap-hint err">{viewErr}</div>}
          {viewStudent && (
            <>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{viewStudent.name || viewStudent.roll} — {pct}% present</div>
              <div className="amini-stats" style={{ marginBottom: 12 }}>
                <div className="amini-item"><div className="amini-val" style={{ color: '#16a34a' }}>{totals.p}</div><div className="amini-label">Present</div></div>
                <div className="amini-item"><div className="amini-val" style={{ color: '#d97706' }}>{totals.l}</div><div className="amini-label">Leave</div></div>
                <div className="amini-item"><div className="amini-val" style={{ color: '#dc2626' }}>{totals.a}</div><div className="amini-label">Absent</div></div>
              </div>
              {calDays.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                  {DAY_HEADS.map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#7286a3' }}>{d}</div>)}
                  {calDays.map((d, i) => {
                    const status = d.s || (d.status === 'Present' ? 'p' : d.status === 'Leave' ? 'l' : d.status === 'Absent' ? 'a' : 'future');
                    const bg = status === 'p' ? '#dcfce7' : status === 'l' ? '#fef3c7' : status === 'a' ? '#fee2e2' : '#f3f4f6';
                    return <div key={i} style={{ background: bg, borderRadius: 8, padding: 8, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{d.d || d.day || i + 1}</div>;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'Multi' && (
        <div className="acard">
          <div className="acard-head"><span className="acard-title">Multi Mark</span></div>
          <div className="ap-field"><label>Date</label><input type="date" value={multiDate} onChange={(e) => setMultiDate(e.target.value)} /></div>
          <div className="ap-field"><label>Roll numbers (comma separated)</label><textarea value={multiRolls} onChange={(e) => setMultiRolls(e.target.value)} placeholder="SUK-24-001, SUK-24-002" /></div>
          <button className="btn-primary" disabled={busy} onClick={markAll}>{busy ? 'Submitting…' : 'Mark All Present'}</button>
          {multiResult && (
            <div style={{ marginTop: 14 }}>
              <div className="ap-hint">Marked: {(multiResult.marked || []).join(', ') || '—'}</div>
              {multiResult.missing?.length > 0 && <div className="ap-hint err">Missing: {multiResult.missing.join(', ')}</div>}
            </div>
          )}
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminAttendance;
