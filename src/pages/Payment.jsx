import { useState } from 'react';
import {
  Wallet, CheckCircle, AlertCircle, Users, Search, Copy, Check, CreditCard,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';

/* ── Mock fee / voucher data ────────────────────────────────────────────── */
const initialFees = [
  { id: 1,  name: 'Abdul Jabbar',       roll: '477526', voucher: 'TITAN-2026-0001', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 2,  name: 'Abdul Rafay',        roll: '469955', voucher: 'TITAN-2026-0002', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
  { id: 3,  name: 'Abdul Salam Shaikh', roll: '475436', voucher: 'TITAN-2026-0003', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 4,  name: 'Abdullah Khan',      roll: '470278', voucher: 'TITAN-2026-0004', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
  { id: 5,  name: 'Aisha Siddiqui',     roll: '481234', voucher: 'TITAN-2026-0005', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 6,  name: 'Ali Hassan',         roll: '483421', voucher: 'TITAN-2026-0006', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
  { id: 7,  name: 'Amna Fatima',        roll: '484567', voucher: 'TITAN-2026-0007', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 8,  name: 'Bilal Ahmed',        roll: '485678', voucher: 'TITAN-2026-0008', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
  { id: 9,  name: 'Faisal Mehmood',     roll: '486789', voucher: 'TITAN-2026-0009', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 10, name: 'Fatima Noor',        roll: '487890', voucher: 'TITAN-2026-0010', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
  { id: 11, name: 'Hamid Raza',         roll: '488901', voucher: 'TITAN-2026-0011', amount: 5000, dueDate: '10 Jul 2026', status: 'PAID'   },
  { id: 12, name: 'Hina Malik',         roll: '490123', voucher: 'TITAN-2026-0012', amount: 5000, dueDate: '10 Jul 2026', status: 'UNPAID' },
];

function Avatar({ name, size = 34 }) {
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

function VoucherCell({ voucher }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(voucher);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.03em',
        color: '#10375C', background: '#f4f6ff', border: '1px dashed #c7d2fe',
        borderRadius: 6, padding: '3px 8px', fontFamily: 'monospace',
      }}>
        {voucher}
      </span>
      <button onClick={copy} title="Copy voucher ID"
        style={{ display: 'flex', alignItems: 'center', color: copied ? '#16a34a' : '#5F7A9E', cursor: 'pointer' }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </span>
  );
}

function StatCard({ icon, bg, value, label, sub }) {
  return (
    <div className="card card-padding" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 24, fontWeight: 800, color: '#10375C', lineHeight: 1.1,
          letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {value}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#10375C', marginTop: 3, letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: '#7286a3', marginTop: 2, fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Payment() {
  const [fees, setFees] = useState(initialFees);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All | PAID | UNPAID

  const payNow = (id) =>
    setFees((list) => list.map((f) => (f.id === id ? { ...f, status: 'PAID' } : f)));

  const paidCount   = fees.filter((f) => f.status === 'PAID').length;
  const unpaidCount = fees.filter((f) => f.status === 'UNPAID').length;
  const collected   = fees.filter((f) => f.status === 'PAID').reduce((s, f) => s + f.amount, 0);

  const filtered = fees.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.roll.includes(search) ||
      f.voucher.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || f.status === filter;
    return matchSearch && matchFilter;
  });

  const fmt = (n) => `Rs ${n.toLocaleString('en-PK')}`;
  const cols = '1.8fr 1fr 1.6fr 0.9fr 1fr 0.9fr 120px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName="Mujtaba Khan"
        userRole="Student"
        pageTitle="Fee Payment"
        pageSubtitle="View fee status, copy your voucher ID and pay your dues."
      />

      <div className="page-body">

        {/* Summary */}
        <div className="ta-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <StatCard icon={<Users size={22} color="#2563eb" />}        bg="#dbeafe" value={fees.length}   label="Total Students" sub="This Batch" />
          <StatCard icon={<CheckCircle size={22} color="#16a34a" />}  bg="#dcfce7" value={paidCount}     label="Paid"           sub="Fee Cleared" />
          <StatCard icon={<AlertCircle size={22} color="#dc2626" />}  bg="#fee2e2" value={unpaidCount}   label="Unpaid"         sub="Pending Dues" />
          <StatCard icon={<Wallet size={22} color="#9333ea" />}       bg="#f3e8ff" value={fmt(collected)} label="Collected"     sub="Total Received" />
        </div>

        {/* Table card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf4' }}>
          <div className="ta-tabbar" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid #e8edf4', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['All', 'PAID', 'UNPAID'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${filter === f ? '#2563eb' : '#e8edf4'}`,
                    background: filter === f ? '#2563eb' : 'transparent',
                    color: filter === f ? '#fff' : '#5F7A9E',
                  }}
                >
                  {f === 'All' ? 'All' : f === 'PAID' ? 'Paid' : 'Unpaid'}
                </button>
              ))}
            </div>

            <label className="ta-search" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f4f6ff', borderRadius: 8, padding: '7px 14px', border: '1px solid #e8edf4',
            }}>
              <Search size={15} color="#5F7A9E" />
              <input
                type="search"
                placeholder="Search name, roll or voucher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#10375C', width: 210 }}
              />
            </label>
          </div>

          <div style={{ padding: 20 }}>
            <div className="table-scroll">
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf4', overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: cols,
                  padding: '12px 20px', borderBottom: '1px solid #e8edf4',
                  fontSize: 12, fontWeight: 600, color: '#5F7A9E', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  <span>Student</span><span>Roll No</span><span>Voucher ID</span><span>Amount</span><span>Due Date</span><span>Status</span><span>Action</span>
                </div>

                {filtered.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#5F7A9E', fontSize: 14 }}>
                    No records match your search.
                  </div>
                ) : (
                  filtered.map((f, i) => {
                    const paid = f.status === 'PAID';
                    return (
                      <div key={f.id} style={{
                        display: 'grid', gridTemplateColumns: cols,
                        padding: '14px 20px', alignItems: 'center',
                        borderBottom: i < filtered.length - 1 ? '1px solid #f0f4fa' : 'none',
                        background: i % 2 === 0 ? '#fff' : '#fafbff',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={f.name} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{f.name}</span>
                        </div>
                        <span style={{ fontSize: 14, color: '#5F7A9E' }}>{f.roll}</span>
                        <VoucherCell voucher={f.voucher} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#10375C' }}>{fmt(f.amount)}</span>
                        <span style={{ fontSize: 13, color: '#5F7A9E' }}>{f.dueDate}</span>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, width: 'fit-content',
                          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                          border: `1.5px solid ${paid ? '#16a34a' : '#dc2626'}`,
                          color: paid ? '#16a34a' : '#dc2626',
                          background: paid ? '#f0fdf4' : '#fef2f2',
                          borderRadius: 6, padding: '3px 10px',
                        }}>
                          {paid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {f.status}
                        </span>
                        {paid ? (
                          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Cleared</span>
                        ) : (
                          <button
                            onClick={() => payNow(f.id)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'center',
                              padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              border: 'none', background: '#2563eb', color: '#fff', boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
                            }}
                          >
                            <CreditCard size={13} /> Pay Now
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Payment;
