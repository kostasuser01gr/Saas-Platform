import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Wrench, AlertTriangle, FileSpreadsheet, 
  QrCode, Mic, MessageSquare, Bot, Settings, LogOut, Menu, X, CheckCircle
} from 'lucide-react';

// Components
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ImportWizard from './pages/ImportWizard.tsx';
import ModulePlaceholder from './pages/ModulePlaceholder.tsx';
import HealthCheck from './pages/HealthCheck.tsx';
import FleetManagement from './pages/FleetManagement.tsx';

// Navigation Structure
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Fleet / Vehicles', path: '/fleet', icon: Truck },
  { label: 'Services', path: '/service', icon: Wrench },
  { label: 'Recalls', path: '/recalls', icon: AlertTriangle },
  { label: 'Import Data', path: '/import', icon: FileSpreadsheet },
  { label: 'Scan & OCR', path: '/scan', icon: QrCode },
  { label: 'Voice Ops', path: '/voice', icon: Mic },
  { label: 'Team Chat', path: '/chat', icon: MessageSquare },
  { label: 'AI Assistant', path: '/ai', icon: Bot },
];

const SECONDARY_NAV = [
  { label: 'Tyres', path: '/tyres' },
  { label: 'KTEO / MOT', path: '/kteo' },
  { label: 'Insurance / Parking', path: '/parking' },
  { label: 'Glass / Body', path: '/glass' },
  { label: 'Equipment / Missing', path: '/equipment' },
];

function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location, isMobile]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Truck size={20} className="text-white" />
            </div>
            <span>FleetOps Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-6 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Modules
          </div>
          <div className="mt-2 space-y-1">
            {SECONDARY_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">Fleet Manager</p>
            </div>
            <button className="text-slate-400 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center p-4 bg-white border-b shadow-sm z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800">FleetOps Hub</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <ErrorBoundary>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/import" element={<ImportWizard />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/fleet" element={<FleetManagement />} />
          
          {/* Modules Route Handling */}
          {[...NAV_ITEMS, ...SECONDARY_NAV].map(item => {
            if (item.path === '/' || item.path === '/import' || item.path === '/fleet') return null;
            return (
              <Route 
                key={item.path} 
                path={item.path} 
                element={<ModulePlaceholder name={item.label} />} 
              />
            );
          })}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);