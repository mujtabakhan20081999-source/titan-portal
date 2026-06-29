import React, { useState } from 'react';

const quizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Covers variables, functions, closures, async/await, and DOM manipulation.',
    date: '10 Jun 2026',
    time: '09:00 AM',
    duration: '45 min',
    questions: 20,
    status: 'upcoming',
    course: 'Modern Web App Development',
    color: 'indigo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'React Basics',
    description: 'Hooks, props, state management, component lifecycle, and context API.',
    date: '17 Jun 2026',
    time: '10:00 AM',
    duration: '40 min',
    questions: 15,
    status: 'upcoming',
    course: 'Modern Web App Development',
    color: 'cyan',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'HTML & CSS',
    description: 'Semantic HTML5, Flexbox, Grid layout, responsive design, and animations.',
    date: '24 Jun 2026',
    time: '09:00 AM',
    duration: '30 min',
    questions: 18,
    status: 'upcoming',
    course: 'Little Geniuses Lab',
    color: 'orange',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5 3 6V3h18v3l-11.5 11.5" /><path d="M12 13h9v4h-9z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    description: 'User research, wireframing, color theory, typography, and Figma basics.',
    date: '15 May 2026',
    time: '11:00 AM',
    duration: '35 min',
    questions: 22,
    status: 'completed',
    score: 88,
    course: 'Little Geniuses Lab',
    color: 'emerald',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Web Fundamentals',
    description: 'HTTP protocol, DNS, browsers, APIs, and how the internet works.',
    date: '01 Apr 2026',
    time: '10:00 AM',
    duration: '30 min',
    questions: 16,
    status: 'completed',
    score: 74,
    course: 'Modern Web App Development',
    color: 'teal',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const colorMap = {
  indigo:  {
    iconBg: '#eef2ff', iconColor: '#4f46e5',
    badgeBg: '#eef2ff', badgeColor: '#4338ca',
    strip: '#6366f1', stripLight: '#a5b4fc',
    btnBg: '#4f46e5', ring: '#c7d2fe',
    glow: 'rgba(99,102,241,0.15)',
  },
  cyan:    {
    iconBg: '#ecfeff', iconColor: '#0891b2',
    badgeBg: '#ecfeff', badgeColor: '#0e7490',
    strip: '#06b6d4', stripLight: '#67e8f9',
    btnBg: '#0891b2', ring: '#a5f3fc',
    glow: 'rgba(6,182,212,0.15)',
  },
  orange:  {
    iconBg: '#fff7ed', iconColor: '#ea580c',
    badgeBg: '#fff7ed', badgeColor: '#c2410c',
    strip: '#f97316', stripLight: '#fdba74',
    btnBg: '#ea580c', ring: '#fed7aa',
    glow: 'rgba(249,115,22,0.15)',
  },
  emerald: {
    iconBg: '#ecfdf5', iconColor: '#059669',
    badgeBg: '#ecfdf5', badgeColor: '#047857',
    strip: '#10b981', stripLight: '#6ee7b7',
    btnBg: '#059669', ring: '#a7f3d0',
    glow: 'rgba(16,185,129,0.15)',
  },
  teal:    {
    iconBg: '#f0fdfa', iconColor: '#0d9488',
    badgeBg: '#f0fdfa', badgeColor: '#0f766e',
    strip: '#14b8a6', stripLight: '#5eead4',
    btnBg: '#0d9488', ring: '#99f6e4',
    glow: 'rgba(20,184,166,0.15)',
  },
};

function ScoreRing({ score }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const trackColor = score >= 80 ? '#d1fae5' : score >= 60 ? '#fef3c7' : '#fee2e2';
  return (
    <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={trackColor} strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{score}%</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient, delay }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: 20,
      padding: '22px 24px',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      animation: `slideUp 0.5s ease ${delay}s both`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 90, height: 90, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }} />
      <div style={{
        position: 'absolute', bottom: -30, right: 20,
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
      }} />
      <div style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>{label}</div>
    </div>
  );
}

export default function Quiz() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = quizzes.filter(q => {
    const matchTab    = activeTab === 'all' || q.status === activeTab;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                        q.course.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const upcomingCount  = quizzes.filter(q => q.status === 'upcoming').length;
  const completedCount = quizzes.filter(q => q.status === 'completed').length;
  const avgScore       = Math.round(
    quizzes.filter(q => q.score).reduce((a, b) => a + b.score, 0) / completedCount
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .quiz-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .quiz-card:hover {
          transform: translateY(-4px);
        }
        .tab-btn {
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .tab-btn:hover {
          background: rgba(99,102,241,0.08) !important;
        }
        .prepare-btn {
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          font-family: inherit;
        }
        .prepare-btn:hover {
          filter: brightness(1.1);
          transform: translateX(2px);
        }
        .review-btn {
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          font-family: inherit;
        }
        .review-btn:hover {
          background: #e2e8f0 !important;
        }
        .search-input {
          outline: none;
          background: transparent;
          border: none;
          font-family: inherit;
          width: 100%;
          color: #374151;
          font-size: 13px;
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-box:focus-within {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 3px rgba(129,140,248,0.15) !important;
        }
        @media (max-width: 640px) {
          .quiz-stats { grid-template-columns: 1fr !important; }
          .quiz-card-body { flex-wrap: wrap !important; gap: 12px !important; padding: 16px !important; }
          .quiz-card-right { width: 100%; justify-content: space-between; }
          .quiz-search-box { width: 100% !important; }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ animation: 'slideUp 0.4s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Dashboard</span>
            <span style={{ color: '#cbd5e1', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>Quizzes</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.5px' }}>
            My Quizzes
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 0, fontWeight: 500 }}>
            Track your upcoming and completed quizzes
          </p>
        </div>

        <div className="quiz-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 28,
          marginBottom: 28,
        }}>
          <StatCard label="Total Quizzes" value={quizzes.length} icon="📋"
            gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" delay={0.05} />
          <StatCard label="Upcoming" value={upcomingCount} icon="⏳"
            gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" delay={0.1} />
          <StatCard label="Avg Score" value={`${avgScore}%`} icon="🎯"
            gradient="linear-gradient(135deg, #059669 0%, #0d9488 100%)" delay={0.15} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
          animation: 'slideUp 0.4s ease 0.2s both',
        }}>

          <div style={{
            display: 'flex',
            background: '#fff',
            borderRadius: 16,
            padding: 4,
            gap: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid #e8eaf0',
          }}>
            {[
              ['all', 'All'],
              ['upcoming', `Upcoming (${upcomingCount})`],
              ['completed', `Done (${completedCount})`],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="tab-btn"
                style={{
                  padding: '8px 18px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : 'transparent',
                  color: activeTab === tab ? '#fff' : '#64748b',
                  boxShadow: activeTab === tab ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="search-box quiz-search-box" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 14,
            padding: '10px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            width: 240,
            transition: 'all 0.2s ease',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="#94a3b8" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((quiz, idx) => {
            const c         = colorMap[quiz.color];
            const isHovered = hoveredId === quiz.id;

            return (
              <div
                key={quiz.id}
                className="quiz-card"
                onMouseEnter={() => setHoveredId(quiz.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  border: isHovered ? `1.5px solid ${c.ring}` : '1.5px solid #f1f5f9',
                  boxShadow: isHovered
                    ? `0 20px 48px ${c.glow}, 0 4px 16px rgba(0,0,0,0.08)`
                    : '0 2px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  animation: `slideUp 0.45s ease ${0.05 + idx * 0.07}s both`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'stretch' }}>

                  <div style={{
                    width: 5,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${c.strip}, ${c.stripLight})`,
                    borderRadius: '0',
                  }} />

                  <div className="quiz-card-body" style={{
                    flex: 1,
                    padding: '20px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                  }}>

                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: c.iconBg,
                      color: c.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 0 4px ${c.ring}`,
                      transform: isHovered ? 'scale(1.08) rotate(4deg)' : 'scale(1) rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}>
                      {quiz.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{
                          margin: 0, fontSize: 15, fontWeight: 800,
                          color: '#1e1b4b', letterSpacing: '-0.2px',
                        }}>
                          {quiz.title}
                        </h3>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          padding: '2px 9px', borderRadius: 20,
                          background: c.badgeBg, color: c.badgeColor,
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                          whiteSpace: 'nowrap',
                        }}>
                          {quiz.course}
                        </span>
                      </div>

                      <p style={{
                        margin: '0 0 10px', fontSize: 12, color: '#94a3b8',
                        lineHeight: 1.6, fontWeight: 500,
                      }}>
                        {quiz.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {[
                          {
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
                            text: quiz.date,
                          },
                          {
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                            text: `${quiz.time} · ${quiz.duration}`,
                          },
                          {
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
                            text: `${quiz.questions} Questions`,
                          },
                        ].map((m, i) => (
                          <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 11, color: '#64748b', fontWeight: 600,
                            background: '#f8fafc', padding: '4px 10px',
                            borderRadius: 8, border: '1px solid #e2e8f0',
                          }}>
                            <span style={{ color: '#94a3b8' }}>{m.icon}</span>
                            {m.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="quiz-card-right" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexShrink: 0,
                    }}>
                      {quiz.status === 'completed' && quiz.score !== undefined && (
                        <ScoreRing score={quiz.score} />
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>

                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800,
                          letterSpacing: '0.4px', textTransform: 'uppercase',
                          background: quiz.status === 'upcoming' ? '#ede9fe' : '#d1fae5',
                          color: quiz.status === 'upcoming' ? '#6d28d9' : '#065f46',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: quiz.status === 'upcoming' ? '#7c3aed' : '#10b981',
                            animation: quiz.status === 'upcoming' ? 'pulse 1.5s infinite' : 'none',
                            flexShrink: 0,
                          }} />
                          {quiz.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>

                        {quiz.status === 'upcoming' ? (
                          <button className="prepare-btn" style={{
                            fontSize: 12, fontWeight: 800,
                            padding: '7px 18px', borderRadius: 12,
                            background: `linear-gradient(135deg, ${c.strip}, ${c.stripLight})`,
                            color: '#fff',
                            boxShadow: `0 4px 12px ${c.glow}`,
                            letterSpacing: '0.2px',
                          }}>
                            Prepare →
                          </button>
                        ) : (
                          <button className="review-btn" style={{
                            fontSize: 12, fontWeight: 700,
                            padding: '7px 18px', borderRadius: 12,
                            background: '#f1f5f9', color: '#475569',
                          }}>
                            Review
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{
              padding: '72px 0',
              textAlign: 'center',
              animation: 'fadeIn 0.4s ease',
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
              <p style={{ color: '#374151', fontWeight: 800, fontSize: 17, margin: '0 0 6px' }}>
                No quizzes found
              </p>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, fontWeight: 500 }}>
                Try a different search or filter tab
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
