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
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const colorMap = {
  indigo:  { bg: 'bg-indigo-50',  icon: 'bg-indigo-100 text-indigo-600',  badge: 'bg-indigo-100 text-indigo-700',  ring: 'ring-indigo-200',  bar: 'bg-indigo-500' },
  cyan:    { bg: 'bg-cyan-50',    icon: 'bg-cyan-100 text-cyan-600',      badge: 'bg-cyan-100 text-cyan-700',      ring: 'ring-cyan-200',    bar: 'bg-cyan-500' },
  orange:  { bg: 'bg-orange-50',  icon: 'bg-orange-100 text-orange-600',  badge: 'bg-orange-100 text-orange-700',  ring: 'ring-orange-200',  bar: 'bg-orange-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200', bar: 'bg-emerald-500' },
  teal:    { bg: 'bg-teal-50',    icon: 'bg-teal-100 text-teal-600',      badge: 'bg-teal-100 text-teal-700',      ring: 'ring-teal-200',    bar: 'bg-teal-500' },
};

function ScoreRing({ score }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function Quiz() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = quizzes.filter(q => {
    const matchTab = activeTab === 'all' || q.status === activeTab;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.course.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const upcomingCount = quizzes.filter(q => q.status === 'upcoming').length;
  const completedCount = quizzes.filter(q => q.status === 'completed').length;
  const avgScore = Math.round(quizzes.filter(q => q.score).reduce((a, b) => a + b.score, 0) / completedCount);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">

      <div className="px-7 pt-7 pb-8">

        {/* Page Title */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
          <span>Dashboard</span><span>›</span><span className="text-blue-600">Quizzes</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Quizzes</h1>
        <p className="text-slate-500 text-sm mt-1">Track your upcoming and completed quizzes</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
          {[
            { label: 'Total Quizzes', value: quizzes.length, icon: '📋', bg: 'from-blue-500 to-indigo-600' },
            { label: 'Upcoming', value: upcomingCount, icon: '⏳', bg: 'from-violet-500 to-purple-600' },
            { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯', bg: 'from-emerald-500 to-teal-600' },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black leading-none">{s.value}</div>
              <div className="text-sm text-white/80 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
            {[['all', 'All'], ['upcoming', `Upcoming (${upcomingCount})`], ['completed', `Done (${completedCount})`]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm w-full sm:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 bg-transparent outline-none w-full placeholder-slate-400"
            />
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((quiz) => {
            const c = colorMap[quiz.color];
            const isHovered = hoveredId === quiz.id;
            return (
              <div
                key={quiz.id}
                onMouseEnter={() => setHoveredId(quiz.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-300
                  ${isHovered ? 'shadow-2xl -translate-y-1 border-slate-200' : 'shadow-md'}
                `}
              >
                <div className="flex items-stretch">
                  {/* Left color strip */}
                  <div className={`w-1.5 shrink-0 ${c.bar}`} />

                  <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center shrink-0 ring-4 ${c.ring} transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
                      {quiz.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-black text-slate-800">{quiz.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${c.badge}`}>
                          {quiz.course}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{quiz.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                          {quiz.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {quiz.time} · {quiz.duration}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                          {quiz.questions} Questions
                        </span>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 shrink-0">
                      {quiz.status === 'completed' && quiz.score !== undefined && (
                        <ScoreRing score={quiz.score} />
                      )}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
                          quiz.status === 'upcoming'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${quiz.status === 'upcoming' ? 'bg-violet-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          {quiz.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>
                        {quiz.status === 'upcoming' && (
                          <button className={`text-xs font-bold px-4 py-1.5 rounded-full ${c.bar} text-white hover:opacity-90 transition-opacity`}>
                            Prepare →
                          </button>
                        )}
                        {quiz.status === 'completed' && (
                          <button className="text-xs font-bold px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
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
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 font-bold text-lg">No quizzes found</p>
              <p className="text-slate-400 text-sm mt-1">Try a different search or tab</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
