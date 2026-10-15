import React, { useState } from 'react';
import { IoChatbubbleEllipsesOutline, IoHeart, IoImageOutline, IoShareSocialOutline } from 'react-icons/io5';
import { ZolaTimelinePost } from '../types';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';

interface ZolaTimelineViewProps {
  timelinePosts?: ZolaTimelinePost[];
  onTagSuspect?: (name: string) => void;
}

export const ZolaTimelineView: React.FC<ZolaTimelineViewProps> = ({
  timelinePosts,
  onTagSuspect,
}) => {
  const [evidenceItem, setEvidenceItem] = useState<{
    title: string;
    snippet: string;
    suspectTag: string;
  } | null>(null);

  const posts = timelinePosts || [
    {
      id: 'p1',
      author: 'Lan Anh Kế Toán',
      avatarGradient: 'from-pink-400 to-rose-600',
      avatarInitials: 'L',
      timestamp: '15 phút trước',
      content: 'Hôm nay team OT cật lực chốt sổ cuối quý, sếp hứa bao trà sữa mà chưa thấy tăm hơi đâu nhé! Cần lắm một sự tiếp tế năng lượng...',
      likesCount: 4,
      commentsCount: 2,
    },
    {
      id: 'p2',
      author: 'Tiệm Hoa Tươi Mimosa',
      avatarGradient: 'from-amber-400 to-orange-500',
      avatarInitials: 'TH',
      timestamp: '3 giờ trước',
      content: 'Mẫu bó hoa hồng sáp đỏ 99 bông rực rỡ tượng trưng cho tình yêu vĩnh cửu vừa được giao đến tay khách hàng VIP chiều nay. Chúc hai bạn trăm năm hạnh phúc!',
      likesCount: 18,
      commentsCount: 5,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F0F2F5] text-[#0F172A] select-none font-sans overflow-y-auto">
      {/* Header */}
      <header className="h-14 px-4 bg-[#0088FF] text-white flex items-center justify-between shrink-0 shadow-sm">
        <h2 className="text-ios-headline font-bold tracking-tight">Nhật ký</h2>
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg"
          aria-label="Đăng ảnh mới"
        >
          <IoImageOutline className="w-5 h-5" />
        </button>
      </header>

      {/* Status Composer Bar */}
      <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-ios-body shrink-0">
          H
        </div>
        <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-ios-subheadline text-slate-500 border border-slate-200">
          Hôm nay bạn thế nào?
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-2 mt-2">
        {posts.map((post) => (
          <StoryEvidenceTarget
            key={post.id}
            item={{
              title: `Bài viết: ${post.author}`,
              subtitle: `Thời gian: ${post.timestamp}`,
              snippet: post.content,
              suspectToTag: post.suspectTag || post.author,
            }}
            onTriggerEvidence={() =>
              setEvidenceItem({
                title: `Bài viết: ${post.author}`,
                snippet: post.content,
                suspectTag: post.suspectTag || post.author,
              })
            }
          >
            <article className="p-4 bg-white border-y border-slate-200 space-y-2.5 cursor-pointer hover:bg-slate-50/50 transition-all">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                  post.avatarGradient || 'from-sky-400 to-indigo-600'
                } flex items-center justify-center text-white font-bold text-ios-body shrink-0`}
              >
                {post.avatarInitials || post.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-ios-headline font-bold text-[#0F172A]">{post.author}</h4>
                <span className="text-ios-footnote text-[#8A9098]">{post.timestamp}</span>
              </div>
            </div>
            <p className="text-ios-body text-[#0F172A] leading-relaxed">
              {post.content}
            </p>
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-ios-footnote text-[#64748B]">
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-rose-500 active:scale-95 transition-all min-h-[36px]"
              >
                <IoHeart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{post.likesCount}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-blue-500 active:scale-95 transition-all min-h-[36px]"
              >
                <IoChatbubbleEllipsesOutline className="w-4 h-4" />
                <span>{post.commentsCount}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-slate-800 active:scale-95 transition-all min-h-[36px]"
              >
                <IoShareSocialOutline className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </article>
        </StoryEvidenceTarget>
      ))}
    </div>

      {/* Evidence Sheet on long-press */}
      {evidenceItem && (
        <ZolaEvidenceSheet
          isOpen={Boolean(evidenceItem)}
          title={evidenceItem.title}
          evidenceSnippet={evidenceItem.snippet}
          suspectToTag={evidenceItem.suspectTag}
          onPinEvidence={(name) => {
            onTagSuspect?.(name);
            setEvidenceItem(null);
          }}
          onClose={() => setEvidenceItem(null)}
        />
      )}
    </div>
  );
};
