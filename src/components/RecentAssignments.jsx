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
    <div className="card card-padding">
      <div className="section-headline">
        <h3>Recent Assignments</h3>
        <a href="#">View All</a>
      </div>

      {assignments.map((a, i) => (
        <div key={i} className="list-row" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 8px',
          borderBottom: i < assignments.length - 1 ? '1px solid #f5f5f5' : 'none',
          animation: 'fadeUp 0.4s ease both',
          animationDelay: `${0.1 + i * 0.1}s`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'rgba(235,131,23,0.10)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 15,
              flexShrink: 0,
            }}>📄</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{a.title}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Due: {a.due}</div>
            </div>
          </div>
          <span style={{
            background: badge[a.status].bg,
            color: badge[a.status].color,
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            {a.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentAssignments;
