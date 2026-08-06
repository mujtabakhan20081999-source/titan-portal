import { useEffect, useMemo, useState } from 'react';
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
import { getReports } from '../../services/adminService';

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
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getReports({ campus: campus === 'All Campuses' ? '' : campus })
      .then((rows) => { if (alive) setReports(rows || []); })
      .catch(() => { if (alive) setReports([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [campus]);

  const campuses = useMemo(() => {
    const s = new Set(reports.map((r) => r.campus).filter(Boolean));
    return ['All Campuses', 'Sukkur', 'Karachi', ...Array.from(s)];
  }, [reports]);

  const statuses = ['All Statuses', 'Ready', 'Processing'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesQuery =
        !q ||
        r.type.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q) ||
        String(r.id).toLowerCase().includes(q) ||
        String(r.campus).toLowerCase().includes(q);
      const matchesCampus = campus === 'All Campuses' ? true : r.campus === campus || r.campus === 'All';
      const matchesStatus = status === 'All Statuses' ? true : r.status === status;
      return matchesQuery && matchesCampus && matchesStatus;
    });
  }, [reports, query, campus, status]);

  const totals = useMemo(() => {
    const total = filtered.reduce((a, r) => a + (r.total || 0), 0);
    const approved = filtered.reduce((a, r) => a + (r.approved || 0), 0);
    const pending = filtered.reduce((a, r) => a + (r.pending || 0), 0);
    return { total, approved, pending };
  }, [filtered]);

  const downloadReport = (r) => {
    const lines = [
      `TITAN SMS REPORT — ${r.type}`,
      `Period: ${r.period}`,
      `Campus: ${r.campus}`,
      `Total: ${r.total}`,
      `Approved: ${r.approved}`,
      `Pending: ${r.pending}`,
      `Generated: ${r.createdAt}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.id || 'report'}-${r.createdAt}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              Live reports from database. Download exports a text summary.
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

            {loading && (
              <div style={{ padding: 22, color: '#7286a3', fontWeight: 700 }}>Loading reports…</div>
            )}

            {!loading && filtered.map((r) => (
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
                <span className="atable-cell">{(r.total || 0).toLocaleString()}</span>
                <span className="atable-cell" style={{ color: '#16a34a', fontWeight: 700 }}>
                  {(r.approved || 0).toLocaleString()}
                </span>
                <div>
                  <Badge status={r.status} />
                </div>
                <div className="atable-actions">
                  <button title="View" aria-label="View" onClick={() => window.alert(`${r.type}\nTotal ${r.total}\nApproved ${r.approved}\nPending ${r.pending}`)}>
                    <Eye size={16} />
                  </button>
                  <button title="Download" aria-label="Download" onClick={() => downloadReport(r)}>
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}

            {!loading && filtered.length === 0 && (
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

