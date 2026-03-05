import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { FleetGrid } from './components/dashboard/FleetGrid';
import { VehicleDetail } from './components/dashboard/VehicleDetail';
import { OperationsLog } from './components/dashboard/OperationsLog';
import { AIChat } from './components/chat/AIChat';
import { MapView } from './components/dashboard/MapView';
import { CommandPalette } from './components/ui/CommandPalette';
import { vehicles } from './lib/data';

function App() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0].id);
  const [activeView, setActiveView] = useState<'dashboard' | 'map'>('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#010409] text-white overflow-hidden font-sans">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0d1117] px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{activeView === 'dashboard' ? 'Fleet Overview' : 'Live Map Tracking'}</h1>
            <div className="flex gap-1 rounded-lg bg-white/5 p-1">
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${activeView === 'dashboard' ? 'bg-[#1f6feb] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveView('map')}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${activeView === 'map' ? 'bg-[#1f6feb] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Map
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 rounded border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs text-gray-400 hover:border-white/30 hover:text-white transition-colors"
            >
              <span>Search...</span>
              <kbd className="rounded bg-white/10 px-1.5 font-mono text-[10px]">⌘K</kbd>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' ? (
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Left Column: Vehicle List */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <FleetGrid 
                  selectedId={selectedVehicleId} 
                  onSelect={setSelectedVehicleId} 
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VehicleDetail vehicle={selectedVehicle} />
                  <OperationsLog />
                </div>
              </div>

              {/* Right Column: AI Assistant (GitHub Style) */}
              <div className="col-span-12 lg:col-span-4 h-full min-h-[600px]">
                <AIChat selectedVehicle={selectedVehicle} />
              </div>
            </div>
          ) : (
            <div className="h-full w-full">
              <MapView />
            </div>
          )}
        </div>

        {/* Command Palette Overlay */}
        {isCommandOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[15vh]">
            <CommandPalette 
              isOpen={isCommandOpen} 
              onClose={() => setIsCommandOpen(false)}
              onSelectVehicle={(id) => {
                setSelectedVehicleId(id);
                setActiveView('dashboard');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
