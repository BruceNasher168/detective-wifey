import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import type { AppCaseContext } from '../../../shared/contracts/app-contracts';
import { transactionEvidence } from '../bankingEvidence';
import type { BankingTransaction } from '../types';

const categoryLabels: Record<string, string> = {
  transfer: 'Chuyển tiền', salary: 'Lương', utility: 'Hóa đơn', dining: 'Ăn uống', hotel: 'Khách sạn',
};

interface BankingReceiptProps {
  caseData: AppCaseContext;
  transaction: BankingTransaction;
  onClose: () => void;
  onEvidence: (item: UniversalEvidenceItem) => void;
  evidenceOpen: boolean;
}

export function BankingReceipt({ caseData, transaction, onClose, onEvidence, evidenceOpen }: BankingReceiptProps) {
  const fields = [
    [transaction.direction === 'inflow' ? 'Người gửi' : 'Người nhận', transaction.counterpartyName],
    ['Ngân hàng đối tác', transaction.counterpartyBank],
    ['Số tài khoản đối tác', transaction.counterpartyAccount],
    ['Thời gian', transaction.timestamp],
    ['Mã giao dịch', transaction.reference],
    ['Loại giao dịch', transaction.category && (categoryLabels[transaction.category] || transaction.category)],
  ];
  return (
    <BottomSheet title="Biên lai giao dịch" onClose={onClose} suspended={evidenceOpen}>
      <StoryEvidenceTarget item={transactionEvidence(caseData, transaction)} onTriggerEvidence={onEvidence}>
        <div className="py-4">
          <p className="bank-amount text-center text-[1.75rem] font-bold">{transaction.formattedAmount}</p>
          {transaction.status && <p className="mt-2 text-center text-base">{transaction.status}</p>}
        </div>
        <dl className="space-y-4 border-y border-dashed border-[#E5E7EB] py-5">
          {fields.map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-x-5 gap-y-1">
            <dt className="text-ios-footnote text-[#6B7280]">{label}</dt><dd className="bank-amount max-w-full break-words text-base font-medium">{value || '—'}</dd>
          </div>)}
        </dl>
        <div className="py-5">
          <h3 className="text-ios-footnote font-semibold text-[#6B7280]">Lời nhắn</h3>
          <p className="mt-2 whitespace-pre-wrap break-words rounded-[14px] bg-[#F5F6F8] p-4 text-base leading-relaxed">{transaction.memo || '—'}</p>
        </div>
      </StoryEvidenceTarget>
    </BottomSheet>
  );
}
