import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline, IoCallOutline, IoChevronBack, IoCloseCircleOutline } from 'react-icons/io5';
import { IoCall } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';
import { StoryEvidenceTarget } from '../../components/StoryEvidenceTarget';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../components/UniversalEvidenceModal';

export const CommsApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const commsData = caseData.appsData?.comms || {};
  const calls = commsData.calls || [];
  const [activeTab, setActiveTab] = useState<'calls' | 'sms'>('calls');
  const [evidenceItem, setEvidenceItem] = useState<UniversalEvidenceItem | null>(null);

  const swipeHandlers = useSwipeBack({ onBack: onReturnHome });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#FFFFFF] text-[#000000] select-none font-sans"
    >
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#007AFF] text-white shadow-md shrink-0">
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
          <IoCallOutline className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">Comms</h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('calls')}
          className={`flex-1 min-h-[44px] flex items-center justify-center text-xs font-bold transition-all border-b-2 ${
            activeTab === 'calls'
              ? 'border-[#007AFF] text-[#007AFF] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Nhật ký cuộc gọi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`flex-1 min-h-[44px] flex items-center justify-center text-xs font-bold transition-all border-b-2 ${
            activeTab === 'sms'
              ? 'border-[#007AFF] text-[#007AFF] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Tin nhắn SMS
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'calls' ? (
          calls.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#8E8E93]">
              Không có cuộc gọi nào.
            </div>
          ) : (
            calls.map((call: any) => (
              <StoryEvidenceTarget
                key={call.id}
                item={{
                  title: `Cuộc gọi: ${call.name}`,
                  subtitle: `${call.time} • ${call.duration} • ${call.type}`,
                  snippet: `Liên hệ: ${call.name}\nThời gian: ${call.time}\nThời lượng: ${call.duration}\nLoại cuộc gọi: ${call.type}`,
                  suspectToTag: call.suspectName || call.name,
                }}
                onTriggerEvidence={setEvidenceItem}
              >
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all min-h-[56px] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0">
                      {call.type === 'outgoing' && <IoArrowUpCircleOutline className="w-4 h-4 text-[#34C759]" />}
                      {call.type === 'incoming' && <IoArrowDownCircleOutline className="w-4 h-4 text-[#007AFF]" />}
                      {call.type === 'missed' && <IoCloseCircleOutline className="w-4 h-4 text-[#FF3B30]" />}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#000000] block truncate">
                        {call.name}
                      </span>
                      <span className="text-[10px] text-[#8E8E93]">
                        {call.time} • {call.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </StoryEvidenceTarget>
            ))
          )
        ) : (
          <StoryEvidenceTarget
            item={{
              title: 'Tin nhắn từ HOTEL_SEN_VANG',
              subtitle: 'Tổng đài SMS dịch vụ',
              snippet: 'HOTEL_SEN_VANG: "Cam on quy khach da dung bua toi tai Sen Vang Gourmet. Ban so 12, hoa don #882."',
              suspectToTag: 'Hương Đồng Nghiệp (Sen Vàng Gourmet)',
            }}
            onTriggerEvidence={setEvidenceItem}
          >
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 cursor-pointer hover:bg-slate-100/70 transition-all">
              <span className="font-bold text-slate-700 block">TỔNG ĐÀI TIN NHẮN</span>
              <p className="text-slate-600 leading-relaxed">
                HOTEL_SEN_VANG: "Cam on quy khach da dung bua toi tai Sen Vang Gourmet. Ban so 12, hoa don #882."
              </p>
            </div>
          </StoryEvidenceTarget>
        )}
      </main>

      {/* Universal Blurred Pop-up on Long Press */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'comms')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'comms',
  displayName: 'Comms',
  icon: IoCall,
  themeGradient: 'from-green-600 to-emerald-700',
  themeColor: '#007AFF',
  notificationBadgeCount: 2,
  isLocked: false,
  component: CommsApp,
};

export default CommsApp;

