const data = [
  { name: 'Present', value: 26, color: '#1e3a8a' },
  { name: 'Absent',  value: 4,  color: '#ef4444' },
  { name: 'Late',    value: 2,  color: '#f59e0b' },
];

function AttendanceChart() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Attendance Overview</h3>
        <select style={{
          fontSize: 12, border: '1px solid #e5e7eb',
          borderRadius: 6, padding: '4px 8px', color: '#555',
        }}>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Circle Chart */}
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={70} cy={70} r={60} fill="none" stroke="#e5e7eb" strokeWidth={15} />
            <circle cx={70} cy={70} r={60} fill="none" stroke="#1e3a8a" strokeWidth={15} 
              strokeDasharray={`${(26/32)*377} 377`} strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e3a8a' }}>85%</div>
            <div style={{ fontSize: 10, color: '#999' }}>Present</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1 }}>
          {data.map(d => (
            <div key={d.name} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: d.color,
                }} />
                <span style={{ fontSize: 13, color: '#555' }}>{d.name}</span>
              </div>
              <strong style={{ fontSize: 13 }}>{d.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendanceChart;