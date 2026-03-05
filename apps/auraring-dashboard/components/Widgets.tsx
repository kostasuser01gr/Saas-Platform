import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { GlassCard, ProgressBar } from './GlassUI';
import { Activity, Droplets, Zap, Moon, Flame, Brain, Share2, Plus } from 'lucide-react';

const data = [
  { time: '10:00', value: 65 },
  { time: '10:05', value: 68 },
  { time: '10:10', value: 75 },
  { time: '10:15', value: 72 },
  { time: '10:20', value: 85 },
  { time: '10:25', value: 78 },
  { time: '10:30', value: 71 },
  { time: '10:35', value: 74 },
  { time: '10:40', value: 68 },
];

export const HeartRateWidget: React.FC = () => {
  return (
    <GlassCard className="p-4 flex flex-col h-full min-h-[160px]">
      <div className="flex items-center gap-2 mb-2 text-white/80">
        <div className="p-1.5 bg-white/10 rounded-full">
            <Activity size={16} />
        </div>
        <span className="text-sm font-medium">Heart Rate</span>
      </div>
      <div className="flex-1 w-full h-full min-h-[80px] -ml-4">
        <ResponsiveContainer width="115%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF9F43" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#FF9F43' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#FF9F43" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-white">71 <span className="text-xs font-normal text-white/50">BPM</span></div>
        <div className="text-xs text-white/40">+ 3 minutes ago</div>
      </div>
    </GlassCard>
  );
};

export const VitalsWidget: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <GlassCard className="p-4 flex flex-col items-center justify-center relative">
        <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Circle for Saturation */}
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="36" stroke="#FF9F43" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset="40" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
                <div className="text-lg font-bold text-white">98%</div>
            </div>
        </div>
        <div className="mt-2 text-xs text-white/60">Saturation</div>
        <div className="absolute top-3 left-3 w-2 h-2 bg-white/20 rounded-full"></div>
      </GlassCard>

      <GlassCard className="p-4 flex flex-col items-center justify-center relative">
         <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Circle for Hydration */}
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="36" stroke="#FECca7" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset="63" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
                <div className="text-lg font-bold text-white">72%</div>
            </div>
        </div>
        <div className="mt-2 text-xs text-white/60">Hydration</div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
      </GlassCard>
    </div>
  );
};

export const EnergyWidget: React.FC = () => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white/80">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-sm font-medium">Energy Level</span>
            </div>
            <span className="text-xs text-white/40">Today</span>
        </div>
        
        <div className="space-y-4">
            <div className="flex justify-between items-end text-white">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">72%</span>
                <span className="text-xs text-white/40 mb-1">Optimal</span>
            </div>
             <div className="relative h-12 w-full bg-white/5 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-yellow-400/80 w-[72%] rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.5)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-[10px] text-white/80 font-bold">RECHARGING</div>
             </div>
        </div>
    </GlassCard>
  );
};

export const ActivityStats: React.FC = () => {
  return (
    <GlassCard className="h-full p-6 flex flex-col items-center justify-between relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="relative mb-6">
            {/* Avatar Ring Container */}
            <div className="w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                {/* Glowing ring animation */}
                <div className="absolute inset-0 rounded-full border-t-4 border-orange-400 animate-[spin_3s_linear_infinite] opacity-80"></div>
                 <div className="absolute inset-2 rounded-full border-r-4 border-purple-400/50 animate-[spin_4s_linear_infinite_reverse] opacity-60"></div>
                
                <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" 
                    alt="Activity User" 
                    className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-white/10"
                />
                
                {/* Floating bubbles */}
                <div className="absolute top-0 right-4 w-4 h-4 bg-orange-400 rounded-full shadow-[0_0_10px_#FFA500] animate-bounce" style={{ animationDuration: '2s' }}></div>
            </div>
        </div>

        <div className="text-center space-y-1">
            <h3 className="text-white/60 text-sm uppercase tracking-wider">Activity Stats</h3>
            <div className="text-5xl font-bold text-white tracking-tight">7,320<span className="text-lg font-normal text-white/40 ml-1">steps</span></div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mt-8">
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 mb-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                </div>
                <span className="text-white font-semibold">6.0</span>
                <span className="text-[10px] text-white/40 uppercase">km</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 mb-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <span className="text-white font-semibold">2.4h</span>
                <span className="text-[10px] text-white/40 uppercase">time</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 mb-1">
                    <Flame size={20} />
                </div>
                <span className="text-white font-semibold">860</span>
                <span className="text-[10px] text-white/40 uppercase">kcal</span>
            </div>
        </div>
      </div>

      {/* Bottom Toggles */}
      <div className="mt-8 flex gap-4">
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10 shadow-lg backdrop-blur-md">
            <Moon size={20} />
        </button>
        <button className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(255,165,0,0.5)] transform scale-110">
            <Flame size={20} />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10 shadow-lg backdrop-blur-md">
            <Brain size={20} />
        </button>
      </div>
    </GlassCard>
  );
};
