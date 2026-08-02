import { useState } from 'react';
import { Plus, X, MapPin } from 'lucide-react';

import { COURSES, can } from './subAdminData';
import { createSlot, updateSlot } from '../../services/slotService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const GRID = '92px 1.5fr 1.1fr 1.5fr 92px 86px 96px 110px';

const emptySlot = {
  course: COURSES[0], trainer: 'Assign later', days: 'Mon, Wed, Fri', time: '09:00 AM - 11:00 AM',
  classType: 'Onsite', gender: 'Mixed', start: '', end: '',
  whatsapp: '', seats: 40,
};

function SubAdminSlots({ city, perms, slots, setSlots, trainers = [], onReload }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ...emptySlot });
  const [formErr, setFormErr] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const canWrite = can(perms, 'Slots', 'write');
  const canUpdate = can(perms, 'Slots', 'update');
  const trainerNames = trainers.map((t) => t.fullName).filter(Boolean);

  const toggleOpen = async (slot) => {
    const id = slot.slotId || slot.id;
    const next = (slot.open || slot.status === 'Open') ? 'Closed' : 'Open';
    try {
      const updated = await updateSlot(id, { status: next });
      setSlots((p) => p.map((s) => ((s.slotId || s.id) === id ? { ...updated, id: updated.slotId, open: updated.status === 'Open' } : s)));
      say(`Registration ${next.toLowerCase()} for ${id}.`);
    } catch (err) {
      say(err?.response?.data?.message || 'Unable to update slot.');
    }
  };

  const save = async () => {
    if (!form.days.trim() || !form.time.trim() || Number(form.seats) <= 0) {
      setFormErr('Schedule and a valid seat count are required.'); return;
    }
    setBusy(true);
    setFormErr('');
    try {
      const selected = trainers.find((t) => t.fullName === form.trainer);
      const created = await createSlot({
        course: form.course,
        trainer: form.trainer,
        trainerId: selected?._id || null,
        campus: `${city} Campus`,
        days: form.days,
        time: form.time,
        seats: Number(form.seats),
        classType: form.classType,
        gender: form.gender,
        start: form.start || undefined,
        end: form.end || undefined,
        whatsapp: form.whatsapp,
        status: 'Open',
      });
      setSlots((p) => [{ ...created, id: created.slotId, open: true }, ...p]);
      setModal(false);
      say(`Slot ${created.slotId} created — registration open.`);
      if (onReload) onReload();
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Unable to create slot.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ap-page">
      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title" style={{ fontSize: 16 }}>Slots — {city} Campus</span>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>
              Class groups at your campus · closed slots can&apos;t take new students
            </div>
          </div>
          <div className="acard-tools">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 9, background: '#f0f5ff', border: '1px solid #cdd8ea', color: '#0A3D91', fontSize: 12.5, fontWeight: 700 }}>
              <MapPin size={14} /> {city} Campus
            </span>
            {canWrite && (
              <button className="btn-primary" onClick={() => { setForm({ ...emptySlot, trainer: trainerNames[0] || 'Assign later' }); setFormErr(''); setModal(true); }}>
                <Plus size={15} /> Add Slot
              </button>
            )}
          </div>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 940 }}>
            <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
              <span>Slot ID</span><span>Course</span><span>Trainer</span><span>Days &amp; Time</span><span>Type</span><span>Gender</span><span>Seats</span><span>Registration</span>
            </div>
            {slots.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No slots yet</div>
            ) : slots.map((s) => {
              const open = s.open ?? s.status === 'Open';
              return (
                <div className="atable-row" key={s.slotId || s.id} style={{ gridTemplateColumns: GRID }}>
                  <span className="atable-cell-strong">{s.slotId || s.id}</span>
                  <span className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.course}</span>
                  <span className="atable-cell">{s.trainer}</span>
                  <div>
                    <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.days}</div>
                    <div className="atable-cell-sub">{s.time}</div>
                  </div>
                  <span className={`badge ${s.classType === 'Onsite' ? 'badge-blue' : 'badge-grey'}`}>{s.classType || 'Onsite'}</span>
                  <span className="atable-cell">{s.gender || 'Mixed'}</span>
                  <span className="atable-cell-strong" style={{ color: s.filled >= s.seats ? '#dc2626' : '#16a34a' }}>{s.filled || 0}/{s.seats}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    {canUpdate && (
                      <label className="ap-toggle" title={open ? 'Close registration' : 'Open registration'}>
                        <input type="checkbox" checked={open} onChange={() => toggleOpen(s)} />
                        <span className="ap-toggle-slider" />
                      </label>
                    )}
                    <span className={`badge ${open ? 'badge-green' : 'badge-grey'}`}>{open ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {modal && (
        <div className="ap-modal-backdrop" onClick={() => setModal(false)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">Add Slot — {city} Campus</span>
              <button className="ap-modal-close" onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body" style={{ maxHeight: '62vh', overflowY: 'auto' }}>
              {formErr && <div className="ap-hint err">{formErr}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="ap-field"><label>Course</label>
                  <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
                <div className="ap-field"><label>Trainer</label>
                  <select value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })}>
                    <option>Assign later</option>
                    {trainerNames.map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div className="ap-field"><label>Days</label><input value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} /></div>
                <div className="ap-field"><label>Time</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
                <div className="ap-field"><label>Class Type</label>
                  <select value={form.classType} onChange={(e) => setForm({ ...form, classType: e.target.value })}><option>Onsite</option><option>Online</option></select>
                </div>
                <div className="ap-field"><label>Seats</label><input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /></div>
              </div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Create Slot'}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast">{toast}</div>}
    </div>
  );
}

export default SubAdminSlots;
