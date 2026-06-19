const courses = [
  { name: 'React JS',     percent: 75, color: '#1e3a8a' },
  { name: 'UI/UX Design', percent: 60, color: '#1e3a8a' },
  { name: 'JavaScript',   percent: 90, color: '#1e3a8a' },
];

function CourseProgress() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Course Progress</h3>
        <a href="#">View All</a>
      </div>

      {courses.map((c, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#444' }}>{c.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e3a8a' }}>{c.percent}%</span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: 8, height: 8 }}>
            <div style={{
              width: c.percent + '%', height: 8,
              background: c.color, borderRadius: 8,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseProgress;