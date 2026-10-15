import React from 'react';
import { UniversalEvidenceModal } from '../../../components/UniversalEvidenceModal';

interface ZolaEvidenceSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  evidenceSnippet?: string;
  suspectToTag: string;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
}

export const ZolaEvidenceSheet: React.FC<ZolaEvidenceSheetProps> = ({
  isOpen,
  title,
  subtitle,
  evidenceSnippet,
  suspectToTag,
  onPinEvidence,
  onClose,
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
            }
          : null
      }
      onPinEvidence={onPinEvidence}
      onClose={onClose}
    />
  );
};

export default ZolaEvidenceSheet;
