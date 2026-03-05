import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, MoreHorizontal, Fuel, Gauge, AlertCircle, Wrench, CheckSquare, Square, Trash2, RefreshCw, Map as MapIcon, List, Battery, Zap, AlertTriangle, Navigation, CheckCircle2, Droplets } from 'lucide-react';
import MaintenanceModal from '@/components/fleet/MaintenanceModal';
import AddVehicleModal from '@/components/fleet/AddVehicleModal';
import ReadinessChecklistModal from '@/components/fleet/ReadinessChecklistModal';
import { cn } from '@/lib/utils';

const initialVehicles = [
  { id: 'V001', make: 'Toyota', model: 'Camry', plate: 'ABC-123', status: 'Available', fuel: '100%', mileage: '12,450 km', category: 'Sedan', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=500', lat: 40.7128, lng: -74.0060, speed: 0, battery: '12.4V' },
  { id: 'V002', make: 'Tesla', model: 'Model 3', plate: 'ELN-404', status: 'Rented', fuel: '85%', mileage: '8,200 km', category: 'Electric', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=500', lat: 40.7580, lng: -73.9855, speed: 45, battery: '85%' },
  { id: 'V003', make: 'Ford', model: 'Explorer', plate: 'SUV-999', status: 'Maintenance', fuel: '40%', mileage: '45,100 km', category: 'SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500', lat: 40.7829, lng: -73.9654, speed: 0, battery: '12.2V' },
  { id: 'V004', make: 'BMW', model: 'X5', plate: 'LUX-001', status: 'Available', fuel: '95%', mileage: '5,600 km', category: 'Luxury', image: 'https://images.unsplash.com/photo-1556189250-72ba95452250?auto=format&fit=crop&q=80&w=500', lat: 40.7484, lng: -73.9857, speed: 0, battery: '12.6V' },
  { id: 'V005', make: 'Honda', model: 'Civic', plate: 'ECO-555', status: 'Cleaning', fuel: '10%', mileage: '22,300 km', category: 'Economy', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=500', lat: 40.7291, lng: -73.9965, speed: 0, battery: '12.3V' },
  { id: 'V006', make: 'Jeep', model: 'Wrangler', plate: 'ADV-777', status: 'Dirty', fuel: '30%', mileage: '34,000 km', category: 'SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500', lat: 40.7600, lng: -73.9700, speed: 0, battery: '12.5V' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Rented': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
    case 'Maintenance': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Cleaning': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Dirty': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'QC Ready': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default: return 'bg-zinc-100 text-zinc-700';
  }
};

export default function Fleet() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof initialVehicles[0] | null>(null);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isQCOpen, setIsQCOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleOpenMaintenance = (vehicle: typeof initialVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsMaintenanceOpen(true);
  };

  const handleOpenQC = (vehicle: typeof initialVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsQCOpen(true);
  };

  const handleAddVehicle = (newVehicle: any) => {
    setVehicles([newVehicle, ...vehicles]);
  };

  const handleQCConfirm = (status: string) => {
    if (selectedVehicle) {
      setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? { ...v, status } : v));
    }
  };

  // Bulk Actions
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === vehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vehicles.map(v => v.id));
    }
  };

  const handleBulkStatusChange = (newStatus: string) => {
    setVehicles(prev => prev.map(v => 
      selectedIds.includes(v.id) ? { ...v, status: newStatus } : v
    ));
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} vehicles?`)) {
      setVehicles(prev => prev.filter(v => !selectedIds.includes(v.id)));
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-zinc-500 text-sm">Manage vehicle status, maintenance, and availability.</p>
        </div>
        <div className="flex gap-3">
          {isSelectionMode ? (
            <>
              <span className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 mr-2">
                {selectedIds.length} selected
              </span>
              <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                <Trash2 size={16} />
                Delete
              </Button>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('Maintenance')} disabled={selectedIds.length === 0}>
                  <Wrench size={14} className="mr-1" /> Maint
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('Cleaning')} disabled={selectedIds.length === 0}>
                  <Droplets size={14} className="mr-1" /> Wash
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange('Available')} disabled={selectedIds.length === 0}>
                  <CheckCircle2 size={14} className="mr-1" /> Ready
                </Button>
              </div>
              <Button variant="ghost" onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === 'grid' ? "bg-white dark:bg-zinc-700 shadow-sm text-indigo-600" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === 'map' ? "bg-white dark:bg-zinc-700 shadow-sm text-indigo-600" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <MapIcon size={18} />
                </button>
              </div>

              {viewMode === 'grid' && (
                <Button variant="outline" className="gap-2" onClick={() => setIsSelectionMode(true)}>
                  <CheckSquare size={16} />
                  Select
                </Button>
              )}
              
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddVehicleOpen(true)}>
                <Plus size={16} />
                Add Vehicle
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'grid' ? (
        <>
          {/* Search and Quick Filters */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by make, model, or license plate..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Available', 'Rented', 'Maintenance', 'Cleaning', 'Dirty'].map((filter) => (
                <button key={filter} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Selection Header */}
          {isSelectionMode && (
            <div className="flex items-center gap-3 px-2 flex-shrink-0">
              <button onClick={toggleAll} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                {selectedIds.length === vehicles.length ? <CheckSquare size={18} /> : <Square size={18} />}
                Select All
              </button>
            </div>
          )}

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className={cn(
                  "bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all group relative",
                  isSelectionMode && selectedIds.includes(vehicle.id) 
                    ? "border-indigo-500 ring-1 ring-indigo-500" 
                    : "border-zinc-200 dark:border-zinc-800"
                )}
                onClick={() => isSelectionMode && toggleSelection(vehicle.id)}
              >
                {/* Selection Overlay */}
                {isSelectionMode && (
                  <div className="absolute top-3 left-3 z-20">
                    <div className={cn(
                      "w-6 h-6 rounded bg-white dark:bg-zinc-800 border flex items-center justify-center transition-colors",
                      selectedIds.includes(vehicle.id) 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-zinc-300 dark:border-zinc-600"
                    )}>
                      {selectedIds.includes(vehicle.id) && <CheckSquare size={14} />}
                    </div>
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-zinc-500">{vehicle.category} • {vehicle.plate}</p>
                    </div>
                    {!isSelectionMode && (
                      <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <MoreHorizontal size={20} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Fuel size={16} className="text-indigo-500" />
                      {vehicle.fuel}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Gauge size={16} className="text-indigo-500" />
                      {vehicle.mileage}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs h-8" 
                      onClick={(e) => { e.stopPropagation(); handleOpenMaintenance(vehicle); }}
                      disabled={isSelectionMode}
                    >
                      <Wrench size={14} className="mr-1.5" />
                      Service
                    </Button>
                    <Button 
                      className="flex-1 text-xs h-8 bg-indigo-600 hover:bg-indigo-700"
                      onClick={(e) => { e.stopPropagation(); handleOpenQC(vehicle); }}
                      disabled={isSelectionMode}
                    >
                      <CheckCircle2 size={14} className="mr-1.5" />
                      QC Check
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Live Map View */
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden relative flex">
          {/* Mock Map Background */}
          <div className="flex-1 relative bg-[#e5e7eb] dark:bg-[#1f2937] overflow-hidden">
            <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ 
              backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }}></div>
            
            {/* Map Markers */}
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: `${50 + (Math.random() * 40 - 20)}%`, left: `${50 + (Math.random() * 60 - 30)}%` }}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full ring-4 ring-opacity-30 animate-pulse",
                  vehicle.status === 'Rented' ? "bg-indigo-500 ring-indigo-500" : "bg-emerald-500 ring-emerald-500"
                )}></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 p-3 hidden group-hover:block z-10">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs">{vehicle.make} {vehicle.model}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", getStatusColor(vehicle.status))}>
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-[10px] text-zinc-500">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-100">{vehicle.speed || 0} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel:</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-100">{vehicle.fuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-100">{vehicle.battery || '12.4V'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Telematics Sidebar */}
          <div className="w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Zap className="text-amber-500" size={16} />
                Live Telematics
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Real-time fleet monitoring active.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Alerts Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Alerts</h4>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex gap-3">
                  <AlertTriangle className="text-red-600 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Geo-fence Breach</p>
                    <p className="text-[10px] text-red-600 dark:text-red-300 mt-0.5">Vehicle V002 left the designated zone.</p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex gap-3">
                  <Battery className="text-amber-600 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Low Battery Warning</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-300 mt-0.5">Vehicle V005 is at 10% charge.</p>
                  </div>
                </div>
              </div>

              {/* Moving Vehicles */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Moving Now</h4>
                {vehicles.filter(v => (v.speed || 0) > 0).map(vehicle => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                        <Navigation size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{vehicle.make} {vehicle.model}</p>
                        <p className="text-[10px] text-zinc-500">{vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-emerald-600">{vehicle.speed} km/h</p>
                      <p className="text-[10px] text-zinc-400">Main St, NY</p>
                    </div>
                  </div>
                ))}
                {vehicles.filter(v => (v.speed || 0) > 0).length === 0 && (
                  <p className="text-xs text-zinc-400 italic">No vehicles currently moving.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedVehicle && (
        <MaintenanceModal 
          vehicle={selectedVehicle} 
          isOpen={isMaintenanceOpen} 
          onClose={() => setIsMaintenanceOpen(false)} 
        />
      )}

      {selectedVehicle && (
        <ReadinessChecklistModal
          vehicle={selectedVehicle}
          isOpen={isQCOpen}
          onClose={() => setIsQCOpen(false)}
          onConfirm={handleQCConfirm}
        />
      )}

      <AddVehicleModal 
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAdd={handleAddVehicle}
      />
    </div>
  );
}
