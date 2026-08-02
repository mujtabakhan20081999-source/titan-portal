import { useEffect, useState } from 'react';
import {
  ScanLine, Search, LogIn, LogOut, CheckCircle2, XCircle, ClipboardList,
} from 'lucide-react';
import {
  scanTrainerAttendance,
  listTrainerAttendance,
  listTrainerCorrections,
  reviewTrainerCorrection,
  createTrainerCorrection,
} from '../../services/adminService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

export default function AdminTrainerAttendance({ trainers = [] }) {
  const [tab, setTab] = useState('scan');
  const [empId, setEmpId] = useState('');
  const [found, setFound] = useState(null);
  const [err, setErr] = useState('');
  const [log, setLog] = useState([]);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [corrForm, setCorrForm] = useState({ employeeId: '', date: new Date().toISOString().slice(0, 10), reason: '', proposedCheckIn: '09:00 AM', proposedCheckOut: '05:00 PM' });

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const load = async () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const [att, corr] = await Promise.all([
        listTrainerAttendance({ date: today }).catch(() => []),
        listTrainerCorrections().catch(() => []),
      ]);
      setLog(att || []);
      setRequests(corr || []);
    } catch {
      setLog([]);
      setRequests([]);
    }
  };

  useEffect(() => { load(); }, []);

  const find = () => {
    const q = empId.trim().toUpperCase();
    const t = trainers.find((x) => String(x.employeeId || '').toUpperCase() === q);
    if (!t) {
      setFound(null);
      setErr(`No trainer with Employee ID "${empId.trim()}".`);
      return;
    }
    setErr('');
    setFound(t);
  };

  const scan = async (action) => {
    if (!found) return;
    setBusy(true);
    try {
      await scanTrainerAttendance({ employeeId: found.employeeId, action });
      say(`${action === 'check-out' ? 'Check-out' : 'Check-in'} recorded for ${found.fullName}.`);
      setFound(null);
      setEmpId('');
      await load();
    } catch (e) {
      say(e?.response?.data?.message || 'Scan failed.');
    } finally {
      setBusy(false);
    }
  };

  const decide = async (id, status) => {
    try {
      await reviewTrainerCorrection(id, { status });
      say(`Request ${status.toLowerCase()}.`);
      await load();
    } catch (e) {
      say(e?.response?.data?.message || 'Review failed.');
    }
  };

  const submitCorrection = async () => {
    if (!corrForm.employeeId.trim() || !corrForm.reason.trim()) {
      say('Employee ID and reason are required.');
      return;
    }
    setBusy(true);
    try {
      await createTrainerCorrection(corrForm);
      say('Correction request submitted.');
      setCorrForm((f) => ({ ...f, reason: '' }));
      await load();
    } catch (e) {
      say(e?.response?.data?.message || 'Unable to submit request.');
    } finally {
      setBusy(false);
    }
  };

  const pending = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="ap-page" style={{ marginTop: 18 }}>
      <div className="ap-head">
        <div>
          <h2 style={{ fontSize: 18 }}>Trainer Attendance</h2>
          <p>Scan Employee ID, review logs, approve correction requests</p>
        </div>
        <div className="ap-tabs">
          <button type="button" className={`ap-tab${tab === 'scan' ? ' active' : ''}`} onClick={() => setTab('scan')}><ScanLine size={15} /> Scan</button>
          <button type="button" className={`ap-tab${tab === 'requests' ? ' active' : ''}`} onClick={() => setTab('requests')}><ClipboardList size={15} /> Requests ({pending})</button>
        </div>
      </div>

      {tab === 'scan' && (
        <div className="ap-2col-a">
          <div className="acard">
            <div className="acard-head"><span className="acard-title">Scan Employee ID</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ flex: 1, minWidth: 200 }}>
                <Search size={16} />
                <input value={empId} onChange={(e) => setEmpId(e.target.value)} placeholder="EMP-123456" onKeyDown={(e) => e.key === 'Enter' && find()} />
              </label>
              <button type="button" className="btn-primary" onClick={find}>Find</button>
            </div>
            {err && <div className="ap-hint err" style={{ marginTop: 10 }}>{err}</div>}
            {found && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 800 }}>{found.fullName}</div>
                <div style={{ fontSize: 12.5, color: '#7286a3' }}>{found.employeeId} · {found.campus}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                  <button type="button" className="btn-primary" disabled={busy} onClick={() => scan('check-in')}><LogIn size={15} /> Check-in</button>
                  <button type="button" className="btn-ghost" disabled={busy} onClick={() => scan('check-out')}><LogOut size={15} /> Check-out</button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 18, borderTop: '1px solid #eef2f7', paddingTop: 14 }}>
              <div className="acard-title" style={{ marginBottom: 10 }}>Request Correction</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="ap-field"><label>Employee ID</label><input value={corrForm.employeeId} onChange={(e) => setCorrForm({ ...corrForm, employeeId: e.target.value })} /></div>
                <div className="ap-field"><label>Date</label><input type="date" value={corrForm.date} onChange={(e) => setCorrForm({ ...corrForm, date: e.target.value })} /></div>
                <div className="ap-field"><label>Proposed Check-in</label><input value={corrForm.proposedCheckIn} onChange={(e) => setCorrForm({ ...corrForm, proposedCheckIn: e.target.value })} /></div>
                <div className="ap-field"><label>Proposed Check-out</label><input value={corrForm.proposedCheckOut} onChange={(e) => setCorrForm({ ...corrForm, proposedCheckOut: e.target.value })} /></div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}><label>Reason</label><input value={corrForm.reason} onChange={(e) => setCorrForm({ ...corrForm, reason: e.target.value })} /></div>
              </div>
              <button type="button" className="btn-primary" style={{ marginTop: 10 }} disabled={busy} onClick={submitCorrection}>Submit Request</button>
            </div>
          </div>

          <div className="acard">
            <div className="acard-head"><span className="acard-title">Today&apos;s Log</span></div>
            {log.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#7286a3', fontWeight: 700 }}>No scans today.</div>
            ) : log.map((a) => (
              <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f4fa' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{a.trainerName}</div>
                  <div style={{ fontSize: 12, color: '#7286a3' }}>{a.employeeId} · In {a.checkIn || '—'} · Out {a.checkOut || '—'}</div>
                </div>
                <span className={`badge ${a.status === 'Present' ? 'badge-green' : 'badge-amber'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div className="acard">
          <div className="acard-head">
            <span className="acard-title">Correction Requests</span>
            <span className="badge badge-amber">{pending} pending</span>
          </div>
          {requests.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#7286a3', fontWeight: 700 }}>No requests.</div>
          ) : requests.map((r) => (
            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f4fa' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{r.trainerName} · {r.date}</div>
                <div style={{ fontSize: 12.5, color: '#7286a3' }}>{r.reason} — {r.employeeId}</div>
              </div>
              {r.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn-primary" style={{ padding: '7px 12px' }} onClick={() => decide(r._id, 'Approved')}><CheckCircle2 size={14} /> Approve</button>
                  <button type="button" className="btn-ghost" style={{ padding: '7px 12px', color: '#dc2626' }} onClick={() => decide(r._id, 'Rejected')}><XCircle size={14} /> Reject</button>
                </div>
              ) : (
                <span className={`badge ${r.status === 'Approved' ? 'badge-green' : 'badge-grey'}`}>{r.status}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}
