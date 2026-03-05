import { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageSquare,
  Settings,
  Sparkles,
  Code2,
  Globe,
  FileText,
  Moon,
  Palette,
  Zap,
  ArrowRight,
  Bot,
  Command,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, onNewChat }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: "new-chat", label: "New Chat", description: "Start a new conversation", icon: MessageSquare, category: "Chat", shortcut: "⌘N", action: onNewChat },
    { id: "search-chats", label: "Search Chats", description: "Find previous conversations", icon: Search, category: "Chat", shortcut: "⌘F", action: () => {} },
    { id: "switch-model", label: "Switch Model", description: "Change the AI model", icon: Sparkles, category: "Model", shortcut: "⌘M", action: () => {} },
    { id: "code-mode", label: "Code Mode", description: "Activate code assistant", icon: Code2, category: "Tools", action: () => {} },
    { id: "web-browse", label: "Web Browse", description: "Search the internet", icon: Globe, category: "Tools", action: () => {} },
    { id: "launch-agent", label: "Launch Agent", description: "Start an autonomous agent", icon: Bot, category: "Agents", action: () => {} },
    { id: "view-files", label: "View Files", description: "Browse project files", icon: FileText, category: "Files", action: () => {} },
    { id: "workspaces", label: "Workspaces", description: "Switch between workspaces", icon: Hash, category: "Navigation", action: () => {} },
    { id: "theme", label: "Toggle Theme", description: "Switch dark/light mode", icon: Moon, category: "Settings", action: () => {} },
    { id: "customize", label: "Customize", description: "Personalize your interface", icon: Palette, category: "Settings", action: () => {} },
    { id: "settings", label: "Settings", description: "Open settings panel", icon: Settings, category: "Settings", shortcut: "⌘,", action: () => {} },
    { id: "upgrade", label: "Upgrade Plan", description: "Unlock advanced features", icon: Zap, category: "Account", action: () => {} },
  ];

  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const categories = [...new Set(filteredCommands.map((c) => c.category))];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101]"
          >
            <div className="bg-[#0e0e1a]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Command className="w-4 h-4 text-violet-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/25 focus:outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <kbd className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/25">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-white/30">No results found</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category}>
                      <div className="px-4 py-1.5">
                        <span className="text-[10px] text-white/20 uppercase tracking-wider">
                          {category}
                        </span>
                      </div>
                      {filteredCommands
                        .filter((c) => c.category === category)
                        .map((cmd) => {
                          const globalIdx = filteredCommands.indexOf(cmd);
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => {
                                cmd.action();
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                                selectedIndex === globalIdx
                                  ? "bg-violet-500/10"
                                  : "hover:bg-white/[0.03]"
                              }`}
                            >
                              <cmd.icon
                                className={`w-4 h-4 ${
                                  selectedIndex === globalIdx
                                    ? "text-violet-400"
                                    : "text-white/30"
                                }`}
                              />
                              <div className="flex-1 text-left">
                                <div className="text-sm text-white/80">{cmd.label}</div>
                                <div className="text-xs text-white/25">{cmd.description}</div>
                              </div>
                              {cmd.shortcut ? (
                                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/20">
                                  {cmd.shortcut}
                                </kbd>
                              ) : (
                                selectedIndex === globalIdx && (
                                  <ArrowRight className="w-3.5 h-3.5 text-violet-400/50" />
                                )
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.04]">
                <span className="text-[10px] text-white/15">
                  ↑↓ navigate
                </span>
                <span className="text-[10px] text-white/15">
                  ↵ select
                </span>
                <span className="text-[10px] text-white/15">
                  esc close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
