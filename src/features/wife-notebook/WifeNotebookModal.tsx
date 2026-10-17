import React, { useState, useMemo, useCallback } from 'react';
import {
  IoArrowBackOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoRefreshOutline,
  IoGridOutline,
} from 'react-icons/io5';
import { LEVEL_01_KNOWLEDGE_GRAPH } from './level01Fixture';
import {
  createEdgeBetweenNodes,
  evaluateUnmaskedSuspects,
  evaluateContradictions,
  autoArrangeNodes,
  CANVAS_SIZE,
} from './graphEngine';
import { useCorkboardGestures } from './useCorkboardGestures';
import { MiniMapRadar } from './components/MiniMapRadar';
import { CorkboardCanvas } from './components/CorkboardCanvas';
import { UnorganizedDrawer } from './components/UnorganizedDrawer';
import type { PlacedNode, PairingState } from './types';
import type { CaseKnowledgeGraph, CaseGraphEdge, CaseGraphNode } from '../../shared/contracts/knowledge-graph';
import type { AppId } from '../../shared/contracts/app-contracts';

export interface WifeNotebookModalProps {
  knowledgeGraph?: CaseKnowledgeGraph;
  onClose: () => void;
  onNavigateToSource?: (appId: AppId, recordRefId?: string) => void;
  onConfront?: () => void;
}

export const WifeNotebookModal: React.FC<WifeNotebookModalProps> = ({
  knowledgeGraph = LEVEL_01_KNOWLEDGE_GRAPH,
  onClose,
  onNavigateToSource,
  onConfront,
}) => {
  // Initial distribution: place the 3 starting clues on the board, keep rest in drawer
  const [placedNodes, setPlacedNodes] = useState<PlacedNode[]>(() => {
    const initialPlacedIds = ['node_alias_tuan', 'node_bridge_phone', 'node_record_zola_chat'];
    const initial = knowledgeGraph.nodes.filter(n => initialPlacedIds.includes(n.nodeId));
    return autoArrangeNodes(
      initial.map(n => ({ ...n, x: 600, y: 600 })),
    );
  });

  const [unplacedNodes, setUnplacedNodes] = useState<CaseGraphNode[]>(() => {
    const initialPlacedIds = ['node_alias_tuan', 'node_bridge_phone', 'node_record_zola_chat'];
    return knowledgeGraph.nodes.filter(n => !initialPlacedIds.includes(n.nodeId));
  });

  const [edges, setEdges] = useState<CaseGraphEdge[]>([]);
  const [activePairing, setActivePairing] = useState<PairingState>({ sourceNodeId: null });
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Corkboard gestures and zoom engine
  const {
    viewport,
    zoomIn,
    zoomOut,
    resetZoom,
    setCenter,
    containerProps,
  } = useCorkboardGestures();

  // Graph Evaluation State
  const unmaskedSuspectIds = useMemo(
    () => evaluateUnmaskedSuspects(knowledgeGraph, edges),
    [knowledgeGraph, edges],
  );

  const activeContradictions = useMemo(
    () => evaluateContradictions(edges),
    [edges],
  );

  const verifiedSmokingGunsCount = useMemo(() => {
    return edges.filter(
      e => e.isSmokingGun && knowledgeGraph.requiredSmokingGunEdgeIds.includes(e.edgeId),
    ).length;
  }, [edges, knowledgeGraph.requiredSmokingGunEdgeIds]);

  // Tap-to-Connect Pairing State Machine
  const handleSelectNode = useCallback((nodeId: string) => {
    if (!activePairing.sourceNodeId) {
      // First tap: Select Node A
      setActivePairing({ sourceNodeId: nodeId });
      return;
    }

    if (activePairing.sourceNodeId === nodeId) {
      // Tapped same node again: cancel selection
      setActivePairing({ sourceNodeId: null });
      return;
    }

    // Second tap: Attempt connection between Node A and Node B
    const { newEdge, isDuplicate } = createEdgeBetweenNodes(
      knowledgeGraph,
      edges,
      activePairing.sourceNodeId,
      nodeId,
    );

    if (newEdge && !isDuplicate) {
      setEdges(prev => [...prev, newEdge]);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(30); } catch { /* ignore */ }
      }
    }

    // Reset pairing mode
    setActivePairing({ sourceNodeId: null });
  }, [activePairing.sourceNodeId, edges, knowledgeGraph]);

  const handleSeverEdge = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(e => e.edgeId !== edgeId));
    setSelectedEdgeId(null);
  }, []);

  const handlePlaceNode = useCallback((node: CaseGraphNode) => {
    setUnplacedNodes(prev => prev.filter(n => n.nodeId !== node.nodeId));
    setPlacedNodes(prev => [
      ...prev,
      {
        ...node,
        x: Math.max(80, Math.min(CANVAS_SIZE - 280, viewport.x - 110)),
        y: Math.max(80, Math.min(CANVAS_SIZE - 180, viewport.y - 50)),
      },
    ]);
  }, [viewport.x, viewport.y]);

  const handleAutoArrange = useCallback(() => {
    setPlacedNodes(prev => autoArrangeNodes(prev));
  }, []);

  const handleCenterCluster = useCallback(() => {
    if (placedNodes.length === 0) {
      setCenter(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      return;
    }
    const avgX = placedNodes.reduce((acc, n) => acc + n.x + 110, 0) / placedNodes.length;
    const avgY = placedNodes.reduce((acc, n) => acc + n.y + 50, 0) / placedNodes.length;
    setCenter(avgX, avgY);
  }, [placedNodes, setCenter]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#1c1917] text-white">
      {/* Top Header */}
      <header className="relative z-40 flex items-center justify-between bg-[#D81B60] px-3 py-2.5 shadow-md">
        <button
          type="button"
          aria-label="Quay lại điện thoại"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
        >
          <IoArrowBackOutline className="text-xl" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-black tracking-wide uppercase text-white drop-shadow-sm">
            BẢNG ĐIỀU TRA NỐI DÂY
          </h2>
          <span className="text-[10px] font-semibold text-pink-100">
            Tiến độ: {verifiedSmokingGunsCount}/{knowledgeGraph.requiredSmokingGunEdgeIds.length} Bằng chứng cốt lõi
          </span>
        </div>

        {/* Mini-Map Radar */}
        <MiniMapRadar
          viewport={viewport}
          placedNodes={placedNodes}
          onCenterCluster={handleCenterCluster}
        />
      </header>

      {/* Main Corkboard Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden" {...containerProps}>
        <CorkboardCanvas
          viewport={viewport}
          placedNodes={placedNodes}
          edges={edges}
          activePairing={activePairing}
          unmaskedSuspectIds={unmaskedSuspectIds}
          activeContradictions={activeContradictions}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={handleSelectNode}
          onSelectEdge={setSelectedEdgeId}
          onSeverEdge={handleSeverEdge}
          onNavigateToSource={(appId, recId) => onNavigateToSource?.(appId as AppId, recId)}
          onCancelPairing={() => setActivePairing({ sourceNodeId: null })}
        />

        {/* Floating Bottom Control Dock */}
        <div className="corkboard-control-dock absolute bottom-12 left-4 right-4 z-30 flex items-center justify-between rounded-2xl bg-black/75 border border-stone-700/60 p-1.5 px-3 shadow-2xl backdrop-blur-md">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Thu nhỏ"
              onClick={zoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-90"
            >
              <IoRemoveOutline className="text-base" />
            </button>

            <span className="min-w-10 text-center font-mono text-xs font-bold text-stone-200">
              {Math.round(viewport.zoom * 100)}%
            </span>

            <button
              type="button"
              aria-label="Phóng to"
              onClick={zoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-90"
            >
              <IoAddOutline className="text-base" />
            </button>

            <button
              type="button"
              aria-label="Đặt lại thu phóng 100%"
              onClick={resetZoom}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-90"
            >
              <IoRefreshOutline className="text-sm" />
            </button>
          </div>

          {/* Auto-Arrange Action */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAutoArrange}
              className="flex items-center gap-1 rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-bold text-fuchsia-300 active:scale-95 border border-fuchsia-400/20"
            >
              <IoGridOutline className="text-sm" /> Xếp gọn
            </button>
            {onConfront && (
              <button
                type="button"
                onClick={onConfront}
                className="flex items-center gap-1 rounded-xl bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow active:scale-95"
              >
                Đối chất
              </button>
            )}
          </div>
        </div>

        {/* Unorganized Bottom Drawer */}
        <UnorganizedDrawer
          unplacedNodes={unplacedNodes}
          isOpen={isDrawerOpen}
          onToggleOpen={() => setDrawerOpen(prev => !prev)}
          onPlaceNode={handlePlaceNode}
          onNavigateToSource={(appId, recId) => onNavigateToSource?.(appId as AppId, recId)}
        />
      </div>
    </div>
  );
};
