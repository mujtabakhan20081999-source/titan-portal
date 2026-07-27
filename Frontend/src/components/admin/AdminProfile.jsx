import { useState } from 'react';
import { KeyRound, Mail, MapPin, CalendarDays, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const PERMISSIONS = [
  { module: 'Dashboard', perms: ['read'] },
  { module: 'Students', perms: ['read', 'write', 'update', 'export'] },
  { module: 'Attendance (View)', perms: ['read', 'export'] },
  { module: 'Attendance (Mark)', perms: ['read', 'write'] },
  { module: 'Attendance (Multi)', perms: ['read', 'write'] },
  { module: 'Slots', perms: ['read', 'write', 'update'] },
  { module: 'Trainers', perms: ['read', 'write', 'update', 'export'] },
  { module: 'Trainer Attendance', perms: ['read', 'write'] },
  { module: 'Updation', perms: ['read', 'write'] },
  { module: 'Reports', perms: ['read', 'export'] },
];

const ALL_PERMS = ['read', 'write', 'update', 'export'];
const PERM_LABEL = { read: 'Read', write: 'Write', update: 'Update', export: 'Export' };

export default function AdminProfile({ admin }) {
  const roleLabel = admin?.role === 'subadmin' ? 'Sub Admin' : 'Super Admin';
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdErr, setPwdErr] = useState('');
  const [toast, setToast] = useState('');

  const savePwd = () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) { setPwdErr('All fields are required.'); return; }
    if (pwd.next.length < 6) { setPwdErr('New password must be at least 6 characters.'); return; }
    if (pwd.next !== pwd.confirm) { setPwdErr('New passwords do not match.'); return; }
    setPwdErr('');
    setShowPwd(false);
    setPwd({ current: '', next: '', confirm: '' });
    setToast('Password changed successfully.');
    setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>My Profile</h2>
          <p>View your profile and permissions</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowPwd(true); setPwdErr(''); }}>
          <KeyRound size={15} /> Change Password
        </button>
      </div>

      <div className="ap-2col-b">
        {/* Profile card */}
        <div className="acard">
          <div className="aprofile-card">
            <div className="aprofile-av">{roleLabel.split(' ').map((w) => w[0]).join('')}</div>
            <div className="aprofile-name">{roleLabel}</div>
            <span className="badge badge-blue" style={{ marginTop: 2 }}>{roleLabel}</span>
          </div>

          <div className="ap-list" style={{ marginTop: 20 }}>
            <div className="aprofile-meta-row"><Mail size={15} color="#2563eb" /> superadmin@titan.com</div>
            <div className="aprofile-meta-row"><MapPin size={15} color="#0891b2" /> All Cities, All Campuses</div>
            <div className="aprofile-meta-row"><CalendarDays size={15} color="#7c3aed" /> Member Since 01 Jan, 2024</div>
            <div className="aprofile-meta-row"><ShieldCheck size={15} color="#16a34a" /> Full system access</div>
          </div>
        </div>

        {/* Permissions */}
        <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#0A3D91" /> My Permissions
            </span>
            <span style={{ fontSize: 12, color: '#7286a3' }}>Read-only — set by role</span>
          </div>

          <div className="perm-grid">
            {PERMISSIONS.map((p) => (
              <div className="perm-card" key={p.module}>
                <div className="perm-card-title">{p.module}</div>
                <div className="perm-chips">
                  {ALL_PERMS.map((perm) => {
                    const on = p.perms.includes(perm);
                    return (
                      <span key={perm} className={`perm-chip ${on ? perm : 'off'}`}>{PERM_LABEL[perm]}</span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change password modal */}
      {showPwd && (
        <div className="ap-modal-backdrop" onClick={() => setShowPwd(false)}>
          <div className="ap-modal" style={{ width: 'min(460px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-head">
              <span className="ap-modal-title">Change Password</span>
              <button className="ap-modal-close" onClick={() => setShowPwd(false)}><X size={20} /></button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-field">
                <label>Current Password</label>
                <input type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="ap-field">
                <label>New Password</label>
                <input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} placeholder="At least 6 characters" />
              </div>
              <div className="ap-field">
                <label>Confirm New Password</label>
                <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} placeholder="Re-enter new password" />
              </div>
              {pwdErr && <div className="ap-hint err">{pwdErr}</div>}
            </div>
            <div className="ap-modal-actions">
              <button className="btn-ghost" onClick={() => setShowPwd(false)}>Cancel</button>
              <button className="btn-primary" onClick={savePwd}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}
