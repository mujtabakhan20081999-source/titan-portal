import { useMemo, useState } from 'react';
import {
  Plus, Search, Eye, Pencil, Wallet, RefreshCw, Download, X, MapPin,
} from 'lucide-react';

import { COURSES, BATCHES, STUDENT_STATUSES, can, cityCode } from './subAdminData';
import {
  createStudent,
  updateStudent,
  getStudentVouchers,
  generateStudentVoucher,
  downloadStudentsExport,
} from '../../services/studentService';
import { updatePayment } from '../../services/paymentService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const GRID = '96px 1.6fr 1.2fr 1.1fr 1.4fr 96px 106px 128px';

const STATUS_BADGE = {
  Enrolled: 'badge-blue', Approved: 'badge-green', Passed: 'badge-green', Completed: 'badge-green',
  Pending: 'badge-amber', Rejected: 'badge-grey', Failed: 'badge-grey', Dropout: 'badge-grey', Dropped: 'badge-grey',
};
const PAY_BADGE = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };

const emptyReg = {
  name: '', father: '', email: '', phone: '', cnic: '', gender: 'Male',
  course: COURSES[0], batch: BATCHES[0], slotId: '', laptop: 'Yes', dateOfBirth: '',
};

function SubAdminStudents({ city, perms, students, setStudents, slots, onReload }) {
  const [search, setSearch] = useState('');
  const [courseF, setCourseF] = useState('All Courses');
  const [batchF, setBatchF] = useState('All Batches');
  const [statusF, setStatusF] = useState('All Statuses');
  const [payF, setPayF] = useState('All Payments');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyReg);
  const [formErr, setFormErr] = useState('');
  const [newStatus, setNewStatus] = useState('Enrolled');
  const [vouchers, setVouchers] = useState([]);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (courseF !== 'All Courses' && s.course !== courseF) return false;
      if (batchF !== 'All Batches' && s.batch !== batchF) return false;
      if (statusF !== 'All Statuses' && s.status !== statusF) return false;
      if (payF !== 'All Payments' && s.pay !== payF) return false;
      if (!q) return true;
      return [s.name, s.roll, s.cnic, s.phone].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [students, search, courseF, batchF, statusF, payF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openSlots = slots.filter((sl) => sl.open || sl.status === 'Open');

  const exportCSV = async () => {
    try {
      const blob = await downloadStudentsExport({ city, campus: `${city} Campus` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${city.toLowerCase()}-students.csv`;
      a.click();
      URL.revokeObjectURL(url);
      say('Student list exported (CSV).');
    } catch {
      say('Export failed.');
    }
  };

  const register = async () => {
    if (!form.name.trim() || !form.father.trim() || !form.cnic.trim() || !form.phone.trim() || !form.email.trim() || !form.dateOfBirth) {
      setFormErr('Please fill all required fields including date of birth.'); return;
    }
    if (!/^\d{5}-\d{7}-\d$/.test(form.cnic.trim())) { setFormErr('CNIC must look like 45501-1234567-1.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) { setFormErr('Email does not look correct.'); return; }

    const selectedSlot = openSlots.find((s) => (s.slotId || s.id) === form.slotId);
    if (form.slotId && !selectedSlot) {
      setFormErr('Selected slot is closed or unavailable.'); return;
    }

    setBusy(true);
    setFormErr('');
    try {
      const roll = `${cityCode(city)}-${String(new Date().getFullYear()).slice(-2)}-${String(students.length + 1).padStart(3, '0')}`;
      const payload = {
        name: form.name.trim(),
        father: form.father.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        cnic: form.cnic.trim(),
        gender: form.gender,
        laptop: form.laptop,
        dateOfBirth: form.dateOfBirth,
        roll,
        city,
        campus: `${city} Campus`,
        course: form.course,
        batch: form.batch,
        meta: form.batch,
        slot: selectedSlot?.slotId || form.slotId || '',
        slotRef: selectedSlot?._id || undefined,
        status: 'Pending',
      };
      const res = await createStudent(payload);
      const created = res.data || res;
      setStudents((p) => [{
        ...created,
        id: created._id,
        batch: created.batch || form.batch,
        campus: created.campus || `${city} Campus`,
        av: '#0A3D91',
        joined: 'Today',
      }, ...p]);
      setModal(null);
      say(`Student registered as "Pending"${res.voucher ? ' — registration voucher created.' : '.'}`);
      if (onReload) onReload();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Unable to register student.');
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!form.name.trim() || !form.father.trim()) { setFormErr('Name and father name are required.'); return; }
    const id = modal.student._id || modal.student.id;
    setBusy(true);
    try {
      const updated = await updateStudent(id, {
        name: form.name,
        father: form.father,
        email: form.email,
        phone: form.phone,
        course: form.course,
        batch: form.batch,
        meta: form.batch,
        gender: form.gender,
        laptop: form.laptop,
      });
      setStudents((p) => p.map((s) => ((s._id || s.id) === id ? { ...s, ...updated, batch: updated.batch || form.batch } : s)));
      setModal(null);
      say('Student updated.');
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Update failed.');
    } finally {
      setBusy(false);
    }
  };

  const applyStatus = async () => {
    const id = modal.student._id || modal.student.id;
    setBusy(true);
    try {
      const updated = await updateStudent(id, { status: newStatus, historyNote: 'Status changed by subadmin' });
      setStudents((p) => p.map((s) => ((s._id || s.id) === id ? { ...s, ...updated } : s)));
      setModal(null);
      say(`Status changed to ${newStatus}.`);
    } catch (err) {
      say(err?.response?.data?.message || 'Status update failed.');
    } finally {
      setBusy(false);
    }
  };

  const openPayments = async (s) => {
    setModal({ mode: 'payments', student: s });
    try {
      const rows = await getStudentVouchers(s._id || s.id);
      setVouchers(rows || []);
    } catch {
      setVouchers([]);
    }
  };

  const generateVoucher = async (s) => {
    try {
      const payment = await generateStudentVoucher(s._id || s.id, {});
      setVouchers((v) => [payment, ...v]);
      setStudents((p) => p.map((r) => ((r._id || r.id) === (s._id || s.id) ? { ...r, pay: 'Pending' } : r)));
      say('Monthly voucher generated (Pending).');
    } catch (err) {
      say(err?.response?.data?.message || 'Voucher generation failed.');
    }
  };

  const markPaid = async (payment) => {
    try {
      const updated = await updatePayment(payment._id || payment.id, { status: 'PAID' });
      setVouchers((v) => v.map((x) => ((x._id || x.id) === (updated._id || updated.id) ? updated : x)));
      say('Voucher marked as Paid.');
      if (onReload) onReload();
    } catch (err) {
      say(err?.response?.data?.message || 'Unable to mark paid.');
    }
  };

  const canWrite = can(perms, 'Students', 'write');
  const canUpdate = can(perms, 'Students', 'update');
  const canExport = can(perms, 'Students', 'export');

  return (
    <div className="ap-page">
      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title" style={{ fontSize: 16 }}>Students — {city} Campus</span>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>Only your campus students are listed here</div>
          </div>
          <div className="acard-tools">
            {canWrite && <button className="btn-primary" onClick={() => { setForm(emptyReg); setFormErr(''); setModal({ mode: 'register' }); }}><Plus size={15} /> Register Student</button>}
            {canExport && <button className="btn-ghost" onClick={exportCSV}><Download size={15} /> Export</button>}
          </div>
        </div>

        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label className="admin-search" style={{ minWidth: 220, flex: '1 1 220px' }}>
            <Search size={16} color="#5F7A9E" />
            <input type="search" placeholder="Search name, roll, CNIC…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </label>
          <select className="afilter-select" value={courseF} onChange={(e) => setCourseF(e.target.value)}><option>All Courses</option>{COURSES.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="afilter-select" value={batchF} onChange={(e) => setBatchF(e.target.value)}><option>All Batches</option>{BATCHES.map((b) => <option key={b}>{b}</option>)}</select>
          <select className="afilter-select" value={statusF} onChange={(e) => setStatusF(e.target.value)}><option>All Statuses</option>{STUDENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <select className="afilter-select" value={payF} onChange={(e) => setPayF(e.target.value)}><option>All Payments</option><option>Paid</option><option>Pending</option><option>Not Generated</option></select>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 980 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Roll</span><span>Name</span><span>Phone</span><span>Course</span><span>Batch</span><span>Status</span><span>Payment</span><span>Actions</span>
            </div>
            {paginated.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No students found</div>
            ) : paginated.map((s) => (
              <div className="atable-row" key={s.roll} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{s.roll}</span>
                <div className="atable-name">
                  <div className="atable-av" style={{ background: s.av || '#0A3D91' }}>{(s.name || '?').split(' ').slice(0, 2).map((w) => w[0]).join('')}</div>
                  <div>
                    <div className="atable-cell-strong">{s.name}</div>
                    <div className="atable-cell-sub">{s.father}</div>
                  </div>
                </div>
                <span className="atable-cell">{s.phone}</span>
                <span className="atable-cell">{s.course}</span>
                <span className="atable-cell">{s.batch || s.meta}</span>
                <span className={`badge ${STATUS_BADGE[s.status] || 'badge-grey'}`}>{s.status}</span>
                <span className={`badge ${PAY_BADGE[s.pay] || 'badge-grey'}`}>{s.pay}</span>
                <div className="atable-actions">
                  <button title="View" onClick={() => setModal({ mode: 'view', student: s })}><Eye size={16} /></button>
                  {canUpdate && <button title="Edit" onClick={() => { setForm({ ...emptyReg, ...s, batch: s.batch || s.meta || BATCHES[0] }); setFormErr(''); setModal({ mode: 'edit', student: s }); }}><Pencil size={15} /></button>}
                  <button title="Payments" onClick={() => openPayments(s)}><Wallet size={15} /></button>
                  {canUpdate && <button title="Status" onClick={() => { setNewStatus(s.status || 'Enrolled'); setModal({ mode: 'status', student: s }); }}><RefreshCw size={15} /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px' }}>
          <span style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>{filtered.length} students</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <button className="btn-ghost" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">
                {modal.mode === 'register' ? 'Register Student' : modal.mode === 'edit' ? 'Edit Student' : modal.mode === 'payments' ? 'Fee Vouchers' : modal.mode === 'status' ? 'Update Status' : 'Student Details'}
              </span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>

            {modal.mode === 'view' && (
              <div className="ap-modal-body">
                {[['Roll', modal.student.roll], ['Name', modal.student.name], ['Father', modal.student.father], ['CNIC', modal.student.cnic], ['Phone', modal.student.phone], ['Email', modal.student.email], ['Course', modal.student.course], ['Batch', modal.student.batch || modal.student.meta], ['Slot', modal.student.slot], ['Status', modal.student.status], ['Payment', modal.student.pay]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #f0f4fa', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: '#7286a3', fontWeight: 700 }}>{k}</span>
                    <span style={{ fontSize: 13, color: '#10375C', fontWeight: 700 }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {(modal.mode === 'register' || modal.mode === 'edit') && (
              <>
                <div className="ap-modal-body" style={{ maxHeight: '62vh', overflowY: 'auto' }}>
                  {formErr && <div className="ap-hint err">{formErr}</div>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="ap-field"><label>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="ap-field"><label>Father *</label><input value={form.father} onChange={(e) => setForm({ ...form, father: e.target.value })} /></div>
                    <div className="ap-field"><label>Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                    <div className="ap-field"><label>Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="ap-field"><label>CNIC *</label><input value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} placeholder="45501-1234567-1" /></div>
                    {modal.mode === 'register' && (
                      <div className="ap-field"><label>Date of Birth *</label><input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
                    )}
                    <div className="ap-field"><label>Course</label><select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select></div>
                    <div className="ap-field"><label>Batch</label><select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}>{BATCHES.map((b) => <option key={b}>{b}</option>)}</select></div>
                    {modal.mode === 'register' && (
                      <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                        <label>Open Slot (closed slots hidden)</label>
                        <select value={form.slotId} onChange={(e) => setForm({ ...form, slotId: e.target.value })}>
                          <option value="">No slot / assign later</option>
                          {openSlots.map((s) => (
                            <option key={s.slotId || s.id} value={s.slotId || s.id}>
                              {(s.slotId || s.id)} — {s.course} ({s.filled}/{s.seats})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0A3D91', fontWeight: 700, fontSize: 12.5 }}>
                    <MapPin size={14} /> {city} Campus
                  </div>
                </div>
                <div className="ap-modal-actions">
                  <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn-primary" disabled={busy} onClick={modal.mode === 'register' ? register : saveEdit}>
                    {busy ? 'Saving…' : modal.mode === 'register' ? 'Register' : 'Save'}
                  </button>
                </div>
              </>
            )}

            {modal.mode === 'status' && (
              <>
                <div className="ap-modal-body">
                  <div className="ap-field">
                    <label>New Status for {modal.student.roll}</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      {STUDENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ap-modal-actions">
                  <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn-primary" disabled={busy} onClick={applyStatus}>{busy ? 'Saving…' : 'Update Status'}</button>
                </div>
              </>
            )}

            {modal.mode === 'payments' && (
              <>
                <div className="ap-modal-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontWeight: 800 }}>{modal.student.roll} vouchers</span>
                    <button className="btn-primary" onClick={() => generateVoucher(modal.student)}><Plus size={14} /> Generate</button>
                  </div>
                  {vouchers.length === 0 ? (
                    <div style={{ color: '#7286a3', fontWeight: 700 }}>No vouchers yet.</div>
                  ) : vouchers.map((v) => (
                    <div key={v._id || v.voucher} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f4fa' }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{v.voucher || v.inv}</div>
                        <div style={{ fontSize: 12, color: '#7286a3' }}>{v.type} · {v.month || '—'} · Rs {v.amount}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className={`badge ${v.status === 'PAID' || v.status === 'Paid' ? 'badge-green' : 'badge-amber'}`}>{v.status}</span>
                        {v.status !== 'PAID' && v.status !== 'Paid' && (
                          <button className="btn-ghost" onClick={() => markPaid(v)}>Mark Paid</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ap-modal-actions">
                  <button className="btn-ghost" onClick={() => setModal(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="ap-toast">{toast}</div>}
    </div>
  );
}

export default SubAdminStudents;
