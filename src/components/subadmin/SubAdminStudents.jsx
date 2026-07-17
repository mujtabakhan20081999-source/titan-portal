import { useMemo, useState } from 'react';
import {
  Plus, Search, Eye, Pencil, Wallet, RefreshCw, Download, X, UserCheck, MapPin,
} from 'lucide-react';

import { COURSES, BATCHES, STUDENT_STATUSES, can, cityCode } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const GRID = '96px 1.6fr 1.2fr 1.1fr 1.4fr 96px 106px 128px';

const STATUS_BADGE = {
  Enrolled: 'badge-blue', Approved: 'badge-green', Passed: 'badge-green', Completed: 'badge-green',
  Pending: 'badge-amber', Rejected: 'badge-grey', Failed: 'badge-grey', Dropout: 'badge-grey',
};
const PAY_BADGE = { Paid: 'badge-green', Pending: 'badge-amber', 'Not Generated': 'badge-grey' };

const emptyReg = { name: '', father: '', email: '', phone: '', cnic: '', gender: 'Male', course: COURSES[0], batch: BATCHES[0], slotId: '', laptop: 'Yes' };

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function studentRecord(s) {
  return [
    'TITAN SMS — STUDENT RECORD', '='.repeat(34),
    `Roll No:   ${s.roll}`, `Name:      ${s.name}`, `Father:    ${s.father}`,
    `CNIC:      ${s.cnic}`, `Phone:     ${s.phone}`, `Email:     ${s.email}`,
    `Gender:    ${s.gender}`, `Laptop:    ${s.laptop}`,
    `Campus:    ${s.campus}`, `Course:    ${s.course} (${s.batch})`,
    `Status:    ${s.status}`, `Payment:   ${s.pay}`, `Joined:    ${s.joined}`,
  ].join('\n');
}

function SubAdminStudents({ city, perms, students, setStudents, slots }) {
  const [search, setSearch] = useState('');
  const [courseF, setCourseF] = useState('All Courses');
  const [batchF, setBatchF] = useState('All Batches');
  const [statusF, setStatusF] = useState('All Statuses');
  const [payF, setPayF] = useState('All Payments');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [modal, setModal] = useState(null); // { mode: 'view'|'edit'|'register'|'payments'|'status', student }
  const [form, setForm] = useState(emptyReg);
  const [formErr, setFormErr] = useState('');
  const [newStatus, setNewStatus] = useState('Enrolled');
  const [vouchers, setVouchers] = useState({}); // roll -> voucher list
  const [toast, setToast] = useState('');

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (courseF !== 'All Courses' && s.course !== courseF) return false;
      if (batchF !== 'All Batches' && s.batch !== batchF) return false;
      if (statusF !== 'All Statuses' && s.status !== statusF) return false;
      if (payF !== 'All Payments' && s.pay !== payF) return false;
      if (!q) return true;
      return [s.name, s.roll, s.cnic, s.phone].some((v) => v.toLowerCase().includes(q));
    });
  }, [students, search, courseF, batchF, statusF, payF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openSlots = slots.filter((sl) => sl.open);

  const exportCSV = () => {
    const head = 'Roll,Name,Father,CNIC,Phone,Course,Batch,Status,Payment';
    const rows = filtered.map((s) => [s.roll, s.name, s.father, s.cnic, s.phone, s.course, s.batch, s.status, s.pay].join(','));
    downloadText(`${city.toLowerCase()}-students.csv`, [head, ...rows].join('\n'));
    say('Student list exported (CSV).');
  };

  const register = () => {
    if (!form.name.trim() || !form.father.trim() || !form.cnic.trim() || !form.phone.trim() || !form.email.trim()) {
      setFormErr('Please fill all required fields.'); return;
    }
    if (!/^\d{5}-\d{7}-\d$/.test(form.cnic.trim())) { setFormErr('CNIC must look like 45501-1234567-1.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) { setFormErr('Email does not look correct.'); return; }
    const dup = students.find((s) => s.cnic === form.cnic.trim() || s.email === form.email.trim() || s.phone === form.phone.trim());
    if (dup) { setFormErr(`Already used by ${dup.roll} (${dup.name}).`); return; }

    const roll = `${cityCode(city)}-24-${String(students.length + 1).padStart(3, '0')}`;
    const created = {
      ...form, roll, campus: `${city} Campus`,
      status: 'Pending', pay: 'Pending', av: '#0A3D91', joined: 'Today',
    };
    setStudents((p) => [created, ...p]);
    setVouchers((v) => ({
      ...v,
      [roll]: [{ inv: `INV-${roll}-R`, payId: '—', type: 'Registration', month: 'Jul 2026', due: '25 Jul 2026', amount: 1000, status: 'Pending' }],
    }));
    setModal(null);
    say(`Student registered as "Pending" — registration voucher created.`);
  };

  const saveEdit = () => {
    if (!form.name.trim() || !form.father.trim()) { setFormErr('Name and father name are required.'); return; }
    setStudents((p) => p.map((s) => (s.roll === modal.student.roll ? { ...s, ...form } : s)));
    setModal(null);
    say('Student updated.');
  };

  const applyStatus = () => {
    setStudents((p) => p.map((s) => (s.roll === modal.student.roll ? { ...s, status: newStatus } : s)));
    setModal(null);
    say(`Status changed to ${newStatus}.`);
  };

  const getVouchers = (s) => vouchers[s.roll] || [
    { inv: `INV-${s.roll}-R`, payId: 'PAY-8841', type: 'Registration', month: 'Mar 2026', due: '25 Mar 2026', amount: 1000, status: 'Paid' },
    { inv: `INV-${s.roll}-1`, payId: s.pay === 'Paid' ? 'PAY-9127' : '—', type: 'Monthly', month: 'Jun 2026', due: '10 Jun 2026', amount: 2500, status: s.pay === 'Paid' ? 'Paid' : s.pay },
  ];

  const generateVoucher = (s) => {
    const list = getVouchers(s);
    const next = { inv: `INV-${s.roll}-${list.length}`, payId: '—', type: 'Monthly', month: 'Jul 2026', due: '10 Aug 2026', amount: 2500, status: 'Pending' };
    setVouchers((v) => ({ ...v, [s.roll]: [...list, next] }));
    setStudents((p) => p.map((r) => (r.roll === s.roll && r.pay === 'Not Generated' ? { ...r, pay: 'Pending' } : r)));
    say('Monthly voucher generated (Pending).');
  };

  const markPaid = (s, inv) => {
    setVouchers((v) => ({ ...v, [s.roll]: getVouchers(s).map((x) => (x.inv === inv ? { ...x, status: 'Paid', payId: `PAY-${Math.floor(1000 + Math.random() * 9000)}` } : x)) }));
    say('Voucher marked as Paid.');
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
            {canExport && <button className="btn-ghost" onClick={exportCSV}><Download size={15} /> Export CSV</button>}
          </div>
        </div>

        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label className="admin-search" style={{ minWidth: 230, flex: '1 1 230px' }}>
            <Search size={16} color="#5F7A9E" />
            <input type="search" placeholder="Search name, roll no, CNIC, phone…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </label>
          {[[courseF, setCourseF, ['All Courses', ...COURSES]], [batchF, setBatchF, ['All Batches', ...BATCHES]], [statusF, setStatusF, ['All Statuses', ...STUDENT_STATUSES]], [payF, setPayF, ['All Payments', 'Paid', 'Pending', 'Not Generated']]].map(([val, set, opts], i) => (
            <select key={i} className="afilter-select" style={{ width: 'auto', minWidth: 130 }} value={val} onChange={(e) => { set(e.target.value); setPage(1); }}>
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 960 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Roll No</span><span>Name</span><span>CNIC</span><span>Phone</span><span>Course / Batch</span><span>Status</span><span>Payment</span><span>Action</span>
            </div>
            {paginated.length === 0 ? (
              <div style={{ padding: 34, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Students Found</div>
            ) : paginated.map((s) => (
              <div className="atable-row" key={s.roll} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{s.roll}</span>
                <div className="atable-name">
                  <div className="atable-av" style={{ background: s.av }}>{s.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}</div>
                  <div>
                    <div className="atable-cell-strong">{s.name}</div>
                    <div className="atable-cell-sub">{s.father}</div>
                  </div>
                </div>
                <span className="atable-cell">{s.cnic}</span>
                <span className="atable-cell">{s.phone}</span>
                <div>
                  <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.course}</div>
                  <div className="atable-cell-sub">{s.batch}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[s.status] || 'badge-grey'}`}>{s.status}</span>
                <span className={`badge ${PAY_BADGE[s.pay] || 'badge-grey'}`}>{s.pay}</span>
                <div className="atable-actions">
                  <button title="View" onClick={() => setModal({ mode: 'view', student: s })}><Eye size={16} /></button>
                  {canUpdate && <button title="Edit" onClick={() => { setForm({ ...s }); setFormErr(''); setModal({ mode: 'edit', student: s }); }}><Pencil size={15} /></button>}
                  <button title="Payments" onClick={() => setModal({ mode: 'payments', student: s })}><Wallet size={15} /></button>
                  {canUpdate && <button title="Change Status" onClick={() => { setNewStatus(s.status); setModal({ mode: 'status', student: s }); }}><RefreshCw size={15} /></button>}
                  <button title="Download Record" onClick={() => { downloadText(`${s.roll}-record.txt`, studentRecord(s)); say('Record downloaded.'); }}><Download size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 18px', borderTop: '1px solid #f0f4fa' }}>
          <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>
            Showing <b>{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</b>–<b>{Math.min(filtered.length, safePage * pageSize)}</b> of <b>{filtered.length}</b> students
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* View */}
      {modal?.mode === 'view' && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">{modal.student.name} — {modal.student.roll}</span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body" style={{ maxHeight: '62vh', overflowY: 'auto' }}>
              {[['Personal', [['Full Name', modal.student.name], ['Father Name', modal.student.father], ['CNIC', modal.student.cnic], ['Gender', modal.student.gender], ['Laptop', modal.student.laptop]]],
                ['Contact', [['Phone', modal.student.phone], ['Email', modal.student.email], ['Campus', modal.student.campus]]],
                ['Courses', [['Course', `${modal.student.course} (${modal.student.batch})`], ['Status', modal.student.status], ['Joined', modal.student.joined], ['Payment', modal.student.pay]]],
              ].map(([sec, rows]) => (
                <div key={sec}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#9aa7bd', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{sec}</div>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #f0f4fa', padding: '7px 0' }}>
                      <span style={{ fontSize: 12.5, color: '#7286a3', fontWeight: 700 }}>{k}</span>
                      <span style={{ fontSize: 13, color: '#10375C', fontWeight: 700, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ fontSize: 11.5, color: '#7286a3', fontWeight: 600 }}>
                History: registered on {modal.student.joined} · last change by Sub Admin ({city} Campus)
              </div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => { downloadText(`${modal.student.roll}-record.txt`, studentRecord(modal.student)); say('Audit record downloaded.'); }}><Download size={14} /> Audit Record</button>
              <button className="btn-primary" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Register / Edit */}
      {(modal?.mode === 'register' || modal?.mode === 'edit') && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">{modal.mode === 'register' ? 'Register New Student' : `Edit ${modal.student.roll}`}</span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body" style={{ maxHeight: '62vh', overflowY: 'auto' }}>
              {formErr && <div className="ap-hint err">{formErr}</div>}
              {modal.mode === 'register' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 9, background: '#f0f5ff', border: '1px solid #cdd8ea', color: '#0A3D91', fontSize: 12.5, fontWeight: 700, width: 'fit-content' }}>
                  <MapPin size={14} /> Pakistan → {city} → {city} Campus
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="ap-field"><label>Full Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="ap-field"><label>Father Name *</label><input value={form.father} onChange={(e) => setForm({ ...form, father: e.target.value })} /></div>
                <div className="ap-field"><label>CNIC *</label><input placeholder="45501-1234567-1" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} disabled={modal.mode === 'edit'} /></div>
                <div className="ap-field"><label>Phone *</label><input placeholder="0301-1234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="ap-field"><label>Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="ap-field"><label>Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option></select></div>
                <div className="ap-field"><label>Course</label><select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div className="ap-field"><label>Batch</label><select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}>{BATCHES.map((b) => <option key={b}>{b}</option>)}</select></div>
                {modal.mode === 'register' && (
                  <div className="ap-field">
                    <label>Slot (open only)</label>
                    <select value={form.slotId} onChange={(e) => setForm({ ...form, slotId: e.target.value })}>
                      <option value="">Select a slot…</option>
                      {openSlots.map((sl) => <option key={sl.id} value={sl.id}>{sl.id} · {sl.course} · {sl.time}</option>)}
                    </select>
                  </div>
                )}
                <div className="ap-field"><label>Do you have a laptop?</label><select value={form.laptop} onChange={(e) => setForm({ ...form, laptop: e.target.value })}><option>Yes</option><option>No</option></select></div>
              </div>
              {modal.mode === 'register' && <div className="ap-hint">Student will start as <b>Pending</b> and get a registration fee voucher.</div>}
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={modal.mode === 'register' ? register : saveEdit}>
                <UserCheck size={15} /> {modal.mode === 'register' ? 'Register Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments */}
      {modal?.mode === 'payments' && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" style={{ width: 'min(640px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">Payments — {modal.student.roll}</span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body" style={{ maxHeight: '58vh', overflowY: 'auto' }}>
              {getVouchers(modal.student).map((v) => (
                <div key={v.inv} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: '1px solid #eef2f9', background: '#fbfcff', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{v.inv} · {v.type}</div>
                    <div className="atable-cell-sub">{v.month} · due {v.due} · Payment ID: {v.payId}</div>
                  </div>
                  <span className="atable-cell-strong">Rs {v.amount.toLocaleString()}</span>
                  <span className={`badge ${PAY_BADGE[v.status] || 'badge-grey'}`}>{v.status}</span>
                  {v.status === 'Pending' && canUpdate && (
                    <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 11.5 }} onClick={() => markPaid(modal.student, v.inv)}>Mark Paid</button>
                  )}
                </div>
              ))}
              <div className="ap-hint">Students pay outside the system (e.g. JazzCash) — only the voucher and its status are recorded here.</div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setModal(null)}>Close</button>
              {canWrite && <button className="btn-primary" onClick={() => generateVoucher(modal.student)}><Plus size={14} /> Generate Monthly Voucher</button>}
            </div>
          </div>
        </div>
      )}

      {/* Change status */}
      {modal?.mode === 'status' && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" style={{ width: 'min(420px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">Change Status — {modal.student.roll}</span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-field">
                <label>New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STUDENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="ap-hint">Current status: <b>{modal.student.status}</b>. This change is saved to the student's history.</div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={applyStatus}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><UserCheck size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminStudents;
