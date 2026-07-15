import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, X, CalendarClock } from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const COURSES = ['Artificial Intelligence', 'Web Development', 'Python Programming', 'Data Science', 'Cyber Security', 'UI/UX Design', 'Graphic Design'];
const TRAINERS = ['Ali Raza', 'Sana Khan', 'Usman Ali', 'Fatima Noor', 'Bilal Ahmed'];
const CAMPUSES = ['Sukkur Campus', 'Karachi Campus', 'Lahore Campus', 'Islamabad Campus', 'Multan Campus'];

const SEED = [
  { id: 'SLOT-001', course: 'Artificial Intelligence', trainer: 'Ali Raza', campus: 'Sukkur Campus', days: 'Mon, Wed, Fri', time: '09:00 AM - 11:00 AM', filled: 18, seats: 25, status: 'Open' },
  { id: 'SLOT-002', course: 'Web Development', trainer: 'Sana Khan', campus: 'Karachi Campus', days: 'Tue, Thu, Sat', time: '02:00 PM - 04:00 PM', filled: 32, seats: 32, status: 'Closed' },
  { id: 'SLOT-003', course: 'Python Programming', trainer: 'Usman Ali', campus: 'Lahore Campus', days: 'Mon, Wed, Fri', time: '06:00 PM - 08:00 PM', filled: 24, seats: 40, status: 'Open' },
  { id: 'SLOT-004', course: 'Data Science', trainer: 'Fatima Noor', campus: 'Islamabad Campus', days: 'Tue, Thu', time: '11:00 AM - 01:00 PM', filled: 22, seats: 30, status: 'Open' },
  { id: 'SLOT-005', course: 'Graphic Design', trainer: 'Bilal Ahmed', campus: 'Multan Campus', days: 'Mon, Wed', time: '03:00 PM - 05:00 PM', filled: 40, seats: 40, status: 'Closed' },
  { id: 'SLOT-006', course: 'Cyber Security', trainer: 'Ali Raza', campus: 'Karachi Campus', days: 'Wed, Fri', time: '10:00 AM - 12:00 PM', filled: 12, seats: 28, status: 'Open' },
];

const GRID = '104px 1.5fr 1.1fr 1.2fr 1.4fr 96px 92px 92px';

const emptyForm = { course: COURSES[0], trainer: TRAINERS[0], campus: CAMPUSES[0], days: 'Mon, Wed, Fri', time: '09:00 AM - 11:00 AM', seats: 30 };

export default function AdminSlots() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [modal, setModal] = useState(null); // { mode, data }
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setRows(SEED); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { setPage(1); }, [search, courseFilter, statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (courseFilter !== 'All Courses' && r.course !== courseFilter) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.id.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || r.trainer.toLowerCase().includes(q) || r.campus.toLowerCase().includes(q);
    });
  }, [rows, search, courseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openAdd = () => { setForm(emptyForm); setModal({ mode: 'add' }); };
  const openEdit = (r) => { setForm({ ...r }); setModal({ mode: 'edit', id: r.id }); };

  const save = () => {
    if (!form.time.trim() || !form.days.trim() || Number(form.seats) <= 0) { setToast('Please fill all fields correctly.'); return; }
    if (modal.mode === 'add') {
      const nextNum = String(rows.length + 1).padStart(3, '0');
      const created = { ...form, id: `SLOT-${nextNum}`, filled: 0, seats: Number(form.seats), status: 'Open' };
      setRows((p) => [created, ...p]);
      setToast('Slot created successfully.');
    } else {
      setRows((p) => p.map((r) => (r.id === modal.id ? { ...r, ...form, seats: Number(form.seats), status: Number(r.filled) >= Number(form.seats) ? 'Closed' : 'Open' } : r)));
      setToast('Slot updated.');
    }
    setModal(null);
  };

  const doDelete = (id) => { setRows((p) => p.filter((r) => r.id !== id)); setConfirmDelete(null); setToast('Slot deleted.'); };

  return (
    <div className="ap-page">
      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title" style={{ fontSize: 16 }}>Slots</span>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>Manage class slots and schedules</div>
          </div>
          <div className="acard-tools">
            <button className="btn-primary" onClick={openAdd}><Plus size={15} /> Add Slot</button>
          </div>
        </div>

        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label className="admin-search" style={{ minWidth: 220, flex: '1 1 220px' }}>
            <Search size={16} color="#5F7A9E" />
            <input type="search" placeholder="Search slot, course, trainer, campus…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <select className="afilter-select" style={{ width: 'auto', minWidth: 170 }} value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option>All Courses</option>
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="afilter-select" style={{ width: 'auto', minWidth: 120 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option><option>Open</option><option>Closed</option>
          </select>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 900 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Slot ID</span><span>Course</span><span>Trainer</span><span>Campus</span><span>Days &amp; Time</span><span>Seats</span><span>Status</span><span>Action</span>
            </div>

            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 700 }}>Loading slots…</div>
            ) : paginated.length === 0 ? (
              <div style={{ padding: 34, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Slots Found</div>
            ) : paginated.map((r) => (
              <div className="atable-row" key={r.id} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{r.id}</span>
                <span className="atable-cell-strong" style={{ fontSize: 12.5 }}>{r.course}</span>
                <span className="atable-cell">{r.trainer}</span>
                <span className="atable-cell">{r.campus}</span>
                <div>
                  <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{r.days}</div>
                  <div className="atable-cell-sub">{r.time}</div>
                </div>
                <span className="atable-cell-strong" style={{ color: r.filled >= r.seats ? '#dc2626' : '#16a34a' }}>{r.filled}/{r.seats}</span>
                <span className={`badge ${r.status === 'Open' ? 'badge-green' : 'badge-grey'}`}>{r.status}</span>
                <div className="atable-actions">
                  <button title="View" onClick={() => setModal({ mode: 'view', data: r })}><Eye size={16} /></button>
                  <button title="Edit" onClick={() => openEdit(r)}><Pencil size={15} /></button>
                  <button title="Delete" onClick={() => setConfirmDelete(r)}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 18px', borderTop: '1px solid #f0f4fa' }}>
          <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>
            Showing <b>{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</b>–<b>{Math.min(filtered.length, safePage * pageSize)}</b> of <b>{filtered.length}</b> slots
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button key={p} className="btn-ghost" style={{ padding: '8px 12px', background: p === safePage ? '#0A3D91' : '#fff', color: p === safePage ? '#fff' : '#0A3D91', borderColor: p === safePage ? '#0A3D91' : '#cdd8ea' }} onClick={() => setPage(p)}>{p}</button>
              );
            })}
            <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>

      {/* Add / Edit / View modal */}
      {modal && (
        <div className="ap-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">
                {modal.mode === 'add' ? 'Add New Slot' : modal.mode === 'edit' ? 'Edit Slot' : `Slot ${modal.data.id}`}
              </span>
              <button className="ap-modal-close" onClick={() => setModal(null)}><X size={20} /></button>
            </div>

            {modal.mode === 'view' ? (
              <div className="ap-modal-body">
                {[
                  ['Course', modal.data.course], ['Trainer', modal.data.trainer], ['Campus', modal.data.campus],
                  ['Days', modal.data.days], ['Time', modal.data.time], ['Seats', `${modal.data.filled}/${modal.data.seats}`], ['Status', modal.data.status],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #f0f4fa', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: '#7286a3', fontWeight: 700 }}>{k}</span>
                    <span style={{ fontSize: 13, color: '#10375C', fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="ap-modal-body">
                  <div className="ap-field">
                    <label>Course</label>
                    <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="ap-field">
                      <label>Trainer</label>
                      <select value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })}>{TRAINERS.map((t) => <option key={t}>{t}</option>)}</select>
                    </div>
                    <div className="ap-field">
                      <label>Campus</label>
                      <select value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })}>{CAMPUSES.map((c) => <option key={c}>{c}</option>)}</select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="ap-field">
                      <label>Days</label>
                      <input value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} placeholder="Mon, Wed, Fri" />
                    </div>
                    <div className="ap-field">
                      <label>Seats</label>
                      <input type="number" min="1" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
                    </div>
                  </div>
                  <div className="ap-field">
                    <label>Time</label>
                    <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="09:00 AM - 11:00 AM" />
                  </div>
                </div>
                <div className="ap-modal-actions">
                  <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn-primary" onClick={save}>{modal.mode === 'add' ? 'Create Slot' : 'Save Changes'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="ap-modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="ap-modal" style={{ width: 'min(440px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">Delete Slot</span>
              <button className="ap-modal-close" onClick={() => setConfirmDelete(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trash2 size={22} color="#dc2626" />
                </div>
                <div style={{ fontSize: 13.5, color: '#10375C', fontWeight: 600, lineHeight: 1.5 }}>
                  Are you sure you want to delete <b>{confirmDelete.id}</b> ({confirmDelete.course})? This cannot be undone.
                </div>
              </div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }} onClick={() => doDelete(confirmDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CalendarClock size={16} /> {toast}</div>}
    </div>
  );
}
