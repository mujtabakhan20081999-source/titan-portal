import { useState } from 'react';
import {
  Mail, MapPin, ShieldCheck, KeyRound, LogOut, LayoutDashboard, Users,
  CalendarCheck, Layers, GraduationCap, RefreshCw, CheckCircle2,
} from 'lucide-react';

import { SUBADMIN_PERMISSIONS } from './subAdminData';

import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const MODULE_ICONS = {
  Dashboard: LayoutDashboard, Students: Users, Attendance: CalendarCheck,
  Slots: Layers, Trainers: GraduationCap, Updation: RefreshCw,
};
const ALL_ACTIONS = { Attendance: ['read', 'mark', 'multi'], default: ['read', 'write', 'update', 'export'] };
const CHIP_CLASS = { read: 'read', write: 'write', update: 'update', export: 'export', mark: 'write', multi: 'update' };

function SubAdminProfile({ city, onLogout }) {
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');
  const [toast, setToast] = useState('');
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const changePassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) { setPwErr('Please fill all three fields.'); return; }
    if (pw.current !== 'SubAdmin@2026') { setPwErr('Current password is incorrect.'); return; }
    if (pw.next.length < 8) { setPwErr('New password must be at least 8 characters.'); return; }
    if (pw.next !== pw.confirm) { setPwErr('New passwords do not match.'); return; }
    setPwErr(''); setPw({ current: '', next: '', confirm: '' });
    say('Password changed successfully.');
  };

  return (
    <div className="ap-page">
      <div className="ap-2col-b">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="acard aprofile-card">
            <div className="aprofile-av">SA</div>
            <div className="aprofile-name">Campus Manager</div>
            <div className="aprofile-meta-row"><Mail size={14} /> subadmin@titan.edu</div>
            <div className="aprofile-meta-row"><MapPin size={14} /> {city} · {city} Campus</div>
            <span className="badge badge-blue" style={{ marginTop: 8 }}>Sub Admin</span>
            <button className="btn-ghost" style={{ marginTop: 14, width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fecaca' }} onClick={onLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>

          <div className="acard">
            <div className="acard-head" style={{ marginBottom: 12 }}>
              <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <KeyRound size={16} color="#0A3D91" /> Change Password
              </span>
            </div>
            {pwErr && <div className="ap-hint err" style={{ marginBottom: 10 }}>{pwErr}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ap-field"><label>Current Password</label><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
              <div className="ap-field"><label>New Password</label><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
              <div className="ap-field"><label>Confirm New Password</label><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
              <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={changePassword}>Update Password</button>
            </div>
          </div>
        </div>

        <div className="acard">
          <div className="acard-head">
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={17} color="#0A3D91" /> My Permissions
            </span>
            <span style={{ fontSize: 12, color: '#7286a3' }}>Scope: {city} Campus only</span>
          </div>
          <div className="perm-grid">
            {Object.entries(SUBADMIN_PERMISSIONS).map(([module, actions]) => {
              const Icon = MODULE_ICONS[module] || ShieldCheck;
              const all = ALL_ACTIONS[module] || ALL_ACTIONS.default;
              return (
                <div className="perm-card" key={module}>
                  <div className="perm-card-title"><Icon size={16} color="#0A3D91" /> {module}</div>
                  <div className="perm-chips">
                    {all.map((a) => (
                      <span key={a} className={`perm-chip ${actions.includes(a) ? CHIP_CLASS[a] || 'read' : 'off'}`}>
                        {a.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ap-hint" style={{ marginTop: 14 }}>
            Greyed-out actions are not allowed for your account. Permissions are set by the Super Admin and also checked on the server.
          </div>
        </div>
      </div>

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default SubAdminProfile;
