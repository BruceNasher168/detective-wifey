import React, { useMemo } from 'react';
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
  onSelectEdge: (edgeId: string | null) => void;
  onSeverEdge: (edgeId: string) => void;
  onNavigateToSource: (sourceAppId?: string, recordRefId?: string) => void;
  onCancelPairing: () => void;
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

  // Transform calculation for corkboard camera
  // Center camera at (viewport.x, viewport.y)
  const transformStyle = {
    transform: `translate3d(calc(50% - ${viewport.x * viewport.zoom}px), calc(50% - ${viewport.y * viewport.zoom}px), 0) scale(${viewport.zoom})`,
    transformOrigin: '0 0',
  };

  const getNodeIcon = (type: string, isAlias: boolean, isUnmasked: boolean) => {
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

            // Card center approx: width 220px, height 100px
            const x1 = source.x + 110;
            const y1 = source.y + 50;
            const x2 = target.x + 110;
            const y2 = target.y + 50;

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

          return (
            <div
              key={node.nodeId}
              data-node-id={node.nodeId}
              onClick={() => onSelectNode(node.nodeId)}
              className={`corkboard-node-card absolute z-20 w-[220px] rounded-xl border p-3 shadow-2xl transition-all duration-150 cursor-pointer ${
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
              }}
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-rose-600 border border-white shadow-md flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between gap-1 border-b border-stone-200 pb-1.5 pt-1">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  <span className="text-base">{getNodeIcon(node.type, isAlias, isUnmasked)}</span>
                  {isAlias && !isUnmasked ? 'Vỏ bọc bí mật' : node.type.replace('_', ' ')}
                </span>

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
                <div className="mt-2 flex items-center gap-1 rounded bg-rose-600/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  <span>Khớp danh tính pháp lý</span>
                </div>
              )}
              {hasContradiction && (
                <div className="mt-2 flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                  <IoFlashOutline className="text-xs" />
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
