import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, StopCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative flex items-end w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-700 transition-all">
        {/* Attachment button (visual only for now) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 mb-0.5 mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-full"
          title="Attach file (demo)"
        >
          <Paperclip size={20} />
        </Button>

        <Textarea
          ref={textareaRef}
          minRows={1}
          maxRows={8}
          placeholder="Message Gemini..."
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2.5 text-base resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="mb-0.5 ml-2">
          {isLoading ? (
            <Button
              onClick={onStop}
              size="icon"
              className="h-9 w-9 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <StopCircle size={18} fill="currentColor" className="text-white dark:text-zinc-900" />
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit()}
              disabled={!input.trim()}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-200",
                input.trim() 
                  ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900" 
                  : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              )}
            >
              <SendHorizontal size={18} />
            </Button>
          )}
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Gemini can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
