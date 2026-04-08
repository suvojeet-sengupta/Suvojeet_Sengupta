import React from 'react';

interface LiveIndicatorProps {
  count: number;
  text: string;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ count, text }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-sm bg-background border border-light shadow-lg">
      <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-brand-orange">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
        </span>
        LIVE
      </div>
      <div className="w-[1px] h-3 bg-light" />
      <span className="text-xs font-bold text-primary whitespace-nowrap uppercase tracking-widest">
        {count} {text}
      </span>
    </div>
  );
};

export default LiveIndicator;
