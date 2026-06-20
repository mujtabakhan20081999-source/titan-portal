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
  FiBookOpen,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const menuItems = [
  { icon: <FiHome />,      label: 'Dashboard',   path: '/dashboard' },
  { icon: <FiClipboard />, label: 'Assignments',  path: '/assignments' },
  { icon: <FiFileText />,  label: 'Quizzes',      path: '/quizzes' },
  { icon: <FiBarChart2 />, label: 'Attendance',   path: '/attendance' },
  { icon: <FiCalendar />,  label: 'Leaves',       path: '/leaves' },
  { icon: <FiBookOpen />,  label: 'My Courses',   path: '/courses' },
  { icon: <FiUser />,      label: 'Profile',      path: '/profile' },
  { icon: <FiSettings />,  label: 'Settings',     path: '/settings' },
];

function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

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

      {!collapsed && (
        <div className="sidebar-cta card-padding">
          <strong>Performance Goal</strong>
          <p>Keep your attendance above 85% and track progress across courses.</p>
        </div>
      )}

      <button
        className="sidebar-logout"
        type="button"
        onClick={onLogout}
      >
        <FiLogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
