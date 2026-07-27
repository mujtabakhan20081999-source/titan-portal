import { useState } from 'react';
import {
  ArrowLeft, Users, ClipboardList, HelpCircle, Clock, CalendarDays, User,
  CheckCircle, XCircle, Plus, X, Mail,
} from 'lucide-react';

/* ── Mock student roster keyed by course code ───────────────────────────── */
const rosterByCode = {
  MWAD: [
    { id: 1,  name: 'Abdul Jabbar',   roll: '477526', email: 'abjabbargopang@gmail.com', status: 'ENROLLED' },
    { id: 2,  name: 'Abdul Rafay',    roll: '469955', email: 'rafaygameti0345@gmail.com', status: 'ENROLLED' },
    { id: 3,  name: 'Abdullah Khan',  roll: '470278', email: 'ak1636802@gmail.com',       status: 'ENROLLED' },
    { id: 4,  name: 'Ali Hassan',     roll: '483421', email: 'ali.hassan456@gmail.com',   status: 'ENROLLED' },
    { id: 5,  name: 'Bilal Ahmed',    roll: '485678', email: 'bilal.a0345@gmail.com',     status: 'ENROLLED' },
    { id: 6,  name: 'Faisal Mehmood', roll: '486789', email: 'faisal.m234@gmail.com',     status: 'PENDING'  },
    { id: 7,  name: 'Hamid Raza',     roll: '488901', email: 'hamid.raza567@gmail.com',   status: 'PENDING'  },
    { id: 8,  name: 'Imran Khan',     roll: '492345', email: 'imran.k2345@gmail.com',     status: 'PENDING'  },
  ],
  LGAL: [
    { id: 1, name: 'Abdul Salam Shaikh', roll: '475436', email: 'abdulsalam06699@gmail.com', status: 'ENROLLED' },
    { id: 2, name: 'Aisha Siddiqui',     roll: '481234', email: 'aisha.s2345@gmail.com',      status: 'ENROLLED' },
    { id: 3, name: 'Amna Fatima',        roll: '484567', email: 'amna.fatima789@gmail.com',   status: 'ENROLLED' },
    { id: 4, name: 'Hina Malik',         roll: '490123', email: 'hina.malik123@gmail.com',    status: 'PENDING'  },
    { id: 5, name: 'Komal Shaukat',      roll: '494567', email: 'komal.shaukat@gmail.com',    status: 'PENDING'  },
  ],
};

function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const hue = name.charCodeAt(0) * 15;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 55%, 72%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const statusStyle = {
  ENROLLED:  { color: '#16a34a', border: '#16a34a', bg: '#f0fdf4' },
  PENDING:   { color: '#d97706', border: '#d97706', bg: '#fffbeb' },
  CANCELLED: { color: '#dc2626', border: '#dc2626', bg: '#fef2f2' },
};

function StatusBadge({ status }) {
  const s = statusStyle[status] || statusStyle.ENROLLED;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
      border: `1.5px solid ${s.border}`, color: s.color, background: s.bg,
      borderRadius: 6, padding: '3px 10px', width: 'fit-content',
    }}>
      {status}
    </span>
  );
}

/* ── Assign form modal (works for both Assignment & Quiz) ───────────────── */
function AssignModal({ kind, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [extra, setExtra] = useState(''); // duration for quiz, total marks for assignment

  const isQuiz = kind === 'quiz';
  const accent = isQuiz ? '#9333ea' : '#2563eb';

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;
    onSave({ title: title.trim(), date: date.trim(), extra: extra.trim() });
  };

  const field = {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14,
    border: '1px solid #e0e6f0', outline: 'none', color: '#10375C', background: '#f8fafc',
  };
  const label = { fontSize: 12, fontWeight: 600, color: '#5F7A9E', marginBottom: 6, display: 'block' };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(16,55,92,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#10375C' }}>
            {isQuiz ? 'Assign New Quiz' : 'Assign New Assignment'}
          </h3>
          <button type="button" onClick={onClose} style={{ color: '#5F7A9E', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div>
          <label style={label}>{isQuiz ? 'Quiz Title' : 'Assignment Title'}</label>
          <input style={field} value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={isQuiz ? 'e.g. React Hooks & State' : 'e.g. Build a Portfolio Page'} autoFocus />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>{isQuiz ? 'Quiz Date' : 'Due Date'}</label>
            <input style={field} value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 15 Jul 2026" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>{isQuiz ? 'Duration' : 'Total Marks'}</label>
            <input style={field} value={extra} onChange={(e) => setExtra(e.target.value)}
              placeholder={isQuiz ? 'e.g. 30 min' : 'e.g. 100'} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" onClick={onClose} style={{
            padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: '1px solid #e0e6f0', background: '#fff', color: '#5F7A9E',
          }}>
            Cancel
          </button>
          <button type="submit" style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            border: 'none', background: accent, color: '#fff',
            boxShadow: `0 4px 12px ${accent}55`,
          }}>
            {isQuiz ? 'Assign Quiz' : 'Assign Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Main course detail view ────────────────────────────────────────────── */
function TeacherCourseDetail({ course, onBack }) {
  const code = course.code || 'MWAD';
  const [students, setStudents] = useState(() =>
    (rosterByCode[code] || []).map((s) => ({ ...s }))
  );
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tab, setTab] = useState('Students');
  const [modal, setModal] = useState(null); // 'assignment' | 'quiz' | null

  const setStatus = (id, status) =>
    setStudents((list) => list.map((s) => (s.id === id ? { ...s, status } : s)));

  const enrolledCount = students.filter((s) => s.status === 'ENROLLED').length;
  const pendingCount  = students.filter((s) => s.status === 'PENDING').length;

  const saveAssign = (data) => {
    if (modal === 'quiz') {
      setQuizzes((q) => [{ id: Date.now(), title: data.title, date: data.date, duration: data.extra || '—' }, ...q]);
    } else {
      setAssignments((a) => [{ id: Date.now(), title: data.title, dueDate: data.date, marks: data.extra || '—' }, ...a]);
    }
    setModal(null);
    setTab(modal === 'quiz' ? 'Quizzes' : 'Assignments');
  };

  const TABS = [
    { key: 'Students',    icon: <Users size={15} />,         count: students.length },
    { key: 'Assignments', icon: <ClipboardList size={15} />, count: assignments.length },
    { key: 'Quizzes',     icon: <HelpCircle size={15} />,    count: quizzes.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14,
            fontSize: 13, fontWeight: 600, color: '#2563eb', cursor: 'pointer',
            background: 'transparent', border: 'none', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{
          background: course.bg || '#eff6ff', border: `1.5px solid ${course.border || '#bfdbfe'}`,
          borderRadius: 16, padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: course.titleColor || '#10375C' }}>{course.name}</h2>
              <p style={{ fontSize: 13, color: '#5F7A9E', marginTop: 4 }}>
                {course.type} · {course.gender} · {course.batch} · {course.campus}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setModal('assignment')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: 'none', background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                <Plus size={15} /> Assign Assignment
              </button>
              <button
                onClick={() => setModal('quiz')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: 'none', background: '#9333ea', color: '#fff', boxShadow: '0 4px 12px rgba(147,51,234,0.3)',
                }}
              >
                <Plus size={15} /> Assign Quiz
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 22, marginTop: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444' }}>
              <User size={14} color="#16a34a" /> Enrolled: <strong>{enrolledCount}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444' }}>
              <User size={14} color="#d97706" /> Pending: <strong>{pendingCount}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444' }}>
              <Clock size={14} color="#888" /> {course.schedule}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444' }}>
              <CalendarDays size={14} color="#888" /> Started: {course.started}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4' }}>
        <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid #e8edf4', flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '14px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: tab === t.key ? '#2563eb' : '#5F7A9E',
                background: 'transparent', border: 'none',
                borderBottom: tab === t.key ? '2.5px solid #2563eb' : '2.5px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {t.icon} {t.key}
              <span style={{
                fontSize: 11, fontWeight: 700, background: '#eef2f9', color: '#5F7A9E',
                borderRadius: 999, padding: '1px 7px',
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {tab === 'Students'    && <StudentsList students={students} onApprove={(id) => setStatus(id, 'ENROLLED')} onCancel={(id) => setStatus(id, 'CANCELLED')} />}
          {tab === 'Assignments' && <AssignmentsList items={assignments} onAdd={() => setModal('assignment')} />}
          {tab === 'Quizzes'     && <QuizzesList items={quizzes} onAdd={() => setModal('quiz')} />}
        </div>
      </div>

      {modal && (
        <AssignModal kind={modal} onClose={() => setModal(null)} onSave={saveAssign} />
      )}
    </div>
  );
}

/* ── Students list with approve / cancel ────────────────────────────────── */
function StudentsList({ students, onApprove, onCancel }) {
  if (students.length === 0) {
    return <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>No students in this course yet.</div>;
  }
  return (
    <div className="table-scroll">
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf4', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 2.2fr 1fr 170px',
          padding: '12px 20px', borderBottom: '1px solid #e8edf4',
          fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span>Name</span><span>Roll Number</span><span>Email</span><span>Status</span><span>Action</span>
        </div>
        {students.map((s, i) => (
          <div key={s.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 2.2fr 1fr 170px',
            padding: '14px 20px', alignItems: 'center',
            borderBottom: i < students.length - 1 ? '1px solid #f0f4fa' : 'none',
            background: i % 2 === 0 ? '#fff' : '#fafbff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={s.name} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{s.name}</span>
            </div>
            <span style={{ fontSize: 14, color: '#5F7A9E' }}>{s.roll}</span>
            <span style={{ fontSize: 13, color: '#5F7A9E', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} color="#aab4c4" /> {s.email}
            </span>
            <StatusBadge status={s.status} />
            <div style={{ display: 'flex', gap: 6 }}>
              {s.status === 'PENDING' ? (
                <>
                  <button
                    onClick={() => onApprove(s.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: '1.5px solid #16a34a', background: '#16a34a', color: '#fff',
                    }}
                  >
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button
                    onClick={() => onCancel(s.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: '1.5px solid #dc2626', background: 'transparent', color: '#dc2626',
                    }}
                  >
                    <XCircle size={13} /> Cancel
                  </button>
                </>
              ) : s.status === 'CANCELLED' ? (
                <button
                  onClick={() => onApprove(s.id)}
                  style={{
                    padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: '1.5px solid #16a34a', background: 'transparent', color: '#16a34a',
                  }}
                >
                  Re-approve
                </button>
              ) : (
                <button
                  onClick={() => onCancel(s.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: '1.5px solid #e0e6f0', background: 'transparent', color: '#dc2626',
                  }}
                >
                  <XCircle size={13} /> Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Assignments list ───────────────────────────────────────────────────── */
function AssignmentsList({ items, onAdd }) {
  if (items.length === 0) return <EmptyState icon={<ClipboardList size={28} color="#2563eb" />} text="No assignments assigned yet." action="Assign Assignment" onAdd={onAdd} accent="#2563eb" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((a) => (
        <div key={a.id} style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
          background: '#fff', border: '1px solid #e8edf4', borderRadius: 12,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={18} color="#2563eb" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10375C' }}>{a.title}</div>
            <div style={{ fontSize: 12, color: '#5F7A9E', marginTop: 2 }}>Due: {a.dueDate} · Total Marks: {a.marks}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#16a34a', borderRadius: 6, padding: '3px 10px' }}>Active</span>
        </div>
      ))}
    </div>
  );
}

/* ── Quizzes list ───────────────────────────────────────────────────────── */
function QuizzesList({ items, onAdd }) {
  if (items.length === 0) return <EmptyState icon={<HelpCircle size={28} color="#9333ea" />} text="No quizzes assigned yet." action="Assign Quiz" onAdd={onAdd} accent="#9333ea" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((q) => (
        <div key={q.id} style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
          background: '#fff', border: '1px solid #e8edf4', borderRadius: 12,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HelpCircle size={18} color="#9333ea" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10375C' }}>{q.title}</div>
            <div style={{ fontSize: 12, color: '#5F7A9E', marginTop: 2 }}>Date: {q.date} · Duration: {q.duration}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb', borderRadius: 6, padding: '3px 10px' }}>Scheduled</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, text, action, onAdd, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '48px 20px' }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: '#f4f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <p style={{ fontSize: 14, color: '#5F7A9E' }}>{text}</p>
      <button
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          border: 'none', background: accent, color: '#fff',
        }}
      >
        <Plus size={15} /> {action}
      </button>
    </div>
  );
}

export default TeacherCourseDetail;
