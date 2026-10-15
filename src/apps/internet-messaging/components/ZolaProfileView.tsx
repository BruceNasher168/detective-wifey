import React, { useState } from 'react';
import {
  Settings,
  Cloud,
  Shield,
  Key,
  ChevronRight,
  Database,
  QrCode,
  Briefcase,
} from 'lucide-react';
import { ZolaCloudDocument } from '../types';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';

interface ZolaProfileViewProps {
  currentUser?: {
    name: string;
    handle: string;
    avatarInitials?: string;
    statusText?: string;
  };
  cloudDocuments: ZolaCloudDocument[];
  onOpenCloudDrawer: () => void;
  onReturnHome: () => void;
  onTagSuspect?: (name: string) => void;
}

export const ZolaProfileView: React.FC<ZolaProfileViewProps> = ({
  currentUser = {
    name: 'Nguyễn Huy Hoàng',
    handle: 'hoang_tech88',
    avatarInitials: 'H',
    statusText: 'Đang làm việc...',
  },
  onOpenCloudDrawer,
  onTagSuspect,
}) => {
  const [evidenceItem, setEvidenceItem] = useState<{
    title: string;
    snippet: string;
    suspectTag: string;
    subtitle?: string;
  } | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#F0F2F5] text-[#0F172A] select-none font-sans overflow-y-auto">
      {/* Header */}
      <header className="h-14 px-4 bg-[#0088FF] text-white flex items-center justify-between shrink-0 shadow-sm">
        <h2 className="text-base font-bold tracking-tight">Trang cá nhân</h2>
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg"
          aria-label="Cài đặt tài khoản"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Profile Card */}
      <StoryEvidenceTarget
        item={{
          title: `Tài khoản: ${currentUser.name}`,
          snippet: `Chủ tài khoản Zola: ${currentUser.name}\nHandle: @${currentUser.handle}\nTrạng thái: ${currentUser.statusText || 'Đang làm việc...'}`,
          suspectToTag: currentUser.name,
          subtitle: 'Thông tin tài khoản máy',
        }}
        onTriggerEvidence={(item) =>
          setEvidenceItem({
            title: item.title,
            snippet: item.snippet,
            suspectTag: item.suspectToTag,
            subtitle: item.subtitle,
          })
        }
      >
        <div className="p-4 bg-white flex items-center gap-3.5 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
            {currentUser.avatarInitials || currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-base font-bold text-[#0F172A] truncate">
                {currentUser.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">
              Tài khoản Zola: {currentUser.handle}
            </p>
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-[#64748B] border border-slate-200">
              <span>{currentUser.statusText || 'Đang bận...'}</span>
            </div>
          </div>
        </div>
      </StoryEvidenceTarget>

      {/* Group 1: Storage Utilities (CLUE-ZOLA-07 entry point) */}
      <div className="mt-2.5 bg-white border-y border-slate-200">
        <div className="px-4 py-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          Tiện ích lưu trữ
        </div>

        {/* Cloud của tôi */}
        <button
          type="button"
          onClick={onOpenCloudDrawer}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-all text-left min-h-[56px] border-t border-slate-100"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088FF] flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0F172A]">
                  Cloud của tôi (My Documents)
                </span>
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  !
                </span>
              </div>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Lưu trữ tin nhắn bí mật, hình ảnh và tài liệu sao lưu
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </button>

        {/* Dữ liệu trên máy */}
        <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all text-left min-h-[56px] border-t border-slate-100 cursor-pointer">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-[#0F172A]">
                Dữ liệu trên máy
              </span>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Quản lý bộ nhớ và cache (1.8 GB đã dùng)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>

        {/* Ví QR */}
        <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all text-left min-h-[56px] border-t border-slate-100 cursor-pointer">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-[#0F172A]">
                Ví QR cá nhân
              </span>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Mã QR nhận tiền và kết nối nhanh
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>
      </div>

      {/* Group 2: Privacy & Security */}
      <div className="mt-2.5 bg-white border-y border-slate-200">
        <div className="px-4 py-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          Cài đặt & Bảo mật
        </div>

        {/* Quyền riêng tư (Story Evidence Target) */}
        <StoryEvidenceTarget
          item={{
            title: 'Quyền riêng tư & Chặn liên lạc',
            snippet: 'Danh sách chặn: 1 liên hệ (Hương Marketing) đã bị ẩn/chặn khỏi tin nhắn và nhật ký.',
            suspectToTag: 'Hương Đồng Nghiệp',
            subtitle: 'Cài đặt bảo mật Zola',
          }}
          onTriggerEvidence={(item) =>
            setEvidenceItem({
              title: item.title,
              snippet: item.snippet,
              suspectTag: item.suspectToTag,
              subtitle: item.subtitle,
            })
          }
        >
          <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all text-left min-h-[56px] border-t border-slate-100 cursor-pointer">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-[#0F172A]">
                  Quyền riêng tư & Chặn liên lạc
                </span>
                <p className="text-xs text-[#64748B] truncate mt-0.5">
                  1 liên hệ trong danh sách ẩn / chặn
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
          </div>
        </StoryEvidenceTarget>

        {/* Mã khóa màn hình & Tin nhắn ẩn */}
        <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all text-left min-h-[56px] border-t border-slate-100 cursor-pointer">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-[#0F172A]">
                Mã khóa màn hình & Tin nhắn ẩn
              </span>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Khóa bằng mã PIN 4 số
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>

        {/* zBusiness */}
        <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all text-left min-h-[56px] border-t border-slate-100 cursor-pointer">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-[#0F172A]">
                Tài khoản Doanh Nghiệp (zBusiness)
              </span>
              <p className="text-xs text-[#64748B] truncate mt-0.5">
                Công cụ bán hàng và chăm sóc khách hàng
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        </div>
      </div>

      {/* Action Sheet on long-press */}
      {evidenceItem && (
        <ZolaEvidenceSheet
          isOpen={Boolean(evidenceItem)}
          title={evidenceItem.title}
          subtitle={evidenceItem.subtitle}
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

