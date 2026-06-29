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
import '../styles/courses.css';

const enrolledCourses = [
  {
    id: 1,
    title: 'Modern Web Application Development',
    progress: 80,
    batch: '1',
    roll: '467709',
    campus: 'Saylani TITAN Sukkur',
    city: 'Sukkur',
  },
];

function MyCourses() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
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
        {enrolledCourses.map((c) => (
          <article className="cl-card" key={c.id}>
            <div className="cl-card-head">
              <h2 className="cl-card-title">{c.title}</h2>
              <span className="cl-badge">ENROLLED</span>
            </div>

            <div>
              <div className="cl-progress-top">
                <span className="label">Progress</span>
                <span className="value">{c.progress}% Completed</span>
              </div>
              <div className="cl-progress-track">
                <div
                  className="cl-progress-fill"
                  style={{ width: ready ? `${c.progress}%` : '0%' }}
                />
              </div>
            </div>

            <div className="cl-meta">
              <span className="cl-meta-item">
                <FiHash size={16} />
                <span className="k">Batch:</span> <span className="v">{c.batch}</span>
              </span>
              <span className="cl-meta-item">
                <FiAward size={16} />
                <span className="k">Roll:</span> <span className="v">{c.roll}</span>
              </span>
              <span className="cl-meta-item">
                <FiMapPin size={16} />
                <span className="k">Campus:</span> <span className="v">{c.campus}</span>
              </span>
              <span className="cl-meta-item">
                <FiMapPin size={16} />
                <span className="k">City:</span> <span className="v">{c.city}</span>
              </span>
            </div>

            <button
              type="button"
              className="cl-view-btn"
              onClick={() => navigate('/dashboard')}
            >
              <FiMousePointer size={18} /> View Details
            </button>
          </article>
        ))}
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
