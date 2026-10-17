import React, { useState } from 'react';
import {
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoNavigateOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';
import type { CaseGraphNode } from '../../../shared/contracts/knowledge-graph';

interface UnorganizedDrawerProps {
  unplacedNodes: CaseGraphNode[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onPlaceNode: (node: CaseGraphNode) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
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

  return (
    <div className="corkboard-drawer absolute bottom-0 left-0 right-0 z-30 transition-all duration-300">
      {/* Drawer Handle Header */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between bg-stone-900/95 hover:bg-stone-900 text-stone-200 px-4 py-2 border-t border-stone-700 shadow-xl backdrop-blur-md focus-visible:outline-none"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
          <span>KHAY MANH MỐI MỚI</span>
          <span className="rounded-full bg-rose-600/80 px-2 py-0.5 text-[10px] text-white font-semibold">
            {unplacedNodes.length} chưa đưa lên bảng
          </span>
        </span>
        <span className="text-stone-400 text-lg">
          {isOpen ? <IoChevronDownOutline /> : <IoChevronUpOutline />}
        </span>
      </button>

      {/* Drawer Content Body */}
      {isOpen && (
        <div className="max-h-56 overflow-y-auto bg-stone-950/95 p-3 border-t border-stone-800 shadow-2xl backdrop-blur-lg">
          {/* Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
            {([
              { id: 'all', label: 'Tất cả' },
              { id: 'chat', label: 'Zola / Tin nhắn' },
              { id: 'bank', label: 'Techcornbank' },
              { id: 'order', label: 'Shopoo' },
              { id: 'phone', label: 'Điện thoại' },
            ] as const).map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Card List */}
          {filteredNodes.length === 0 ? (
            <p className="py-4 text-center text-xs text-stone-400">
              Không còn manh mối nào trong khay. Hãy snoop điện thoại để ghim thêm!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {filteredNodes.map(node => (
                <div
                  key={node.nodeId}
                  className="flex items-center justify-between gap-2 rounded-xl border border-stone-800 bg-stone-900/90 p-2.5 shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-stone-100">{node.label}</p>
                    {node.subtitle && (
                      <p className="truncate text-[10px] text-stone-400">{node.subtitle}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Deep Link to Source */}
                    {node.sourceAppId && (
                      <button
                        type="button"
                        aria-label="Đi tới nguồn manh mối"
                        onClick={() => onNavigateToSource(node.sourceAppId, node.recordRefId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-white"
                      >
                        <IoNavigateOutline className="text-base" />
                      </button>
                    )}

                    {/* Place onto Canvas */}
                    <button
                      type="button"
                      onClick={() => onPlaceNode(node)}
                      className="flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow"
                    >
                      <IoAddCircleOutline className="text-sm" /> Đưa lên bảng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
