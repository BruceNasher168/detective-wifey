import { useState } from 'react';
import { IoArrowForward, IoCopyOutline, IoEyeOffOutline, IoEyeOutline, IoQrCodeOutline, IoReceiptOutline, IoWalletOutline } from 'react-icons/io5';
import type { BankingData, BankingQuickAction } from '../types';
import bankingLogo from '../assets/banking-logo.svg';

const tierLabels = { standard: 'Standard', inspire: 'Inspire', priority: 'Priority', private: 'Private' };
const actions = {
  transfer: { label: 'Chuyển tiền', icon: IoArrowForward },
  qr_pay: { label: 'Quét QR', icon: IoQrCodeOutline },
  vaults: { label: 'Tiết kiệm', icon: IoWalletOutline },
  bills: { label: 'Hóa đơn', icon: IoReceiptOutline },
};

interface BankingDashboardProps {
  data: BankingData;
  onOpenHistory: () => void;
  onOpenVaults: () => void;
}

export function BankingDashboard({ data, onOpenHistory, onOpenVaults }: BankingDashboardProps) {
  const [showBalance, setShowBalance] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const copyAccount = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(data.accountNumber);
      setCopyMessage('Đã sao chép số tài khoản.');
    } catch {
      setCopyMessage('Không thể sao chép. Vui lòng sao chép số tài khoản thủ công.');
    }
  };

  return (
    <section aria-label="Tổng quan tài khoản" className="space-y-6 p-4">
      <div className="bank-card relative overflow-hidden p-5 text-white" data-tier={data.tier}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <img src={bankingLogo} alt="Ngân hàng" draggable={false} className="h-10 w-10 shrink-0" />
          {data.tier && <span className="rounded-full border border-current/30 px-3 py-1 text-ios-footnote font-semibold">{tierLabels[data.tier]}</span>}
        </div>
        <p className="text-ios-footnote font-medium">Số dư khả dụng</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="bank-amount min-w-0 text-[1.75rem] font-bold leading-relaxed" aria-live="polite">{showBalance ? data.actualBalance : data.maskedBalance}</p>
          <button
            type="button"
            onClick={() => setShowBalance(visible => !visible)}
            aria-label={showBalance ? 'Ẩn số dư' : 'Hiện số dư'}
            aria-pressed={showBalance}
            className="bank-control flex items-center justify-center"
          >
            {showBalance ? <IoEyeOffOutline aria-hidden="true" className="h-6 w-6" /> : <IoEyeOutline aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-current/20 pt-3">
          <div className="min-w-0">
            <p className="text-ios-footnote">Tài khoản thanh toán</p>
            <p className="bank-amount mt-1 select-text break-words text-base font-semibold">{data.accountNumber || '-'}</p>
          </div>
          <button type="button" onClick={copyAccount} disabled={!data.accountNumber} aria-label="Sao chép số tài khoản" className="bank-control flex shrink-0 items-center justify-center disabled:opacity-40">
            <IoCopyOutline aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <button type="button" onClick={onOpenHistory} className="bank-control mt-3 flex w-full items-center justify-between gap-2 text-left text-base font-semibold">
          <span>Tài khoản &amp; lịch sử</span><IoArrowForward aria-hidden="true" className="h-5 w-5 shrink-0" />
        </button>
      </div>

      <div aria-label="Lối tắt" className="bank-quick-actions">
        {data.quickActions.map((action: BankingQuickAction) => {
          const { icon: Icon, label } = actions[action];
          const enabled = action === 'vaults';
          return (
            <button key={action} type="button" disabled={!enabled} onClick={enabled ? onOpenVaults : undefined} aria-label={enabled ? label : `${label} · Không khả dụng`} className="flex min-h-[48px] min-w-[48px] flex-col items-center gap-2 rounded-[14px] py-2 text-center disabled:cursor-not-allowed disabled:opacity-40">
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#E5E7EB] bg-white text-[#B71C1C]"><Icon aria-hidden="true" className="h-6 w-6" /></span>
              <span className="w-full break-words text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
      <p role="status" className="text-ios-footnote text-[#6B7280]">{copyMessage}</p>
    </section>
  );
}

export function BankingProfile({ data }: { data: BankingData }) {
  return (
    <section aria-label="Thông tin tài khoản" className="m-4 rounded-[20px] border border-[#E5E7EB] bg-white p-5">
      <h2 className="mb-5 text-xl font-semibold">Tài khoản của tôi</h2>
      <dl className="space-y-5">
        <div><dt className="text-ios-footnote text-[#6B7280]">Số tài khoản</dt><dd className="bank-amount mt-1 break-words text-base font-semibold">{data.accountNumber || '-'}</dd></div>
        {data.tier && <div><dt className="text-ios-footnote text-[#6B7280]">Hạng hội viên</dt><dd className="mt-1 text-base font-semibold">{tierLabels[data.tier]}</dd></div>}
      </dl>
    </section>
  );
}
