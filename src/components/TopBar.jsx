import { useState } from 'react';

const styles = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .header-container {
    animation: fadeInDown 0.6s ease-out;
  }

  .header-content {
    animation: slideInRight 0.7s ease-out;
  }

  .decoration-item {
    animation: float 3s ease-in-out infinite;
  }

  .notification-badge {
    transition: all 0.3s ease;
  }

  .notification-badge:hover {
    transform: scale(1.2) rotate(10deg);
  }

  .avatar-section {
    transition: all 0.3s ease;
  }

  .avatar-section:hover {
    transform: translateY(-2px);
  }
`;

function TopBar() {
  const [notificationHover, setNotificationHover] = useState(false);
  const [profileHover, setProfileHover] = useState(false);

  // Get current date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

 

  return (
    <>
      <style>{styles}</style>
      <div
        className="header-container"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #062e7e 100%)',
          padding: '32px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
          minHeight: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Left Content */}
        <div
          className="header-content"
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            color: 'white',
          }}
        >
          {/* Date */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              opacity: 0.9,
              color: 'rgba(000, 0, 0, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 12,
            }}
          >
            {dateString}
          </div>

          {/* Welcome Text */}
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 800,
              margin: '8px 0',
              lineHeight: 1.2,
              color: '#000',
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
            }}
          >
            Welcome back, Mujtaba khan! 👋
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '15px',
              fontWeight: 500,
              opacity: 0.95,
              marginTop: 8,
              color: 'rgba(3, 3, 3, 0.9)',
              lineHeight: 1.5,
            }}
          >
            Always stay updated in your student portal
          </p>
        </div>

        {/* Right Decorations */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginLeft: 40,
            minWidth: '300px',
            justifyContent: 'flex-end',
          }}
        >
          {/* {decorations.map((dec, idx) => (
            <div
              key={idx}
              className="decoration-item"
              style={{
                fontSize: '48px',
                transform: `rotate(${dec.rotate}deg)`,
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${dec.delay}s`,
              }}
            >
              {dec.icon}
            </div>
          ))} */}

          {/* Notifications */}
          <div
            className="notification-badge"
            onMouseEnter={() => setNotificationHover(true)}
            onMouseLeave={() => setNotificationHover(false)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: notificationHover ? 'rgba(255,255,255,0.2)' : 'transparent',
              borderRadius: 10,
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ fontSize: 24 }}>🔔</span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#ff6b6b',
                color: 'white',
                fontSize: '10px',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              3
            </span>
          </div>
        </div>

        {/* Top Right: Profile */}
        <div
          className="avatar-section"
          onMouseEnter={() => setProfileHover(true)}
          onMouseLeave={() => setProfileHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            padding: '8px 12px',
            backgroundColor: profileHover ? 'rgba(255,255,255,0.2)' : 'transparent',
            borderRadius: 12,
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 2,
            marginLeft: 'auto',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #767494 0%, #1e40af 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            AR
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Ali Raza</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Student</div>
          </div>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>▾</span>
        </div>
      </div>
    </>
  );
}

export default TopBar;