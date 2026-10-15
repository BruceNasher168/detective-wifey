import React from 'react';
import { IoChatbubbleEllipses, IoClose } from 'react-icons/io5';
import { NotificationToast } from '../../shared/contracts/case-schema';

interface NotificationBannerProps {
  toast: NotificationToast | null;
  onClose: () => void;
  onClick: (toast: NotificationToast) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  toast,
  onClose,
  onClick,
}) => {
  if (!toast) return null;

  return (
    <div
      onClick={() => onClick(toast)}
      className="absolute top-2 left-3 right-3 z-50 glass-toast-light rounded-2xl p-3 cursor-pointer shadow-xl transition-all duration-250 animate-slideDown select-none text-ios-label-primary"
      style={{ top: 'max(8px, env(safe-area-inset-top, 0px))' }}
      role="alert"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5 text-ios-caption-1 font-bold text-sky-800">
          <IoChatbubbleEllipses className="w-4 h-4 text-sky-600" />
          <span>{toast.senderTitle}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-ios-label-secondary hover:text-ios-label-primary transition-colors"
          aria-label="Đóng thông báo"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>

      <p className="text-ios-footnote font-medium text-ios-label-primary leading-snug">
        {toast.snippetBody}
      </p>
    </div>
  );
};

