import {
  LayoutDashboard, Users, CalendarCheck, Layers, GraduationCap, RefreshCw, User, LogOut,
} from 'lucide-react';
import titanLogo from '../../assets/TITAN LOGO without BG.png';

import '../../styles/subadmin.css';

// Icon-only floating sidebar. Menu is built from the sub-admin's permission
// list — modules they have no access to simply never appear.
const MENU = [
  { icon: LayoutDashboard, label: 'Dashboard',  module: 'Dashboard' },
  { icon: Users,           label: 'Students',   module: 'Students' },
  { icon: CalendarCheck,   label: 'Attendance', module: 'Attendance' },
  { icon: Layers,          label: 'Slots',      module: 'Slots' },
  { icon: GraduationCap,   label: 'Trainers',   module: 'Trainers' },
  { icon: RefreshCw,       label: 'Updation',   module: 'Updation' },
];

function SubAdminSidebar({ active, onSelect, onLogout, perms }) {
  const items = MENU.filter((m) => (perms[m.module] || []).length > 0);

  return (
    <aside className="sap-side">
      <div className="sap-side-logo">
        <img src={titanLogo} alt="TITAN" />
      </div>
      <div className="sap-div" />

      <nav className="sap-nav">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.label}
              type="button"
              title={it.label}
              aria-label={it.label}
              className={`sap-nav-btn${active === it.label ? ' active' : ''}`}
              onClick={() => onSelect && onSelect(it.label)}
            >
              <Icon size={20} />
            </button>
          );
        })}
        <div className="sap-div" />
        <button
          type="button"
          title="Profile"
          aria-label="Profile"
          className={`sap-nav-btn${active === 'Profile' ? ' active' : ''}`}
          onClick={() => onSelect && onSelect('Profile')}
        >
          <User size={20} />
        </button>
      </nav>

      <button type="button" title="Logout" aria-label="Logout" className="sap-nav-btn sap-logout" onClick={onLogout}>
        <LogOut size={20} />
      </button>
    </aside>
  );
}

export default SubAdminSidebar;
