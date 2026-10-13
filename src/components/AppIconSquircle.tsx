import React from 'react';
import { AppDefinition } from '../types/app-contracts';

interface AppIconSquircleProps {
  app: AppDefinition;
  onClick: () => void;
  overrideBadgeCount?: number;
}

export const AppIconSquircle: React.FC<AppIconSquircleProps> = ({
  app,
  onClick,
  overrideBadgeCount,
}) => {
  const IconComponent = app.icon;
  const badgeCount =
    overrideBadgeCount !== undefined ? overrideBadgeCount : app.notificationBadgeCount || 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center p-1 rounded-2xl group active:scale-90 transition-transform cursor-pointer focus:outline-none min-w-[60px] min-h-[64px]"
      aria-label={`Mở ứng dụng ${app.displayName}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.themeGradient} flex items-center justify-center text-white shadow-md border border-white/20 relative group-hover:shadow-lg transition-all`}
      >
        <IconComponent className="w-7 h-7 stroke-[2]" />

        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md">
            {badgeCount}
          </span>
        )}
      </div>

      <span className="text-xs font-medium text-white mt-1.5 tracking-tight truncate w-full text-center max-w-[84px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {app.displayName}
      </span>
    </button>
  );
};

