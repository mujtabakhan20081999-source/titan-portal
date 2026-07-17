import { Menu, Search, Bell, ChevronDown, MapPin } from 'lucide-react';

function AdminTopBar({ title, subtitle, onMenu, onLogout, roleLabel = 'Super Admin', city, onChangeCity }) {
  return (
    <header className="admin-topbar">
      <button className="admin-hamburger" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="admin-topbar-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="admin-topbar-right">
        {city && (
          <button className="admin-city-chip" onClick={onChangeCity} title="Change city">
            <MapPin size={14} /> {city} <span className="chip-change">Change</span>
          </button>
        )}

        <label className="admin-search">
          <Search size={16} color="#5F7A9E" />
          <input type="search" placeholder="Search students, roll no, CNIC…" />
        </label>

        <button className="admin-bell" aria-label="Notifications">
          <Bell size={19} />
          <span className="admin-bell-dot">5</span>
        </button>

        <div className="admin-profile" onClick={onLogout} title="Logout">
          <div className="admin-profile-av">SA</div>
          <div className="admin-profile-info">
            <div className="admin-profile-name">{roleLabel}</div>
            <div className="admin-profile-role">{city ? `${city} Region` : roleLabel}</div>
          </div>
          <ChevronDown size={15} color="#5F7A9E" />
        </div>
      </div>
    </header>
  );
}

export default AdminTopBar;
