export default function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-b-4 border-transparent hover:border-current transition-all duration-300" style={{ borderBottomColor: color === 'bg-primary' ? '#4B56D2' : color === 'bg-warning' ? '#FFC107' : color === 'bg-success' ? '#4CAF50' : '#2196F3' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-xl shadow-inner ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
