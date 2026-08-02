import { useEffect, useState } from 'react';
import { Search, Headset, MessagesSquare, CircleHelp, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { createSupportTicket, listSupportTickets } from '../../services/adminService';

const cards = [
  {
    icon: Headset,
    title: 'Help Center',
    desc: 'Browse help articles and step-by-step guides',
    accent: '#22c55e',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    icon: MessagesSquare,
    title: 'Contact Support',
    desc: 'Get in touch with our support team directly',
    accent: '#0A3D91',
    iconBg: '#dbeafe',
    iconColor: '#0A3D91',
  },
  {
    icon: CircleHelp,
    title: 'FAQs',
    desc: 'Find quick answers to common questions',
    accent: '#f97316',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
];

function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setTickets(await listSupportTickets() || []);
    } catch {
      setTickets([]);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) {
      setToast('Subject and message are required.');
      setTimeout(() => setToast(''), 2200);
      return;
    }
    setSaving(true);
    try {
      await createSupportTicket({ subject: subject.trim(), message: message.trim(), category: 'General' });
      setSubject('');
      setMessage('');
      setToast('Support ticket created.');
      await load();
      setTimeout(() => setToast(''), 2200);
    } catch (err) {
      setToast(err?.response?.data?.message || 'Unable to create ticket.');
      setTimeout(() => setToast(''), 2200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="asupport">
      <div className="asupport-head">
        <h2>Support</h2>
        <p>We&apos;re here to help you get unstuck, fast.</p>
      </div>

      <div className="asupport-search">
        <Search size={17} color="#9aa7bd" />
        <input type="text" placeholder="Search for help, e.g. 'reset password'" />
      </div>

      <div className="asupport-cards">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div className="asupport-card" key={c.title} style={{ borderTopColor: c.accent }}>
              <div className="asupport-card-icon" style={{ background: c.iconBg }}>
                <Icon size={22} color={c.iconColor} />
              </div>
              <div className="asupport-card-title">{c.title}</div>
              <div className="asupport-card-desc">{c.desc}</div>
              <button className="asupport-card-link" type="button">
                Explore <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="acard" style={{ marginTop: 18 }}>
        <div className="acard-head" style={{ marginBottom: 12 }}>
          <span className="acard-title">Create Support Ticket</span>
        </div>
        <div className="ap-field" style={{ marginBottom: 12 }}>
          <label>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief issue title" />
        </div>
        <div className="ap-field" style={{ marginBottom: 12 }}>
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue…" style={{ minHeight: 90 }} />
        </div>
        <button className="btn-primary" type="button" onClick={submit} disabled={saving}>
          <Mail size={16} /> {saving ? 'Sending…' : 'Submit Ticket'}
        </button>
      </div>

      <div className="acard" style={{ marginTop: 18, padding: 0 }}>
        <div className="acard-head" style={{ padding: '16px 16px 12px', marginBottom: 0 }}>
          <span className="acard-title">Your Tickets</span>
          <span style={{ fontSize: 12, color: '#7286a3' }}>{tickets.length}</span>
        </div>
        {tickets.length === 0 ? (
          <div style={{ padding: 22, color: '#7286a3', fontWeight: 700 }}>No tickets yet.</div>
        ) : tickets.map((t) => (
          <div key={t._id} style={{ padding: '12px 16px', borderTop: '1px solid #eef2f7', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, color: '#10375C' }}>{t.subject}</div>
              <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 3 }}>{t.message}</div>
            </div>
            <span className={`badge ${t.status === 'Open' ? 'badge-amber' : 'badge-green'}`}>{t.status}</span>
          </div>
        ))}
      </div>

      <div className="asupport-banner">
        <div>
          <div className="asupport-banner-title">Still stuck?</div>
          <div className="asupport-banner-sub">Our team usually replies within a few hours.</div>
        </div>
        <button className="asupport-banner-btn" type="button" onClick={() => document.querySelector('.asupport .ap-field input')?.focus()}>
          <Mail size={16} /> Email support
        </button>
      </div>

      {toast && <div className="ap-toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default AdminSupport;
