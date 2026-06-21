const quizzes = [
  { title: 'JavaScript Quiz',   date: '20 May 2024', time: '11:00 AM' },
  { title: 'React Basics Quiz', date: '25 May 2024', time: '10:00 AM' },
];

function UpcomingQuizzes() {
  return (
    <div className="card card-padding">
      <div className="section-headline">
        <h3>Upcoming Quizzes</h3>
        <a href="#">View All</a>
      </div>

      {quizzes.map((q, i) => (
        <div key={i} className="list-row" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 8px',
          borderBottom: i < quizzes.length - 1 ? '1px solid #f5f5f5' : 'none',
          animation: 'fadeUp 0.4s ease both',
          animationDelay: `${0.1 + i * 0.12}s`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#1e3a8a',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              color: 'white', fontSize: 15, flexShrink: 0,
            }}>✓</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{q.title}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                {q.date} • {q.time}
              </div>
            </div>
          </div>
          <span style={{
            background: '#fef3c7', color: '#92400e',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            Upcoming
          </span>
        </div>
      ))}
    </div>
  );
}

export default UpcomingQuizzes;
