import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { IoArrowDownOutline, IoArrowUpOutline, IoCardOutline, IoChevronBack, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { IoCard } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';
import { StoryEvidenceTarget } from '../../components/StoryEvidenceTarget';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../components/UniversalEvidenceModal';

export const BankingApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const bankingData = caseData.appsData?.banking || caseData.appsData?.vietpay || {};
  const transactions = bankingData.transactions || [];
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<UniversalEvidenceItem | null>(null);

  const handleBack = () => {
    if (selectedTx) {
      setSelectedTx(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F8FAFC] text-[#0F172A] select-none font-sans"
    >
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#006A4E] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={selectedTx ? () => setSelectedTx(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedTx ? 'Quay lại' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{selectedTx ? 'Biến động' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoCardOutline className="w-5 h-5 text-[#D4AF37]" />
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
              {showBalance ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-2">
            {showBalance ? bankingData.balance || '18.500.000 đ' : '•••••••• đ'}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>STK: {bankingData.accountNumber || '1903****8899'}</span>
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
            <StoryEvidenceTarget
              key={tx.id}
              item={{
                title: `Giao dịch: ${tx.beneficiary}`,
                subtitle: `${tx.time} • ${tx.date} • ${tx.amount}`,
                snippet: `Người thụ hưởng: ${tx.beneficiary}\nSố tiền: ${tx.amount}\nNội dung CK: "${tx.memo || 'Không có nội dung'}"`,
                suspectToTag: tx.suspectName || 'Hương Đồng Nghiệp (VietPay)',
              }}
              onTriggerEvidence={setEvidenceItem}
            >
              <div
                onClick={() => setSelectedTx(tx)}
                className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all min-h-[64px]"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.amount.startsWith('-') ? 'bg-rose-50 text-[#D32F2F]' : 'bg-emerald-50 text-[#00C853]'
                    }`}>
                      {tx.amount.startsWith('-') ? (
                        <IoArrowUpOutline className="w-4 h-4" />
                      ) : (
                        <IoArrowDownOutline className="w-4 h-4" />
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
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 font-serif italic border border-slate-100">
                    <span>"{tx.memo}"</span>
                  </div>
                )}
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
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'banking')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'banking',
  displayName: 'VietPay',
  icon: IoCard,
  themeGradient: 'from-emerald-700 to-teal-800',
  themeColor: '#006A4E',
  notificationBadgeCount: 1,
  isLocked: false,
  component: BankingApp,
};

export const VietpayApp = BankingApp;
export default BankingApp;

