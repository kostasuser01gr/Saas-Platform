import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jul', actual: 4000, projected: 6000 },
  { name: 'Aug', actual: 5500, projected: 5000 },
  { name: 'Sep', actual: 7000, projected: 8500 },
  { name: 'Oct', actual: 10200, projected: 9000 },
  { name: 'Nov', actual: 14500, projected: 12000 },
  { name: 'Dec', actual: 12000, projected: 15000 },
];

export const TotalSalesChart: React.FC = () => {
  return (
    <div className="col-span-12 lg:col-span-7 bg-[#161221] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
        
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Total Sales</h2>
          <div className="text-xs text-gray-400">Total sales in 6 months: <span className="text-white font-bold">$72,500</span></div>
        </div>
        
        <div className="flex bg-[#1f1b2d] rounded-full p-1 border border-white/5">
            {['1 year', '6 month', '3 month', '1 month'].map((tab, idx) => (
                <button key={tab} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${idx === 1 ? 'bg-[#2d283e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                    {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1b2d', borderRadius: '12px', border: '1px solid #ffffff10', color: '#fff' }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#a855f7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProjected)"
              name="Projected Revenue"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Actual Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-400">Projected Revenue</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-400">Actual Revenue</span>
        </div>
      </div>
    </div>
  );
};