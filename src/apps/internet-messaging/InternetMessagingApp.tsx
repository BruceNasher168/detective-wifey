import { useMotionState } from '../../shared/motion/useMotionState';
import React from 'react';
import { readMessagingData } from './data';
import { VirtualAppProps, AppDefinition } from '../../shared/contracts/app-contracts';
import type { EvidenceSource } from '../../shared/contracts/evidence';
import { IoChatbubbleOutline } from 'react-icons/io5';
import zolaIcon from './assets/zola-icon.svg';
import { ZolaTab, ZolaBottomNav } from './components/ZolaBottomNav';
import { ZolaInboxView } from './components/ZolaInboxView';
import { ZolaChatThreadView } from './components/ZolaChatThreadView';
import { ZolaContactsView } from './components/ZolaContactsView';
import { ZolaProfileView } from './components/ZolaProfileView';
import { ZolaDiscoverView } from './components/ZolaDiscoverView';
import { ZolaTimelineView } from './components/ZolaTimelineView';
import { ZolaMyDocumentsView } from './components/ZolaMyDocumentsView';
import { ZolaThread, ZolaContact, ZolaCloudDocument } from './types';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';

const DEFAULT_CONTACTS: ZolaContact[] = [
  {
    id: 'c_bach',
    name: 'Anh Bách QLDA - Ban Quản Lý Toà Nhà',
    department: 'Phòng 402 - Toà Diamond',
    section: 'A',
    avatarGradient: 'from-slate-500 to-slate-700',
  },
  {
    id: 'c_tuan',
    name: 'Anh Tuấn Thợ Điện',
    phone: '0988456234',
    department: 'Kỹ thuật toà nhà',
    section: 'A',
    avatarGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'c_bao_ve',
    name: 'Bác Bảo Vệ Chung Cư',
    department: 'Trực ca đêm sảnh B',
    section: 'B',
    avatarGradient: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'c_lan_anh',
    name: 'Lan Anh Kế Toán',
    department: 'Phòng Tài Chính Kế Toán',
    section: 'L',
    avatarGradient: 'from-teal-400 to-emerald-600',
  },
];

const DEFAULT_CLOUD_DOCS: ZolaCloudDocument[] = [
  {
    id: 'doc_hook',
    fileName: 'quy_uoc_hook.txt',
    date: '11/10/2026',
    fileSize: '1 KB',
    description: 'Quy ước đặt tên hook của nhóm',
    fileType: 'text',
    textMessage: 'Tên hook bắt đầu bằng use, theo camelCase. Ví dụ: useCart.',
  },
  {
    id: 'doc_03',
    fileName: 'Bang_luong_thang_9_CTY.xlsx',
    date: '05/10/2026',
    fileSize: '320 KB',
    description: 'Bảng lương nội bộ & KPI dự án Technosoft',
    fileType: 'xlsx',
  },
];

const DEFAULT_OTHER_THREADS: ZolaThread[] = [
  {
    threadId: 'thread_viettel',
    contactName: 'Viettel CSKH',
    avatarGradient: 'from-red-500 to-rose-600',
    lastMessage: 'Viettel: Quý khách được tặng 50% giá trị thẻ nạp...',
    timestamp: '1 ngày',
    unreadCount: 0,
    isMuted: true,
    messages: [
      {
        id: 'vtl_1',
        sender: 'them',
        text: 'Viettel thông báo: Quý khách được tặng 50% giá trị thẻ nạp khi nạp qua ZolaPay hôm nay.',
        time: '08:00',
      },
    ],
  },
];

export const InternetMessagingApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const messagingData = readMessagingData(
    caseData.appsData?.['internet-messaging'] || caseData.appsData?.zola,
  );

  const threads: ZolaThread[] = messagingData.threads || [];
  const otherThreads: ZolaThread[] =
    messagingData.otherThreads && messagingData.otherThreads.length > 0
      ? messagingData.otherThreads
      : DEFAULT_OTHER_THREADS;

  const contacts: ZolaContact[] =
    messagingData.contacts && messagingData.contacts.length > 0
      ? messagingData.contacts
      : DEFAULT_CONTACTS;

  const cloudDocuments: ZolaCloudDocument[] =
    messagingData.cloudDocuments && messagingData.cloudDocuments.length > 0
      ? messagingData.cloudDocuments
      : DEFAULT_CLOUD_DOCS;

  const currentUser = messagingData.currentUser || {
    name: 'Nguyễn Huy Hoàng',
    handle: 'hoang_tech88',
    avatarInitials: 'H',
    statusText: 'Đang làm việc...',
  };

  const [activeTab, setActiveTab] = useMotionState<ZolaTab>('messages', 'fade');
  const [selectedThreadId, setSelectedThreadId] = useMotionState<string | null>(null, 'navigation');
  const [showCloudDrawer, setShowCloudDrawer] = useMotionState(false, 'navigation');

  // Active chat thread if any
  const activeThread =
    threads.find((t) => t.threadId === selectedThreadId) ||
    otherThreads.find((t) => t.threadId === selectedThreadId);

  // Swipe Back Navigation Handler
  const handleBack = () => {
    if (showCloudDrawer) {
      setShowCloudDrawer(false);
    } else if (selectedThreadId) {
      setSelectedThreadId(null);
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  const handleTag = (suspectName: string, source?: EvidenceSource) => {
    onTagSuspect(suspectName, 'internet-messaging', source);
  };

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#FFFFFF] text-[#0F172A] select-none font-sans overflow-hidden min-h-[44px]"
    >
      {/* Viewport Content */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {selectedThreadId && activeThread ? (
          /* Screen 2: Active Chat Thread */
          <ZolaChatThreadView
            caseId={caseData.caseId}
            thread={activeThread}
            onBack={() => setSelectedThreadId(null)}
            onTagSuspect={handleTag}
          />
        ) : showCloudDrawer ? (
          /* Screen 3: My Documents (Chat-Style Stream UI) */
          <ZolaMyDocumentsView
            documents={cloudDocuments}
            onBack={() => setShowCloudDrawer(false)}
            onTagSuspect={handleTag}
          />
        ) : (
          /* Screens with Bottom Tab Bar */
          <>
            <div data-motion-content className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
              {activeTab === 'messages' && (
                <ZolaInboxView
                  caseId={caseData.caseId}
                  threads={threads}
                  otherThreads={otherThreads}
                  cloudDocuments={cloudDocuments}
                  onSelectThread={(id) => setSelectedThreadId(id)}
                  onTagSuspect={handleTag}
                  onReturnHome={onReturnHome}
                  onOpenMyDocuments={() => setShowCloudDrawer(true)}
                />
              )}

              {activeTab === 'contacts' && (
                <ZolaContactsView
                  contacts={contacts}
                  onTagSuspect={handleTag}
                  onReturnHome={onReturnHome}
                />
              )}

              {activeTab === 'discover' && (
                <ZolaDiscoverView
                  discoverData={messagingData.discoverData}
                  onTagSuspect={handleTag}
                />
              )}

              {activeTab === 'timeline' && (
                <ZolaTimelineView
                  timelinePosts={messagingData.timelinePosts}
                  onTagSuspect={handleTag}
                />
              )}

              {activeTab === 'profile' && (
                <ZolaProfileView
                  currentUser={currentUser}
                  cloudDocuments={cloudDocuments}
                  onOpenCloudDrawer={() => setShowCloudDrawer(true)}
                  onReturnHome={onReturnHome}
                  onTagSuspect={handleTag}
                />
              )}
            </div>

            {/* Bottom 5-Tab Bar */}
            <ZolaBottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              messageBadgeCount={[...threads, ...otherThreads].reduce((total, thread) => total + (thread.unreadCount ?? 0), 0)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  dataKeys: ['internet-messaging', 'zola'],
  appId: 'internet-messaging',
  displayName: 'Zola',
  icon: IoChatbubbleOutline,
  iconAsset: zolaIcon,
  themeGradient: 'from-blue-500 to-sky-600',
  themeColor: '#0088FF', bottomBarColor: '#FFFFFF',
  notificationBadgeCount: 4,
  isLocked: false,
  component: InternetMessagingApp,
};

export const ZolaApp = InternetMessagingApp;
export const LozaApp = InternetMessagingApp;
export default InternetMessagingApp;
