import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition, AppId } from '../types/app-contracts';

/**
 * Standard Boilerplate for Virtual Parody Apps in Jealous Wife Detective Game.
 * Adheres strictly to the AppDefinition interface, SOLID principles, and app-design.md specifications.
 */

// Replace 'loza' with the target AppId (e.g. 'vietpay', 'poshee', etc.)
const CURRENT_APP_ID: AppId = 'loza';

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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // App-specific declarative data for the current case
  // Reads dynamically from CaseConfig; never hardcodes narrative or clues
  const appData = caseData.appsData?.[CURRENT_APP_ID] || {};

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-900 select-none">
      {/* App Header (Brand Theme & Back Button >= 44x44px) */}
      <header className="flex items-center justify-between px-4 h-14 bg-[var(--app-primary)] text-white shadow-sm shrink-0">
        <button
          type="button"
          onClick={activeView === 'detail' ? () => setActiveView('list') : onReturnHome}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] text-sm font-medium focus:outline-none"
          aria-label={activeView === 'detail' ? 'Back to list' : 'Return to Home'}
        >
          {activeView === 'detail' ? '‹ Quay lại' : '‹ Trang chủ'}
        </button>
        <h1 className="text-base font-bold truncate">App Name</h1>
        <div className="w-11" /> {/* Spacer for header balance */}
      </header>

      {/* Main App Content View */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeView === 'list' ? (
          <div>
            {/* List / Feed items */}
            <p className="text-xs text-slate-500 mb-2">Hộp thư / Danh sách</p>
            {/* Render declarative items */}
          </div>
        ) : (
          <div>
            {/* Detail / Forensic Inspection View */}
            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Tên đối tượng</span>
                {/* Tap-to-Tag Suspect Trigger */}
                <button
                  type="button"
                  onClick={() => onTagSuspect('Tên đối tượng', CURRENT_APP_ID)}
                  className="min-h-[44px] px-3 text-xs font-semibold text-rose-600 bg-rose-50 rounded border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all"
                >
                  + Ghim vào Sổ tay
                </button>
              </div>
              <p className="text-sm text-slate-700">Nội dung tin nhắn / chứng cứ...</p>
            </div>
          </div>
        )}
      </main>
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

