import React from 'react';
import { Header } from './components/Header';
import { TotalSalesChart } from './components/TotalSalesChart';
import { SalesTrends } from './components/SalesTrends';
import { RecentActivity } from './components/RecentActivity';
import { AiAssistant } from './components/AiAssistant';
import { ResultsChart } from './components/ResultsChart';
import { Icons } from './components/Icons';

function App() {
  return (
    <div className="min-h-screen bg-[#0f0b1a] text-white overflow-x-hidden relative selection:bg-purple-500 selection:text-white pb-10">
      
      {/* Background Ambience - Purple glow top right */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Header />

      <main className="px-4 md:px-8 py-4 max-w-[1600px] mx-auto space-y-6">
        
        {/* Dashboard Title Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                
                <div className="relative flex-1 md:flex-none">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-[#1a1625] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 w-full md:w-64 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                <button className="hidden md:flex items-center gap-2 bg-[#1a1625] border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 hover:bg-[#252033] transition-colors">
                    <div className="bg-white/10 p-0.5 rounded">
                        <Icons.Plus className="w-3 h-3" />
                    </div>
                    Space
                </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2">
                     <button className="w-10 h-10 rounded-full bg-[#1a1625] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Icons.Settings className="w-5 h-5" />
                     </button>
                </div>
                <button className="bg-[#1a1625] hover:bg-[#252033] text-white border border-white/10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                    <Icons.Download className="w-4 h-4" />
                    Download report
                </button>
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
            
            {/* Top Row: Total Sales (7 cols) + Sales Trends (5 cols) */}
            <TotalSalesChart />
            <SalesTrends />

            {/* Bottom Row: Recent Activity (5 cols) + AI Assistant (3 cols) + Results (4 cols) */}
            <RecentActivity />
            <AiAssistant />
            <ResultsChart />

        </div>
      </main>
    </div>
  );
}

export default App;