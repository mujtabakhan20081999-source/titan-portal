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
          <>
            <div className="cl-summary-grid">
              <article className="cl-summary-card attendance-card">
                <div className="cl-summary-card-title">Attendance</div>
                <div className="cl-summary-card-value">{attendancePercent}%</div>
                <div className="cl-summary-card-meta">{presentCount}/{totalSessions || 0} sessions present</div>
              </article>
              <article className="cl-summary-card fee-card">
                <div className="cl-summary-card-title">Fee Status</div>
                <div className="cl-summary-card-value">{feeStatus}</div>
                <div className="cl-summary-card-meta">{feeStatus === 'Paid' ? 'No dues outstanding' : 'Pending fee action'}</div>
              </article>
              <article className="cl-summary-card course-card">
                <div className="cl-summary-card-title">Program</div>
                <div className="cl-summary-card-value">{student.course || 'Not assigned'}</div>
                <div className="cl-summary-card-meta">{student.meta || 'Batch not assigned'}</div>
              </article>
            </div>

            <article className="cl-card cl-course-card">
              <div className="cl-course-head">
                <div>
                  <div className="cl-course-label">Current program</div>
                  <h2 className="cl-course-title">{student.course || 'Course not assigned'}</h2>
                  <p className="cl-course-subtitle">{student.city ? `${student.city} Campus · Roll ${student.roll || '0'}` : 'Campus not assigned'}</p>
                </div>
                <span className={`cl-course-pill ${courseStatus === 'Completed' ? 'completed' : 'enrolled'}`}>
                  {courseStatus}
                </span>
              </div>

              <div className="cl-course-details">
                <div className="cl-course-detail">
                  <span>Batch</span>
                  <strong>{student.meta || 'Not assigned'}</strong>
                </div>
                <div className="cl-course-detail">
                  <span>Roll</span>
                  <strong>{student.roll || '0'}</strong>
                </div>
                <div className="cl-course-detail">
                  <span>Payment</span>
                  <strong>{feeStatus}</strong>
                </div>
              </div>

              <div className="cl-progress-block">
                <div className="cl-progress-info">
                  <span>Course progress</span>
                  <strong>{courseProgress}% complete</strong>
                </div>
                <div className="cl-progress-track cl-course-progress-track">
                  <div
                    className="cl-progress-fill"
                    style={{ width: ready ? `${courseProgress}%` : '0%' }}
                  />
                </div>
              </div>

              <div className="cl-course-bottom">
                <div>
                  <span className="cl-course-metric-label">Sessions recorded</span>
                  <strong>{totalSessions}</strong>
                </div>
                <div>
                  <span className="cl-course-metric-label">Attendance rate</span>
                  <strong>{attendancePercent}%</strong>
                </div>
                <div>
                  <span className="cl-course-metric-label">Next action</span>
                  <strong>{feeStatus === 'Paid' ? 'Keep learning' : 'Pay fees'}</strong>
                </div>
              </div>

              <button
                type="button"
                className="cl-view-btn"
                onClick={() => navigate('/dashboard')}
              >
                <FiMousePointer size={18} /> View Details
              </button>
            </article>
          </>
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
