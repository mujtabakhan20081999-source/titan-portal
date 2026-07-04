import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldCheck,
} from 'lucide-react';
import titanLogo from '../assets/TITAN LOGO without BG.png';
import './AdminLogin.css';

const DEMO = {
  admin:    { email: 'admin@titan.edu',    password: 'Admin@2026'    },
  subadmin: { email: 'subadmin@titan.edu', password: 'SubAdmin@2026' },
};

function AdminDeskIllustration() {
  return (
    <svg className="adm-illus-svg" viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="150" rx="135" ry="95" fill="#e4ecfb" />
      <circle cx="70"  cy="70"  r="30" fill="#eef3fd" />
      <circle cx="235" cy="90"  r="38" fill="#eef3fd" />
      <circle cx="215" cy="55"  r="20" fill="#f2f6ff" />

      <g>
        <rect x="34" y="58" width="52" height="34" rx="12" fill="#2563eb" />
        <path d="M46 90 L46 102 L58 90 Z" fill="#2563eb" />
        <circle cx="49" cy="75" r="3.2" fill="#fff" />
        <circle cx="60" cy="75" r="3.2" fill="#fff" />
        <circle cx="71" cy="75" r="3.2" fill="#fff" />
      </g>

      <circle cx="250" cy="150" r="4" fill="#F3C623" />
      <circle cx="40"  cy="150" r="3.5" fill="#F3C623" />
      <circle cx="262" cy="120" r="2.5" fill="#F3C623" />

      <g>
        <path d="M232 196 L236 214 L252 214 L256 196 Z" fill="#b45309" />
        <rect x="230" y="190" width="28" height="8" rx="3" fill="#92400e" />
        <path d="M244 190 Q243 176 244 162" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M244 184 Q231 176 229 165 Q241 171 244 182Z" fill="#16a34a" />
        <path d="M244 184 Q257 176 259 165 Q247 171 244 182Z" fill="#15803d" />
        <path d="M244 173 Q233 165 231 154 Q242 160 244 171Z" fill="#22c55e" />
        <path d="M244 173 Q255 165 257 154 Q246 160 244 171Z" fill="#16a34a" />
      </g>

      <rect x="110" y="96" width="80" height="104" rx="20" fill="#1e3a8a" />

      <g>
        <path d="M124 150 Q108 168 118 186" stroke="#0A3D91" strokeWidth="15" strokeLinecap="round" />
        <path d="M176 150 Q192 168 182 186" stroke="#0A3D91" strokeWidth="15" strokeLinecap="round" />
        <circle cx="118" cy="186" r="7" fill="#f4c5a0" />
        <circle cx="182" cy="186" r="7" fill="#f4c5a0" />

        <path d="M118 200 L118 150 Q118 132 150 130 Q182 132 182 150 L182 200 Z" fill="#0A3D91" />
        <path d="M138 132 L150 200 L162 132 Q150 128 138 132 Z" fill="#f4f7ff" />
        <path d="M150 134 L145 148 L150 176 L155 148 Z" fill="#F3C623" />
        <path d="M147 133 L150 138 L153 133 Z" fill="#e6b820" />
        <path d="M138 132 L150 154 L142 132 Z" fill="#123a86" />
        <path d="M162 132 L150 154 L158 132 Z" fill="#123a86" />

        <rect x="144" y="118" width="12" height="16" rx="5" fill="#f0b98c" />
        <circle cx="150" cy="104" r="22" fill="#f4c5a0" />
        <ellipse cx="128" cy="106" rx="4" ry="5" fill="#f0b98c" />
        <ellipse cx="172" cy="106" rx="4" ry="5" fill="#f0b98c" />
        <path d="M128 100 Q128 80 150 78 Q172 80 172 100 Q169 87 150 85 Q131 87 128 100 Z" fill="#1a1008" />
        <path d="M128 100 Q123 94 125 86 Q129 79 150 78 Q129 81 128 100 Z" fill="#1a1008" />
        <path d="M172 100 Q177 94 175 86 Q171 79 150 78 Q171 81 172 100 Z" fill="#1a1008" />
        <circle cx="142" cy="104" r="2.4" fill="#1a1008" />
        <circle cx="158" cy="104" r="2.4" fill="#1a1008" />
        <path d="M143 112 Q150 118 157 112" stroke="#c47a5a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="142" cy="104" r="7" fill="none" stroke="#0A3D91" strokeWidth="1.8" />
        <circle cx="158" cy="104" r="7" fill="none" stroke="#0A3D91" strokeWidth="1.8" />
        <line x1="149" y1="104" x2="151" y2="104" stroke="#0A3D91" strokeWidth="1.6" />
      </g>

      <rect x="26" y="198" width="248" height="16" rx="8" fill="#0A3D91" />
      <rect x="26" y="196" width="248" height="6" rx="3" fill="#1e50b8" />

      <rect x="120" y="168" width="60" height="34" rx="3" fill="#0A3D91" />
      <rect x="124" y="172" width="52" height="26" rx="2" fill="#2563eb" />
      <rect x="129" y="177" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
      <rect x="129" y="184" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="129" y="191" width="26" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="112" y="200" width="76" height="7" rx="3" fill="#94a3b8" />
    </svg>
  );
}

/* ── Illustration panel ────────────────────────────────────────────────── */
function IllusSide({ isAdmin }) {
  return (
    <div className="adm-illus">
      <div className="adm-illus-brand">
        <img src={titanLogo} alt="TITAN Learning System" className="adm-illus-logo" />
        <div>
          <span className="adm-illus-name">TITAN</span>
          <span className="adm-illus-sub">Admin Portal</span>
        </div>
      </div>
      <AdminDeskIllustration />
      <p className="adm-illus-tag">
        {isAdmin
          ? 'Full control to manage your entire learning system.'
          : 'Assist and support the day-to-day operations.'}
      </p>
    </div>
  );
}

/* ── Form panel (self-contained per role) ──────────────────────────────── */
function FormSide({ role, onSwitch, onLogin, onStudentLogin }) {
  const [form, setForm]         = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const isAdmin = role === 'admin';
  const creds   = DEMO[role];

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      triggerShake();
      return;
    }
    if (form.email.trim() !== creds.email || form.password !== creds.password) {
      setError('Invalid credentials. Please check your email and password.');
      triggerShake();
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 900);
  };

  return (
    <div className="adm-form-side">
      <div className="adm-form-inner" key={role}>

        <h2 className="adm-title">Login</h2>
        <p className="adm-sub">{isAdmin ? 'Administrator access' : 'Sub-Admin access'}</p>

        <form onSubmit={handleSubmit} className={shake ? 'adm-shake' : ''}>

          {error && (
            <div className="adm-error"><AlertCircle size={14} /> {error}</div>
          )}

          <div className="adm-field">
            <div className="adm-input-wrap">
              <input
                type="text"
                className={`adm-input${error ? ' adm-input-error' : ''}`}
                placeholder={`${isAdmin ? 'Admin' : 'Sub-Admin'} email`}
                value={form.email}
                onChange={(e) => { setError(''); setForm((f) => ({ ...f, email: e.target.value })); }}
                autoComplete="username"
              />
              <span className="adm-input-icon"><User size={17} /></span>
            </div>
          </div>

          <div className="adm-field">
            <div className="adm-input-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className={`adm-input${error ? ' adm-input-error' : ''}`}
                placeholder="Password"
                value={form.password}
                onChange={(e) => { setError(''); setForm((f) => ({ ...f, password: e.target.value })); }}
                autoComplete="current-password"
              />
              <button type="button" className="adm-input-icon adm-eye"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="adm-forgot-row">
            <a href="#" className="adm-forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="adm-btn" disabled={loading}>
            {loading ? (<><Loader2 size={18} className="adm-spin" /> Verifying…</>)
                     : (<>Login <ArrowRight size={18} /></>)}
          </button>

          {/* Switch to the other role (slides the view) */}
          <button type="button" className="adm-switch" onClick={() => { setError(''); onSwitch(); }}>
            <span>{isAdmin ? 'Are you a Sub-Admin?' : 'Are you an Administrator?'}</span>
            <strong>{isAdmin ? 'Sub-Admin Login' : 'Admin Login'} <ArrowRight size={14} /></strong>
          </button>

          <p className="adm-foot">
            Not an admin?{' '}
            <button type="button" className="adm-foot-link" onClick={onStudentLogin}>
              Student / Teacher Login
            </button>
          </p>

          <div className="adm-secure"><ShieldCheck size={13} /> Secured admin access</div>
        </form>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [view, setView] = useState('admin'); // 'admin' | 'subadmin'

  return (
    <div className="adm-page">
      <div className="adm-outer">
        <div className={`adm-track${view === 'subadmin' ? ' subadmin' : ''}`}>

          {/* View 1 — Admin (illustration left, form right) */}
          <div className="adm-view">
            <IllusSide isAdmin={true} />
            <FormSide
              role="admin"
              onSwitch={() => setView('subadmin')}
              onLogin={onLogin}
              onStudentLogin={() => navigate('/login')}
            />
          </div>

          {/* View 2 — Sub-Admin (form left, illustration right) */}
          <div className="adm-view">
            <FormSide
              role="subadmin"
              onSwitch={() => setView('admin')}
              onLogin={onLogin}
              onStudentLogin={() => navigate('/login')}
            />
            <IllusSide isAdmin={false} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
