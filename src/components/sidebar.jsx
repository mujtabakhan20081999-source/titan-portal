import { useState } from 'react';
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
  { icon: <FiHome />, label: 'Dashboard' },
  { icon: <FiClipboard />, label: 'Assignments' },
  { icon: <FiFileText />, label: 'Quizzes' },
  { icon: <FiBarChart2 />, label: 'Attendance' },
  { icon: <FiCalendar />, label: 'Leaves' },
  { icon: <FiBookOpen />, label: 'My Courses' },
  { icon: <FiUser />, label: 'Profile' },
  { icon: <FiSettings />, label: 'Settings' },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Dashboard');

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
          onClick={() => setCollapsed((value) => !value)}
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
            onClick={() => setActive(item.label)}
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

      <button className="sidebar-logout" type="button">
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;