import React, { useState } from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { IoChevronBack, IoImageOutline, IoLockClosedOutline, IoPin } from 'react-icons/io5';
import { IoImages } from 'react-icons/io5';
import { useSwipeBack } from '../../hooks/useSwipeBack';

export const PhotosApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
  onRequestUnlock,
  unlockedChallenges,
}) => {
  const photosData = caseData.appsData?.photos || {};
  const albums = photosData.albums || [];
  const [activeTab, setActiveTab] = useState<'all' | 'hidden'>('all');

  const isHiddenUnlocked = unlockedChallenges.has('lock_photos');

  const handleBack = () => {
    if (activeTab === 'hidden') {
      setActiveTab('all');
    } else {
      onReturnHome();
    }
  };

  const swipeHandlers = useSwipeBack({ onBack: handleBack });

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col h-full w-full bg-[#000000] text-[#FFFFFF] select-none font-sans"
    >
      <header className="flex items-center justify-between px-3 h-14 bg-[#1C1C1E] text-white shadow-md shrink-0 border-b border-white/10">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all text-[#2979FF]"
          aria-label={activeTab === 'hidden' ? 'Tất cả ảnh' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{activeTab === 'hidden' ? 'Tất cả ảnh' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoImageOutline className="w-5 h-5 text-[#2979FF]" />
          <h1 className="text-base font-bold tracking-tight">Photos</h1>
        </div>
        <div className="w-11" />
      </header>

      <div className="flex border-b border-white/10 bg-[#1C1C1E] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-h-[44px] flex items-center justify-center text-xs font-bold transition-all border-b-2 ${
            activeTab === 'all'
              ? 'border-[#2979FF] text-[#2979FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Tất cả ảnh
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isHiddenUnlocked && onRequestUnlock) {
              onRequestUnlock('lock_photos');
            } else {
              setActiveTab('hidden');
            }
          }}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'hidden'
              ? 'border-[#2979FF] text-[#2979FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {!isHiddenUnlocked && <IoLockClosedOutline className="w-3.5 h-3.5 text-[#FFC107]" />}
          <span>Mục bị ẩn</span>
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'all' ? (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-[#1C1C1E] border border-white/5 flex items-center justify-center text-slate-600 text-xs"
              >
                Ảnh {i}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/10 border border-[#FFC107]/30 rounded-xl text-xs text-amber-200">
              Thư mục ảnh bị ẩn đã mở khóa thành công.
            </div>
            {albums.map((album: any) => (
              <div key={album.id} className="space-y-2">
                {album.photos?.map((photo: any) => (
                  <div
                    key={photo.id}
                    className="p-3 bg-[#1C1C1E] rounded-xl border border-white/10 flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-white">{photo.title}</span>
                    <button
                      type="button"
                      onClick={() => onTagSuspect('Ảnh kỷ niệm PNJ', 'photos')}
                      className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-bold"
                    >
                      <IoPin className="w-3.5 h-3.5" />
                      <span>Ghim</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'photos',
  displayName: 'Photos',
  icon: IoImages,
  themeGradient: 'from-purple-600 to-indigo-700',
  themeColor: '#2979FF',
  notificationBadgeCount: 0,
  isLocked: false,
  component: PhotosApp,
};

export default PhotosApp;

