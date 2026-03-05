import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Database,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Imports() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UploadCloud className="text-orange-500" />
            Data Import Center
          </h1>
          <p className="text-zinc-500 text-sm">Bulk import vehicles, bookings, or customer data.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <History size={16} />
          View History
        </Button>
      </div>

      {/* Upload Zone */}
      <div 
        className={cn(
          "h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all",
          dragActive 
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
            : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm mb-4">
          <UploadCloud size={32} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold">Drag & Drop files here</h3>
        <p className="text-zinc-500 text-sm mt-1">Supports .xlsx, .csv, .pdf, .json</p>
        <Button className="mt-4" variant="outline">Browse Files</Button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium">
            Ready to Import ({files.length})
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {files.map((file, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">Pending Mapping</span>
                  <Button size="sm" variant="ghost">Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next: Map Columns <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Recent Imports */}
      <div>
        <h3 className="font-bold text-lg mb-4">Recent Batches</h3>
        <div className="space-y-3">
          {[
            { id: 'B-1023', name: 'Fleet_Update_Oct.xlsx', status: 'success', records: 142, date: '2 hours ago', user: 'Alex M.' },
            { id: 'B-1022', name: 'Bookings_Export_Q3.csv', status: 'warning', records: 850, date: 'Yesterday', user: 'Sarah C.' },
          ].map((batch) => (
            <div key={batch.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  batch.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{batch.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{batch.id}</span>
                    <span>•</span>
                    <span>{batch.records} records</span>
                    <span>•</span>
                    <span>by {batch.user}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  batch.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  {batch.status === 'success' ? 'Completed' : 'Warnings Found'}
                </span>
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
