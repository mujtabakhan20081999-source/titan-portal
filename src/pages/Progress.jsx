import { useEffect, useState } from 'react';
import {
  FiHome,
  FiChevronRight,
  FiChevronDown,
  FiMessageSquare,
  FiBook,
  FiAward,
  FiClock,
  FiCheck,
} from 'react-icons/fi';
import '../styles/progress.css';

const modules = [
  {
    name: 'Web Designing Module',
    completed: 20,
    total: 20,
    topics: [
      { name: 'HTML5 Semantics', done: true },
      { name: 'CSS Flexbox & Grid', done: true },
      { name: 'Responsive Design', done: true },
      { name: 'Bootstrap Framework', done: true },
    ],
  },
  {
    name: 'Front-End Development',
    completed: 31,
    total: 31,
    topics: [
      { name: 'JavaScript ES6+', done: true },
      { name: 'DOM Manipulation', done: true },
      { name: 'React Fundamentals', done: true },
      { name: 'State & Props', done: true },
    ],
  },
  {
    name: 'Modern Front-End Development',
    completed: 13,
    total: 14,
    topics: [
      { name: 'React Router', done: true },
      { name: 'Context API', done: true },
      { name: 'Custom Hooks', done: true },
      { name: 'Performance Optimization', done: false },
    ],
  },
  {
    name: 'Back-End Development',
    completed: 1,
    total: 16,
    topics: [
      { name: 'Node.js Basics', done: true },
      { name: 'Express Framework', done: false },
      { name: 'REST APIs', done: false },
      { name: 'Database & MongoDB', done: false },
    ],
  },
];

function pct(c, t) {
  return t === 0 ? 0 : Math.round((c / t) * 100);
}

function ProgressRing({ percent, animate }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (animate ? percent : 0) / 100 * c;

  return (
    <div className="prog-ring">
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle className="prog-ring-track" cx="27" cy="27" r={r} fill="none" strokeWidth="5" />
        <circle
          className="prog-ring-fill"
          cx="27"
          cy="27"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="prog-ring-label">{percent}%</span>
    </div>
  );
}

function Progress() {
  const [openIndex, setOpenIndex] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 120);
    return () => clearTimeout(t);
  }, []);

  const totalTopics = modules.reduce((s, m) => s + m.total, 0);
  const completedTopics = modules.reduce((s, m) => s + m.completed, 0);
  const pendingTopics = totalTopics - completedTopics;

  return (
    <div className="progress-page">

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="progGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EB8317" />
            <stop offset="100%" stopColor="#F3C623" />
          </linearGradient>
        </defs>
      </svg>

      <div className="prog-topbar">
        <nav className="prog-breadcrumb">
          <span className="crumb"><FiHome size={16} /> Home</span>
          <FiChevronRight className="crumb-sep" size={14} />
          <span className="crumb">Modern Web Application Development</span>
          <FiChevronRight className="crumb-sep" size={14} />
          <span className="crumb current">Progress</span>
        </nav>
        <button type="button" className="prog-feedback-btn">
          <FiMessageSquare size={16} /> Feedback
        </button>
      </div>

      <div className="prog-stats">
        <div className="prog-stat-card">
          <div className="prog-stat-text">
            <span className="prog-stat-value">{totalTopics}</span>
            <span className="prog-stat-label">Total Topics</span>
          </div>
          <div className="prog-stat-icon total"><FiBook /></div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-text">
            <span className="prog-stat-value">{completedTopics}</span>
            <span className="prog-stat-label">Completed Topics</span>
          </div>
          <div className="prog-stat-icon completed"><FiAward /></div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-text">
            <span className="prog-stat-value">{pendingTopics}</span>
            <span className="prog-stat-label">Pending Topics</span>
          </div>
          <div className="prog-stat-icon pending"><FiClock /></div>
        </div>
      </div>

      <div className="prog-modules">
        {modules.map((m, i) => {
          const percent = pct(m.completed, m.total);
          const done = percent === 100;
          const open = openIndex === i;
          return (
            <div
              key={m.name}
              className={`prog-module ${open ? 'open' : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
            >
              <button
                type="button"
                className="prog-module-head"
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span className={`prog-module-status ${done ? 'done' : 'ongoing'}`}>
                  {done ? <FiCheck /> : <FiClock />}
                </span>
                <span className="prog-module-info">
                  <span className="prog-module-name">{m.name}</span>
                  <span className="prog-module-topics">Topics: {m.completed}/{m.total}</span>
                </span>
                <span className="prog-module-right">
                  <ProgressRing percent={percent} animate={animate} />
                  <FiChevronDown className="prog-chevron" />
                </span>
              </button>

              {open && (
                <div className="prog-module-body">
                  {m.topics.map((t) => (
                    <div
                      key={t.name}
                      className={`prog-topic-row ${t.done ? 'done' : 'pending'}`}
                    >
                      <span className="dot">{t.done ? <FiCheck /> : <FiClock />}</span>
                      {t.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Progress;
