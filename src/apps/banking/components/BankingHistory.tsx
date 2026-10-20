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
    <section aria-label="Lịch sử giao dịch" className="p-3">
      <div aria-label="Bộ lọc giao dịch" className="mb-3 flex flex-wrap gap-1.5">
        {filters.map(({ value, label }) => (
          <button
            type="button"
            key={value}
            onClick={() => onFilter(value)}
            aria-pressed={filter === value}
            className={`bank-control border px-3 text-ios-footnote font-semibold ${
              filter === value
                ? 'border-[#B71C1C] bg-[#B71C1C] text-white'
                : 'border-[#E5E7EB] bg-white text-[#111827]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        {visible.map(transaction => (
          <StoryEvidenceTarget
            key={transaction.id}
            item={transactionEvidence(caseData, transaction)}
            onTriggerEvidence={onEvidence}
          >
            <button
              type="button"
              onClick={() => onOpen(transaction)}
              className="bank-control w-full min-h-[48px] rounded-[14px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-left"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      transaction.direction === 'inflow'
                        ? 'bg-[#00A86B] text-white'
                        : 'bg-[#F5F6F8] text-[#E53935]'
                    }`}
                  >
                    {transaction.direction === 'inflow' ? (
                      <IoArrowDownOutline className="h-4 w-4" />
                    ) : (
                      <IoArrowUpOutline className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-base font-bold leading-tight text-[#111827]">
                      {transaction.counterpartyName}
                    </p>
                    <p className="mt-0.5 break-words text-ios-footnote text-[#6B7280]">
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`bank-amount text-base font-bold leading-tight ${
                      transaction.direction === 'inflow' ? 'text-[#00A86B]' : 'text-[#B71C1C]'
                    }`}
                  >
                    {transaction.formattedAmount}
                  </p>
                </div>
              </div>
              {transaction.memo && (
                <p className="mt-2 line-clamp-1 break-words rounded-md bg-[#F5F6F8] px-2.5 py-1 text-base italic text-[#4B5563]">
                  {transaction.memo}
                </p>
              )}
            </button>
          </StoryEvidenceTarget>
        ))}
      </div>
      {visible.length === 0 && (
        <p role="status" className="py-10 text-center text-base text-[#6B7280]">
          {transactions.length ? 'Không có giao dịch phù hợp.' : 'Chưa có giao dịch.'}
        </p>
      )}
    </section>
  );
}
