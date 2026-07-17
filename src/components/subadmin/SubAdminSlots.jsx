import { useState } from 'react';
import { Plus, X, MapPin, CalendarClock, Link2 } from 'lucide-react';

import { COURSES, can, cityCode, makeTrainers } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const GRID = '92px 1.5fr 1.1fr 1.5fr 92px 86px 96px 110px';

const emptySlot = {
  course: COURSES[0], trainer: '', days: 'Mon, Wed, Fri', time: '09:00 AM - 11:00 AM',
  classType: 'Onsite', gender: 'Mixed', start: '2026-08-01', end: '2026-12-15',
  rate: 1500, whatsapp: '', seats: 40,
};

function SubAdminSlots({ city, perms, slots, setSlots }) {
  const trainers = makeTrainers(city);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ...emptySlot, trainer: trainers[0].name });
  const [formErr, setFormErr] = useState('');
  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const canWrite = can(perms, 'Slots', 'write');
  const canUpdate = can(perms, 'Slots', 'update');

  const toggleOpen = (id) => {
    setSlots((p) => p.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));
    const s = slots.find((x) => x.id === id);
    say(`Registration ${s?.open ? 'closed' : 'opened'} for ${id}.`);
  };

  const save = () => {
    if (!form.days.trim() || !form.time.trim() || Number(form.seats) <= 0) { setFormErr('Schedule and a valid seat count are required.'); return; }
    const created = {
      id: `${cityCode(city)}-SL-${String(slots.length + 1).padStart(2, '0')}`,
      course: form.course, trainer: form.trainer, days: form.days, time: form.time,
      classType: form.classType, gender: form.gender,
      filled: 0, seats: Number(form.seats), open: true, campus: `${city} Campus`,
    };
    setSlots((p) => [created, ...p]);
    setModal(false);
    say(`Slot ${created.id} created — registration open.`);
  };

  return (
    <div className="ap-page">
      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title" style={{ fontSize: 16 }}>Slots — {city} Campus</span>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3, fontWeight: 600 }}>
              Class groups at your campus · closed slots can't take new students
            </div>
          </div>
          <div className="acard-tools">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 9, background: '#f0f5ff', border: '1px solid #cdd8ea', color: '#0A3D91', fontSize: 12.5, fontWeight: 700 }}>
              <MapPin size={14} /> {city} Campus
            </span>
            {canWrite && (
              <button className="btn-primary" onClick={() => { setForm({ ...emptySlot, trainer: trainers[0].name }); setFormErr(''); setModal(true); }}>
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
            {slots.map((s) => (
              <div className="atable-row" key={s.id} style={{ gridTemplateColumns: GRID }}>
                <span className="atable-cell-strong">{s.id}</span>
                <span className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.course}</span>
                <span className="atable-cell">{s.trainer}</span>
                <div>
                  <div className="atable-cell-strong" style={{ fontSize: 12.5 }}>{s.days}</div>
                  <div className="atable-cell-sub">{s.time}</div>
                </div>
                <span className={`badge ${s.classType === 'Onsite' ? 'badge-blue' : 'badge-grey'}`}>{s.classType}</span>
                <span className="atable-cell">{s.gender}</span>
                <span className="atable-cell-strong" style={{ color: s.filled >= s.seats ? '#dc2626' : '#16a34a' }}>{s.filled}/{s.seats}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {canUpdate && (
                    <label className="ap-toggle" title={s.open ? 'Close registration' : 'Open registration'}>
                      <input type="checkbox" checked={s.open} onChange={() => toggleOpen(s.id)} />
                      <span className="ap-toggle-slider" />
                    </label>
                  )}
                  <span className={`badge ${s.open ? 'badge-green' : 'badge-grey'}`}>{s.open ? 'Open' : 'Closed'}</span>
                </div>
              </div>
            ))}
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
                  <select value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })}>{trainers.map((t) => <option key={t.empId}>{t.name}</option>)}</select>
                </div>
                <div className="ap-field"><label>Days</label><input value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} placeholder="Mon, Wed, Fri" /></div>
                <div className="ap-field"><label>Time</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="09:00 AM - 11:00 AM" /></div>
                <div className="ap-field"><label>Class Type</label>
                  <select value={form.classType} onChange={(e) => setForm({ ...form, classType: e.target.value })}><option>Onsite</option><option>Online</option></select>
                </div>
                <div className="ap-field"><label>Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Mixed</option><option>Male</option><option>Female</option></select>
                </div>
                <div className="ap-field"><label>Start Date</label><input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
                <div className="ap-field"><label>End Date</label><input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></div>
                <div className="ap-field"><label>Trainer Hourly Rate (Rs)</label><input type="number" min="0" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /></div>
                <div className="ap-field"><label>Capacity (Seats)</label><input type="number" min="1" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /></div>
              </div>
              <div className="ap-field">
                <label>WhatsApp Group Link</label>
                <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://chat.whatsapp.com/…" />
              </div>
              <div className="ap-hint"><Link2 size={11} style={{ display: 'inline' }} /> New slots start with registration <b>Open</b> and 0 seats used.</div>
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save}><Plus size={14} /> Create Slot</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CalendarClock size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminSlots;
