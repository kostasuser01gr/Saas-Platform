import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Car, 
  CalendarCheck, 
  AlertCircle,
  Calendar,
  UserPlus,
  BarChart as BarChartIcon,
  MessageCircle,
  Plus
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const fleetStatusData = [
  { name: 'Available', value: 45, color: '#10b981' },
  { name: 'Rented', value: 35, color: '#4f46e5' },
  { name: 'Maintenance', value: 15, color: '#f59e0b' },
  { name: 'Cleaning', value: 5, color: '#6366f1' },
];

// Mock Shortcuts Map (Must match IDs in Settings.tsx)
const shortcutConfig: Record<string, { label: string, icon: any, path: string, color: string }> = {
  'new_booking': { label: 'New Booking', icon: Calendar, path: '/bookings?action=new', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  'add_vehicle': { label: 'Add Vehicle', icon: Car, path: '/fleet?action=add', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'add_customer': { label: 'Add Customer', icon: UserPlus, path: '/customers?action=add', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  'view_reports': { label: 'View Reports', icon: BarChartIcon, path: '/dashboard?view=reports', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  'team_chat': { label: 'Team Chat', icon: MessageCircle, path: '/chat', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
};

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }: any) => (
  // ... (keep existing StatCard implementation)
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      {trend === 'up' ? (
        <span className="text-emerald-600 flex items-center gap-1 font-medium">
          <TrendingUp size={14} />
          {trendValue}
        </span>
      ) : (
        <span className="text-red-600 flex items-center gap-1 font-medium">
          <TrendingDown size={14} />
          {trendValue}
        </span>
      )}
      <span className="text-zinc-400">vs last month</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [myShortcuts, setMyShortcuts] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const isReportsView = searchParams.get('view') === 'reports';

  useEffect(() => {
    const saved = localStorage.getItem('user_shortcuts');
    if (saved) {
      setMyShortcuts(JSON.parse(saved));
    } else {
      // Default shortcuts
      setMyShortcuts(['new_booking', 'add_vehicle']);
    }
  }, []);

  if (isReportsView) {
    return (
      <div className="space-y-6 p-6 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Financial Reports</h1>
            <p className="text-zinc-500 text-sm">Detailed breakdown of revenue and expenses.</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Back to Overview</Button>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChartIcon size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Advanced Reporting Module</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            This module will include exportable PDF/CSV reports, tax summaries, and profit/loss statements per vehicle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Branches</option>
            <option>Downtown</option>
            <option>Airport</option>
          </select>
          <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Quick Actions Widget */}
      {myShortcuts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {myShortcuts.map(id => {
            const config = shortcutConfig[id];
            if (!config) return null;
            return (
              <Link 
                key={id} 
                to={config.path}
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-2 text-center group"
              >
                <div className={cn("p-3 rounded-full transition-transform group-hover:scale-110", config.color)}>
                  <config.icon size={20} />
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{config.label}</span>
              </Link>
            );
          })}
          <Link 
            to="/settings"
            className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors flex flex-col items-center justify-center gap-2 text-center text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">Add Shortcut</span>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$54,230" 
          trend="up" 
          trendValue="+12.5%" 
          icon={DollarSign}
          color="bg-indigo-600"
        />
        <StatCard 
          title="Active Bookings" 
          value="124" 
          trend="up" 
          trendValue="+8.2%" 
          icon={CalendarCheck}
          color="bg-emerald-600"
        />
        <StatCard 
          title="Fleet Utilization" 
          value="78%" 
          trend="down" 
          trendValue="-2.1%" 
          icon={Car}
          color="bg-blue-600"
        />
        <StatCard 
          title="Maintenance Alert" 
          value="5" 
          trend="up" 
          trendValue="+2" 
          icon={AlertCircle}
          color="bg-amber-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Fleet Status</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fleetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">150</span>
              <span className="text-xs text-zinc-500 uppercase font-medium">Total Cars</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {fleetStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-600 dark:text-zinc-400">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity / Urgent Tasks */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Urgent Operations</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {[
            { title: 'Vehicle Maintenance Due', desc: 'Toyota Camry (XYZ-123) needs oil change', type: 'maintenance', time: '2 hours ago' },
            { title: 'Overdue Return', desc: 'Booking #4829 - John Doe is 3 hours late', type: 'alert', time: '3 hours ago' },
            { title: 'New Premium Booking', desc: 'Tesla Model 3 booked for 7 days', type: 'booking', time: '5 hours ago' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.type === 'maintenance' ? 'bg-amber-100 text-amber-600' :
                item.type === 'alert' ? 'bg-red-100 text-red-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
              <span className="text-xs text-zinc-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
