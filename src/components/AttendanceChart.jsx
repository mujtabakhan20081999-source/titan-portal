import { useEffect, useRef } from 'react';

const data = [
  { name: 'Present', value: 26, color: '#1e3a8a' },
  { name: 'Absent',  value: 4,  color: '#ef4444' },
  { name: 'Late',    value: 2,  color: '#f59e0b' },
];

const RADIUS  = 60;
const CX = 75, CY = 75;
const CIRCUM  = 2 * Math.PI * RADIUS; // ~376.99
const GAP_DEG = 5; // degrees gap between segments

function buildSegments(items) {
  const total   = items.reduce((s, d) => s + d.value, 0);
  const usable  = 360 - GAP_DEG * items.length;
  let cumDeg    = -90;

  return items.map(d => {
    const degrees = (d.value / total) * usable;
    const length  = (degrees / 360) * CIRCUM;
    const startDeg = cumDeg;
    cumDeg += degrees + GAP_DEG;
    return { ...d, length, startDeg, total };
  });
}

function AttendanceChart() {
  const arcRefs = useRef([]);
  const segments = buildSegments(data);
  const total    = data.reduce((s, d) => s + d.value, 0);
  const presentPct = Math.round((data[0].value / total) * 100);

  useEffect(() => {
    segments.forEach((seg, i) => {
      const arc = arcRefs.current[i];
      if (!arc) return;
      arc.style.transition = 'none';
      arc.style.strokeDasharray = `0 ${CIRCUM}`;
      arc.getBoundingClientRect();
      setTimeout(() => {
        arc.style.transition = `stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.2}s`;
        arc.style.strokeDasharray = `${seg.length} ${CIRCUM}`;
      }, 60);
    });
  }, []);

  return (
    <div className="card card-padding">
      <div className="section-headline">
        <h3>Attendance Overview</h3>
        <select style={{
          fontSize: 12, border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '6px 12px', color: '#555',
          background: '#fff', cursor: 'pointer', outline: 'none',
        }}>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>

        {/* Multi-color Donut */}
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <svg width={150} height={150}>
            {/* Track */}
            <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#f0f0f0" strokeWidth={14} />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={seg.name}
                ref={el => { arcRefs.current[i] = el; }}
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={14}
                strokeDasharray={`0 ${CIRCUM}`}
                strokeLinecap="round"
                style={{
                  transform: `rotate(${seg.startDeg}deg)`,
                  transformOrigin: `${CX}px ${CY}px`,
                }}
              />
            ))}
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1e3a8a', lineHeight: 1.1 }}>
              {presentPct}%
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>Present</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.map((d, i) => (
            <div key={d.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              animation: 'fadeSlideIn 0.4s ease both',
              animationDelay: `${0.45 + i * 0.14}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 11, height: 11, borderRadius: '50%',
                  background: d.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, color: '#555' }}>{d.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#bbb' }}>
                  {Math.round((d.value / total) * 100)}%
                </span>
                <strong style={{ fontSize: 13, color: '#333', minWidth: 18, textAlign: 'right' }}>
                  {d.value}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendanceChart;
