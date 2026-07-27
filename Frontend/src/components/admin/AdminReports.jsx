import { useMemo, useState } from 'react';
import {
  Download,
  FileText,
  Filter,
  RotateCcw,
  Eye,
  Users,
  CalendarDays,
  BadgeCheck,
  Receipt,
  TrendingUp,
} from 'lucide-react';

// Mock data (UI only). Connect to API later.
const MOCK_REPORTS = [
  {
    id: 'rpt-001',
    type: 'Enrollment Summary',
    period: 'May 2026',
    campus: 'Sukkur',
    total: 1345,
    approved: 1290,
    pending: 55,
    createdAt: '2026-06-01',
    status: 'Ready',
  },
  {
    id: 'rpt-002',
    type: 'Attendance Report',
    period: 'May 2026',
    campus: 'Karachi',
    total: 986,
    approved: 910,
    pending: 76,
    createdAt: '2026-06-03',
    status: 'Processing',
  },
  {
    id: 'rpt-003',
    type: 'Payment Status',
    period: 'May 2026',
    campus: 'Lahore',
    total: 754,
    approved: 690,
    pending: 64,
    createdAt: '2026-06-05',
    status: 'Ready',
  },
  {
    id: 'rpt-004',
    type: 'Trainer Performance',
    period: 'May 2026',
    campus: 'Islamabad',
    total: 632,
    approved: 612,
    pending: 20,
    createdAt: '2026-06-06',
    status: 'Ready',
  },
  {
    id: 'rpt-005',
    type: 'Assignment Completion',
    period: 'Week 4',
    campus: 'Multan',
    total: 521,
    approved: 430,
    pending: 91,
    createdAt: '2026-06-07',
    status: 'Ready',
  },
];

function formatStatusBadge(status) {
  if (status === 'Ready') return { cls: 'badge-green', label: 'Ready' };
  if (status === 'Processing') return { cls: 'badge-amber', label: 'Processing' };
  return { cls: 'badge-grey', label: status };
}

function Badge({ status }) {
  const b = formatStatusBadge(status);
  return <span className={`badge ${b.cls}`}>{b.label}</span>;
}

export default function AdminReports() {
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState('All Campuses');
  const [status, setStatus] = useState('All Statuses');

  const campuses = useMemo(() => {
    const s = new Set(MOCK_REPORTS.map((r) => r.campus));
    return ['All Campuses', ...Array.from(s)];
  }, []);

  const statuses = ['All Statuses', 'Ready', 'Processing'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_REPORTS.filter((r) => {
      const matchesQuery =
        !q ||
        r.type.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.campus.toLowerCase().includes(q);
      const matchesCampus = campus === 'All Campuses' ? true : r.campus === campus;
      const matchesStatus = status === 'All Statuses' ? true : r.status === status;
      return matchesQuery && matchesCampus && matchesStatus;
    });
  }, [query, campus, status]);

  const totals = useMemo(() => {
    const total = filtered.reduce((a, r) => a + r.total, 0);
    const approved = filtered.reduce((a, r) => a + r.approved, 0);
    const pending = filtered.reduce((a, r) => a + r.pending, 0);
    return { total, approved, pending };
  }, [filtered]);

  return (
    <div className="areport-page">
      <div className="acard" style={{ padding: 18 }}>
        <div className="acard-head" style={{ marginBottom: 12 }}>
          <div>
            <span className="acard-title">Admin Reports</span>
            <div style={{ fontSize: 12, color: '#7286a3', marginTop: 4 }}>
              Export summaries, view processing status, and filter campus-wise reports.
            </div>
          </div>
          <div className="acard-tools">
            <button className="btn-ghost" style={{ padding: '8px 12px' }}>
              <Download size={15} /> Export All
            </button>
          </div>
        </div>

        <div className="areport-kpis">
          <div className="areport-kpi areport-kpi-gold areport-card">
            <div className="areport-kpi-title">Total Records</div>
            <div className="areport-kpi-value">{totals.total.toLocaleString()}</div>
            <div className="areport-kpi-sub">Across filtered reports</div>
          </div>
          <div className="areport-kpi">
            <div className="areport-kpi-title">Approved</div>
            <div className="areport-kpi-value" style={{ color: '#16a34a' }}>
              {totals.approved.toLocaleString()}
            </div>
            <div className="areport-kpi-sub">Verified / completed</div>
          </div>
          <div className="areport-kpi">
            <div className="areport-kpi-title">Pending</div>
            <div className="areport-kpi-value" style={{ color: '#d97706' }}>
              {totals.pending.toLocaleString()}
            </div>
            <div className="areport-kpi-sub">Awaiting updates</div>
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div className="admin-2col" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="acard" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="acard-head" style={{ marginBottom: 10 }}>
              <span className="acard-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Filter size={16} color="#0A3D91" /> Filters
              </span>
              <button
                className="btn-ghost"
                style={{ padding: '6px 10px', fontSize: 11.5 }}
                onClick={() => {
                  setQuery('');
                  setCampus('All Campuses');
                  setStatus('All Statuses');
                }}
              >
                <RotateCcw size={13} /> Clear
              </button>
            </div>

            <div className="afilter-group" style={{ marginBottom: 12 }}>
              <label className="afilter-label">Search</label>
              <input
                className="afilter-input areport-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type report type, period, campus, ID..."
              />
            </div>

            <div className="afilter-group" style={{ marginBottom: 12 }}>
              <label className="afilter-label">Campus</label>
              <select className="afilter-select" value={campus} onChange={(e) => setCampus(e.target.value)}>
                {campuses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="afilter-group" style={{ marginBottom: 0 }}>
              <label className="afilter-label">Status</label>
              <select className="afilter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="acard" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="acard-head" style={{ marginBottom: 10 }}>
              <span className="acard-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="#0A3D91" /> Insights
              </span>
              <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 11.5 }} disabled>
                <FileText size={13} /> Summary
              </button>
            </div>

            <div className="areport-insights">
              <div className="areport-insight">
                <span className="areport-insight-dot" style={{ background: '#2563eb' }} />
                <div>
                  <div className="areport-insight-title">Report Count</div>
                  <div className="areport-insight-sub">Matched items</div>
                </div>
                <div className="areport-insight-pill">{filtered.length}</div>
              </div>

              <div className="areport-insight">
                <span className="areport-insight-dot" style={{ background: '#16a34a' }} />
                <div>
                  <div className="areport-insight-title">Approved Rate</div>
                  <div className="areport-insight-sub">Approved / Total</div>
                </div>
                <div className="areport-insight-pill">
                  {totals.total ? Math.round((totals.approved / totals.total) * 100) : 0}%
                </div>
              </div>

              <div className="areport-insight">
                <span className="areport-insight-dot" style={{ background: '#d97706' }} />
                <div>
                  <div className="areport-insight-title">Pending Items</div>
                  <div className="areport-insight-sub">Awaiting actions</div>
                </div>
                <div className="areport-insight-pill">{totals.pending.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 18 }} />

      <div className="acard" style={{ padding: 0 }}>
        <div className="acard-head" style={{ padding: '18px 18px 14px', marginBottom: 0 }}>
          <div>
            <span className="acard-title">Reports Library</span>
            <div style={{ fontSize: 12, color: '#7286a3', marginTop: 2 }}>
              Click “View” to preview a report (mock), or “Download” to export.
            </div>
          </div>
          <div className="acard-tools">
            <button className="btn-ghost">
              <Users size={15} /> Manage
            </button>
          </div>
        </div>

        <div className="admin-scroll-x">
          <div className="atable" style={{ minWidth: 920 }}>
            <div className="atable-head" style={{ gridTemplateColumns: '110px 1.5fr 1fr 1fr 120px 120px 110px 120px' }}>
              <span>ID</span>
              <span>Report</span>
              <span>Campus</span>
              <span>Period</span>
              <span>Total</span>
              <span>Approved</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {filtered.map((r) => (
              <div
                className="atable-row areport-row"
                key={r.id}
                style={{ gridTemplateColumns: '110px 1.5fr 1fr 1fr 120px 120px 110px 120px' }}
              >
                <span className="atable-cell-strong">{r.id}</span>
                <div>
                  <div className="atable-cell-strong" style={{ fontSize: 13.5 }}>
                    {r.type}
                  </div>
                  <div className="atable-cell-sub">Created {r.createdAt}</div>
                </div>
                <span className="atable-cell">{r.campus}</span>
                <span className="atable-cell">{r.period}</span>
                <span className="atable-cell">{r.total.toLocaleString()}</span>
                <span className="atable-cell" style={{ color: '#16a34a', fontWeight: 700 }}>
                  {r.approved.toLocaleString()}
                </span>
                <div>
                  <Badge status={r.status} />
                </div>
                <div className="atable-actions">
                  <button title="View (mock)" aria-label="View">
                    <Eye size={16} />
                  </button>
                  <button title="Download (mock)" aria-label="Download">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: 22, color: '#7286a3', fontWeight: 700 }}>
                No reports match your filters.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="acard" style={{ padding: 16 }}>
        <div className="acard-head" style={{ marginBottom: 10 }}>
          <span className="acard-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <CalendarDays size={16} color="#0A3D91" /> Quick Actions
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-primary">
            <BadgeCheck size={15} /> Generate Attendance Report
          </button>
          <button className="btn-ghost">
            <Receipt size={15} /> Generate Fee Report
          </button>
        </div>
      </div>
    </div>
  );
}

