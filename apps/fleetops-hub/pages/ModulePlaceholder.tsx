import React from 'react';
import { Bot, Mic, Scan, Construction, AlertCircle } from 'lucide-react';

export default function ModulePlaceholder({ name }: { name: string }) {
  // Specific UI for AI/Chat
  if (name.includes('AI') || name.includes('Chat')) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2 text-slate-700">
            <Bot className="text-blue-600" /> {name}
          </h2>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">RAG Enabled</span>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-slate-100 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]">
              <p className="text-sm text-slate-700">Hello! I am FleetCopilot. I can answer questions about your fleet data, service history, and documents.</p>
              <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1">
                <AlertCircle size={10} /> 
                Responses are generated based on corporate data only.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about vehicle maintenance..." 
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Send</button>
          </div>
        </div>
      </div>
    );
  }

  // Scanning UI
  if (name.includes('Scan')) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <div className="bg-slate-900 rounded-2xl aspect-[3/4] flex items-center justify-center mb-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl animate-pulse"></div>
          <Scan className="w-16 h-16 text-white/50" />
          <p className="absolute bottom-6 text-white text-sm">Camera Stream Placeholder</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-blue-700">Scan QR</button>
          <button className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-full font-medium hover:bg-slate-50">Scan OCR</button>
        </div>
      </div>
    );
  }

  // Default Construction
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
      <div className="bg-slate-50 p-6 rounded-full mb-4">
        <Construction className="w-12 h-12 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">{name} Module</h2>
      <p className="text-slate-500 max-w-sm mb-6">
        This module is currently under development. In the final version, this will contain specific workflows for {name.toLowerCase()}.
      </p>
      <button className="text-blue-600 font-medium hover:underline text-sm">
        View Requirements
      </button>
    </div>
  );
}