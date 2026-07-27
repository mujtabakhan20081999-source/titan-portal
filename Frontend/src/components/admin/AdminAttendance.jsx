import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, Clock3, XCircle, ScanLine, Search, CalendarDays,
  UserCheck, UserX, Coffee, Save, Users,
} from 'lucide-react';
import { listAttendance, createAttendance, updateAttendance, deleteAttendance } from '../../services/attendanceService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const AV = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];

const STATUS_BADGE = { Present: 'badge-green', Leave: 'badge-amber', Absent: 'badge-grey' };

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('');
}

function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h %= 12; if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export default function AdminAttendance() {
  const [tab, setTab] = useState('mark');

  // ── Records from backend ──
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await listAttendance();
      setRecords(data || []);
    } catch (err) {
      setFetchError(err?.response?.data?.message || err.message || 'Failed to load records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ── Mark tab state ──
  const [rollInput, setRollInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [recent, setRecent] = useState([]);

  const lookup = () => {
    const q = rollInput.trim().toLowerCase();
    if (!q) return;
    // Search in existing attendance records by name/roll
    const found = records.find(
      (d) => (d.roll && d.roll.toLowerCase() === q) || (d.trainerName && d.trainerName.toLowerCase().includes(q)),
    );
    setSelected(found || null);
    setNotFound(!found);
  };

  const mark = async (status) => {
    if (!selected) return;
    try {
      const payload = {
        trainerName: selected.trainerName || selected.name || 'Unknown',
        date: new Date(),
        status,
        checkIn: status === 'Present' || status === 'Late' ? nowLabel() : null,
        checkOut: null,
        remarks: '',
      };
      const created = await createAttendance(payload);
      setRecent((prev) => [
        { _id: created._id, roll: selected.roll || '', name: selected.trainerName || selected.name || 'Unknown', status, time: nowLabel() },
        ...prev,
      ].slice(0, 8));
      setSelected(null);
      setRollInput('');
      setNotFound(false);
      await fetchRecords();
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    }
  };

  const todayCounts = useMemo(() => {
    const c = { Present: 0, Leave: 0, Absent: 0 };
    recent.forEach((r) => { c[r.status] += 1; });
    return c;
  }, [recent]);

  // Init recent from fetched records
  useEffect(() => {
    if (records.length > 0 && recent.length === 0) {
      const mapped = records.slice(0, 8).map((r) => ({
        _id: r._id,
        roll: r.roll || '',
        name: r.trainerName || r.name || 'Unknown',
        status: r.status || 'Present',
        time: r.checkIn || new Date(r.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }));
      setRecent(mapped);
    }
  }, [records]);

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Attendance</h2>
          <p>Mark and review student attendance across campuses.</p>
        </div>
        <div className="ap-tabs">
          <button className={`ap-tab${tab === 'mark' ? ' active' : ''}`} onClick={() => setTab('mark')}>
            <UserCheck size={16} /> Mark Attendance
          </button>
          <button className={`ap-tab${tab === 'view' ? ' active' : ''}`} onClick={() => setTab('view')}>
            <CalendarDays size={16} /> View Attendance
          </button>
          <button className={`ap-tab${tab === 'multi' ? ' active' : ''}`} onClick={() => setTab('multi')}>
            <Users size={16} /> Multi Attendance
          </button>
        </div>
      </div>

      {tab === 'mark' && (
        <div className="ap-2col-a">
          {/* Mark card */}
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
                  onKeyDown={(e) => e.key === 'Enter' && lookup()}
                />
              </label>
              <button className="btn-primary" onClick={lookup}>
                <ScanLine size={15} /> Scan
              </button>
            </div>

            {notFound && (
              <div className="ap-hint err" style={{ marginTop: 12 }}>
                No record found for "{rollInput}". Try a name from existing data.
              </div>
            )}

            {selected ? (
              <>
                <div className="att-profile" style={{ marginTop: 16 }}>
                  <div className="att-profile-av" style={{ background: AV[0] }}>{initials(selected.trainerName || selected.name || '')}</div>
                  <div>
                    <div className="att-profile-name">{selected.trainerName || selected.name}</div>
                    <div className="att-profile-meta">Status: <b>{selected.status}</b></div>
                    <div className="att-profile-meta">{selected.remarks || ''}</div>
                  </div>
                </div>

                <div className="att-actions" style={{ marginTop: 16 }}>
                  <button className="att-btn present" onClick={() => mark('Present')}>
                    <CheckCircle2 size={17} /> Mark Present
                  </button>
                  <button className="att-btn leave" onClick={() => mark('Leave')}>
                    <Clock3 size={17} /> Mark Leave
                  </button>
                  <button className="att-btn absent" onClick={() => mark('Absent')}>
                    <XCircle size={17} /> Mark Absent
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                marginTop: 16, padding: '30px 16px', textAlign: 'center',
                border: '1px dashed #cdd8ea', borderRadius: 14, color: '#7286a3',
              }}>
                <ScanLine size={30} color="#b3bfd2" />
                <div style={{ fontWeight: 700, marginTop: 8, color: '#5F7A9E' }}>Scan or search a roll number to begin</div>
              </div>
            )}
          </div>

          {/* Recent card */}
          <div className="acard" style={{ padding: 0 }}>
            <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0 }}>
              <span className="acard-title">Recent Attendance</span>
              <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 11.5 }} onClick={fetchRecords}>Refresh</button>
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
              <span className="badge badge-green">{todayCounts.Present} Present</span>
              <span className="badge badge-amber">{todayCounts.Leave} Leave</span>
              <span className="badge badge-grey">{todayCounts.Absent} Absent</span>
            </div>

            <div style={{ padding: '0 16px 12px' }}>
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#7286a3', fontWeight: 700 }}>Loading...</div>
              ) : fetchError ? (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 13 }}>{fetchError}</div>
                  <button className="btn-ghost" style={{ marginTop: 8, padding: '6px 12px', fontSize: 12 }} onClick={fetchRecords}>Retry</button>
                </div>
              ) : recent.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#7286a3', fontWeight: 700 }}>No records yet today.</div>
              ) : recent.map((r, i) => (
                <div className="att-recent-row" key={r._id || i}>
                  <div className="att-recent-av" style={{ background: AV[i % AV.length] }}>{initials(r.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="atable-cell-strong">{r.name}</div>
                    <div className="atable-cell-sub">{r.roll ? `${r.roll} · ` : ''}{r.time}</div>
                  </div>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'view' && <ViewAttendance records={records} loading={loading} fetchError={fetchError} onRetry={fetchRecords} />}
      {tab === 'multi' && <MultiAttendance records={records} onRefresh={fetchRecords} />}
    </div>
  );
}

/* ── View tab ─────────────────────────────────────────────────────────── */
function ViewAttendance({ records, loading, fetchError, onRetry }) {
  const [status, setStatus] = useState('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (records || []).filter((r) => {
      if (status !== 'All' && r.status !== status) return false;
      if (!query) return true;
      const name = (r.trainerName || r.name || '').toLowerCase();
      const roll = (r.roll || '').toLowerCase();
      return name.includes(query) || roll.includes(query);
    });
  }, [records, status, q]);

  const counts = (records || []).reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  const GRID = '120px 110px 1.4fr 1.4fr 110px';

  return (
    <>
      <div className="ap-3col">
        {[
          { label: 'Present', value: counts.Present || 0, bg: '#dcfce7', color: '#16a34a', Icon: UserCheck },
          { label: 'On Leave', value: counts.Leave || 0, bg: '#fef3c7', color: '#d97706', Icon: Coffee },
          { label: 'Absent', value: counts.Absent || 0, bg: '#fee2e2', color: '#dc2626', Icon: UserX },
        ].map((s) => (
          <div className="acard" key={s.label}>
            <div className="ap-kpi">
              <div className="ap-kpi-ic" style={{ background: s.bg }}><s.Icon size={24} color={s.color} /></div>
              <div>
                <div className="ap-kpi-val" style={{ color: s.color }}>{s.value}</div>
                <div className="ap-kpi-label">{s.label} — all records</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0, gap: 10 }}>
          <span className="acard-title">Attendance Records</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <label className="admin-search" style={{ minWidth: 180 }}>
              <Search size={15} color="#5F7A9E" />
              <input type="search" placeholder="Search name / roll…" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <select className="afilter-select" style={{ width: 'auto', minWidth: 130 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option><option>Present</option><option>Leave</option><option>Absent</option>
            </select>
            <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: 12 }} onClick={onRetry}>Refresh</button>
          </div>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 720 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Date</span><span>Roll No</span><span>Student</span><span>Course</span><span>Status</span>
            </div>
            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 700 }}>Loading...</div>
            ) : fetchError ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{fetchError}</div>
            ) : rows.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Records Found</div>
            ) : rows.map((r, i) => (
              <div className="atable-row" key={r._id || i} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell">{r.date ? new Date(r.date).toLocaleDateString() : ''}</span>
                <span className="atable-cell-strong">{r.roll || ''}</span>
                <span className="atable-cell-strong">{r.trainerName || r.name || ''}</span>
                <span className="atable-cell">{r.remarks || ''}</span>
                <span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Multi tab ────────────────────────────────────────────────────────── */
function MultiAttendance({ records, onRefresh }) {
  const directory = useMemo(() => {
    const seen = new Set();
    return (records || []).filter((r) => {
      const key = r.roll || r.trainerName || r.name;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [records]);

  const [marks, setMarks] = useState(() =>
    Object.fromEntries(directory.map((d) => [(d.roll || d._id), 'Present'])),
  );
  const [saved, setSaved] = useState(false);

  const setMark = (id, val) => { setMarks((m) => ({ ...m, [id]: val })); setSaved(false); };
  const setAll = (val) => { setMarks(Object.fromEntries(directory.map((d) => [(d.roll || d._id), val]))); setSaved(false); };

  const summary = Object.values(marks).reduce((a, v) => { a[v] += 1; return a; }, { Present: 0, Leave: 0, Absent: 0 });
  const GRID = '110px 1.6fr 1.4fr 220px';

  return (
    <div className="acard" style={{ padding: 0 }}>
      <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0, gap: 10 }}>
        <div>
          <span className="acard-title">Multi Attendance</span>
          <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>Mark all records in one pass, then save.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-ghost" style={{ padding: '7px 11px' }} onClick={() => setAll('Present')}>All Present</button>
          <button className="btn-ghost" style={{ padding: '7px 11px' }} onClick={() => setAll('Absent')}>All Absent</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        <span className="badge badge-green">{summary.Present} Present</span>
        <span className="badge badge-amber">{summary.Leave} Leave</span>
        <span className="badge badge-grey">{summary.Absent} Absent</span>
      </div>

      <div className="admin-scroll-x">
        <div className="atable" style={{ minWidth: 720 }}>
          <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
            <span>Roll No</span><span>Student</span><span>Course</span><span>Attendance</span>
          </div>
          {directory.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No records available</div>
          ) : directory.map((d, i) => {
            const id = d.roll || d._id;
            return (
              <div className="atable-row" key={id} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{d.roll || ''}</span>
                <div className="atable-name">
                  <div className="atable-av" style={{ background: AV[i % AV.length] }}>{initials(d.trainerName || d.name || '')}</div>
                  <div><div className="atable-cell-strong">{d.trainerName || d.name}</div></div>
                </div>
                <span className="atable-cell">{d.remarks || ''}</span>
                <div className="seg">
                  {['Present', 'Leave', 'Absent'].map((s) => (
                    <button
                      key={s}
                      className={`${marks[id] === s ? `on ${s.toLowerCase()}` : ''}`}
                      onClick={() => setMark(id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 16px', borderTop: '1px solid #f0f4fa' }}>
        <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>
          {saved ? '✓ Attendance saved.' : `${directory.length} unique records`}
        </div>
        <button className="btn-primary" onClick={() => { setSaved(true); onRefresh(); }}><Save size={15} /> Save Attendance</button>
      </div>
    </div>
  );
}

