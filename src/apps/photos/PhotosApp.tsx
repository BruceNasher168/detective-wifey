import { useMotionState } from '../../shared/motion/useMotionState';
import { readPhotosData } from './data';
import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../shared/contracts/app-contracts';
import { IoChevronBack, IoImageOutline, IoLockClosedOutline } from 'react-icons/io5';
import { IoImages } from 'react-icons/io5';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';
import { StoryEvidenceTarget } from '../../features/investigation';
import { UniversalEvidenceModal, UniversalEvidenceItem } from '../../features/investigation';

export const PhotosApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
  onRequestUnlock,
  unlockedChallenges,
}) => {
  const photosData = readPhotosData(caseData.appsData?.photos);
  const albums = photosData.albums || [];
  const publicPhotos = albums.filter(album => !album.isLocked).flatMap(album => album.photos);
  const hiddenAlbums = albums.filter(album => album.isLocked);
  const [activeTab, setActiveTab] = useMotionState<'all' | 'hidden'>('all', 'fade');
  const [evidenceItem, setEvidenceItem] = useMotionState<UniversalEvidenceItem | null>(null, 'sheet');

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
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-ios-subheadline font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all text-[#2979FF]"
          aria-label={activeTab === 'hidden' ? 'Tất cả ảnh' : 'Trang chủ'}
        >
          <IoChevronBack className="w-5 h-5" />
          <span>{activeTab === 'hidden' ? 'Tất cả ảnh' : 'Trang chủ'}</span>
        </button>
        <div className="flex items-center gap-2">
          <IoImageOutline className="w-5 h-5 text-[#2979FF]" />
          <h1 className="text-ios-headline font-bold tracking-tight">Photos</h1>
        </div>
        <div className="w-11" />
      </header>

      <div className="flex border-b border-white/10 bg-[#1C1C1E] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-h-[44px] flex items-center justify-center text-ios-footnote font-bold transition-all border-b-2 ${
            activeTab === 'all'
              ? 'border-[#2979FF] text-[#2979FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Tất cả ảnh
        </button>
        {hiddenAlbums.length > 0 && <button
          type="button"
          onClick={() => {
            if (!isHiddenUnlocked && onRequestUnlock) {
              onRequestUnlock('lock_photos');
            } else {
              setActiveTab('hidden');
            }
          }}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-ios-footnote font-bold transition-all border-b-2 ${
            activeTab === 'hidden'
              ? 'border-[#2979FF] text-[#2979FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {!isHiddenUnlocked && <IoLockClosedOutline className="w-3.5 h-3.5 text-[#FFC107]" />}
          <span>Mục bị ẩn</span>
        </button>}
      </div>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'all' ? (
          <div className="grid grid-cols-3 gap-2">
            {publicPhotos.map(photo => (
              <StoryEvidenceTarget
                key={photo.id}
                item={{
                  title: photo.title,
                  subtitle: photo.date,
                  snippet: photo.description || photo.title,
                  suspectToTag: photo.suspectName || caseData.husbandName,
                  source: { caseId: caseData.caseId, recordId: photo.id, clueRefId: photo.clueRefId, title: photo.title, snippet: photo.description || photo.title },
                }}
                onTriggerEvidence={setEvidenceItem}
              >
                <div className="aspect-square rounded-lg bg-[#1C1C1E] border border-white/5 flex flex-col items-center justify-center gap-1 p-2 text-center text-slate-400 text-ios-caption-1">
                  <IoImageOutline className="w-6 h-6 shrink-0" />
                  <span className="text-white">{photo.title}</span>
                  {photo.date && <span>{photo.date}</span>}
                </div>
              </StoryEvidenceTarget>
            ))}
            {publicPhotos.length === 0 && <p className="col-span-3 py-6 text-center text-ios-subheadline text-slate-400">Chưa có ảnh.</p>}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/10 border border-[#FFC107]/30 rounded-xl text-ios-footnote text-amber-200">
              Thư mục ảnh bị ẩn đã mở khóa thành công.
            </div>
            {hiddenAlbums.map((album) => (
              <div key={album.id} className="space-y-2">
                {album.photos?.map((photo) => (
                  <StoryEvidenceTarget
                    key={photo.id}
                    item={{
                      title: photo.title,
                      subtitle: `Mục bị ẩn • ${album.title || 'Album'}`,
                      snippet: photo.description || photo.title,
                      suspectToTag: photo.suspectName || photo.title || 'Ảnh kỷ niệm PNJ',
                    }}
                    onTriggerEvidence={setEvidenceItem}
                  >
                    <div
                      className="p-3 bg-[#1C1C1E] rounded-xl border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all min-h-[52px]"
                    >
                      <span className="text-ios-subheadline font-medium text-white">{photo.title}</span>
                      <span className="text-ios-caption-2 text-slate-400">Nhấn giữ</span>
                    </div>
                  </StoryEvidenceTarget>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Universal Blurred Pop-up on Long Press */}
      {evidenceItem && (
        <UniversalEvidenceModal
          isOpen={Boolean(evidenceItem)}
          item={evidenceItem}
          onPinEvidence={(suspect) => onTagSuspect(suspect, 'photos')}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'photos',
  displayName: 'Photos',
  icon: IoImages,
  themeGradient: 'from-purple-600 to-indigo-700',
  themeColor: '#2979FF', bottomBarColor: '#000000',
  notificationBadgeCount: 0,
  isLocked: false,
  component: PhotosApp,
};

export default PhotosApp;

