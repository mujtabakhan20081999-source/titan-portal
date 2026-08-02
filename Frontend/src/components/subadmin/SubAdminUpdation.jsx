import { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

import { STUDENT_STATUSES } from './subAdminData';
import { bulkUpdateStudentStatus } from '../../services/adminService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

function SubAdminUpdation({ city, students, setStudents, onReload }) {
  const [rolls, setRolls] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Enrolled');
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  const update = async () => {
    const items = [...new Set(rolls.split(',').map((x) => x.trim()).filter(Boolean))];
    if (items.length === 0) { say('Paste at least one roll number.'); return; }
    setBusy(true);
    try {
      const data = await bulkUpdateStudentStatus({
        rolls: items,
        status,
        message,
        campus: `${city} Campus`,
        city,
      });
      const updated = data.updated || [];
      const missing = data.missing || [];
      setStudents((p) => p.map((s) => (updated.map((r) => r.toUpperCase()).includes(String(s.roll).toUpperCase()) ? { ...s, status } : s)));
      setResult({ updated, missing, status });
      say(`${updated.length} student(s) updated to ${status}.`);
      if (onReload) onReload();
    } catch (err) {
      say(err?.response?.data?.message || 'Bulk update failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Updation — {city} Campus</h2>
          <p>Change the status of many students at once</p>
        </div>
      </div>

      <div className="ap-2col-a">
        <div className="acard">
          <div className="acard-head"><span className="acard-title">Bulk Status Update</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ap-field">
              <label>Roll numbers (separated by commas)</label>
              <textarea placeholder="SUK-24-001, SUK-24-002, SUK-24-003…" value={rolls} onChange={(e) => setRolls(e.target.value)} />
            </div>
            <div className="ap-field">
              <label>Message (optional)</label>
              <input placeholder="e.g. Final result of Batch 1" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="ap-field" style={{ maxWidth: 240 }}>
              <label>New Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STUDENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', padding: '12px 14px' }} disabled={busy} onClick={update}>
              <RefreshCw size={16} /> {busy ? 'Updating…' : 'Update All'}
            </button>
          </div>
        </div>

        <div className="acard">
          <div className="acard-head"><span className="acard-title">Result</span></div>
          {!result ? (
            <div style={{ padding: '26px 0', textAlign: 'center', color: '#7286a3', fontWeight: 700, fontSize: 13 }}>
              Updated and not-found counts will show here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="amini-stats">
                <div className="amini-item"><div className="amini-val" style={{ color: '#16a34a' }}>{result.updated.length}</div><div className="amini-label">Updated</div></div>
                <div className="amini-item"><div className="amini-val" style={{ color: '#dc2626' }}>{result.missing.length}</div><div className="amini-label">Not Found</div></div>
              </div>
              {result.updated.length > 0 && (
                <div>
                  <div className="ap-hint" style={{ marginBottom: 6 }}>Changed to <b>{result.status}</b>:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.updated.map((r) => <span key={r} className="badge badge-green">{r}</span>)}
                  </div>
                </div>
              )}
              {result.missing.length > 0 && (
                <div>
                  <div className="ap-hint err" style={{ marginBottom: 6 }}>Not found at {city} Campus:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.missing.map((r) => <span key={r} className="badge badge-grey">{r}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminUpdation;
