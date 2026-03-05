import React from 'react';
import { Plus, MessageSquare, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Trash2, Moon, Sun, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/lib/use-theme';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export function Sidebar({ 
  isOpen, 
  setIsOpen, 
  onNewChat, 
  sessions, 
  currentSessionId, 
  onSelectSession,
  onDeleteSession
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  
  // Group sessions by date (Today, Yesterday, Previous 7 Days, Older)
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.updatedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    let group = 'Older';
    if (diffDays === 0) group = 'Today';
    else if (diffDays === 1) group = 'Yesterday';
    else if (diffDays <= 7) group = 'Previous 7 Days';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  const groups = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={16} className="text-zinc-400" />;
    if (theme === 'dark') return <Moon size={16} className="text-zinc-400" />;
    return <Laptop size={16} className="text-zinc-400" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light Mode';
    if (theme === 'dark') return 'Dark Mode';
    return 'System Mode';
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out md:relative md:inset-auto md:h-full",
          isOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden"
        )}
      >
        <div className="p-3 flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            variant="outline"
            className="w-full justify-start gap-2 h-10 px-3 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-sm mb-4"
          >
            <Plus size={16} />
            <span>New chat</span>
          </Button>

          {/* History Section */}
          <div className="space-y-4">
            {groups.map(group => {
              const groupSessions = groupedSessions[group];
              if (!groupSessions || groupSessions.length === 0) return null;

              return (
                <div key={group}>
                  <div className="px-3 py-2 text-xs font-medium text-zinc-500">{group}</div>
                  <div className="space-y-1">
                    {groupSessions.map(session => (
                      <div 
                        key={session.id}
                        className={cn(
                          "group relative flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
                          currentSessionId === session.id 
                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                        )}
                        onClick={() => onSelectSession(session.id)}
                      >
                        <MessageSquare size={14} className="flex-shrink-0 text-zinc-500" />
                        <span className="truncate flex-1 pr-6">{session.title || 'New Chat'}</span>
                        
                        <button
                          onClick={(e) => onDeleteSession(session.id, e)}
                          className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-500 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {sessions.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-zinc-400">
                No chat history yet
              </div>
            )}
          </div>
        </div>

        {/* User Profile / Settings */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              {getThemeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Theme</div>
              <div className="text-xs text-zinc-500">{getThemeLabel()}</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-3 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
              US
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">User</div>
              <div className="text-xs text-zinc-500 truncate">Free Plan</div>
            </div>
            <Settings size={16} className="text-zinc-400" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
