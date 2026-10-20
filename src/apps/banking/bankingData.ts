import type { AppCaseContext } from '../../shared/contracts/app-contracts';
import type { BankingData, BankingQuickAction, BankingTransaction, BankingVault, MembershipTier, TransactionFilter } from './types';

const DEFAULT_QUICK_ACTIONS: BankingQuickAction[] = ['transfer', 'qr_pay', 'vaults', 'bills'];
const MEMBERSHIP_TIERS: MembershipTier[] = ['standard', 'inspire', 'priority', 'private'];
const DAY_MS = 86_400_000;
const money = new Intl.NumberFormat('vi-VN');

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function optionalText(value: unknown): string | undefined {
  return text(value) || undefined;
}

function amount(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value) ? `${money.format(value)} đ` : text(value);
}

function narrative(data: Record<string, unknown>) {
  return {
    suspectName: optionalText(data.suspectName),
    suspectId: optionalText(data.suspectId),
    clueRefId: optionalText(data.clueRefId),
  };
}

function absoluteTime(data: Record<string, unknown>): number | undefined {
  const timestamp = text(data.timestamp);
  if (/^\d{4}-\d{2}-\d{2}T/.test(timestamp)) {
    const time = Date.parse(timestamp);
    if (Number.isFinite(time)) return time;
  }
  const date = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text(data.date));
  const time = /^(\d{1,2}):(\d{2})/.exec(text(data.time));
  return date ? Date.UTC(Number(date[3]), Number(date[2]) - 1, Number(date[1]), Number(time?.[1] || 0), Number(time?.[2] || 0)) : undefined;
}

function transaction(data: Record<string, unknown>, index: number, anchor: number): BankingTransaction {
  const formatted = text(data.formattedAmount) || amount(data.amount);
  const direction = data.type === 'inflow' || data.type === 'outflow'
    ? data.type : /^\s*[-−]/.test(formatted) ? 'outflow' : 'inflow';
  const unsigned = formatted.replace(/^\s*[+−-]\s*/, '');
  const relativeDate = text(data.date).toLocaleLowerCase('vi');
  const daysAgo = relativeDate === 'hôm qua' ? 1 : Number(/^(\d+) ngày trước$/.exec(relativeDate)?.[1] || 0);
  const time = /^(\d{1,2}):(\d{2})/.exec(text(data.time));
  return {
    ...narrative(data),
    id: text(data.transactionId) || text(data.id) || `transaction-${index}`,
    direction,
    formattedAmount: unsigned ? `${direction === 'outflow' ? '-' : '+'} ${unsigned}` : '-',
    timestamp: text(data.timestamp) || [text(data.date), text(data.time)].filter(Boolean).join(' · ') || '-',
    sortTime: absoluteTime(data) ?? anchor - daysAgo * DAY_MS + Number(time?.[1] || 0) * 3_600_000 + Number(time?.[2] || 0) * 60_000,
    counterpartyName: text(data.counterpartyName) || text(data.beneficiary) || '-',
    counterpartyBank: optionalText(data.counterpartyBank),
    counterpartyAccount: optionalText(data.counterpartyAccount) || optionalText(data.beneficiaryAccount),
    reference: optionalText(data.reference) || optionalText(data.referenceNumber),
    status: optionalText(data.status),
    memo: text(data.memo),
    category: optionalText(data.category),
  };
}

function vault(data: Record<string, unknown>, index: number): BankingVault {
  const id = text(data.vaultId) || text(data.id) || `vault-${index}`;
  return {
    ...narrative(data),
    id,
    name: text(data.vaultName) || text(data.name) || '-',
    currentAmount: amount(data.currentAmount) || '-',
    details: optionalText(data.details),
    targetAmount: amount(data.targetAmount) || '-',
    lockChallengeId: optionalText(data.lockChallengeId),
    deposits: (Array.isArray(data.depositHistory) ? data.depositHistory : []).map((value: unknown, depositIndex: number) => {
      const deposit = record(value);
      return {
        ...narrative(deposit),
        id: text(deposit.id) || `${id}:deposit-${depositIndex}`,
        date: text(deposit.date) || '-',
        amount: amount(deposit.amount) || '-',
        note: text(deposit.note),
      };
    }),
  };
}

/** Normalize both the existing case JSON and the approved banking data contract. */
export function readBankingData(value: unknown): BankingData | null {
  const data = record(value);
  if (Object.keys(data).length === 0) return null;
  const rows = (Array.isArray(data.transactions) ? data.transactions : []).map(record);
  const dates = rows.map(absoluteTime).filter((value): value is number => value !== undefined);
  const anchor = dates.length ? Math.floor(Math.max(...dates) / DAY_MS) * DAY_MS : 0;
  const configured: BankingQuickAction[] = Array.isArray(data.quickActions)
    ? data.quickActions.filter((value: unknown): value is BankingQuickAction => DEFAULT_QUICK_ACTIONS.includes(value as BankingQuickAction)) : [];
  return {
    accountNumber: text(data.accountNumber),
    maskedBalance: text(data.maskedBalance) || '•••••••• đ',
    actualBalance: text(data.actualBalance) || text(data.balance) || '-',
    tier: MEMBERSHIP_TIERS.includes(data.tier as MembershipTier) ? data.tier as MembershipTier : undefined,
    unreadCount: typeof data.unreadBadge === 'number' && Number.isFinite(data.unreadBadge) ? Math.max(0, Math.floor(data.unreadBadge)) : 0,
    isAppLocked: data.isAppLocked === true,
    lockChallengeId: optionalText(data.lockChallengeId),
    quickActions: [...new Set([...configured, ...DEFAULT_QUICK_ACTIONS])].slice(0, DEFAULT_QUICK_ACTIONS.length),
    transactions: rows.map((row, index) => transaction(row, index, anchor)).sort((a, b) => b.sortTime - a.sortTime),
    vaults: (Array.isArray(data.vaults) ? data.vaults : []).map((value: unknown, index: number) => vault(record(value), index)),
  };
}

export function filterTransactions(transactions: BankingTransaction[], filter: TransactionFilter): BankingTransaction[] {
  return filter === 'all' ? transactions : transactions.filter(transaction => transaction.direction === filter);
}

export function bankingAppChallenge(caseData: AppCaseContext, data: BankingData): AppCaseContext['lockChallenges'][number] | undefined {
  if (caseData.levelNumber === 1) return undefined;
  return caseData.lockChallenges.find(challenge =>
    challenge.challengeId === data.lockChallengeId ||
    (challenge.targetType === 'app' && challenge.targetId === 'banking'),
  );
}

export function bankingVaultChallenge(caseData: AppCaseContext, vault: BankingVault): AppCaseContext['lockChallenges'][number] | undefined {
  if (caseData.levelNumber === 1) return undefined;
  return caseData.lockChallenges.find(challenge =>
    challenge.challengeId === vault.lockChallengeId ||
    ((challenge.targetType as string) === 'vault' && challenge.targetId === vault.id),
  );
}
