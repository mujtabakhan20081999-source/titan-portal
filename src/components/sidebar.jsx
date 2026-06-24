import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoTitan from '../assets/TITAN LOGO without BG.png';
import {
  FiMenu,
  FiHome,
  FiClipboard,
  FiFileText,
  FiBarChart2,
  FiCalendar,
  FiTrendingUp,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const studentMenuItems = [
  { icon: <FiHome />,       label: 'Dashboard',   path: '/dashboard' },
  { icon: <FiClipboard />,  label: 'Assignments', path: '/assignments' },
  { icon: <FiFileText />,   label: 'Quizzes',     path: '/quizzes' },
  { icon: <FiTrendingUp />, label: 'Progress',    path: '/progress' },
  { icon: <FiUser />,       label: 'Profile',     path: '/profile' },
  { icon: <FiSettings />,   label: 'Settings',    path: '/settings' },
];

const teacherMenuItems = [
  { icon: <FiHome />,      label: 'Dashboard',  path: '/dashboard' },
  { icon: <FiCalendar />,  label: 'Calendar',   path: '/calendar' },
  { icon: <FiBarChart2 />, label: 'Attendance', path: '/attendance' },
  { icon: <FiUser />,      label: 'Profile',    path: '/profile' },
  { icon: <FiSettings />,  label: 'Settings',   path: '/settings' },
];

function Sidebar({ onLogout, role = 'student' }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const menuItems = role === 'teacher' ? teacherMenuItems : studentMenuItems;
  const active = menuItems.find((item) => location.pathname === item.path)?.label ?? 'Dashboard';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-block">
          <div className="brand-logo">
            <img src={logoTitan} alt="Titan Logo" />
          </div>
          {!collapsed && (
            <div className="brand-title">
              <strong>TITAN</strong>
              <span>Learning</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            className={`sidebar-item ${active === item.label ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && role === 'student' && (
        <div className="sidebar-cta card-padding">
          <strong>Performance Goal</strong>
          <p>Keep your attendance above 85% and track progress across courses.</p>
        </div>
      )}

      {!collapsed && role === 'teacher' && (
        <div className="sidebar-cta card-padding" style={{ marginTop: 'auto' }}>
          <strong>Teaching Tip</strong>
          <p>Upload assignments early so students have enough time to prepare.</p>
        </div>
      )}

      <button
        className="sidebar-logout"
        type="button"
        onClick={onLogout}
        style={role === 'teacher' ? {} : { marginTop: 'auto' }}
      >
        <FiLogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
