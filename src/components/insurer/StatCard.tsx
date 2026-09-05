export default function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string 
}) {
  const bar =
    color === 'bg-primary' ? '#1F6A72' :
    color === 'bg-warning' ? '#8A6D2B' :
    color === 'bg-success' ? '#2F6B52' : '#3A6470';

  return (
    <div className="metric-tile" style={{ borderBottom: `4px solid ${bar}` }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">{title}</p>
          <p className="font-mono text-2xl mt-1 tabular-nums">{value}</p>
        </div>
        <div className={`p-2 ${color} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
