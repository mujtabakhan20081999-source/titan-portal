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
import { getMyTrainerProfile } from '../services/trainerService';
import { listMySlots } from '../services/slotService';
import { listAttendance } from '../services/attendanceService';

function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';
}

function formatJoined(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `Joined ${date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
}

function Profile({ role = 'student' }) {
  const navigate = useNavigate();
  const [studentRecord, setStudentRecord] = useState(null);
  const [trainerRecord, setTrainerRecord] = useState(null);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if (role === 'student') {
          const [student, attendance] = await Promise.all([
            getMyStudentProfile().catch(() => null),
            listAttendance().catch(() => []),
          ]);
          if (!mounted) return;
          setStudentRecord(student);
          setAttendanceRecords(attendance);
        } else if (role === 'teacher') {
          const [trainer, slotsResult] = await Promise.all([
            getMyTrainerProfile().catch(() => null),
            listMySlots().catch(() => ({ data: [] })),
          ]);
          if (!mounted) return;
          setTrainerRecord(trainer);
          setAssignedSlots(slotsResult.data || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [role]);

  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((record) => record.status === 'Present').length;
  const attendancePercent = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;
  const totalStudents = assignedSlots.reduce((sum, slot) => sum + (Number(slot.filled) || 0), 0);

  let p;
  if (role === 'student' && studentRecord) {
    p = {
      name: studentRecord.name,
      title: 'Student · TITAN Learning',
      initials: initialsFromName(studentRecord.name),
      email: studentRecord.email || 'Not provided',
      phone: studentRecord.phone || 'Not provided',
      city: studentRecord.city || 'Not assigned',
      joined: formatJoined(studentRecord.createdAt),
      bio: `${studentRecord.course || 'Course'} student`,
      stats: [
        { icon: FiBookOpen, label: 'Course', value: studentRecord.course || 'Not assigned', color: '#1150c0' },
        { icon: FiAward, label: 'Status', value: studentRecord.status || 'Not assigned', color: '#16a34a' },
        { icon: FiCheckCircle, label: 'Attendance', value: `${attendancePercent}%`, color: '#9333ea' },
      ],
      details: [
        { label: 'Roll Number', value: studentRecord.roll || '—' },
        { label: 'CNIC', value: studentRecord.cnic || '—' },
        { label: 'Program', value: studentRecord.course || 'Not assigned' },
        { label: 'Batch', value: studentRecord.meta || 'Not assigned' },
        { label: 'Payment', value: studentRecord.pay || '—' },
        { label: 'Attendance', value: `${attendancePercent}%` },
      ],
    };
  } else if (role === 'teacher' && trainerRecord) {
    p = {
      name: trainerRecord.fullName,
      title: 'Trainer · TITAN Learning',
      initials: initialsFromName(trainerRecord.fullName),
      email: trainerRecord.email || 'Not provided',
      phone: trainerRecord.phoneNumber || 'Not provided',
      city: trainerRecord.campus || 'Not assigned',
      joined: formatJoined(trainerRecord.joiningDate || trainerRecord.createdAt),
      bio: trainerRecord.qualification
        ? `${trainerRecord.qualification}${trainerRecord.experience ? ` · ${trainerRecord.experience} yrs experience` : ''}`
        : 'TITAN Learning trainer',
      stats: [
        { icon: FiBookOpen, label: 'Assigned Slots', value: String(assignedSlots.length), color: '#1150c0' },
        { icon: FiCheckCircle, label: 'Students', value: String(totalStudents), color: '#16a34a' },
        { icon: FiAward, label: 'Status', value: trainerRecord.status || 'Active', color: '#d97706' },
      ],
      details: [
        { label: 'Employee ID', value: trainerRecord.employeeId || '—' },
        { label: 'CNIC', value: trainerRecord.cnic || '—' },
        { label: 'Campus', value: trainerRecord.campus || '—' },
        { label: 'Gender', value: trainerRecord.gender || '—' },
        { label: 'Qualification', value: trainerRecord.qualification || '—' },
        { label: 'Experience', value: trainerRecord.experience != null ? `${trainerRecord.experience} Years` : '—' },
        { label: 'Joining Date', value: trainerRecord.joiningDate ? new Date(trainerRecord.joiningDate).toLocaleDateString() : '—' },
        { label: 'Status', value: trainerRecord.status || 'Active' },
      ],
    };
  } else {
    p = {
      name: loading ? 'Loading…' : 'Profile unavailable',
      title: role === 'teacher' ? 'Trainer · TITAN Learning' : 'Student · TITAN Learning',
      initials: '—',
      email: '—',
      phone: '—',
      city: '—',
      joined: '',
      bio: loading ? 'Fetching your profile…' : 'Unable to load profile. Please contact administration.',
      stats: [],
      details: [],
    };
  }

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
          {p.stats.length > 0 && (
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
          )}

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
              {p.details.length === 0 ? (
                <div style={{ padding: 12, color: '#64748b' }}>
                  {loading ? 'Loading account details…' : 'No account details available.'}
                </div>
              ) : (
                p.details.map((d) => (
                  <div key={d.label} className="profile-detail">
                    <span className="profile-detail-label">{d.label}</span>
                    <span className="profile-detail-value">{d.value}</span>
                  </div>
                ))
              )}
            </div>

            {role === 'student' && (
              <>
                <h3 className="profile-info-subhead" style={{ marginTop: 24 }}>Attendance History</h3>
                <div className="profile-attendance-list">
                  {attendanceRecords.length === 0 ? (
                    <div style={{ padding: 18, color: '#64748b' }}>No attendance history available.</div>
                  ) : (
                    attendanceRecords.slice(0, 6).map((record) => (
                      <div key={record._id} className="profile-attendance-row">
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                        <span>{record.status || 'Absent'}</span>
                        <span>{record.checkIn || '—'}</span>
                        <span>{record.remarks || '—'}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {role === 'teacher' && (
              <>
                <h3 className="profile-info-subhead" style={{ marginTop: 24 }}>Assigned Slots</h3>
                <div className="profile-attendance-list">
                  {assignedSlots.length === 0 ? (
                    <div style={{ padding: 18, color: '#64748b' }}>No slots assigned yet.</div>
                  ) : (
                    assignedSlots.map((slot) => (
                      <div key={slot._id || slot.slotId} className="profile-attendance-row">
                        <span>{slot.course}</span>
                        <span>{slot.campus}</span>
                        <span>{slot.days}</span>
                        <span>{slot.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
