import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  RefreshCw,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Mock Feed Data
const FEED_ITEMS = [
  { id: 1, type: 'alert', title: 'Heavy Rain Warning', message: 'Expect lower walk-in demand. Wash queue may be delayed.', time: '10m ago', icon: CloudRain, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  { id: 2, type: 'success', title: 'Fleet Milestone', message: '100% of luxury fleet is now available for weekend.', time: '1h ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 3, type: 'info', title: 'System Update', message: 'New "Kiosk Mode" deployed for washers.', time: '2h ago', icon: Info, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 4, type: 'warning', title: 'Maintenance Due', message: '3 vehicles overdue for oil change.', time: '3h ago', icon: AlertTriangle, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
];

export default function FeedsWidget() {
  const [items, setItems] = useState(FEED_ITEMS);
  const [weather, setWeather] = useState({ temp: 72, condition: 'Sunny', wind: '12mph', precip: '0%' });

  const dismissItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Station Weather</p>
              <h3 className="text-3xl font-bold mt-1">New York, NY</h3>
            </div>
            <Sun size={32} className="text-yellow-300 animate-pulse" />
          </div>
          
          <div className="mt-6 flex items-end gap-4">
            <span className="text-5xl font-bold">{weather.temp}°</span>
            <span className="text-xl font-medium text-blue-100 mb-1">{weather.condition}</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
            <div className="flex items-center gap-2">
              <Wind size={16} className="text-blue-200" />
              <span className="text-sm font-medium">{weather.wind} Wind</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain size={16} className="text-blue-200" />
              <span className="text-sm font-medium">{weather.precip} Precip</span>
            </div>
          </div>
          
          <div className="mt-4 bg-white/10 rounded-lg p-2 text-xs text-blue-50 flex items-center gap-2">
            <Info size={12} />
            <span>Good conditions for car washing today.</span>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-indigo-500" />
            <h3 className="font-bold text-sm">Live Operations Feed</h3>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.length} New
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
            <RefreshCw size={14} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[300px]">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group relative">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", item.color)}>
                  <item.icon size={20} />
                </div>
                <div className="flex-1 pr-8">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                    <span className="text-xs text-zinc-400">{item.time}</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5">{item.message}</p>
                </div>
                <button 
                  onClick={() => dismissItem(item.id)}
                  className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              All caught up! No new alerts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
