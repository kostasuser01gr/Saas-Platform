import React, { useState } from 'react';
import { X, Calendar, Wrench, AlertTriangle, CheckCircle, Clock, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MaintenanceRecord {
  id: string;
  type: string;
  date: string;
  cost: string;
  status: 'Completed' | 'Scheduled' | 'Overdue';
  notes: string;
  provider: string;
}

interface MaintenanceModalProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    plate: string;
    mileage: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Mock Data
const initialRecords: MaintenanceRecord[] = [
  { id: 'M001', type: 'Oil Change', date: '2023-09-15', cost: '$85.00', status: 'Completed', notes: 'Routine oil change and filter replacement.', provider: 'QuickLube' },
  { id: 'M002', type: 'Tire Rotation', date: '2023-09-15', cost: '$40.00', status: 'Completed', notes: 'Rotated all 4 tires.', provider: 'QuickLube' },
  { id: 'M003', type: 'Brake Inspection', date: '2023-11-20', cost: '$0.00', status: 'Scheduled', notes: 'Check brake pads thickness.', provider: 'Dealer Service' },
];

export default function MaintenanceModal({ vehicle, isOpen, onClose }: MaintenanceModalProps) {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<'history' | 'schedule'>('history');
  const [newRecord, setNewRecord] = useState({
    type: '',
    date: '',
    cost: '',
    notes: '',
    provider: ''
  });

  if (!isOpen) return null;

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record: MaintenanceRecord = {
      id: `M${Date.now()}`,
      ...newRecord,
      status: 'Scheduled',
    };
    setRecords([record, ...records]);
    setActiveTab('history');
    setNewRecord({ type: '', date: '', cost: '', notes: '', provider: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="text-indigo-600" size={24} />
              Maintenance & Service
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {vehicle.make} {vehicle.model} • <span className="font-mono text-zinc-600 dark:text-zinc-400">{vehicle.plate}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              activeTab === 'history' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10" 
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            Service History
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
              activeTab === 'schedule' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10" 
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            Schedule Service
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'history' ? (
            <div className="space-y-4">
              {/* Alert for upcoming */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-sm">Service Due Soon</h4>
                  <p className="text-amber-700 dark:text-amber-500 text-xs mt-1">
                    Oil change recommended in 550 km.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {records.map((record) => (
                  <div key={record.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          record.status === 'Completed' ? "bg-emerald-500" : 
                          record.status === 'Overdue' ? "bg-red-500" : "bg-blue-500"
                        )} />
                        <h4 className="font-semibold text-sm">{record.type}</h4>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">{record.date}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={14} /> {record.cost}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wrench size={14} /> {record.provider}
                      </div>
                    </div>

                    {record.notes && (
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg text-xs text-zinc-600 dark:text-zinc-400">
                        {record.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Service Type</label>
                  <select 
                    required
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newRecord.type}
                    onChange={e => setNewRecord({...newRecord, type: e.target.value})}
                  >
                    <option value="">Select Type...</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Rotation">Tire Rotation</option>
                    <option value="Brake Inspection">Brake Inspection</option>
                    <option value="General Service">General Service</option>
                    <option value="Repair">Repair</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newRecord.date}
                    onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Estimated Cost</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newRecord.cost}
                      onChange={e => setNewRecord({...newRecord, cost: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Service Provider</label>
                  <input 
                    type="text" 
                    placeholder="e.g. QuickLube"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newRecord.provider}
                    onChange={e => setNewRecord({...newRecord, provider: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Notes</label>
                <textarea 
                  rows={4}
                  placeholder="Additional details..."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  value={newRecord.notes}
                  onChange={e => setNewRecord({...newRecord, notes: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Schedule Service</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
