import { IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import type { AppCaseContext } from '../../../shared/contracts/app-contracts';
import { filterTransactions } from '../bankingData';
import { transactionEvidence } from '../bankingEvidence';
import type { BankingTransaction, TransactionFilter } from '../types';

interface BankingHistoryProps {
  caseData: AppCaseContext;
  transactions: BankingTransaction[];
  filter: TransactionFilter;
  onFilter: (filter: TransactionFilter) => void;
  onOpen: (transaction: BankingTransaction) => void;
  onEvidence: (item: UniversalEvidenceItem) => void;
}

const filters: { value: TransactionFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'inflow', label: 'Tiền vào (+)' },
  { value: 'outflow', label: 'Tiền ra (-)' },
];

export function BankingHistory({ caseData, transactions, filter, onFilter, onOpen, onEvidence }: BankingHistoryProps) {
  const visible = filterTransactions(transactions, filter);
  return (
    <section aria-label="Lịch sử giao dịch" className="p-4">
      <div aria-label="Bộ lọc giao dịch" className="mb-5 flex flex-wrap gap-2">
        {filters.map(({ value, label }) => <button type="button" key={value} onClick={() => onFilter(value)} aria-pressed={filter === value} className={`bank-control border px-3 text-ios-footnote font-semibold ${filter === value ? 'border-[#B71C1C] bg-[#B71C1C] text-white' : 'border-[#E5E7EB] bg-white text-[#111827]'}`}>{label}</button>)}
      </div>
      <div className="space-y-3">
        {visible.map(transaction => <StoryEvidenceTarget key={transaction.id} item={transactionEvidence(caseData, transaction)} onTriggerEvidence={onEvidence}>
          <button type="button" onClick={() => onOpen(transaction)} className="bank-control w-full min-h-[64px] rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-left">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${transaction.direction === 'inflow' ? 'bg-[#00A86B] text-[#111827]' : 'bg-[#F5F6F8] text-[#E53935]'}`}>{transaction.direction === 'inflow' ? <IoArrowDownOutline className="h-5 w-5" /> : <IoArrowUpOutline className="h-5 w-5" />}</span>
              <div className="min-w-0 flex-1">
                <p className="break-words text-base font-bold">{transaction.counterpartyName}</p>
                <p className="mt-1 break-words text-ios-footnote text-[#6B7280]">{transaction.timestamp}</p>
                <p className={`bank-amount mt-2 text-base font-bold ${transaction.direction === 'inflow' ? 'text-[#111827]' : 'text-[#B71C1C]'}`}>{transaction.formattedAmount}</p>
              </div>
            </div>
            {transaction.memo && <p className="mt-3 line-clamp-2 break-words rounded-lg bg-[#F5F6F8] p-3 text-base italic leading-relaxed">{transaction.memo}</p>}
          </button>
        </StoryEvidenceTarget>)}
      </div>
      {visible.length === 0 && <p role="status" className="py-10 text-center text-base text-[#6B7280]">{transactions.length ? 'Không có giao dịch phù hợp.' : 'Chưa có giao dịch.'}</p>}
    </section>
  );
}
