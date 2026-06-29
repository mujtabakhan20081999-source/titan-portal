import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBell,
  faCode,
  faPenRuler,
  faFileCode,
  faLaptopCode,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/assignments.css';

const assignmentsData = [
  {
    id: 1,
    icon: faCode,
    title: 'React JS Assignment',
    desc: 'Build a responsive web app using React.',
    dueDate: '29 May 2026',
    status: 'Pending',
  },
  {
    id: 2,
    icon: faFileCode,
    title: 'JavaScript Basics',
    desc: 'Solve the given JavaScript problems.',
    dueDate: '18 May 2026',
    status: 'Submitted',
  },
  {
    id: 3,
    icon: faPenRuler,
    title: 'UI/UX Design Task',
    desc: 'Create a modern dashboard UI in Figma.',
    dueDate: '15 May 2026',
    status: 'Pending',
  },
  {
    id: 4,
    icon: faLaptopCode,
    title: 'HTML & CSS Assignment',
    desc: 'Build a personal portfolio using HTML & CSS.',
    dueDate: '10 May 2026',
    status: 'Completed',
  },
  {
    id: 5,
    icon: faLayerGroup,
    title: 'Bootstrap Assignment',
    desc: 'Build a responsive website using Bootstrap.',
    dueDate: '05 May 2026',
    status: 'Submitted',
  },
  {
    id: 6,
    icon: faCode,
    title: 'Node JS Assignment',
    desc: 'Create a simple REST API using Node.js.',
    dueDate: '02 May 2026',
    status: 'Completed',
  },
  {
    id: 7,
    icon: faCode,
    title: 'ES6 Features',
    desc: 'Practice arrow functions, promises, and async/await.',
    dueDate: '28 April 2026',
    status: 'Pending',
  },
];

function Assignments() {
  const [filter, setFilter] = useState('All');

  const filteredData = assignmentsData.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Submitted') return item.status === 'Submitted' || item.status === 'Completed';
    return item.status === filter;
  });

  const pendingCount = assignmentsData.filter((i) => i.status === 'Pending').length;
  const submittedCount = assignmentsData.filter(
    (i) => i.status === 'Submitted' || i.status === 'Completed'
  ).length;

  return (
    <div className="assignments-page">

      <header className="asgn-header">
        <div className="asgn-header-left">
          <h1>Assignments</h1>
          <div className="asgn-breadcrumb">
            <span>
              Dashboard
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ fontSize: '10px', color: 'var(--text-muted, #788293)' }}
              />
              Assignments
            </span>
          </div>
        </div>

        <div className="asgn-header-right">
          <div className="asgn-icon-btn">
            <FontAwesomeIcon icon={faBell} style={{ fontSize: '18px' }} />
            <span className="asgn-notif-badge">3</span>
          </div>
          <div className="asgn-icon-btn">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_x6NNYAH91WrxPQxhwGYyP1__DcgwqftUeGfjIPhcew&s=10"
              alt="profile"
            />
          </div>
          <div className="asgn-user-text">
            <span className="asgn-user-name">Ali Raza</span>
            <span className="asgn-user-role">Student</span>
          </div>
        </div>
      </header>

      <div className="asgn-tabs">
        <button
          className={`asgn-tab-btn${filter === 'All' ? ' active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Assignments
        </button>
        <button
          className={`asgn-tab-btn${filter === 'Pending' ? ' active' : ''}`}
          onClick={() => setFilter('Pending')}
        >
          Pending <span className="asgn-tab-count">({pendingCount})</span>
        </button>
        <button
          className={`asgn-tab-btn${filter === 'Submitted' ? ' active' : ''}`}
          onClick={() => setFilter('Submitted')}
        >
          Submitted <span className="asgn-tab-count">({submittedCount})</span>
        </button>
      </div>

      <div className="asgn-list">
        {filteredData.map((item) => (
          <div className="asgn-card" key={item.id}>
            <div className="asgn-card-left">
              <div className="asgn-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className="asgn-card-content">
                <span className="asgn-title">{item.title}</span>
                <p className="asgn-desc">{item.desc}</p>
              </div>
            </div>
            <div className="asgn-card-right">
              <div className="asgn-due">
                <span className="asgn-due-label">Due Date</span>
                <span className="asgn-due-value">{item.dueDate}</span>
              </div>
              <button className={`asgn-status asgn-status-${item.status.toLowerCase()}`}>
                {item.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;
