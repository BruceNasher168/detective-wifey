import React from 'react';
import { IoAddCircleOutline, IoClose, IoPhonePortraitOutline, IoShareSocialOutline } from 'react-icons/io5';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';

interface PwaGuideSheetProps {
  onClose: () => void;
  onPreviewFullscreen: () => void;
}

export const PwaGuideSheet: React.FC<PwaGuideSheetProps> = ({
  onClose,
  onPreviewFullscreen,
}) => {
  const swipeHandlers = useSwipeBack({ onBack: onClose });

  return (
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end animate-fadeIn select-none font-sans"
      onClick={onClose}
    >
      <div
        {...swipeHandlers}
        className="w-full max-h-[85%] overflow-y-auto bg-slate-900 border-t border-white/20 rounded-t-3xl p-4 shadow-2xl space-y-3.5 animate-slideUp text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-10 h-1 bg-slate-600 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        />

        <div className="flex justify-between items-start pb-2 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              CHƠI NHƯ ỨNG DỤNG THẬT (PWA)
            </h2>
            <p className="text-xs text-slate-400">
              Ẩn hoàn toàn thanh công cụ Safari / Chrome để có trải nghiệm toàn màn hình 100%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            aria-label="Đóng"
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Step Boxes */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <p className="leading-relaxed">
              Trên <strong>iOS Safari</strong>: Chạm nút <strong>Chia sẻ</strong> (<IoShareSocialOutline className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" />) ở thanh dưới.<br />
              Trên <strong>Android Chrome</strong>: Chạm dấu ba chấm ở góc trên.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <p className="leading-relaxed">
              Cuộn xuống chọn mục <strong>"Thêm vào Màn hình chính"</strong> (<IoAddCircleOutline className="w-3.5 h-3.5 inline mx-0.5 text-blue-400" /> Add to Home Screen).
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <p className="leading-relaxed">
              Mở game từ icon ngoài màn hình: ứng dụng sẽ khởi động chế độ độc lập <IoPhonePortraitOutline className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" /> với 0 thanh duyệt web!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onPreviewFullscreen();
          }}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all shadow-md text-center"
        >
          ĐÃ HIỂU • XEM THỬ CHẾ ĐỘ TOÀN MÀN HÌNH
        </button>
      </div>
    </div>
  );
};

