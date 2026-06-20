import { useEffect, useState } from 'react';

const courses = [
  { name: 'React JS',     percent: 75 },
  { name: 'UI/UX Design', percent: 60 },
  { name: 'JavaScript',   percent: 90 },
];

function CourseProgress() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="card card-padding">
      <div className="section-headline">
        <h3>Course Progress</h3>
        <a href="#">View All</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {courses.map((c, i) => (
          <div key={i} style={{
            animation: 'fadeUp 0.4s ease both',
            animationDelay: `${0.1 + i * 0.1}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#EB8317' }}>{c.percent}%</span>
            </div>
            <div style={{ background: '#ede9e3', borderRadius: 999, height: 9 }}>
              <div style={{
                width: ready ? c.percent + '%' : '0%',
                height: 9,
                background: 'linear-gradient(90deg, #EB8317 0%, #f3c623 100%)',
                borderRadius: 999,
                transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.18}s`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseProgress;
