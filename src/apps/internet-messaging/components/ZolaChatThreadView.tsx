import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Clock,
  MapPin,
  Smile,
  Image as ImageIcon,
  Send,
  CheckCheck,
  Check,
} from 'lucide-react';
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
      className="flex flex-col h-full w-full bg-[#E5EBF0] text-[#0F172A] select-none font-sans overflow-hidden"
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
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Contact Details (Story Data - long press to inspect/pin) */}
          <StoryEvidenceTarget
            item={{
              title: `Hồ sơ liên hệ: ${thread.contactName}`,
              snippet: `Liên hệ: ${thread.contactName} (Danh tính thực: ${
                thread.realIdentity || 'Chưa xác định'
              })`,
              suspectToTag: thread.realIdentity || thread.contactName,
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
              <h2 className="text-sm font-bold truncate text-white leading-tight">
                {thread.contactName}
              </h2>
              <p className="text-[11px] text-white/80 truncate">
                Vừa mới truy cập
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
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Gọi video"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Tuỳ chọn cuộc trò chuyện"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Disappearing Messages Notice (CLUE-ZOLA-03) */}
      {(thread.systemBanner || thread.isDisguised) && (
        <StoryEvidenceTarget
          item={{
            title: 'Cài đặt tự xoá tin nhắn (CLUE-ZOLA-03)',
            snippet: thread.systemBanner || 'Tin nhắn tự xoá sau 24 giờ đã được bật',
            suspectToTag: thread.realIdentity || thread.contactName,
            subtitle: 'Tính năng bảo mật cuộc trò chuyện Zola',
          }}
          onTriggerEvidence={setEvidenceSheetItem}
        >
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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
                    suspectToTag: thread.realIdentity || thread.contactName,
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
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
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
                  title: `Tin nhắn từ ${isMe ? 'Chồng' : thread.contactName}`,
                  snippet: msg.text,
                  suspectToTag: thread.realIdentity || thread.contactName,
                  subtitle: `Thời gian: ${msg.time}`,
                }}
                onTriggerEvidence={setEvidenceSheetItem}
                className="max-w-[80%]"
              >
                <div
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs relative transition-all ${
                    isMe
                      ? 'bg-[#D2F4FF] text-[#0F172A] rounded-br-xs border border-sky-100'
                      : 'bg-[#FFFFFF] text-[#0F172A] rounded-bl-xs border border-slate-100'
                  }`}
                >
                  <div>{msg.text}</div>

                  {/* Bubble Footer: Time & Read status */}
                  <div
                    className={`flex items-center gap-1 text-[10px] text-[#8A9098] mt-1 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isMe && (
                      <span className="flex items-center text-[#0088FF]">
                        <CheckCheck className="w-3 h-3 text-[#0088FF]" />
                        <span className="ml-0.5">Đã xem</span>
                      </span>
                    )}
                    {!isMe && (
                      <span className="flex items-center text-slate-400">
                        <Check className="w-3 h-3" />
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
      <footer className="h-14 bg-white border-t border-[#E2E8F0] px-2 flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Nhãn dán"
        >
          <Smile className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-slate-100 rounded-full px-3.5 py-2 text-xs text-slate-500 border border-slate-200">
          <span>Nhập tin nhắn...</span>
        </div>

        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          aria-label="Gửi hình ảnh"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-[#0088FF] hover:text-[#0077EE] active:scale-95 transition-all"
          aria-label="Gửi tin nhắn"
        >
          <Send className="w-5 h-5" />
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
              `${thread.realIdentity || thread.contactName} (${selectedLocation.venueName})`
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

