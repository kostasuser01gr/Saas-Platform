import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, AlertCircle, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const KPI = ({ title, value, change, trend, color, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {change}
          {trend === 'up' ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fleet Overview</h1>
          <p className="text-slate-500">Welcome back, Fleet Manager. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/import" className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
            Import Data
          </Link>
          <Link to="/fleet" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Add Vehicle
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI title="Active Vehicles" value="1,248" change="+12" trend="up" color="bg-blue-500" icon={CheckCircle2} />
        <KPI title="Due for Service" value="34" change="High" trend="down" color="bg-amber-500" icon={Clock} />
        <KPI title="Pending Recalls" value="7" change="Critical" trend="down" color="bg-red-500" icon={AlertCircle} />
        <KPI title="Avg. Fleet Age" value="2.4 yrs" change="-0.1" trend="up" color="bg-indigo-500" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Recent Activity</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { id: 1, action: 'Service Completed', car: 'Toyota Yaris (ZHZ-1234)', user: 'Mike T.', time: '2 hours ago', status: 'done' },
              { id: 2, action: 'Tyre Change', car: 'Fiat Panda (IPZ-5555)', user: 'Sarah K.', time: '4 hours ago', status: 'progress' },
              { id: 3, action: 'KTEO Alert', car: 'Peugeot 3008 (NKM-9988)', user: 'System', time: 'Yesterday', status: 'alert' },
            ].map(item => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${item.status === 'done' ? 'bg-green-500' : item.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.car} • {item.user}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link to="/fleet" className="text-sm text-blue-600 font-medium hover:underline">View Full Timeline</Link>
          </div>
        </div>

        {/* Quick Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-800">Tasks Due</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Review Monthly Service Invoice', due: 'Today' },
              { label: 'Approve Tyre Change #992', due: 'Tomorrow' },
              { label: 'Check Insurance Renewals', due: 'In 2 days' },
            ].map((task, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 group-hover:border-blue-500 bg-white" />
                <div>
                  <p className="text-sm text-slate-700 font-medium group-hover:text-blue-700">{task.label}</p>
                  <p className="text-xs text-slate-400">Due: {task.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
