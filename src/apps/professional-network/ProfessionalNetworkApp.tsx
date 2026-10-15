import { useMotionState } from '../../shared/motion/useMotionState';
import { readAppData } from './data';
import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../shared/contracts/app-contracts';
import { IoChevronBack, IoRibbonOutline } from 'react-icons/io5';
import { IoBriefcase } from 'react-icons/io5';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';
import { StoryEvidenceTarget } from '../../features/investigation';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../features/investigation';

export const ProfessionalNetworkApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const networkData = readAppData(caseData.appsData?.['professional-network'] || caseData.appsData?.inkedlin || {});
  const posts = networkData.posts || [];
  const [evidenceItem, setEvidenceItem] = useMotionState<UniversalEvidenceItem | null>(null, 'sheet');

  const swipeHandlers = useSwipeBack({ onBack: onReturnHome });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#F3F2F0] text-[#191919] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#0A66C2] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Trang chủ"
        >
          <IoChevronBack className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>
        <div className="flex items-center gap-2">
          <IoRibbonOutline className="w-5 h-5 text-white" />
          <h1 className="text-ios-headline font-bold tracking-tight">InkedLin</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between px-1 text-ios-caption-1 font-semibold text-[#666666]">
          <span>BẢNG TIN NGHỀ NGHIỆP</span>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 text-center text-ios-subheadline text-[#666666]">
            Không có bài đăng mới.
          </div>
        ) : (
          posts.map((post) => (
            <StoryEvidenceTarget
              key={post.id}
              item={{
                title: `Bài đăng: ${post.author}`,
                subtitle: post.time || 'InkedLin',
                snippet: post.content,
                suspectToTag: post.suspectName || 'Kỷ niệm 5 năm (1509)',
              }}
              onTriggerEvidence={setEvidenceItem}
            >
              <div
                className="p-4 bg-white rounded-xl shadow-sm border border-[#E0E0E0] space-y-2 min-h-[64px] cursor-pointer hover:bg-blue-50/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-ios-subheadline text-[#191919]">{post.author}</h4>
                    <span className="text-ios-caption-2 text-[#666666]">{post.time}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#B27B00] text-ios-caption-2 font-bold">
                    Kỷ niệm 5 năm
                  </span>
                </div>
                <p className="text-ios-footnote text-[#191919] leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </StoryEvidenceTarget>
          ))
        )}
      </main>

      {/* Universal Blurred Pop-up on Long Press */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'professional-network')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  dataKeys: ['professional-network', 'inkedlin'],
  appId: 'professional-network',
  displayName: 'InkedLin',
  icon: IoBriefcase,
  themeGradient: 'from-blue-700 to-indigo-800',
  themeColor: '#0A66C2', bottomBarColor: '#F3F2F0',
  notificationBadgeCount: 1,
  isLocked: false,
  component: ProfessionalNetworkApp,
};

export const InkedlinApp = ProfessionalNetworkApp;
export default ProfessionalNetworkApp;
