import { useState } from "react";
import {
  Brain,
  Wrench,
  FileText,
  Clock,
  ChevronRight,
  X,
  Cpu,
  Globe,
  Code2,
  CheckCircle2,
  Loader2,
  Database,
  Layers,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = "memory" | "tools" | "files" | "history";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "memory", label: "Memory", icon: Brain },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "files", label: "Files", icon: FileText },
  { id: "history", label: "History", icon: Clock },
];

const memoryItems = [
  { key: "User preference", value: "Dark mode, concise responses", type: "preference" },
  { key: "Language", value: "TypeScript, React, Python", type: "skill" },
  { key: "Project context", value: "Building AI chat platform", type: "context" },
  { key: "Coding style", value: "Functional, clean architecture", type: "preference" },
  { key: "Communication", value: "Technical, detailed explanations", type: "preference" },
];

const activeTools = [
  { name: "Web Search", icon: Globe, status: "ready" as const, color: "text-emerald-400" },
  { name: "Code Interpreter", icon: Code2, status: "active" as const, color: "text-violet-400" },
  { name: "File Analysis", icon: FileText, status: "ready" as const, color: "text-blue-400" },
  { name: "Database Query", icon: Database, status: "inactive" as const, color: "text-white/30" },
  { name: "Vision", icon: Eye, status: "ready" as const, color: "text-amber-400" },
];

const projectFiles = [
  { name: "architecture.md", size: "12 KB", type: "doc" },
  { name: "api-spec.yaml", size: "8 KB", type: "config" },
  { name: "components.tsx", size: "24 KB", type: "code" },
  { name: "data-model.sql", size: "6 KB", type: "database" },
  { name: "test-results.json", size: "3 KB", type: "data" },
];

const promptHistory = [
  { text: "Build a responsive navbar with glassmorphism", time: "2 min ago" },
  { text: "Optimize the database query for users table", time: "15 min ago" },
  { text: "Explain React Server Components", time: "1 hr ago" },
  { text: "Write unit tests for auth module", time: "2 hrs ago" },
  { text: "Debug the WebSocket connection issue", time: "3 hrs ago" },
];

export function RightPanel({ isOpen, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("memory");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full flex flex-col border-l border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl overflow-hidden"
          style={{ minWidth: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-white/70">Context Panel</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4 text-white/30" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs transition-all relative ${
                  activeTab === tab.id
                    ? "text-violet-400"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="rightTabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-violet-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <AnimatePresence mode="wait">
              {activeTab === "memory" && (
                <motion.div
                  key="memory"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40">Context Window</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="w-[65%] h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                      </div>
                      <span className="text-[10px] text-white/25">65%</span>
                    </div>
                  </div>
                  {memoryItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-3 h-3 text-violet-400/60" />
                        <span className="text-xs text-white/50">{item.key}</span>
                      </div>
                      <p className="text-xs text-white/70 pl-5">{item.value}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "tools" && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <span className="text-xs text-white/40 block mb-3">Active Capabilities</span>
                  {activeTools.map((tool, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      <div className="flex-1">
                        <span className="text-xs text-white/70">{tool.name}</span>
                      </div>
                      {tool.status === "active" ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />
                          <span className="text-[10px] text-violet-400">Running</span>
                        </div>
                      ) : tool.status === "ready" ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Ready</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/20">Off</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <span className="text-xs text-white/40 block mb-3">Project Files</span>
                  {projectFiles.map((file, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all text-left"
                    >
                      <FileText className="w-4 h-4 text-white/30" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/70 truncate">{file.name}</div>
                        <div className="text-[10px] text-white/25">{file.size}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/15" />
                    </button>
                  ))}
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <span className="text-xs text-white/40 block mb-3">Recent Prompts</span>
                  {promptHistory.map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all text-left"
                    >
                      <p className="text-xs text-white/60 line-clamp-2">{prompt.text}</p>
                      <span className="text-[10px] text-white/20 mt-1 block">{prompt.time}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
