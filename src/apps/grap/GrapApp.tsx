import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, Car, MapPin } from 'lucide-react';
import { IoCar } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const GrapApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const grapData = caseData.appsData?.grap || {};
  const trips = grapData.trips || [];
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  const handleBack = () => {
    if (selectedTrip) {
      setSelectedTrip(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F3F4F6] text-[#1F2937] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#00B14F] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={selectedTrip ? () => setSelectedTrip(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedTrip ? 'Quay lại' : 'Trang chủ'}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{selectedTrip ? 'Hoạt động' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Grap</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
          <span>LỊCH SỬ CHUYẾN ĐI & GIAO HÀNG</span>
        </div>

        {trips.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Không có chuyến đi gần đây.
          </div>
        ) : (
          trips.map((trip: any) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all space-y-2 min-h-[64px]"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#1F2937]">{trip.driver}</span>
                <span className="font-mono font-bold text-[#00B14F]">{trip.cost}</span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{trip.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{trip.dropoff}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                <span>{trip.time}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagSuspect(trip.dropoff || 'Chuyến đi Grap', 'grap');
                  }}
                  className="min-h-[44px] px-2 text-rose-600 font-bold hover:text-rose-700"
                >
                  + Ghim lộ trình
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
  appId: 'grap',
  displayName: 'Grap',
  icon: IoCar,
  themeGradient: 'from-emerald-500 to-green-600',
  themeColor: '#00B14F',
  notificationBadgeCount: 0,
  isLocked: false,
  component: GrapApp,
};

export default GrapApp;
