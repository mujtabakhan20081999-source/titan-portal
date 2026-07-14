import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Edit, Plus, Search, SlidersHorizontal } from 'lucide-react';

import '../styles/admin.css';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const mon = monthNames[d.getMonth()];
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours %= 12;
  if (hours === 0) hours = 12;

  return `${day} ${mon}, ${year} ${hours}:${minutes} ${ampm}`;
}

function ActionBadge({ type, label }) {
  const map = {
    create: { cls: 'badge-green', Icon: Plus },
    add: { cls: 'badge-green', Icon: Plus },
    update: { cls: 'badge-amber', Icon: Edit },
    delete: { cls: 'badge-grey', Icon: Edit },
    system: { cls: 'badge-blue', Icon: Edit },
    login: { cls: 'badge-blue', Icon: Edit },
  };

  const cfg = map[type] || map.update;
  const Icon = cfg.Icon;

  return (
    <span className={`badge ${cfg.cls}`} style={{ gap: 6 }}>
      <Icon size={14} />
      {label}
    </span>
  );
}

function StatusDot({ color }) {
  return (
    <span
      aria-hidden
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: color,
        display: 'inline-block',
        boxShadow: `0 0 0 3px ${color}1A`,
      }}
    />
  );
}

function SkeletonRow() {
  return (
    <div className="atable-row" style={{ gridTemplateColumns: '160px 1.3fr 1fr 2fr', opacity: 0.75 }}>
      <span className="skeleton" />
      <span className="skeleton" />
      <span className="skeleton" />
      <span className="skeleton" />
    </div>
  );
}

function SkeletonStyles() {
  return (
    <style>{`
      .skeleton{
        height: 14px;
        border-radius: 8px;
        background: linear-gradient(90deg, #eef2f9 25%, #f7f9ff 37%, #eef2f9 63%);
        background-size: 400% 100%;
        animation: sk 1.2s ease-in-out infinite;
        display:block;
      }
      @keyframes sk{0%{background-position:100% 0}100%{background-position:-100% 0}}
    `}</style>
  );
}

export default function AuditLogs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All');
  const [actionTypeFilter, setActionTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const loggedInAdmin = {
    name: 'Super Admin',
    email: 'admin@titan.com',
    initials: 'SA',
  };

  useEffect(() => {
    let alive = true;

    const fetchAuditLogs = async () => {
      setLoading(true);
      setError('');

      try {
        await new Promise((r) => setTimeout(r, 650));

        const demo = [
          {
            id: '1',
            occurredAt: '2026-05-07T10:20:00.000Z',
            user: 'Super Admin',
            userStatus: 'active',
            action: { type: 'update', label: 'Student Updated' },
            details: 'WID (14-01) status changed to Enrolled',
          },
          {
            id: '2',
            occurredAt: '2026-05-07T10:18:00.000Z',
            user: 'Admin Office',
            userStatus: 'active',
            action: { type: 'create', label: 'Slot Created' },
            details: 'New slot AI - Batch-01 Present',
          },
          {
            id: '3',
            occurredAt: '2026-05-07T10:15:00.000Z',
            user: 'Super Admin',
            userStatus: 'active',
            action: { type: 'add', label: 'Student Added' },
            details: 'New student AI-SR-020 added',
          },
          {
            id: '4',
            occurredAt: '2026-05-07T10:10:00.000Z',
            user: 'Admin Office',
            userStatus: 'active',
            action: { type: 'update', label: 'Trainer Updated' },
            details: 'Trainer Bilal Ahmed information updated',
          },
        ];

        if (!alive) return;
        setLogs(demo.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)));
      } catch (e) {
        if (!alive) return;
        setError('Failed to load audit logs. Please try again.');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchAuditLogs();
    return () => {
      alive = false;
    };
  }, []);

  const users = useMemo(() => {
    const set = new Set(logs.map((l) => l.user));
    return ['All', ...Array.from(set)];
  }, [logs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return logs.filter((l) => {
      if (userFilter !== 'All' && l.user !== userFilter) return false;
      if (actionTypeFilter !== 'All' && l.action.type !== actionTypeFilter) return false;

      if (dateFilter) {
        const d = new Date(l.occurredAt);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        if (key !== dateFilter) return false;
      }

      if (!q) return true;

      return (
        l.user.toLowerCase().includes(q) ||
        l.action.label.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    });
  }, [logs, search, userFilter, actionTypeFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [search, userFilter, actionTypeFilter, dateFilter]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  return (
    <div className="admin-content areport-page" style={{ width: '100%' }}>
      <SkeletonStyles />

      <div className="acard" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="acard-head" style={{ marginBottom: 0 }}>
          <div>
            <div className="acard-title" style={{ fontSize: 16 }}>
              Audit Logs
            </div>
            <div style={{ fontSize: 12.5, color: '#7286a3', marginTop: 4, fontWeight: 600 }}>
              System activity logs
            </div>
          </div>

          <div className="acard-tools" style={{ alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <label className="admin-search" style={{ minWidth: 280 }}>
                <Search size={16} color="#5F7A9E" />
                <input
                  type="search"
                  placeholder="Search user, action, details..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <button className="btn-ghost" style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
              <div className="admin-profile" style={{ cursor: 'default' }}>
                <div className="admin-profile-av">{loggedInAdmin.initials}</div>
                <div className="admin-profile-info">
                  <div className="admin-profile-name">{loggedInAdmin.name}</div>
                  <div className="admin-profile-role">{loggedInAdmin.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.9fr 0.9fr', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220 }}>
            <label className="afilter-label">Date</label>
            <input className="afilter-input" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>

          <div style={{ minWidth: 220 }}>
            <label className="afilter-label">User</label>
            <select className="afilter-select" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 220 }}>
            <label className="afilter-label">Action Type</label>
            <select className="afilter-select" value={actionTypeFilter} onChange={(e) => setActionTypeFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="create">Create/Add</option>
              <option value="add">Create/Add</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login/System</option>
              <option value="system">Login/System</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <button
              className="btn-ghost"
              style={{ width: '100%', padding: '10px 12px', justifyContent: 'center' }}
              onClick={() => {
                setSearch('');
                setUserFilter('All');
                setActionTypeFilter('All');
                setDateFilter('');
              }}
            >
              <span style={{ fontSize: 12.5 }}>Clear</span>
            </button>
          </div>
        </div>

        <div className="admin-scroll-x" style={{ marginTop: 2 }}>
          <div
            className="atable"
            style={{
              minWidth: 980,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid #e8edf4',
              background: '#fff',
            }}
          >
            <div className="atable-head" style={{ gridTemplateColumns: '1.2fr 0.9fr 0.7fr 2fr', padding: '12px 14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarDays size={16} color="#2563eb" /> Date &amp; Time
              </span>
              <span>User</span>
              <span>Action</span>
              <span>Details</span>
            </div>

            {loading ? (
              <div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : error ? (
              <div style={{ padding: 24, color: '#dc2626', fontWeight: 700 }}>{error}</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#5F7A9E', fontWeight: 800 }}>No Audit Logs Found</div>
            ) : (
              <div>
                {paginated.map((l) => {
                  const dotColor = l.userStatus === 'active' ? '#16a34a' : '#d97706';

                  return (
                    <div
                      className="atable-row"
                      key={l.id}
                      style={{
                        gridTemplateColumns: '1.2fr 0.9fr 0.7fr 2fr',
                        padding: '14px 14px',
                        background: '#fff',
                        borderBottom: '1px solid #f0f4fa',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CalendarDays size={18} color="#2563eb" />
                        <span className="atable-cell" style={{ color: '#10375C', fontWeight: 700 }}>
                          {formatDateTime(l.occurredAt)}
                        </span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <StatusDot color={dotColor} />
                          <span className="atable-cell-strong">{l.user}</span>
                        </div>
                      </div>

                      <div>
                        <ActionBadge type={l.action.type} label={l.action.label} />
                      </div>

                      <div>
                        <div style={{ fontSize: 12.5, color: '#10375C', fontWeight: 600, lineHeight: 1.45 }}>{l.details}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          <div style={{ fontSize: 12.5, color: '#5F7A9E', fontWeight: 700 }}>
            Showing{' '}
            <b>{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</b> to{' '}
            <b>{Math.min(filtered.length, safePage * pageSize)}</b> of <b>{filtered.length}</b>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-ghost" style={{ padding: '8px 12px' }} disabled={safePage === 1} onClick={() => setPage(1)}>
              First
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '8px 12px' }}
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    className="btn-ghost"
                    style={{
                      padding: '8px 12px',
                      background: p === safePage ? '#0A3D91' : '#fff',
                      color: p === safePage ? '#fff' : '#0A3D91',
                      borderColor: p === safePage ? '#0A3D91' : '#cdd8ea',
                    }}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              className="btn-ghost"
              style={{ padding: '8px 12px' }}
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

