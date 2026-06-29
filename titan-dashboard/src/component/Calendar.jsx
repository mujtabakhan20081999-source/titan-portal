import React, { useState } from 'react';

const today = new Date();

const quizzesByDay = {
  10: [{ title: 'JavaScript Quiz',   time: '09:00 AM', course: 'Modern Web App Development', students: 30, color: '#6366f1' }],
  17: [{ title: 'React Basics Quiz', time: '10:00 AM', course: 'Modern Web App Development', students: 30, color: '#0ea5e9' }],
  24: [{ title: 'HTML & CSS Quiz',   time: '09:00 AM', course: 'Little Geniuses Lab',        students: 12, color: '#10b981' }],
};

const baseEvents = {
  1:  ['Modern Web App'],
  3:  ['Modern Web App'],
  5:  ['Modern Web App'],
  6:  ['Little Geniuses', 'Little Geniuses'],
  7:  ['Little Geniuses', 'Little Geniuses'],
  8:  ['Modern Web App'],
  10: ['Modern Web App'],
  12: ['Modern Web App'],
  13: ['Little Geniuses', 'Little Geniuses'],
  14: ['Little Geniuses', 'Little Geniuses'],
  15: ['Modern Web App'],
  17: ['Modern Web App'],
  19: ['Modern Web App'],
  20: ['Little Geniuses', 'Little Geniuses'],
  21: ['Little Geniuses', 'Little Geniuses'],
  22: ['Modern Web App'],
  24: ['Modern Web App'],
  26: ['Modern Web App'],
  27: ['Little Geniuses', 'Little Geniuses'],
  28: ['Little Geniuses', 'Little Geniuses'],
  29: ['Modern Web App'],
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [selectedDay, setSelectedDay]   = useState(null);
  const [currentDate, setCurrentDate]   = useState(new Date(2026, 5, 1));

  const changeMonth = (dir) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + dir);
      return d;
    });
    setSelectedDay(null);
  };

  const getDaysInMonth = () => {
    const year      = currentDate.getFullYear();
    const month     = currentDate.getMonth();
    const firstDay  = new Date(year, month, 1).getDay();
    const total     = new Date(year, month + 1, 0).getDate();
    const prevTotal = new Date(year, month, 0).getDate();
    const cells     = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ dayNum: prevTotal - i, isCurrentMonth: false });
    for (let i = 1; i <= total; i++)         cells.push({ dayNum: i,             isCurrentMonth: true });
    const rem = 42 - cells.length;
    for (let i = 1; i <= rem; i++)           cells.push({ dayNum: i,             isCurrentMonth: false });
    return cells;
  };

  const isToday = (cell) =>
    cell.isCurrentMonth &&
    cell.dayNum === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayCells        = getDaysInMonth();
  const selectedEvents  = selectedDay ? baseEvents[selectedDay]   : null;
  const selectedQuizzes = selectedDay ? quizzesByDay[selectedDay] : null;

  const totalClasses = Object.values(baseEvents).reduce((a, b) => a + b.length, 0);
  const totalQuizzes = Object.keys(quizzesByDay).length;

  return (
    <div className="cal-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '32px 28px',
      boxSizing: 'border-box',
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .cal-day-cell {
          transition: background 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
          position: relative;
          min-height: 100px;
          min-width: 0;
          box-sizing: border-box;
          padding: 8px 7px 6px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .cal-day-cell > div { min-width: 0; }
        .cal-day-cell:hover {
          background: #f0f4ff !important;
          z-index: 1;
        }
        .nav-btn {
          transition: background 0.18s ease, transform 0.18s ease;
          border: none;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.18);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.32) !important;
          transform: scale(1.08);
        }
        .event-pill {
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 5px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          line-height: 1.5;
        }
        .side-event-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .side-event-card:hover {
          transform: translateX(3px);
        }
        .stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e8edf5;
          transition: background 0.15s ease;
          margin-bottom: 8px;
        }
        .stat-row:last-child { margin-bottom: 0; }
        .stat-row:hover { background: #f0f4ff; }

        @media (max-width: 900px) {
          .cal-page { padding: 22px 16px !important; }
          .cal-main { flex-direction: column !important; }
          .cal-side { width: 100% !important; }
          .cal-title { font-size: 24px !important; }
        }
        @media (max-width: 560px) {
          .cal-page { padding: 16px 12px !important; }
          .cal-day-cell { min-height: 60px !important; padding: 5px 3px 4px !important; gap: 2px !important; }
          .event-pill { font-size: 8px !important; padding: 1px 3px !important; }
          .cal-daynum { width: 22px !important; height: 22px !important; font-size: 11px !important; }
        }
        @media (max-width: 380px) {
          .cal-day-cell { min-height: 50px !important; }
        }
      `}</style>

      <div style={{ animation: 'slideUp 0.4s ease both', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Dashboard</span>
          <span style={{ color: '#cbd5e1', fontSize: 12 }}>›</span>
          <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>Calendar</span>
        </div>
        <h1 className="cal-title" style={{ margin: 0, fontSize: 30, fontWeight: 900, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          My Calendar
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b', fontWeight: 500 }}>
          Track your class schedules and upcoming quizzes
        </p>
      </div>

      <div className="cal-main" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', animation: 'slideUp 0.45s ease 0.05s both' }}>

        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 40px rgba(79,70,229,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1.5px solid #e8edf5',
          overflow: 'hidden',
        }}>

          <div style={{
            background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #7c3aed 100%)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button className="nav-btn" onClick={() => changeMonth(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 2 }}>
                {currentDate.getFullYear()}
              </div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long' })}
              </div>
            </div>

            <button className="nav-btn" onClick={() => changeMonth(1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '10px 22px',
            background: '#fafbff',
            borderBottom: '1px solid #eef0f8',
          }}>
            {[
              { dot: '#10b981', label: 'Class' },
              { dot: '#8b5cf6', label: 'Quiz' },
              { dot: '#3b5ffe', label: 'Today' },
            ].map((l, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: l.dot, display: 'inline-block',
                  boxShadow: `0 0 4px ${l.dot}88`,
                }} />
                {l.label}
              </span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #eef0f8' }}>
            {weekdays.map((d, i) => (
              <div key={i} style={{
                padding: '11px 0',
                textAlign: 'center',
                fontSize: 10,
                fontWeight: 800,
                color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                background: '#fafbff',
              }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {dayCells.map((cell, idx) => {
              const hasEvent   = cell.isCurrentMonth && baseEvents[cell.dayNum];
              const hasQuiz    = cell.isCurrentMonth && quizzesByDay[cell.dayNum];
              const todayCell  = isToday(cell);
              const isSelected = cell.isCurrentMonth && selectedDay === cell.dayNum;
              const col        = idx % 7;
              const row        = Math.floor(idx / 7);
              const totalRows  = Math.ceil(dayCells.length / 7);

              let bgColor = '#fff';
              if (!cell.isCurrentMonth) bgColor = '#f9fafb';
              else if (isSelected)      bgColor = '#eef2ff';
              else if (col === 0)       bgColor = '#fffbfb';
              else if (col === 6)       bgColor = '#f8fbff';

              return (
                <div
                  key={idx}
                  className="cal-day-cell"
                  onClick={() => cell.isCurrentMonth && setSelectedDay(isSelected ? null : cell.dayNum)}
                  style={{
                    background: bgColor,
                    borderRight:  col < 6 ? '1px solid #eef0f8' : 'none',
                    borderBottom: row < totalRows - 1 ? '1px solid #eef0f8' : 'none',
                    boxShadow: isSelected ? 'inset 0 0 0 2px #6366f1' : 'none',
                  }}
                >

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span className="cal-daynum" style={{
                      width: 26, height: 26,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: 12,
                      fontWeight: todayCell ? 900 : isSelected ? 800 : 600,
                      color: !cell.isCurrentMonth ? '#d1d5db'
                        : todayCell ? '#fff'
                        : isSelected ? '#4f46e5'
                        : col === 0 ? '#f87171'
                        : col === 6 ? '#60a5fa'
                        : '#374151',
                      background: todayCell
                        ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                        : isSelected
                        ? 'rgba(99,102,241,0.12)'
                        : 'transparent',
                      boxShadow: todayCell ? '0 4px 10px rgba(99,102,241,0.4)' : 'none',
                      flexShrink: 0,
                      transition: 'all 0.18s ease',
                    }}>
                      {cell.dayNum}
                    </span>

                    {hasQuiz && (
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#8b5cf6',
                        boxShadow: '0 0 5px rgba(139,92,246,0.6)',
                        animation: 'pulse 2s infinite',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                    {hasEvent && baseEvents[cell.dayNum].slice(0, 2).map((ev, eIdx) => (
                      <span key={eIdx} className="event-pill" style={{
                        background: ev.includes('Little') ? '#ecfdf5' : '#eff6ff',
                        color:      ev.includes('Little') ? '#065f46' : '#1e40af',
                        border:     `1px solid ${ev.includes('Little') ? '#a7f3d0' : '#bfdbfe'}`,
                      }}>
                        {ev.includes('Little') ? '🧠 ' : '💻 '}{ev}
                      </span>
                    ))}
                    {hasQuiz && quizzesByDay[cell.dayNum].map((q, qIdx) => (
                      <span key={qIdx} className="event-pill" style={{
                        background: '#f5f3ff',
                        color: '#5b21b6',
                        border: '1px solid #ddd6fe',
                      }}>
                        📝 {q.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cal-side" style={{ width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            background: '#fff',
            borderRadius: 22,
            boxShadow: '0 8px 32px rgba(79,70,229,0.10), 0 2px 8px rgba(0,0,0,0.05)',
            border: '1.5px solid #e8edf5',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            opacity: selectedDay ? 1 : 0.75,
          }}>

            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              padding: '18px 20px 16px',
              position: 'relative',
              overflow: 'hidden',
            }}>

              <div style={{
                position: 'absolute', top: -18, right: -18,
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
              }} />
              <div style={{
                position: 'absolute', bottom: -24, right: 24,
                width: 50, height: 50, borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
              }} />

              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.65)',
                fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '2px', marginBottom: 6,
              }}>
                {selectedDay
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : 'Select a day'}
              </div>
              <div style={{
                fontSize: 44, fontWeight: 900, color: '#fff',
                lineHeight: 1, letterSpacing: '-2px',
              }}>
                {selectedDay ?? '—'}
              </div>
              {selectedDay && (
                <div style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600, marginTop: 4,
                }}>
                  {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)
                    .toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 16px 18px' }}>
              {!selectedDay && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                    Click any date to see events
                  </p>
                </div>
              )}

              {selectedDay && !selectedEvents && !selectedQuizzes && (
                <div style={{ textAlign: 'center', padding: '20px 0', animation: 'scaleIn 0.3s ease' }}>
                  <div style={{ fontSize: 34, marginBottom: 8 }}>🎉</div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: '#374151' }}>
                    Free Day!
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                    No classes or quizzes scheduled
                  </p>
                </div>
              )}

              {selectedEvents && (
                <div style={{ marginBottom: 12, animation: 'slideUp 0.3s ease both' }}>
                  <div style={{
                    fontSize: 9, fontWeight: 800, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                    marginBottom: 8,
                  }}>
                    Classes
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {selectedEvents.map((ev, i) => (
                      <div key={i} className="side-event-card" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: ev.includes('Little') ? '#ecfdf5' : '#eff6ff',
                        border: `1px solid ${ev.includes('Little') ? '#a7f3d0' : '#bfdbfe'}`,
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                          background: ev.includes('Little') ? '#10b981' : '#3b82f6',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 14,
                        }}>
                          {ev.includes('Little') ? '🧠' : '💻'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: 11, fontWeight: 800,
                            color: ev.includes('Little') ? '#065f46' : '#1e40af',
                            lineHeight: 1.3,
                          }}>
                            {ev}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: 1 }}>
                            Class Session
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedQuizzes && (
                <div style={{ animation: 'slideUp 0.35s ease 0.05s both' }}>
                  <div style={{
                    fontSize: 9, fontWeight: 800, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                    marginBottom: 8,
                  }}>
                    Quizzes
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {selectedQuizzes.map((q, i) => (
                      <div key={i} className="side-event-card" style={{
                        borderRadius: 14,
                        background: '#f5f3ff',
                        border: '1px solid #ddd6fe',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          background: 'linear-gradient(90deg, #7c3aed, #6366f1)',
                          padding: '8px 12px',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{ fontSize: 14 }}>📝</span>
                          <span style={{
                            fontSize: 11, fontWeight: 800, color: '#fff',
                            lineHeight: 1.3, flex: 1,
                          }}>
                            {q.title}
                          </span>
                        </div>
                        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {[
                            { label: '🕐 Time', val: q.time },
                            { label: '👥 Students', val: q.students },
                            { label: '📚 Course', val: q.course.length > 20 ? q.course.slice(0,20)+'…' : q.course },
                          ].map((row, ri) => (
                            <div key={ri} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                              <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 600 }}>{row.label}</span>
                              <span style={{ fontSize: 10, color: '#4c1d95', fontWeight: 700 }}>{row.val}</span>
                            </div>
                          ))}
                          <div style={{ marginTop: 4 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 20,
                              background: 'linear-gradient(90deg, #7c3aed, #6366f1)',
                              color: '#fff', fontSize: 9, fontWeight: 800,
                              letterSpacing: '0.5px', textTransform: 'uppercase',
                            }}>
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%',
                                background: '#fff', animation: 'pulse 1.5s infinite',
                              }} />
                              Upcoming
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 22,
            boxShadow: '0 8px 32px rgba(79,70,229,0.08), 0 2px 8px rgba(0,0,0,0.05)',
            border: '1.5px solid #e8edf5',
            padding: '18px 18px 16px',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '2px',
              marginBottom: 14,
            }}>
              This Month
            </div>

            {[
              { label: 'Total Classes', value: totalClasses, icon: '📚', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
              { label: 'Quizzes',       value: totalQuizzes, icon: '📝', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
              { label: 'Courses',       value: 2,            icon: '🎓', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
            ].map((s, i) => (
              <div key={i} className="stat-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: s.bg, border: `1px solid ${s.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{s.label}</span>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 900,
                  color: s.color,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  padding: '3px 12px',
                  borderRadius: 20,
                }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
