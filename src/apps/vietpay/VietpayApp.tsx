import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, CreditCard, Eye, EyeOff, Pin, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const VietpayApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const vietpayData = caseData.appsData?.vietpay || {};
  const transactions = vietpayData.transactions || [];
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-[#0F172A] select-none font-sans">
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#006A4E] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={selectedTx ? () => setSelectedTx(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedTx ? 'Quay lại' : 'Trang chủ'}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{selectedTx ? 'Biến động' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D4AF37]" />
          <h1 className="text-base font-bold tracking-tight">VietPay</h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Card Surface */}
        <div className="p-4 rounded-2xl bg-[#1E293B] text-white shadow-lg border border-slate-700 relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-[#64748B] font-medium tracking-wide uppercase">
              Tài khoản thanh toán
            </span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white"
              aria-label="Ẩn hiện số dư"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-2">
            {showBalance ? vietpayData.balance || '18.500.000 đ' : '•••••••• đ'}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>STK: {vietpayData.accountNumber || '1903****8899'}</span>
            <span className="text-[#D4AF37] font-semibold">Hạng Titan VIP</span>
          </div>
        </div>

        {/* Transactions Feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#64748B]">
            <span>LỊCH SỬ GIAO DỊCH GẦN ĐÂY</span>
            <span className="text-[#006A4E]">Chi tiết</span>
          </div>

          {transactions.map((tx: any) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all min-h-[64px]"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.amount.startsWith('-') ? 'bg-rose-50 text-[#D32F2F]' : 'bg-emerald-50 text-[#00C853]'
                  }`}>
                    {tx.amount.startsWith('-') ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">
                      {tx.beneficiary}
                    </span>
                    <span className="text-[10px] text-[#64748B]">{tx.time} • {tx.date}</span>
                  </div>
                </div>

                <span className={`font-mono font-bold text-xs ${
                  tx.amount.startsWith('-') ? 'text-[#D32F2F]' : 'text-[#00C853]'
                }`}>
                  {tx.amount}
                </span>
              </div>

              {tx.memo && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 font-serif italic border border-slate-100 flex items-center justify-between">
                  <span>"{tx.memo}"</span>
                  {tx.suspectName && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagSuspect(tx.suspectName, 'vietpay');
                      }}
                      className="flex items-center gap-1 min-h-[44px] px-2 text-[11px] font-bold text-rose-600 hover:text-rose-700 shrink-0"
                    >
                      <Pin className="w-3 h-3" />
                      <span>Ghim</span>
                    </button>
                  )}
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
  appId: 'vietpay',
  displayName: 'VietPay',
  icon: CreditCard,
  themeGradient: 'from-emerald-700 to-teal-800',
  themeColor: '#006A4E',
  notificationBadgeCount: 1,
  isLocked: false,
  component: VietpayApp,
};

export default VietpayApp;

