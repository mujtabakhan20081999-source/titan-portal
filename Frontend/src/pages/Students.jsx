import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, Plus, Download, Eye, Pencil, Filter, FileText, CreditCard, Trash2, BookOpen,
} from 'lucide-react';
import {
  listStudentsPaged,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDetails,
  getStudentVouchers,
  generateStudentVoucher,
  downloadStudentsExport,
  downloadStudentAudit,
} from '../services/studentService';
import CourseEnrollmentManager from '../components/admin/CourseEnrollmentManager';
import { getHierarchy } from '../services/masterService';
import '../styles/admin.css';

const AV_COLORS = ['#2563eb', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0A3D91'];
const CITY_OPTIONS = ['Sukkur', 'Karachi'];
const CAMPUS_OPTIONS = CITY_OPTIONS.map((c) => `${c} Campus`);
const GRID = '88px minmax(140px,1.5fr) minmax(120px,1.1fr) minmax(100px,1fr) minmax(120px,1.2fr) minmax(110px,0.9fr) 95px 110px 176px';
const payBadge = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };
const statusBadge = {
  Pending: 'badge-amber', Approved: 'badge-blue', Rejected: 'badge-grey',
  Enrolled: 'badge-blue', Completed: 'badge-green', Dropped: 'badge-grey',
  Passed: 'badge-green', Failed: 'badge-grey',
};

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}

function toDateInput(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

const emptyStudent = {
  roll: '', name: '', father: '', fatherCnic: '', fatherPhone: '',
  cnic: '', dateOfBirth: '', gender: 'Male', phone: '', email: '',
  address: '', lastQualification: '', computerLevel: '', laptop: 'Yes',
  photoUrl: null, country: 'Pakistan', city: 'Sukkur', campus: 'Sukkur Campus',
  course: '', batch: 'Batch 1', slot: '', meta: '', sponsorship: '',
  year: new Date().getFullYear(), status: 'Pending', pay: 'Pending',
};

function Students() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [hierarchy, setHierarchy] = useState({ countries: [], cities: [], campuses: [], courses: [], batches: [], slots: [] });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '', country: '', city: '', campus: '', course: '', batch: '', slot: '',
    status: '', pay: '', gender: '', laptop: '', year: '', sponsorship: '', from: '', to: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [form, setForm] = useState({ ...emptyStudent });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsStudent, setPaymentsStudent] = useState(null);
  const [enrollmentsOpen, setEnrollmentsOpen] = useState(false);
  const [enrollmentsStudent, setEnrollmentsStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: pageSize };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const result = await listStudentsPaged(params);
      setRows(result.data || []);
      setTotal(result.total || 0);
      setPages(result.pages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load students');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    getHierarchy()
      .then(setHierarchy)
      .catch(() => setHierarchy({ countries: [], cities: [], campuses: [], courses: [], batches: [], slots: [] }));
  }, []);

  const cities = useMemo(() => {
    if (!filters.country && !form.country) return hierarchy.cities;
    const countryName = filters.country || form.country;
    const country = hierarchy.countries.find((c) => c.name === countryName);
    if (!country) return hierarchy.cities;
    return hierarchy.cities.filter((c) => String(c.country?._id || c.country) === String(country._id));
  }, [hierarchy, filters.country, form.country]);

  const campuses = useMemo(() => {
    const cityName = filters.city || form.city;
    if (!cityName) return hierarchy.campuses;
    const city = hierarchy.cities.find((c) => c.name === cityName);
    if (!city) return hierarchy.campuses.filter((c) => c.name.toLowerCase().includes(cityName.toLowerCase()));
    return hierarchy.campuses.filter((c) => String(c.city?._id || c.city) === String(city._id));
  }, [hierarchy, filters.city, form.city]);

  const batches = useMemo(() => {
    const courseName = filters.course || form.course;
    if (!courseName) return hierarchy.batches;
    const course = hierarchy.courses.find((c) => c.name === courseName);
    if (!course) return hierarchy.batches;
    return hierarchy.batches.filter((b) => String(b.course?._id || b.course) === String(course._id));
  }, [hierarchy, filters.course, form.course]);

  const slots = useMemo(() => {
    let list = hierarchy.slots || [];
    const campus = filters.campus || form.campus;
    const course = filters.course || form.course;
    if (campus) list = list.filter((s) => String(s.campus).toLowerCase().includes(campus.toLowerCase()));
    if (course) list = list.filter((s) => String(s.course).toLowerCase().includes(course.toLowerCase()));
    return list;
  }, [hierarchy, filters.campus, filters.course, form.campus, form.course]);

  const openAdd = () => {
    setModalMode('add');
    setForm({
      ...emptyStudent,
      course: hierarchy.courses[0]?.name || '',
      country: hierarchy.countries[0]?.name || 'Pakistan',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setModalMode('edit');
    setForm({
      ...emptyStudent,
      ...student,
      id: student._id,
      dateOfBirth: toDateInput(student.dateOfBirth),
    });
    setFormError('');
    setModalOpen(true);
  };

  const saveStudent = async () => {
    setFormError('');
    if (!form.name.trim() || !form.roll.trim() || !form.dateOfBirth) {
      setFormError('Name, roll and date of birth are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      if (modalMode === 'add') {
        const result = await createStudent(payload);
        setSuccessMsg(result.voucher
          ? `Student registered. Registration voucher: ${result.voucher.voucher}`
          : 'Student registered successfully.');
      } else {
        await updateStudent(form.id, payload);
        setSuccessMsg('Student updated.');
      }
      setModalOpen(false);
      await fetchStudents();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Unable to save student');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const openDetails = async (student) => {
    setError('');
    setActionLoading(`view-${student._id}`);
    try {
      const data = await getStudentDetails(student._id);
      setDetails(data);
      setDetailsOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to open student details');
    } finally {
      setActionLoading('');
    }
  };

  const openEnrollments = (student) => {
    setEnrollmentsStudent(student);
    setEnrollmentsOpen(true);
  };

  const openPayments = async (student) => {
    setError('');
    setActionLoading(`pay-${student._id}`);
    try {
      const data = await getStudentVouchers(student._id);
      setPayments(data || []);
      setPaymentsStudent(student);
      setPaymentsOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load payment vouchers');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete student "${student.name}" (${student.roll})?`)) return;
    setError('');
    setActionLoading(`del-${student._id}`);
    try {
      await deleteStudent(student._id);
      setSuccessMsg(`Deleted ${student.name}`);
      await fetchStudents();
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete student');
    } finally {
      setActionLoading('');
    }
  };

  const handleAudit = async (student) => {
    setError('');
    setActionLoading(`audit-${student._id}`);
    try {
      const blob = await downloadStudentAudit(student._id);
      if (blob?.type && String(blob.type).includes('application/json')) {
        const text = await blob.text();
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || 'Audit download failed');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-${student.roll}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSuccessMsg(`Audit downloaded for ${student.roll}`);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Audit download failed');
    } finally {
      setActionLoading('');
    }
  };

  const generateVoucher = async () => {
    if (!paymentsStudent) return;
    try {
      await generateStudentVoucher(paymentsStudent._id, {});
      const data = await getStudentVouchers(paymentsStudent._id);
      setPayments(data || []);
      setSuccessMsg('Monthly voucher generated (Pending).');
      await fetchStudents();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to generate voucher');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await downloadStudentsExport(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || 'Export failed (need export permission)');
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Students</h2>
          <p>Register, filter, export and manage student records with vouchers.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={() => setFiltersOpen(true)}><Filter size={15} /> Filters</button>
          <button className="btn-ghost" onClick={handleExport}><Download size={15} /> Export CSV</button>
          <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Student</button>
        </div>
      </div>

      {successMsg && <div className="ap-hint ok" style={{ marginBottom: 12 }}>{successMsg}</div>}
      {error && <div className="ap-hint err" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="acard" style={{ padding: 14, marginBottom: 14 }}>
        <label className="admin-search" style={{ width: '100%' }}>
          <Search size={16} color="#5F7A9E" />
          <input
            type="search"
            placeholder="Search name, roll, CNIC, phone…"
            value={filters.search}
            onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, search: e.target.value })); }}
          />
        </label>
      </div>

      <div className="acard students-table-wrap" style={{ padding: 0 }}>
        <div className="atable-head" style={{ gridTemplateColumns: GRID, padding: '12px 16px', minWidth: 980 }}>
          <span>Roll</span><span>Name</span><span>CNIC</span><span>Phone</span>
          <span>Course</span><span>Campus</span><span>Status</span><span>Payment</span><span>Actions</span>
        </div>
        {loading ? (
          <div style={{ padding: 24, color: '#64748b' }}>Loading students…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 24, color: '#64748b' }}>No students found.</div>
        ) : rows.map((s, idx) => (
          <div key={s._id} className="atable-row" style={{ gridTemplateColumns: GRID, padding: '12px 16px', alignItems: 'center', minWidth: 980 }}>
            <span className="atable-cell">{s.roll}</span>
            <span className="atable-cell" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, background: AV_COLORS[idx % AV_COLORS.length],
                color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
              }}>{initials(s.name)}</span>
              {s.name}
            </span>
            <span className="atable-cell">{s.cnic || '—'}</span>
            <span className="atable-cell">{s.phone || '—'}</span>
            <span className="atable-cell">{s.course || '—'}</span>
            <span className="atable-cell">{s.campus || s.city || '—'}</span>
            <span className="atable-cell"><span className={`badge ${statusBadge[s.status] || 'badge-grey'}`}>{s.status}</span></span>
            <span className="atable-cell"><span className={`badge ${payBadge[s.pay] || 'badge-grey'}`}>{s.pay}</span></span>
            <span className="students-actions">
              <button type="button" title="View details" disabled={!!actionLoading} onClick={() => openDetails(s)}>
                <Eye size={15} />
              </button>
              <button type="button" title="Edit student" disabled={!!actionLoading} onClick={() => openEdit(s)}>
                <Pencil size={15} />
              </button>
              <button type="button" title="Manage courses" disabled={!!actionLoading} onClick={() => openEnrollments(s)}>
                <BookOpen size={15} />
              </button>
              <button type="button" title="Payments / vouchers" disabled={!!actionLoading} onClick={() => openPayments(s)}>
                <CreditCard size={15} />
              </button>
              <button type="button" title="Download audit" disabled={!!actionLoading} onClick={() => handleAudit(s)}>
                <FileText size={15} />
              </button>
              <button type="button" title="Delete student" disabled={!!actionLoading} onClick={() => handleDelete(s)}>
                <Trash2 size={15} />
              </button>
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: 13 }}>{total} total · Page {page}/{pages}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <button className="btn-ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>

      {filtersOpen && (
        <div className="tmg-modal-backdrop" onClick={() => setFiltersOpen(false)}>
          <div className="tmg-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="tmg-modal-head">
              <div><div className="tmg-modal-title">Advanced Filters</div></div>
              <button className="tmg-modal-close" onClick={() => setFiltersOpen(false)}>×</button>
            </div>
            <div className="tmg-modal-body">
              <div className="tmg-form-grid">
                {[
                  ['country', 'Country', hierarchy.countries.map((c) => c.name)],
                  ['city', 'City', CITY_OPTIONS],
                  ['campus', 'Campus', CAMPUS_OPTIONS],
                  ['course', 'Course', hierarchy.courses.map((c) => c.name)],
                  ['batch', 'Batch', batches.map((b) => b.name)],
                  ['slot', 'Slot', slots.map((s) => s.slotId)],
                  ['status', 'Status', Object.keys(statusBadge)],
                  ['pay', 'Payment', Object.keys(payBadge)],
                  ['gender', 'Gender', ['Male', 'Female', 'Other']],
                  ['laptop', 'Laptop', ['Yes', 'No']],
                ].map(([key, label, options]) => (
                  <div className="tmg-field" key={key}>
                    <label>{label}</label>
                    <select value={filters[key]} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}>
                      <option value="">All</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="tmg-field"><label>Year</label><input value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))} /></div>
                <div className="tmg-field"><label>Sponsorship</label><input value={filters.sponsorship} onChange={(e) => setFilters((f) => ({ ...f, sponsorship: e.target.value }))} /></div>
                <div className="tmg-field"><label>From</label><input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></div>
                <div className="tmg-field"><label>To</label><input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} /></div>
              </div>
            </div>
            <div className="tmg-modal-actions">
              <button className="tmg-btn-ghost" onClick={() => { setFilters({ search: filters.search, country: '', city: '', campus: '', course: '', batch: '', slot: '', status: '', pay: '', gender: '', laptop: '', year: '', sponsorship: '', from: '', to: '' }); setPage(1); }}>Clear</button>
              <button className="tmg-btn-primary" onClick={() => { setPage(1); setFiltersOpen(false); fetchStudents(); }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="tmg-modal-backdrop">
          <div className="tmg-modal" style={{ maxWidth: 860 }}>
            <div className="tmg-modal-head">
              <div>
                <div className="tmg-modal-title">{modalMode === 'add' ? 'Register Student' : 'Edit Student'}</div>
                <div className="tmg-modal-sub">Country → City → Campus → Course → Batch → Slot</div>
              </div>
              <button className="tmg-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="tmg-modal-body">
              {formError && <div className="tmg-server-error">{formError}</div>}
              <div className="tmg-form-grid">
                {[
                  ['country', 'Country', 'select', hierarchy.countries.map((c) => c.name)],
                  ['city', 'City', 'select', cities.map((c) => c.name)],
                  ['campus', 'Campus', 'select', campuses.map((c) => c.name)],
                  ['course', 'Course', 'select', hierarchy.courses.map((c) => c.name)],
                  ['batch', 'Batch', 'select', [...new Set(batches.map((b) => b.name))]],
                  ['slot', 'Slot', 'select', slots.map((s) => s.slotId)],
                  ['roll', 'Roll Number *', 'text'],
                  ['name', 'Full Name *', 'text'],
                  ['father', 'Father Name', 'text'],
                  ['cnic', 'CNIC', 'text'],
                  ['fatherCnic', "Father's CNIC", 'text'],
                  ['dateOfBirth', 'Date of Birth *', 'date'],
                  ['gender', 'Gender', 'select', ['Male', 'Female', 'Other']],
                  ['phone', 'Phone', 'text'],
                  ['fatherPhone', "Father's Phone", 'text'],
                  ['email', 'Email', 'email'],
                  ['address', 'Address', 'text'],
                  ['lastQualification', 'Last Qualification', 'text'],
                  ['computerLevel', 'Computer Level', 'text'],
                  ['laptop', 'Laptop', 'select', ['Yes', 'No']],
                  ['sponsorship', 'Sponsorship', 'text'],
                  ['year', 'Year', 'number'],
                  ['status', 'Status', 'select', Object.keys(statusBadge)],
                  ['appPassword', 'App Password (optional)', 'text'],
                ].map(([key, label, type, options]) => (
                  <div className={`tmg-field${key === 'address' ? ' tmg-field-span' : ''}`} key={key}>
                    <label>{label}</label>
                    {type === 'select' ? (
                      <select value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}>
                        <option value="">Select</option>
                        {(options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={type}
                        value={form[key] || ''}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={key === 'cnic' ? '45601-1234567-1' : ''}
                      />
                    )}
                  </div>
                ))}
                <div className="tmg-field tmg-field-span">
                  <label>Photo Upload</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setForm((f) => ({ ...f, photoUrl: reader.result }));
                    reader.readAsDataURL(file);
                  }} />
                  {form.photoUrl && <img src={form.photoUrl} alt="preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, marginTop: 8 }} />}
                </div>
              </div>
            </div>
            <div className="tmg-modal-actions">
              <button className="tmg-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="tmg-btn-primary" disabled={saving} onClick={saveStudent}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {detailsOpen && details && (
        <div className="tmg-modal-backdrop">
          <div className="tmg-modal" style={{ maxWidth: 820 }}>
            <div className="tmg-modal-head">
              <div><div className="tmg-modal-title">{details.student.name}</div><div className="tmg-modal-sub">Student details & history</div></div>
              <button className="tmg-modal-close" onClick={() => setDetailsOpen(false)}>×</button>
            </div>
            <div className="tmg-modal-body">
              {[
                ['Personal', details.personal],
                ['Education', details.education],
                ['Contact', details.contact],
              ].map(([title, obj]) => (
                <div key={title} style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px' }}>{title}</h4>
                  <div className="profile-details">
                    {Object.entries(obj || {}).map(([k, v]) => (
                      <div key={k} className="profile-detail" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef2f7' }}>
                        <span style={{ color: '#64748b' }}>{k}</span>
                        <span style={{ fontWeight: 600 }}>{v ? String(v).slice(0, 80) : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <h4>Courses History</h4>
              {(details.courses || []).length === 0 ? <div style={{ color: '#64748b' }}>No enrollments yet.</div> : details.courses.map((c) => (
                <div key={c._id} style={{ padding: '8px 0', borderBottom: '1px solid #eef2f7' }}>
                  {c.course || '—'} · {c.roll} · {c.status} · {c.campus || '—'} · {c.schedule || '—'}
                </div>
              ))}
              <h4 style={{ marginTop: 16 }}>Change History</h4>
              {(details.history || []).length === 0 ? <div style={{ color: '#64748b' }}>No changes recorded.</div> : details.history.slice(0, 12).map((h, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #eef2f7', fontSize: 13 }}>
                  <b>{h.field}</b>: {h.from || '—'} → {h.to || '—'} · {h.changedByName || 'system'} · {h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}
                </div>
              ))}
            </div>
            <div className="tmg-modal-actions">
              <button className="tmg-btn-primary" onClick={() => setDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {enrollmentsOpen && enrollmentsStudent && (
        <CourseEnrollmentManager
          student={enrollmentsStudent}
          hierarchy={hierarchy}
          onClose={() => {
            setEnrollmentsOpen(false);
            setEnrollmentsStudent(null);
            fetchStudents();
          }}
        />
      )}

      {paymentsOpen && (
        <div className="tmg-modal-backdrop">
          <div className="tmg-modal" style={{ maxWidth: 720 }}>
            <div className="tmg-modal-head">
              <div>
                <div className="tmg-modal-title">Payments · {paymentsStudent?.name}</div>
                <div className="tmg-modal-sub">Registration / Monthly vouchers</div>
              </div>
              <button className="tmg-modal-close" onClick={() => setPaymentsOpen(false)}>×</button>
            </div>
            <div className="tmg-modal-body">
              <button className="btn-primary" style={{ marginBottom: 12 }} onClick={generateVoucher}>Generate Monthly Voucher</button>
              {(payments || []).length === 0 ? <div style={{ color: '#64748b' }}>No vouchers yet.</div> : payments.map((p) => (
                <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr', gap: 8, padding: '10px 0', borderBottom: '1px solid #eef2f7', fontSize: 13 }}>
                  <span>{p.voucher}</span>
                  <span>{p.type}</span>
                  <span>{p.month || '—'}</span>
                  <span>Rs {p.amount}</span>
                  <span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-amber'}`}>{p.status === 'PAID' ? 'Paid' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
