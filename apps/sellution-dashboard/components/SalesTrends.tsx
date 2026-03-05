import React from 'react';
import { Icons } from './Icons';

export const SalesTrends: React.FC = () => {
  // Generate mock heatmap data
  const generateHeatmapData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 10 PM roughly
    
    return days.map(day => ({
      day,
      values: hours.map(() => Math.floor(Math.random() * 4)) // 0-3 intensity levels
    }));
  };

  const data = generateHeatmapData();

  const getColor = (level: number) => {
    switch(level) {
      case 0: return 'bg-[#2d283e]';
      case 1: return 'bg-[#5b21b6]';
      case 2: return 'bg-[#7c3aed]';
      case 3: return 'bg-[#c084fc]'; // Brightest
      default: return 'bg-[#2d283e]';
    }
  };

  return (
    <div className="col-span-12 lg:col-span-5 bg-[#161221] rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Sales Trends</h2>
        <div className="flex items-center gap-2 bg-[#1f1b2d] px-3 py-1.5 rounded-lg border border-white/5">
            <span className="text-xs text-gray-400">Month</span>
            <Icons.ArrowDown className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex gap-2">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-500 py-1 pr-2">
                <span>6 pm</span>
                <span>4 pm</span>
                <span>2 pm</span>
                <span>12 am</span>
                <span>8 am</span>
            </div>

            {/* Heatmap Grid */}
            <div className="flex-1 grid grid-cols-7 gap-2">
                {data.map((col, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        {col.values.map((val, j) => (
                            <div 
                                key={`${i}-${j}`} 
                                className={`w-full aspect-square rounded-md ${getColor(val)} transition-all hover:opacity-80 cursor-pointer`}
                                title={`Sales intensity: ${val}`}
                            ></div>
                        ))}
                         <span className="text-[10px] text-center text-gray-500 mt-1">{col.day}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        {[
            { label: '>1000', color: 'bg-[#c084fc]' },
            { label: '>500', color: 'bg-[#7c3aed]' },
            { label: '>200', color: 'bg-[#5b21b6]' },
            { label: '>100', color: 'bg-[#2d283e]' },
        ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                <span className="text-xs text-gray-400">{item.label}</span>
            </div>
        ))}
      </div>
    </div>
  );
};