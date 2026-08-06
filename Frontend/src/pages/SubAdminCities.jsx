import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, GraduationCap, CalendarClock, ArrowRight, LogOut, Building2, ShieldCheck,
} from 'lucide-react';
import titanLogo from '../assets/TITAN LOGO without BG.png';
import { getCityStats } from '../services/adminService';
import '../styles/subadmin.css';

const CITY_CARDS = [
  { name: 'Sukkur',  campus: 'Sukkur Campus',  students: 0, trainers: 0, slots: 0, grad: ['#0A3D91', '#1150c0'] },
  { name: 'Karachi', campus: 'Karachi Campus', students: 0, trainers: 0, slots: 0, grad: ['#1150c0', '#2563eb'] },
];

function CitySkyline(props) {
  return (
    <svg viewBox="0 0 300 54" preserveAspectRatio="none" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="0" y="26" width="26" height="28" />
      <rect x="30" y="14" width="20" height="40" />
      <rect x="54" y="30" width="26" height="24" />
      <rect x="84" y="8" width="18" height="46" />
      <rect x="106" y="22" width="24" height="32" />
      <rect x="134" y="16" width="16" height="38" />
      <rect x="154" y="28" width="26" height="26" />
      <rect x="184" y="10" width="20" height="44" />
      <rect x="208" y="24" width="24" height="30" />
      <rect x="236" y="18" width="18" height="36" />
      <rect x="258" y="30" width="20" height="24" />
      <rect x="282" y="20" width="18" height="34" />
    </svg>
  );
}

function SubAdminCities({ onSelect, onLogout }) {
  const navigate = useNavigate();
  const [chosen, setChosen] = useState(null);
  const [cities, setCities] = useState(CITY_CARDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        const stats = await getCityStats();
        if (!active) return;

        const updated = CITY_CARDS.map((card) => {
          const stat = stats.find((item) => item.city === card.name);
          return stat
            ? {
              ...card,
              students: stat.students,
              trainers: stat.trainers,
              slots: stat.slots,
            }
            : card;
        });
        setCities(updated);
      } catch (err) {
        console.error('Failed to load city stats:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();
    return () => { active = false; };
  }, []);

  const pick = (city) => {
    if (chosen) return;
    setChosen(city);
    setTimeout(() => {
      onSelect(city);
      navigate('/admin/panel');
    }, 650);
  };

  return (
    <div className="sac-page">
      <div className="sac-blob sac-blob-1" />
      <div className="sac-blob sac-blob-2" />
      <div className="sac-blob sac-blob-3" />

      <header className="sac-head">
        <img src={titanLogo} alt="TITAN" />
        <div>
          <div className="sac-head-name">TITAN SMS</div>
          <div className="sac-head-role">Sub-Admin Portal</div>
        </div>
        <button className="sac-logout" onClick={onLogout}>
          <LogOut size={15} /> Logout
        </button>
      </header>

      <div className="sac-hero">
        <span className="sac-hero-badge"><ShieldCheck size={13} /> Sub-Admin Access</span>
        <h1>Select Your <span>City</span></h1>
        <p>Choose a city to open its sub-admin panel and manage its operations.</p>
      </div>

      <div className={`sac-grid${chosen ? ' leaving' : ''}`}>
        {cities.map((c, i) => (
          <button
            key={c.name}
            className={`sac-card${chosen === c.name ? ' chosen' : ''}`}
            style={{ '--g1': c.grad[0], '--g2': c.grad[1], '--d': `${200 + i * 90}ms` }}
            onClick={() => pick(c.name)}
          >
            <div className="sac-card-top">
              <div className="sac-card-icon"><Building2 size={24} /></div>
              <span className="sac-card-badge"><MapPin size={11} /> {c.campus}</span>
            </div>

            <div className="sac-card-city">{c.name}</div>
            <div className="sac-card-sub">Sub-Admin Panel</div>

            <div className="sac-card-stats">
              <div>
                <Users size={14} />
                <b>{loading ? '—' : c.students.toLocaleString()}</b>
                <span>Students</span>
              </div>
              <div>
                <GraduationCap size={14} />
                <b>{loading ? '—' : c.trainers.toLocaleString()}</b>
                <span>Trainers</span>
              </div>
              <div>
                <CalendarClock size={14} />
                <b>{loading ? '—' : c.slots.toLocaleString()}</b>
                <span>Slots</span>
              </div>
            </div>

            <div className="sac-card-open">Open Panel <ArrowRight size={15} /></div>
            <CitySkyline className="sac-card-sky" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SubAdminCities;
