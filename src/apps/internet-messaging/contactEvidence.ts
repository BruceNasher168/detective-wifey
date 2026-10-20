import type { EvidenceSource } from '../../shared/contracts/evidence';
import type { MessagingContact } from './types';

export function contactEvidence(caseId: string, contact: MessagingContact): EvidenceSource {
  return {
    caseId,
    recordId: contact.id,
    kind: 'person',
    visibleAlias: contact.name,
    title: contact.name,
    snippet: [contact.phone && `SĐT: ${contact.phone}`, contact.department].filter(Boolean).join(' • '),
  };
}
