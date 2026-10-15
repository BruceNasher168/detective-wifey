import React from 'react';
import { AppDefinition } from '../../shared/contracts/app-contracts';

interface AppIconSquircleProps {
  app: AppDefinition;
  onClick: () => void;
  overrideBadgeCount?: number;
  hideLabel?: boolean;
}

export const AppIconSquircle: React.FC<AppIconSquircleProps> = ({
  app,
  onClick,
  overrideBadgeCount,
  hideLabel = false,
}) => {
  const IconComponent = app.icon;
  const badgeCount =
    overrideBadgeCount !== undefined ? overrideBadgeCount : app.notificationBadgeCount || 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center p-0.5 sm:p-1 group active:scale-90 transition-transform cursor-pointer focus:outline-none min-w-[44px]"
      aria-label={`Mở ứng dụng ${app.displayName}`}
    >
      <div
        className={`w-12 h-12 tall:w-14 tall:h-14 xshort:w-11 xshort:h-11 ${app.iconAsset ? '' : `bg-gradient-to-br ${app.themeGradient} shadow-md border border-white/20 group-hover:shadow-lg`} flex items-center justify-center text-white relative transition-all`}
        style={{ borderRadius: '22.5%' }}
      >
        {app.iconAsset ? (
          <img src={app.iconAsset} alt="" aria-hidden="true" draggable={false} className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg" />
        ) : (
          <IconComponent className="w-6 h-6 tall:w-7 tall:h-7 xshort:w-5 xshort:h-5" />
        )}

        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white font-bold text-ios-caption-2 tabular-nums flex items-center justify-center border-2 border-slate-900 shadow-md">
            {badgeCount}
          </span>
        )}
      </div>

      {!hideLabel && (
        <span className="text-ios-caption-2 tall:text-ios-caption-1 font-medium text-white mt-1 tracking-tight truncate w-full text-center max-w-[76px] tall:max-w-[84px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {app.displayName}
        </span>
      )}
    </button>
  );
};

