import { useState, useEffect, useCallback } from "react";
import {
  PanelLeftClose,
  PanelRightClose,
  Command,
} from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { InputComposer } from "./components/InputComposer";
import { RightPanel } from "./components/RightPanel";
import { CommandPalette } from "./components/CommandPalette";
import { AgentTabs } from "./components/AgentTabs";
import type { Message } from "./components/MessageBubble";

// Demo conversation data
const demoMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you help me build a scalable API architecture using TypeScript and Express? I need it to handle 10K concurrent requests.",
    timestamp: "10:32 AM",
  },
  {
    id: "2",
    role: "assistant",
    content: `Absolutely! Here's a production-ready architecture for a high-concurrency Express API:

**Architecture Overview:**
- Cluster mode with PM2 for multi-core utilization
- Redis-backed session store and rate limiting
- Connection pooling for database queries
- Request queue with Bull for heavy operations

Here's the core server setup:

\`\`\`typescript
import express from 'express';
import cluster from 'cluster';
import { cpus } from 'os';
import { createClient } from 'redis';
import { rateLimit } from 'express-rate-limit';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} is running\`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork(); // Auto-restart
  });
} else {
  const app = express();
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
  });
  
  app.use(limiter);
  app.use(express.json({ limit: '10mb' }));
  
  app.listen(3000, () => {
    console.log(\`Worker \${process.pid} started\`);
  });
}
\`\`\`

**Key optimizations for 10K concurrent requests:**

- **Connection pooling**: Use \`pg-pool\` with a pool size matching your CPU cores × 2
- **Caching layer**: Redis with a 60-second TTL for frequently accessed endpoints
- **Compression**: Enable gzip with \`compression\` middleware
- **Graceful shutdown**: Handle SIGTERM for zero-downtime deployments

Want me to elaborate on any of these patterns or add database connection pooling?`,
    timestamp: "10:32 AM",
    model: "Nexus-4",
  },
  {
    id: "3",
    role: "user",
    content: "Yes, please add the database connection pooling with PostgreSQL and show me how to implement the Redis caching layer.",
    timestamp: "10:35 AM",
  },
  {
    id: "4",
    role: "assistant",
    content: `Here's the complete implementation with PostgreSQL connection pooling and Redis caching:

\`\`\`typescript
import { Pool } from 'pg';
import Redis from 'ioredis';

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis Client
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Cached query helper
async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const result = await queryFn();
  await redis.setex(key, ttl, JSON.stringify(result));
  return result;
}

// Usage example
app.get('/api/users/:id', async (req, res) => {
  const user = await cachedQuery(
    \`user:\${req.params.id}\`,
    async () => {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [req.params.id]
      );
      return rows[0];
    },
    120 // 2-minute cache
  );
  
  res.json(user);
});
\`\`\`

**Performance metrics you can expect:**
- Pool connections: ~20 concurrent DB connections
- Cache hit ratio: ~85% for read-heavy workloads
- Response time: <50ms for cached, <200ms for uncached
- Throughput: 8K-12K req/s on a 4-core instance

The \`cachedQuery\` helper is composable — you can use it with any async data source, not just PostgreSQL.`,
    timestamp: "10:36 AM",
    model: "Nexus-4",
  },
];

const initialChats = [
  { id: "1", title: "Scalable API Architecture", date: "Today", pinned: true, model: "nexus-4" },
  { id: "2", title: "React Component Patterns", date: "Today", pinned: true, model: "nexus-4" },
  { id: "3", title: "ML Pipeline Optimization", date: "Today", model: "codex-pro" },
  { id: "4", title: "Database Schema Design", date: "Yesterday", model: "nexus-4" },
  { id: "5", title: "CI/CD Pipeline Setup", date: "Yesterday", model: "nexus-4-mini" },
  { id: "6", title: "WebSocket Implementation", date: "2 days ago", model: "codex-pro" },
  { id: "7", title: "Auth System with JWT", date: "3 days ago", model: "nexus-4" },
  { id: "8", title: "Docker Containerization", date: "Last week", model: "nexus-3.5" },
  { id: "9", title: "GraphQL vs REST Analysis", date: "Last week", model: "nexus-4" },
  { id: "10", title: "Terraform Infrastructure", date: "Last week", model: "nexus-3.5" },
];

// Simulated AI responses for demo
const aiResponses = [
  `That's a great question! Let me break it down for you:

**Key Considerations:**
- Performance optimization should always start with profiling
- Don't optimize prematurely — measure first
- Focus on the critical path

Here's a practical approach:

1. **Identify bottlenecks** using profiling tools
2. **Optimize hot paths** with caching and memoization
3. **Scale horizontally** when vertical scaling hits limits

Would you like me to dive deeper into any of these areas?`,
  `Here's a clean implementation:

\`\`\`typescript
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

class APIClient {
  private config: Config;
  
  constructor(config: Config) {
    this.config = config;
  }
  
  async fetch<T>(endpoint: string): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < this.config.retries; i++) {
      try {
        const response = await fetch(
          \`\${this.config.apiUrl}\${endpoint}\`,
          { signal: AbortSignal.timeout(this.config.timeout) }
        );
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
    
    throw lastError!;
  }
}
\`\`\`

This gives you automatic retries with exponential backoff and timeout handling.`,
  `Great observation! Here are the key differences:

- **Approach A** is better for read-heavy workloads
- **Approach B** excels in write-heavy scenarios
- Both can be combined for optimal performance

The choice depends on your specific use case and traffic patterns. Let me know if you want benchmarks!`,
];

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("1");
  const [selectedModel, setSelectedModel] = useState("nexus-4");
  const [activeAgent, setActiveAgent] = useState("general");
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatList, setChatList] = useState(initialChats);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setRightPanelOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNewChat = useCallback(() => {
    const newId = String(chatList.length + 1);
    setChatList((prev) => [
      { id: newId, title: "New Conversation", date: "Just now", model: selectedModel },
      ...prev,
    ]);
    setActiveChat(newId);
    setMessages([]);
  }, [chatList.length, selectedModel]);

  const handleSend = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      // Simulate AI response with streaming delay
      const responseIndex = Math.floor(Math.random() * aiResponses.length);
      const fullResponse = aiResponses[responseIndex];

      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: fullResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: "Nexus-4",
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsStreaming(false);
      }, 1500 + Math.random() * 1000);
    },
    []
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const handleRegenerate = useCallback(() => {
    setIsStreaming(true);
    const responseIndex = Math.floor(Math.random() * aiResponses.length);
    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastAssistantIdx = newMessages.findLastIndex((m) => m.role === "assistant");
        if (lastAssistantIdx !== -1) {
          newMessages[lastAssistantIdx] = {
            ...newMessages[lastAssistantIdx],
            content: aiResponses[responseIndex],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
        return newMessages;
      });
      setIsStreaming(false);
    }, 1500);
  }, []);

  return (
    <div
      className="size-full flex bg-[#08080f] overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Left Sidebar */}
      <div className="relative z-10 flex-shrink-0">
        <Sidebar
          chats={chatList}
          activeChat={activeChat}
          onSelectChat={(id) => {
            setActiveChat(id);
            if (id === "1") {
              setMessages(demoMessages);
            } else {
              setMessages([]);
            }
          }}
          onNewChat={handleNewChat}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-[#08080f]/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4 text-white/30" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <h3 className="text-white/80 truncate max-w-xs">
                {chatList.find((c) => c.id === activeChat)?.title || "New Chat"}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/10">
                Nexus-4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              <Command className="w-3.5 h-3.5 text-white/30" />
              <span className="text-xs text-white/25">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/20">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                rightPanelOpen
                  ? "bg-violet-500/15 text-violet-400"
                  : "hover:bg-white/[0.06] text-white/30"
              }`}
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agent Tabs */}
        <div className="border-b border-white/[0.04]">
          <AgentTabs activeAgent={activeAgent} onAgentChange={setActiveAgent} />
        </div>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
        />

        {/* Input Composer */}
        <div className="px-4 pb-4 pt-2">
          <InputComposer
            onSend={handleSend}
            isStreaming={isStreaming}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-[10px] text-white/10">
              NexusAI may produce inaccurate information. Verify important facts.
            </span>
          </div>
        </div>
      </div>

      {/* Right Context Panel */}
      <div className="relative z-10 flex-shrink-0">
        <RightPanel isOpen={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNewChat={handleNewChat}
      />
    </div>
  );
}