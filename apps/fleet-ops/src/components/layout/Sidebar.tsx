import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  Wrench, 
  Settings, 
  History, 
  Sparkles, 
  MessageSquare, 
  GitBranch,
  ChevronRight,
  Plus,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: 'dashboard' | 'map';
  onViewChange: (view: 'dashboard' | 'map') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-white/10 bg-[#0d1117] text-gray-300">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Settings className="h-5 w-5 text-blue-400" />
          <span>FleetOps MCP</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2 mb-6">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Platform
          </div>
          <nav className="space-y-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeView === 'dashboard'} 
              onClick={() => onViewChange('dashboard')}
            />
            <NavItem 
              icon={Map} 
              label="Live Map" 
              active={activeView === 'map'} 
              onClick={() => onViewChange('map')}
            />
            <NavItem icon={Car} label="Fleet Vehicles" />
            <NavItem icon={FileText} label="Reports" />
            <NavItem icon={Wrench} label="Maintenance" />
            <NavItem icon={Settings} label="Settings" />
          </nav>
        </div>

        {/* GitHub-style Agent Sessions */}
        <div className="px-2">
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span>Agent Sessions</span>
            <button className="hover:text-white"><Plus className="h-3 w-3" /></button>
          </div>
          <nav className="space-y-1">
            <SessionItem 
              icon={Sparkles} 
              label="Resolving runtime crashes" 
              sub="kostasuser01gr/InternalToolKit" 
              status="success"
            />
            <SessionItem 
              icon={GitBranch} 
              label="Enhancing Washer Kiosk" 
              sub="kostasuser01gr/InternalToolKit" 
              status="success"
            />
            <SessionItem 
              icon={MessageSquare} 
              label="Fixing failing job /login" 
              sub="kostasuser01gr/InternalToolKit" 
              status="failed"
            />
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            KO
          </div>
          <div className="text-sm">
            <div className="font-medium text-white">kostasuser01gr</div>
            <div className="text-xs text-gray-500">Copilot Pro+</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
        active 
          ? "bg-[#1f6feb]/10 text-[#58a6ff]" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SessionItem({ icon: Icon, label, sub, status }: { icon: any, label: string, sub: string, status: 'success' | 'failed' }) {
  return (
    <button className="group flex w-full flex-col gap-1 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white/5">
      <div className="flex items-center gap-2 text-gray-300 group-hover:text-white">
        <Icon className={cn("h-3.5 w-3.5", status === 'success' ? "text-purple-400" : "text-red-400")} />
        <span className="truncate font-medium">{label}</span>
      </div>
      <div className="pl-5 text-xs text-gray-500 truncate">{sub}</div>
    </button>
  );
}
