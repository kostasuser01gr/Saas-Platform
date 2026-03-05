import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Sparkles, 
  Flag, 
  Settings, 
  Bell, 
  Mail, 
  Plus, 
  ChevronDown,
  Moon,
  Heart,
  Globe
} from 'lucide-react';
import { GlassCard, GlassButton } from './components/GlassUI';
import { HeartRateWidget, VitalsWidget, EnergyWidget, ActivityStats } from './components/Widgets';

export default function App() {
  const [activeTab, setActiveTab] = useState('Statistic');

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden font-sans text-white select-none">
      
      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
          alt="Mountains Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Overlays for better contrast and mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
        {/* Floating particles/blur effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* 2. Main UI Layout */}
      <div className="relative z-10 w-full h-full flex p-6 gap-6">
        
        {/* Left Sidebar Navigation */}
        <div className="w-16 flex flex-col items-center justify-between py-4">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-8 cursor-pointer hover:bg-white/20 transition-all">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            </div>

            {/* Menu Icons */}
            <div className="flex flex-col gap-6">
                 <GlassCard className="p-2 !rounded-full flex flex-col gap-4 bg-white/5 border-white/10">
                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <Moon size={20} />
                    </button>
                    <button className="p-3 text-white bg-white/10 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all">
                        <Heart size={20} />
                    </button>
                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <Globe size={20} />
                    </button>
                 </GlassCard>
            </div>

            {/* Bottom Space (Empty filler) */}
            <div className="flex-1"></div>
        </div>

        {/* Center Main Area */}
        <div className="flex-1 flex flex-col max-w-[calc(100%-4rem)]">
          
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex-1"></div> {/* Spacer */}
            
            {/* Central Navigation Pills */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-1 rounded-full flex gap-1">
                {['Statistic', 'Devices', 'Insights'].map((tab) => (
                  <GlassButton 
                    key={tab} 
                    active={activeTab === tab} 
                    onClick={() => setActiveTab(tab)}
                    className="text-sm px-6 py-2"
                  >
                    {tab}
                  </GlassButton>
                ))}
            </div>

            <div className="flex-1 flex justify-end gap-4">
                 <GlassButton className="!p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                    <Bell size={18} />
                 </GlassButton>
                 <GlassButton className="!p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                    <Mail size={18} />
                 </GlassButton>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="flex-1 grid grid-cols-12 gap-6 pb-24">
            
            {/* Left Column: Stats */}
            <div className="col-span-3 flex flex-col gap-6">
                <div className="h-48">
                    <HeartRateWidget />
                </div>
                <div className="h-48">
                    <VitalsWidget />
                </div>
                <div className="flex-1 min-h-[140px]">
                    <EnergyWidget />
                </div>
            </div>

            {/* Middle Column: Ring Visualization */}
            <div className="col-span-6 relative flex flex-col items-center justify-center perspective-1000">
                {/* 3D Ring representation */}
                <div className="relative w-80 h-80 transition-transform duration-700 hover:scale-105 cursor-grab active:cursor-grabbing">
                    {/* Glow behind ring */}
                    <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full animate-pulse"></div>
                    
                    {/* Ring Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1622434641406-a15810545064?q=80&w=2000&auto=format&fit=crop" 
                        alt="Smart Ring" 
                        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] grayscale-[20%] contrast-125 mask-image"
                        style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} 
                    />

                    {/* Interactive Hotspots */}
                    <div className="absolute top-[30%] right-[15%] group">
                        <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute opacity-75"></div>
                        <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white relative cursor-pointer shadow-[0_0_15px_#FFA500]"></div>
                        {/* Tooltip */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-medium">
                            Ring DKWAY Q9
                        </div>
                    </div>

                     <div className="absolute bottom-[25%] left-[20%] group delay-100">
                        <div className="w-3 h-3 bg-white/50 rounded-full animate-ping absolute opacity-50"></div>
                        <div className="w-3 h-3 bg-white rounded-full border-2 border-white/50 relative cursor-pointer hover:bg-orange-500 transition-colors"></div>
                    </div>
                </div>

                {/* Add Device Button Floating */}
                <button className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                    <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                        <Plus size={16} />
                    </div>
                    <span className="text-sm font-medium text-white/80">Add device</span>
                </button>
            </div>

            {/* Right Column: Activity */}
            <div className="col-span-3">
                <ActivityStats />
            </div>

          </div>
        </div>
      </div>

      {/* 3. Bottom Floating Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <GlassCard className="px-2 py-2 flex items-center gap-2 !rounded-full bg-black/40 border-white/10 shadow-2xl">
            {[
                { icon: Sparkles, label: 'Discover' },
                { icon: Calendar, label: 'Schedule' },
                { icon: LayoutGrid, label: 'Dashboard', active: true },
                { icon: Flag, label: 'Goals' },
                { icon: Settings, label: 'Settings' },
            ].map((item, index) => (
                <button 
                    key={index}
                    className={`
                        p-3 rounded-full transition-all duration-300 relative group
                        ${item.active 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }
                    `}
                >
                    <item.icon size={20} />
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.label}
                    </span>
                </button>
            ))}
        </GlassCard>
      </div>

      {/* 4. Bottom Corners */}
      
      {/* User Profile (Bottom Left) */}
      <div className="absolute bottom-6 left-20 z-40">
        <GlassCard className="pl-2 pr-4 py-2 !rounded-full flex items-center gap-3 bg-black/20 hover:bg-black/40 transition-colors cursor-pointer">
            <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white/10"
            />
            <div className="flex flex-col">
                <span className="text-sm font-semibold">Olivia Brooks</span>
                <span className="text-[10px] text-white/50">Pro Member</span>
            </div>
            <ChevronDown size={14} className="text-white/40 ml-2" />
        </GlassCard>
      </div>

      {/* Challenge Widget (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-40 w-64">
         <GlassCard className="p-4 !bg-gradient-to-r from-black/40 to-transparent">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-sm font-medium text-white/90">Challenge with friends</h4>
                    <p className="text-[10px] text-white/50">Invite your friend to challenge.</p>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <Plus size={16} />
                </button>
            </div>
            <div className="flex -space-x-2 mt-2">
                {[
                    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
                ].map((src, i) => (
                    <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-black/50" alt="Friend" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-black/50 bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    +3
                </div>
            </div>
         </GlassCard>
      </div>

    </div>
  );
}
