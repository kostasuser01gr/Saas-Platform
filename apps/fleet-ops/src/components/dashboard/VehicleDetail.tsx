import { type Vehicle } from "@/lib/data";
import { MoreHorizontal, ExternalLink, ShieldCheck, DollarSign, Sparkles, Gauge, Battery, Fuel, Activity, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(vehicle.image);

  if (!vehicle) return null;

  const handleGenerateConcept = () => {
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      setIsGenerating(false);
      // Swap to a "concept" version (using a different Unsplash ID for demo)
      setCurrentImage("https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=2800&ixlib=rb-4.0.3");
    }, 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#161b22] p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Vehicle Details</h3>
        <div className="flex gap-2">
          <button className="rounded-md p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image & Concept Lab */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 group">
        <img 
          src={currentImage} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className={cn("h-full w-full object-cover transition-all duration-700", isGenerating && "scale-110 blur-sm")}
        />
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          ID: {vehicle.id.slice(0, 8)}...
        </div>
        
        {/* AI Generation Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="h-8 w-8 animate-spin text-purple-400" />
              <span className="text-sm font-medium text-purple-200">Generating Concept...</span>
            </div>
          </div>
        )}

        {/* Concept Button */}
        <button 
          onClick={handleGenerateConcept}
          disabled={isGenerating}
          className="absolute right-2 top-2 flex items-center gap-2 rounded-md bg-purple-600/90 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity hover:bg-purple-500 group-hover:opacity-100 disabled:opacity-50"
        >
          <Sparkles className="h-3 w-3" />
          Concept Lab
        </button>
      </div>

      {/* Status Selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">Status</label>
        <select 
          className="w-full rounded-md border border-white/10 bg-[#0d1117] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          defaultValue={vehicle.status}
        >
          <option>Available - Rental Ready</option>
          <option>Maintenance</option>
          <option>On Rental</option>
          <option>Sold</option>
        </select>
      </div>

      {/* Telemetry Deck */}
      <div className="rounded-lg border border-white/5 bg-[#0d1117] p-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Activity className="h-3 w-3" />
          Live Telemetry
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Fuel/Battery */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                {vehicle.make === 'Tesla' ? <Zap className="h-3 w-3" /> : <Fuel className="h-3 w-3" />}
                {vehicle.make === 'Tesla' ? 'Charge' : 'Fuel'}
              </span>
              <span className={cn("font-mono", (vehicle.fuelLevel || 0) < 20 ? "text-red-400" : "text-white")}>
                {vehicle.fuelLevel}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div 
                className={cn("h-full rounded-full transition-all", (vehicle.fuelLevel || 0) < 20 ? "bg-red-500" : "bg-blue-500")} 
                style={{ width: `${vehicle.fuelLevel}%` }} 
              />
            </div>
          </div>

          {/* Battery Health */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <Battery className="h-3 w-3" />
                Health
              </span>
              <span className="font-mono text-white">{vehicle.batteryHealth}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div 
                className="h-full rounded-full bg-green-500 transition-all" 
                style={{ width: `${vehicle.batteryHealth}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Tire Pressure */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              Tire Pressure (PSI)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {vehicle.tirePressure?.map((psi, i) => (
              <div key={i} className="rounded bg-white/5 p-1.5 text-center">
                <div className="text-[10px] text-gray-500">{['FL', 'FR', 'RL', 'RR'][i]}</div>
                <div className={cn("font-mono text-xs", psi < 30 ? "text-red-400" : "text-white")}>{psi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Maintenance */}
      <div className="rounded-lg border border-white/5 bg-[#0d1117] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <ShieldCheck className="h-3 w-3" />
            Predictive Health
          </div>
          <span className={cn("text-xs font-bold", (vehicle.predictiveScore || 0) > 80 ? "text-green-400" : "text-yellow-400")}>
            {vehicle.predictiveScore}/100
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {(vehicle.predictiveScore || 0) > 80 
            ? "Vehicle is in optimal condition. No immediate service required." 
            : "Attention required: Brake pad wear detected. Schedule service within 200 miles."}
        </p>
      </div>

      {/* Specs (Reduced) */}
      <div className="space-y-2 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">VIN</span>
          <span className="font-mono text-xs text-white">{vehicle.vin}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Mileage</span>
          <span className="font-mono text-xs text-white">{(vehicle.mileage || 0).toLocaleString()} mi</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Last Service</span>
          <span className="text-xs text-white">{vehicle.lastService}</span>
        </div>
      </div>
    </div>
  );
}
