import { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  isStreaming?: boolean;
  codeBlocks?: { language: string; code: string }[];
}

interface MessageBubbleProps {
  message: Message;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
}

export function MessageBubble({
  message,
  onCopy,
  onRegenerate,
  onEdit,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeCopy = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(blockId);
    setTimeout(() => setCodeCopied(null), 2000);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const language = lines[0] || "text";
        const code = lines.slice(1).join("\n");
        const blockId = `${message.id}-${index}`;

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a14]">
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06]">
              <span className="text-xs text-white/40">{language}</span>
              <button
                onClick={() => handleCodeCopy(code, blockId)}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {codeCopied === blockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-emerald-300/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {code}
              </code>
            </pre>
          </div>
        );
      }

      // Render inline formatting
      return (
        <span key={index}>
          {part.split("\n").map((line, lineIdx) => (
            <span key={lineIdx}>
              {lineIdx > 0 && <br />}
              {renderInline(line)}
            </span>
          ))}
        </span>
      );
    });
  };

  const renderInline = (text: string) => {
    // Handle bold
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="text-white/95" style={{ fontWeight: 600 }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      // Handle inline code
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, j) => {
        if (cp.startsWith("`") && cp.endsWith("`")) {
          return (
            <code
              key={`${i}-${j}`}
              className="px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-300 text-sm"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {cp.slice(1, -1)}
            </code>
          );
        }
        // Handle bullet points
        if (cp.startsWith("• ") || cp.startsWith("- ")) {
          return (
            <span key={`${i}-${j}`} className="flex items-start gap-2 mt-1">
              <span className="text-violet-400 mt-0.5">•</span>
              <span>{cp.slice(2)}</span>
            </span>
          );
        }
        return <span key={`${i}-${j}`}>{cp}</span>;
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex gap-3 px-4 py-4 ${
        isAssistant ? "" : "flex-row-reverse"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-xs text-white">A</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isAssistant ? "max-w-[85%]" : "max-w-[75%]"}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1.5 ${isAssistant ? "" : "flex-row-reverse"}`}>
          <span className="text-sm text-white/70">
            {isAssistant ? message.model || "Nexus-4" : "You"}
          </span>
          <span className="text-[10px] text-white/20">{message.timestamp}</span>
        </div>

        {/* Message Content */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAssistant
              ? "bg-white/[0.03] border border-white/[0.06]"
              : "bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/15"
          }`}
        >
          <div className="text-sm text-white/80 leading-relaxed">
            {message.isStreaming ? (
              <div className="flex items-center gap-1">
                <span>{message.content}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-violet-400 rounded-sm"
                />
              </div>
            ) : (
              renderContent(message.content)
            )}
          </div>
        </div>

        {/* Actions */}
        {hovered && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-1 mt-1.5 ${isAssistant ? "" : "justify-end"}`}
          >
            <ActionButton
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
              tooltip="Copy"
            />
            {isAssistant && onRegenerate && (
              <ActionButton
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={onRegenerate}
                tooltip="Regenerate"
              />
            )}
            {!isAssistant && onEdit && (
              <ActionButton
                icon={<Pencil className="w-3.5 h-3.5" />}
                onClick={onEdit}
                tooltip="Edit"
              />
            )}
            {isAssistant && (
              <>
                <ActionButton
                  icon={<ThumbsUp className="w-3.5 h-3.5" />}
                  onClick={() => {}}
                  tooltip="Good"
                />
                <ActionButton
                  icon={<ThumbsDown className="w-3.5 h-3.5" />}
                  onClick={() => {}}
                  tooltip="Bad"
                />
              </>
            )}
            <ActionButton
              icon={<Bookmark className="w-3.5 h-3.5" />}
              onClick={() => {}}
              tooltip="Save"
            />
            <ActionButton
              icon={<MoreHorizontal className="w-3.5 h-3.5" />}
              onClick={() => {}}
              tooltip="More"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon,
  onClick,
  tooltip,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
    >
      {icon}
    </button>
  );
}

export function StreamingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 px-4 py-4"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-violet-400"
            />
          ))}
        </div>
        <span className="text-sm text-white/30 ml-1">Thinking...</span>
      </div>
    </motion.div>
  );
}
