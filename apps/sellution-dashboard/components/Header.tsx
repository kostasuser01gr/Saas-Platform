import React from 'react';
import { Icons } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-transparent relative z-10">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-4 h-4 bg-white transform -rotate-45" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          Sellution
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#" className="bg-white text-black px-4 py-2 rounded-full shadow-lg shadow-purple-900/20">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Customers</a>
          <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">Products <Icons.ArrowDown className="w-3 h-3" /></a>
          <a href="#" className="hover:text-white transition-colors">Analytics</a>
          <div className="relative">
            <a href="#" className="hover:text-white transition-colors">Reports</a>
            <span className="absolute -top-2 -right-3 bg-emerald-500 text-[10px] text-black font-bold px-1.5 py-0.5 rounded-full">12</span>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 bg-[#1a1625] rounded-full px-4 py-2 border border-white/5">
          <Icons.Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold">3</div>
        </div>
        
        <div className="flex items-center gap-3">
            <img src="https://picsum.photos/100/100" alt="User" className="w-10 h-10 rounded-full border-2 border-purple-500/30" />
            <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-white">Tom Dawson</p>
                <p className="text-xs text-gray-500">@tom_dawson</p>
            </div>
            <Icons.ArrowDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
};