function StatsCard({ icon, title, value, sub, subColor, trend }) {
  return (
    <div className="card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#f0f4ff', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>
          {icon}
        </div>
        <span style={{ color: '#888', fontSize: 13 }}>{title}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#1e3a8a', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: subColor || '#888', fontSize: 13, fontWeight: 500 }}>{sub}</span>
        {trend && <span style={{ fontSize: 18 }}>{trend}</span>}
      </div>
    </div>
  );
}

export default StatsCard;