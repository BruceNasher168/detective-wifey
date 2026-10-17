import { useState, useRef, useEffect } from 'react';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoNavigateOutline,
  IoAddCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import type { CaseGraphNode } from '../../../shared/contracts/knowledge-graph';
import { useDialogFocus } from '../../../shared/ui/useDialogFocus';
import {
  ClueTimelineRail,
  parseNodeToTimelineEntries,
} from './ClueTimelineRail';

export interface UnorganizedDrawerProps {
  unplacedNodes: CaseGraphNode[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onPlaceNode: (node: CaseGraphNode) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
  onDeleteCard?: (nodeId: string) => void;
  onDeleteMessage?: (nodeId: string, messageRecordId: string) => void;
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
  onDeleteCard,
  onDeleteMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'chat' | 'bank' | 'order' | 'phone'>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(isOpen);
  const drawerKeyDown = useDialogFocus(isOpen, panelRef, onToggleOpen);
  useEffect(() => {
    // The closed trigger is recreated after the drawer unmounts.
    if (wasOpen.current && !isOpen) triggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = isOpen;
  }, [isOpen]);

  const filteredNodes = unplacedNodes.filter(node => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'chat') return node.sourceAppId === 'internet-messaging' || node.sourceAppId === 'messages';
    if (activeFilter === 'bank') return node.sourceAppId === 'banking';
    if (activeFilter === 'order') return node.sourceAppId === 'ecommerce';
    if (activeFilter === 'phone') return node.sourceAppId === 'phone';
    return true;
  });

  if (!isOpen) {
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggleOpen}
        aria-label={`Mở khay manh mối (${unplacedNodes.length} manh mối chưa đưa lên bảng)`}
        className="corkboard-drawer absolute top-3 right-0 z-30 flex w-9 flex-col items-center gap-1 rounded-l-xl border-y border-l border-[var(--notebook-border)] bg-[var(--notebook-paper)] hover:bg-amber-100 px-1 py-1.5 shadow-lg backdrop-blur-md active:scale-95 transition-all cursor-pointer min-h-[44px] before:absolute before:inset-y-0 before:-inset-x-1"
      >
        <IoChevronBackOutline className="text-sm text-[#C2185B]" />
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow">
          {unplacedNodes.length}
        </span>
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-black uppercase tracking-wider text-stone-800 select-none">
          MANH MỐI
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
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Manh mối"
        onKeyDown={event => {
          if (event.key === 'Escape' || event.key === 'Tab') event.stopPropagation();
          drawerKeyDown(event);
        }}
        className="corkboard-drawer absolute top-0 bottom-0 right-0 z-40 flex flex-col w-72 sm:w-80 max-w-[85vw] bg-[var(--notebook-paper)] border-l border-[var(--notebook-border)] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--notebook-border)] px-3.5 py-3 bg-amber-100/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C2185B]">
              MANH MỐI
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
            filteredNodes.map(node => {
              const timelineEntries = parseNodeToTimelineEntries(node);
              return (
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

                    {/* Clue Body: Left-hand Vertical Timeline Rail */}
                    {timelineEntries.length > 0 && (
                      <div className="mt-1">
                        <ClueTimelineRail
                          entries={timelineEntries}
                          isSelected
                          onDeleteItem={onDeleteMessage ? (msgId) => onDeleteMessage(node.nodeId, msgId) : undefined}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-amber-200">
                    {/* Deep Link to Source */}
                    {node.sourceAppId && (
                      <button
                        type="button"
                        aria-label="Đi tới nguồn manh mối"
                        onClick={() => onNavigateToSource(node.sourceAppId, node.conversationId || node.recordRefId)}
                        className="flex h-8 items-center gap-1 px-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-stone-800 text-[11px] font-medium transition-colors active:scale-95"
                      >
                        <IoNavigateOutline className="text-sm" /> Đi tới nguồn
                      </button>
                    )}

                    {/* Delete Whole Card */}
                    {onDeleteCard && (
                      <button
                        type="button"
                        aria-label="Xóa thẻ"
                        title="Xóa thẻ"
                        onClick={() => onDeleteCard(node.nodeId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-600 active:scale-95 transition-all"
                      >
                        <IoTrashOutline className="text-sm" />
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
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
