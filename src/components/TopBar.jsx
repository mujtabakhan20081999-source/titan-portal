import { useState } from 'react';
import { FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';

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
  const [profileHover, setProfileHover] = useState(false);
  const [notifications] = useState(notificationsData);
  const unreadCount = notifications.length;

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

          <div
            className="profile-chip"
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
            style={{ transform: profileHover ? 'translateY(-1px)' : 'none' }}
          >
            <div className="profile-avatar">{initials}</div>
            <div className="profile-meta">
              <span>{userName}</span>
              <span>{userRole}</span>
            </div>
            <FiChevronDown size={18} color="#10375C" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
