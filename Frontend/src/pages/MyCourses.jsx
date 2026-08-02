import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiChevronDown,
  FiMessageSquare,
  FiHash,
  FiAward,
  FiMapPin,
  FiMousePointer,
  FiStar,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import titanLogo from '../assets/TITAN LOGO without BG.png';
import { getMyStudentProfile } from '../services/studentService';
import { listAttendance } from '../services/attendanceService';
import '../styles/courses.css';

function MyCourses() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [student, setStudent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadError, setLoadError] = useState('');

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalSessions = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((record) => record.status === 'Present').length;
  const attendancePercent = totalSessions ? Math.round((presentCount / totalSessions) * 100) : 0;
  const feeStatus = student?.pay || 'Not generated';
  const courseProgress = student?.status === 'Completed' ? 100 : attendancePercent;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    getMyStudentProfile().then(setStudent).catch((error) => {
      setLoadError(error?.response?.data?.message || 'Unable to load your student profile.');
    });

    listAttendance().then(setAttendanceRecords).catch(() => {
      setAttendanceRecords([]);
    });
  }, []);

  const openFeedback = () => {
    setSubmitted(false);
    setRating(0);
    setHoverRating(0);
    setMessage('');
    setFeedbackOpen(true);
  };

  const closeFeedback = () => setFeedbackOpen(false);

  const submitFeedback = (e) => {
    e.preventDefault();
    if (rating === 0 || !message.trim()) return;

    const saved = JSON.parse(localStorage.getItem('titan_feedback') || '[]');
    saved.push({ rating, message: message.trim(), date: new Date().toISOString() });
    localStorage.setItem('titan_feedback', JSON.stringify(saved));
    setSubmitted(true);
  };

  const courseStatus = student?.status || 'Enrolled';

  return (
    <div className="courses-landing">

      <header className="cl-topbar">
        <div className="cl-brand">
          <div className="cl-brand-logo">
            <img src={titanLogo} alt="Titan Logo" />
          </div>
          <div className="cl-brand-text">
            <strong>TITAN</strong>
            <span>Learning System</span>
          </div>
        </div>

        <div className="cl-topbar-center">
          <label className="cl-search">
            <FiSearch size={18} />
            <input type="search" placeholder="Search Course" />
          </label>
          <span className="cl-filter">
            ENROLLED <FiChevronDown size={16} />
          </span>
        </div>

        <button type="button" className="cl-feedback" onClick={openFeedback}>
          <FiMessageSquare size={16} /> Feedback
        </button>
      </header>

      <div className="cl-body">
        {loadError && <div className="cl-card" style={{ color: '#b91c1c' }}>{loadError}</div>}
        {!student && !loadError && <div className="cl-card">Loading your course details…</div>}
        {student && (
          <article className={`cl-hero-card${ready ? ' ready' : ''}`}>
            <div className="cl-hero-glow" aria-hidden="true" />

            <div className="cl-hero-top">
              <div className="cl-hero-identity">
                <div className="cl-hero-avatar">{(student.name || 'S').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
                <div>
                  <p className="cl-hero-kicker">Welcome back</p>
                  <h1 className="cl-hero-name">{student.name || 'Student'}</h1>
                  <p className="cl-hero-sub">
                    <FiMapPin size={14} />
                    {student.campus || student.city || 'Campus'} · Roll {student.roll || '—'}
                  </p>
                </div>
              </div>
              <span className={`cl-hero-status ${courseStatus === 'Completed' ? 'done' : 'active'}`}>
                {courseStatus}
              </span>
            </div>

            <div className="cl-hero-program">
              <div>
                <span className="cl-hero-label">Current program</span>
                <h2>{student.course || 'Course not assigned'}</h2>
                <p>{student.meta || student.batch || 'Batch not assigned'} · {student.slot || 'Slot pending'}</p>
              </div>
              <div className="cl-hero-progress-ring" style={{ '--p': courseProgress }}>
                <strong>{courseProgress}%</strong>
                <span>Progress</span>
              </div>
            </div>

            <div className="cl-hero-stats">
              <div className="cl-hero-stat">
                <span>Attendance</span>
                <strong>{attendancePercent}%</strong>
                <small>{presentCount}/{totalSessions || 0} sessions</small>
              </div>
              <div className="cl-hero-stat">
                <span>Fee status</span>
                <strong className={feeStatus === 'Paid' ? 'ok' : 'warn'}>{feeStatus}</strong>
                <small>{feeStatus === 'Paid' ? 'No dues outstanding' : 'Action needed'}</small>
              </div>
              <div className="cl-hero-stat">
                <span>Sessions</span>
                <strong>{totalSessions}</strong>
                <small>Recorded so far</small>
              </div>
              <div className="cl-hero-stat">
                <span>Next step</span>
                <strong>{feeStatus === 'Paid' ? 'Keep learning' : 'Pay fees'}</strong>
                <small>{student.email || 'Student portal'}</small>
              </div>
            </div>

            <div className="cl-hero-bar-wrap">
              <div className="cl-hero-bar-labels">
                <span>Course completion</span>
                <strong>{courseProgress}%</strong>
              </div>
              <div className="cl-hero-bar">
                <div style={{ width: ready ? `${courseProgress}%` : '0%' }} />
              </div>
            </div>

            <div className="cl-hero-actions">
              <button type="button" className="cl-hero-btn primary" onClick={() => navigate('/dashboard')}>
                <FiMousePointer size={17} /> Open Dashboard
              </button>
              <button type="button" className="cl-hero-btn ghost" onClick={() => navigate('/payment')}>
                <FiAward size={17} /> {feeStatus === 'Paid' ? 'View Payments' : 'Pay Fees'}
              </button>
            </div>
          </article>
        )}
      </div>

      {feedbackOpen && (
        <div className="cl-modal-overlay" onClick={closeFeedback}>
          <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="cl-modal-success">
                <div className="cl-success-icon"><FiCheck /></div>
                <h3>Thank you!</h3>
                <p>Your feedback has been submitted successfully.</p>
                <button type="button" className="cl-btn-submit" onClick={closeFeedback}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="cl-modal-head">
                  <div>
                    <h3>Share your Feedback</h3>
                    <p>Help us improve your learning experience.</p>
                  </div>
                  <button type="button" className="cl-modal-close" onClick={closeFeedback} aria-label="Close">
                    <FiX size={18} />
                  </button>
                </div>

                <form onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="cl-field-label">How would you rate this course?</label>
                    <div className="cl-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          className={`cl-star ${n <= (hoverRating || rating) ? 'filled' : ''}`}
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${n} star`}
                        >
                          <FiStar size={28} fill={n <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="cl-field-label">Your message</label>
                    <textarea
                      className="cl-textarea"
                      placeholder="Tell us what you think..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="cl-modal-actions">
                    <button type="button" className="cl-btn-ghost" onClick={closeFeedback}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cl-btn-submit"
                      disabled={rating === 0 || !message.trim()}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCourses;
