function StatsCard({ icon: Icon, title, value, sub, subColor, trend }) {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className="stats-card-icon">
          {Icon && <Icon size={24} />}
        </div>
        {trend && <span className="stats-card-trend">{trend}</span>}
      </div>
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-sub" style={subColor ? { color: subColor } : {}}>{sub}</div>
    </div>
  );
}

export default StatsCard;
