const quizzes = [
  { title: 'JavaScript Quiz',   date: '20 May 2024', time: '11:00 AM' },
  { title: 'React Basics Quiz', date: '25 May 2024', time: '10:00 AM' },
];

function UpcomingQuizzes() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Upcoming Quizzes</h3>
        <a href="#">View All</a>
      </div>

      {quizzes.map((q, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '12px 0',
          borderBottom: i < quizzes.length - 1 ? '1px solid #f5f5f5' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#1e3a8a', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 14,
            }}>✓</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{q.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                {q.date} • {q.time}
              </div>
            </div>
          </div>
          <span style={{
            background: '#fef3c7', color: '#92400e',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 600,
          }}>
            Upcoming
          </span>
        </div>
      ))}
    </div>
  );
}

export default UpcomingQuizzes;