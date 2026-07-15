import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Download, Eye, Pencil, MapPin, Users, Building2 } from 'lucide-react';

import '../styles/admin.css';

// Cities (each city maps to one campus). Super Admin sees every campus by default;
// picking a city narrows the list down to that campus's students.
const CITIES = ['Sukkur', 'Karachi', 'Lahore', 'Islamabad', 'Multan', 'Other'];

const AV_COLORS = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];

const STUDENTS = [
  { roll: 'AI-24-001', name: 'Anas Hassan', father: 'Hassan Ali', cnic: '45601-1234567-1', phone: '0300-1234567', city: 'Sukkur', course: 'Artificial Intelligence', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'WD-24-015', name: 'Zainab Fatima', father: 'Muhammad Iqbal', cnic: '42201-7654321-2', phone: '0345-9876543', city: 'Karachi', course: 'Web Development', meta: 'Batch 02 / Evening', status: 'Enrolled', pay: 'Pending' },
  { roll: 'PY-24-032', name: 'Muhammad Usman', father: 'Usman Bhai', cnic: '38401-2345678-3', phone: '0312-1112223', city: 'Lahore', course: 'Python Programming', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'DS-24-008', name: 'Ayesha Siddiqui', father: 'Abdul Rehman', cnic: '40102-3456789-4', phone: '0301-7773332', city: 'Islamabad', course: 'Data Science', meta: 'Batch 03 / Evening', status: 'Enrolled', pay: 'Not Generated' },
  { roll: 'CS-24-011', name: 'Bilal Ahmed', father: 'Ahmed Khan', cnic: '37405-1122334-5', phone: '0302-4455667', city: 'Multan', course: 'Cyber Security', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'AI-24-002', name: 'Fatima Noor', father: 'Noor Muhammad', cnic: '45601-9988776-6', phone: '0333-1213141', city: 'Sukkur', course: 'Artificial Intelligence', meta: 'Batch 02 / Evening', status: 'Enrolled', pay: 'Pending' },
  { roll: 'UX-24-020', name: 'Hamza Tariq', father: 'Tariq Mehmood', cnic: '35202-5566778-7', phone: '0321-6677889', city: 'Lahore', course: 'UI/UX Design', meta: 'Batch 01 / Morning', status: 'Completed', pay: 'Paid' },
  { roll: 'WD-24-016', name: 'Sana Malik', father: 'Malik Riaz', cnic: '42101-2233445-8', phone: '0346-2223334', city: 'Karachi', course: 'Web Development', meta: 'Batch 03 / Evening', status: 'Enrolled', pay: 'Paid' },
  { roll: 'GD-24-005', name: 'Omar Khalid', father: 'Khalid Javed', cnic: '61101-3344556-9', phone: '0311-9998887', city: 'Islamabad', course: 'Graphic Design', meta: 'Batch 02 / Morning', status: 'Enrolled', pay: 'Pending' },
  { roll: 'PY-24-033', name: 'Maria Yousuf', father: 'Yousuf Ali', cnic: '36302-7788990-0', phone: '0300-5556667', city: 'Multan', course: 'Python Programming', meta: 'Batch 01 / Evening', status: 'Dropped', pay: 'Not Generated' },
  { roll: 'DM-24-012', name: 'Ali Raza', father: 'Raza Hussain', cnic: '45602-1231231-1', phone: '0334-4443332', city: 'Sukkur', course: 'Digital Marketing', meta: 'Batch 02 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'MA-24-007', name: 'Hina Shahid', father: 'Shahid Iqbal', cnic: '42301-4564564-2', phone: '0322-1119998', city: 'Karachi', course: 'Mobile App Dev', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'DS-24-009', name: 'Usama Javed', father: 'Javed Akhtar', cnic: '35201-7897897-3', phone: '0301-2224446', city: 'Lahore', course: 'Data Science', meta: 'Batch 03 / Evening', status: 'Enrolled', pay: 'Pending' },
  { roll: 'CS-24-012', name: 'Rabia Aslam', father: 'Aslam Pervez', cnic: '61102-3213213-4', phone: '0333-7778889', city: 'Islamabad', course: 'Cyber Security', meta: 'Batch 02 / Morning', status: 'Completed', pay: 'Paid' },
  { roll: 'AI-24-003', name: 'Zeeshan Haider', father: 'Haider Ali', cnic: '36301-6546546-5', phone: '0345-3332221', city: 'Multan', course: 'Artificial Intelligence', meta: 'Batch 01 / Evening', status: 'Enrolled', pay: 'Not Generated' },
  { roll: 'UX-24-021', name: 'Areeba Khan', father: 'Salman Khan', cnic: '45603-9879879-6', phone: '0300-8887776', city: 'Sukkur', course: 'UI/UX Design', meta: 'Batch 02 / Morning', status: 'Enrolled', pay: 'Paid' },
  { roll: 'WD-24-017', name: 'Talha Nadeem', father: 'Nadeem Akhtar', cnic: '42102-1472583-7', phone: '0321-5554443', city: 'Other', course: 'Web Development', meta: 'Batch 01 / Morning', status: 'Enrolled', pay: 'Pending' },
  { roll: 'GD-24-006', name: 'Nimra Saleem', father: 'Saleem Raza', cnic: '35203-3692581-8', phone: '0311-6665554', city: 'Karachi', course: 'Graphic Design', meta: 'Batch 03 / Evening', status: 'Enrolled', pay: 'Paid' },
  { roll: 'PY-24-034', name: 'Kamran Ali', father: 'Ali Sher', cnic: '61103-8529637-9', phone: '0334-2221110', city: 'Lahore', course: 'Python Programming', meta: 'Batch 02 / Morning', status: 'Completed', pay: 'Paid' },
  { roll: 'DM-24-013', name: 'Sadia Anwar', father: 'Anwar Baig', cnic: '36303-1593574-0', phone: '0345-9990001', city: 'Other', course: 'Digital Marketing', meta: 'Batch 01 / Evening', status: 'Enrolled', pay: 'Not Generated' },
];

const GRID = '92px 1.7fr 1.25fr 1.05fr 1.35fr 0.95fr 100px 118px 62px';

const payBadge = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };
const statusBadge = { Enrolled: 'badge-blue', Completed: 'badge-green', Dropped: 'badge-grey' };

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

function Students() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [payFilter, setPayFilter] = useState('All Payments');

  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      if (!alive) return;
      setRows(STUDENTS);
      setLoading(false);
    }, 500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  const courses = useMemo(() => ['All Courses', ...Array.from(new Set(rows.map((r) => r.course)))], [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((s) => {
      if (cityFilter !== 'All Cities' && s.city !== cityFilter) return false;
      if (courseFilter !== 'All Courses' && s.course !== courseFilter) return false;
      if (statusFilter !== 'All Statuses' && s.status !== statusFilter) return false;
      if (payFilter !== 'All Payments' && s.pay !== payFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.father.toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q) ||
        s.cnic.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      );
    });
  }, [rows, search, cityFilter, courseFilter, statusFilter, payFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, cityFilter, courseFilter, statusFilter, payFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage],
  );

  const clearAll = () => {
    setSearch('');
    setCityFilter('All Cities');
    setCourseFilter('All Courses');
    setStatusFilter('All Statuses');
    setPayFilter('All Payments');
  };

  return (
    <div className="acard" style={{ padding: 0 }}>
      {/* Header */}
      <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
        <div>
          <span className="acard-title" style={{ fontSize: 16 }}>Students</span>
          <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>
            {cityFilter === 'All Cities'
              ? 'All campuses — every registered student'
              : `${cityFilter} Campus — filtered students`}
          </div>
        </div>
        <div className="acard-tools">
          <button className="btn-primary">
            <Plus size={15} /> Add Student
          </button>
          <button className="btn-ghost">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 18px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <label className="admin-search" style={{ minWidth: 240, flex: '1 1 240px' }}>
          <Search size={16} color="#5F7A9E" />
          <input
            type="search"
            placeholder="Search name, roll no, CNIC, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select className="afilter-select" style={{ width: 'auto', minWidth: 150 }} value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="All Cities">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select className="afilter-select" style={{ width: 'auto', minWidth: 150 }} value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select className="afilter-select" style={{ width: 'auto', minWidth: 140 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Statuses">All Statuses</option>
          <option value="Enrolled">Enrolled</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
        </select>

        <select className="afilter-select" style={{ width: 'auto', minWidth: 150 }} value={payFilter} onChange={(e) => setPayFilter(e.target.value)}>
          <option value="All Payments">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Not Generated">Not Generated</option>
        </select>

        <button className="btn-ghost" style={{ padding: '8px 12px' }} onClick={clearAll}>Clear</button>
      </div>

      {/* Table */}
      <div className="admin-scroll-x">
        <div className="atable" style={{ minWidth: 1040 }}>
          <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
            <span>Roll No</span>
            <span>Name</span>
            <span>CNIC</span>
            <span>Phone</span>
            <span>Course / Batch</span>
            <span>City / Campus</span>
            <span>Status</span>
            <span>Payment</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 700 }}>Loading students…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 34, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Students Found</div>
          ) : (
            paginated.map((s, i) => (
              <div className="atable-row" key={s.roll} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{s.roll}</span>
                <div className="atable-name">
                  <div className="atable-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>
                    {initials(s.name)}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="#0891b2" />
                  <div>
                    <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.city}</div>
                    <div className="atable-cell-sub">{s.city} Campus</div>
                  </div>
                </div>
                <span className={`badge ${statusBadge[s.status] || 'badge-grey'}`}>{s.status}</span>
                <span className={`badge ${payBadge[s.pay] || 'badge-grey'}`}>{s.pay}</span>
                <div className="atable-actions">
                  <button title="View"><Eye size={16} /></button>
                  <button title="Edit"><Pencil size={15} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 18px', borderTop: '1px solid #f0f4fa' }}>
        <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color="#2563eb" />
            Showing <b>{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</b>–
            <b>{Math.min(filtered.length, safePage * pageSize)}</b> of <b>{filtered.length}</b>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7286a3' }}>
            <Building2 size={14} />
            {cityFilter === 'All Cities' ? 'All Campuses' : `${cityFilter} Campus`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                className="btn-ghost"
                style={{
                  padding: '8px 12px',
                  background: p === safePage ? '#0A3D91' : '#fff',
                  color: p === safePage ? '#fff' : '#0A3D91',
                  borderColor: p === safePage ? '#0A3D91' : '#cdd8ea',
                }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
          })}
          <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Students;
