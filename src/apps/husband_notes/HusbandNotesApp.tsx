import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, FileText, Pin } from 'lucide-react';
import { IoDocumentText } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const HusbandNotesApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const notesData = caseData.appsData?.husband_notes || {};
  const notes = notesData.notes || [];

  const swipeHandlers = useSwipeBack({ onBack: onReturnHome });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#FFF9E6] text-[#202124] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#1A73E8] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Trang chủ"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Ghi chú của chồng</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
          <span>DANH SÁCH GHI CHÚ BÍ MẬT</span>
        </div>

        {notes.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#374151]">
            Không có ghi chú nào.
          </div>
        ) : (
          notes.map((note: any) => (
            <div
              key={note.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-[#E5E7EB] space-y-2 min-h-[64px]"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#202124]">{note.title}</h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#F9A825] text-[10px] font-bold">
                  Bảo mật
                </span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed font-mono whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="pt-2 border-t border-[#E5E7EB] flex justify-end">
                <button
                  type="button"
                  onClick={() => onTagSuspect('Ghi chú bí mật', 'husband_notes')}
                  className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>Ghim manh mối</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'husband_notes',
  displayName: 'Ghi chú',
  icon: IoDocumentText,
  themeGradient: 'from-amber-500 to-yellow-600',
  themeColor: '#1A73E8',
  notificationBadgeCount: 0,
  isLocked: false,
  component: HusbandNotesApp,
};

export default HusbandNotesApp;

