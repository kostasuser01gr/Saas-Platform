import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Car, 
  Users, 
  MessageCircle, 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  LayoutDashboard,
  Wrench,
  Plus,
  Map,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/use-theme';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string[];
  action: () => void;
  group: 'Navigation' | 'Actions' | 'System';
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Toggle function
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const commands: Command[] = [
    // Navigation
    { id: 'nav-dash', label: 'Go to Dashboard', icon: LayoutDashboard, group: 'Navigation', action: () => navigate('/dashboard') },
    { id: 'nav-fleet', label: 'Go to Fleet', icon: Car, group: 'Navigation', action: () => navigate('/fleet') },
    { id: 'nav-cust', label: 'Go to Customers', icon: Users, group: 'Navigation', action: () => navigate('/customers') },
    { id: 'nav-chat', label: 'Go to Team Chat', icon: MessageCircle, group: 'Navigation', action: () => navigate('/chat') },
    { id: 'nav-settings', label: 'Go to Settings', icon: Settings, group: 'Navigation', action: () => navigate('/settings') },
    
    // Actions
    { id: 'act-vehicle', label: 'Add New Vehicle', icon: Plus, group: 'Actions', action: () => { navigate('/fleet'); /* In real app, trigger modal */ } },
    { id: 'act-customer', label: 'Add New Customer', icon: UserPlus, group: 'Actions', action: () => { navigate('/customers'); } },
    { id: 'act-map', label: 'View Live Fleet Map', icon: Map, group: 'Actions', action: () => navigate('/fleet?view=map') },
    
    // System
    { id: 'sys-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, group: 'System', action: toggleTheme },
    { id: 'sys-logout', label: 'Log Out', icon: LogOut, group: 'System', action: () => console.log('Logging out...') },
  ];

  // Filter commands
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleOpen();
      }
      
      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            setIsOpen(false);
            setQuery('');
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 h-6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">ESC</kbd>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              No commands found.
            </div>
          ) : (
            <div className="space-y-1">
              {['Navigation', 'Actions', 'System'].map((group) => {
                const groupCommands = filteredCommands.filter(c => c.group === group);
                if (groupCommands.length === 0) return null;

                return (
                  <div key={group}>
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      {group}
                    </div>
                    {groupCommands.map((command) => {
                      // Calculate absolute index for highlighting
                      const absoluteIndex = filteredCommands.indexOf(command);
                      const isSelected = absoluteIndex === selectedIndex;

                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            setIsOpen(false);
                            setQuery('');
                          }}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                            isSelected 
                              ? "bg-indigo-600 text-white" 
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          )}
                        >
                          <command.icon size={16} className={cn(isSelected ? "text-white" : "text-zinc-500")} />
                          <span className="flex-1 text-left">{command.label}</span>
                          {isSelected && <span className="text-xs opacity-70">↵</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
          <div className="flex gap-2">
            <span>Use <kbd className="font-sans">↑↓</kbd> to navigate</span>
            <span><kbd className="font-sans">↵</kbd> to select</span>
          </div>
          <span>DriveFlow OS v2.0</span>
        </div>
      </div>
    </div>
  );
}

// Helper for icon
function UserPlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  )
}
