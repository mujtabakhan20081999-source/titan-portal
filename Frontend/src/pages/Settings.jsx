import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import '../styles/settings.css';

const icons = {
  profile:       '👤',
  appearance:    '🎨',
  notifications: '🔔',
  privacy:       '🔒',
  account:       '🔑',
};

const navItems = [
  { key: 'appearance',    label: 'Appearance',    emoji: '🎨', color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'notifications', label: 'Notifications', emoji: '🔔', color: '#f59e0b', bg: '#fffbeb' },
];

const themes = [
  {
    key: 'light',
    label: 'Light',
    preview: { bar: '#10375C', sidebar: '#10375C', content: '#F4F6FF', bg: '#ffffff' },
  },
  {
    key: 'dark',
    label: 'Dark',
    preview: { bar: '#1e293b', sidebar: '#0f172a', content: '#1e293b', bg: '#0f172a' },
  },
  {
    key: 'ocean',
    label: 'Ocean',
    preview: { bar: '#0891b2', sidebar: '#0c4a6e', content: '#ecfeff', bg: '#f0fdfe' },
  },
  {
    key: 'purple',
    label: 'Purple',
    preview: { bar: '#7c3aed', sidebar: '#4c1d95', content: '#faf5ff', bg: '#f5f3ff' },
  },
];

const accentColors = [
  { color: '#1150c0', name: 'Royal Blue' },
  { color: '#7c3aed', name: 'Violet' },
  { color: '#0891b2', name: 'Cyan' },
  { color: '#059669', name: 'Emerald' },
  { color: '#dc2626', name: 'Red' },
  { color: '#d97706', name: 'Amber' },
  { color: '#db2777', name: 'Pink' },
  { color: '#0d9488', name: 'Teal' },
];

const avatarColors = ['#1150c0','#7c3aed','#059669','#dc2626','#d97706','#0891b2','#db2777','#374151'];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function SaveBtn({ onClick, saved }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
      <button className={`settings-save-btn${saved ? ' saved' : ''}`} onClick={onClick}>
        {saved ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Saved!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}

function SectionCard({ emoji, color, bg, title, desc, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-header-icon" style={{ background: bg, color }}>
          {emoji}
        </div>
        <div>
          <h3>{title}</h3>
          {desc && <p>{desc}</p>}
        </div>
      </div>
      <div className="settings-card-body">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <span>{label}</span>
        {desc && <span>{desc}</span>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function ProfileSection({ role, userName, userEmail }) {
  const [saved, setSaved] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#1150c0');
  const [form, setForm] = useState({
    firstName: userName?.split(' ')[0] || '',
    lastName:  userName?.split(' ').slice(1).join(' ') || '',
    email:     userEmail || '',
    phone:     '',
    bio:       '',
    city:      'Sukkur',
    gender:    'male',
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      firstName: userName?.split(' ')[0] || '',
      lastName: userName?.split(' ').slice(1).join(' ') || '',
      email: userEmail || prev.email,
    }));
  }, [userName, userEmail]);

  const initials = [form.firstName[0], form.lastName[0]].filter(Boolean).join('').toUpperCase() || 'U';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-card">

      <div className="profile-avatar-section">
        <div className="profile-avatar-big" style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}99)` }}>
          {initials}
        </div>
        <div className="profile-avatar-info">
          <h4>{form.firstName} {form.lastName}</h4>
          <p>{role === 'teacher' ? 'Trainer · TITAN Learning' : 'Student · TITAN Learning'}</p>
          <div className="avatar-color-picker">
            {avatarColors.map(c => (
              <button
                key={c}
                className={`avatar-color-dot${avatarColor === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setAvatarColor(c)}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="settings-card-body">
        <div className="settings-form-grid">
          <div className="settings-field">
            <label>First Name</label>
            <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
          </div>
          <div className="settings-field">
            <label>Last Name</label>
            <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
          </div>
          <div className="settings-field">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
          </div>
          <div className="settings-field">
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+92 3XX XXXXXXX" />
          </div>
          <div className="settings-field">
            <label>City</label>
            <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
          </div>
          <div className="settings-field">
            <label>Gender</label>
            <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="settings-field full-width">
            <label>Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Write a short bio about yourself…" />
          </div>
        </div>
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function AppearanceSection({ theme, setTheme }) {
  const [accent, setAccent]     = useState('#1150c0');
  const [fontSize, setFontSize] = useState('normal');
  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    document.documentElement.style.setProperty('--primary', accent);
    document.documentElement.style.setProperty('--primary-strong', accent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>

      <SectionCard emoji="🖥️" color="#8b5cf6" bg="#f5f3ff" title="Theme" desc="Choose how the dashboard looks">
        <div className="theme-grid">
          {themes.map(t => (
            <button
              key={t.key}
              className={`theme-card${theme === t.key ? ' selected' : ''}`}
              onClick={() => {
                setTheme(t.key);
                document.body.className = t.key === 'light' ? '' : `theme-${t.key}`;
                localStorage.setItem('titan-theme', t.key);
              }}
            >
              <div className="theme-preview" style={{ background: t.preview.bg }}>
                <div className="theme-preview-bar" style={{ background: t.preview.bar }} />
                <div className="theme-preview-row">
                  <div className="theme-preview-sidebar" style={{ background: t.preview.sidebar }} />
                  <div className="theme-preview-content" style={{ background: t.preview.content }} />
                </div>
              </div>
              {theme === t.key && <div className="theme-check">✓</div>}
              <div className="theme-label">{t.label}</div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard emoji="🎨" color="#ec4899" bg="#fdf2f8" title="Accent Color" desc="Pick your dashboard highlight color">
        <div className="accent-grid">
          {accentColors.map(a => (
            <button
              key={a.color}
              className={`accent-dot${accent === a.color ? ' selected' : ''}`}
              style={{ background: a.color, color: a.color }}
              title={a.name}
              onClick={() => setAccent(a.color)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard emoji="🔡" color="#0891b2" bg="#ecfeff" title="Font Size" desc="Adjust text size across the dashboard">
        <div className="font-size-options">
          {[
            { key: 'compact',  label: 'Compact',  sample: 'Aa', size: '85%' },
            { key: 'normal',   label: 'Normal',   sample: 'Aa', size: '100%' },
            { key: 'large',    label: 'Large',    sample: 'Aa', size: '115%' },
          ].map(f => (
            <button
              key={f.key}
              className={`font-size-btn${fontSize === f.key ? ' selected' : ''}`}
              onClick={() => {
                setFontSize(f.key);
                document.documentElement.style.fontSize = f.size;
              }}
            >
              <span className="font-size-sample" style={{ fontSize: f.key === 'compact' ? 16 : f.key === 'large' ? 24 : 20 }}>
                {f.sample}
              </span>
              <span className="font-size-label">{f.label}</span>
            </button>
          ))}
        </div>
        <SaveBtn onClick={handleSave} saved={saved} />
      </SectionCard>
    </>
  );
}

function NotificationsSection() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    assignments:  true,
    quizAlerts:   true,
    attendance:   true,
    courseUpdate: true,
    gradeRelease: false,
    reminders:    true,
    emailDigest:  false,
    smsAlerts:    false,
  });

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const rows = [
    { key: 'assignments',  label: 'Assignment Reminders',  desc: 'Get notified before assignment deadlines' },
    { key: 'quizAlerts',   label: 'Quiz Alerts',           desc: 'Alerts for upcoming quizzes and results' },
    { key: 'attendance',   label: 'Attendance Updates',    desc: 'Daily attendance marking notifications' },
    { key: 'courseUpdate', label: 'Course Announcements',  desc: 'New lessons, resources, and updates' },
    { key: 'gradeRelease', label: 'Grade Releases',        desc: 'When your marks are published' },
    { key: 'reminders',    label: 'Event Reminders',       desc: 'Calendar events and class schedules' },
    { key: 'emailDigest',  label: 'Weekly Email Digest',   desc: 'Summary of weekly activity via email' },
    { key: 'smsAlerts',    label: 'SMS Alerts',            desc: 'Critical alerts sent via SMS' },
  ];

  return (
    <SectionCard emoji="🔔" color="#f59e0b" bg="#fffbeb" title="Notification Preferences" desc="Control what alerts you receive">
      {rows.map((r, i) => (
        <div key={r.key}>
          <ToggleRow label={r.label} desc={r.desc} checked={prefs[r.key]} onChange={() => toggle(r.key)} />
          {i < rows.length - 1 && <div className="settings-divider" style={{ margin: '4px 0' }} />}
        </div>
      ))}
      <SaveBtn onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function PrivacySection() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    showProfile:    true,
    showAttendance: false,
    showScores:     false,
    showCourses:    true,
    twoFactor:      false,
    loginAlerts:    true,
    dataSharing:    false,
  });

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const rows = [
    { key: 'showProfile',    label: 'Public Profile',          desc: 'Allow others to view your profile' },
    { key: 'showAttendance', label: 'Share Attendance Stats',  desc: 'Visible to course instructors only' },
    { key: 'showScores',     label: 'Share Quiz Scores',       desc: 'Show scores on class leaderboard' },
    { key: 'showCourses',    label: 'Show Enrolled Courses',   desc: 'Others can see your course list' },
    { key: 'twoFactor',      label: 'Two-Factor Authentication', desc: 'Extra security on login (recommended)' },
    { key: 'loginAlerts',    label: 'Login Activity Alerts',   desc: 'Email alert on new device login' },
    { key: 'dataSharing',    label: 'Analytics Data Sharing',  desc: 'Help improve TITAN with usage data' },
  ];

  return (
    <SectionCard emoji="🔒" color="#10b981" bg="#ecfdf5" title="Privacy & Security" desc="Manage your data and security settings">
      {rows.map((r, i) => (
        <div key={r.key}>
          <ToggleRow label={r.label} desc={r.desc} checked={prefs[r.key]} onChange={() => toggle(r.key)} />
          {i < rows.length - 1 && <div className="settings-divider" style={{ margin: '4px 0' }} />}
        </div>
      ))}
      <SaveBtn onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function AccountSection({ onLogout }) {
  const [saved, setSaved]       = useState(false);
  const [showPass, setShowPass] = useState({ cur: false, new: false, con: false });
  const [pass, setPass]         = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');

  const handleSave = () => {
    if (!pass.current) { setPassError('Enter your current password.'); return; }
    if (pass.newPass.length < 8) { setPassError('New password must be at least 8 characters.'); return; }
    if (pass.newPass !== pass.confirm) { setPassError('Passwords do not match.'); return; }
    setPassError('');
    setPass({ current: '', newPass: '', confirm: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const EyeBtn = ({ field }) => (
    <button type="button"
      onClick={() => setShowPass(p => ({ ...p, [field]: !p[field] }))}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}>
      {showPass[field]
        ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <>

      <SectionCard emoji="🔑" color="#ef4444" bg="#fef2f2" title="Change Password" desc="Update your login password">
        {passError && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10,
            padding: '10px 14px', fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
            ⚠️ {passError}
          </div>
        )}
        <div className="settings-form-grid">
          {[
            { label: 'Current Password',  field: 'current', key: 'cur'  },
            { label: 'New Password',      field: 'newPass', key: 'new'  },
            { label: 'Confirm Password',  field: 'confirm', key: 'con'  },
          ].map(({ label, field, key }) => (
            <div key={field} className="settings-field full-width">
              <label>{label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass[key] ? 'text' : 'password'}
                  value={pass[field]}
                  onChange={e => { setPassError(''); setPass(p => ({ ...p, [field]: e.target.value })); }}
                  placeholder="••••••••"
                  style={{ paddingRight: 40 }}
                />
                <EyeBtn field={key} />
              </div>
            </div>
          ))}
        </div>
        <SaveBtn onClick={handleSave} saved={saved} />
      </SectionCard>

      <SectionCard emoji="⚙️" color="#6b7280" bg="#f3f4f6" title="Session & Account" desc="Manage your active sessions">
        <div className="danger-zone">
          <div className="danger-zone-label">
            <span>Sign Out of All Devices</span>
            <span>Logs you out from all browsers and devices</span>
          </div>
          <button className="danger-btn">Sign Out All</button>
        </div>
        <div className="danger-zone">
          <div className="danger-zone-label">
            <span>Delete Account</span>
            <span>Permanently removes your data — cannot be undone</span>
          </div>
          <button className="danger-btn">Delete</button>
        </div>
      </SectionCard>
    </>
  );
}

function Settings({ role = 'student', userName = 'User', userEmail = '', onLogout }) {
  const [activeSection, setActiveSection] = useState('appearance');
  const [theme, setTheme]                 = useState(() => localStorage.getItem('titan-theme') || 'light');
  const [toast, setToast]                 = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('titan-theme') || 'light';
    document.body.className = saved === 'light' ? '' : `theme-${saved}`;
    setTheme(saved);
  }, []);

  const pageTitle = role === 'teacher' ? 'Teacher Settings' : 'Student Settings';
  const pageSub   = 'Manage your profile, appearance, notifications and security.';

  return (
    <div className="settings-page">
      <TopBar
        userName={userName}
        userRole={role === 'teacher' ? 'Trainer' : 'Student'}
        pageTitle={pageTitle}
        pageSubtitle={pageSub}
      />

      <div className="settings-body">

        <nav className="settings-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`settings-nav-item${activeSection === item.key ? ' active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="settings-nav-icon">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="settings-content" key={activeSection}>
          {activeSection === 'appearance' && (
            <AppearanceSection theme={theme} setTheme={setTheme} />
          )}

          {activeSection === 'notifications' && (
            <NotificationsSection />
          )}
        </div>
      </div>

      {toast && (
        <div className="settings-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}

export default Settings;
