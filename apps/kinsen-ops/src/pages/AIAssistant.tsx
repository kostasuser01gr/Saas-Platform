/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ai, MODELS, DEFAULT_MODEL } from '@/lib/gemini';
import { PanelLeftClose, PanelLeftOpen, Menu, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { ChatSession, Message } from '@/lib/types';
import { storage } from '@/lib/storage';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load sessions on mount
  useEffect(() => {
    setSessions(storage.getSessions());
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  // Save current session when messages change
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        const updatedSession = {
          ...session,
          messages,
          updatedAt: Date.now(),
          // Generate title from first message if not set or if it's "New Chat"
          title: session.title === 'New Chat' && messages.length > 0 
            ? (messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : ''))
            : session.title
        };
        storage.saveSession(updatedSession);
        setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));
      }
    }
  }, [messages, currentSessionId]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    storage.saveSession(newSession);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setCurrentResponse('');
    setIsLoading(false);
    
    // On mobile, close sidebar when starting new chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      setCurrentResponse('');
      setIsLoading(false);
      // On mobile, close sidebar when selecting chat
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      handleNewChat();
    }
  };

  const handleSendMessage = async (text: string) => {
    // If no session exists, create one
    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      storage.saveSession(newSession);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      activeSessionId = newSession.id;
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      // Prepare history for the model
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const chat = ai.chats.create({
        model: selectedModel,
        history: history,
        config: {
          systemInstruction: "You are a helpful, expert AI assistant. You are intelligent, precise, and friendly. You format your responses using Markdown. You are powered by Google's Gemini models.",
        }
      });

      const result = await chat.sendMessageStream({
        message: text
      });

      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setCurrentResponse(fullText);
        }
      }

      // Finalize message
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: fullText
      };
      
      // We need to update messages state here to trigger the save effect
      setMessages(prev => [...prev, aiMsg]);
      setCurrentResponse('');
      
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I'm sorry, I encountered an error while processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-zinc-950 overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onNewChat={handleNewChat}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex-1 flex flex-col h-full relative w-full min-w-0">
        {/* Header / Top Bar */}
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu size={24} />
              </Button>
            </div>
            
            {/* Desktop Toggle (When sidebar is open) */}
            <div className="hidden md:block">
              {!isSidebarOpen && (
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-zinc-400 hover:text-zinc-900 mr-2"
                  title="Open sidebar"
                >
                  <PanelLeftOpen size={24} />
                </Button>
              )}
               {isSidebarOpen && (
                 <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 mr-2"
                  title="Close sidebar"
                >
                  <PanelLeftClose size={24} />
                </Button>
              )}
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
                <span>{MODELS[selectedModel as keyof typeof MODELS]}</span>
                <span className="text-xs text-zinc-400">▼</span>
              </button>
              
              {/* Simple Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {Object.entries(MODELS).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${selectedModel === key ? 'bg-zinc-50 dark:bg-zinc-800/50 text-indigo-600 dark:text-indigo-400' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {key.includes('pro') ? <Sparkles size={14} /> : <Zap size={14} />}
                      <span>{name}</span>
                    </div>
                    {selectedModel === key && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-zinc-500 max-w-md mb-8">
                I can help you write code, draft emails, explain complex topics, or just have a chat.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {['Explain quantum computing', 'Write a React component', 'Debug a Python script', 'Creative writing tips'].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-4 text-left bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col py-4 md:py-10 pb-32">
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  role={msg.role} 
                  content={msg.content} 
                />
              ))}
              
              {/* Streaming Response */}
              {isLoading && currentResponse && (
                <MessageBubble 
                  role="model" 
                  content={currentResponse} 
                />
              )}
              
              {/* Loading Indicator (Thinking) - only show if no response yet */}
              {isLoading && !currentResponse && (
                <MessageBubble 
                  role="model" 
                  content="" 
                  isThinking={true}
                />
              )}
              
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 pb-6 pt-10 px-4">
          <ChatInput 
            onSend={handleSendMessage} 
            isLoading={isLoading} 
            onStop={() => {
              // In a real app, we would abort the fetch controller here
              setIsLoading(false);
            }} 
          />
        </div>
      </main>
    </div>
  );
}
