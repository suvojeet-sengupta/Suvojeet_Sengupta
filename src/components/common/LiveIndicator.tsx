import React from 'react';

interface LiveIndicatorProps {
  count: number;
  text: string;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ count, text }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--bg-elevated)] border border-[color:var(--line)] text-[12px] text-[color:var(--text-tertiary)]">
      <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#5fa36a]" aria-hidden="true" />
      <span className="whitespace-nowrap">
        {count} {text}
      </span>
    </div>
  );
};

export default LiveIndicator;
