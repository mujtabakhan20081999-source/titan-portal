import { useEffect, useState } from 'react';
import { Bell, MapPin } from 'lucide-react';

import SubAdminSidebar from '../components/subadmin/SubAdminSidebar';
import SubAdminDashboard from '../components/subadmin/SubAdminDashboard';
import SubAdminStudents from '../components/subadmin/SubAdminStudents';
import SubAdminAttendance from '../components/subadmin/SubAdminAttendance';
import SubAdminSlots from '../components/subadmin/SubAdminSlots';
import SubAdminTrainers from '../components/subadmin/SubAdminTrainers';
import SubAdminUpdation from '../components/subadmin/SubAdminUpdation';
import SubAdminProfile from '../components/subadmin/SubAdminProfile';
import { SUBADMIN_PERMISSIONS, AV_COLORS } from '../components/subadmin/subAdminData';
import { listStudents } from '../services/studentService';
import { listTrainers } from '../services/trainerService';
import { listSlots } from '../services/slotService';
import { getMyPermissions } from '../services/adminService';

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
  const [perms, setPerms] = useState(SUBADMIN_PERMISSIONS);

  const [students, setStudents] = useState([]);
  const [slots, setSlots] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const campusParams = { city, campus: `${city} Campus`, limit: 200 };

  const reload = async () => {
    const [studentsData, trainersData, slotsData] = await Promise.all([
      listStudents(campusParams).catch(() => []),
      listTrainers({ campus: city }).catch(() => []),
      listSlots({ campus: city }).catch(() => []),
    ]);

    setStudents((studentsData || []).map((s, index) => ({
      ...s,
      id: s._id || s.id,
      batch: s.batch || s.meta || '',
      campus: s.campus || `${s.city || city} Campus`,
      av: AV_COLORS[index % AV_COLORS.length],
      joined: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '',
      open: undefined,
    })));
    setTrainers((trainersData || []).filter((t) => {
      const c = String(t.campus || '');
      return c === city || c === `${city} Campus` || c.toLowerCase().includes(String(city).toLowerCase());
    }));
    setSlots((slotsData || []).map((s) => ({
      ...s,
      id: s.slotId,
      open: s.status === 'Open',
    })));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const myPerms = await getMyPermissions().catch(() => null);
        if (myPerms?.permissions) setPerms(myPerms.permissions);
        await reload();
      } catch (err) {
        console.error('Failed to load data:', err);
        setStudents([]);
        setTrainers([]);
        setSlots([]);
      } finally {
        setDataLoaded(true);
      }
    }
    loadData();
  }, [city]);

  const PAGES = {
    Dashboard: <SubAdminDashboard city={city} students={students} slots={slots} onGoto={setActive} />,
    Students: <SubAdminStudents city={city} perms={perms} students={students} setStudents={setStudents} slots={slots} onReload={reload} />,
    Attendance: <SubAdminAttendance city={city} perms={perms} students={students} />,
    Slots: <SubAdminSlots city={city} perms={perms} slots={slots} setSlots={setSlots} trainers={trainers} onReload={reload} />,
    Trainers: <SubAdminTrainers city={city} perms={perms} trainers={trainers} />,
    Updation: <SubAdminUpdation city={city} students={students} setStudents={setStudents} onReload={reload} />,
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
            </button>
            <div className="sap-av" title="Sub Admin">SA</div>
          </div>
        </div>

        <div className="sap-content">
          {!dataLoaded ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#5F7A9E', fontWeight: 700 }}>Loading data...</div>
          ) : (
            PAGES[active]
          )}
        </div>
      </div>
    </div>
  );
}

export default SubAdminPanel;
