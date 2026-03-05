import { useState, useEffect } from "react";
import { Search, Command, Car, Wrench, FileText, Map, Zap, X } from "lucide-react";
import { vehicles } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectVehicle }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(); // Toggle logic handled in App
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(query.toLowerCase()) || 
    v.model.toLowerCase().includes(query.toLowerCase()) ||
    v.license.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-[20vh] backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-[#161b22] shadow-2xl animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-4 py-3">
          <Search className="mr-2 h-5 w-5 text-gray-500" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <div className="flex gap-1">
            <kbd className="hidden rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-400 sm:inline-block">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {query === "" && (
            <div className="mb-2 px-2 text-xs font-semibold text-gray-500">Suggested</div>
          )}
          
          {query === "" && (
            <>
              <CommandItem icon={Wrench} label="Log Maintenance" shortcut="M" />
              <CommandItem icon={FileText} label="Generate Report" shortcut="R" />
              <CommandItem icon={Map} label="View Fleet Map" shortcut="V" />
              <CommandItem icon={Zap} label="Check EV Status" shortcut="E" />
            </>
          )}

          {(query !== "" || filteredVehicles.length > 0) && (
            <div className="mb-2 mt-2 px-2 text-xs font-semibold text-gray-500">Vehicles</div>
          )}
          
          {filteredVehicles.map(vehicle => (
            <button
              key={vehicle.id}
              onClick={() => {
                onSelectVehicle(vehicle.id);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-gray-300 hover:bg-blue-600 hover:text-white"
            >
              <Car className="h-4 w-4" />
              <span className="flex-1">{vehicle.make} {vehicle.model} <span className="text-xs opacity-50">({vehicle.license})</span></span>
              <span className="text-xs opacity-50">{vehicle.status}</span>
            </button>
          ))}
          
          {query !== "" && filteredVehicles.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommandItem({ icon: Icon, label, shortcut }: { icon: any, label: string, shortcut?: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="flex-1">{label}</span>
      {shortcut && <kbd className="rounded bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-500">{shortcut}</kbd>}
    </button>
  );
}
