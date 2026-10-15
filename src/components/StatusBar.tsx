import React from 'react';
import { IoBatteryDead, IoCellular, IoWifi } from 'react-icons/io5';
import { DeviceMetadata } from '../types/case-schema';

interface StatusBarProps {
  deviceMetadata?: DeviceMetadata;
  backgroundColor?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ deviceMetadata, backgroundColor = 'transparent' }) => {
  const batteryMaskId = React.useId();
  const batteryBodyClipId = `${batteryMaskId}-body`;
  const time = deviceMetadata?.narrativeTime || '23:45';
  const batteryStr = deviceMetadata?.batteryPercent || '42%';
  const parsedBattery = Number.parseInt(batteryStr, 10);
  const batteryVal = Number.isNaN(parsedBattery) ? 42 : Math.min(100, Math.max(0, parsedBattery));

  return (
    <header
      className="shrink-0 flex justify-between items-center text-xs font-semibold text-white select-none z-40 relative transition-colors duration-200"
      style={{
        backgroundColor,
        // The centered camera cutout shares this row; do not add a second top inset.
        height: '44px',
        paddingLeft: 'max(40px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(40px, env(safe-area-inset-right, 0px))',
      }}
    >
      {/* 1. Left Zone: Narrative Time (14px–15px Semibold tabular) */}
      <span className="shrink-0 text-left font-semibold text-ios-subheadline tracking-tight text-white tabular-nums">
        {time}
      </span>

      {/* 2. Right Zone: Cellular, Wi-Fi, Capsule Battery (Zero-carrier invariant) */}
      <div className="flex shrink-0 items-center justify-end gap-1.5">
        <IoCellular aria-hidden="true" className="w-[18px] h-[18px] shrink-0" />
        {/* Keep the two inner Ionicons arcs and the dot: three visible levels. */}
        <IoWifi
          aria-hidden="true"
          viewBox="80 170 352 256"
          className="w-[18px] h-[18px] shrink-0 [&>path]:stroke-[12] [&>path:nth-of-type(3)]:hidden"
        />

        {/* Authentic iOS Capsule Battery */}
        <svg
          role="img"
          aria-label={`Pin ${batteryVal}%`}
          viewBox="0 128 512 256"
          className="w-9 h-[18px] shrink-0"
        >
          <defs>
            <clipPath id={batteryBodyClipId}>
              <rect x="31" y="144" width="400" height="224" rx="80" />
            </clipPath>
            {/* Black digits remove the battery pixels, revealing the background. */}
            <mask
              id={batteryMaskId}
              maskUnits="userSpaceOnUse"
              x="0" y="128" width="512" height="256"
              style={{ maskType: 'luminance' }}
            >
              <rect x="0" y="128" width="512" height="256" fill="white" />
              <text
                x="231" y="256" textAnchor="middle" dominantBaseline="central"
                fontSize="148" fontWeight="700" fill="black" className="tabular-nums"
              >
                {batteryVal}
              </text>
            </mask>
          </defs>
          <g mask={`url(#${batteryMaskId})`}>
            <IoBatteryDead
              aria-hidden="true"
              x="0" y="0" size={512}
              className="text-white [&>rect]:fill-current [&>rect]:stroke-none [&>rect]:opacity-50 [&>rect]:[rx:80px] [&>rect]:[ry:80px] [&>path]:opacity-60"
            />
            <rect
              x="31" y="144" width={400 * batteryVal / 100} height="224"
              clipPath={`url(#${batteryBodyClipId})`}
              fill="currentColor" className={batteryVal <= 20 ? 'text-red-500' : 'text-white'}
            />
          </g>
        </svg>
      </div>
    </header>
  );
};

export default StatusBar;
