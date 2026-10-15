import React, { useState } from 'react';
import {
  CreditCard,
  Gamepad2,
  CloudSun,
  Receipt,
  Search,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ZolaDiscoverData } from '../types';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';

interface ZolaDiscoverViewProps {
  discoverData?: ZolaDiscoverData;
  onTagSuspect?: (name: string) => void;
}

export const ZolaDiscoverView: React.FC<ZolaDiscoverViewProps> = ({
  discoverData,
  onTagSuspect,
}) => {
  const [evidenceItem, setEvidenceItem] = useState<{
    title: string;
    snippet: string;
    suspectTag: string;
  } | null>(null);

  const promo = discoverData?.promoBanner || {
    tag: 'ZolaPay Mini App',
    badge: 'Miễn phí 100%',
    title: 'Chuyển tiền nhanh trong khung chat Zola',
    subtitle: 'Chuyển khoản Napas 24/7 bảo mật, không cần số tài khoản.',
  };

  const miniApps = discoverData?.miniApps || [
    { id: 'app_zolapay', name: 'Ví ZolaPay', icon: 'CreditCard', color: 'blue' },
    { id: 'app_bill', name: 'Hoá đơn', icon: 'Receipt', color: 'purple' },
    { id: 'app_weather', name: 'Thời tiết', icon: 'CloudSun', color: 'amber' },
    { id: 'app_games', name: 'Game Vui', icon: 'Gamepad2', color: 'rose' },
  ];

  const officialAccounts = discoverData?.officialAccounts || [
    { id: 'oa_evn', name: 'Điện lực Hà Nội', category: 'Tra cứu tiền điện sinh hoạt', badge: 'EVN', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'oa_viettel', name: 'Viettel CSKH', category: 'Ưu đãi gói cước di động 5G', badge: 'VTL', color: 'bg-red-100 text-red-700' },
  ];

  const getMiniAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-6 h-6 text-purple-600" />;
      case 'CloudSun':
        return <CloudSun className="w-6 h-6 text-amber-600" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-rose-600" />;
      case 'CreditCard':
      default:
        return <CreditCard className="w-6 h-6 text-[#0088FF]" />;
    }
  };

  const getMiniAppBg = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50';
      case 'amber':
        return 'bg-amber-50';
      case 'rose':
        return 'bg-rose-50';
      case 'blue':
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F0F2F5] text-[#0F172A] select-none font-sans overflow-y-auto">
      {/* Header */}
      <header className="h-14 px-3 bg-[#0088FF] text-white flex items-center gap-2 shrink-0 shadow-sm">
        <div className="flex-1 h-9 bg-white/20 rounded-lg flex items-center px-2.5 gap-2 text-white">
          <Search className="w-4 h-4 text-white/80 shrink-0" />
          <input
            type="text"
            readOnly
            placeholder="Tìm kiếm mini app, tiện ích..."
            className="w-full bg-transparent text-xs text-white placeholder-white/80 outline-hidden"
          />
        </div>
      </header>

      {/* ZolaPay Promo Banner */}
      <StoryEvidenceTarget
        item={{
          title: 'Khuyến mãi ZolaPay',
          snippet: `${promo.title} - ${promo.subtitle}`,
          suspectToTag: 'ZolaPay Mini App',
          subtitle: 'Tiện ích thanh toán Zola',
        }}
        onTriggerEvidence={(item) =>
          setEvidenceItem({
            title: item.title,
            snippet: item.snippet,
            suspectTag: item.suspectToTag,
          })
        }
      >
        <div className="m-3 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md space-y-1 relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              {promo.tag}
            </span>
            <span className="text-[10px] text-white/80">{promo.badge}</span>
          </div>
          <h3 className="text-sm font-bold pt-1">
            {promo.title}
          </h3>
          <p className="text-xs text-white/80">
            {promo.subtitle}
          </p>
        </div>
      </StoryEvidenceTarget>

      {/* Mini App Services Grid */}
      <div className="mx-3 bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
          Tiện ích gợi ý cho bạn
        </h4>
        <div className="grid grid-cols-4 gap-3 text-center">
          {miniApps.map((app) => (
            <StoryEvidenceTarget
              key={app.id}
              item={{
                title: `Tiện ích: ${app.name}`,
                snippet: `Dịch vụ số ${app.name} trên nền tảng Zola`,
                suspectToTag: app.name,
                subtitle: 'Zola Mini App',
              }}
              onTriggerEvidence={(item) =>
                setEvidenceItem({
                  title: item.title,
                  snippet: item.snippet,
                  suspectTag: item.suspectToTag,
                })
              }
            >
              <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <div className={`w-12 h-12 rounded-2xl ${getMiniAppBg(app.color)} flex items-center justify-center shadow-xs`}>
                  {getMiniAppIcon(app.icon)}
                </div>
                <span className="text-[11px] font-medium text-[#0F172A] leading-tight">
                  {app.name}
                </span>
              </div>
            </StoryEvidenceTarget>
          ))}
        </div>
      </div>

      {/* Official Accounts & Channels */}
      <div className="m-3 bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
          Kênh thông tin Official Account
        </h4>

        {officialAccounts.map((oa, index) => (
          <StoryEvidenceTarget
            key={oa.id}
            item={{
              title: `Kênh OA: ${oa.name}`,
              snippet: `${oa.name} (${oa.category})`,
              suspectToTag: oa.name,
              subtitle: 'Official Account',
            }}
            onTriggerEvidence={(item) =>
              setEvidenceItem({
                title: item.title,
                snippet: item.snippet,
                suspectTag: item.suspectToTag,
              })
            }
          >
            <div
              className={`flex items-center justify-between py-2 cursor-pointer hover:bg-slate-50 transition-all ${
                index < officialAccounts.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${oa.color || 'bg-slate-100 text-slate-700'} flex items-center justify-center font-bold text-xs shrink-0`}>
                  {oa.badge}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A]">{oa.name}</h5>
                  <p className="text-[11px] text-[#64748B]">{oa.category}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </StoryEvidenceTarget>
        ))}
      </div>

      <div className="p-4 text-center text-xs text-[#8A9098] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Hệ sinh thái dịch vụ số được mã hoá đầu cuối</span>
      </div>

      {/* Action sheet on long-press */}
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
