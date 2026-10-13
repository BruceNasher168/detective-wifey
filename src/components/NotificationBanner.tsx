import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { NotificationToast } from '../types/case-schema';

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
      className="absolute top-2 left-3 right-3 z-50 glass-toast-light rounded-2xl p-3 cursor-pointer shadow-xl transition-all duration-250 animate-slideDown select-none text-[#0F172A]"
      role="alert"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
          <MessageCircle className="w-4 h-4 text-sky-600" />
          <span>{toast.senderTitle}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs font-medium text-slate-800 leading-snug">
        {toast.snippetBody}
      </p>
    </div>
  );
};

