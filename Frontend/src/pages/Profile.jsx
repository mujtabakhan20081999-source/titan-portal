import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiEdit2,
} from 'react-icons/fi';
import '../styles/profile.css';
import { getMyStudentProfile } from '../services/studentService';

const profiles = {
  student: {
    name: 'Mujtaba Khan',
    title: 'Student · TITAN Learning',
    initials: 'MK',
    email: 'student@titan.edu.pk',
    phone: '+92 300 1234567',
    city: 'Sukkur, Sindh',
    joined: 'Joined Sep 2024',
    bio: 'Dedicated student passionate about web development and consistent academic growth.',
    stats: [
      { icon: FiCheckCircle, label: 'Attendance', value: '85%',  color: '#16a34a' },
      { icon: FiBookOpen,    label: 'Courses',    value: '06',   color: '#1150c0' },
      { icon: FiAward,       label: 'Avg. Grade', value: 'A-',   color: '#d97706' },
    ],
    details: [
      { label: 'Enrollment ID', value: 'TS-2024-118' },
      { label: 'Program',       value: 'Full Stack Web Development' },
      { label: 'Batch',         value: 'Morning · 2024' },
      { label: 'Status',        value: 'Active' },
    ],
  },
  teacher: {
    name: 'Sir Yasir Ali',
    title: 'Trainer · TITAN Learning',
    initials: 'YA',
    email: 'siryasir@titan.edu.pk',
    phone: '+92 301 7654321',
    city: 'Sukkur, Sindh',
    joined: 'Joined Jan 2022',
    bio: 'Experienced trainer mentoring students in modern web technologies and best practices.',
    stats: [
      { icon: FiBookOpen,    label: 'Courses',  value: '04',  color: '#1150c0' },
      { icon: FiCheckCircle, label: 'Students', value: '128', color: '#16a34a' },
      { icon: FiAward,       label: 'Rating',   value: '4.9', color: '#d97706' },
    ],
    details: [
      { label: 'Staff ID',     value: 'TT-2022-007' },
      { label: 'Department',   value: 'Web Development' },
      { label: 'Experience',   value: '6 Years' },
      { label: 'Status',       value: 'Active' },
    ],
  },
};

function Profile({ role = 'student' }) {
  const navigate = useNavigate();
  const [studentRecord, setStudentRecord] = useState(null);

  useEffect(() => {
    if (role === 'student') getMyStudentProfile().then(setStudentRecord).catch(() => setStudentRecord(null));
  }, [role]);

  const p = studentRecord ? {
    name: studentRecord.name,
    title: 'Student · TITAN Learning',
    initials: studentRecord.name.split(' ').slice(0, 2).map((name) => name[0]).join('').toUpperCase(),
    email: studentRecord.email,
    phone: studentRecord.phone || 'Not provided',
    city: studentRecord.city || 'Not assigned',
    joined: studentRecord.createdAt ? `Joined ${new Date(studentRecord.createdAt).toLocaleDateString()}` : '',
    bio: `${studentRecord.course || 'Course'} student`,
    stats: [
      { icon: FiBookOpen, label: 'Course', value: studentRecord.course || '—', color: '#1150c0' },
      { icon: FiAward, label: 'Status', value: studentRecord.status || '—', color: '#16a34a' },
    ],
    details: [
      { label: 'Roll Number', value: studentRecord.roll },
      { label: 'Program', value: studentRecord.course || 'Not assigned' },
      { label: 'Batch', value: studentRecord.meta || 'Not assigned' },
      { label: 'Payment', value: studentRecord.pay || 'Not generated' },
    ],
  } : (profiles[role] || profiles.student);

  const contacts = [
    { icon: FiMail,     value: p.email },
    { icon: FiPhone,    value: p.phone },
    { icon: FiMapPin,   value: p.city },
    { icon: FiCalendar, value: p.joined },
  ];

  return (
    <div className="profile-page">

      <div className="profile-banner">
        <div className="profile-banner-overlay" />
        <div className="profile-banner-brand">
          <strong>TITAN</strong>
          <span>Learning Management System</span>
        </div>
      </div>

      <div className="profile-grid">

        <aside className="profile-id-card">
          <div className="profile-id-avatar">{p.initials}</div>
          <h2 className="profile-id-name">{p.name}</h2>
          <span className="profile-id-title">{p.title}</span>
          <p className="profile-id-bio">{p.bio}</p>

          <button
            type="button"
            className="profile-edit-btn"
            onClick={() => navigate('/settings')}
          >
            <FiEdit2 size={15} />
            Edit Profile
          </button>
        </aside>

        <section className="profile-main">
          <div className="profile-stats">
            {p.stats.map((s) => (
              <div key={s.label} className="profile-stat">
                <span className="profile-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>
                  <s.icon size={20} />
                </span>
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-info-card">
            <h3>Contact Information</h3>
            <div className="profile-contacts">
              {contacts.map((c, i) => (
                <div key={i} className="profile-contact">
                  <span className="profile-contact-icon"><c.icon size={16} /></span>
                  <span>{c.value}</span>
                </div>
              ))}
            </div>

            <h3 className="profile-info-subhead">Account Details</h3>
            <div className="profile-details">
              {p.details.map((d) => (
                <div key={d.label} className="profile-detail">
                  <span className="profile-detail-label">{d.label}</span>
                  <span className="profile-detail-value">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
