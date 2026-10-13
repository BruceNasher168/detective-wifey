import React from 'react';
import { VirtualAppProps, AppDefinition } from '../../types/app-contracts';
import { ChevronLeft, Award, Pin } from 'lucide-react';

export const InkedlinApp: React.FC<VirtualAppProps> = ({
  caseData,
  onTagSuspect,
  onReturnHome,
}) => {
  const inkedData = caseData.appsData?.inkedlin || {};
  const posts = inkedData.posts || [];

  return (
    <div className="flex flex-col h-full w-full bg-[#F3F2F0] text-[#191919] select-none font-sans">
      <header className="flex items-center justify-between px-3 h-14 bg-[#0A66C2] text-white shadow-md shrink-0">
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Trang chủ"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold tracking-tight">InkedLin</h1>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-[#666666]">
          <span>BẢNG TIN NGHỀ NGHIỆP</span>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#666666]">
            Không có bài đăng mới.
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-[#E0E0E0] space-y-2 min-h-[64px]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#191919]">{post.author}</h4>
                  <span className="text-[10px] text-[#666666]">{post.time}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#B27B00] text-[10px] font-bold">
                  Kỷ niệm 5 năm
                </span>
              </div>
              <p className="text-xs text-[#191919] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="pt-2 border-t border-[#E0E0E0] flex justify-end">
                <button
                  type="button"
                  onClick={() => onTagSuspect('Kỷ niệm 5 năm (1509)', 'inkedlin')}
                  className="flex items-center gap-1 min-h-[44px] px-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-bold"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>Ghim manh mối</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  appId: 'inkedlin',
  displayName: 'InkedLin',
  icon: Award,
  themeGradient: 'from-blue-700 to-indigo-800',
  themeColor: '#0A66C2',
  notificationBadgeCount: 1,
  isLocked: false,
  component: InkedlinApp,
};

export default InkedlinApp;
