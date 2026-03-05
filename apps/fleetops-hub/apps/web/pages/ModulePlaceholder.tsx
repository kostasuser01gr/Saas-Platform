import React, { useState } from 'react';
import { Bot, Mic, Scan, Construction, AlertCircle, Camera, Upload, X, Zap } from 'lucide-react';

export default function ModulePlaceholder({ name }: { name: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'VIN' | 'QR'>('VIN');

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
      <div className="max-w-xl mx-auto mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Scanner Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-2">
               <div className="p-2 bg-blue-100 rounded-lg">
                 <Camera size={20} className="text-blue-600"/> 
               </div>
               <div>
                 <h2 className="font-bold text-slate-800 text-sm">Scanner Pro</h2>
                 <p className="text-xs text-slate-500">Optical Character Recognition</p>
               </div>
             </div>
             
             {/* Mode Toggle */}
             <div className="flex bg-slate-200 rounded-lg p-1 text-xs font-medium">
               <button 
                 onClick={() => setScanMode('VIN')}
                 className={`px-3 py-1.5 rounded-md transition-all ${scanMode === 'VIN' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 VIN
               </button>
               <button 
                 onClick={() => setScanMode('QR')}
                 className={`px-3 py-1.5 rounded-md transition-all ${scanMode === 'QR' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 QR / Barcode
               </button>
             </div>
          </div>

          {/* Viewfinder Area */}
          <div className="relative bg-slate-900 aspect-[4/3] flex flex-col items-center justify-center overflow-hidden group">
            
            {isScanning ? (
              <>
                {/* Simulated Camera Feed (Static Image for Demo) */}
                <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000" 
                      alt="Camera Feed" 
                      className="w-full h-full object-cover"
                    />
                </div>
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
                  <div className={`relative border-2 border-blue-500 rounded-lg shadow-[0_0_0_999px_rgba(0,0,0,0.75)] transition-all duration-300 ${scanMode === 'VIN' ? 'w-full max-w-sm h-16' : 'w-64 h-64'}`}>
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-0.5 -ml-0.5"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-0.5 -mr-0.5"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-0.5 -ml-0.5"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-0.5 -mr-0.5"></div>
                    
                    {/* Scanning Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] top-1/2 -translate-y-1/2 animate-pulse"></div>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2 text-white font-medium text-xs bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                    <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                    {scanMode === 'VIN' ? 'Align VIN within the box' : 'Point camera at code'}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center z-10 text-center px-6">
                <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-2xl">
                  <Camera className="text-slate-400" size={32} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Camera Access Required</h3>
                <p className="text-slate-400 text-sm max-w-xs mb-8">
                  We need permission to access your camera to scan {scanMode === 'VIN' ? 'Vehicle Identification Numbers' : 'QR codes'}.
                </p>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center justify-center gap-6">
               <button 
                 className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors gap-1" 
                 title="Upload Image"
               >
                 <Upload size={20} />
                 <span className="text-[10px] font-medium">Upload</span>
               </button>

               {!isScanning ? (
                 <button 
                   onClick={() => setIsScanning(true)}
                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
                 >
                   <Scan size={20} /> Start Scanning
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsScanning(false)}
                   className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-8 py-3 rounded-full font-bold transition-all border border-red-100"
                 >
                   <X size={20} /> Stop Camera
                 </button>
               )}
               
               <button 
                 className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors gap-1"
                 title="Flashlight"
                 disabled={!isScanning}
               >
                 <Zap size={20} />
                 <span className="text-[10px] font-medium">Flash</span>
               </button>
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
                Powered by FleetOps OCR Engine v2.1 • {scanMode} Mode Active
            </p>
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