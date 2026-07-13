import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

function TrainerTable({
  loading,
  trainers,
  campuses,
  search,
  onSearchChange,
  campusFilter,
  onCampusFilterChange,
  statusFilter,
  onStatusFilterChange,
  onView,
  onEdit,
  onDelete,
}) {
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setPage(1);
  }, [search, campusFilter, statusFilter]);

  const normalizedSearch = (search || '').trim().toLowerCase();

  const filtered = useMemo(() => {
    let rows = [...trainers];

    if (normalizedSearch) {
      rows = rows.filter((t) =>
        t.fullName.toLowerCase().includes(normalizedSearch) || t.email.toLowerCase().includes(normalizedSearch)
      );
    }

    if (campusFilter && campusFilter !== 'All Campuses') {
      rows = rows.filter((t) => t.campus === campusFilter);
    }

    if (statusFilter && statusFilter !== 'All Status') {
      rows = rows.filter((t) => t.status === statusFilter);
    }

    return rows;
  }, [trainers, normalizedSearch, campusFilter, statusFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;

    const getVal = (t) => {
      switch (sortKey) {
        case 'id':
          return t.id;
        case 'fullName':
          return t.fullName;
        case 'email':
          return t.email;
        case 'employeeId':
          return t.employeeId;
        case 'campus':
          return t.campus;
        case 'phoneNumber':
          return t.phoneNumber;
        case 'joiningDate':
          return t.joiningDate;
        case 'status':
          return t.status;
        default:
          return t.id;
      }
    };

    return [...filtered].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [safePage, page]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage]);

  const sortIndicator = (key) => {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? '▲' : '▼';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fullName', label: 'Trainer Name' },
    { key: 'email', label: 'Email' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'campus', label: 'Campus' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="tmg-card">
      <div className="tmg-table-head">
        <div className="tmg-table-title">
          <div className="tmg-table-heading">Trainer List</div>
          <div className="tmg-table-sub">Manage trainers and staff information.</div>
        </div>

        <div className="tmg-filters-inline">
          <select
            value={campusFilter}
            onChange={(e) => onCampusFilterChange(e.target.value)}
            className="tmg-select"
          >
            <option value="All Campuses">All Campuses</option>
            {campuses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="tmg-select"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="tmg-table-controls">
        <div className="tmg-loading-row">
          {loading && (
            <div className="tmg-spinner" aria-label="Loading" />
          )}
        </div>
      </div>

      <div className="tmg-table-scroll">
        <table className="tmg-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>
                  <button
                    className="tmg-th-btn"
                    onClick={() => {
                      if (sortKey === c.key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else {
                        setSortKey(c.key);
                        setSortDir('asc');
                      }
                    }}
                    aria-label={`Sort by ${c.label}`}
                  >
                    {c.label} <span className="tmg-sort-ind">{sortIndicator(c.key)}</span>
                  </button>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="tmg-empty">
                    <div className="tmg-empty-icon">◎</div>
                    <div className="tmg-empty-title">No trainers found</div>
                    <div className="tmg-empty-sub">Try adjusting search, campus, or status filters.</div>
                  </div>
                </td>
              </tr>
            )}

            {paginated.map((t) => (
              <tr key={t.id} className="tmg-tr-row" onDoubleClick={() => onView(t)}>
                <td>{t.id}</td>
                <td>
                  <div className="tmg-name-cell">
                    <div className="tmg-avatar">{t.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className="tmg-name">{t.fullName}</div>
                      <div className="tmg-muted">{t.email}</div>
                    </div>
                  </div>
                </td>
                <td className="tmg-hide-mobile">{t.email}</td>
                <td>{t.employeeId}</td>
                <td>{t.campus}</td>
                <td className="tmg-hide-mobile">{t.phoneNumber}</td>
                <td>{t.joiningDate}</td>
                <td>
                  <span className={`tmg-badge ${t.status === 'Active' ? 'active' : 'inactive'}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div className="tmg-actions">
                    <button className="tmg-icon-action" onClick={() => onView(t)} title="View">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="tmg-icon-action" onClick={() => onEdit(t)} title="Edit">
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button className="tmg-icon-danger" onClick={() => onDelete(t)} title="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="tmg-skeleton" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tmg-pagination">
        <div className="tmg-page-meta">
          Showing <b>{sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}</b> to <b>{Math.min(sorted.length, safePage * pageSize)}</b> of <b>{sorted.length}</b>
        </div>

        <div className="tmg-page-controls">
          <button className="tmg-page-btn" onClick={() => setPage(1)} disabled={safePage === 1}>First</button>
          <button className="tmg-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>Prev</button>

          <div className="tmg-page-numbers">
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  className={`tmg-page-num${n === safePage ? ' active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              );
            })}
            {totalPages > 7 && <span className="tmg-ellipsis">…</span>}
          </div>

          <button className="tmg-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
          <button className="tmg-page-btn" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>Last</button>
        </div>
      </div>
    </div>
  );
}

export default TrainerTable;

