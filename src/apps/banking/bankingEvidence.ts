import type { CaseConfig } from '../../types/case-schema';
import type { UniversalEvidenceItem } from '../../components/UniversalEvidenceModal';
import type { BankingNarrative, BankingTransaction } from './types';

export function bankingEvidence(
  caseData: CaseConfig,
  record: BankingNarrative,
  title: string,
  snippet: string,
  subtitle?: string,
  accountParty: string = caseData.husbandName,
): UniversalEvidenceItem {
  const suspect = caseData.suspectPool.find(suspect => suspect.suspectId === record.suspectId);
  return {
    title,
    snippet,
    subtitle,
    suspectToTag: record.suspectName || suspect?.displayName || accountParty,
    source: {
      caseId: caseData.caseId,
      recordId: record.id,
      clueRefId: record.clueRefId,
      title,
      snippet,
    },
  };
}

export function transactionEvidence(caseData: CaseConfig, transaction: BankingTransaction): UniversalEvidenceItem {
  return bankingEvidence(
    caseData,
    transaction,
    `Giao dịch: ${transaction.counterpartyName}`,
    `${transaction.formattedAmount}\n${transaction.timestamp}\n${transaction.counterpartyName}\n${transaction.memo}`,
    transaction.reference || transaction.timestamp,
    transaction.counterpartyName === '—' ? '' : transaction.counterpartyName,
  );
}
