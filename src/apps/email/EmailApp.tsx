import { readAppData } from './data';
import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../shared/contracts/app-contracts';
import { IoChevronBack, IoMailOutline, IoStar } from 'react-icons/io5';
import { IoMail } from 'react-icons/io5';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';
import { StoryEvidenceTarget } from '../../features/investigation';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../features/investigation';

export const EmailApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const emailData = readAppData(caseData.appsData?.email || caseData.appsData?.geemail || {});
  const emails = emailData.emails || [];
  const [selectedMail, setSelectedMail] = useState<(typeof emails)[number] | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<UniversalEvidenceItem | null>(null);

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
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-ios-subheadline font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={selectedMail ? 'Quay lại' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{selectedMail ? 'Hộp thư' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoMailOutline className="w-5 h-5 text-white" />
          <h1 className="text-ios-headline font-bold tracking-tight">GeeMail</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-2">
        {selectedMail ? (
          <StoryEvidenceTarget
            item={{
              title: selectedMail.subject,
              subtitle: `${selectedMail.sender} • ${selectedMail.time || 'Hôm nay'}`,
              snippet: selectedMail.snippet,
              suspectToTag: selectedMail.suspectName || selectedMail.subject || 'Email chứng cứ',
            }}
            onTriggerEvidence={setEvidenceItem}
          >
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-3 cursor-pointer hover:bg-slate-50 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-ios-subheadline text-[#202124]">{selectedMail.subject}</h3>
                  <p className="text-ios-caption-1 text-[#5F6368] mt-0.5">{selectedMail.sender}</p>
                </div>
                <span className="text-ios-caption-2 text-slate-400">{selectedMail.time || 'Hôm nay'}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 text-ios-body text-[#3C4043] leading-relaxed whitespace-pre-wrap">
                {selectedMail.snippet}
              </div>
            </div>
          </StoryEvidenceTarget>
        ) : (
          <>
            <div className="flex items-center justify-between px-1 text-ios-caption-1 font-semibold text-[#5F6368]">
              <span>HỘP THƯ ĐẾN</span>
            </div>

            {emails.length === 0 ? (
              <div className="p-8 text-center text-ios-subheadline text-[#5F6368]">
                Hộp thư đến trống.
              </div>
            ) : (
              emails.map((mail) => (
                <StoryEvidenceTarget
                  key={mail.id}
                  item={{
                    title: mail.subject,
                    subtitle: `${mail.sender} • ${mail.time || 'Hôm nay'}`,
                    snippet: mail.snippet,
                    suspectToTag: mail.suspectName || mail.subject || 'Email chứng cứ',
                  }}
                  onTriggerEvidence={setEvidenceItem}
                >
                  <div
                    onClick={() => setSelectedMail(mail)}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all space-y-1.5 min-h-[72px]"
                  >
                    <div className="flex justify-between items-center text-ios-subheadline">
                      <span className="font-bold text-[#202124]">{mail.sender}</span>
                      <IoStar className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="font-semibold text-ios-footnote text-[#1A73E8]">{mail.subject}</h4>
                    <p className="text-ios-caption-1 text-[#5F6368] line-clamp-2">{mail.snippet}</p>
                  </div>
                </StoryEvidenceTarget>
              ))
            )}
          </>
        )}
      </main>

      {/* Universal Blurred Pop-up on Long Press */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'email')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  dataKeys: ['email', 'geemail'],
  appId: 'email',
  displayName: 'GeeMail',
  icon: IoMail,
  themeGradient: 'from-red-500 to-rose-600',
  themeColor: '#EA4335', bottomBarColor: '#FFFFFF',
  notificationBadgeCount: 4,
  isLocked: false,
  component: EmailApp,
};

export const GeemailApp = EmailApp;
export default EmailApp;

