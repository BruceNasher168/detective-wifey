import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  IoArrowBackOutline,
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
import './notebook.css';
import type { PlacedNode, PairingState, TaggedEvidenceItem } from './types';
import type { CaseKnowledgeGraph, CaseGraphEdge, CaseGraphNode } from '../../shared/contracts/knowledge-graph';
import type { AppDefinition, AppId } from '../../shared/contracts/app-contracts';

export interface WifeNotebookModalProps {
  getSourceApp?: (id: string) => Pick<AppDefinition, 'displayName' | 'icon' | 'iconAsset' | 'themeGradient'> | undefined;
  caseId?: string;
  knowledgeGraph?: CaseKnowledgeGraph;
  taggedSuspects?: TaggedEvidenceItem[];
  onClose: () => void;
  onNavigateToSource?: (appId: AppId, recordRefId?: string) => void;
  onConfront?: () => void;
  onReturnHome?: () => void;
}

interface SavedCorkboardState {
  placedNodes: PlacedNode[];
  edges: CaseGraphEdge[];
}

function getStorageKey(caseId?: string): string {
  return `detective:v1:${caseId || 'case_hoang_01'}:corkboard_state`;
}

function loadSavedCorkboard(caseId?: string): SavedCorkboardState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(getStorageKey(caseId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.placedNodes) && Array.isArray(parsed.edges)) {
        return parsed as SavedCorkboardState;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function persistCorkboard(caseId: string | undefined, placedNodes: PlacedNode[], edges: CaseGraphEdge[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(getStorageKey(caseId), JSON.stringify({ placedNodes, edges }));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Maps player tagged clues/suspects from PlaySession to CaseGraphNode items.
 * Matches canonical graph nodes where possible, or generates dynamic nodes.
 */
export function deriveNodesFromTaggedEvidence(
  canonicalGraph: CaseKnowledgeGraph,
  taggedSuspects?: TaggedEvidenceItem[],
): CaseGraphNode[] {
  if (!taggedSuspects || taggedSuspects.length === 0) {
    return [];
  }

  const nodes: CaseGraphNode[] = [];
  const addedNodeIds = new Set<string>();

  for (const tag of taggedSuspects) {
    // 1. Try to match by clueRefId or recordId
    const canonicalMatch = canonicalGraph.nodes.find(n =>
      (tag.evidence?.clueRefId && n.clueRefId === tag.evidence.clueRefId) ||
      (tag.evidence?.recordId && n.sourceAppId === tag.sourceApp && n.recordRefId === tag.evidence.recordId),
    ) ?? (!tag.evidence ? canonicalGraph.nodes.find(n =>
      n.label === tag.displayName || n.nodeId === tag.suspectId,
    ) : undefined);

    if (canonicalMatch) {
      if (!addedNodeIds.has(canonicalMatch.nodeId)) {
        nodes.push(canonicalMatch);
        addedNodeIds.add(canonicalMatch.nodeId);
      }
    } else {
      // Dynamic node generated from pinned evidence
      const dynamicId = `node_${tag.sourceApp}_${tag.evidence?.recordId || tag.suspectId}`;
      if (!addedNodeIds.has(dynamicId)) {
        nodes.push({
          nodeId: dynamicId,
          type: tag.evidence ? 'record_clue' : 'suspect',
          label: tag.evidence?.title ?? tag.displayName,
          subtitle: tag.evidence?.snippet,
          sourceAppId: tag.sourceApp,
          recordRefId: tag.evidence?.recordId,
          clueRefId: tag.evidence?.clueRefId,
          isInitialDisguise: false,
        });
        addedNodeIds.add(dynamicId);
      }
    }
  }

  return nodes;
}

export const WifeNotebookModal: React.FC<WifeNotebookModalProps> = ({
  caseId,
  getSourceApp,
  knowledgeGraph = LEVEL_01_KNOWLEDGE_GRAPH,
  taggedSuspects,
  onClose,
  onNavigateToSource,
  onConfront,
  onReturnHome,
}) => {
  // All tagged evidence derived from PlaySession
  const allTaggedNodes = useMemo(() => {
    return deriveNodesFromTaggedEvidence(knowledgeGraph, taggedSuspects);
  }, [knowledgeGraph, taggedSuspects]);

  // Load saved corkboard state from localStorage
  const savedState = useMemo(() => {
    return loadSavedCorkboard(caseId);
  }, [caseId]);

  // Placed nodes restored from saved state
  const [placedNodes, setPlacedNodes] = useState<PlacedNode[]>(() => {
    if (savedState && savedState.placedNodes.length > 0) {
      // Only keep saved placed nodes that correspond to actual tagged evidence (or canonical nodes)
      const validNodeIds = new Set(allTaggedNodes.map(n => n.nodeId));
      const filtered = savedState.placedNodes.filter(n => validNodeIds.has(n.nodeId));
      if (filtered.length > 0) return filtered;
    }
    return [];
  });

  // Unplaced nodes in drawer: all tagged evidence that is NOT already placed on the board
  const [unplacedNodes, setUnplacedNodes] = useState<CaseGraphNode[]>(() => {
    const placedIds = new Set((savedState?.placedNodes || []).map(n => n.nodeId));
    return allTaggedNodes.filter(n => !placedIds.has(n.nodeId));
  });

  // Synchronize when new tagged evidence arrives from other apps
  useEffect(() => {
    const placedIds = new Set(placedNodes.map(n => n.nodeId));
    setUnplacedNodes(allTaggedNodes.filter(n => !placedIds.has(n.nodeId)));
  }, [allTaggedNodes, placedNodes]);

  // Edges restored from saved state
  const [edges, setEdges] = useState<CaseGraphEdge[]>(() => {
    return savedState?.edges || [];
  });

  const [activePairing, setActivePairing] = useState<PairingState>({ sourceNodeId: null });
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Corkboard gestures and zoom engine
  const {
    viewport,
    isPinching,
    setViewport,
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

  // Card Movement Handler (repositioning card on the corkboard & persisting)
  const handleMoveNode = useCallback((nodeId: string, x: number, y: number) => {
    setPlacedNodes(prev => {
      const updated = prev.map(n => (n.nodeId === nodeId ? { ...n, x, y } : n));
      persistCorkboard(caseId, updated, edges);
      return updated;
    });
  }, [caseId, edges]);

  // Tap-to-Connect Pairing State Machine & Edge Persist
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
      setEdges(prev => {
        const updated = [...prev, newEdge];
        persistCorkboard(caseId, placedNodes, updated);
        return updated;
      });
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(30); } catch { /* ignore */ }
      }
    }

    // Reset pairing mode
    setActivePairing({ sourceNodeId: null });
  }, [activePairing.sourceNodeId, caseId, edges, knowledgeGraph, placedNodes]);

  const handleSeverEdge = useCallback((edgeId: string) => {
    setEdges(prev => {
      const updated = prev.filter(e => e.edgeId !== edgeId);
      persistCorkboard(caseId, placedNodes, updated);
      return updated;
    });
    setSelectedEdgeId(null);
  }, [caseId, placedNodes]);

  // Remove a node from the corkboard and return it to the clue drawer
  const handleRemoveNode = useCallback((nodeId: string) => {
    const nodeToRemove = placedNodes.find(n => n.nodeId === nodeId);
    if (!nodeToRemove) return;

    const updatedPlaced = placedNodes.filter(n => n.nodeId !== nodeId);
    setPlacedNodes(updatedPlaced);

    setUnplacedNodes(prev => {
      if (prev.some(n => n.nodeId === nodeId)) return prev;
      const baseNode: CaseGraphNode = {
        nodeId: nodeToRemove.nodeId,
        type: nodeToRemove.type,
        label: nodeToRemove.label,
        subtitle: nodeToRemove.subtitle,
        sourceAppId: nodeToRemove.sourceAppId,
        recordRefId: nodeToRemove.recordRefId,
        clueRefId: nodeToRemove.clueRefId,
        isInitialDisguise: nodeToRemove.isInitialDisguise,
      };
      return [...prev, baseNode];
    });

    // Sever all edges connected to this removed node
    const updatedEdges = edges.filter(
      e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId,
    );
    setEdges(updatedEdges);

    if (activePairing.sourceNodeId === nodeId) {
      setActivePairing({ sourceNodeId: null });
    }

    persistCorkboard(caseId, updatedPlaced, updatedEdges);
  }, [activePairing.sourceNodeId, caseId, edges, placedNodes]);

  // Place node with non-overlapping radial / staggered distribution around viewport center
  const handlePlaceNode = useCallback((node: CaseGraphNode) => {
    setUnplacedNodes(prev => prev.filter(n => n.nodeId !== node.nodeId));
    setPlacedNodes(prev => {
      const index = prev.length;
      const angle = index * (Math.PI / 3); // 60 deg steps
      const radius = index === 0 ? 0 : 170 + Math.floor(index / 6) * 110;
      const targetX = Math.round(viewport.x - 105 + Math.cos(angle) * radius);
      const targetY = Math.round(viewport.y - 50 + Math.sin(angle) * radius);

      const updated = [
        ...prev,
        {
          ...node,
          x: Math.max(40, Math.min(CANVAS_SIZE - 260, targetX)),
          y: Math.max(40, Math.min(CANVAS_SIZE - 170, targetY)),
        },
      ];
      persistCorkboard(caseId, updated, edges);
      return updated;
    });
  }, [caseId, edges, viewport.x, viewport.y]);

  const handleAutoArrange = useCallback(() => {
    setPlacedNodes(prev => {
      const updated = autoArrangeNodes(prev);
      persistCorkboard(caseId, updated, edges);
      return updated;
    });
  }, [caseId, edges]);

  const handleCenterCluster = useCallback(() => {
    if (placedNodes.length === 0) {
      setCenter(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      return;
    }
    const avgX = placedNodes.reduce((acc, n) => acc + n.x + 105, 0) / placedNodes.length;
    const avgY = placedNodes.reduce((acc, n) => acc + n.y + 50, 0) / placedNodes.length;
    setCenter(avgX, avgY);
  }, [placedNodes, setCenter]);

  const handleResetView = useCallback(() => {
    if (!placedNodes.length) {
      setViewport({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2, zoom: 1 });
      return;
    }
    const cards = new Map(Array.from(boardRef.current?.querySelectorAll<HTMLElement>('[data-node-id]') ?? [])
      .map(card => [card.dataset.nodeId, card]));
    const left = Math.min(...placedNodes.map(node => node.x));
    const right = Math.max(...placedNodes.map(node => node.x + (cards.get(node.nodeId)?.offsetWidth ?? 210)));
    const top = Math.min(...placedNodes.map(node => node.y));
    const bottom = Math.max(...placedNodes.map(node => node.y + (cards.get(node.nodeId)?.offsetHeight ?? 100)));
    setViewport({ x: (left + right) / 2, y: (top + bottom) / 2, zoom: 1 });
  }, [placedNodes, setViewport]);

  return (
    <div className="wife-notebook absolute inset-0 z-50 flex flex-col bg-[var(--notebook-canvas)] text-stone-800">
      {/* Top Header */}
      <header className="relative z-40 flex items-center justify-between border-b border-white/40 bg-white/25 px-3 py-2.5 shadow-[0_4px_16px_rgba(70,50,20,0.06)] backdrop-blur-xl backdrop-saturate-150 shrink-0">
        <button
          type="button"
          aria-label="Quay lại điện thoại"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-stone-800 transition-colors active:scale-95"
        >
          <IoArrowBackOutline className="text-xl" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-black tracking-wide uppercase text-stone-900">
            BẢNG ĐIỀU TRA
          </h2>
          <span className="text-[10px] font-semibold text-stone-700">
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
      <div ref={boardRef} className="relative flex-1 w-full h-full overflow-hidden min-h-0" {...containerProps}>
        <CorkboardCanvas
          getSourceApp={getSourceApp}
          viewport={viewport}
          isPinching={isPinching}
          placedNodes={placedNodes}
          edges={edges}
          activePairing={activePairing}
          unmaskedSuspectIds={unmaskedSuspectIds}
          activeContradictions={activeContradictions}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={handleSelectNode}
          onMoveNode={handleMoveNode}
          onSelectEdge={setSelectedEdgeId}
          onSeverEdge={handleSeverEdge}
          onRemoveNode={handleRemoveNode}
          onNavigateToSource={(appId, recId) => onNavigateToSource?.(appId as AppId, recId)}
          onCancelPairing={() => setActivePairing({ sourceNodeId: null })}
        />

        {/* Floating Bottom Control Dock */}
        <div className="corkboard-control-dock absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-1.5 px-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <span className="flex h-8 min-w-12 items-center justify-center rounded-xl bg-[var(--notebook-paper)] px-2 text-center font-mono text-xs font-bold text-stone-800">
              {Math.round(viewport.zoom * 100)}%
            </span>

            <button
              type="button"
              aria-label="Căn giữa các thẻ và đặt thu phóng 100%"
              onClick={handleResetView}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 active:scale-90"
            >
              <IoRefreshOutline className="text-sm" />
            </button>
          </div>

          {/* Auto-Arrange Action & Confrontation */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAutoArrange}
              className="flex items-center gap-1 rounded-xl bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-[#C2185B] active:scale-95 border border-rose-200"
            >
              <IoGridOutline className="text-sm" /> Xếp gọn
            </button>
            {onConfront && (
              <button
                type="button"
                onClick={onConfront}
                className="flex items-center gap-1 rounded-xl bg-[#8E24AA] hover:bg-purple-800 px-3 py-1.5 text-xs font-bold text-white shadow active:scale-95"
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

      {/* Bottom Phone OS Home Navigation Bar */}
      <div
        className="relative z-40 flex w-full shrink-0 items-center justify-center bg-[var(--notebook-paper)] cursor-pointer active:opacity-75 transition-opacity pb-[env(safe-area-inset-bottom,0px)] border-t border-[var(--notebook-border)]"
        style={{ height: '32px', touchAction: 'none' }}
        onClick={() => {
          if (onReturnHome) onReturnHome();
          else onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Về màn hình chính"
      >
        <span aria-hidden="true" className="h-1 w-32 rounded-full bg-stone-700 hover:bg-stone-900 transition-colors" />
      </div>
    </div>
  );
};
