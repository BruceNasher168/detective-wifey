import React from 'react';

interface DynamicIslandProps {
  className?: string;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md shrink-0 ${className}`}
      aria-label="Dynamic Island"
    >
      <div className="w-2 h-2 rounded-full bg-[#18181b] border border-[#27272a]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
    </div>
  );
};

