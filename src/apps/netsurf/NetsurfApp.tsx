import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, Compass, Globe, Pin, Search } from 'lucide-react';
import { IoCompass } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const NetsurfApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const netsurfData = caseData.appsData?.netsurf || {};
  const history = netsurfData.history || [];

  const swipeHandlers = useSwipeBack({ onBack: onReturnHome });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F2F2F7] text-[#111827] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#3F51B5] text-white shadow-md shrink-0">
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
          <Compass className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">NetSurf</h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Mock Address Bar */}
      <div className="px-3 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2 px-3 h-9 bg-slate-100 rounded-lg text-xs text-slate-500 font-mono">
          <Search className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="truncate">netsurf://history/today</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
          <span>LỊCH SỬ DUYỆT WEB HÔM NAY</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Không có lịch sử tìm kiếm.
          </div>
        ) : (
          history.map((item: any) => (
            <div
              key={item.id}
              className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all space-y-1 min-h-[52px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#3F51B5] shrink-0" />
                  <h4 className="font-bold text-xs text-[#111827] truncate">{item.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagSuspect(item.title, 'netsurf');
                  }}
                  className="flex items-center gap-1 min-h-[44px] px-2 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                >
                  <Pin className="w-3 h-3" />
                  <span>Ghim</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{item.url}</p>
              <span className="text-[10px] text-slate-400 block">{item.time}</span>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'netsurf',
  displayName: 'NetSurf',
  icon: IoCompass,
  themeGradient: 'from-blue-600 to-indigo-700',
  themeColor: '#3F51B5',
  notificationBadgeCount: 0,
  isLocked: false,
  component: NetsurfApp,
};

export default NetsurfApp;
