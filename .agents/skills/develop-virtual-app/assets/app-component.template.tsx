import React, { useState } from 'react';
import { record, records, textFields } from '../../shared/data/read';
import { VirtualAppProps, AppDefinition, AppId } from '../../shared/contracts/app-contracts';
import { IoChevronBack, IoDocumentTextOutline } from 'react-icons/io5';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';
import { StoryEvidenceTarget } from '../../features/investigation';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../features/investigation';

/**
 * Standard Boilerplate for Virtual Parody Apps in Jealous Wife Detective Game.
 * Adheres strictly to the AppDefinition interface, SOLID principles, canonical Ionicons,
 * and the Universal Forensic Long-Press Invariant (Story Narrative Data Only).
 */

// Replace 'zola' with the target AppId (e.g. 'vietpay', 'poshee', etc.)
const CURRENT_APP_ID: AppId = 'zola';

// NOTE: Replace APP_ID, DISPLAY_NAME, THEME_COLOR, and styles with values from:
// .agent-artifacts/project-knowledge-base/solution-context/apps/<appId>/app-design.md
export const ParodyApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
  onRequestUnlock,
  unlockedChallenges,
}) => {
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list');
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string; snippet: string; suspectName?: string } | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<UniversalEvidenceItem | null>(null);

  // App-specific declarative data for the active level
  // Reads from the public app context; never hardcodes narrative or clues
  // Replace this adapter body with the target app's own normalized data contract.
  const appData = record(caseData.appsData?.[CURRENT_APP_ID]);
  const items = records(appData.items).map(item => textFields(item, ['id', 'title', 'subtitle', 'snippet', 'suspectName'] as const));

  const handleBack = () => {
    if (activeView === 'detail' || selectedItem) {
      setActiveView('list');
      setSelectedItem(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-slate-50 text-slate-900 select-none font-sans"
    >
      {/* App Header (Brand Theme & Back Button >= 44x44px) - Pure navigation chrome, zero long-press overlay */}
      <header className="flex items-center justify-between px-3 h-14 bg-[var(--app-primary)] text-white shadow-sm shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={activeView === 'detail' ? 'Quay lại' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{activeView === 'detail' ? 'Quay lại' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoDocumentTextOutline className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold truncate">App Name</h1>
        </div>
        <div className="w-11" /> {/* Spacer for header balance */}
      </header>

      {/* Main App Content View */}
      <main className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeView === 'list' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
              <span>DANH SÁCH</span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Không có dữ liệu mới.
              </div>
            ) : (
              items.map((item) => (
                /* Universal Long-Press Target strictly on Story Narrative Data */
                <StoryEvidenceTarget
                  key={item.id}
                  item={{
                    title: item.title,
                    subtitle: item.subtitle,
                    snippet: item.snippet || item.title,
                    suspectToTag: item.suspectName || item.title,
                  }}
                  onTriggerEvidence={setEvidenceItem}
                >
                  <div
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveView('detail');
                    }}
                    className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all space-y-1 min-h-[56px]"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] text-slate-400">Nhấn giữ</span>
                    </div>
                    {item.snippet && (
                      <p className="text-xs text-slate-600 line-clamp-2">{item.snippet}</p>
                    )}
                  </div>
                </StoryEvidenceTarget>
              ))
            )}
          </div>
        ) : (
          /* Detail / Inspection View */
          selectedItem && (
            <StoryEvidenceTarget
              item={{
                title: selectedItem.title,
                subtitle: selectedItem.subtitle,
                snippet: selectedItem.snippet || selectedItem.title,
                suspectToTag: selectedItem.suspectName || selectedItem.title,
              }}
              onTriggerEvidence={setEvidenceItem}
            >
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-3 cursor-pointer hover:bg-slate-50/70 transition-all">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">{selectedItem.title}</h3>
                  <span className="text-[10px] text-slate-400">Nhấn giữ</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.snippet || selectedItem.content}
                </p>
              </div>
            </StoryEvidenceTarget>
          )
        )}
      </main>

      {/* Universal Blurred Pop-up on Long Press - Zero Physical Pin Buttons in Normal UI */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, CURRENT_APP_ID)}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: CURRENT_APP_ID,
  displayName: '<AppDisplayName>',
  iconAsset: `/assets/apps/${CURRENT_APP_ID}-icon.svg`,
  themeColor: '#0E828A', // From app-design.md
  isLocked: false,
  component: ParodyApp,
};

export default ParodyApp;
