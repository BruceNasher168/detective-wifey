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
    phone: '0988.456.234',
    department: 'Phòng Marketing Technosoft',
    section: 'A',
    avatarGradient: 'from-amber-400 to-orange-500',
    suspectName: 'Hương Đồng Nghiệp',
  },
  {
    id: 'c_bao_ve',
    name: 'Bác Bảo Vệ Chung Cư',
    department: 'Trực ca đêm sảnh B',
    section: 'B',
    avatarGradient: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'c_huong',
    name: 'Hương Marketing (Đã bị ẩn/Chặn)',
    department: 'Nhấn để quản lý liên lạc chặn',
    isBlocked: true,
    section: 'H',
    avatarGradient: 'from-rose-400 to-pink-600',
    suspectName: 'Hương Đồng Nghiệp',
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
    id: 'doc_01',
    fileName: 'Hop_dong_thue_nha_Chua_Lang.pdf',
    date: '14/10/2026',
    fileSize: '1.4 MB',
    description: 'Người thuê: Nguyen Huy Hoang • HĐ thuê phòng Chùa Láng',
    fileType: 'pdf',
    clueRefId: 'CLUE-ZOLA-07',
    suspectTag: 'Hương Đồng Nghiệp (Hợp đồng thuê phòng Chùa Láng)',
  },
  {
    id: 'doc_02',
    fileName: 'Bien_nhan_coc_can_ho_mini.jpg',
    date: '12/10/2026',
    fileSize: '840 KB',
    description: 'Đặt cọc phòng 402 Chùa Láng • 5.000.000 đ',
    fileType: 'jpg',
    clueRefId: 'CLUE-ZOLA-07',
    suspectTag: 'Hương Đồng Nghiệp (Biên nhận cọc căn hộ mini)',
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
    threadId: 'thread_hoa_mimosa',
    contactName: 'Tiệm Hoa Tươi Mimosa',
    avatarGradient: 'from-amber-400 to-orange-500',
    lastMessage: 'Tiệm Hoa: [Hình ảnh] Xác nhận đơn hàng',
    timestamp: '2 giờ',
    unreadCount: 5,
    isMuted: true,
    messages: [
      {
        id: 'hoa_1',
        sender: 'them',
        text: 'Tiệm Hoa Tươi Mimosa xin xác nhận đơn hàng hoa hồng sáp đỏ gửi tới sảnh toà Diamond tối nay!',
        time: '14:20',
      },
    ],
  },
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
