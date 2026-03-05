import React, { useState } from 'react';
import { 
  Car, Calendar, Clock, MapPin, Shield, AlertTriangle, 
  CheckCircle2, FileText, Wrench, Activity, Search, 
  MoreVertical, Fuel, Gauge, History, ChevronRight, Filter
} from 'lucide-react';

// Types
interface Vehicle {
  id: string;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: 'ACTIVE' | 'SERVICE' | 'ISSUE';
  mileage: number;
  fuelType: string;
  transmission: string;
  image: string;
  documents: {
    insurance: { provider: string; expires: string; status: 'valid' | 'expiring' | 'expired' };
    kteo: { expires: string; status: 'valid' | 'expiring' | 'expired' };
    tax: { expires: string; status: 'valid' | 'expiring' | 'expired' };
  };
  maintenance: {
    lastService: string;
    nextService: string;
    tyreCondition: string;
    batteryHealth: string;
  };
  location: {
    status: string;
    zone: string;
    spot: string;
  };
  timeline: {
    id: number;
    type: 'service' | 'inspection' | 'usage' | 'legal';
    date: string;
    title: string;
    desc: string;
    user: string;
  }[];
}

// Mock Data
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plate: 'ZHZ-1234',
    vin: 'JTDKN3DU001234567',
    make: 'Toyota',
    model: 'Yaris Hybrid',
    year: 2021,
    color: 'Pearl White',
    status: 'ACTIVE',
    mileage: 45230,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1623200782352-87dc348b1118?auto=format&fit=crop&q=80&w=600&h=400',
    documents: {
      insurance: { provider: 'Allianz', expires: '2024-11-30', status: 'valid' },
      kteo: { expires: '2025-05-20', status: 'valid' },
      tax: { expires: '2024-12-31', status: 'valid' }
    },
    maintenance: {
      lastService: '2023-12-10',
      nextService: '2024-06-15',
      tyreCondition: 'Good (75%)',
      batteryHealth: '92%'
    },
    location: {
      status: 'PARKED',
      zone: 'Headquarters - Zone A',
      spot: 'A-42'
    },
    timeline: [
      { id: 1, type: 'service', date: '2023-12-10', title: 'Regular Maintenance', desc: 'Oil change, filter replacement, brake check', user: 'Mike T.' },
      { id: 2, type: 'inspection', date: '2023-11-05', title: 'Monthly Inspection', desc: 'All systems nominal. Wipers replaced.', user: 'Sarah K.' },
      { id: 3, type: 'usage', date: '2023-10-20', title: 'Trip Log', desc: 'Athens to Thessaloniki return (1004km)', user: 'John D.' },
      { id: 4, type: 'legal', date: '2023-09-15', title: 'Insurance Renewal', desc: 'Policy renewed with Allianz', user: 'Admin' }
    ]
  },
  {
    id: '2',
    plate: 'IPZ-5555',
    vin: 'ZFA31200005987654',
    make: 'Fiat',
    model: 'Panda Van',
    year: 2020,
    color: 'Red',
    status: 'ISSUE',
    mileage: 89100,
    fuelType: 'Diesel',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1609520505218-7421da3b3d35?auto=format&fit=crop&q=80&w=600&h=400',
    documents: {
      insurance: { provider: 'Interamerican', expires: '2024-10-15', status: 'valid' },
      kteo: { expires: '2024-04-10', status: 'expiring' },
      tax: { expires: '2024-12-31', status: 'valid' }
    },
    maintenance: {
      lastService: '2023-08-15',
      nextService: '2024-02-15',
      tyreCondition: 'Worn (Replace Soon)',
      batteryHealth: '78%'
    },
    location: {
      status: 'IN_USE',
      zone: 'Route 4',
      spot: 'N/A'
    },
    timeline: [
      { id: 1, type: 'inspection', date: '2024-03-01', title: 'Driver Report', desc: 'Engine noise reported during startup', user: 'George P.' },
      { id: 2, type: 'service', date: '2023-08-15', title: 'Major Service', desc: 'Timing belt replacement', user: 'Mike T.' }
    ]
  }
];

export default function FleetManagement() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_VEHICLES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  
  const vehicle = MOCK_VEHICLES.find(v => v.id === selectedId) || MOCK_VEHICLES[0];
  const filteredVehicles = MOCK_VEHICLES.filter(v => 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'SERVICE': return 'bg-amber-100 text-amber-700';
      case 'ISSUE': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600';
      case 'expiring': return 'text-amber-600';
      case 'expired': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
      {/* Sidebar List */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 mb-4">Fleet List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search plate or model..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredVehicles.map(v => (
            <div 
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedId === v.id ? 'bg-blue-50 border-blue-100' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-800">{v.plate}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{v.make} {v.model}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Gauge size={12} /> {v.mileage.toLocaleString()} km
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-6">
          
          {/* Hero Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Wrench size={18} />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-6 gap-6">
                <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{vehicle.make} {vehicle.model}</h1>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wide">
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Car size={16} /> {vehicle.vin}</span>
                    <span className="flex items-center gap-1.5"><Fuel size={16} /> {vehicle.fuelType}</span>
                    <span className="flex items-center gap-1.5"><Activity size={16} /> {vehicle.transmission}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm text-slate-500 font-medium">Odometer</div>
                  <div className="text-2xl font-mono font-bold text-slate-800">{vehicle.mileage.toLocaleString()} <span className="text-sm text-slate-400">km</span></div>
                </div>
              </div>

              {/* Quick Actions / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                 {/* Maintenance */}
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Wrench size={14} /> Maintenance
                    </h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Next Service</span>
                      <span className="font-medium text-slate-900">{vehicle.maintenance.nextService}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Last Service</span>
                      <span className="text-slate-500">{vehicle.maintenance.lastService}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tyres</span>
                      <span className={`${vehicle.maintenance.tyreCondition.includes('Good') ? 'text-green-600' : 'text-amber-600'} font-medium`}>
                        {vehicle.maintenance.tyreCondition}
                      </span>
                    </div>
                 </div>

                 {/* Legal / Docs */}
                 <div className="space-y-3 md:border-l border-slate-100 md:pl-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={14} /> Compliance
                    </h3>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-600">KTEO / MOT</span>
                      <span className={`font-medium flex items-center gap-1.5 ${getDocStatusColor(vehicle.documents.kteo.status)}`}>
                        {vehicle.documents.kteo.expires}
                        {vehicle.documents.kteo.status === 'valid' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-600">Insurance</span>
                      <span className={`font-medium flex items-center gap-1.5 ${getDocStatusColor(vehicle.documents.insurance.status)}`}>
                        {vehicle.documents.insurance.expires}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Road Tax</span>
                      <span className="text-green-600 font-medium">Paid</span>
                    </div>
                 </div>

                 {/* Location */}
                 <div className="space-y-3 md:border-l border-slate-100 md:pl-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <MapPin size={14} /> Location
                    </h3>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${vehicle.location.status === 'PARKED' ? 'bg-blue-500' : 'bg-green-500'}`} />
                        <span className="text-sm font-bold text-slate-800">{vehicle.location.status}</span>
                      </div>
                      <p className="text-xs text-slate-600">{vehicle.location.zone}</p>
                      <p className="text-xs text-slate-500">Spot: {vehicle.location.spot}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-slate-400" /> Vehicle History
                </h3>
                <button className="text-xs text-blue-600 font-medium hover:underline flex items-center">
                  View Full Log <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-6">
                {vehicle.timeline.map((event, idx) => (
                  <div key={event.id} className="relative pl-6 last:pb-0">
                    {/* Vertical Line */}
                    {idx !== vehicle.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-slate-100" />
                    )}
                    
                    {/* Dot */}
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                      ${event.type === 'service' ? 'bg-blue-500' : 
                        event.type === 'inspection' ? 'bg-indigo-500' : 
                        event.type === 'legal' ? 'bg-amber-500' : 'bg-slate-400'}`}
                    >
                      {event.type === 'service' && <Wrench size={10} className="text-white" />}
                      {event.type === 'inspection' && <CheckCircle2 size={10} className="text-white" />}
                      {event.type === 'legal' && <FileText size={10} className="text-white" />}
                      {event.type === 'usage' && <Car size={10} className="text-white" />}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800">{event.title}</span>
                        <span className="text-xs text-slate-400">{event.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{event.desc}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                          {event.user.charAt(0)}
                        </span>
                        {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Specs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-slate-400" /> Specifications
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Color</span>
                  <span className="text-slate-800 font-medium">{vehicle.color}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Battery Health</span>
                  <span className="text-green-600 font-medium">{vehicle.maintenance.batteryHealth}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Keys</span>
                  <span className="text-slate-800 font-medium">2 Sets</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Engine Size</span>
                  <span className="text-slate-800 font-medium">1490 cc</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500">HP / KW</span>
                  <span className="text-slate-800 font-medium">116 / 85</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors text-sm border border-slate-200">
                  Download Full Spec Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}