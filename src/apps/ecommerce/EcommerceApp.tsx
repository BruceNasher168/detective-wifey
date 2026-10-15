import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { IoBagHandleOutline, IoChevronBack, IoCubeOutline, IoSearchOutline } from 'react-icons/io5';
import { IoBagHandle } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';
import { StoryEvidenceTarget } from '../../components/StoryEvidenceTarget';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../components/UniversalEvidenceModal';

export const EcommerceApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const ecommerceData = caseData.appsData?.ecommerce || caseData.appsData?.poshee || {};
  const orders = ecommerceData.orders || [];
  const searches = ecommerceData.recentSearches || [];
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<UniversalEvidenceItem | null>(null);

  const handleBack = () => {
    if (selectedOrder) {
      setSelectedOrder(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#212121] select-none font-sans"
    >
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#FF5722] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={selectedOrder ? () => setSelectedOrder(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedOrder ? 'Quay lại đơn hàng' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{selectedOrder ? 'Đơn hàng' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoBagHandleOutline className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Poshee</h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3 h-11 bg-white rounded-xl border border-slate-200 shadow-sm text-xs text-slate-500">
          <IoSearchOutline className="w-4 h-4 text-slate-400" />
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
            <StoryEvidenceTarget
              key={order.orderId}
              item={{
                title: order.title,
                subtitle: `Đơn hàng ${order.orderId} • ${order.status}`,
                snippet: `Mặt hàng: ${order.title}\nSKU: ${order.sku}\nNgười nhận: ${order.recipient}\nGiá trị: ${order.price}`,
                suspectToTag: order.suspectName || 'Mai Lễ Tân (Poshee)',
              }}
              onTriggerEvidence={setEvidenceItem}
            >
              <div
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
                    <IoCubeOutline className="w-6 h-6" />
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
              </div>
            </StoryEvidenceTarget>
          ))}
        </div>
      </main>

      {/* Universal Blurred Pop-up on Long Press */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'ecommerce')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'ecommerce',
  displayName: 'Poshee',
  icon: IoBagHandle,
  themeGradient: 'from-orange-500 to-amber-600',
  themeColor: '#FF5722',
  notificationBadgeCount: 0,
  isLocked: false,
  component: EcommerceApp,
};

export const PosheeApp = EcommerceApp;
export default EcommerceApp;

