import { useEffect, useState } from 'react';
import {
  Settings2, Mail, MessageSquare, CreditCard, DatabaseBackup,
  ChevronRight, X, CheckCircle2,
} from 'lucide-react';
import { getSettings, updateSettings, triggerBackup } from '../../services/adminService';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const SECTIONS = [
  { key: 'general', title: 'General Settings', desc: 'Manage general system settings', Icon: Settings2, bg: '#dbeafe', color: '#2563eb' },
  { key: 'email', title: 'Email Settings', desc: 'Configure email server preferences', Icon: Mail, bg: '#dcfce7', color: '#16a34a' },
  { key: 'sms', title: 'SMS Settings', desc: 'Configure SMS gateway preferences', Icon: MessageSquare, bg: '#ede9fe', color: '#7c3aed' },
  { key: 'payment', title: 'Payment Settings', desc: 'Manage payment methods and fees', Icon: CreditCard, bg: '#fef3c7', color: '#d97706' },
  { key: 'backup', title: 'Backup Settings', desc: 'Manage backup and restore points', Icon: DatabaseBackup, bg: '#e0f2fe', color: '#0891b2' },
];

const DEFAULTS = {
  general: { systemName: 'TITAN SMS', timezone: 'Asia/Karachi', maintenance: false, registration: true },
  email: { host: '', port: '587', fromEmail: '', enabled: false },
  sms: { provider: 'Twilio', senderId: 'TITAN', enabled: false },
  payment: { currency: 'PKR (Rs)', lateFee: '500', onlinePayments: true },
  backup: { frequency: 'Daily', retention: '30', autoBackup: true },
};

function Toggle({ checked, onChange }) {
  return (
    <label className="ap-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ap-toggle-slider" />
    </label>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '4px 0' }}>
      <span style={{ fontSize: 13, color: '#10375C', fontWeight: 700 }}>{label}</span>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const [open, setOpen] = useState(null);
  const [data, setData] = useState(DEFAULTS);
  const [draft, setDraft] = useState(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((doc) => {
        setData({
          general: { ...DEFAULTS.general, ...(doc.general || {}) },
          email: { ...DEFAULTS.email, ...(doc.email || {}) },
          sms: { ...DEFAULTS.sms, ...(doc.sms || {}) },
          payment: { ...DEFAULTS.payment, ...(doc.payment || {}) },
          backup: { ...DEFAULTS.backup, ...(doc.backup || {}) },
        });
      })
      .catch(() => {});
  }, []);

  const openSection = (key) => { setDraft({ ...data[key] }); setOpen(key); };
  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings({ section: open, data: draft });
      setData({
        general: { ...DEFAULTS.general, ...(updated.general || {}) },
        email: { ...DEFAULTS.email, ...(updated.email || {}) },
        sms: { ...DEFAULTS.sms, ...(updated.sms || {}) },
        payment: { ...DEFAULTS.payment, ...(updated.payment || {}) },
        backup: { ...DEFAULTS.backup, ...(updated.backup || {}) },
      });
      setOpen(null);
      setToast(`${SECTIONS.find((s) => s.key === open)?.title} saved.`);
      setTimeout(() => setToast(''), 2200);
    } catch (err) {
      setToast(err?.response?.data?.message || 'Failed to save settings.');
      setTimeout(() => setToast(''), 2200);
    } finally {
      setSaving(false);
    }
  };

  const runBackup = async () => {
    try {
      await triggerBackup();
      setToast('Backup recorded on server.');
      setTimeout(() => setToast(''), 2200);
    } catch {
      setToast('Backup failed.');
      setTimeout(() => setToast(''), 2200);
    }
  };

  const renderFields = () => {
    if (!open) return null;
    const d = draft;
    switch (open) {
      case 'general':
        return (
          <>
            <div className="ap-field"><label>System Name</label><input value={d.systemName} onChange={(e) => set('systemName', e.target.value)} /></div>
            <div className="ap-field"><label>Timezone</label>
              <select value={d.timezone} onChange={(e) => set('timezone', e.target.value)}>
                <option>Asia/Karachi</option><option>Asia/Dubai</option><option>UTC</option>
              </select>
            </div>
            <Row label="Maintenance Mode"><Toggle checked={!!d.maintenance} onChange={(v) => set('maintenance', v)} /></Row>
            <Row label="Open Registration"><Toggle checked={!!d.registration} onChange={(v) => set('registration', v)} /></Row>
          </>
        );
      case 'email':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="ap-field"><label>SMTP Host</label><input value={d.host || ''} onChange={(e) => set('host', e.target.value)} /></div>
              <div className="ap-field"><label>Port</label><input value={d.port || ''} onChange={(e) => set('port', e.target.value)} /></div>
            </div>
            <div className="ap-field"><label>From Email</label><input value={d.fromEmail || ''} onChange={(e) => set('fromEmail', e.target.value)} /></div>
            <Row label="Enable Email Notifications"><Toggle checked={!!d.enabled} onChange={(v) => set('enabled', v)} /></Row>
          </>
        );
      case 'sms':
        return (
          <>
            <div className="ap-field"><label>SMS Provider</label>
              <select value={d.provider} onChange={(e) => set('provider', e.target.value)}><option>Twilio</option><option>Jazz</option><option>Telenor</option></select>
            </div>
            <div className="ap-field"><label>Sender ID</label><input value={d.senderId || ''} onChange={(e) => set('senderId', e.target.value)} /></div>
            <Row label="Enable SMS Notifications"><Toggle checked={!!d.enabled} onChange={(v) => set('enabled', v)} /></Row>
          </>
        );
      case 'payment':
        return (
          <>
            <div className="ap-field"><label>Currency</label>
              <select value={d.currency} onChange={(e) => set('currency', e.target.value)}><option>PKR (Rs)</option><option>USD ($)</option><option>AED</option></select>
            </div>
            <div className="ap-field"><label>Late Fee (per day)</label><input type="number" value={d.lateFee} onChange={(e) => set('lateFee', e.target.value)} /></div>
            <Row label="Accept Online Payments"><Toggle checked={!!d.onlinePayments} onChange={(v) => set('onlinePayments', v)} /></Row>
          </>
        );
      case 'backup':
        return (
          <>
            <div className="ap-field"><label>Backup Frequency</label>
              <select value={d.frequency} onChange={(e) => set('frequency', e.target.value)}><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
            </div>
            <div className="ap-field"><label>Retention (days)</label><input type="number" value={d.retention} onChange={(e) => set('retention', e.target.value)} /></div>
            <Row label="Automatic Backup"><Toggle checked={!!d.autoBackup} onChange={(v) => set('autoBackup', v)} /></Row>
            <button type="button" className="btn-ghost" onClick={runBackup}>Run Backup Now</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Settings</h2>
          <p>System configuration settings</p>
        </div>
      </div>

      <div className="acard">
        <div className="ap-list">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" className="ap-item" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', background: '#fbfcff' }} onClick={() => openSection(s.key)}>
              <div className="ap-item-ic" style={{ background: s.bg }}><s.Icon size={20} color={s.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ap-item-title">{s.title}</div>
                <div className="ap-item-sub">{s.desc}</div>
              </div>
              <span className="btn-ghost" style={{ padding: '7px 12px', pointerEvents: 'none' }}>Manage <ChevronRight size={14} /></span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="ap-modal-backdrop" onClick={() => setOpen(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">{SECTIONS.find((s) => s.key === open)?.title}</span>
              <button type="button" className="ap-modal-close" onClick={() => setOpen(null)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body">{renderFields()}</div>
            <div className="ap-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setOpen(null)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}
