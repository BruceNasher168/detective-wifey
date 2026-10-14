import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, Users, Pin } from 'lucide-react';
import { IoPeople } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const TimApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const timData = caseData.appsData?.tim || {};
  const channels = timData.channels || [];

  const swipeHandlers = useSwipeBack({ onBack: onReturnHome });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F5F5F5] text-[#252424] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#464EB8] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Trang chủ"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Tim</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#616161]">
          <span>KÊNH LÀM VIỆC NHÓM</span>
        </div>

        {channels.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#616161]">
            Không có thông báo nhóm mới.
          </div>
        ) : (
          channels.map((ch: any) => (
            <div
              key={ch.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-1.5 min-h-[64px]"
            >
              <h4 className="font-bold text-xs text-[#464EB8]">{ch.name}</h4>
              <p className="text-xs text-[#252424]">{ch.lastMessage}</p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onTagSuspect('Tin nhắn nội bộ Tim', 'tim')}
                  className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>Ghim</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'tim',
  displayName: 'Tim',
  icon: IoPeople,
  themeGradient: 'from-indigo-600 to-purple-700',
  themeColor: '#464EB8',
  notificationBadgeCount: 2,
  isLocked: false,
  component: TimApp,
};

export default TimApp;

