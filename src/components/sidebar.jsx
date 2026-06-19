import { useState } from 'react';
import logoTitan from '../assets/logotitan.png';
import {
  FiHome,
  FiClipboard,
  FiEdit,
  FiCheckSquare,
  FiCalendar,
  FiBook,
  FiUser,
  FiSettings,
  FiLogOut
} from "react-icons/fi";




const menuItems = [
  { icon: <FiHome />, label: 'Dashboard' },
  { icon: <FiClipboard />, label: 'Assignments' },
  { icon: <FiEdit />, label: 'Quizzes' },
  { icon: <FiCheckSquare />, label: 'Attendance' },
  { icon: <FiCalendar />, label: 'Leaves' },
  { icon: <FiBook />, label: 'My Courses' },
  { icon: <FiUser />, label: 'Profile' },
  { icon: <FiSettings />, label: 'Settings' },
];
const styles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .logo-container {
    animation: fadeInScale 0.6s ease-out;
  }

  .logo-image {
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .logo-container:hover .logo-image {
    transform: scale(1.1) rotate(3deg);
    filter: drop-shadow(0 8px 16px rgba(139, 92, 246, 0.4));
  }

  .brand-text {
    animation: slideInUp 0.7s ease-out;
  }

  .menu-nav {
    animation: slideInUp 0.8s ease-out;
  }
`;

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState('Dashboard');
    const [hoveredLogo, setHoveredLogo] = useState(false);

    return (
        <>
            <style>{styles}</style>
            <div style={{
                width: collapsed ? 80 : 210,
                transition: 'width 0.3s ease',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #ffffff 0%, #062e7e 100%)',
                padding: '24px 14px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
                position: 'relative',
            }}>
                {/* Premium gradient overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                }} />

                <div
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '24px',
                        color: '#000',
                        marginBottom: '20px',
                        textAlign: collapsed ? 'center' : 'right',
                    }}
                >
                    ☰
                </div>
                {/* Logo Section */}
                <div
                    className="logo-container"
                    onMouseEnter={() => setHoveredLogo(true)}
                    onMouseLeave={() => setHoveredLogo(false)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 36,
                        padding: '12px 8px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: hoveredLogo ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                        position: 'relative',
                    }}
                >
                    {/* Logo Image with glow effect */}
                    <div style={{
                        position: 'relative',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        background: '#f8f9fb',
                        padding: 4,
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3), inset 0 0 0 1px rgba(139, 92, 246, 0.2)',
                    }}>
                        <img
                            className="logo-image"
                            src={logoTitan}
                            alt="Titan Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: 8,
                            }}
                        />
                    </div>

                    
                    {!collapsed && (
                        <div className="brand-text">
                            <div style={{
                                fontWeight: 800,
                                color: '#1e3a8a',
                                fontSize: '13px',
                                letterSpacing: '0.5px',
                                lineHeight: '1.2',
                                textTransform: 'uppercase',
                            }}>
                                TITAN
                            </div>
                           
                            <div style={{
                                fontSize: '10px',
                                color: '#8b5cf6',
                                fontWeight: 600,
                                letterSpacing: '0.3px',
                                marginTop: '2px',
                                textTransform: 'uppercase',
                            }}>
                                LEARNING
                            </div>
                        </div>
                    )}
        </div>

                {/* Menu Items */}
                <nav className="menu-nav" style={{ flex: 1, marginBottom: 16 }}>
                    {menuItems.map((item, index) => (
                        <div
                            key={item.label}
                            onClick={() => setActive(item.label)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 11,
                                padding: '11px 12px',
                                borderRadius: 9,
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                cursor: 'pointer',
                                marginBottom: 6,
                                fontSize: '16.5px',
                                fontWeight: active === item.label ? 600 : 500,
                                background: active === item.label
                                    ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                                    : 'transparent',
                                color: active === item.label ? 'white' : '#000000',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `slideInUp 0.6s ease-out ${0.1 + index * 0.05}s backwards`,
                                borderLeft: active === item.label ? '5px solid rgba(255,255,255,0.5)' : '3px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (active !== item.label) {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                    e.currentTarget.style.color = '#1e3a8a';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (active !== item.label) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#000000';
                                }
                            }}
                        >
                            <span style={{ fontSize: '16px', width: '24px' }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                            {active === item.label && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '3px',
                                    height: '60%',
                                    background: 'rgba(255,255,255,0.8)',
                                    borderRadius: '3px 0 0 3px',
                                    animation: 'slideInUp 0.3s ease-out',
                                }} />
                            )}
                        </div>
                    ))}
                </nav>

                {/* Keep going card */}
                
               {!collapsed && ( <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: 12,
                    padding: 16,
                    textAlign: 'center',
                    marginBottom: 16,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    animation: 'slideInUp 0.9s ease-out',
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🏆</div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#1e3a8a', marginBottom: 2 }}>Keep going!</div>
                    <div style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 500 }}>You're doing great.</div>
                </div>
               )}
                {/* Logout */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    fontWeight: 500,
                    padding: '11px 12px',
                    cursor: 'pointer',
                    color: '#050505',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    borderRadius: 9,
                    transition: 'all 0.3s ease',
                    animation: 'slideInUp 1s ease-out',
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#999';
                    }}
                >
                    <span style={{ fontSize: '16px', width: '24px' }}><FiLogOut /></span>
                    <span>Logout</span>
                </div>
            </div>
        </>
    );
}

export default Sidebar;