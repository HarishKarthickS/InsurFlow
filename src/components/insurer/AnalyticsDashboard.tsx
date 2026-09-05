"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';

export default function AnalyticsDashboard({ claims }: { claims: any[] }) {
  const last7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'MMM dd');
    const count = claims.filter(c => {
      const claimDate = new Date(c.submissionDate);
      return format(claimDate, 'MMM dd') === dateStr;
    }).length;
    return { name: dateStr, count };
  }).reverse();

  const statusData = [
    { name: 'Approved', value: claims.filter(c => c.status === 'approved').length, color: '#2F6B52' },
    { name: 'Pending', value: claims.filter(c => c.status === 'pending').length, color: '#3A6470' },
    { name: 'Rejected', value: claims.filter(c => c.status === 'rejected').length, color: '#7A3333' },
    { name: 'Flagged', value: claims.filter(c => c.status === 'flagged').length, color: '#8A6D2B' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="card p-4">
        <h3 className="section-kicker mb-3">Intake volume · 7 days</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#b8c5ce" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4a5f69' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4a5f69' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: 0, border: '1px solid #8fa0ab', background: '#eef2f4' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#1F6A72" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#1F6A72', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="section-kicker mb-3">Stamp mix</h3>
        <div className="h-[220px] w-full flex items-center">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={2}
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
          <div className="w-36 space-y-2">
            {statusData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-[#1b2c33]">{d.name}</span>
                <span className="file-id ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
