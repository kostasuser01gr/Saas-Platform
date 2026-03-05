import { Search, Filter, ChevronDown } from "lucide-react";
import { vehicles, type Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";

interface FleetGridProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FleetGrid({ selectedId, onSelect }: FleetGridProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#161b22] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-sm font-semibold text-white">Available Fleet Vehicles</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by make, model, location..." 
              className="h-9 w-64 rounded-md border border-white/10 bg-[#0d1117] pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-white/10 bg-[#21262d] px-3 py-2 text-xs font-medium text-gray-300 hover:bg-[#30363d]">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-[#0d1117] px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-1">ID</div>
        <div className="col-span-2">License</div>
        <div className="col-span-2">Make</div>
        <div className="col-span-2">Model</div>
        <div className="col-span-3">Operational Status</div>
        <div className="col-span-2">Location</div>
      </div>

      {/* Grid Rows */}
      <div className="divide-y divide-white/5">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              "grid cursor-pointer grid-cols-12 gap-4 px-4 py-3 text-sm transition-colors hover:bg-white/5",
              selectedId === vehicle.id ? "bg-[#1f6feb]/10 border-l-2 border-blue-500" : "border-l-2 border-transparent"
            )}
          >
            <div className="col-span-1 flex items-center">
              <div className="h-6 w-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                {vehicle.make[0]}
              </div>
            </div>
            <div className="col-span-2 font-mono text-white">{vehicle.license}</div>
            <div className="col-span-2 text-gray-400">{vehicle.make}</div>
            <div className="col-span-2 text-gray-400">{vehicle.model}</div>
            <div className="col-span-3 flex items-center gap-2">
              <StatusBadge status={vehicle.status} />
            </div>
            <div className="col-span-2 text-gray-400 truncate">{vehicle.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Vehicle['status'] }) {
  const styles = {
    Available: "bg-green-500/10 text-green-400 border-green-500/20",
    Maintenance: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "On Rental": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Sold: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", styles[status])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
