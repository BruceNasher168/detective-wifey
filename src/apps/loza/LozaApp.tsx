import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, MessageCircle, Pin, ShieldAlert } from 'lucide-react';

export const LozaApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const lozaData = caseData.appsData?.loza || {};
  const threads = lozaData.threads || [];
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const activeThread = threads.find((t: any) => t.threadId === selectedThreadId);

  return (
    <div className="flex flex-col h-full w-full bg-[#F3F6F8] text-[#1A202C] select-none font-sans">
      {/* Brand Header */}
      <header className="flex items-center justify-between px-3 h-14 bg-[#0E828A] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={activeThread ? () => setSelectedThreadId(null) : onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label={activeThread ? 'Quay lại danh sách' : 'Trang chủ'}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{activeThread ? 'Tin nhắn' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#00C97B]" />
          <h1 className="text-base font-bold tracking-tight">
            {activeThread ? activeThread.contactName : 'LoZa'}
          </h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {!activeThread ? (
          /* Threads List */
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#718096]">
              <span>TIN NHẮN GẦN ĐÂY</span>
              <span className="text-[#0E828A]">Đã kết nối</span>
            </div>

            {threads.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#718096]">
                Không có cuộc trò chuyện mới nào.
              </div>
            ) : (
              threads.map((thread: any) => (
                <div
                  key={thread.threadId}
                  onClick={() => setSelectedThreadId(thread.threadId)}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all min-h-[64px]"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${thread.avatarGradient || 'from-teal-400 to-emerald-600'} flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0`}>
                    {thread.contactName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-sm text-[#1A202C] truncate">
                        {thread.contactName}
                      </span>
                      <span className="text-[11px] text-[#718096] shrink-0">
                        {thread.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#718096] truncate">
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF5722] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Thread Chat View */
          <div className="flex flex-col h-full space-y-3">
            {activeThread.isDisguised && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold mb-0.5">Dấu hiệu ngụy trang liên hệ:</div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Tên hiển thị là "{activeThread.contactName}" nhưng nội dung mang sắc thái hẹn hò mờ ám!
                  </p>
                </div>
              </div>
            )}

            {/* Suspect Tagging Quick Action */}
            {activeThread.realIdentity && (
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs">
                  <span className="text-[#718096]">Phát hiện đối tượng: </span>
                  <strong className="text-[#0E828A]">{activeThread.realIdentity}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => onTagSuspect(activeThread.realIdentity, 'loza')}
                  className="flex items-center gap-1.5 min-h-[44px] px-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>+ Ghim Sổ Tay</span>
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 space-y-2.5 pt-2">
              {activeThread.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'me'
                        ? 'bg-[#E0F7FA] text-[#1A202C] rounded-br-xs border border-teal-100'
                        : 'bg-white text-[#1A202C] rounded-bl-xs border border-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#718096] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'loza',
  displayName: 'LoZa',
  icon: MessageCircle,
  themeGradient: 'from-sky-500 to-teal-600',
  themeColor: '#0E828A',
  notificationBadgeCount: 3,
  isLocked: false,
  component: LozaApp,
};

export default LozaApp;

