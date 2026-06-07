"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export default function AnalyticsDashboard({ claims }: { claims: any[] }) {
  // 1. Process Data for Line Chart (Claims over last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'MMM dd');
    const count = claims.filter(c => {
      const claimDate = new Date(c.submissionDate);
      return format(claimDate, 'MMM dd') === dateStr;
    }).length;
    return { name: dateStr, count };
  }).reverse();

  // 2. Process Data for Pie Chart (Status Distribution)
  const statusData = [
    { name: 'Approved', value: claims.filter(c => c.status === 'approved').length, color: '#4CAF50' },
    { name: 'Pending', value: claims.filter(c => c.status === 'pending').length, color: '#FFC107' },
    { name: 'Rejected', value: claims.filter(c => c.status === 'rejected').length, color: '#F44336' },
    { name: 'Flagged', value: claims.filter(c => c.status === 'flagged').length, color: '#FF9800' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Volume Chart */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Submission Volume (7D)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#4B56D2" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#4B56D2', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Status Distribution</h3>
        <div className="h-[250px] w-full flex items-center">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-32 space-y-3">
            {statusData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-bold text-gray-600">{d.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
