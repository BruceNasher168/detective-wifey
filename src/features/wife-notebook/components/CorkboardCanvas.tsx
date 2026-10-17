import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  IoBookOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import type { AppDefinition } from '../../../shared/contracts/app-contracts';
import { CANVAS_SIZE } from '../graphEngine';
import type { CorkboardViewport, PlacedNode, PairingState } from '../types';
import type { CaseGraphEdge } from '../../../shared/contracts/knowledge-graph';
import { formatMessageBullet, formatEventDateTime } from '../../../shared/contracts/evidence';

export const CARD_WIDTH = 210;
export const PIN_OFFSET_X = 105;
export const PIN_OFFSET_Y = 3;

interface CorkboardCanvasProps {
  getSourceApp?: (id: string) => Pick<AppDefinition, 'displayName' | 'icon' | 'iconAsset' | 'themeGradient'> | undefined;
  viewport: CorkboardViewport;
  isPinching?: boolean;
  placedNodes: PlacedNode[];
  edges: CaseGraphEdge[];
  activePairing: PairingState;
  unmaskedSuspectIds: string[];
  activeContradictions: string[];
  selectedEdgeId: string | null;
  selectedNodeId?: string | null;
  onSelectNode: (nodeId: string) => void;
  onSelectCard?: (nodeId: string | null) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onSeverEdge: (edgeId: string) => void;
  onRemoveNode?: (nodeId: string) => void;
  onDeleteCard?: (nodeId: string) => void;
  onDeleteMessage?: (nodeId: string, messageRecordId: string) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
  onCancelPairing: () => void;
}

/**
 * Generates an organic, subtle paper note tilt angle based on the node ID.
 * Makes the corkboard look like a real hand-pinned detective board.
 */
function getCardTilt(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return ((Math.abs(hash) % 32) - 16) / 10; // -1.6deg to +1.6deg
}

/**
 * Calculates a catenary quadratic Bézier curve path and control point
 * simulating natural gravity sag of pinned detective yarn strings.
 */
export function calculateYarnStringCurve(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isContradiction: boolean,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Natural gravity sag: proportional to Euclidean distance
  // Contradiction strings (dashed yellow) are tauter with less sag
  const sag = isContradiction
    ? Math.min(16, Math.max(4, dist * 0.035))
    : Math.min(36, Math.max(8, dist * 0.075));

  const cx = mx;
  const cy = my + sag;
  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return { cx, cy, pathD, dist, sag };
}

export const CorkboardCanvas: React.FC<CorkboardCanvasProps> = ({
  viewport,
  getSourceApp,
  isPinching = false,
  placedNodes,
  edges,
  activePairing,
  unmaskedSuspectIds,
  activeContradictions,
  selectedEdgeId,
  selectedNodeId,
  onSelectNode,
  onSelectCard,
  onMoveNode,
  onSelectEdge,
  onSeverEdge,
  onRemoveNode,
  onDeleteCard,
  onDeleteMessage,
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

  // Active dragging node ID for cursor and rotation styling
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [cardStack, setCardStack] = useState<string[]>([]);

  // Card dragging state reference
  const cardDragRef = useRef<{
    pointerId: number;
    nodeId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  } | null>(null);

  useEffect(() => {
    if (isPinching) {
      cardDragRef.current = null;
      setActiveDragId(null);
    }
  }, [isPinching]);

  // Retain sharp layout zoom; translate panning without relaying out the board.
  const cameraStyle = {
    zoom: viewport.zoom,
    left: `calc(50cqw / ${viewport.zoom})`,
    top: `calc(50cqh / ${viewport.zoom})`,
    transform: `translate(${-viewport.x}px, ${-viewport.y}px)`,
  };
  const stackedNodes = [...placedNodes].sort((a, b) =>
    cardStack.indexOf(a.nodeId) - cardStack.indexOf(b.nodeId));

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
    <div
      className="notebook-cardboard relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ containerType: 'size' }}
      onClick={() => onSelectCard?.(null)}
    >

      {/* Empty State Overlay */}
      {placedNodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-20">
          <div className="h-16 w-16 rounded-3xl bg-[var(--notebook-paper)] border border-[var(--notebook-border)] shadow-md flex items-center justify-center text-[#C2185B] text-3xl mb-3 backdrop-blur-md">
            <IoBookOutline />
          </div>
          <h3 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">
            CHƯA CÓ MANH MỐI NÀO
          </h3>
          <p className="mt-1 text-xs text-stone-700 max-w-xs leading-relaxed">
            Khám phá các ứng dụng trên điện thoại.
            <br />
            <strong>Nhấn giữ</strong> nội dung đáng ngờ để lưu manh mối vào Sổ tay.
          </p>
        </div>
      )}

      {/* Pairing Banner Indicator */}
      {activePairing.sourceNodeId && (
        <div className="absolute top-2 left-4 right-4 z-40 flex items-center justify-between rounded-xl bg-rose-50 border border-rose-300 p-2.5 px-4 text-xs font-semibold text-rose-900 shadow-xl backdrop-blur-md animate-pulse">
          <span>ĐANG NỐI DÂY: Chạm thẻ thứ hai để kết nối...</span>
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
        className="absolute"
        style={{
          width: `${CANVAS_SIZE}px`,
          height: `${CANVAS_SIZE}px`,
          ...cameraStyle,
        }}
      >
        {/* 1. Node Cards Styled as Minimal Realistic Detective Notes */}
        {stackedNodes.map(node => {
          const isSelected = selectedNodeId === node.nodeId || activePairing.sourceNodeId === node.nodeId;
          const isAlias = node.type === 'alias';
          const isUnmasked = unmaskedSuspectIds.includes(node.nodeId) || (isAlias && unmaskedSuspectIds.length > 0);
          const hasContradiction = activeContradictions.some(id => id.includes(node.nodeId));
          const sourceApp = node.sourceAppId ? getSourceApp?.(node.sourceAppId) : undefined;
          const isDraggingThis = activeDragId === node.nodeId;
          const tilt = getCardTilt(node.nodeId);
          const hasMessages = Boolean(node.messages && node.messages.length > 0);
          const hasBody = hasMessages || Boolean(node.subtitle);

          return (
            <div
              key={node.nodeId}
              data-node-id={node.nodeId}
              onPointerDown={e => {
                if (e.button !== 0 || isPinching) return;
                // Don't drag if clicking action buttons
                if ((e.target as HTMLElement).closest('button')) return;
                e.stopPropagation();
                setActiveDragId(node.nodeId);
                setCardStack(previous => [...previous.filter(id => id !== node.nodeId && nodeMap.has(id)), node.nodeId]);
                cardDragRef.current = {
                  pointerId: e.pointerId,
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
                if (!drag || drag.nodeId !== node.nodeId || drag.pointerId !== e.pointerId || isPinching) return;
                e.stopPropagation();
                const dx = (e.clientX - drag.startX) / viewport.zoom;
                const dy = (e.clientY - drag.startY) / viewport.zoom;
                if (Math.hypot(dx, dy) > 4) {
                  drag.hasMoved = true;
                }
                const newX = Math.max(20, Math.min(CANVAS_SIZE - 230, drag.origX + dx));
                const newY = Math.max(20, Math.min(CANVAS_SIZE - 180, drag.origY + dy));
                onMoveNode(node.nodeId, newX, newY);
              }}
              onPointerUp={e => {
                const drag = cardDragRef.current;
                if (!drag || drag.nodeId !== node.nodeId || drag.pointerId !== e.pointerId || isPinching) return;
                try {
                  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
                if (!drag.hasMoved) {
                  // Click / tap selects card and handles pairing
                  onSelectCard?.(node.nodeId);
                  onSelectNode(node.nodeId);
                }
                cardDragRef.current = null;
                setActiveDragId(null);
              }}
              onPointerCancel={() => {
                cardDragRef.current = null;
                setActiveDragId(null);
              }}
              className={`corkboard-node-card absolute rounded-xl border p-2.5 pt-[15px] cursor-grab active:cursor-grabbing transition-[box-shadow,transform] duration-150 ${
                isDraggingThis
                  ? 'z-10 border-rose-400 bg-[#FFFDF5] shadow-[0_22px_40px_-4px_rgba(0,0,0,0.3),0_12px_22px_-6px_rgba(0,0,0,0.18)] ring-2 ring-rose-400/60'
                  : isSelected
                  ? 'z-10 border-rose-500 bg-[#FFFBEB] ring-4 ring-rose-400/60 scale-105 shadow-[0_8px_24px_rgba(225,29,72,0.35)]'
                  : isUnmasked && isAlias
                  ? 'z-10 border-rose-400 bg-[#FFF5F5] ring-1 ring-rose-300 shadow-[0_4px_12px_rgba(30,20,10,0.25)]'
                  : hasContradiction
                  ? 'z-10 border-amber-400 bg-[#FFFDF0] ring-1 ring-amber-300 shadow-[0_4px_12px_rgba(30,20,10,0.25)]'
                  : 'z-10 border-[#E8E0D2] bg-[#FFFDF5] shadow-[0_3px_10px_rgba(35,22,12,0.2)] hover:shadow-[0_6px_16px_rgba(35,22,12,0.3)]'
              }`}
              style={{
                width: `${CARD_WIDTH}px`,
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: isDraggingThis ? 'scale(1.05) rotate(0deg)' : `rotate(${tilt}deg)`,
                touchAction: 'none',
              }}
            >
              {/* Realistic 3D Pushpin at Top Center */}
              <div className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center" style={{ top: PIN_OFFSET_Y - 10 }}>
                <div className={`relative h-5 w-5 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-900 border border-rose-300/60 flex items-center justify-center transition-transform duration-150 ${
                  isDraggingThis ? 'scale-110 shadow-[0_4px_8px_rgba(0,0,0,0.5)]' : 'shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                }`}>
                  <div className="absolute top-0.5 left-1 h-1.5 w-1.5 rounded-full bg-white/75 blur-[0.3px]" />
                  <div className="h-1 w-1 rounded-full bg-red-950/80 shadow-inner" />
                </div>
                <div className={`w-1 h-0.5 bg-stone-900/35 rounded-full blur-[0.5px] -mt-0.5 transition-opacity duration-150 ${
                  isDraggingThis ? 'opacity-30' : 'opacity-100'
                }`} />
              </div>

              {/* Top Bar: App Badge, Contact Title, and Action Buttons */}
              <div className={`relative min-h-[24px] pt-0.5 ${hasBody ? 'border-b border-[#E8DFC8]/60 pb-1.5' : 'pb-0.5'}`}>
                <div
                  className="flex min-w-0 items-center gap-1.5 h-6 w-full"
                  style={isSelected ? {
                    WebkitMaskImage: `linear-gradient(to right, black calc(100% - ${node.sourceAppId ? 88 : 56}px), transparent calc(100% - ${node.sourceAppId ? 58 : 28}px))`,
                    maskImage: `linear-gradient(to right, black calc(100% - ${node.sourceAppId ? 88 : 56}px), transparent calc(100% - ${node.sourceAppId ? 58 : 28}px))`,
                  } : undefined}
                >
                  {sourceApp ? (
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md text-white ${sourceApp.iconAsset ? '' : `bg-gradient-to-br ${sourceApp.themeGradient}`}`}
                      title={sourceApp.displayName}
                      role="img"
                      aria-label={sourceApp.displayName}
                    >
                      {sourceApp.iconAsset ? (
                        <img src={sourceApp.iconAsset} alt="" aria-hidden="true" draggable={false} className="h-full w-full" />
                      ) : <sourceApp.icon className="text-sm" />}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs">{getNodeTypeIcon(node.type, isAlias, isUnmasked)}</span>
                  )}
                  <h4 className="text-[10px] font-bold leading-snug text-stone-900 tracking-tight line-clamp-2">
                    {isAlias && isUnmasked
                      ? `[BÓC TRẦN] ${node.label}`
                      : node.label}
                  </h4>
                </div>

                {/* Card-level Action Buttons: Exactly two buttons [Đến chat] and [Xóa] */}
                <div
                  className={`absolute right-0 top-0.5 h-6 z-10 flex items-center gap-1 ${isSelected ? '' : 'invisible pointer-events-none'}`}
                  inert={!isSelected}
                >
                  {/* Đến chat / Go to conversation button */}
                  {node.sourceAppId && (
                    <button
                      type="button"
                      aria-label="Đến chat"
                      title="Đến chat"
                      onClick={e => {
                        e.stopPropagation();
                        onNavigateToSource(node.sourceAppId, node.conversationId || node.recordRefId);
                      }}
                      className="relative flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 hover:bg-rose-100 hover:text-rose-600 text-stone-600 transition-colors active:scale-90 shadow-xs cursor-pointer before:absolute before:-inset-2"
                    >
                      <IoNavigateOutline className="text-xs" />
                    </button>
                  )}

                  {/* Xóa thẻ button */}
                  <button
                    type="button"
                    aria-label="Xóa"
                    title="Xóa thẻ"
                    onClick={e => {
                      e.stopPropagation();
                      if (onDeleteCard) onDeleteCard(node.nodeId);
                      else onRemoveNode?.(node.nodeId);
                    }}
                    className="relative flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 hover:bg-rose-100 hover:text-rose-600 text-stone-600 transition-colors active:scale-90 shadow-xs cursor-pointer before:absolute before:-inset-2"
                  >
                    <IoTrashOutline className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              {hasMessages ? (
                /* Grouped Messages: Rendered as Bullets */
                <div className="pt-1.5 space-y-1.5">
                  {node.messages!.map(msg => (
                    <div key={msg.recordId} className="relative min-h-[1.25rem]">
                      <p
                        className="w-full text-[10px] text-stone-700 leading-tight line-clamp-2 pl-2.5 -indent-2.5"
                        style={isSelected ? {
                          WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 52px), transparent calc(100% - 26px))',
                          maskImage: 'linear-gradient(to right, black calc(100% - 52px), transparent calc(100% - 26px))',
                        } : undefined}
                      >
                        {formatMessageBullet(msg.text, msg.eventDate, msg.eventTime, msg.rawTimestamp)}
                      </p>
                      <button
                        type="button"
                        aria-label="Xóa tin nhắn"
                        title="Xóa tin nhắn"
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteMessage?.(node.nodeId, msg.recordId);
                        }}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-5 w-5 items-center justify-center rounded text-stone-400 hover:text-rose-600 hover:bg-rose-100/80 transition-colors active:scale-90 cursor-pointer before:absolute before:-inset-1.5 ${isSelected ? '' : 'invisible pointer-events-none'}`}
                        inert={!isSelected}
                      >
                        <IoTrashOutline className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : node.subtitle ? (
                /* Transaction, Order, or Single Record Body */
                <div className="pt-1.5">
                  {(node.eventTime || node.eventDate || node.rawTimestamp) && (
                    <span className="text-[9px] font-semibold text-stone-500 block mb-0.5">
                      {formatEventDateTime(node.eventDate, node.eventTime, node.rawTimestamp)}
                    </span>
                  )}
                  <p className="text-[10px] text-stone-600 italic line-clamp-2 leading-tight">
                    "{node.subtitle}"
                  </p>
                </div>
              ) : null /* Person/conversation-only pin has no body */}

              {/* Special Status Stamped Tags */}
              {isAlias && isUnmasked && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                  <span>Khớp danh tính</span>
                </div>
              )}
              {hasContradiction && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                  <IoFlashOutline className="text-[10px] shrink-0 text-amber-600" />
                  <span>Mâu thuẫn</span>
                </div>
              )}
            </div>
          );
        })}

        {/* 2. SVG Red String Layer Rendered ON TOP of Cards (z-30) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="string-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.5" dy="0.75" stdDeviation="0.6" floodColor="#000" floodOpacity="0.15" />
            </filter>
          </defs>

          {edges.map(edge => {
            const source = nodeMap.get(edge.sourceNodeId);
            const target = nodeMap.get(edge.targetNodeId);
            if (!source || !target) return null;

            // Connect lines DIRECTLY from the pushpins (top center of the card)
            const x1 = source.x + PIN_OFFSET_X;
            const y1 = source.y + PIN_OFFSET_Y;
            const x2 = target.x + PIN_OFFSET_X;
            const y2 = target.y + PIN_OFFSET_Y;

            const isContradiction = edge.relationship === 'contradicts_alibi';
            const isSelected = selectedEdgeId === edge.edgeId;
            const { pathD } = calculateYarnStringCurve(x1, y1, x2, y2, isContradiction);

            return (
              <g
                key={edge.edgeId}
                className="corkboard-string pointer-events-auto cursor-pointer"
                onClick={() => onSelectEdge(edge.edgeId)}
                onDoubleClick={event => {
                  event.stopPropagation();
                  onSeverEdge(edge.edgeId);
                }}
              >
                {/* Hit area for tapping string */}
                <path
                  d={pathD}
                  stroke="transparent"
                  strokeWidth="24"
                  fill="none"
                />
                {/* Slender Detective Yarn with 50% opacity and multiply blend mode */}
                <path
                  d={pathD}
                  stroke={isSelected ? '#e36579' : isContradiction ? '#f59e0b' : '#cd5252'}
                  strokeWidth={isSelected ? '2.5' : isContradiction ? '1.75' : '1.5'}
                  strokeDasharray={isContradiction ? '5 3' : undefined}
                  strokeOpacity={isSelected ? 0.85 : 0.5}
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#string-shadow)"
                  style={{ mixBlendMode: 'multiply' }}
                  className="transition-all duration-150"
                />
                {/* Slender string knot eyelet at the pin */}
                <circle cx={x1} cy={y1} r="3" fill="#991b1b" stroke="#fecaca" strokeWidth="0.75" />
                <circle cx={x2} cy={y2} r="3" fill="#991b1b" stroke="#fecaca" strokeWidth="0.75" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Edge Action Popover */}
      {selectedEdgeId && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl bg-[var(--notebook-paper)] border border-[var(--notebook-border)] p-2 px-3 shadow-2xl backdrop-blur-md">
          <span className="text-xs font-medium text-stone-800">Đã chọn sợi dây đỏ</span>
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
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800"
          >
            <IoCloseOutline className="text-base" />
          </button>
        </div>
      )}
    </div>
  );
};
