import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  MoreHorizontal,
  Filter,
  Search,
  QrCode,
  Zap,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

// Mock Data
const QUEUE = [
  { id: 'W1', plate: 'ABC-123', model: 'Toyota Camry', status: 'in-progress', type: 'Full Detail', start: '10:30 AM', washer: 'John' },
  { id: 'W2', plate: 'ELN-404', model: 'Tesla Model 3', status: 'pending', type: 'Quick Wash', start: '-', washer: '-' },
  { id: 'W3', plate: 'SUV-999', model: 'Ford Explorer', status: 'qc-ready', type: 'Interior', start: '09:45 AM', washer: 'Sarah' },
  { id: 'W4', plate: 'LUX-001', model: 'BMW X5', status: 'completed', type: 'Full Detail', start: '08:00 AM', washer: 'Mike' },
];

export default function Washers() {
  const { toggleKioskMode } = useApp();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Droplets className="text-blue-500" />
            Washers Operations
          </h1>
          <p className="text-zinc-500 text-sm">Manage wash queue, QC checks, and washer performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleKioskMode} className="gap-2">
            <QrCode size={16} />
            Kiosk Mode
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <PlusIcon size={16} />
            Add to Queue
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">In Queue</div>
          <div className="text-2xl font-bold mt-1">12</div>
          <div className="text-xs text-zinc-400 mt-1">4 High Priority</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Avg Cycle Time</div>
          <div className="text-2xl font-bold mt-1">24m</div>
          <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><Zap size={10} /> -2m vs target</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Throughput</div>
          <div className="text-2xl font-bold mt-1">45</div>
          <div className="text-xs text-zinc-400 mt-1">Cars today</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Rework Rate</div>
          <div className="text-2xl font-bold mt-1">2.1%</div>
          <div className="text-xs text-amber-500 mt-1">Requires attention</div>
        </div>
      </div>

      {/* Queue Board */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-lg inline-flex mb-4">
        <button 
          onClick={() => setActiveTab('queue')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTab === 'queue' ? "bg-white dark:bg-zinc-800 shadow text-blue-600" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Live Queue
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeTab === 'history' ? "bg-white dark:bg-zinc-800 shadow text-blue-600" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Daily Register
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columns */}
        {['Pending', 'In Progress', 'QC Ready', 'Completed'].map((status) => (
          <div key={status} className="flex flex-col h-[600px] bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 rounded-t-xl">
              <span className="font-bold text-sm">{status}</span>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
                {QUEUE.filter(i => i.status === status.toLowerCase().replace(' ', '-')).length}
              </span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {QUEUE.filter(i => i.status === status.toLowerCase().replace(' ', '-')).map(item => (
                <div key={item.id} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-lg">{item.plate}</span>
                    <button className="text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{item.model}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-2">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.start}
                    </div>
                    <div>{item.washer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
