import { useState } from "react";
import {
  Sparkles,
  Code2,
  Globe,
  Bot,
  Image,
  Cloud,
  HardDrive,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion } from "motion/react";

interface AgentTabsProps {
  activeAgent: string;
  onAgentChange: (agent: string) => void;
}

const agents = [
  {
    id: "general",
    name: "General",
    icon: Sparkles,
    description: "Multi-purpose assistant",
    capabilities: ["reasoning", "writing", "analysis"],
    compute: "cloud" as const,
    status: "active" as const,
  },
  {
    id: "coder",
    name: "Coder",
    icon: Code2,
    description: "Code generation & debug",
    capabilities: ["coding", "refactoring", "testing"],
    compute: "cloud" as const,
    status: "active" as const,
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: Globe,
    description: "Web search & analysis",
    capabilities: ["browsing", "summarization", "citation"],
    compute: "cloud" as const,
    status: "active" as const,
  },
  {
    id: "agent",
    name: "Agent",
    icon: Bot,
    description: "Autonomous task execution",
    capabilities: ["planning", "tool-use", "memory"],
    compute: "cloud" as const,
    status: "ready" as const,
  },
  {
    id: "vision",
    name: "Vision",
    icon: Image,
    description: "Image understanding",
    capabilities: ["ocr", "analysis", "generation"],
    compute: "cloud" as const,
    status: "ready" as const,
  },
];

export function AgentTabs({ activeAgent, onAgentChange }: AgentTabsProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Agent Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
        {agents.map((agent) => {
          const isActive = activeAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => onAgentChange(agent.id)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${
                isActive
                  ? "bg-violet-500/15 border border-violet-500/25 text-violet-300"
                  : "hover:bg-white/[0.04] border border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <agent.icon className="w-3.5 h-3.5" />
              <span className="text-xs">{agent.name}</span>
              {agent.status === "active" && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeAgentIndicator"
                  className="absolute inset-0 rounded-xl border border-violet-500/25 bg-violet-500/10"
                  style={{ zIndex: -1 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Agent Details */}
      {hoveredAgent && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-4 mb-2"
        >
          {agents
            .filter((a) => a.id === hoveredAgent)
            .map((agent) => (
              <div
                key={agent.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <agent.icon className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-white/80">{agent.name}</span>
                  <span className="text-[10px] text-white/25">{agent.description}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {agent.compute === "cloud" ? (
                      <Cloud className="w-3 h-3 text-blue-400" />
                    ) : (
                      <HardDrive className="w-3 h-3 text-amber-400" />
                    )}
                    <span className="text-[10px] text-white/30">
                      {agent.compute === "cloud" ? "Cloud" : "Local"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {agent.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Circle className="w-3 h-3 text-white/20" />
                    )}
                    <span className="text-[10px] text-white/30">
                      {agent.status === "active" ? "Active" : "Ready"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {agent.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] text-white/25"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}