import { useEffect, useMemo, useState } from 'react';
import { changePassword, getMe } from '../../services/authService';
import '../../styles/admin.css';

export default function AdminProfile({ admin }) {
  const [profile, setProfile] = useState(admin || null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const me = await getMe();
        if (mounted) setProfile(me);
      } catch {
        if (mounted) setProfile(admin || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [admin]);

  const permissionList = useMemo(() => {
    const perms = profile?.permissions || {};
    return Object.entries(perms).map(([module, actions]) => ({
      module,
      actions: Array.isArray(actions) ? actions : [],
    }));
  }, [profile]);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (!form.currentPassword || !form.newPassword) {
      setErr('Fill both password fields.');
      return;
    }
    if (form.newPassword !== form.confirm) {
      setErr('New password and confirm do not match.');
      return;
    }
    try {
      const result = await changePassword(form.currentPassword, form.newPassword);
      setMsg(result.message || 'Password changed.');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Unable to change password');
    }
  };

  if (loading) {
    return <div className="ap-page"><div className="acard" style={{ padding: 20 }}>Loading profile…</div></div>;
  }

  return (
    <div className="ap-page">
      <div className="ap-head">
        <div>
          <h2>Profile</h2>
          <p>Your account details, role permissions and password.</p>
        </div>
      </div>

      <div className="ap-2col-a">
        <div className="acard" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Account</h3>
          <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
            <div><b>Name:</b> {profile?.fullName || '—'}</div>
            <div><b>Email:</b> {profile?.email || '—'}</div>
            <div><b>Role:</b> {profile?.role || '—'}</div>
            <div><b>Campus:</b> {profile?.campus || 'All campuses'}</div>
            <div><b>Status:</b> {profile?.status || 'Active'}</div>
          </div>
        </div>

        <div className="acard" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          {msg && <div className="ap-hint ok">{msg}</div>}
          {err && <div className="ap-hint err">{err}</div>}
          <form onSubmit={onChangePassword} style={{ display: 'grid', gap: 10 }}>
            <input type="password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} />
            <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} />
            <input type="password" placeholder="Confirm new password" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} />
            <button className="btn-primary" type="submit">Update Password</button>
          </form>
        </div>
      </div>

      <div className="acard" style={{ padding: 20, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>My Permissions</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {permissionList.length === 0 ? (
            <div style={{ color: '#64748b' }}>No permissions loaded.</div>
          ) : permissionList.map((p) => (
            <div key={p.module} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #eef2f7', padding: '8px 0' }}>
              <b>{p.module}</b>
              <span style={{ color: '#475569' }}>{p.actions.length ? p.actions.join(', ') : 'none'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
