import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  UserCheck,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { ZolaContact } from '../types';
import { ZolaEvidenceSheet } from './ZolaEvidenceSheet';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';

interface ZolaContactsViewProps {
  contacts: ZolaContact[];
  onTagSuspect: (suspectName: string) => void;
  onReturnHome: () => void;
}

export const ZolaContactsView: React.FC<ZolaContactsViewProps> = ({
  contacts,
  onTagSuspect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'friends' | 'oa'>('all');
  const [evidenceSheetContact, setEvidenceSheetContact] = useState<ZolaContact | null>(null);

  // Filter contacts by query
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.department && c.department.toLowerCase().includes(q))
    );
  });

  // Group contacts by section
  const sections = Array.from(new Set(filteredContacts.map((c) => c.section))).sort();

  return (
    <div className="flex flex-col h-full w-full bg-[#FFFFFF] text-[#0F172A] select-none font-sans overflow-hidden">
      {/* Search Header */}
      <header className="h-14 px-3 bg-[#0088FF] flex items-center gap-2 shrink-0 shadow-sm z-10">
        <div className="flex-1 h-9 bg-white/20 rounded-lg flex items-center px-2.5 gap-2 text-white">
          <Search className="w-4 h-4 text-white/80 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bạn bè, danh bạ..."
            className="w-full bg-transparent text-xs text-white placeholder-white/70 outline-hidden"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all rounded-lg shrink-0"
          aria-label="Thêm liên hệ mới"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </header>

      {/* Main List */}
      <main className="flex-1 overflow-y-auto">
        {/* Quick Contacts Actions */}
        <div className="p-3 border-b border-slate-100 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer min-h-[44px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0088FF] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#0F172A]">
                Lời mời kết bạn
              </span>
            </div>
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
              1
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer min-h-[44px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#0F172A]">
                Danh bạ máy (Đồng bộ)
              </span>
            </div>
            <span className="text-xs text-[#8A9098]">(342 số)</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-200 text-[#0F172A]'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('friends')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedFilter === 'friends'
                ? 'bg-slate-200 text-[#0F172A]'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            Bạn bè
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('oa')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedFilter === 'oa'
                ? 'bg-slate-200 text-[#0F172A]'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            OA
          </button>
        </div>

        {/* Grouped Contacts List */}
        {sections.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8A9098]">
            Không tìm thấy liên hệ phù hợp.
          </div>
        ) : (
          sections.map((section) => (
            <div key={section} className="border-b border-slate-100">
              <div className="px-3 py-1 bg-[#F0F2F5] text-[11px] font-bold text-[#64748B]">
                {section}
              </div>
              <div className="divide-y divide-slate-100">
                {filteredContacts
                  .filter((c) => c.section === section)
                  .map((contact) => (
                    <StoryEvidenceTarget
                      key={contact.id}
                      item={{
                        title: contact.name,
                        subtitle: contact.department || (contact.phone ? `SĐT: ${contact.phone}` : undefined),
                        snippet: `${contact.name}${contact.department ? ` • ${contact.department}` : ''}${
                          contact.phone ? ` • SĐT: ${contact.phone}` : ''
                        }${contact.isBlocked ? ' (Đã bị ẩn/chặn)' : ''}`,
                        suspectToTag: contact.name,
                      }}
                      onTriggerEvidence={() => setEvidenceSheetContact(contact)}
                    >
                      <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-all cursor-pointer min-h-[60px]">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                              contact.avatarGradient || 'from-sky-400 to-indigo-600'
                            } flex items-center justify-center text-white font-bold text-sm shrink-0`}
                          >
                            {contact.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#0F172A] truncate">
                              {contact.name}
                            </h4>
                            {(contact.phone || contact.department) && (
                              <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                                {contact.phone && `SĐT: ${contact.phone}`}
                                {contact.phone && contact.department && ' • '}
                                {contact.department}
                              </p>
                            )}
                            {contact.isBlocked && (
                              <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">
                                Đã bị ẩn / chặn liên lạc
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </StoryEvidenceTarget>
                  ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Action Sheet on Contact */}
      {evidenceSheetContact && (
        <ZolaEvidenceSheet
          isOpen={Boolean(evidenceSheetContact)}
          title={`Hồ sơ danh bạ: ${evidenceSheetContact.name}`}
          subtitle={
            evidenceSheetContact.phone
              ? `SĐT: ${evidenceSheetContact.phone} • ${
                  evidenceSheetContact.department || ''
                }`
              : evidenceSheetContact.department
          }
          evidenceSnippet={`Liên hệ: ${evidenceSheetContact.name}${
            evidenceSheetContact.phone ? ` | SĐT: ${evidenceSheetContact.phone}` : ''
          }${
            evidenceSheetContact.department
              ? ` | Phòng: ${evidenceSheetContact.department}`
              : ''
          }`}
          suspectToTag={evidenceSheetContact.name}
          onPinEvidence={(name) => onTagSuspect(name)}
          onClose={() => setEvidenceSheetContact(null)}
        />
      )}
    </div>
  );
};
