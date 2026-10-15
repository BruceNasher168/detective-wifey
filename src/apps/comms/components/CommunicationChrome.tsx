import { useMotionState } from '../../../shared/motion/useMotionState';
import { type ReactNode } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { StoryEvidenceTarget, UniversalEvidenceModal, type UniversalEvidenceItem } from '../../../features/investigation';
import type { VirtualAppProps, AppId } from '../../../shared/contracts/app-contracts';
import type { NarrativeRecord } from '../data';

export function CommunicationHeader({ title, backLabel = 'Trang chủ', onBack }: { title: string; backLabel?: string; onBack: () => void }) {
  return <header className="communication-header"><button type="button" onClick={onBack}><IoChevronBack aria-hidden="true" />{backLabel}</button><h1>{title}</h1><span className="communication-header-spacer" /></header>;
}
export function useCommunicationEvidence(caseId: string, onTagSuspect: VirtualAppProps['onTagSuspect'], appId: AppId) {
  const [item, setItem] = useMotionState<UniversalEvidenceItem | null>(null, 'sheet');
  const wrap = (row: NarrativeRecord, title: string, snippet: string, children: ReactNode) => <StoryEvidenceTarget item={{
    title, snippet, suspectToTag: row.suspectName || title,
    source: { caseId: caseId, recordId: row.id, clueRefId: row.clueRefId || undefined, title, snippet },
  }} onTriggerEvidence={setItem}>{children}</StoryEvidenceTarget>;
  return { wrap, active: Boolean(item), modal: <UniversalEvidenceModal isOpen={Boolean(item)} item={item}
    onClose={() => setItem(null)} onPinEvidence={name => onTagSuspect(name, appId, item?.source)} /> };
}
export function EmptyState({ children }: { children: ReactNode }) { return <p className="communication-empty">{children}</p>; }
