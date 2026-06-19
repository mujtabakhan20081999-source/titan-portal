const assignments = [
  { title: 'React JS Assignment', due: '20 May 2024', status: 'Pending' },
  { title: 'JavaScript Basics',   due: '18 May 2024', status: 'Submitted' },
  { title: 'UI/UX Design Task',   due: '15 May 2024', status: 'Pending' },
];

const badge = {
  Pending:   { bg: '#fef3c7', color: '#92400e' },
  Submitted: { bg: '#d1fae5', color: '#065f46' },
};

function RecentAssignments() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Assignments</h3>
        <a href="#">View All</a>
      </div>

      {assignments.map((a, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '12px 0',
          borderBottom: i < assignments.length - 1 ? '1px solid #f5f5f5' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: '#f0f4ff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>📄</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Due: {a.due}</div>
            </div>
          </div>
          <span style={{
            background: badge[a.status].bg,
            color: badge[a.status].color,
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          }}>
            {a.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentAssignments;