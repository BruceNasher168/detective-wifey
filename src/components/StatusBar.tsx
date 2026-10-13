import React from 'react';
import { DynamicIsland } from './DynamicIsland';
import { SignalHigh, Wifi, Battery } from 'lucide-react';
import { DeviceMetadata } from '../types/case-schema';

interface StatusBarProps {
  deviceMetadata?: DeviceMetadata;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceMetadata }) => {
  const time = deviceMetadata?.narrativeTime || '23:45';
  const battery = deviceMetadata?.batteryPercent || '42%';
  const carrier = deviceMetadata?.carrierTag || '5G';

  return (
    <header className="h-10 px-4 pt-1 flex justify-between items-center text-xs font-semibold text-white select-none z-40 relative">
      <span className="w-12 text-left font-semibold text-sm tracking-tight text-white">
        {time}
      </span>

      <DynamicIsland />

      <div className="flex items-center gap-1.5 text-xs">
        <SignalHigh className="w-3.5 h-3.5 text-white" />
        <span className="text-[11px] font-bold">{carrier}</span>
        <Wifi className="w-3.5 h-3.5 text-white" />
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
          <span>{battery}</span>
          <Battery className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </header>
  );
};

