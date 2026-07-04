import { Search, Headset, MessagesSquare, CircleHelp, ArrowRight, Mail } from 'lucide-react';

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
    accent: '#a855f7',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
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
              <button className="asupport-card-link">
                Explore <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="asupport-banner">
        <div>
          <div className="asupport-banner-title">Still stuck?</div>
          <div className="asupport-banner-sub">Our team usually replies within a few hours.</div>
        </div>
        <button className="asupport-banner-btn">
          <Mail size={16} /> Email support
        </button>
      </div>
    </div>
  );
}

export default AdminSupport;
