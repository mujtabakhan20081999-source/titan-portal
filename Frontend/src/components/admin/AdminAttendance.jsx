import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, Clock3, XCircle, ScanLine, Search, CalendarDays,
  UserCheck, Users, AlertTriangle,
} from 'lucide-react';
import {
  listAttendance,
  lookupAttendanceStudent,
  getAttendanceSummary,
  createAttendance,
  createMultiAttendance,
} from '../../services/attendanceService';
import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const AV = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];
const STATUS_BADGE = { Present: 'badge-green', Leave: 'badge-amber', Absent: 'badge-grey', Late: 'badge-blue' };

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}

function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h %= 12; if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

function monthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

export default function AdminAttendance() {
  const [tab, setTab] = useState('mark');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [toast, setToast] = useState('');

  const [rollInput, setRollInput] = useState('');
  const [lookup, setLookup] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [recent, setRecent] = useState([]);

  const [viewRoll, setViewRoll] = useState('');
  const [summary, setSummary] = useState(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [multiDate, setMultiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [multiRolls, setMultiRolls] = useState('');
  const [multiStatus, setMultiStatus] = useState('Present');
  const [multiResult, setMultiResult] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await listAttendance();
      setRecords(data || []);
    } catch (err) {
      setFetchError(err?.response?.data?.message || 'Failed to load records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  useEffect(() => {
    if (records.length && recent.length === 0) {
      setRecent(records.slice(0, 8).map((r) => ({
        _id: r._id,
        roll: r.studentId,
        name: r.studentName || 'Unknown',
        status: r.status,
        time: r.checkIn || new Date(r.date).toLocaleTimeString(),
      })));
    }
  }, [records, recent.length]);

  const doLookup = async () => {
    const q = rollInput.trim();
    if (!q) return;
    setNotFound(false);
    setLookup(null);
    try {
      const data = await lookupAttendanceStudent(q);
      setLookup(data);
    } catch {
      setNotFound(true);
    }
  };

  const mark = async (status, force = false) => {
    if (!lookup?.student) return;
    try {
      const result = await createAttendance({
        studentId: lookup.student.roll,
        status,
        date: new Date().toISOString(),
        checkIn: status === 'Present' || status === 'Late' ? nowLabel() : null,
        force,
      });

      if (result.duplicate) {
        setToast('Already marked today. Use Force to overwrite.');
        return;
      }

      const created = result.data;
      setRecent((prev) => [
        { _id: created._id, roll: lookup.student.roll, name: lookup.student.name, status, time: nowLabel() },
        ...prev,
      ].slice(0, 8));

      if (result.paymentWarning) {
        setToast(`Marked ${status}. Warning: student has unpaid fees (${result.payment?.payStatus || 'Pending'}).`);
      } else {
        setToast(`Attendance marked: ${status}`);
      }

      setLookup(null);
      setRollInput('');
      await fetchRecords();
    } catch (err) {
      if (err?.response?.status === 409) {
        setToast(err.response.data.message || 'Already marked for today');
        setLookup((prev) => prev ? { ...prev, alreadyMarked: true, todayRecord: err.response.data.data } : prev);
      } else {
        setToast(err?.response?.data?.message || 'Failed to mark attendance');
      }
    }
  };

  const loadSummary = async () => {
    if (!viewRoll.trim()) return;
    try {
      const data = await getAttendanceSummary(viewRoll.trim(), viewMonth);
      setSummary(data);
    } catch (err) {
      setToast(err?.response?.data?.message || 'Student not found');
      setSummary(null);
    }
  };

  const runMulti = async () => {
    try {
      const result = await createMultiAttendance({
        date: multiDate,
        rolls: multiRolls,
        status: multiStatus,
      });
      setMultiResult(result.data);
      setToast(`Multi mark done: ${result.data.marked.length} marked, ${result.data.skipped.length} skipped, ${result.data.notFound.length} not found`);
      await fetchRecords();
    } catch (err) {
      setToast(err?.response?.data?.message || 'Multi attendance failed');
    }
  };

  const todayCounts = useMemo(() => {
    const c = { Present: 0, Leave: 0, Absent: 0 };
    recent.forEach((r) => { if (c[r.status] !== undefined) c[r.status] += 1; });
    return c;
  }, [recent]);

  const calendarMap = useMemo(() => {
    const map = {};
    (summary?.records || []).forEach((r) => {
      const day = new Date(r.date).getDate();
      map[day] = r.status;
    });
    return map;
  }, [summary]);

  const [year, month] = viewMonth.split('-').map(Number);
  const daysInMonth = monthDays(year, month);

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Attendance</h2>
          <p>Mark by roll, view calendar totals, and multi-mark with persistence.</p>
        </div>
        <div className="ap-tabs">
          <button className={`ap-tab${tab === 'mark' ? ' active' : ''}`} onClick={() => setTab('mark')}><UserCheck size={16} /> Mark</button>
          <button className={`ap-tab${tab === 'view' ? ' active' : ''}`} onClick={() => setTab('view')}><CalendarDays size={16} /> View</button>
          <button className={`ap-tab${tab === 'multi' ? ' active' : ''}`} onClick={() => setTab('multi')}><Users size={16} /> Multi</button>
        </div>
      </div>

      {toast && <div className="ap-hint ok" style={{ marginBottom: 12 }}>{toast}</div>}
      {fetchError && <div className="ap-hint err" style={{ marginBottom: 12 }}>{fetchError}</div>}

      {tab === 'mark' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head" style={{ marginBottom: 14 }}>
              <span className="acard-title">Mark Attendance</span>
              <span style={{ fontSize: 12, color: '#7286a3' }}>{new Date().toDateString()}</span>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: '1 1 220px' }}>
                <Search size={16} color="#5F7A9E" />
                <input
                  type="search"
                  placeholder="Enter or scan roll number…"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doLookup()}
                />
              </label>
              <button className="btn-primary" onClick={doLookup}><ScanLine size={15} /> Scan</button>
            </div>

            {notFound && <div className="ap-hint err" style={{ marginTop: 12 }}>No student found for "{rollInput}".</div>}

            {lookup?.student && (
              <>
                <div className="att-profile" style={{ marginTop: 16 }}>
                  <div className="att-profile-av" style={{
                    background: AV[0],
                    backgroundImage: lookup.student.photoUrl ? `url(${lookup.student.photoUrl})` : undefined,
                    backgroundSize: 'cover',
                  }}>
                    {!lookup.student.photoUrl && initials(lookup.student.name)}
                  </div>
                  <div>
                    <div className="att-profile-name">{lookup.student.name}</div>
                    <div className="att-profile-meta">Roll: <b>{lookup.student.roll}</b> · {lookup.student.course || '—'}</div>
                    <div className="att-profile-meta">Status: <b>{lookup.student.status}</b> · Pay: <b>{lookup.student.pay}</b></div>
                  </div>
                </div>

                {lookup.payment?.warning && (
                  <div className="ap-hint err" style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <AlertTriangle size={16} /> Unpaid fee warning — you can still mark attendance.
                  </div>
                )}

                {lookup.alreadyMarked && (
                  <div className="ap-hint err" style={{ marginTop: 12 }}>
                    Already marked today as <b>{lookup.todayRecord?.status}</b>. Marking again requires Force.
                  </div>
                )}

                <div className="att-actions" style={{ marginTop: 16 }}>
                  <button className="att-btn present" onClick={() => mark('Present', lookup.alreadyMarked)}><CheckCircle2 size={17} /> Present</button>
                  <button className="att-btn leave" onClick={() => mark('Leave', lookup.alreadyMarked)}><Clock3 size={17} /> Leave</button>
                  <button className="att-btn absent" onClick={() => mark('Absent', lookup.alreadyMarked)}><XCircle size={17} /> Absent</button>
                </div>
              </>
            )}
          </div>

          <div className="acard">
            <div className="acard-head"><span className="acard-title">Today Snapshot</span></div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              {Object.entries(todayCounts).map(([k, v]) => (
                <div key={k} style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{v}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{k}</div>
                </div>
              ))}
            </div>
            <div className="acard-title" style={{ marginBottom: 8 }}>Recent</div>
            {recent.map((r) => (
              <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eef2f7', fontSize: 13 }}>
                <span>{r.name} ({r.roll})</span>
                <span className={`badge ${STATUS_BADGE[r.status] || 'badge-grey'}`}>{r.status}</span>
              </div>
            ))}
            {loading && <div style={{ color: '#64748b', marginTop: 8 }}>Loading…</div>}
          </div>
        </div>
      )}

      {tab === 'view' && (
        <div className="acard">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <label className="admin-search" style={{ flex: '1 1 220px' }}>
              <Search size={16} />
              <input placeholder="Roll number" value={viewRoll} onChange={(e) => setViewRoll(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadSummary()} />
            </label>
            <input type="month" value={viewMonth} onChange={(e) => setViewMonth(e.target.value)} />
            <button className="btn-primary" onClick={loadSummary}>View</button>
          </div>

          {summary && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                {Object.entries(summary.totals).map(([k, v]) => (
                  <div key={k} style={{ minWidth: 110, background: '#f8fafc', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 20 }}>{v}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{k}</div>
                  </div>
                ))}
                <div style={{ minWidth: 110, background: '#ecfdf5', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 20 }}>{summary.percent}%</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Present %</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                  <div key={day} style={{
                    borderRadius: 10, padding: '10px 6px', textAlign: 'center', fontSize: 12,
                    background: calendarMap[day] === 'Present' ? '#dcfce7'
                      : calendarMap[day] === 'Leave' ? '#fef3c7'
                      : calendarMap[day] === 'Absent' ? '#fee2e2'
                      : '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}>
                    <div style={{ fontWeight: 700 }}>{day}</div>
                    <div>{calendarMap[day] || '—'}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'multi' && (
        <div className="acard">
          <div className="acard-title" style={{ marginBottom: 12 }}>Multi Attendance</div>
          <div className="tmg-form-grid">
            <div className="tmg-field"><label>Date</label><input type="date" value={multiDate} onChange={(e) => setMultiDate(e.target.value)} /></div>
            <div className="tmg-field">
              <label>Status</label>
              <select value={multiStatus} onChange={(e) => setMultiStatus(e.target.value)}>
                <option>Present</option><option>Leave</option><option>Absent</option>
              </select>
            </div>
            <div className="tmg-field tmg-field-span">
              <label>Roll numbers (comma-separated)</label>
              <textarea
                rows={4}
                value={multiRolls}
                onChange={(e) => setMultiRolls(e.target.value)}
                placeholder="TS-001, TS-002, TS-003"
                style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: 12 }}
              />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 12 }} onClick={runMulti}>Mark All</button>

          {multiResult && (
            <div style={{ marginTop: 16, fontSize: 13 }}>
              <div>Marked: {multiResult.marked.length}</div>
              <div>Skipped (already marked): {multiResult.skipped.length}</div>
              <div>Not found: {multiResult.notFound.join(', ') || '—'}</div>
              <div>Unpaid warnings: {multiResult.unpaidWarnings.map((u) => u.roll).join(', ') || '—'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
