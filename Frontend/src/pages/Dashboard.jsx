import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, CreditCard, BookOpen, ShieldCheck, ChevronDown, RefreshCcw } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import StatsCard from '../components/dashboard/StatsCard';
import { getMyStudentProfile } from '../services/studentService';
import { listAttendance } from '../services/attendanceService';
import { listPayments } from '../services/paymentService';

function fmtCurrency(value) {
  return `Rs ${(value || 0).toLocaleString('en-PK')}`;
}

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [studentData, attendanceData, paymentData] = await Promise.all([
        getMyStudentProfile(),
        listAttendance(),
        listPayments(),
      ]);

      setStudent(studentData);
      setAttendance(attendanceData || []);
      setPayments(paymentData || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((item) => item.status === 'Present').length;
  const attendancePercent = totalClasses ? Math.round((presentCount / totalClasses) * 100) : 0;
  const unpaidCount = payments.filter((payment) => payment.status === 'UNPAID').length;
  const paidCount = payments.filter((payment) => payment.status === 'PAID').length;
  const dueTotal = payments.filter((payment) => payment.status === 'UNPAID').reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const recentAttendance = attendance.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar
        userName={student?.name || 'Student'}
        userRole="Student"
        pageTitle="Student Dashboard"
        pageSubtitle="Track your attendance, course status, and fee summary."
      />

      <div className="page-body">
        {loading ? (
          <div className="card card-padding" style={{ textAlign: 'center' }}>
            Loading your dashboard...
          </div>
        ) : error ? (
          <div className="card card-padding" style={{ textAlign: 'center', color: '#dc2626' }}>
            <p style={{ marginBottom: 12, fontWeight: 700 }}>Failed to load dashboard data.</p>
            <p style={{ marginBottom: 16 }}>{error}</p>
            <button className="btn-primary" type="button" onClick={fetchDashboard}>
              <RefreshCcw size={14} /> Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid-4">
              <StatsCard
                icon={CheckCircle}
                title="Attendance"
                value={`${attendancePercent}%`}
                sub={`${presentCount}/${totalClasses || 1} sessions`}
                subColor="#16a34a"
              />
              <StatsCard
                icon={BookOpen}
                title="Current Course"
                value={student?.course || 'Not assigned'}
                sub={student?.meta || 'Batch not assigned'}
                subColor="#2563eb"
              />
              <StatsCard
                icon={CreditCard}
                title="Fee Status"
                value={unpaidCount === 0 ? 'Clear' : `${unpaidCount} due`}
                sub={fmtCurrency(dueTotal)}
                subColor={unpaidCount === 0 ? '#16a34a' : '#dc2626'}
              />
              <StatsCard
                icon={ShieldCheck}
                title="Enrollment"
                value={student?.status || 'Enrolled'}
                sub={student?.city ? `${student.city} Campus` : 'Campus not assigned'}
                subColor="#555"
              />
            </div>

            <div className="flex-row-responsive" style={{ gap: 20, marginTop: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="card card-padding" style={{ minHeight: 320 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>Recent Attendance</h3>
                      <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
                        Latest attendance records from your profile.
                      </p>
                    </div>
                  </div>

                  {recentAttendance.length === 0 ? (
                    <div style={{ padding: 28, textAlign: 'center', color: '#64748b' }}>
                      No attendance records available yet.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {recentAttendance.map((item) => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 12, borderRadius: 14, background: '#f8fafc' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{item.studentName || student?.name || 'Student'}</div>
                            <div style={{ fontSize: 12, color: '#475569' }}>{new Date(item.date).toLocaleDateString()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{item.status}</div>
                            <div style={{ fontSize: 12, color: '#475569' }}>{item.checkIn || item.checkOut || '—'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="card card-padding" style={{ minHeight: 320 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>Fee Summary</h3>
                      <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
                        Your latest payment records and due amounts.
                      </p>
                    </div>
                  </div>

                  {recentPayments.length === 0 ? (
                    <div style={{ padding: 28, textAlign: 'center', color: '#64748b' }}>
                      No payment records found.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {recentPayments.map((payment) => (
                        <div key={payment._id} style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr 0.9fr', gap: 12, padding: 14, borderRadius: 14, background: '#f8fafc' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{payment.voucher}</div>
                            <div style={{ fontSize: 12, color: '#475569' }}>{payment.name}</div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{fmtCurrency(payment.amount)}</div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, padding: '6px 10px', fontSize: 12, fontWeight: 700, color: payment.status === 'PAID' ? '#16a34a' : '#b45309', background: payment.status === 'PAID' ? '#dcfce7' : '#fef3c7' }}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
