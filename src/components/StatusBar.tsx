import React from 'react';
import { IoCellular, IoWifi } from 'react-icons/io5';
import { DeviceMetadata } from '../types/case-schema';

interface StatusBarProps {
  deviceMetadata?: DeviceMetadata;
  backgroundColor?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceMetadata, backgroundColor = 'transparent' }) => {
  const time = deviceMetadata?.narrativeTime || '23:45';
  const batteryStr = deviceMetadata?.batteryPercent || '42%';
  const batteryVal = Math.min(100, Math.max(5, parseInt(batteryStr, 10) || 42));

  return (
    <header
      className="h-10 px-4 pt-1 flex justify-between items-center text-xs font-semibold text-white select-none z-40 relative transition-colors duration-200"
      style={{ backgroundColor }}
    >
      {/* 1. Left Zone: Narrative Time (14px Semibold tabular) */}
      <span className="w-16 text-left font-semibold text-[14px] tracking-tight text-white tabular-nums">
        {time}
      </span>

      {/* 2. Right Zone: Cellular, Wi-Fi, Capsule Battery (Zero-carrier invariant) */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-xs">
        <IoCellular className="w-4 h-4 text-white shrink-0" />
        <IoWifi className="w-3.5 h-3.5 text-white shrink-0" />

        {/* Authentic iOS Capsule Battery */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-semibold tabular-nums text-white/90">
            {batteryStr}
          </span>
          <div className="relative w-5 h-2.5 rounded-[2.5px] border border-white/70 p-[1px] flex items-center">
            <div
              className={`h-full rounded-[1px] transition-all ${
                batteryVal <= 20 ? 'bg-red-500' : 'bg-white'
              }`}
              style={{ width: `${batteryVal}%` }}
            />
            {/* Battery Positive Terminal Cap */}
            <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-white/70 rounded-r-[0.5px]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StatusBar;
