import { useState } from 'react';
import {
  GraduationCap, ScanLine, Search, LogIn, LogOut, CheckCircle2, XCircle, ClipboardList, Lock,
} from 'lucide-react';

import { can, AV_COLORS } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const GRID = '1.5fr 1.6fr 120px 1.6fr 110px';

const CITY_CODE = { Sukkur: 'SUK', Karachi: 'KHI', Lahore: 'LHE', Islamabad: 'ISB', Multan: 'MUX' };
const cityCode = (c) => CITY_CODE[c] || 'GEN';

// Generate initials avatar
function getAv(name) {
  return AV_COLORS[name.length % AV_COLORS.length];
}

function SubAdminTrainers({ city, perms, trainers }) {
  const [tab, setTab] = useState('Trainers');
  const [requests, setRequests] = useState([
    { id: `REQ-${cityCode(city)}-01`, trainer: 'Ali Raza',    empId: `EMP-${cityCode(city)}-01`, date: '12 Jul 2026', change: 'Absent → Present', reason: 'Was on campus but scanner was offline.', status: 'Pending' },
    { id: `REQ-${cityCode(city)}-02`, trainer: 'Sana Khan',   empId: `EMP-${cityCode(city)}-02`, date: '10 Jul 2026', change: 'Missing check-out', reason: 'Forgot to scan while leaving early class.', status: 'Pending' },
    { id: `REQ-${cityCode(city)}-03`, trainer: 'Usman Ali',   empId: `EMP-${cityCode(city)}-03`, date: '08 Jul 2026', change: 'Leave → Present',   reason: 'Leave was cancelled, took the class.', status: 'Approved' },
  ]);
  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const canUpdate = can(perms, 'Trainers', 'update');
  const canWrite = can(perms, 'Trainers', 'write');

  /* Trainer attendance (scan employee ID) */
  const [empIdInput, setEmpIdInput] = useState('');
  const [foundTrainer, setFoundTrainer] = useState(null);
  const [attErr, setAttErr] = useState('');
  const [log, setLog] = useState([
    { empId: '—', name: 'Ali Raza', action: 'Check-in', time: '08:52 AM', date: '18 Jul 2026' },
    { empId: '—', name: 'Sana Khan', action: 'Check-in', time: '01:45 PM', date: '18 Jul 2026' },
  ]);

  const findTrainer = () => {
    const q = empIdInput.trim().toUpperCase();
    const t = trainers.find((x) => x.empId.toUpperCase() === q);
    if (!t) { setFoundTrainer(null); setAttErr(`No trainer with Employee ID "${empIdInput.trim()}" at ${city} Campus.`); return; }
    setAttErr(''); setFoundTrainer(t);
  };

  const record = (action) => {
    if (!foundTrainer) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setLog((p) => [{ empId: foundTrainer.empId, name: foundTrainer.name, action, time, date: '18 Jul 2026' }, ...p]);
    say(`${action} recorded for ${foundTrainer.name}.`);
    setFoundTrainer(null); setEmpIdInput('');
  };

  const decide = (id, status) => {
    setRequests((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    say(`Request ${id} ${status.toLowerCase()}.`);
  };

  const pending = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Trainers — {city} Campus</h2>
          <p>Campus trainers, their attendance and correction requests</p>
        </div>
        <div className="ap-tabs">
          {['Trainers', 'Attendance', 'Requests'].map((t) => (
            <button key={t} className={`ap-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'Trainers' ? <GraduationCap size={15} /> : t === 'Attendance' ? <ScanLine size={15} /> : <ClipboardList size={15} />}
              {t}{t === 'Requests' && pending > 0 ? ` (${pending})` : ''}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Trainers' && (
        <div className="acard" style={{ padding: 0 }}>
          <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
            <div>
              <span className="acard-title">Trainer List</span>
              <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>{trainers.length} trainers assigned to your campus</div>
            </div>
            {!canWrite && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 11.5, fontWeight: 700 }}>
                <Lock size={13} /> Read-only — adding trainers needs Super Admin
              </span>
            )}
          </div>
          <div className="admin-scroll-x">
            <div className="atable" style={{ minWidth: 860 }}>
              <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
                <span>Trainer</span><span>Email</span><span>Employee ID</span><span>Phone</span><span>Status</span>
              </div>
              {trainers.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No trainers found</div>
              ) : trainers.map((t) => {
                const name = t.fullName || t.name || 'Unknown';
                const empId = t.employeeId || t.empId || '—';
                const email = t.email || '—';
                const phone = t.phoneNumber || t.phone || '—';
                const status = t.status || 'Active';
                return (
                  <div className="atable-row" key={empId} style={{ gridTemplateColumns: GRID }}>
                    <div className="atable-name">
                      <div className="atable-av" style={{ background: AV_COLORS[name.length % AV_COLORS.length] }}>{initials(name)}</div>
                      <div>
                        <div className="atable-cell-strong">{name}</div>
                        <div className="atable-cell-sub">{t.campus || city}</div>
                      </div>
                    </div>
                    <span className="atable-cell">{email}</span>
                    <span className="atable-cell-strong">{empId}</span>
                    <span className="atable-cell">{phone}</span>
                    <span className={`badge ${status === 'Active' ? 'badge-green' : 'badge-grey'}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'Attendance' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Scan Employee ID</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: '1 1 220px' }}>
                <ScanLine size={16} color="#5F7A9E" />
                <input placeholder={`e.g. EMP-${city.slice(0, 3).toUpperCase()}-01…`} value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && findTrainer()} />
              </label>
              <button className="btn-primary" onClick={findTrainer}><Search size={15} /> Check</button>
            </div>
            {attErr && <div className="ap-hint err" style={{ marginTop: 12 }}>{attErr}</div>}

            {foundTrainer && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="att-profile">
                  <div className="att-profile-av" style={{ background: AV_COLORS[(foundTrainer.fullName || foundTrainer.name || '').length % AV_COLORS.length] }}>
                    {initials(foundTrainer.fullName || foundTrainer.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="att-profile-name">{foundTrainer.fullName || foundTrainer.name}</div>
                    <div className="att-profile-meta">{foundTrainer.employeeId || foundTrainer.empId}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button className="att-btn present" onClick={() => record('Check-in')}><LogIn size={16} /> Check-in</button>
                  <button className="att-btn absent" onClick={() => record('Check-out')}><LogOut size={16} /> Check-out</button>
                </div>
              </div>
            )}
          </div>

          <div className="acard">
            <div className="acard-head">
              <span className="acard-title">Today's Log</span>
              <span className="badge badge-blue">18 Jul 2026</span>
            </div>
            {log.map((l, i) => (
              <div className="att-recent-row" key={i}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: l.action === 'Check-in' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {l.action === 'Check-in' ? <LogIn size={15} color="#16a34a" /> : <LogOut size={15} color="#dc2626" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="atable-cell-strong">{l.name}</div>
                  <div className="atable-cell-sub">{l.action}</div>
                </div>
                <span className="atable-cell-sub" style={{ fontWeight: 700 }}>{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Requests' && (
        <div className="acard">
          <div className="acard-head">
            <span className="acard-title">Attendance Correction Requests</span>
            <span className="badge badge-amber">{pending} pending</span>
          </div>
          <div className="ap-list">
            {requests.map((r) => (
              <div className="ap-item" key={r.id}>
                <div className="ap-item-ic" style={{ background: '#f4f7ff' }}><ClipboardList size={18} color="#0A3D91" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ap-item-title">{r.trainer} · {r.date} · <span style={{ color: '#0A3D91' }}>{r.change}</span></div>
                  <div className="ap-item-sub">{r.reason} — {r.empId}</div>
                </div>
                {r.status === 'Pending' && canUpdate ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={() => decide(r.id, 'Approved')}><CheckCircle2 size={14} /> Approve</button>
                    <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: 12, color: '#dc2626', borderColor: '#fecaca' }} onClick={() => decide(r.id, 'Rejected')}><XCircle size={14} /> Reject</button>
                  </div>
                ) : (
                  <span className={`badge ${r.status === 'Approved' ? 'badge-green' : r.status === 'Rejected' ? 'badge-grey' : 'badge-amber'}`}>{r.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminTrainers;
