import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  MessageCircle, 
  Bot, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
  Command,
  Droplets,
  CalendarRange,
  UploadCloud,
  MapPin,
  ShieldAlert,
  Menu
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/use-theme';
import CommandPalette from './CommandPalette';
import { useApp, Station } from '@/contexts/AppContext';

export default function DashboardLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, currentStation, setStation, isKioskMode, toggleKioskMode } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: Bot, label: 'AI Assistant', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
    { icon: Car, label: 'Fleet', path: '/fleet' },
    { icon: Droplets, label: 'Washers', path: '/washers' },
    { icon: CalendarRange, label: 'Shifts', path: '/shifts' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: MessageCircle, label: 'Team Chat', path: '/chat' },
    { icon: UploadCloud, label: 'Imports', path: '/imports' },
  ];

  // Kiosk Mode (Washer App) - Minimal Shell
  if (isKioskMode) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <header className="h-16 bg-zinc-900 flex items-center justify-between px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Droplets className="text-blue-500" />
            <span className="font-bold text-lg">Washer Kiosk</span>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleKioskMode} className="text-zinc-500">
            Exit Kiosk
          </Button>
        </header>
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <CommandPalette />
      
      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Car className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">DriveFlow</span>
        </div>

        {/* Station Switcher */}
        <div className="px-4 mb-2">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-between cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors group">
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Station</span>
                <span className="text-sm font-semibold truncate capitalize">{currentStation === 'hq' ? 'Headquarters' : currentStation}</span>
              </div>
            </div>
            <select 
              className="absolute opacity-0 inset-0 cursor-pointer"
              value={currentStation}
              onChange={(e) => setStation(e.target.value as Station)}
            >
              <option value="hq">Headquarters</option>
              <option value="airport">Airport Hub</option>
              <option value="downtown">Downtown</option>
            </select>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
              isActive 
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <Settings size={18} />
            Settings
          </NavLink>
          
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-lg"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors mt-1 rounded-lg">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="relative w-full max-w-md group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search or type Cmd+K..." 
                className="w-full pl-10 pr-12 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white dark:bg-zinc-700 rounded border border-zinc-200 dark:border-zinc-600 shadow-sm">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Badge (God Mode Indicator) */}
            {user.role === 'admin' && (
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-red-800">
                <ShieldAlert size={12} />
                God Mode
              </div>
            )}

            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-zinc-500 capitalize">{user.role}</div>
              </div>
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
