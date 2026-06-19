function StatsCard({ icon, title, value, sub, subColor, trend }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        {trend && <span style={{ fontSize: 16 }}>{trend}</span>}
      </div>
      <h3 style={{ margin: 0, fontSize: 14, color: '#666', fontWeight: 500 }}>{title}</h3>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>{value}</div>
      <div style={{ fontSize: 12, color: subColor || '#666' }}>{sub}</div>
    </div>
  );
}

export default StatsCard;
