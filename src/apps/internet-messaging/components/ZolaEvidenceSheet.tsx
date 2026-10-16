import React from 'react';
import { UniversalEvidenceModal } from '../../../features/investigation';
import type { EvidenceSource } from '../../../shared/contracts/evidence';

interface ZolaEvidenceSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  evidenceSnippet?: string;
  suspectToTag: string;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
  source?: EvidenceSource;
}

export const ZolaEvidenceSheet: React.FC<ZolaEvidenceSheetProps> = ({
  isOpen,
  title,
  subtitle,
  evidenceSnippet,
  suspectToTag,
  onPinEvidence,
  onClose,
  source,
}) => {
  return (
    <UniversalEvidenceModal
      isOpen={isOpen}
      item={
        isOpen
          ? {
              title,
              subtitle,
              snippet: evidenceSnippet || title,
              suspectToTag,
              source,
            }
          : null
      }
      onPinEvidence={onPinEvidence}
      onClose={onClose}
    />
  );
};

export default ZolaEvidenceSheet;
