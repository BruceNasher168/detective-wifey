import { useMotionState } from '../../../shared/motion/useMotionState';
import React, { useState } from 'react';
import { IoAdd, IoChevronBack, IoCloudOutline, IoNotificationsOffOutline, IoQrCodeOutline, IoSearchOutline } from 'react-icons/io5';
import { ZolaThread, ZolaCloudDocument } from '../types';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { StoryEvidenceTarget } from '../../../features/investigation';

import type { EvidenceSource } from '../../../shared/contracts/evidence';

interface ZolaInboxViewProps {
  caseId?: string;
  threads: ZolaThread[];
  otherThreads?: ZolaThread[];
  cloudDocuments?: ZolaCloudDocument[];
  onSelectThread: (threadId: string) => void;
  onTagSuspect: (suspectName: string, source?: EvidenceSource) => void;
  onReturnHome: () => void;
  onOpenMyDocuments?: () => void;
}

export const ZolaInboxView: React.FC<ZolaInboxViewProps> = ({
  caseId,
  threads,
  otherThreads = [],
  cloudDocuments = [],
  onSelectThread,
  onTagSuspect,
  onReturnHome,
  onOpenMyDocuments,
}) => {
  const [activeTab, setActiveTab] = useMotionState<'priority' | 'other'>('priority', 'fade');
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceSheetThread, setEvidenceSheetThread] = useMotionState<ZolaThread | null>(null, 'sheet');

  const currentList = activeTab === 'priority' ? threads : otherThreads;

  // Filter threads by search query
  const filteredThreads = currentList.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.contactName.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q) ||
      (t.realIdentity && t.realIdentity.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#FFFFFF] text-[#0F172A] select-none font-sans overflow-hidden">
      {/* 1. Header (Electric Blue #0088FF) */}
      <header className="h-14 px-3 bg-[#0088FF] text-white flex items-center gap-2 shrink-0 shadow-sm z-10">
        <button
          type="button"
          onClick={onReturnHome}
          className="w-11 h-11 -ml-2 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg shrink-0"
          aria-label="Quay lại màn hình chính"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <div className="flex-1 h-9 bg-white/20 rounded-lg flex items-center px-2.5 gap-2 text-white">
          <IoSearchOutline className="w-4 h-4 text-white/80 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-full bg-transparent text-ios-subheadline text-white placeholder-white/80 outline-hidden"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg shrink-0"
          aria-label="Quét mã QR"
        >
          <IoQrCodeOutline className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg shrink-0"
          aria-label="Thêm cuộc trò chuyện mới"
        >
          <IoAdd className="w-5 h-5" />
        </button>
      </header>

      {/* 2. Sub-Header Filter Tabs (Ưu tiên / Khác) */}
      <div className="flex border-b border-slate-200 bg-white h-11 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('priority')}
          className={`flex-1 flex items-center justify-center text-ios-subheadline transition-all relative ${
            activeTab === 'priority'
              ? 'font-bold text-[#0F172A]'
              : 'font-normal text-[#666666] hover:text-[#0F172A]'
          }`}
        >
          <span>Ưu tiên</span>
          {activeTab === 'priority' && (
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#000000]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('other')}
          className={`flex-1 flex items-center justify-center text-ios-subheadline transition-all relative ${
            activeTab === 'other'
              ? 'font-bold text-[#0F172A]'
              : 'font-normal text-[#666666] hover:text-[#0F172A]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span>Khác</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          {activeTab === 'other' && (
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#000000]" />
          )}
        </button>
      </div>

      {/* 3. Main Chat Feed */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-slate-100">
        {/* Pinned Cloud của tôi (My Documents) entry item (Navigation link - zero long-press overlay) */}
        {activeTab === 'priority' && !searchQuery && onOpenMyDocuments && (
          <div
            onClick={onOpenMyDocuments}
            className="flex items-center gap-3 px-3.5 py-3 hover:bg-sky-50/70 active:bg-sky-100/70 transition-all cursor-pointer min-h-[72px] bg-sky-50/40"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <IoCloudOutline className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-semibold text-ios-headline text-[#000000] truncate">
                  Cloud của tôi (My Documents)
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-ios-footnote text-[#8A9098]">{cloudDocuments[0]?.time || cloudDocuments[0]?.date}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-ios-subheadline text-[#6B7280] truncate pr-2">
                  {cloudDocuments.length ? `${cloudDocuments[0].fileName} • ${cloudDocuments.length} tệp` : 'Chưa có tài liệu'}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-ios-subheadline text-[#8A9098]">
            Không có cuộc trò chuyện nào trong mục này.
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <StoryEvidenceTarget
              key={thread.threadId}
              item={{
                title: thread.contactName,
                subtitle: `Tin nhắn gần nhất: ${thread.timestamp}`,
                snippet: thread.lastMessage,
                suspectToTag: thread.contactName,
                source: caseId ? {
                  caseId,
                  recordId: thread.threadId,
                  title: thread.contactName,
                  snippet: thread.lastMessage,
                } : undefined,
              }}
              onTriggerEvidence={() => setEvidenceSheetThread(thread)}
            >
              <div
                onClick={() => onSelectThread(thread.threadId)}
                className="flex items-center gap-3 px-3.5 py-3 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer min-h-[72px]"
              >
                {/* Avatar (52px) */}
                <div
                  className={`w-[52px] h-[52px] rounded-full bg-gradient-to-br ${
                    thread.avatarGradient || 'from-sky-400 to-indigo-600'
                  } flex items-center justify-center text-white font-bold text-ios-body shadow-sm shrink-0`}
                >
                  {thread.contactName.charAt(0)}
                </div>

                {/* Chat Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-ios-headline text-[#000000] truncate">
                      {thread.contactName}
                    </span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="text-ios-footnote text-[#8A9098]">
                        {thread.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-ios-subheadline text-[#6B7280] truncate pr-2">
                      {thread.lastMessage}
                    </p>

                    <div className="shrink-0 flex items-center gap-1">
                      {thread.isMuted && (
                        <IoNotificationsOffOutline className="w-3.5 h-3.5 text-[#9E9E9E]" />
                      )}
                      {thread.unreadCount && thread.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF3B30] text-white text-ios-caption-2 font-bold flex items-center justify-center">
                          {thread.unreadCount > 5 ? '5+' : thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </StoryEvidenceTarget>
          ))
        )}
      </main>

      {/* Universal Evidence Sheet */}
      {evidenceSheetThread && (
        <ZolaEvidenceSheet
          isOpen={Boolean(evidenceSheetThread)}
          title={`Hồ sơ cuộc trò chuyện: ${evidenceSheetThread.contactName}`}
          subtitle={`Tin nhắn mới nhất: "${evidenceSheetThread.lastMessage}"`}
          evidenceSnippet={`Đối tượng: ${evidenceSheetThread.contactName} | Tin nhắn: "${
            evidenceSheetThread.lastMessage
          }" | Thời gian: ${evidenceSheetThread.timestamp}`}
          suspectToTag={evidenceSheetThread.contactName}
          source={caseId ? {
            caseId,
            recordId: evidenceSheetThread.threadId,
            title: evidenceSheetThread.contactName,
            snippet: evidenceSheetThread.lastMessage,
          } : undefined}
          onPinEvidence={(name) => onTagSuspect(name, caseId ? {
            caseId,
            recordId: evidenceSheetThread.threadId,
            title: evidenceSheetThread.contactName,
            snippet: evidenceSheetThread.lastMessage,
          } : undefined)}
          onClose={() => setEvidenceSheetThread(null)}
        />
      )}
    </div>
  );
};

