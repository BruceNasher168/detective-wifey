import type { AppId } from '../../shared/contracts/app-contracts';
import type { EvidenceSource } from '../../shared/contracts/evidence';

export interface TaggedSuspect {
  suspectId: string;
  displayName: string;
  sourceApp: AppId;
  timestamp: number;
  evidence?: EvidenceSource;
}

/** Evidence records have source identity; legacy person tags retain name identity. */
export function tagSuspect(
  suspects: readonly TaggedSuspect[], name: string, appId: AppId,
  timestamp: number, evidence?: EvidenceSource,
): { suspects: TaggedSuspect[]; added: boolean } {
  if (suspects.some(suspect => evidence
    ? suspect.sourceApp === appId && suspect.evidence?.caseId === evidence.caseId
      && suspect.evidence.recordId === evidence.recordId
    : suspect.displayName === name)) {
    return { suspects: [...suspects], added: false };
  }
  return {
    added: true,
    suspects: [...suspects, {
      suspectId: `tag_${timestamp}`, displayName: name, sourceApp: appId, timestamp,
      ...(evidence ? { evidence } : {}),
    }],
  };
}
