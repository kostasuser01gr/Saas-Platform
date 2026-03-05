import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Globe,
  Code2,
  Bot,
  HardDrive,
  ChevronDown,
  Image,
  Sparkles,
  X,
  Slash,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InputComposerProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: "nexus-4", name: "Nexus-4", icon: "✦", tier: "Ultra" },
  { id: "nexus-4-mini", name: "Nexus-4 Mini", icon: "◆", tier: "Fast" },
  { id: "nexus-3.5", name: "Nexus-3.5", icon: "●", tier: "Standard" },
  { id: "codex-pro", name: "Codex Pro", icon: "⟐", tier: "Code" },
  { id: "vision-x", name: "Vision-X", icon: "◎", tier: "Vision" },
];

const tools = [
  { id: "browser", name: "Web Browse", icon: Globe, active: true },
  { id: "code", name: "Code Exec", icon: Code2, active: true },
  { id: "agents", name: "Agents", icon: Bot, active: false },
  { id: "local", name: "Local", icon: HardDrive, active: false },
];

const slashCommands = [
  { cmd: "/code", desc: "Generate code snippet", icon: Code2 },
  { cmd: "/explain", desc: "Explain a concept", icon: Sparkles },
  { cmd: "/summarize", desc: "Summarize text", icon: Zap },
  { cmd: "/image", desc: "Generate an image", icon: Image },
  { cmd: "/agent", desc: "Launch an agent task", icon: Bot },
];

export function InputComposer({
  onSend,
  isStreaming,
  selectedModel,
  onModelChange,
}: InputComposerProps) {
  const [message, setMessage] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [toolStates, setToolStates] = useState(
    tools.reduce((acc, t) => ({ ...acc, [t.id]: t.active }), {} as Record<string, boolean>)
  );
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [message]);

  useEffect(() => {
    if (message === "/") {
      setShowSlashMenu(true);
    } else if (!message.startsWith("/") || message.includes(" ")) {
      setShowSlashMenu(false);
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isStreaming) {
      onSend(message.trim());
      setMessage("");
      setAttachedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTool = (id: string) => {
    setToolStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSlashSelect = (cmd: string) => {
    setMessage(cmd + " ");
    setShowSlashMenu(false);
    textareaRef.current?.focus();
  };

  const handleAttach = () => {
    setAttachedFiles((prev) => [...prev, `document_${prev.length + 1}.pdf`]);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Slash Commands Menu */}
      <AnimatePresence>
        {showSlashMenu && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-[#0e0e1a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <span className="text-xs text-white/30">Commands</span>
            </div>
            {slashCommands.map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={() => handleSlashSelect(cmd.cmd)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
              >
                <cmd.icon className="w-4 h-4 text-violet-400" />
                <div className="text-left">
                  <div className="text-sm text-white/80">{cmd.cmd}</div>
                  <div className="text-xs text-white/30">{cmd.desc}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model Picker Popup */}
      <AnimatePresence>
        {showModelPicker && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 bg-[#0e0e1a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 w-64"
          >
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <span className="text-xs text-white/30">Select Model</span>
            </div>
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setShowModelPicker(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] transition-colors ${
                  selectedModel === model.id ? "bg-violet-500/10" : ""
                }`}
              >
                <span className="text-base">{model.icon}</span>
                <span className="text-sm text-white/80">{model.name}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                  {model.tier}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] focus-within:border-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all backdrop-blur-xl">
        {/* Attached Files */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 px-4 pt-3">
                {attachedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                  >
                    <Paperclip className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/50">{file}</span>
                    <button
                      onClick={() => setAttachedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="p-0.5 rounded hover:bg-white/[0.08] transition-colors"
                    >
                      <X className="w-3 h-3 text-white/30" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="flex items-end gap-2 px-4 py-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (/ for commands)"
            rows={1}
            className="flex-1 bg-transparent text-white/90 placeholder:text-white/20 resize-none text-sm focus:outline-none min-h-[24px] max-h-[200px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() || isStreaming}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              message.trim() && !isStreaming
                ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/20 text-white"
                : "bg-white/[0.04] text-white/20 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1">
            {/* Model Selector */}
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xs">{currentModel.icon}</span>
              <span className="text-xs text-white/50">{currentModel.name}</span>
              <ChevronDown className="w-3 h-3 text-white/25" />
            </button>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            {/* Action Buttons */}
            <button
              onClick={handleAttach}
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMessage("/");
                textareaRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              title="Commands"
            >
              <Slash className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            {/* Tool Toggles */}
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`p-1.5 rounded-lg transition-all ${
                  toolStates[tool.id]
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-white/20 hover:text-white/40 hover:bg-white/[0.04]"
                }`}
                title={tool.name}
              >
                <tool.icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/15">
              {message.length > 0 ? `${message.length} chars` : ""}
            </span>
            <span className="text-[10px] text-white/10 hidden sm:inline">⇧↵ new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}