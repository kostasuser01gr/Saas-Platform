import { useRef, useEffect } from "react";
import { Sparkles, Zap, Code2, Globe, Bot } from "lucide-react";
import { motion } from "motion/react";
import { MessageBubble, StreamingIndicator, type Message } from "./MessageBubble";

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  onCopy: (content: string) => void;
  onRegenerate: () => void;
}

const quickActions = [
  { label: "Write code", icon: Code2, prompt: "Help me write a function that..." },
  { label: "Explain concept", icon: Sparkles, prompt: "Explain the concept of..." },
  { label: "Web research", icon: Globe, prompt: "Search the web for..." },
  { label: "Run agent", icon: Bot, prompt: "Create an agent to..." },
];

export function ChatArea({ messages, isStreaming, onCopy, onRegenerate }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-lg"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/25"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-white/90 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                How can I help you today?
              </h1>
              <p className="text-sm text-white/30 mb-8">
                Ask me anything — code, research, analysis, creative writing, or complex reasoning.
              </p>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all text-left group"
                  >
                    <action.icon className="w-4 h-4 text-violet-400/70 mt-0.5 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                    <div>
                      <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        {action.label}
                      </div>
                      <div className="text-xs text-white/20 mt-0.5">{action.prompt}</div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Status Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/20">All systems operational</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400/50" />
                  <span className="text-[10px] text-white/20">128K context</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-4xl mx-auto py-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={onCopy}
                onRegenerate={message.role === "assistant" ? onRegenerate : undefined}
                onEdit={message.role === "user" ? () => {} : undefined}
              />
            ))}
            {isStreaming && <StreamingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}