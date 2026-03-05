import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Terminal, ChevronDown, Paperclip, Droplets, Wrench, FileText } from "lucide-react";
import { initialChatHistory, type ChatMessage, type Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AIChat({ selectedVehicle }: { selectedVehicle: Vehicle }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatHistory);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: "Just now",
    };

    setMessages([...messages, newMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've processed your request regarding ${selectedVehicle.make} ${selectedVehicle.model}. The operation has been logged successfully.`,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#161b22] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-400" />
          <span className="font-semibold text-white">FleetOps Copilot</span>
          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">Beta</span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <Terminal className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10",
              msg.role === "assistant" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
            )}>
              {msg.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn(
              "max-w-[85%] rounded-lg px-4 py-2 text-sm leading-relaxed",
              msg.role === "assistant" 
                ? "bg-[#161b22] text-gray-300 border border-white/5" 
                : "bg-[#1f6feb] text-white"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#161b22] p-4">
        <div className="relative rounded-lg border border-white/10 bg-[#0d1117] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about the fleet..."
            className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none min-h-[80px]"
          />
          <div className="flex items-center justify-between border-t border-white/5 px-2 py-2">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white">
                <Paperclip className="h-3.5 w-3.5" />
                Attach
              </button>
              <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white">
                <Terminal className="h-3.5 w-3.5" />
                Console
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">GPT-5.2</span>
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded bg-[#1f6feb] p-1.5 text-white hover:bg-[#1f6feb]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Commands */}
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Actions</div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setInput(`Log a wash for ${selectedVehicle.make} ${selectedVehicle.model}`)}
              className="flex items-center gap-2 rounded border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs text-gray-400 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
            >
              <Droplets className="h-3 w-3" />
              Log Wash
            </button>
            <button 
              onClick={() => setInput(`Set status of ${selectedVehicle.license} to Maintenance`)}
              className="flex items-center gap-2 rounded border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
            >
              <Wrench className="h-3 w-3" />
              Maintenance
            </button>
            <button 
              onClick={() => setInput(`Generate daily report for ${selectedVehicle.location}`)}
              className="flex items-center gap-2 rounded border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs text-gray-400 hover:border-green-500/50 hover:text-green-400 transition-colors"
            >
              <FileText className="h-3 w-3" />
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
