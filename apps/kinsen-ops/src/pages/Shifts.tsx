import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CalendarRange, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  Filter,
  Users,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = ['Morning (06:00 - 14:00)', 'Afternoon (14:00 - 22:00)', 'Night (22:00 - 06:00)'];

const SCHEDULE = [
  { day: 'Mon', shift: 0, staff: ['Alex M.', 'Sarah C.', 'John W.'] },
  { day: 'Mon', shift: 1, staff: ['Mike R.', 'Lisa K.'] },
  { day: 'Tue', shift: 0, staff: ['Alex M.', 'Sarah C.'] },
  { day: 'Wed', shift: 2, staff: ['Night Crew A'] },
];

export default function Shifts() {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarRange className="text-purple-500" />
            Shift Scheduling
          </h1>
          <p className="text-zinc-500 text-sm">Manage weekly rosters, availability, and coverage.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus size={16} />
            New Shift
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft size={16} />
            </Button>
            <span className="font-bold text-lg">Oct 23 - Oct 29, 2024</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
          </div>
          <Button variant="outline" size="sm">Today</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Copy size={14} />
            Copy Last Week
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={14} />
            Filter Role
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="p-4 font-bold text-sm text-zinc-500 border-r border-zinc-200 dark:border-zinc-800">
            Shift / Day
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-4 font-bold text-sm text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {SHIFTS.map((shiftName, shiftIndex) => (
            <div key={shiftIndex} className="grid grid-cols-8 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 min-h-[150px]">
              {/* Row Header */}
              <div className="p-4 text-xs font-bold text-zinc-500 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center">
                {shiftName}
              </div>
              
              {/* Cells */}
              {DAYS.map((day, dayIndex) => {
                const entry = SCHEDULE.find(s => s.day === day && s.shift === shiftIndex);
                return (
                  <div key={day} className="p-2 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0 relative group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    {entry ? (
                      <div className="space-y-1">
                        {entry.staff.map((staff, i) => (
                          <div key={i} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-200 dark:border-indigo-800 cursor-grab active:cursor-grabbing">
                            {staff}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0">
                          <Plus size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
