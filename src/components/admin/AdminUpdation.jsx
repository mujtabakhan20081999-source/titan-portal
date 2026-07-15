import { useMemo, useState } from 'react';
import { RefreshCw, RotateCcw, CheckCircle2, History } from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const STATUS_OPTIONS = ['Enrolled', 'Approved', 'Rejected', 'Passed', 'Failed', 'Dropped', 'Frozen'];

const STATUS_BADGE = {
  Enrolled: 'badge-blue', Approved: 'badge-green', Passed: 'badge-green',
  Rejected: 'badge-grey', Failed: 'badge-grey', Dropped: 'badge-grey', Frozen: 'badge-amber',
};

const SEED_HISTORY = [
  { date: '2026-05-01', rolls: 'AI-24-001, WD-24-015', status: 'Enrolled', by: 'Super Admin', msg: 'Bulk update' },
  { date: '2026-04-30', rolls: 'PY-24-032, CS-24-011', status: 'Approved', by: 'Admin Office', msg: 'Status change' },
  { date: '2026-04-29', rolls: 'DS-24-008', status: 'Rejected', by: 'Super Admin', msg: 'Not eligible' },
  { date: '2026-04-28', rolls: 'AI-24-002, UX-24-020', status: 'Passed', by: 'Admin Office', msg: 'Exam result' },
  { date: '2026-04-27', rolls: 'WD-24-016', status: 'Failed', by: 'Super Admin', msg: 'Low attendance' },
];

function parseRolls(raw) {
  return raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
}

export default function AdminUpdation() {
  const [rolls, setRolls] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState(SEED_HISTORY);
  const [toast, setToast] = useState('');

  const parsed = useMemo(() => parseRolls(rolls), [rolls]);

  const reset = () => { setRolls(''); setStatus(''); setMessage(''); setError(''); };

  const submit = () => {
    if (parsed.length === 0) { setError('Enter at least one roll number.'); return; }
    if (!status) { setError('Select a new status.'); return; }
    setError('');
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      rolls: parsed.join(', '),
      status,
      by: 'Super Admin',
      msg: message.trim() || '—',
    };
    setHistory((h) => [entry, ...h]);
    setToast(`Updated ${parsed.length} student${parsed.length > 1 ? 's' : ''} to “${status}”.`);
    reset();
    setTimeout(() => setToast(''), 2400);
  };

  const GRID = '110px 1.6fr 110px 1.1fr 1.3fr';

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Updation</h2>
          <p>Bulk update student status</p>
        </div>
      </div>

      <div className="ap-2col-a">
        {/* Form */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={16} color="#0A3D91" /> Bulk Update
            </span>
          </div>

          <div className="ap-field" style={{ marginBottom: 14 }}>
            <label>Roll Numbers <span style={{ color: '#7286a3', fontWeight: 600 }}>(comma separated)</span></label>
            <textarea
              className={error && parsed.length === 0 ? 'ap-field-error' : ''}
              placeholder="AI-24-001, WD-24-015, PY-24-032"
              value={rolls}
              onChange={(e) => setRolls(e.target.value)}
            />
            <span className="ap-hint">Example: AI-24-001, WD-24-015, PY-24-032 · {parsed.length} detected</span>
          </div>

          <div className="ap-field" style={{ marginBottom: 14 }}>
            <label>New Status</label>
            <select className={error && !status ? 'ap-field-error' : ''} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select new status…</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="ap-field" style={{ marginBottom: 14 }}>
            <label>Message <span style={{ color: '#7286a3', fontWeight: 600 }}>(optional)</span></label>
            <textarea
              style={{ minHeight: 70 }}
              maxLength={200}
              placeholder="Enter message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <span className="ap-hint" style={{ alignSelf: 'flex-end' }}>{message.length}/200</span>
          </div>

          {error && <div className="ap-hint err" style={{ marginBottom: 12 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>
              <CheckCircle2 size={15} /> Update Students
            </button>
            <button className="btn-ghost" style={{ flex: '0 0 auto' }} onClick={reset}>
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>

        {/* History */}
        <div className="acard" style={{ padding: 0 }}>
          <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={16} color="#0A3D91" /> Update History
            </span>
            <span style={{ fontSize: 12, color: '#7286a3' }}>{history.length} records</span>
          </div>

          <div className="admin-scroll-x">
            <div className="atable" style={{ minWidth: 680 }}>
              <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
                <span>Date</span><span>Roll Numbers</span><span>New Status</span><span>Updated By</span><span>Message</span>
              </div>
              {history.map((h, i) => (
                <div className="atable-row" key={i} style={{ gridTemplateColumns: GRID }}>
                  <span className="atable-cell">{h.date}</span>
                  <span className="atable-cell-strong" style={{ fontSize: 12 }}>{h.rolls}</span>
                  <span className={`badge ${STATUS_BADGE[h.status] || 'badge-grey'}`}>{h.status}</span>
                  <span className="atable-cell">{h.by}</span>
                  <span className="atable-cell">{h.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}
