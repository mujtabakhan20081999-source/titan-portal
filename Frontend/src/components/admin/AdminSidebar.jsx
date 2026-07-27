import { useState } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, Layers, GraduationCap, RefreshCw, User,
  MonitorPlay, BookOpen, FileText, Settings, ScrollText, LifeBuoy, ShieldCheck,
  ChevronDown, X, Menu,
} from 'lucide-react';
import titanLogo from '../../assets/TITAN LOGO without BG.png';

const sections = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: Users,           label: 'Students' },
      { icon: CalendarCheck,   label: 'Attendance', caret: true },
      { icon: Layers,          label: 'Administration (Slots)', caret: true },
      { icon: GraduationCap,   label: 'Trainers', caret: true },
      { icon: RefreshCw,       label: 'Updation' },
      { icon: User,            label: 'Profile' },
    ],
  },
  {
    label: 'Apps',
    items: [
      { icon: MonitorPlay, label: 'Trainer Portal' },
      { icon: BookOpen,    label: 'Student Portal' },
    ],
  },
  {
    label: 'Custom Pages',
    items: [
      { icon: FileText,    label: 'Reports' },
      { icon: Settings,    label: 'Settings' },
      { icon: ScrollText,  label: 'Audit Logs' },
      { icon: LifeBuoy,    label: 'Support' },
      { icon: ShieldCheck, label: 'Permissions' },
    ],
  },
];

function AdminSidebar({ open, onClose, active = 'Dashboard', onSelect }) {
  // Active label comes from AdminPanel; keep it in sync with admin routes.

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`admin-sidebar${open ? ' open' : ''}${collapsed ? ' collapsed' : ''}`}>
      <div className="admin-brand">
        <img src={titanLogo} alt="TITAN" />
        <span className="admin-brand-name">TITAN SMS</span>
        <button
          className="admin-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <button className="admin-brand-close" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="admin-nav">
        {sections.map((sec) => (
          <div key={sec.label} className="admin-nav-section">
            <div className="admin-nav-label">{sec.label}</div>
            {sec.items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  title={it.label}
                  className={`admin-nav-item${active === it.label ? ' active' : ''}`}
                  onClick={() => onSelect && onSelect(it.label)}
                >
                  <Icon size={18} />
                  <span>{it.label}</span>
                  {it.caret && <ChevronDown size={15} className="admin-nav-chev" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
