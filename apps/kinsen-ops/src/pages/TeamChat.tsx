import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Check, 
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Mic,
  Hash,
  Volume2,
  Settings,
  Plus,
  ChevronDown,
  UserPlus,
  Headphones,
  MicOff,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';

// --- Mock Data ---

const CHANNELS = [
  { id: 'c1', name: 'general', type: 'text', unread: 0 },
  { id: 'c2', name: 'announcements', type: 'text', unread: 2 },
  { id: 'c3', name: 'fleet-ops', type: 'text', unread: 0 },
  { id: 'c4', name: 'maintenance', type: 'text', unread: 5 },
  { id: 'c5', name: 'bookings', type: 'text', unread: 0 },
];

const VOICE_CHANNELS = [
  { id: 'v1', name: 'Lobby', users: [] },
  { id: 'v2', name: 'Meeting Room', users: ['Alex Morgan', 'Sarah Connor'] },
];

const MEMBERS = [
  { id: 'u1', name: 'Alex Morgan', role: 'Admin', status: 'online', avatar: 'AM', color: 'text-indigo-500' },
  { id: 'u2', name: 'Sarah Connor', role: 'Manager', status: 'idle', avatar: 'SC', color: 'text-emerald-500' },
  { id: 'u3', name: 'John Wick', role: 'Staff', status: 'dnd', avatar: 'JW', color: 'text-zinc-500' },
  { id: 'u4', name: 'Ellen Ripley', role: 'Staff', status: 'offline', avatar: 'ER', color: 'text-zinc-500' },
];

const INITIAL_MESSAGES = [
  { id: 1, senderId: 'u2', sender: 'Sarah Connor', content: 'Has the Tesla (ELN-404) returned yet?', time: '10:30 AM', date: 'Today' },
  { id: 2, senderId: 'u1', sender: 'Alex Morgan', content: 'Not yet. Customer called, said they are 30 mins away.', time: '10:32 AM', date: 'Today' },
  { id: 3, senderId: 'u2', sender: 'Sarah Connor', content: 'Okay, I will let the cleaning crew know to standby.', time: '10:33 AM', date: 'Today' },
  { id: 4, senderId: 'u3', sender: 'John Wick', content: 'I noticed a scratch on the bumper of the Ford Explorer. Uploading photos now.', time: '10:45 AM', date: 'Today' },
  { id: 5, senderId: 'u3', sender: 'John Wick', content: 'IMG_2024.jpg', type: 'image', time: '10:45 AM', date: 'Today' },
];

// --- Components ---

const ChannelItem = ({ channel, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group mb-0.5",
      isActive 
        ? "bg-zinc-200 dark:bg-zinc-700/50 text-zinc-900 dark:text-zinc-100" 
        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
    )}
  >
    <Hash size={18} className="text-zinc-400" />
    <span className="font-medium text-sm truncate">{channel.name}</span>
    {channel.unread > 0 && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
        {channel.unread}
      </span>
    )}
  </button>
);

const MemberItem = ({ member }: any) => (
  <div className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer opacity-90 hover:opacity-100 transition-all">
    <div className="relative">
      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
        {member.avatar}
      </div>
      <span className={cn(
        "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900",
        member.status === 'online' ? "bg-emerald-500" :
        member.status === 'idle' ? "bg-amber-500" :
        member.status === 'dnd' ? "bg-red-500" : "bg-zinc-500"
      )} />
    </div>
    <div>
      <div className={cn("text-sm font-medium", member.color)}>
        {member.name}
      </div>
      <div className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">
        {member.status !== 'offline' ? member.status : 'Offline'}
      </div>
    </div>
  </div>
);

export default function TeamChat() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      senderId: 'u1', // Current user
      sender: 'Alex Morgan',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      type: 'text'
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-zinc-950 overflow-hidden">
      
      {/* --- Left Sidebar: Channels --- */}
      <div className="w-60 bg-zinc-50 dark:bg-[#1e1f22] flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        {/* Server Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
          <h2 className="font-bold text-sm truncate">DriveFlow HQ</h2>
          <ChevronDown size={16} />
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          {/* Text Channels */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1 group">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">Text Channels</h3>
              <Plus size={14} className="text-zinc-500 cursor-pointer opacity-0 group-hover:opacity-100" />
            </div>
            <div className="space-y-0.5">
              {CHANNELS.map(channel => (
                <ChannelItem 
                  key={channel.id} 
                  channel={channel} 
                  isActive={activeChannel.id === channel.id} 
                  onClick={() => setActiveChannel(channel)}
                />
              ))}
            </div>
          </div>

          {/* Voice Channels */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1 group">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">Voice Channels</h3>
              <Plus size={14} className="text-zinc-500 cursor-pointer opacity-0 group-hover:opacity-100" />
            </div>
            <div className="space-y-1">
              {VOICE_CHANNELS.map(channel => (
                <div key={channel.id} className="px-2 py-1 group cursor-pointer">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                    <Volume2 size={18} />
                    <span className="font-medium text-sm">{channel.name}</span>
                  </div>
                  {channel.users.length > 0 && (
                    <div className="pl-6 mt-1 space-y-1">
                      {channel.users.map((user, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[10px]">
                            {user.charAt(0)}
                          </div>
                          <span className="text-xs text-zinc-500">{user}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Controls */}
        <div className="h-14 bg-zinc-100 dark:bg-[#232428] px-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-900">
          <div className="flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 p-1 rounded cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AM</div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-100 dark:border-[#232428]"></div>
            </div>
            <div className="text-xs">
              <div className="font-bold">Alex Morgan</div>
              <div className="text-zinc-500 text-[10px]">#1337</div>
            </div>
          </div>
          <div className="flex">
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><Mic size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><Headphones size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><Settings size={16} /></button>
          </div>
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#313338] min-w-0">
        {/* Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <Hash size={24} className="text-zinc-400" />
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{activeChannel.name}</h3>
            <span className="hidden sm:inline-block text-xs text-zinc-500 border-l border-zinc-300 dark:border-zinc-700 pl-3 ml-1">
              General discussion for all staff
            </span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <Phone size={20} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer" />
            <Video size={20} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer" />
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-zinc-100 dark:bg-[#1e1f22] text-sm px-2 py-1 rounded w-36 transition-all focus:w-56 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
              />
              <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
            <Users size={20} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer sm:hidden" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar flex flex-col">
          {messages.map((msg, index) => {
            const isSequence = index > 0 && messages[index - 1].senderId === msg.senderId;
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "group flex gap-4 pr-4 hover:bg-zinc-50 dark:hover:bg-[#2e3035] -mx-4 px-4 py-0.5 transition-colors",
                  isSequence ? "mt-0.5" : "mt-4"
                )}
              >
                {!isSequence ? (
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center font-bold text-sm mt-0.5 cursor-pointer hover:opacity-80">
                    {msg.sender.charAt(0) + msg.sender.split(' ')[1]?.charAt(0)}
                  </div>
                ) : (
                  <div className="w-10 flex-shrink-0 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 text-right pr-1 select-none">
                    {msg.time.split(' ')[0]}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {!isSequence && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-zinc-400">{msg.date} at {msg.time}</span>
                    </div>
                  )}
                  <div className={cn(
                    "text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-words leading-relaxed",
                    msg.type === 'image' && "mt-2"
                  )}>
                    {msg.type === 'image' ? (
                      <div className="max-w-sm rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                        <div className="bg-zinc-100 dark:bg-zinc-800 h-48 flex items-center justify-center text-zinc-500">
                          <ImageIcon size={32} />
                          <span className="ml-2 text-sm">Image Placeholder</span>
                        </div>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-6 pt-2">
          <div className="bg-zinc-100 dark:bg-[#383a40] rounded-lg p-2 flex items-start gap-2 shadow-sm">
            <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              <Plus size={20} />
            </button>
            <TextareaAutosize
              minRows={1}
              maxRows={8}
              placeholder={`Message #${activeChannel.name}`}
              className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 resize-none py-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-1 pr-1">
              <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Smile size={20} />
              </button>
              {newMessage.trim() && (
                <button 
                  onClick={() => handleSendMessage()}
                  className="p-2 text-indigo-500 hover:text-indigo-600 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <Send size={20} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-1 text-center">
             {/* Typing Indicator Placeholder */}
             {/* <span className="text-xs font-bold animate-pulse text-zinc-500">Sarah is typing...</span> */}
          </div>
        </div>
      </div>

      {/* --- Right Sidebar: Members --- */}
      <div className="w-60 bg-zinc-50 dark:bg-[#2b2d31] hidden lg:flex flex-col border-l border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {['Admin', 'Manager', 'Staff'].map((role) => {
            const roleMembers = MEMBERS.filter(m => m.role === role);
            if (roleMembers.length === 0) return null;
            
            return (
              <div key={role} className="mb-6">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2">
                  {role} — {roleMembers.length}
                </h3>
                <div className="space-y-0.5">
                  {roleMembers.map(member => (
                    <MemberItem key={member.id} member={member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
