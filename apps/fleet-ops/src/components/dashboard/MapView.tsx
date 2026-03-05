import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from "lucide-react";
import { vehicles } from "@/lib/data";

export function MapView() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      {/* Map Background (Simulated) */}
      <div className="absolute inset-0 bg-[#161b22] opacity-50" 
        style={{ 
          backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      />
      
      {/* Map Overlay UI */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-md bg-[#0d1117]/90 px-3 py-2 text-xs font-medium text-white backdrop-blur border border-white/10">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Tracking Active
        </div>
      </div>

      <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2">
        <button className="rounded-md bg-[#0d1117]/90 p-2 text-gray-400 hover:text-white border border-white/10">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button className="rounded-md bg-[#0d1117]/90 p-2 text-gray-400 hover:text-white border border-white/10">
          <ZoomOut className="h-4 w-4" />
        </button>
        <button className="rounded-md bg-[#0d1117]/90 p-2 text-gray-400 hover:text-white border border-white/10">
          <Layers className="h-4 w-4" />
        </button>
      </div>

      {/* Simulated Vehicle Markers */}
      {vehicles.map((vehicle, i) => (
        <div 
          key={vehicle.id}
          className="absolute flex flex-col items-center gap-1 transition-all duration-1000 hover:scale-110 cursor-pointer group"
          style={{ 
            top: `${20 + (i * 15)}%`, 
            left: `${15 + (i * 18)}%` 
          }}
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Navigation className="h-4 w-4 text-blue-400 rotate-45" />
            <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-2 rounded bg-black/80 px-2 py-1 text-[10px] font-medium text-white whitespace-nowrap backdrop-blur border border-white/10">
            {vehicle.make} {vehicle.model}
            <div className="text-gray-400">{vehicle.location}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
