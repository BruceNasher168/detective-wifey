import React from 'react';
import { MessagingCloudDocument } from '../types';
import { MessagingMyDocumentsView } from './MessagingMyDocumentsView';

interface MessagingCloudDocDrawerProps {
  isOpen: boolean;
  documents: MessagingCloudDocument[];
  onPinEvidence: (documentName: string) => void;
  onClose: () => void;
}

export const MessagingCloudDocDrawer: React.FC<MessagingCloudDocDrawerProps> = ({
  isOpen,
  documents,
  onPinEvidence,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#E5ECEF] flex flex-col overflow-hidden">
      <MessagingMyDocumentsView
        documents={documents}
        onBack={onClose}
        onTagSuspect={onPinEvidence}
      />
    </div>
  );
};

export const ZolaCloudDocDrawer = MessagingCloudDocDrawer;
export default MessagingCloudDocDrawer;
