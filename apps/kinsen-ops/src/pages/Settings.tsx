import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Save, Plus, X, Layout, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock User Data
const initialUser = {
  name: 'Alex Morgan',
  role: 'Branch Manager',
  email: 'alex.morgan@driveflow.com',
  avatar: 'AM',
  bio: 'Managing the Downtown branch since 2022.',
  notifications: {
    email: true,
    push: true,
    weeklyReport: false,
  }
};

// Mock Shortcuts
const availableShortcuts = [
  { id: 'new_booking', label: 'New Booking', icon: 'Calendar', path: '/bookings?action=new' },
  { id: 'add_vehicle', label: 'Add Vehicle', icon: 'Car', path: '/fleet?action=add' },
  { id: 'add_customer', label: 'Add Customer', icon: 'UserPlus', path: '/customers?action=add' },
  { id: 'view_reports', label: 'View Reports', icon: 'BarChart', path: '/dashboard?view=reports' },
  { id: 'team_chat', label: 'Team Chat', icon: 'MessageCircle', path: '/chat' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(initialUser);
  const [myShortcuts, setMyShortcuts] = useState<string[]>(['new_booking', 'add_vehicle']);
  const [isEditing, setIsEditing] = useState(false);

  // Load shortcuts from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_shortcuts');
    if (saved) {
      setMyShortcuts(JSON.parse(saved));
    }
  }, []);

  // Save shortcuts
  const toggleShortcut = (id: string) => {
    const newShortcuts = myShortcuts.includes(id)
      ? myShortcuts.filter(s => s !== id)
      : [...myShortcuts, id];
    
    setMyShortcuts(newShortcuts);
    localStorage.setItem('user_shortcuts', JSON.stringify(newShortcuts));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 h-full overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings & Profile</h1>
        <p className="text-zinc-500 text-sm">Manage your account, preferences, and workspace shortcuts.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'shortcuts', label: 'Shortcuts & Pins', icon: Star },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                activeTab === item.id 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {user.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-zinc-500">{user.role}</p>
                  <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Bio / Role Description</label>
                  <textarea 
                    rows={3}
                    value={user.bio}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Workspace Shortcuts</h3>
                <p className="text-sm text-zinc-500">Pin your most used actions to your dashboard for quick access.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableShortcuts.map((shortcut) => {
                  const isPinned = myShortcuts.includes(shortcut.id);
                  return (
                    <div 
                      key={shortcut.id}
                      onClick={() => toggleShortcut(shortcut.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                        isPinned 
                          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm" 
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isPinned ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        )}>
                          <Layout size={18} />
                        </div>
                        <span className={cn("font-medium", isPinned ? "text-indigo-900 dark:text-indigo-100" : "text-zinc-700 dark:text-zinc-300")}>
                          {shortcut.label}
                        </span>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                        isPinned 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "border-zinc-300 dark:border-zinc-600 text-transparent"
                      )}>
                        <Plus size={14} className={cn("transition-transform", isPinned && "rotate-45")} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-6">
                <h4 className="text-sm font-semibold mb-2">Pro Tip</h4>
                <p className="text-xs text-zinc-500">
                  Shortcuts selected here will appear in the "Quick Actions" widget on your Dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['notifications', 'appearance', 'security'].includes(activeTab) && (
            <div className="p-12 text-center text-zinc-500">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout size={24} />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Coming Soon</h3>
              <p className="max-w-xs mx-auto mt-2">This settings module is under development for Phase 2.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
