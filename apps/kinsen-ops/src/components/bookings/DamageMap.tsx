import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DamagePoint {
  id: string;
  x: number;
  y: number;
  type: 'scratch' | 'dent' | 'crack' | 'other';
  description: string;
}

interface DamageMapProps {
  damages: DamagePoint[];
  onAddDamage: (damage: DamagePoint) => void;
  onRemoveDamage: (id: string) => void;
  readOnly?: boolean;
}

export default function DamageMap({ damages, onAddDamage, onRemoveDamage, readOnly = false }: DamageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<DamagePoint | null>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (readOnly || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newDamage: DamagePoint = {
      id: Date.now().toString(),
      x,
      y,
      type: 'scratch',
      description: '',
    };

    onAddDamage(newDamage);
    setSelectedPoint(newDamage);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Interactive Map */}
      <div className="flex-1 relative bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden min-h-[300px] flex items-center justify-center">
        <div 
          ref={containerRef}
          className={`relative w-full max-w-[400px] aspect-[1/2] cursor-crosshair ${readOnly ? 'pointer-events-none' : ''}`}
          onClick={handleMapClick}
        >
          {/* Car SVG Outline */}
          <svg viewBox="0 0 200 400" className="w-full h-full text-zinc-300 dark:text-zinc-600 fill-current">
            <path d="M40,60 C40,40 160,40 160,60 L160,340 C160,360 40,360 40,340 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M40,100 L160,100" stroke="currentColor" strokeWidth="2" /> {/* Windshield Top */}
            <path d="M40,140 L160,140" stroke="currentColor" strokeWidth="2" /> {/* Windshield Bottom */}
            <path d="M40,280 L160,280" stroke="currentColor" strokeWidth="2" /> {/* Rear Window Top */}
            <path d="M40,320 L160,320" stroke="currentColor" strokeWidth="2" /> {/* Rear Window Bottom */}
            <line x1="100" y1="60" x2="100" y2="340" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" /> {/* Center Line */}
            
            {/* Wheels */}
            <rect x="20" y="80" width="20" height="40" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="160" y="80" width="20" height="40" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="20" y="280" width="20" height="40" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="160" y="280" width="20" height="40" rx="4" fill="currentColor" opacity="0.5" />
          </svg>

          {/* Damage Markers */}
          {damages.map((point) => (
            <button
              key={point.id}
              className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
                selectedPoint?.id === point.id 
                  ? 'bg-red-600 text-white ring-2 ring-red-300 ring-offset-2' 
                  : 'bg-red-500 text-white opacity-80 hover:opacity-100'
              }`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPoint(point);
              }}
            >
              <AlertTriangle size={12} />
            </button>
          ))}
        </div>
        
        {!readOnly && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-zinc-200 dark:border-zinc-700">
            Click anywhere on the car to mark damage
          </div>
        )}
      </div>

      {/* Damage Details Panel */}
      <div className="w-full md:w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-4 flex flex-col">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-4">Damage Log</h3>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {damages.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-sm">
              No damages reported.
              <br />
              Click on the diagram to add one.
            </div>
          ) : (
            damages.map((damage) => (
              <div 
                key={damage.id}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  selectedPoint?.id === damage.id
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                }`}
                onClick={() => setSelectedPoint(damage)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-red-600 dark:text-red-400 capitalize flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {damage.type}
                  </span>
                  {!readOnly && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDamage(damage.id);
                        if (selectedPoint?.id === damage.id) setSelectedPoint(null);
                      }}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                {selectedPoint?.id === damage.id && !readOnly ? (
                  <div className="space-y-2">
                    <select 
                      className="w-full p-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded"
                      value={damage.type}
                      onChange={(e) => {
                        const updated = { ...damage, type: e.target.value as any };
                        onRemoveDamage(damage.id); // Remove old
                        onAddDamage(updated); // Add updated (hacky but works for MVP state)
                        setSelectedPoint(updated);
                      }}
                    >
                      <option value="scratch">Scratch</option>
                      <option value="dent">Dent</option>
                      <option value="crack">Crack</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea 
                      className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded resize-none focus:ring-1 focus:ring-red-500 outline-none"
                      placeholder="Describe damage..."
                      rows={2}
                      value={damage.description}
                      onChange={(e) => {
                        const updated = { ...damage, description: e.target.value };
                        onRemoveDamage(damage.id);
                        onAddDamage(updated);
                        setSelectedPoint(updated);
                      }}
                    />
                    <Button size="sm" variant="outline" className="w-full text-xs h-7 gap-1">
                      <Camera size={12} /> Add Photo
                    </Button>
                  </div>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                    {damage.description || "No description provided."}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
