import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Bot, User, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface MessageBubbleProps {
  role: 'user' | 'model';
  content: string;
  isThinking?: boolean;
}

export function MessageBubble({ role, content, isThinking }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-4 md:p-6 max-w-3xl mx-auto",
        isUser ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-zinc-200 text-zinc-700" : "bg-emerald-600 text-white"
      )}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="flex-1 min-w-0 space-y-2 overflow-hidden">
        <div className="prose prose-zinc dark:prose-invert max-w-none leading-7 text-zinc-800 dark:text-zinc-100">
          {isThinking ? (
            <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group rounded-md overflow-hidden my-4">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                          className="p-1.5 bg-zinc-700/50 hover:bg-zinc-700 rounded-md text-zinc-200 transition-colors"
                          title="Copy code"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        {...props}
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code {...props} className={cn("bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-zinc-900 dark:text-zinc-200", className)}>
                      {children}
                    </code>
                  );
                },
                // Style other elements to look like ChatGPT/Claude
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-zinc-300 pl-4 italic my-4 text-zinc-600">{children}</blockquote>,
                table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-zinc-200 border border-zinc-200 rounded-lg">{children}</table></div>,
                th: ({ children }) => <th className="px-4 py-2 bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b">{children}</th>,
                td: ({ children }) => <td className="px-4 py-2 whitespace-nowrap text-sm border-b">{children}</td>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
