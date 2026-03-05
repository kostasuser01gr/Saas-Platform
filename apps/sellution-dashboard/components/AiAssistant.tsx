import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { sendMessageToGemini } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hi! I am your personal Sales Assistant. How can I help you improve your numbers today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await sendMessageToGemini(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Sorry, I did not get that.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to AI service.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-[#161221] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 border border-white/5 shadow-xl h-[340px]">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-[#161221]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content (Collapsed State) */}
      <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2e1a47] to-[#1a1625] border border-purple-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)] relative group cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsOpen(true)}>
            <div className="absolute inset-0 rounded-full border border-purple-400 opacity-50 animate-pulse"></div>
            <div className="text-3xl font-bold bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent">AI</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Your Personal<br />Sales Assistant</h3>
        <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Get insights, draft emails, and analyze trends instantly.</p>
        <button 
            onClick={() => setIsOpen(true)}
            className="bg-white text-black px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
            Get Started
        </button>
      </div>

      {/* Chat Interface (Expanded State) */}
      <div className={`absolute inset-0 bg-[#1a1625] z-20 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#161221]">
            <div className="flex items-center gap-2">
                <Icons.AI className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-sm">Sellution AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <Icons.Close className="w-5 h-5" />
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : 'bg-[#2d283e] text-gray-200 rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
             {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-[#2d283e] p-3 rounded-2xl rounded-bl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5 bg-[#161221]">
            <div className="relative">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your sales..." 
                    className="w-full bg-[#0f0b1a] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-gray-600"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-300 disabled:opacity-50"
                >
                    <Icons.Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};