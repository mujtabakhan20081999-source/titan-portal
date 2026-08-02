import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, X, CalendarClock, MapPin } from 'lucide-react';

import { listSlots, createSlot, updateSlot, deleteSlot } from '../../services/slotService';
import { listTrainers, createTrainer } from '../../services/trainerService';
import TrainerModal from './TrainerModal';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const COURSES = ['Artificial Intelligence', 'Web Development', 'Python Programming', 'Data Science', 'Cyber Security', 'UI/UX Design', 'Graphic Design'];
const CAMPUSES = ['Sukkur Campus', 'Karachi Campus', 'Lahore Campus', 'Islamabad Campus', 'Multan Campus'];
const CITIES = CAMPUSES.map((c) => c.replace(' Campus', ''));
const ADD_TRAINER_OPTION = '__add_new_trainer__';

const GRID = '104px 1.5fr 1.1fr 1.2fr 1.4fr 96px 92px 92px';

const tmgStyles = `
  .tmg-modal-backdrop{position:fixed; inset:0; background: rgba(17, 12, 58, .55); display:flex; align-items:center; justify-content:center; padding: 18px; z-index: 2000;}
  .tmg-modal{width: min(760px, 100%); max-height: 500px; background:#fff; border-radius: 16px; box-shadow: 0 30px 80px rgba(0,0,0,.28); border:1px solid rgba(108,92,231,.15); overflow:hidden;}
  .tmg-modal-sm{width: min(520px, 100%);}
  .tmg-modal-wide{width: min(900px, 100%);}
  .tmg-modal-head{padding:16px 16px; display:flex; align-items:flex-start; justify-content:space-between; gap:14px; border-bottom:1px solid rgba(108,92,231,.12); background: linear-gradient(180deg, rgba(108,92,231,.06), rgba(108,92,231,.00));}
  .tmg-modal-title{font-weight:1000;font-size:16px;color:#1f1a3a;}
  .tmg-modal-sub{margin-top:5px;font-weight:800;color:#6b6f86;font-size:12.5px;}
  .tmg-modal-close{border:none;background:transparent;font-size:24px;line-height:1;color:#6b6f86; cursor:pointer; padding:2px 8px;}
  .tmg-modal-body{padding:16px 16px 18px; overflow-y:auto; max-height: calc(500px - 113px);}
  .tmg-form-grid{display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:16px; align-items:start;}
  .tmg-field{display:flex;flex-direction:column; gap:8px;}
  .tmg-error{color:#ff4757; font-weight:900; font-size:11.5px; margin-top: -3px;}
  .tmg-modal-actions{padding:14px 16px; border-top:1px solid rgba(108,92,231,.12); display:flex; justify-content:flex-end; gap:10px; flex-wrap:wrap;}
  .tmg-form-grid{grid-template-columns: 1fr;}
`;

const emptyForm = { course: COURSES[0], trainer: '', campus: CAMPUSES[0], days: 'Mon, Wed, Fri', time: '09:00 AM - 11:00 AM', seats: 30 };

export default function AdminSlots({ city }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState(city || 'All Cities');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [modal, setModal] = useState(null); // { mode, data }
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [trainerModalMode, setTrainerModalMode] = useState('add');
  const [trainerModalInitialValues, setTrainerModalInitialValues] = useState(null);
  const [trainerModalLoading, setTrainerModalLoading] = useState(false);
  const [trainerModalError, setTrainerModalError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [slotData, trainerData] = await Promise.all([listSlots(), listTrainers()]);
        setRows(slotData || []);
        setTrainers(trainerData || []);
        if (!form.trainer && trainerData?.length) {
          setForm((prev) => ({ ...prev, trainer: trainerData[0].fullName }));
        }
      } catch (err) {
        setRows([]);
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => { setCityFilter(city || 'All Cities'); }, [city]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { setPage(1); }, [search, cityFilter, courseFilter, statusFilter]);

  const trainerOptions = useMemo(() => {
    const names = trainers.map((t) => t.fullName).filter(Boolean);
    return [...new Set(names)];
  }, [trainers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (cityFilter !== 'All Cities' && r.campus !== `${cityFilter} Campus`) return false;
      if (courseFilter !== 'All Courses' && r.course !== courseFilter) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.slotId.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || r.trainer.toLowerCase().includes(q) || r.campus.toLowerCase().includes(q);
    });
  }, [rows, search, cityFilter, courseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const campusOptions = city ? CAMPUSES.filter((c) => c === `${city} Campus`) : CAMPUSES;

  const openAdd = () => {
    setForm(city ? { ...emptyForm, campus: `${city} Campus`, trainer: trainerOptions[0] || '' } : { ...emptyForm, trainer: trainerOptions[0] || '' });
    setModal({ mode: 'add' });
  };

  const openEdit = (r) => {
    setForm({ ...r });
    setModal({ mode: 'edit', id: r.slotId });
  };

  const openTrainerModal = () => {
    setTrainerModalError('');
    setTrainerModalMode('add');
    setTrainerModalInitialValues({
      fullName: '',
      email: '',
      cnic: '',
      phoneNumber: '',
      campus: city ? `${city} Campus` : CAMPUSES[0],
      gender: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      salary: '',
      address: '',
      status: 'Active',
      profilePictureUrl: null,
      profilePicturePreview: null,
    });
    setTrainerModalOpen(true);
  };

  const handleTrainerSaved = async (formData, isValid) => {
    if (!isValid) {
      setTrainerModalError('Please fix validation errors.');
      return;
    }

    setTrainerModalLoading(true);
    setTrainerModalError('');
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        cnic: formData.cnic,
        phoneNumber: formData.phoneNumber,
        campus: formData.campus,
        gender: formData.gender,
        qualification: formData.qualification,
        experience: Number(formData.experience),
        joiningDate: formData.joiningDate,
        salary: Number(formData.salary),
        address: formData.address,
        status: formData.status,
        profilePictureUrl: formData.profilePictureUrl || null,
      };
      const createdTrainer = await createTrainer(payload);
      setTrainers((prev) => [createdTrainer, ...prev]);
      setForm((prev) => ({ ...prev, trainer: createdTrainer.fullName }));
      window.dispatchEvent(new CustomEvent('trainerAdded', { detail: createdTrainer }));
      setTrainerModalOpen(false);
      setToast(`Trainer ${createdTrainer.fullName} added.`);
    } catch (err) {
      setTrainerModalError(err?.response?.data?.message || 'Unable to add trainer.');
    } finally {
      setTrainerModalLoading(false);
    }
  };

  const save = async () => {
    if (!form.time.trim() || !form.days.trim() || Number(form.seats) <= 0) {
      setToast('Please fill all fields correctly.');
      return;
    }

    try {
      const trainerName = form.trainer === ADD_TRAINER_OPTION ? '' : form.trainer;
      const selectedTrainer = trainers.find(
        (t) => t.fullName === trainerName || (t._id || t.id) === form.trainerId
      );
      const payload = {
        course: form.course,
        trainer: trainerName,
        trainerId: selectedTrainer?._id || selectedTrainer?.id || null,
        campus: form.campus,
        days: form.days,
        time: form.time,
        seats: Number(form.seats),
        classType: form.classType,
        gender: form.gender,
        start: form.start,
        end: form.end,
        whatsapp: form.whatsapp,
      };

      if (modal.mode === 'add') {
        const created = await createSlot(payload);
        setRows((p) => [created, ...p]);
        setToast('Slot created successfully.');
      } else {
        const updated = await updateSlot(modal.id, payload);
        setRows((p) => p.map((r) => (r.slotId === modal.id ? updated : r)));
        setToast('Slot updated.');
      }
    } catch (err) {
      setToast(err?.response?.data?.message || 'Unable to save slot.');
    } finally {
      setModal(null);
    }
  };

  const doDelete = async (slotId) => {
    try {
      await deleteSlot(slotId);
      setRows((p) => p.filter((r) => r.slotId !== slotId));
      setToast('Slot deleted.');
    } catch (err) {
      setToast(err?.response?.data?.message || 'Unable to delete slot.');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="ap-page">
      <style>{tmgStyles}</style>
      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title" style={{ fontSize: 16 }}>Slots</span>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>
              {cityFilter === 'All Cities' ? 'Manage class slots and schedules' : `Showing slots for ${cityFilter}`}
            </div>
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
          {city ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 9, background: '#f0f5ff', border: '1px solid #cdd8ea', color: '#0A3D91', fontSize: 12.5, fontWeight: 700 }}>
              <MapPin size={14} /> {city} City
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="#5F7A9E" />
              <select className="afilter-select" style={{ width: 'auto', minWidth: 140 }} value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option>All Cities</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}
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
              <div className="atable-row" key={r.slotId} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{r.slotId}</span>
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
                {modal.mode === 'add' ? 'Add New Slot' : modal.mode === 'edit' ? 'Edit Slot' : `Slot ${modal.data.slotId}`}
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
                      <select value={form.trainer} onChange={(e) => {
                        const selection = e.target.value;
                        if (selection === ADD_TRAINER_OPTION) {
                          openTrainerModal();
                          setForm((prev) => ({ ...prev, trainer: trainerOptions[0] || '' }));
                          return;
                        }
                        setForm({ ...form, trainer: selection });
                      }}>
                        {trainerOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                        <option value={ADD_TRAINER_OPTION}>Add new trainer</option>
                      </select>
                    </div>
                    <div className="ap-field">
                      <label>Campus</label>
                      <select value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })}>{campusOptions.map((c) => <option key={c}>{c}</option>)}</select>
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
                  Are you sure you want to delete <b>{confirmDelete.slotId || confirmDelete.id}</b> ({confirmDelete.course})? This cannot be undone.
                </div>
              </div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }} onClick={() => doDelete(confirmDelete.slotId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <TrainerModal
        open={trainerModalOpen}
        mode={trainerModalMode}
        initialValues={trainerModalInitialValues}
        campuses={CAMPUSES}
        loading={trainerModalLoading}
        serverError={trainerModalError}
        onClose={() => setTrainerModalOpen(false)}
        onSubmit={handleTrainerSaved}
      />
      {toast && <div className="ap-toast"><CalendarClock size={16} /> {toast}</div>}
    </div>
  );
}
