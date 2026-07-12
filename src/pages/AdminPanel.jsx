import { useState } from 'react';
import {
  Users, GraduationCap, BookOpen, MapPin, Building2, UserCog, CalendarClock,
  Megaphone, Eye, Pencil, Plus, Download, SlidersHorizontal, RotateCcw,
  CalendarDays, Wallet, ClipboardList, HelpCircle,
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import AdminSupport from '../components/admin/AdminSupport';
import AdminReports from '../components/admin/AdminReports';
import '../styles/admin.css';

/* ── Data (mock) ─────────────────────────────────────────────────────── */
const stats = [
  { icon: Users,         value: '4,658', label: 'Total Students',    sub: 'All Time',          bg: '#dbeafe', color: '#2563eb' },
  { icon: GraduationCap, value: '2,945', label: 'Enrolled Students', sub: 'Currently Active',  bg: '#dcfce7', color: '#16a34a' },
  { icon: BookOpen,      value: '56',    label: 'Courses',           sub: 'Total Courses',     bg: '#ede9fe', color: '#7c3aed' },
  { icon: MapPin,        value: '12',    label: 'Cities',            sub: 'Active Cities',     bg: '#fef3c7', color: '#d97706' },
  { icon: Building2,     value: '24',    label: 'Campuses',          sub: 'Active Campuses',   bg: '#e0f2fe', color: '#0891b2' },
  { icon: UserCog,       value: '142',   label: 'Trainers',          sub: 'Active Trainers',   bg: '#dbeafe', color: '#1150c0' },
  { icon: CalendarClock, value: '87',    label: 'Active Slots',      sub: 'Running',           bg: '#f0fdf4', color: '#16a34a' },
];

const campuses = [
  { label: 'Sukkur Campus',    value: 1345, color: '#0A3D91' },
  { label: 'Karachi Campus',   value: 986,  color: '#1150c0' },
  { label: 'Lahore Campus',    value: 754,  color: '#2563eb' },
  { label: 'Islamabad Campus', value: 632,  color: '#3b82f6' },
  { label: 'Multan Campus',    value: 521,  color: '#60a5fa' },
  { label: 'Other Campuses',   value: 420,  color: '#F3C623' },
];

const courses = [
  { label: 'AI',           value: 812 },
  { label: 'Web Dev',      value: 694 },
  { label: 'Python',       value: 612 },
  { label: 'Graphic Des.', value: 508 },
  { label: 'Data Science', value: 458 },
  { label: 'Cyber Sec.',   value: 412 },
  { label: 'UI/UX',        value: 376 },
  { label: 'Digital Mkt.', value: 301 },
  { label: 'Mobile App',   value: 268 },
  { label: 'Other',        value: 214 },
];

const students = [
  { roll: 'AI-24-001', name: 'Anas Hassan',    father: 'Hassan Ali',      cnic: '45601-1234567-1', phone: '0300-1234567', course: 'Artificial Intelligence', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid',          av: '#2563eb' },
  { roll: 'WD-24-015', name: 'Zainab Fatima',  father: 'Muhammad Iqbal',  cnic: '42201-7654321-2', phone: '0345-9876543', course: 'Web Development',        meta: 'Batch 02 / Evening', status: 'Enrolled', pay: 'Pending',       av: '#db2777' },
  { roll: 'PY-24-032', name: 'Muhammad Usman', father: 'Usman Bhai',      cnic: '38401-2345678-3', phone: '0312-1112223', course: 'Python Programming',    meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid',          av: '#16a34a' },
  { roll: 'DS-24-008', name: 'Ayesha Siddiqui',father: 'Abdul Rehman',    cnic: '40102-3456789-4', phone: '0301-7773332', course: 'Data Science',          meta: 'Batch 03 / Evening', status: 'Enrolled', pay: 'Not Generated', av: '#d97706' },
];

const filters = [
  { label: 'City',           value: 'All Cities' },
  { label: 'Campus',         value: 'All Campuses' },
  { label: 'Course',         value: 'All Courses' },
  { label: 'Batch',          value: 'All Batches' },
  { label: 'Slot',           value: 'All Slots' },
  { label: 'Status',         value: 'All Statuses' },
  { label: 'Payment Status', value: 'All Payment Statuses' },
];

/* ── Donut chart (pure SVG) ──────────────────────────────────────────── */
function DonutChart({ data, total }) {
  let acc = 0;
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <g transform="rotate(-90 75 75)">
        {data.map((s) => {
          const pct = (s.value / total) * 100;
          const el = (
            <circle
              key={s.label}
              cx="75" cy="75" r="55" fill="none"
              stroke={s.color} strokeWidth="20"
              pathLength="100"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-acc}
            />
          );
          acc += pct;
          return el;
        })}
      </g>
      <text x="75" y="70" textAnchor="middle" fontSize="22" fontWeight="800" fill="#10375C">
        {total.toLocaleString()}
      </text>
      <text x="75" y="90" textAnchor="middle" fontSize="11" fill="#7286a3">Students</text>
    </svg>
  );
}

/* ── Mini summary card ───────────────────────────────────────────────── */
function MiniCard({ icon: Icon, iconColor, iconBg, title, sub, items }) {
  return (
    <div className="acard">
      <div className="acard-head" style={{ marginBottom: 10 }}>
        <div>
          <div className="acard-title" style={{ fontSize: 14 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: '#7286a3', marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={iconColor} />
        </div>
      </div>
      <div className="amini-stats">
        {items.map((it) => (
          <div key={it.label} className="amini-item">
            <div className="amini-val" style={{ color: it.color }}>{it.value}</div>
            <div className="amini-label">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPanel({ admin, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const roleLabel = admin?.role === 'subadmin' ? 'Sub Admin' : 'Super Admin';

  const totalStudents = campuses.reduce((s, c) => s + c.value, 0);
  const maxCourse = Math.max(...courses.map((c) => c.value));

  const payBadge = { 'Paid': 'badge-green', 'Pending': 'badge-amber', 'Not Generated': 'badge-grey' };

  return (
    <div className="admin-app">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        active={active}
        onSelect={(l) => { setActive(l); setSidebarOpen(false); }}
      />
      <div className={`admin-backdrop${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminTopBar
          title={active === 'Support' ? 'Support' : 'Dashboard'}
          subtitle={active === 'Support' ? 'Help & assistance center' : `Welcome back, ${roleLabel}!`}
          onMenu={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        {active === 'Support' ? (
          <div className="admin-content">
            <AdminSupport />
          </div>
        ) : active === 'Reports' ? (
          <AdminReports />
        ) : (
        <div className="admin-content">

          {/* Stat cards */}
          <div className="admin-stats">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div className="astat" key={s.label}>
                  <div className="astat-icon" style={{ background: s.bg }}>
                    <Icon size={22} color={s.color} />
                  </div>
                  <div>
                    <div className="astat-val">{s.value}</div>
                    <div className="astat-label">{s.label}</div>
                    <div className="astat-sub">{s.sub}</div>
                  </div>
                </div>
              );
            })}
            <div className="astat gold">
              <div className="astat-icon"><Megaphone size={22} color="#4a2f00" /></div>
              <div>
                <div className="astat-val">23</div>
                <div className="astat-label">Registration Open</div>
                <div className="astat-sub">Slots Open</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="admin-2col">
            <div className="acard">
              <div className="acard-head">
                <span className="acard-title">Students Per Campus</span>
                <span style={{ fontSize: 12, color: '#7286a3' }}>Sort: High to Low</span>
              </div>
              <div className="donut-row">
                <DonutChart data={campuses} total={totalStudents} />
                <div className="donut-legend">
                  {campuses.map((c) => (
                    <div className="donut-leg-item" key={c.label}>
                      <span className="donut-leg-dot" style={{ background: c.color }} />
                      {c.label}
                      <span className="donut-leg-val">{c.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="acard">
              <div className="acard-head">
                <span className="acard-title">Students Per Course</span>
                <span style={{ fontSize: 12, color: '#7286a3' }}>Sort: High to Low</span>
              </div>
              <div className="barchart">
                {courses.map((c) => (
                  <div className="bar-col" key={c.label}>
                    <span className="bar-val">{c.value}</span>
                    <div className="bar-fill" style={{ height: `${(c.value / maxCourse) * 140}px` }} />
                    <span className="bar-label">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Students table + filters */}
          <div className="admin-tablewrap">
            <div className="acard" style={{ padding: 0 }}>
              <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
                <div>
                  <span className="acard-title">Students</span>
                  <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>Manage and view all regional students</div>
                </div>
                <div className="acard-tools">
                  <button className="btn-primary"><Plus size={15} /> Add Student</button>
                  <button className="btn-ghost"><Download size={15} /> Export CSV</button>
                </div>
              </div>

              <div className="admin-scroll-x">
                <div className="atable">
                  <div className="atable-head">
                    <span>Roll No</span><span>Name</span><span>CNIC</span><span>Phone</span>
                    <span>Course / Batch</span><span>Status</span><span>Payment</span><span>Action</span>
                  </div>
                  {students.map((s) => (
                    <div className="atable-row" key={s.roll}>
                      <span className="atable-cell-strong">{s.roll}</span>
                      <div className="atable-name">
                        <div className="atable-av" style={{ background: s.av }}>
                          {s.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </div>
                        <div>
                          <div className="atable-cell-strong">{s.name}</div>
                          <div className="atable-cell-sub">{s.father}</div>
                        </div>
                      </div>
                      <span className="atable-cell">{s.cnic}</span>
                      <span className="atable-cell">{s.phone}</span>
                      <div>
                        <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.course}</div>
                        <div className="atable-cell-sub">{s.meta}</div>
                      </div>
                      <span className="badge badge-blue">{s.status}</span>
                      <span className={`badge ${payBadge[s.pay]}`}>{s.pay}</span>
                      <div className="atable-actions">
                        <button title="View"><Eye size={16} /></button>
                        <button title="Edit"><Pencil size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="acard">
              <div className="acard-head" style={{ marginBottom: 14 }}>
                <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <SlidersHorizontal size={16} color="#0A3D91" /> Filters
                </span>
                <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 11.5 }}>
                  <RotateCcw size={13} /> Clear All
                </button>
              </div>

              <div className="afilter-group">
                <label className="afilter-label">Date Range</label>
                <input className="afilter-input" defaultValue="01 May 2026 - 31 May 2026" readOnly />
              </div>
              {filters.map((f) => (
                <div className="afilter-group" key={f.label}>
                  <label className="afilter-label">{f.label}</label>
                  <select className="afilter-select" defaultValue="all">
                    <option value="all">{f.value}</option>
                  </select>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
                Apply Filters
              </button>
            </div>
          </div>

          {/* Bottom summary cards */}
          <div className="admin-4col">
            <MiniCard
              icon={CalendarDays} iconColor="#2563eb" iconBg="#dbeafe"
              title="Today's Attendance" sub="All Campuses"
              items={[
                { label: 'Present', value: '1,245', color: '#16a34a' },
                { label: 'Leave',   value: '98',    color: '#d97706' },
                { label: 'Absent',  value: '67',    color: '#dc2626' },
              ]}
            />
            <MiniCard
              icon={Wallet} iconColor="#16a34a" iconBg="#dcfce7"
              title="Fee Summary" sub="This Month"
              items={[
                { label: 'Collected', value: 'Rs 3.24M', color: '#16a34a' },
                { label: 'Pending',   value: 'Rs 1.24M', color: '#dc2626' },
              ]}
            />
            <MiniCard
              icon={ClipboardList} iconColor="#7c3aed" iconBg="#ede9fe"
              title="Assignments" sub="This Week"
              items={[
                { label: 'Submitted', value: '128', color: '#2563eb' },
                { label: 'Pending',   value: '42',  color: '#d97706' },
              ]}
            />
            <MiniCard
              icon={HelpCircle} iconColor="#0891b2" iconBg="#e0f2fe"
              title="Quizzes" sub="This Week"
              items={[
                { label: 'Conducted', value: '36', color: '#2563eb' },
                { label: 'Pending',   value: '12', color: '#d97706' },
              ]}
            />
          </div>

        </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
