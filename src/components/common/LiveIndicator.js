import React from 'react';

const LiveIndicator = ({ count, text }) => {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--glass-shadow)] backdrop-blur-md">
      <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-[var(--accent-primary)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
        </span>
        Realtime
      </div>
      <div className="w-[1px] h-3 bg-[var(--border-medium)] opacity-50" />
      <span className="text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">
        <span className="text-[var(--accent-secondary)]">{count}</span> {text}
      </span>
    </div>
  );
};

export default LiveIndicator;
