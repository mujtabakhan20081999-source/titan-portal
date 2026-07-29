import { useEffect, useState } from 'react';
import { ShieldCheck, Users, Save, CheckCircle2 } from 'lucide-react';

import { getRolePermissions, updateRolePermissions } from '../../services/adminService';
import '../../styles/admin.css';
import '../../styles/admin-pages.css';

const MODULES = ['Dashboard', 'Students', 'Attendance', 'Slots', 'Trainers', 'Updation', 'Reports', 'Settings', 'Audit Logs'];
const ALL_PERMS = ['read', 'write', 'update', 'export'];
const PERM_LABEL = { read: 'Read', write: 'Write', update: 'Update', export: 'Export' };

// Each role starts with a preset permission map: module -> array of perms
const INITIAL_ROLES = {
  'Super Admin': Object.fromEntries(MODULES.map((m) => [m, [...ALL_PERMS]])),
  'Sub Admin': Object.fromEntries(MODULES.map((m) => [m, m === 'Settings' || m === 'Audit Logs' ? ['read'] : ['read', 'write', 'update']])),
  'Trainer': Object.fromEntries(MODULES.map((m) => [m, ['Dashboard', 'Attendance', 'Students'].includes(m) ? ['read', 'write'] : ['read']])),
  'Student': Object.fromEntries(MODULES.map((m) => [m, ['Dashboard'].includes(m) ? ['read'] : []])),
};

const ROLE_KEYS = {
  'Super Admin': 'superadmin',
  'Sub Admin': 'subadmin',
  Trainer: 'trainer',
  Student: 'student',
};

const ROLE_META = {
  'Super Admin': { color: '#0A3D91', bg: '#dbeafe', desc: 'Full unrestricted access' },
  'Sub Admin': { color: '#7c3aed', bg: '#ede9fe', desc: 'Campus-level management' },
  'Trainer': { color: '#16a34a', bg: '#dcfce7', desc: 'Teaching & attendance' },
  'Student': { color: '#d97706', bg: '#fef3c7', desc: 'Portal read access' },
};

export default function AdminPermissions() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [activeRole, setActiveRole] = useState('Super Admin');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPermissions() {
      setLoading(true);
      setError('');
      try {
        const data = await getRolePermissions();
        const mapped = Object.fromEntries(
          Object.entries(ROLE_KEYS).map(([display, backendKey]) => [display, data[backendKey] || INITIAL_ROLES[display]])
        );
        setRoles(mapped);
      } catch (loadError) {
        console.error(loadError);
        setError('Unable to load role permissions. Please refresh.');
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, []);

  const toggle = (module, perm) => {
    setRoles((prev) => {
      const current = prev[activeRole][module];
      const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
      return { ...prev, [activeRole]: { ...prev[activeRole], [module]: next } };
    });
  };

  const setAllForModule = (module, on) => {
    setRoles((prev) => ({ ...prev, [activeRole]: { ...prev[activeRole], [module]: on ? [...ALL_PERMS] : [] } }));
  };

  const save = async () => {
    setError('');
    try {
      const payload = Object.fromEntries(
        Object.entries(roles).map(([displayName, perms]) => [ROLE_KEYS[displayName], perms])
      );
      await updateRolePermissions(payload);
      setToast(`Permissions saved for ${activeRole}.`);
      setTimeout(() => setToast(''), 2200);
    } catch (saveError) {
      console.error(saveError);
      setError('Failed to save permissions. Try again.');
    }
  };

  const GRID = '1.4fr 1fr 1fr 1fr 1fr 92px';
  const grants = roles[activeRole];
  const totalGranted = Object.values(grants).reduce((a, p) => a + p.length, 0);

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Permissions</h2>
          <p>Manage role permissions</p>
          {error && <div className="ap-error" style={{ marginTop: 8 }}>{error}</div>}
        </div>
        <button className="btn-primary" onClick={save} disabled={loading}><Save size={15} /> Save Changes</button>
      </div>

      {loading ? (
        <div className="ap-page" style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#415165', fontWeight: 700 }}>
          Loading permissions...
        </div>
      ) : (
        <div className="ap-2col-b">
          {/* Roles list */}
          <div className="acard">
          <div className="acard-head" style={{ marginBottom: 14 }}>
            <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} color="#0A3D91" /> Roles
            </span>
          </div>
          <div className="ap-list">
            {Object.keys(roles).map((role) => {
              const meta = ROLE_META[role];
              const active = role === activeRole;
              return (
                <button
                  key={role}
                  className="ap-item"
                  style={{
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                    borderColor: active ? meta.color : '#eef2f9',
                    background: active ? `${meta.bg}` : '#fbfcff',
                    boxShadow: active ? `inset 3px 0 0 ${meta.color}` : 'none',
                  }}
                  onClick={() => setActiveRole(role)}
                >
                  <div className="ap-item-ic" style={{ background: meta.bg }}><ShieldCheck size={19} color={meta.color} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ap-item-title">{role}</div>
                    <div className="ap-item-sub">{meta.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix */}
        <div className="acard" style={{ padding: 0 }}>
          <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0 }}>
            <div>
              <span className="acard-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: ROLE_META[activeRole].color }} />
                {activeRole} — Permissions
              </span>
              <div style={{ fontSize: 12, color: '#7286a3', marginTop: 3 }}>Tap a permission to grant or revoke. {totalGranted} grants active.</div>
            </div>
          </div>

          <div className="admin-scroll-x">
            <div className="atable" style={{ minWidth: 640 }}>
              <div className="atable-head" style={{ gridTemplateColumns: GRID }}>
                <span>Module</span>
                {ALL_PERMS.map((p) => <span key={p}>{PERM_LABEL[p]}</span>)}
                <span>All</span>
              </div>
              {MODULES.map((m) => {
                const granted = grants[m];
                const allOn = granted.length === ALL_PERMS.length;
                return (
                  <div className="atable-row" key={m} style={{ gridTemplateColumns: GRID }}>
                    <span className="atable-cell-strong">{m}</span>
                    {ALL_PERMS.map((perm) => {
                      const on = granted.includes(perm);
                      return (
                        <span key={perm} className={`perm-chip ${on ? perm : 'off'}`} onClick={() => toggle(m, perm)} role="button" tabIndex={0}>
                          {on ? PERM_LABEL[perm] : '—'}
                        </span>
                      );
                    })}
                    <label className="ap-toggle">
                      <input type="checkbox" checked={allOn} onChange={(e) => setAllForModule(m, e.target.checked)} />
                      <span className="ap-toggle-slider" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}
