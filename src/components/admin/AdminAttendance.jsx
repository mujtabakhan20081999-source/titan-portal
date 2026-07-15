import { useMemo, useState } from 'react';
import {
  CheckCircle2, Clock3, XCircle, ScanLine, Search, CalendarDays,
  UserCheck, UserX, Coffee, Save, Users,
} from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const AV = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];

const DIRECTORY = [
  { roll: 'AI-24-001', name: 'Awais Hussain', father: 'Hussain Ali', course: 'Artificial Intelligence', batch: 'Batch 01 / Morning', campus: 'Sukkur' },
  { roll: 'WD-24-015', name: 'Zainab Fatima', father: 'Muhammad Iqbal', course: 'Web Development', batch: 'Batch 02 / Evening', campus: 'Karachi' },
  { roll: 'PY-24-032', name: 'Muhammad Usman', father: 'Usman Bhai', course: 'Python Programming', batch: 'Batch 01 / Morning', campus: 'Lahore' },
  { roll: 'DS-24-008', name: 'Ayesha Siddiqui', father: 'Abdul Rehman', course: 'Data Science', batch: 'Batch 03 / Evening', campus: 'Islamabad' },
  { roll: 'CS-24-011', name: 'Bilal Ahmed', father: 'Ahmed Khan', course: 'Cyber Security', batch: 'Batch 01 / Morning', campus: 'Multan' },
  { roll: 'AI-24-002', name: 'Fatima Noor', father: 'Noor Muhammad', course: 'Artificial Intelligence', batch: 'Batch 02 / Evening', campus: 'Sukkur' },
  { roll: 'UX-24-020', name: 'Hamza Tariq', father: 'Tariq Mehmood', course: 'UI/UX Design', batch: 'Batch 01 / Morning', campus: 'Lahore' },
];

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

  // ── Mark tab state ──
  const [rollInput, setRollInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [recent, setRecent] = useState([
    { roll: 'AI-24-001', name: 'Awais Hussain', status: 'Present', time: '09:02 AM' },
    { roll: 'WD-24-015', name: 'Zainab Fatima', status: 'Present', time: '09:04 AM' },
    { roll: 'DS-24-008', name: 'Ayesha Siddiqui', status: 'Leave', time: '09:06 AM' },
    { roll: 'CS-24-011', name: 'Bilal Ahmed', status: 'Absent', time: '09:08 AM' },
  ]);

  const lookup = () => {
    const q = rollInput.trim().toLowerCase();
    if (!q) return;
    const found = DIRECTORY.find(
      (d) => d.roll.toLowerCase() === q || d.name.toLowerCase().includes(q),
    );
    setSelected(found || null);
    setNotFound(!found);
  };

  const mark = (status) => {
    if (!selected) return;
    setRecent((prev) => [
      { roll: selected.roll, name: selected.name, status, time: nowLabel() },
      ...prev,
    ].slice(0, 8));
    setSelected(null);
    setRollInput('');
    setNotFound(false);
  };

  const todayCounts = useMemo(() => {
    const c = { Present: 0, Leave: 0, Absent: 0 };
    recent.forEach((r) => { c[r.status] += 1; });
    return c;
  }, [recent]);

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
                No student found for “{rollInput}”. Try AI-24-001 or a name.
              </div>
            )}

            {selected ? (
              <>
                <div className="att-profile" style={{ marginTop: 16 }}>
                  <div className="att-profile-av" style={{ background: AV[0] }}>{initials(selected.name)}</div>
                  <div>
                    <div className="att-profile-name">{selected.name}</div>
                    <div className="att-profile-meta">Roll No: <b>{selected.roll}</b> · {selected.campus} Campus</div>
                    <div className="att-profile-meta">{selected.course} — {selected.batch}</div>
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
              <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 11.5 }}>View All</button>
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
              <span className="badge badge-green">{todayCounts.Present} Present</span>
              <span className="badge badge-amber">{todayCounts.Leave} Leave</span>
              <span className="badge badge-grey">{todayCounts.Absent} Absent</span>
            </div>

            <div style={{ padding: '0 16px 12px' }}>
              {recent.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#7286a3', fontWeight: 700 }}>No records yet today.</div>
              ) : recent.map((r, i) => (
                <div className="att-recent-row" key={`${r.roll}-${i}`}>
                  <div className="att-recent-av" style={{ background: AV[i % AV.length] }}>{initials(r.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="atable-cell-strong">{r.name}</div>
                    <div className="atable-cell-sub">{r.roll} · {r.time}</div>
                  </div>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'view' && <ViewAttendance />}
      {tab === 'multi' && <MultiAttendance />}
    </div>
  );
}

/* ── View tab ─────────────────────────────────────────────────────────── */
function ViewAttendance() {
  const RECORDS = [
    { date: '2026-07-14', roll: 'AI-24-001', name: 'Awais Hussain', course: 'Artificial Intelligence', status: 'Present' },
    { date: '2026-07-14', roll: 'WD-24-015', name: 'Zainab Fatima', course: 'Web Development', status: 'Present' },
    { date: '2026-07-14', roll: 'PY-24-032', name: 'Muhammad Usman', course: 'Python Programming', status: 'Leave' },
    { date: '2026-07-13', roll: 'DS-24-008', name: 'Ayesha Siddiqui', course: 'Data Science', status: 'Absent' },
    { date: '2026-07-13', roll: 'CS-24-011', name: 'Bilal Ahmed', course: 'Cyber Security', status: 'Present' },
    { date: '2026-07-13', roll: 'AI-24-002', name: 'Fatima Noor', course: 'Artificial Intelligence', status: 'Present' },
    { date: '2026-07-12', roll: 'UX-24-020', name: 'Hamza Tariq', course: 'UI/UX Design', status: 'Leave' },
  ];

  const [status, setStatus] = useState('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return RECORDS.filter((r) => {
      if (status !== 'All' && r.status !== status) return false;
      if (!query) return true;
      return r.name.toLowerCase().includes(query) || r.roll.toLowerCase().includes(query);
    });
  }, [status, q]);

  const counts = RECORDS.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
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
                <div className="ap-kpi-label">{s.label} — last 3 days</div>
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
          </div>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 720 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Date</span><span>Roll No</span><span>Student</span><span>Course</span><span>Status</span>
            </div>
            {rows.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Records Found</div>
            ) : rows.map((r, i) => (
              <div className="atable-row" key={`${r.roll}-${r.date}-${i}`} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell">{r.date}</span>
                <span className="atable-cell-strong">{r.roll}</span>
                <span className="atable-cell-strong">{r.name}</span>
                <span className="atable-cell">{r.course}</span>
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
function MultiAttendance() {
  const [marks, setMarks] = useState(() =>
    Object.fromEntries(DIRECTORY.map((d) => [d.roll, 'Present'])),
  );
  const [saved, setSaved] = useState(false);

  const setMark = (roll, val) => { setMarks((m) => ({ ...m, [roll]: val })); setSaved(false); };
  const setAll = (val) => { setMarks(Object.fromEntries(DIRECTORY.map((d) => [d.roll, val]))); setSaved(false); };

  const summary = Object.values(marks).reduce((a, v) => { a[v] += 1; return a; }, { Present: 0, Leave: 0, Absent: 0 });
  const GRID = '110px 1.6fr 1.4fr 220px';

  return (
    <div className="acard" style={{ padding: 0 }}>
      <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0, gap: 10 }}>
        <div>
          <span className="acard-title">Multi Attendance — Batch 01 / Morning</span>
          <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>Mark the whole class in one pass, then save.</div>
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
          {DIRECTORY.map((d, i) => (
            <div className="atable-row" key={d.roll} style={{ gridTemplateColumns: GRID }}>
              <span className="atable-cell-strong">{d.roll}</span>
              <div className="atable-name">
                <div className="atable-av" style={{ background: AV[i % AV.length] }}>{initials(d.name)}</div>
                <div><div className="atable-cell-strong">{d.name}</div><div className="atable-cell-sub">{d.father}</div></div>
              </div>
              <span className="atable-cell">{d.course}</span>
              <div className="seg">
                {['Present', 'Leave', 'Absent'].map((s) => (
                  <button
                    key={s}
                    className={`${marks[d.roll] === s ? `on ${s.toLowerCase()}` : ''}`}
                    onClick={() => setMark(d.roll, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 16px', borderTop: '1px solid #f0f4fa' }}>
        <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>
          {saved ? '✓ Attendance saved for the batch.' : `${DIRECTORY.length} students in this batch`}
        </div>
        <button className="btn-primary" onClick={() => setSaved(true)}><Save size={15} /> Save Attendance</button>
      </div>
    </div>
  );
}
