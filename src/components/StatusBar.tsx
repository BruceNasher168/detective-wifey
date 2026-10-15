import React from 'react';
import { IoBatteryDead, IoCellular, IoWifiSharp } from 'react-icons/io5';
import { DeviceMetadata } from '../types/case-schema';

interface StatusBarProps {
  deviceMetadata?: DeviceMetadata;
  backgroundColor?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceMetadata, backgroundColor = 'transparent' }) => {
  const time = deviceMetadata?.narrativeTime || '23:45';
  const batteryStr = deviceMetadata?.batteryPercent || '42%';
  const parsedBattery = Number.parseInt(batteryStr, 10);
  const batteryVal = Number.isNaN(parsedBattery) ? 42 : Math.min(100, Math.max(0, parsedBattery));

  return (
    <header
      className="shrink-0 flex justify-between items-center text-xs font-semibold text-white select-none z-40 relative transition-colors duration-200"
      style={{
        backgroundColor,
        height: 'calc(44px + env(safe-area-inset-top, 0px))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'max(28px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(28px, env(safe-area-inset-right, 0px))',
      }}
    >
      {/* 1. Left Zone: Narrative Time (14px Semibold tabular) */}
      <span className="shrink-0 text-left font-semibold text-[14px] tracking-tight text-white tabular-nums">
        {time}
      </span>

      {/* 2. Right Zone: Cellular, Wi-Fi, Capsule Battery (Zero-carrier invariant) */}
      <div className="flex shrink-0 items-center justify-end gap-1.5">
        <IoCellular aria-hidden="true" className="w-[18px] h-[18px] shrink-0" />
        <IoWifiSharp
          aria-hidden="true"
          className="w-[18px] h-[18px] shrink-0 [&>path:first-child]:stroke-[56]"
        />

        {/* Authentic iOS Capsule Battery */}
        <div role="img" aria-label={`Pin ${batteryVal}%`} className="relative w-9 h-[18px] shrink-0">
          <IoBatteryDead
            aria-hidden="true"
            viewBox="0 128 512 256"
            className="absolute inset-0 w-full h-full text-white/60"
          />
          <div className="absolute left-1 top-[3px] w-6 h-3 overflow-hidden rounded-[1px] bg-white/20">
            <div
              className={`h-full ${batteryVal <= 20 ? 'bg-red-500' : 'bg-white'}`}
              style={{ width: `${batteryVal}%` }}
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[3px] right-[5px] flex items-center justify-center text-[9px] leading-none font-bold tabular-nums text-white mix-blend-difference"
          >
            {batteryVal}%
          </span>
        </div>
      </div>
    </header>
  );
};

export default StatusBar;
