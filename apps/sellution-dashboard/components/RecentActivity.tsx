import React from 'react';
import { Icons } from './Icons';

const activities = [
  {
    name: 'Olivia Carter',
    email: 'olivia.carter@salespro.com',
    avatar: 'https://picsum.photos/101/101',
    profit: 6.21,
    date: 'Feb 8, 2025',
    value: '$7,500',
    trend: 'up'
  },
  {
    name: 'Jake Thompson',
    email: 'j.thompson@saleshub.com',
    avatar: 'https://picsum.photos/102/102',
    profit: -1.34,
    date: 'Feb 8, 2025',
    value: '$9,200',
    trend: 'down'
  },
  {
    name: 'Emily Nguyen',
    email: 'emily.nguyen@topdeals.com',
    avatar: 'https://picsum.photos/103/103',
    profit: 12.13,
    date: 'Feb 7, 2025',
    value: '$6,800',
    trend: 'up'
  }
];

export const RecentActivity: React.FC = () => {
  return (
    <div className="col-span-12 lg:col-span-5 bg-[#161221] rounded-3xl p-6 border border-white/5 shadow-xl h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-[#1f1b2d] px-3 py-1.5 rounded-lg border border-white/5 text-xs text-gray-300 hover:bg-[#2d283e]">
                Sort <Icons.ArrowDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-2 bg-[#1f1b2d] px-3 py-1.5 rounded-lg border border-white/5 text-xs text-gray-300 hover:bg-[#2d283e]">
                Month <Icons.ArrowDown className="w-3 h-3" />
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-xs text-gray-500 border-b border-white/5">
                    <th className="pb-3 font-medium pl-2">Seller's name</th>
                    <th className="pb-3 font-medium text-center">Total profit</th>
                    <th className="pb-3 font-medium text-center">Last Deal</th>
                    <th className="pb-3 font-medium text-right pr-2">Deal Value</th>
                    <th className="pb-3"></th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {activities.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                                <div>
                                    <div className="text-white font-medium">{item.name}</div>
                                    <div className="text-[10px] text-gray-500">{item.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {item.trend === 'up' ? <Icons.ArrowUp className="w-3 h-3" /> : <Icons.ArrowDown className="w-3 h-3" />}
                                {Math.abs(item.profit)}%
                            </div>
                        </td>
                        <td className="py-4 text-center text-gray-400 text-xs">
                            {item.date}
                        </td>
                        <td className="py-4 text-right pr-2 font-bold text-white">
                            {item.value}
                        </td>
                         <td className="py-4 text-right">
                            <Icons.More className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white" />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};