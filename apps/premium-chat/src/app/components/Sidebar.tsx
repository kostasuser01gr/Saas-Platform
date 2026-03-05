import { useState } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  Pin,
  Archive,
  Folder,
  Settings,
  ChevronDown,
  Star,
  MoreHorizontal,
  Hash,
  Sparkles,
  User,
  LogOut,
  CreditCard,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Chat {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
  archived?: boolean;
  folder?: string;
  model: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const models = [
  { id: "nexus-4", name: "Nexus-4", icon: "✦", tier: "Ultra" },
  { id: "nexus-4-mini", name: "Nexus-4 Mini", icon: "◆", tier: "Fast" },
  { id: "nexus-3.5", name: "Nexus-3.5", icon: "●", tier: "Standard" },
  { id: "codex-pro", name: "Codex Pro", icon: "⟐", tier: "Code" },
  { id: "vision-x", name: "Vision-X", icon: "◎", tier: "Vision" },
];

const folders = [
  { id: "work", name: "Work Projects", count: 12 },
  { id: "personal", name: "Personal", count: 8 },
  { id: "research", name: "Research", count: 5 },
];

export function Sidebar({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  selectedModel,
  onModelChange,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showFolders, setShowFolders] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredChats = chats.filter(
    (chat) =>
      !chat.archived &&
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pinnedChats = filteredChats.filter((c) => c.pinned);
  const recentChats = filteredChats.filter((c) => !c.pinned);
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 56, opacity: 1 }}
        className="h-full flex flex-col items-center py-4 gap-3 border-r border-white/[0.06] bg-[#0a0a12]/80"
      >
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-white/60" />
        </button>
        <button
          onClick={onNewChat}
          className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col border-r border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl"
      style={{ width: 280 }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/90 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>NexusAI</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/40">
              <rect x="2" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 hover:border-violet-500/40 hover:from-violet-600/30 hover:to-purple-600/30 transition-all group"
        >
          <Plus className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-colors" />
          <span className="text-sm text-violet-300 group-hover:text-violet-200 transition-colors">New Chat</span>
          <span className="ml-auto text-xs text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">⌘N</span>
        </button>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
          />
        </div>

        {/* Model Selector */}
        <div className="relative mt-3">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
          >
            <span className="text-sm">{currentModel.icon}</span>
            <span className="text-sm text-white/70">{currentModel.name}</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
              {currentModel.tier}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </button>

          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#12121e]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
              >
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.06] transition-colors ${
                      selectedModel === model.id ? "bg-violet-500/10" : ""
                    }`}
                  >
                    <span className="text-sm">{model.icon}</span>
                    <span className="text-sm text-white/80">{model.name}</span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/50">
                      {model.tier}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin">
        {/* Folders */}
        <div className="px-2 mb-2">
          <button
            onClick={() => setShowFolders(!showFolders)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mb-1"
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showFolders ? "" : "-rotate-90"}`}
            />
            <Folder className="w-3 h-3" />
            <span>Folders</span>
          </button>
          <AnimatePresence>
            {showFolders && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5"
              >
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>{folder.name}</span>
                    <span className="ml-auto text-[10px] text-white/20">{folder.count}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 px-2 text-xs text-white/30 mb-1">
              <Pin className="w-3 h-3" />
              <span>Pinned</span>
            </div>
            {pinnedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                active={chat.id === activeChat}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        )}

        {/* Recent Chats */}
        <div>
          <div className="flex items-center justify-between px-2 text-xs text-white/30 mb-1">
            <span>Recent</span>
            <button className="hover:text-white/50 transition-colors">
              <Archive className="w-3 h-3" />
            </button>
          </div>
          {recentChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              active={chat.id === activeChat}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group">
          <Settings className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
          <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">Settings</span>
          <span className="ml-auto text-xs text-white/15">⌘,</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-xs text-white">A</span>
            </div>
            <div className="text-left">
              <div className="text-sm text-white/80">Alex Chen</div>
              <div className="text-[10px] text-white/30">Pro Plan</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30 ml-auto" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                className="absolute bottom-full left-0 right-0 mb-1 bg-[#12121e]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
              >
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <User className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/70">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <CreditCard className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/70">Billing</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-violet-300">Upgrade to Ultra</span>
                  </button>
                  <div className="border-t border-white/[0.06] my-1" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <LogOut className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/70">Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ChatItem({
  chat,
  active,
  onClick,
}: {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all group relative ${
        active
          ? "bg-violet-500/10 border border-violet-500/20 text-white/90"
          : "hover:bg-white/[0.04] text-white/60 hover:text-white/80 border border-transparent"
      }`}
    >
      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : "text-white/25"}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{chat.title}</div>
        <div className="text-[10px] text-white/20 mt-0.5">{chat.date}</div>
      </div>
      {chat.pinned && !hovered && (
        <Pin className="w-3 h-3 text-violet-400/50 flex-shrink-0" />
      )}
      {hovered && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-1 rounded hover:bg-white/[0.1] transition-colors flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-white/40" />
        </motion.button>
      )}
    </button>
  );
}
