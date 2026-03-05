import React from 'react';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-glass backdrop-blur-xl border border-glassBorder rounded-3xl shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export const GlassButton: React.FC<GlassProps & { active?: boolean }> = ({ children, className = '', active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center
        ${active 
          ? 'bg-white/20 text-white shadow-inner backdrop-blur-md border border-white/20' 
          : 'bg-transparent text-white/60 hover:text-white hover:bg-white/10'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = 'bg-accent' }) => {
  return (
    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
