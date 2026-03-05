import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Icons } from './Icons';

const data = [
  { name: 'A', value: 10, color: '#10b981' }, // Green
  { name: 'B', value: 15, color: '#34d399' },
  { name: 'C', value: 20, color: '#facc15' }, // Yellow
  { name: 'D', value: 15, color: '#fbbf24' },
  { name: 'E', value: 10, color: '#3b0764' }, // Dark purple (empty-ish)
  { name: 'F', value: 10, color: '#2e1065' },
];

export const ResultsChart: React.FC = () => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#161221] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden h-[340px] flex flex-col">
       <div className="absolute top-0 right-0 p-6">
            <Icons.ArrowUp className="w-5 h-5 text-gray-400" />
       </div>
       
       <h2 className="text-xl font-semibold text-white mb-4">Results</h2>

       <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="70%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={6}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Overlay */}
            <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-white">$16,000</div>
                <div className="text-xs text-gray-400">Total profit</div>
            </div>
       </div>

       <div className="mt-2 bg-[#1f1b2d] rounded-xl p-3 flex items-center gap-3 border border-white/5">
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Icons.ArrowUp className="w-3 h-3" />
                5.96%
            </div>
            <div className="text-xs text-gray-400 leading-tight">
                Your profit have increased by <span className="text-gray-200">$900 in the last month</span>
            </div>
       </div>
    </div>
  );
};