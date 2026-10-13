import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, ShoppingBag, Pin, Package, Search } from 'lucide-react';

export const PosheeApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const posheeData = caseData.appsData?.poshee || {};
  const orders = posheeData.orders || [];
  const searches = posheeData.recentSearches || [];
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#212121] select-none font-sans">
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#FF5722] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={selectedOrder ? () => setSelectedOrder(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedOrder ? 'Quay lại đơn hàng' : 'Trang chủ'}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{selectedOrder ? 'Đơn hàng' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Poshee</h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3 h-11 bg-white rounded-xl border border-slate-200 shadow-sm text-xs text-slate-500">
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Tìm kiếm đơn hàng, voucher giảm giá...</span>
        </div>

        {searches.length > 0 && (
          <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block">TÌM KIẾM GẦN ĐÂY</span>
            <div className="flex flex-wrap gap-1.5">
              {searches.map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-full text-[11px] text-[#E64A19] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
            <span>ĐƠN HÀNG ĐÃ MUA</span>
            <span className="text-[#FF5722]">Xem tất cả</span>
          </div>

          {orders.map((order: any) => (
            <div
              key={order.orderId}
              onClick={() => setSelectedOrder(order)}
              className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all space-y-2 min-h-[64px]"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-semibold">{order.orderId}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] font-bold text-[10px]">
                  {order.status}
                </span>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5722] shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#212121] leading-snug line-clamp-2">
                    {order.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{order.sku}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-500">{order.recipient}</span>
                <span className="font-bold text-[#E64A19]">{order.price}</span>
              </div>

              {order.isClue && order.suspectName && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-rose-600 font-medium">Nghi vấn giao hàng mờ ám</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagSuspect(order.suspectName, 'poshee');
                    }}
                    className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all"
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>+ Ghim Sổ Tay</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'poshee',
  displayName: 'Poshee',
  icon: ShoppingBag,
  themeGradient: 'from-orange-500 to-amber-600',
  themeColor: '#FF5722',
  notificationBadgeCount: 0,
  isLocked: false,
  component: PosheeApp,
};

export default PosheeApp;

