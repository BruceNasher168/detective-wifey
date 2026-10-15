import React, { useState } from 'react';
import { IoCallOutline, IoCheckmark, IoCheckmarkDone, IoChevronBack, IoEllipsisHorizontal, IoEllipsisVertical, IoHappyOutline, IoImageOutline, IoLocation, IoMicOutline, IoTimeOutline, IoVideocamOutline } from 'react-icons/io5';
import { ZolaThread } from '../types';
import { ZolaLocationModal } from './ZolaLocationModal';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { useSwipeBack } from '../../../hooks/useSwipeBack';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';
import { UniversalEvidenceItem } from '../../../components/UniversalEvidenceModal';

interface ZolaChatThreadViewProps {
  thread: ZolaThread;
  onBack: () => void;
  onTagSuspect: (suspectName: string) => void;
}

export const ZolaChatThreadView: React.FC<ZolaChatThreadViewProps> = ({
  thread,
  onBack,
  onTagSuspect,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    venueName: string;
    address: string;
    time?: string;
  } | null>(null);

  const [evidenceSheetItem, setEvidenceSheetItem] = useState<UniversalEvidenceItem | null>(null);

  // Swipe back to inbox
  const swipeHandlers = useSwipeBack({
    onBack: () => {
      onBack();
    },
  });

  return (
    <div
      {...swipeHandlers}
      className="relative flex flex-col h-full w-full bg-[#E5EBF0] text-[#0F172A] select-none font-sans overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-2 h-14 bg-[#0088FF] text-white shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Quay lại danh sách chat"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>

          {/* Contact Details (Story Data - long press to inspect/pin) */}
          <StoryEvidenceTarget
            item={{
              title: `Hồ sơ liên hệ: ${thread.contactName}`,
              snippet: `Liên hệ: ${thread.contactName}`,
              suspectToTag: thread.contactName,
              subtitle: 'Thông tin người liên hệ Zola',
            }}
            onTriggerEvidence={setEvidenceSheetItem}
            className="flex items-center gap-2 min-w-0 flex-1 ml-1 cursor-pointer"
          >
            {/* Contact Avatar */}
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                thread.avatarGradient || 'from-sky-400 to-blue-600'
              } flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}
            >
              {thread.contactName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold truncate text-white leading-tight">
                {thread.contactName}
              </h2>
              <p className="text-xs text-white/85 truncate">
                Bấm để xem thông tin
              </p>
            </div>
          </StoryEvidenceTarget>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Gọi thoại"
          >
            <IoCallOutline className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Gọi video"
          >
            <IoVideocamOutline className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Tuỳ chọn cuộc trò chuyện"
          >
            <IoEllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Disappearing Messages Notice (CLUE-ZOLA-03) */}
      {(thread.systemBanner || thread.isDisguised) && (
        <StoryEvidenceTarget
          item={{
            title: 'Cài đặt tự xoá tin nhắn (CLUE-ZOLA-03)',
            snippet: thread.systemBanner || 'Tin nhắn tự xoá sau 24 giờ đã được bật',
            suspectToTag: thread.contactName,
            subtitle: 'Tính năng bảo mật cuộc trò chuyện Zola',
          }}
          onTriggerEvidence={setEvidenceSheetItem}
        >
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer">
            <IoTimeOutline className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium text-center">
              {thread.systemBanner || 'Tin nhắn tự xoá sau 24 giờ đã được bật'}
            </span>
          </div>
        </StoryEvidenceTarget>
      )}

      {/* Messages Canvas */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3">
        {/* Floating Date Badge */}
        <div className="flex justify-center my-1">
          <span className="px-3 py-0.5 rounded-full bg-[#B4B9BF] text-white text-[11px] font-medium shadow-xs">
            Hôm nay, 14 tháng 10
          </span>
        </div>

        {thread.messages.map((msg) => {
          const isMe = msg.sender === 'me';

          // Interactive Location Pin Card (CLUE-ZOLA-04)
          if (msg.type === 'location' && msg.locationData) {
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <StoryEvidenceTarget
                  item={{
                    title: `Vị trí: ${msg.locationData.venueName}`,
                    snippet: `${msg.locationData.venueName}\nĐịa chỉ: ${msg.locationData.address}`,
                    suspectToTag: thread.contactName,
                    subtitle: 'Vị trí chia sẻ qua Zola (CLUE-ZOLA-04)',
                  }}
                  onTriggerEvidence={setEvidenceSheetItem}
                  className="max-w-[85%]"
                >
                  <div
                    onClick={() => {
                      setSelectedLocation({
                        venueName: msg.locationData!.venueName,
                        address: msg.locationData!.address,
                        time: msg.time,
                      });
                    }}
                    className="w-full bg-white rounded-2xl rounded-bl-xs border border-slate-200 shadow-sm p-3 cursor-pointer hover:border-[#0088FF] transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs mb-1.5">
                      <IoLocation className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{msg.text || 'Vị trí hiện tại'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                      <h4 className="text-xs font-bold text-[#0F172A]">
                        {msg.locationData.venueName}
                      </h4>
                      <p className="text-[11px] text-[#64748B] leading-tight">
                        {msg.locationData.address}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100">
                      <span className="text-[10px] text-[#0088FF] font-semibold">
                        [Chạm để xem chi tiết bản đồ]
                      </span>
                      <span className="text-[10px] text-[#8A9098]">{msg.time}</span>
                    </div>
                  </div>
                </StoryEvidenceTarget>
              </div>
            );
          }

          // Standard Message Bubble
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <StoryEvidenceTarget
                item={{
                  title: `Tin nhắn: ${isMe ? 'Chồng (Nguyễn Huy Hoàng)' : thread.contactName}`,
                  snippet: msg.text,
                  suspectToTag: isMe ? 'Chồng (Nguyễn Huy Hoàng)' : thread.contactName,
                  subtitle: `Thời gian: ${msg.time} • Người gửi: ${isMe ? 'Chồng (Nguyễn Huy Hoàng)' : thread.contactName}`,
                }}
                onTriggerEvidence={setEvidenceSheetItem}
                className="max-w-[80%]"
              >
                <div
                  title="Nhấn giữ để ghim vào Sổ tay"
                  className={`w-full px-3.5 py-2.5 text-[14px] leading-[1.45] shadow-[0_1px_2px_rgba(0,0,0,0.06)] relative transition-all active:scale-[0.98] ${
                    isMe
                      ? 'bg-[#D2F4FF] text-[#0F172A] rounded-[14px] rounded-tr-[4px] border border-sky-100'
                      : 'bg-[#FFFFFF] text-[#0F172A] rounded-[14px] rounded-tl-[4px] border border-slate-100'
                  }`}
                >
                  <div className="select-none">{msg.text}</div>

                  {/* Bubble Footer: Time & Read status */}
                  <div
                    className={`flex items-center gap-1 text-[11px] text-[#8A9098] mt-1 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isMe && (
                      <span className="flex items-center text-[#0088FF]">
                        <IoCheckmarkDone className="w-3 h-3 text-[#0088FF]" />
                        <span className="ml-0.5">Đã xem</span>
                      </span>
                    )}
                    {!isMe && (
                      <span className="flex items-center text-slate-400">
                        <IoCheckmark className="w-3 h-3" />
                        <span className="ml-0.5">Đã nhận</span>
                      </span>
                    )}
                  </div>
                </div>
              </StoryEvidenceTarget>
            </div>
          );
        })}
      </main>

      {/* Input Bar */}
      <footer className="h-[52px] bg-white border-t border-[#E2E8F0] px-1 flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Nhãn dán"
        >
          <IoHappyOutline className="w-6 h-6" />
        </button>

        <div className="flex-1 min-w-0 px-1 text-[15px] text-slate-400">
          <span>Tin nhắn</span>
        </div>

        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Thêm tuỳ chọn"
        >
          <IoEllipsisHorizontal className="w-6 h-6" />
        </button>

        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Ghi âm"
        >
          <IoMicOutline className="w-6 h-6" />
        </button>

        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Gửi hình ảnh"
        >
          <IoImageOutline className="w-6 h-6" />
        </button>
      </footer>

      {/* Modals */}
      {selectedLocation && (
        <ZolaLocationModal
          isOpen={Boolean(selectedLocation)}
          venueName={selectedLocation.venueName}
          address={selectedLocation.address}
          time={selectedLocation.time}
          onPinEvidence={() => {
            onTagSuspect(
              `${thread.contactName} (${selectedLocation.venueName})`
            );
          }}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {evidenceSheetItem && (
        <ZolaEvidenceSheet
          isOpen={Boolean(evidenceSheetItem)}
          title={evidenceSheetItem.title}
          evidenceSnippet={evidenceSheetItem.snippet}
          suspectToTag={evidenceSheetItem.suspectToTag}
          onPinEvidence={(name) => onTagSuspect(name)}
          onClose={() => setEvidenceSheetItem(null)}
        />
      )}
    </div>
  );
};

