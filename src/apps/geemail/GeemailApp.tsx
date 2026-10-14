import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, Mail, Pin, Star } from 'lucide-react';
import { IoMail } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const GeemailApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const geemailData = caseData.appsData?.geemail || {};
  const emails = geemailData.emails || [];
  const [selectedMail, setSelectedMail] = useState<any | null>(null);

  const handleBack = () => {
    if (selectedMail) {
      setSelectedMail(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#FFFFFF] text-[#202124] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#EA4335] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedMail ? 'Quay lại' : 'Trang chủ'}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{selectedMail ? 'Hộp thư' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">GeeMail</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-2">
        {selectedMail ? (
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-[#202124]">{selectedMail.subject}</h3>
                <p className="text-xs text-[#5F6368] mt-0.5">{selectedMail.sender}</p>
              </div>
              <span className="text-[10px] text-slate-400">{selectedMail.time || 'Hôm nay'}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-[#3C4043] leading-relaxed whitespace-pre-wrap">
              {selectedMail.snippet}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => onTagSuspect(selectedMail.subject || 'Email chứng cứ', 'geemail')}
                className="flex items-center gap-1.5 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold active:scale-95 transition-all"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>Ghim email chứng cứ</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#5F6368]">
              <span>HỘP THƯ ĐẾN</span>
            </div>

            {emails.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#5F6368]">
                Hộp thư đến trống.
              </div>
            ) : (
              emails.map((mail: any) => (
                <div
                  key={mail.id}
                  onClick={() => setSelectedMail(mail)}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all space-y-1.5 min-h-[72px]"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#202124]">{mail.sender}</span>
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#1A73E8]">{mail.subject}</h4>
                  <p className="text-[11px] text-[#5F6368] line-clamp-2">{mail.snippet}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagSuspect('Email chứng cứ', 'geemail');
                      }}
                      className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>Ghim email</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'geemail',
  displayName: 'GeeMail',
  icon: IoMail,
  themeGradient: 'from-red-500 to-rose-600',
  themeColor: '#EA4335',
  notificationBadgeCount: 4,
  isLocked: false,
  component: GeemailApp,
};

export default GeemailApp;

