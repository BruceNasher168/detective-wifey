import React from 'react';
import { ZolaCloudDocument } from '../types';
import { ZolaMyDocumentsView } from './ZolaMyDocumentsView';

interface ZolaCloudDocDrawerProps {
  isOpen: boolean;
  documents: ZolaCloudDocument[];
  onPinEvidence: (documentName: string) => void;
  onClose: () => void;
}

export const ZolaCloudDocDrawer: React.FC<ZolaCloudDocDrawerProps> = ({
  isOpen,
  documents,
  onPinEvidence,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#E5ECEF] flex flex-col overflow-hidden">
      <ZolaMyDocumentsView
        documents={documents}
        onBack={onClose}
        onTagSuspect={onPinEvidence}
      />
    </div>
  );
};

export default ZolaCloudDocDrawer;
