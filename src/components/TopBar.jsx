import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../auth';

const notificationsData = [
  {
    title: 'New assignment posted',
    message: 'Your math quiz assignment is now available for review.',
    time: '2h ago',
  },
  {
    title: 'Attendance milestone',
    message: 'You achieved 85% attendance this month.',
    time: 'Yesterday',
  },
  {
    title: 'Course update',
    message: 'React JS module has a new lesson on state management.',
    time: '2 days ago',
  },
];

function TopBar({
  userName = 'Mujtaba khan',
  userRole = 'Student',
  pageTitle = 'Student Management System',
  pageSubtitle = 'Review academic performance, attendance, quizzes, and assignments in one place.',
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications] = useState(notificationsData);
  const unreadCount = notifications.length;
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const initials = userName
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-title">
          <span className="eyebrow">Dashboard</span>
          <h2>{pageTitle}</h2>
          <p>{pageSubtitle}</p>
        </div>

        <div className="topbar-actions">
          <label className="search-box">
            <FiSearch size={18} color="#10375C" />
            <input type="search" placeholder="Search classes, students, or reports" />
          </label>
        </div>

        <div className="topbar-right-section">
          <div className="notification-wrapper">
            <button
              type="button"
              className="notification-button"
              onClick={() => setNotificationOpen((value) => !value)}
              aria-label="View notifications"
            >
              <FiBell size={22} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <div className={`notification-panel ${notificationOpen ? 'open' : ''}`}>
              <div className="notification-panel-header">
                <h4>Notifications</h4>
                <button type="button" onClick={() => setNotificationOpen(false)}>
                  Close
                </button>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <div key={index} className="notification-item">
                      <div className="notification-icon">
                        <FiBell />
                      </div>
                      <div className="notification-content">
                        <h5>{item.title}</h5>
                        <p>{item.message}</p>
                        <div className="notification-footer">{item.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">No Notifications Available</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-wrapper" ref={profileRef}>
            <button
              type="button"
              className={`profile-chip ${profileOpen ? 'open' : ''}`}
              onClick={() => setProfileOpen((value) => !value)}
              aria-label="Open profile menu"
            >
              <div className="profile-avatar">{initials}</div>
              <div className="profile-meta">
                <span>{userName}</span>
                <span>{userRole}</span>
              </div>
              <FiChevronDown
                size={18}
                color="#10375C"
                style={{ transition: 'transform .2s ease', transform: profileOpen ? 'rotate(180deg)' : 'none' }}
              />
            </button>

            <div className={`profile-menu ${profileOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => { setProfileOpen(false); navigate('/profile'); }}
              >
                <FiUser size={17} />
                <span>Profile</span>
              </button>
              <div className="profile-menu-divider" />
              <button
                type="button"
                className="profile-menu-item danger"
                onClick={() => { setProfileOpen(false); logout(); }}
              >
                <FiLogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
