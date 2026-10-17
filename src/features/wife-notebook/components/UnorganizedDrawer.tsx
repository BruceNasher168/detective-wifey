import React, { useState } from 'react';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoNavigateOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';
import { SwipeBackContainer } from '../../../shared/ui/SwipeBackContainer';
import type { CaseGraphNode } from '../../../shared/contracts/knowledge-graph';

export interface UnorganizedDrawerProps {
  unplacedNodes: CaseGraphNode[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onPlaceNode: (node: CaseGraphNode) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'chat', label: 'Zola / Tin nhắn' },
  { id: 'bank', label: 'Techcornbank' },
  { id: 'order', label: 'Shopoo' },
  { id: 'phone', label: 'Điện thoại' },
] as const;

function getSourceLabel(appId?: string): string {
  switch (appId) {
    case 'internet-messaging':
      return 'Zola';
    case 'banking':
      return 'Techcornbank';
    case 'ecommerce':
      return 'Shopoo';
    case 'phone':
      return 'Điện thoại';
    default:
      return 'Manh mối';
  }
}

export const UnorganizedDrawer: React.FC<UnorganizedDrawerProps> = ({
  unplacedNodes,
  isOpen,
  onToggleOpen,
  onPlaceNode,
  onNavigateToSource,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'chat' | 'bank' | 'order' | 'phone'>('all');

  const filteredNodes = unplacedNodes.filter(node => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'chat') return node.sourceAppId === 'internet-messaging';
    if (activeFilter === 'bank') return node.sourceAppId === 'banking';
    if (activeFilter === 'order') return node.sourceAppId === 'ecommerce';
    if (activeFilter === 'phone') return node.sourceAppId === 'phone';
    return true;
  });

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        aria-label={`Mở khay manh mối (${unplacedNodes.length} manh mối chưa đưa lên bảng)`}
        className="corkboard-drawer absolute top-1/2 -translate-y-1/2 right-0 z-30 flex flex-col items-center gap-2 rounded-l-2xl border-y border-l border-[var(--notebook-border)] bg-[var(--notebook-paper)] hover:bg-amber-100 p-2 shadow-2xl backdrop-blur-md active:scale-95 transition-all cursor-pointer min-w-[44px] min-h-[44px]"
      >
        <IoChevronBackOutline className="text-base text-[#C2185B] animate-pulse" />
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow">
          {unplacedNodes.length}
        </span>
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-black uppercase tracking-wider text-stone-800 select-none">
          KHAY MANH MỐI
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Semi-transparent backdrop to dismiss */}
      <div
        className="corkboard-drawer absolute inset-0 z-30 bg-stone-900/20 backdrop-blur-[2px] transition-opacity"
        onClick={onToggleOpen}
        aria-label="Đóng khay manh mối"
      />

      {/* Vertical Clue Tray Panel */}
      <SwipeBackContainer
        onBack={onToggleOpen}
        className="corkboard-drawer absolute top-0 bottom-0 right-0 z-40 flex flex-col w-72 sm:w-80 max-w-[85vw] bg-[var(--notebook-paper)] border-l border-[var(--notebook-border)] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--notebook-border)] px-3.5 py-3 bg-amber-100/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C2185B]">
              KHAY MANH MỐI
            </span>
            <span className="rounded-full bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {unplacedNodes.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Đóng khay manh mối"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 transition-colors active:scale-95"
          >
            <IoChevronForwardOutline className="text-lg" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto p-2.5 border-b border-[var(--notebook-border)] scrollbar-none text-[11px] shrink-0">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 font-medium transition-colors ${
                activeFilter === f.id
                  ? 'bg-rose-600 text-white font-semibold shadow'
                  : 'bg-amber-100 text-stone-700 hover:bg-amber-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Clue Card List (Vertical Scroll) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-0">
          {filteredNodes.length === 0 ? (
            <p className="py-10 text-center text-xs text-stone-600 px-4">
              Không còn manh mối nào trong khay. Hãy snoop điện thoại để ghim thêm!
            </p>
          ) : (
            filteredNodes.map(node => (
              <div
                key={node.nodeId}
                className="flex flex-col gap-2 rounded-xl border border-[var(--notebook-border)] bg-[#FFFDF7] p-3 shadow-sm hover:border-amber-500 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-stone-700">
                      {getSourceLabel(node.sourceAppId)}
                    </span>
                    {node.type === 'suspect' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        Nghi phạm
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-stone-900 leading-snug">{node.label}</p>
                  {node.subtitle && (
                    <p className="mt-1 text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {node.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                  {/* Deep Link to Source */}
                  {node.sourceAppId && (
                    <button
                      type="button"
                      aria-label="Đi tới nguồn manh mối"
                      onClick={() => onNavigateToSource(node.sourceAppId, node.recordRefId)}
                      className="flex h-8 items-center gap-1 px-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-stone-800 text-[11px] font-medium transition-colors active:scale-95"
                    >
                      <IoNavigateOutline className="text-sm" /> Đi tới nguồn
                    </button>
                  )}

                  {/* Place onto Canvas */}
                  <button
                    type="button"
                    onClick={() => onPlaceNode(node)}
                    className="flex h-8 items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 text-[11px] font-bold text-white shadow active:scale-95 transition-all"
                  >
                    <IoAddCircleOutline className="text-sm" /> Đưa lên bảng
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </SwipeBackContainer>
    </>
  );
};
