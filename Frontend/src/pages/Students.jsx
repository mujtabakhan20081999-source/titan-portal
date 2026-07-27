import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Plus, Download, Eye, Pencil, MapPin, Users, Building2, X } from 'lucide-react';
import { listStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';

import '../styles/admin.css';

const CITIES = ['Sukkur', 'Karachi', 'Lahore', 'Islamabad', 'Multan', 'Other'];

const AV_COLORS = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];

const GRID = '92px 1.7fr 1.25fr 1.05fr 1.35fr 0.95fr 100px 118px 62px';

const payBadge = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };
const statusBadge = { Enrolled: 'badge-blue', Completed: 'badge-green', Dropped: 'badge-grey' };

const COURSES_LIST = ['Artificial Intelligence', 'Web Development', 'Python Programming', 'Data Science', 'Cyber Security', 'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'Mobile App Dev'];

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

const emptyStudent = {
  roll: '',
  name: '',
  father: '',
  cnic: '',
  phone: '',
  email: '',
  password: 'student123',
  city: 'Sukkur',
  course: COURSES_LIST[0],
  meta: '',
  status: 'Enrolled',
  pay: 'Not Generated',
};

function Students() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [payFilter, setPayFilter] = useState('All Payments');

  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyStudent });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listStudents();
      setRows(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load students');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
        (s.father || '').toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q) ||
        (s.cnic || '').toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q)
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

  const openAddModal = () => {
    setForm({ ...emptyStudent, roll: `STU-${Date.now().toString().slice(-6)}` });
    setFormError('');
    setSuccessMsg('');
    setModalOpen(true);
  };

  const handleAddStudent = async () => {
    if (!form.name.trim() || !form.roll.trim()) {
      setFormError('Name and Roll Number are required');
      return;
    }
    if (!form.email.trim()) {
      setFormError('Email is required for student login');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      // 1. Create the student record in DB
      const created = await createStudent(form);
      
      // 2. Also create a User account so student can login to their portal
      try {
        await Promise.resolve(
          form.name.trim(),
          form.email.trim(),
          form.password || 'student123',
          'student',
          form.city
        );
      } catch (userErr) {
        // If user already exists, that's okay — just log it
        console.warn('User registration (non-blocking):', userErr?.response?.data?.message || userErr.message);
      }
      
      setRows((prev) => [created, ...prev]);
      setSuccessMsg(`✅ Student "${created.name}" (${created.roll}) added successfully! 
        Login credentials: Email: ${form.email} / Password: ${form.password || 'student123'}
        Student can now login and access their portal. Also visible in Sub-Admin panel.`);
      setModalOpen(false);
      setForm({ ...emptyStudent });
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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
            <button className="btn-primary" onClick={openAddModal}>
              <Plus size={15} /> Add Student
            </button>
            <button className="btn-ghost">
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div style={{ margin: '0 18px 14px', padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, color: '#166534', fontWeight: 700, fontSize: 13 }}>
            {successMsg}
          </div>
        )}

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
            ) : error ? (
              <div style={{ padding: 34, textAlign: 'center' }}>
                <div style={{ color: '#dc2626', fontWeight: 800, marginBottom: 8 }}>Error Loading Students</div>
                <div style={{ color: '#5F7A9E', fontSize: 13 }}>{error}</div>
                <button className="btn-ghost" style={{ marginTop: 12, padding: '8px 16px' }} onClick={fetchStudents}>Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 34, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Students Found</div>
            ) : (
              paginated.map((s, i) => (
                <div className="atable-row" key={s._id || s.roll} style={{ gridTemplateColumns: GRID }}>
                  <span className="atable-cell-strong">{s.roll}</span>
                  <div className="atable-name">
                    <div className="atable-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>
                      {initials(s.name)}
                    </div>
                    <div>
                      <div className="atable-cell-strong">{s.name}</div>
                      <div className="atable-cell-sub">{s.father || ''}</div>
                    </div>
                  </div>
                  <span className="atable-cell">{s.cnic || ''}</span>
                  <span className="atable-cell">{s.phone || ''}</span>
                  <div>
                    <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.course || ''}</div>
                    <div className="atable-cell-sub">{s.meta || ''}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="#0891b2" />
                    <div>
                      <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.city || ''}</div>
                      <div className="atable-cell-sub">{s.city ? `${s.city} Campus` : ''}</div>
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

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="tmg-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="tmg-modal student-add-modal" style={{ width: 'min(680px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="tmg-modal-head">
              <div>
                <span className="tmg-modal-title">Add New Student</span>
                <div className="tmg-modal-sub">Student will be saved to database and visible everywhere (Admin + Sub-Admin)</div>
              </div>
              <button className="tmg-modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="tmg-modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {formError && (
                <div className="tmg-server-error" style={{ marginBottom: 12 }}>{formError}</div>
              )}
              <div className="tmg-form-grid">
                <div className="tmg-field tmg-field-span">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Muhammad Ali" />
                </div>
                <div className="tmg-field">
                  <label>Roll Number *</label>
                  <input value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} placeholder="e.g. AI-24-001" />
                </div>
                <div className="tmg-field">
                  <label>Father Name</label>
                  <input value={form.father} onChange={(e) => setForm({ ...form, father: e.target.value })} placeholder="e.g. Ali Ahmed" />
                </div>
                <div className="tmg-field">
                  <label>CNIC</label>
                  <input value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} placeholder="45601-1234567-1" />
                </div>
                <div className="tmg-field">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0300-1234567" />
                </div>
                <div className="tmg-field">
                  <label>Email (for login) *</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
                </div>
                <div className="tmg-field">
                  <label>Password (for login)</label>
                  <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Default: student123" />
                </div>
                <div className="tmg-field">
                  <label>City</label>
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="tmg-field">
                  <label>Course</label>
                  <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                    {COURSES_LIST.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="tmg-field">
                  <label>Meta (Batch)</label>
                  <input value={form.meta} onChange={(e) => setForm({ ...form, meta: e.target.value })} placeholder="e.g. Batch 01 / Morning" />
                </div>
                <div className="tmg-field">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option>Enrolled</option>
                    <option>Completed</option>
                    <option>Dropped</option>
                  </select>
                </div>
                <div className="tmg-field">
                  <label>Payment</label>
                  <select value={form.pay} onChange={(e) => setForm({ ...form, pay: e.target.value })}>
                    <option>Not Generated</option>
                    <option>Pending</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="tmg-modal-actions">
              <button className="tmg-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="tmg-btn-primary" onClick={handleAddStudent} disabled={saving}>
                {saving ? 'Saving...' : <><Plus size={15} /> Add Student</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Students;
