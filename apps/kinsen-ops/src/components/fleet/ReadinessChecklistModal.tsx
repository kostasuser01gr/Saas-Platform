import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertTriangle, Camera, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadinessChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  onConfirm: (status: string) => void;
}

const CHECKLIST_ITEMS = [
  { id: 'ext_clean', label: 'Exterior Cleanliness', category: 'Cleaning' },
  { id: 'int_clean', label: 'Interior Vacuumed', category: 'Cleaning' },
  { id: 'fuel_level', label: 'Fuel Level > 90%', category: 'Fluids' },
  { id: 'tires', label: 'Tire Pressure Checked', category: 'Safety' },
  { id: 'docs', label: 'Registration & Insurance Present', category: 'Docs' },
  { id: 'keys', label: 'Both Keys Present', category: 'Access' },
];

export default function ReadinessChecklistModal({ isOpen, onClose, vehicle, onConfirm }: ReadinessChecklistModalProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isComplete = CHECKLIST_ITEMS.every(item => checkedItems.includes(item.id));

  const handleConfirm = () => {
    if (isComplete) {
      onConfirm('Available');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" />
            QC Readiness Checklist
          </DialogTitle>
          <p className="text-sm text-zinc-500">
            Verify condition for <span className="font-bold text-zinc-900 dark:text-zinc-100">{vehicle?.make} {vehicle?.model} ({vehicle?.plate})</span>
          </p>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {CHECKLIST_ITEMS.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "flex items-center p-3 rounded-lg border cursor-pointer transition-all",
                  checkedItems.includes(item.id)
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors",
                  checkedItems.includes(item.id)
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-zinc-400 bg-white dark:bg-zinc-700"
                )}>
                  {checkedItems.includes(item.id) && <CheckCircle2 size={14} />}
                </div>
                <div className="flex-1">
                  <span className={cn(
                    "text-sm font-medium",
                    checkedItems.includes(item.id) ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"
                  )}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">QC Notes (Optional)</label>
            <textarea 
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
              placeholder="Any damage or issues to report?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Camera size={16} />
              Add Photos
            </Button>
            <Button variant="outline" className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <AlertTriangle size={16} />
              Report Issue
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isComplete}
            className={cn(
              "gap-2",
              isComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed"
            )}
          >
            <CheckCircle2 size={16} />
            Mark as Ready
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
