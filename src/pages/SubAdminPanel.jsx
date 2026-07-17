import { useState } from 'react';
import { Bell, MapPin } from 'lucide-react';

import SubAdminSidebar from '../components/subadmin/SubAdminSidebar';
import SubAdminDashboard from '../components/subadmin/SubAdminDashboard';
import SubAdminStudents from '../components/subadmin/SubAdminStudents';
import SubAdminAttendance from '../components/subadmin/SubAdminAttendance';
import SubAdminSlots from '../components/subadmin/SubAdminSlots';
import SubAdminTrainers from '../components/subadmin/SubAdminTrainers';
import SubAdminUpdation from '../components/subadmin/SubAdminUpdation';
import SubAdminProfile from '../components/subadmin/SubAdminProfile';
import { SUBADMIN_PERMISSIONS, makeStudents, makeSlots } from '../components/subadmin/subAdminData';

import '../styles/admin.css';
import '../styles/admin-pages.css';
import '../styles/subadmin.css';

const PAGE_META = {
  Dashboard: { title: 'Dashboard', subtitle: '' },
  Students: { title: 'Students', subtitle: 'Your campus student directory' },
  Attendance: { title: 'Attendance', subtitle: 'Mark, view & multi attendance' },
  Slots: { title: 'Slots', subtitle: 'Class groups at your campus' },
  Trainers: { title: 'Trainers', subtitle: 'Campus trainers & their attendance' },
  Updation: { title: 'Updation', subtitle: 'Bulk update student status' },
  Profile: { title: 'My Profile', subtitle: 'Your account & permissions' },
};

function SubAdminPanel({ city, onLogout, onChangeCity }) {
  const [active, setActive] = useState('Dashboard');
  const perms = SUBADMIN_PERMISSIONS;

  // One shared "database" for this campus — Students, Attendance and Updation
  // all read/write the same lists, so a change in one page shows in the others.
  const [students, setStudents] = useState(() => makeStudents(city));
  const [slots, setSlots] = useState(() => makeSlots(city));

  const PAGES = {
    Dashboard: <SubAdminDashboard city={city} students={students} slots={slots} onGoto={setActive} />,
    Students: <SubAdminStudents city={city} perms={perms} students={students} setStudents={setStudents} slots={slots} />,
    Attendance: <SubAdminAttendance city={city} perms={perms} students={students} />,
    Slots: <SubAdminSlots city={city} perms={perms} slots={slots} setSlots={setSlots} />,
    Trainers: <SubAdminTrainers city={city} perms={perms} />,
    Updation: <SubAdminUpdation city={city} students={students} setStudents={setStudents} />,
    Profile: <SubAdminProfile city={city} onLogout={onLogout} />,
  };

  return (
    <div className="sap-app">
      <SubAdminSidebar active={active} onSelect={setActive} onLogout={onLogout} perms={perms} />

      <div className="sap-main">
        <div className="sap-topbar">
          <div className="sap-title">
            <h1>{PAGE_META[active]?.title || 'Dashboard'}</h1>
            <p>
              {active === 'Dashboard'
                ? `Welcome back, Sub Admin! Managing ${city} Campus.`
                : PAGE_META[active]?.subtitle}
            </p>
          </div>
          <div className="sap-top-right">
            <button className="admin-city-chip" onClick={onChangeCity} title="Change city">
              <MapPin size={14} /> {city} <span className="chip-change">Change</span>
            </button>
            <button className="admin-bell" aria-label="Notifications" style={{ borderRadius: '50%' }}>
              <Bell size={18} />
              <span className="admin-bell-dot">3</span>
            </button>
            <div className="sap-av" title="Sub Admin">SA</div>
          </div>
        </div>

        <div className="sap-content">{PAGES[active]}</div>
      </div>
    </div>
  );
}

export default SubAdminPanel;
