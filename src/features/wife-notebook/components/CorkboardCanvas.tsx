import React, { useMemo, useRef } from 'react';
import {
  IoNavigateOutline,
  IoGlassesOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoCallOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoCutOutline,
  IoCloseOutline,
  IoChatbubblesOutline,
  IoCardOutline,
  IoCartOutline,
  IoChatboxOutline,
  IoImagesOutline,
  IoDocumentTextOutline,
  IoBookOutline,
} from 'react-icons/io5';
import { CANVAS_SIZE } from '../graphEngine';
import type { CorkboardViewport, PlacedNode, PairingState } from '../types';
import type { CaseGraphEdge } from '../../../shared/contracts/knowledge-graph';

interface CorkboardCanvasProps {
  viewport: CorkboardViewport;
  placedNodes: PlacedNode[];
  edges: CaseGraphEdge[];
  activePairing: PairingState;
  unmaskedSuspectIds: string[];
  activeContradictions: string[];
  selectedEdgeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onSeverEdge: (edgeId: string) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
  onCancelPairing: () => void;
}

/**
 * Maps source app IDs to their brand metadata, canonical Ionicons, and theme colors.
 */
function getAppMeta(sourceAppId?: string) {
  switch (sourceAppId) {
    case 'internet-messaging':
    case 'zola':
      return {
        name: 'Zola',
        icon: IoChatbubblesOutline,
        color: '#0284c7', // sky-600
        bg: '#e0f2fe',    // sky-100
      };
    case 'banking':
    case 'techcornbank':
      return {
        name: 'Techcornbank',
        icon: IoCardOutline,
        color: '#dc2626', // red-600
        bg: '#fee2e2',    // red-100
      };
    case 'ecommerce':
    case 'shopoo':
    case 'poshee':
      return {
        name: 'Shopoo',
        icon: IoCartOutline,
        color: '#ea580c', // orange-600
        bg: '#ffedd5',    // orange-100
      };
    case 'phone':
      return {
        name: 'Điện thoại',
        icon: IoCallOutline,
        color: '#059669', // emerald-600
        bg: '#d1fae5',    // emerald-100
      };
    case 'messages':
      return {
        name: 'Tin nhắn SMS',
        icon: IoChatboxOutline,
        color: '#059669',
        bg: '#d1fae5',
      };
    case 'photos':
      return {
        name: 'Ảnh',
        icon: IoImagesOutline,
        color: '#d97706',
        bg: '#fef3c7',
      };
    case 'personal-notes':
      return {
        name: 'Ghi chú',
        icon: IoDocumentTextOutline,
        color: '#ca8a04',
        bg: '#fef9c3',
      };
    default:
      return null;
  }
}

export const CorkboardCanvas: React.FC<CorkboardCanvasProps> = ({
  viewport,
  placedNodes,
  edges,
  activePairing,
  unmaskedSuspectIds,
  activeContradictions,
  selectedEdgeId,
  onSelectNode,
  onMoveNode,
  onSelectEdge,
  onSeverEdge,
  onNavigateToSource,
  onCancelPairing,
}) => {
  // Map of node positions for drawing edges
  const nodeMap = useMemo(() => {
    const map = new Map<string, PlacedNode>();
    for (const node of placedNodes) {
      map.set(node.nodeId, node);
    }
    return map;
  }, [placedNodes]);

  // Card dragging state reference
  const cardDragRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  } | null>(null);

  // Transform calculation for corkboard camera
  // Center camera at (viewport.x, viewport.y)
  const transformStyle = {
    transform: `translate3d(calc(50% - ${viewport.x * viewport.zoom}px), calc(50% - ${viewport.y * viewport.zoom}px), 0) scale(${viewport.zoom})`,
    transformOrigin: '0 0',
  };

  const getNodeTypeIcon = (type: string, isAlias: boolean, isUnmasked: boolean) => {
    if (isAlias && !isUnmasked) return <IoGlassesOutline className="text-purple-600" />;
    switch (type) {
      case 'suspect': return <IoPersonOutline className="text-rose-600" />;
      case 'bridge_id': return <IoCallOutline className="text-amber-600" />;
      case 'record_clue': return <IoReceiptOutline className="text-blue-600" />;
      case 'timeline_slot': return <IoTimeOutline className="text-emerald-600" />;
      default: return <IoReceiptOutline className="text-slate-600" />;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#2c1f18] cursor-grab active:cursor-grabbing">
      {/* Corkboard Texture Pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#8b5a2b 1px, transparent 1px), radial-gradient(#6d431c 1px, #2c1f18 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Empty State Overlay */}
      {placedNodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-20">
          <div className="h-16 w-16 rounded-3xl bg-stone-900/80 border border-stone-700/80 shadow-2xl flex items-center justify-center text-pink-400 text-3xl mb-3 backdrop-blur-md">
            <IoBookOutline />
          </div>
          <h3 className="text-sm font-extrabold text-stone-200 uppercase tracking-wider">
            Bảng điều tra đang trống
          </h3>
          <p className="mt-1 text-xs text-stone-400 max-w-xs leading-relaxed">
            Lướt xem các ứng dụng điện thoại và nhấn giữ (380ms) vào các dấu vết đáng ngờ để thu thập manh mối vào Sổ tay!
          </p>
        </div>
      )}

      {/* Pairing Banner Indicator */}
      {activePairing.sourceNodeId && (
        <div className="absolute top-2 left-4 right-4 z-30 flex items-center justify-between rounded-xl bg-rose-950/90 border border-rose-500/60 p-2.5 px-4 text-xs font-semibold text-rose-100 shadow-xl backdrop-blur-md animate-pulse">
          <span>ĐANG NỐI DÂY: Nhấn thẻ thứ hai để kết nối...</span>
          <button
            type="button"
            onClick={onCancelPairing}
            className="flex items-center gap-1 rounded-lg bg-rose-700/80 hover:bg-rose-600 px-2.5 py-1 text-[11px] text-white active:scale-95"
          >
            <IoCloseOutline className="text-base" /> Huỷ
          </button>
        </div>
      )}

      {/* Zoomable & Pannable Virtual Plane */}
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: `${CANVAS_SIZE}px`,
          height: `${CANVAS_SIZE}px`,
          ...transformStyle,
        }}
      >
        {/* SVG String / Edge Canvas */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="string-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {edges.map(edge => {
            const source = nodeMap.get(edge.sourceNodeId);
            const target = nodeMap.get(edge.targetNodeId);
            if (!source || !target) return null;

            // Card center approx: width 230px, height 120px
            const x1 = source.x + 115;
            const y1 = source.y + 60;
            const x2 = target.x + 115;
            const y2 = target.y + 60;

            const isContradiction = edge.relationship === 'contradicts_alibi';
            const isSelected = selectedEdgeId === edge.edgeId;

            return (
              <g key={edge.edgeId} className="pointer-events-auto cursor-pointer" onClick={() => onSelectEdge(edge.edgeId)}>
                {/* Hit area for tapping string */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="transparent"
                  strokeWidth="24"
                />
                {/* Red Detective Yarn or Yellow Contradiction String */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isContradiction ? '#f59e0b' : '#ef4444'}
                  strokeWidth={isSelected ? '5' : isContradiction ? '3.5' : '3'}
                  strokeDasharray={isContradiction ? '6 4' : undefined}
                  filter="url(#string-shadow)"
                  className="transition-all duration-150"
                />
                {/* String Pins at ends */}
                <circle cx={x1} cy={y1} r="4" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                <circle cx={x2} cy={y2} r="4" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
              </g>
            );
          })}
        </svg>

        {/* Node Cards */}
        {placedNodes.map(node => {
          const isSelected = activePairing.sourceNodeId === node.nodeId;
          const isAlias = node.type === 'alias';
          const isUnmasked = unmaskedSuspectIds.includes(node.nodeId) || (isAlias && unmaskedSuspectIds.length > 0);
          const hasContradiction = activeContradictions.some(id => id.includes(node.nodeId));
          const appMeta = getAppMeta(node.sourceAppId);

          return (
            <div
              key={node.nodeId}
              data-node-id={node.nodeId}
              onPointerDown={e => {
                if (e.button !== 0) return;
                // Don't drag if clicking deep link button
                if ((e.target as HTMLElement).closest('button')) return;
                e.stopPropagation();
                cardDragRef.current = {
                  nodeId: node.nodeId,
                  startX: e.clientX,
                  startY: e.clientY,
                  origX: node.x,
                  origY: node.y,
                  hasMoved: false,
                };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={e => {
                const drag = cardDragRef.current;
                if (!drag || drag.nodeId !== node.nodeId) return;
                e.stopPropagation();
                const dx = (e.clientX - drag.startX) / viewport.zoom;
                const dy = (e.clientY - drag.startY) / viewport.zoom;
                if (Math.hypot(dx, dy) > 4) {
                  drag.hasMoved = true;
                }
                const newX = Math.max(20, Math.min(CANVAS_SIZE - 250, drag.origX + dx));
                const newY = Math.max(20, Math.min(CANVAS_SIZE - 180, drag.origY + dy));
                onMoveNode(node.nodeId, newX, newY);
              }}
              onPointerUp={e => {
                const drag = cardDragRef.current;
                if (!drag || drag.nodeId !== node.nodeId) return;
                try {
                  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
                if (!drag.hasMoved) {
                  // This was a click/tap, select for pairing!
                  onSelectNode(node.nodeId);
                }
                cardDragRef.current = null;
              }}
              className={`corkboard-node-card absolute z-20 w-[230px] rounded-2xl border p-3.5 shadow-2xl transition-shadow cursor-move ${
                isSelected
                  ? 'border-rose-400 bg-amber-50 ring-4 ring-rose-400/60 scale-105'
                  : isUnmasked && isAlias
                  ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-400'
                  : hasContradiction
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400'
                  : 'border-stone-300 bg-stone-100/95 hover:bg-stone-50'
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                touchAction: 'none',
              }}
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white/80" />
              </div>

              {/* Top Bar: App Badge & Deep-Link Jump Button */}
              <div className="flex items-center justify-between gap-1 border-b border-stone-200 pb-2 pt-1">
                {appMeta ? (
                  <div
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold border"
                    style={{
                      backgroundColor: appMeta.bg,
                      color: appMeta.color,
                      borderColor: `${appMeta.color}35`,
                    }}
                  >
                    <appMeta.icon className="text-sm shrink-0" />
                    <span className="truncate">{appMeta.name}</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    <span className="text-sm">{getNodeTypeIcon(node.type, isAlias, isUnmasked)}</span>
                    {isAlias && !isUnmasked ? 'Vỏ bọc' : node.type.replace('_', ' ')}
                  </span>
                )}

                {/* Clue Location Jump Button */}
                {node.sourceAppId && (
                  <button
                    type="button"
                    aria-label="Đi tới nguồn manh mối"
                    onClick={e => {
                      e.stopPropagation();
                      onNavigateToSource(node.sourceAppId, node.recordRefId);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-200/80 hover:bg-rose-100 hover:text-rose-600 text-stone-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 active:scale-95"
                  >
                    <IoNavigateOutline className="text-base" />
                  </button>
                )}
              </div>

              {/* Card Content */}
              <div className="pt-2">
                <h4 className="text-[13px] font-extrabold leading-tight text-stone-900">
                  {isAlias && isUnmasked
                    ? `[BÓC TRẦN] ${node.label}`
                    : node.label}
                </h4>
                {node.subtitle && (
                  <p className="mt-1 text-[11px] leading-snug text-stone-600 line-clamp-2">
                    {node.subtitle}
                  </p>
                )}
              </div>

              {/* Special Status Tags */}
              {isAlias && isUnmasked && (
                <div className="mt-2 flex items-center gap-1 rounded-lg bg-rose-600/10 px-2 py-1 text-[10px] font-bold text-rose-700">
                  <span>Khớp danh tính pháp lý</span>
                </div>
              )}
              {hasContradiction && (
                <div className="mt-2 flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-800">
                  <IoFlashOutline className="text-xs shrink-0" />
                  <span>Mâu thuẫn ngoại phạm</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Edge Action Popover */}
      {selectedEdgeId && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl bg-stone-900/90 border border-stone-700 p-2 px-3 shadow-2xl backdrop-blur-md">
          <span className="text-xs font-medium text-stone-200">Đã chọn sợi dây đỏ</span>
          <button
            type="button"
            onClick={() => onSeverEdge(selectedEdgeId)}
            className="flex items-center gap-1 rounded-xl bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow active:scale-95"
          >
            <IoCutOutline className="text-sm" /> Cắt dây
          </button>
          <button
            type="button"
            onClick={() => onSelectEdge(null)}
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <IoCloseOutline className="text-base" />
          </button>
        </div>
      )}
    </div>
  );
};
