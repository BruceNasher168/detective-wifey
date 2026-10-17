import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  IoArrowBackOutline,
  IoRefreshOutline,
  IoGridOutline,
  IoArrowUndoOutline,
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
import type { PlacedNode, PairingState, TaggedEvidenceItem, UndoAction } from './types';
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
  onUpdateTaggedSuspects?: (suspects: TaggedEvidenceItem[]) => void;
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
    const conversationId = tag.conversationId || tag.evidence?.conversationId || (tag.evidence?.kind === 'conversation' ? tag.evidence.recordId : undefined);

    // 1. Try to match by clueRefId or recordId or conversationId
    const canonicalMatch = canonicalGraph.nodes.find(n =>
      (tag.evidence?.clueRefId && n.clueRefId === tag.evidence.clueRefId) ||
      (conversationId && n.sourceAppId === tag.sourceApp && n.recordRefId === conversationId) ||
      (tag.evidence?.recordId && n.sourceAppId === tag.sourceApp && n.recordRefId === tag.evidence.recordId),
    ) ?? (!tag.evidence ? canonicalGraph.nodes.find(n =>
      n.label === tag.displayName || n.nodeId === tag.suspectId,
    ) : undefined);

    const label = (tag.conversationId || tag.isExplicitConversationPin)
      ? (tag.displayName || tag.evidence?.visibleAlias || tag.evidence?.title || 'Cuộc trò chuyện')
      : (tag.evidence?.title || tag.displayName || 'Manh mối');

    const hasMessages = Boolean(tag.messages && tag.messages.length > 0);
    const subtitle = hasMessages ? undefined : (tag.isExplicitConversationPin ? undefined : (tag.evidence?.snippet ?? canonicalMatch?.subtitle));

    if (canonicalMatch) {
      if (!addedNodeIds.has(canonicalMatch.nodeId)) {
        nodes.push({
          ...canonicalMatch,
          label,
          subtitle,
          sourceAppId: tag.sourceApp,
          recordRefId: tag.evidence?.recordId || conversationId || canonicalMatch.recordRefId,
          clueRefId: tag.evidence?.clueRefId || canonicalMatch.clueRefId,
          conversationId,
          visibleAlias: tag.visibleAlias || tag.evidence?.visibleAlias || tag.displayName,
          isExplicitConversationPin: tag.isExplicitConversationPin,
          messages: tag.messages || [],
          suspectId: tag.suspectId,
          eventTime: tag.evidence?.eventTime,
          eventDate: tag.evidence?.eventDate,
          rawTimestamp: tag.evidence?.rawTimestamp,
        });
        addedNodeIds.add(canonicalMatch.nodeId);
      }
    } else {
      // Dynamic node generated from pinned evidence
      const dynamicId = `node_${tag.sourceApp}_${conversationId || tag.evidence?.recordId || tag.suspectId}`;
      if (!addedNodeIds.has(dynamicId)) {
        nodes.push({
          nodeId: dynamicId,
          type: tag.evidence ? 'record_clue' : 'suspect',
          label,
          subtitle,
          sourceAppId: tag.sourceApp,
          recordRefId: tag.evidence?.recordId || conversationId,
          clueRefId: tag.evidence?.clueRefId,
          conversationId,
          visibleAlias: tag.visibleAlias || tag.evidence?.visibleAlias || tag.displayName,
          isExplicitConversationPin: tag.isExplicitConversationPin,
          messages: tag.messages || [],
          suspectId: tag.suspectId,
          eventTime: tag.evidence?.eventTime,
          eventDate: tag.evidence?.eventDate,
          rawTimestamp: tag.evidence?.rawTimestamp,
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
  onUpdateTaggedSuspects,
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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Undo Notification Queue State
  const [, setUndoQueue] = useState<UndoAction[]>([]);
  const [activeUndo, setActiveUndo] = useState<UndoAction | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUndoPausedRef = useRef(false);
  const remainingUndoTimeRef = useRef(8000);
  const undoStartTimeRef = useRef<number>(0);

  const startUndoTimer = useCallback((durationMs: number) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoStartTimeRef.current = Date.now();
    remainingUndoTimeRef.current = durationMs;
    isUndoPausedRef.current = false;

    undoTimerRef.current = setTimeout(() => {
      setUndoQueue(prevQueue => {
        if (prevQueue.length > 0) {
          const [next, ...rest] = prevQueue;
          setActiveUndo(next);
          startUndoTimer(8000);
          return rest;
        } else {
          setActiveUndo(null);
          return [];
        }
      });
    }, durationMs);
  }, []);

  const pauseUndoTimer = useCallback(() => {
    if (isUndoPausedRef.current || !activeUndo) return;
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    const elapsed = Date.now() - undoStartTimeRef.current;
    remainingUndoTimeRef.current = Math.max(500, remainingUndoTimeRef.current - elapsed);
    isUndoPausedRef.current = true;
  }, [activeUndo]);

  const resumeUndoTimer = useCallback(() => {
    if (!isUndoPausedRef.current || !activeUndo) return;
    startUndoTimer(remainingUndoTimeRef.current);
  }, [activeUndo, startUndoTimer]);

  const pushUndo = useCallback((action: UndoAction) => {
    setActiveUndo(current => {
      if (!current) {
        startUndoTimer(8000);
        return action;
      }
      setUndoQueue(prev => [...prev, action]);
      return current;
    });
  }, [startUndoTimer]);

  // Clean up timer on unmount / case switch
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, [caseId]);

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
      return updated;
    });
  }, []);

  // Save once movement settles, and flush the last position when leaving.
  useEffect(() => {
    const timer = window.setTimeout(() => persistCorkboard(caseId, placedNodes, edges), 150);
    return () => window.clearTimeout(timer);
  }, [caseId, placedNodes, edges]);
  const latestBoard = useRef({ caseId, placedNodes, edges });
  useEffect(() => { latestBoard.current = { caseId, placedNodes, edges }; }, [caseId, placedNodes, edges]);
  useEffect(() => {
    const flush = () => {
      const board = latestBoard.current;
      persistCorkboard(board.caseId, board.placedNodes, board.edges);
    };
    window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('pagehide', flush); flush(); };
  }, []);

  // Tap-to-Connect Pairing State Machine & Edge Persist
  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedCardId(nodeId);
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

  // Remove a whole clue card (with Undo)
  const handleDeleteCard = useCallback((nodeId: string) => {
    const node = placedNodes.find(n => n.nodeId === nodeId) || unplacedNodes.find(n => n.nodeId === nodeId);
    if (!node) return;

    const wasPlaced = placedNodes.some(n => n.nodeId === nodeId);
    const placedNode = placedNodes.find(n => n.nodeId === nodeId);
    const severedEdges = edges.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);

    const updatedPlaced = placedNodes.filter(n => n.nodeId !== nodeId);
    const updatedUnplaced = unplacedNodes.filter(n => n.nodeId !== nodeId);
    const updatedEdges = edges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

    setPlacedNodes(updatedPlaced);
    setUnplacedNodes(updatedUnplaced);
    setEdges(updatedEdges);
    persistCorkboard(caseId, updatedPlaced, updatedEdges);

    if (selectedCardId === nodeId) setSelectedCardId(null);
    if (activePairing.sourceNodeId === nodeId) setActivePairing({ sourceNodeId: null });

    // Update tagged suspects in PlaySession
    const suspectTargetId = node.suspectId || nodeId;
    const remainingSuspects = (taggedSuspects || []).filter(
      s => s.suspectId !== suspectTargetId && (!node.conversationId || s.conversationId !== node.conversationId),
    );
    onUpdateTaggedSuspects?.(remainingSuspects);

    pushUndo({
      id: `undo_card_${Date.now()}`,
      message: `Đã bỏ ghim thẻ ${node.label}.`,
      type: 'card',
      affectedNodeId: nodeId,
      restoredNode: node,
      restoredPlacedNode: placedNode,
      restoredEdges: severedEdges,
      targetSuspectId: node.suspectId,
      targetConversationId: node.conversationId,
      wasPlaced,
      timestamp: Date.now(),
    });
  }, [activePairing.sourceNodeId, caseId, edges, onUpdateTaggedSuspects, placedNodes, pushUndo, selectedCardId, taggedSuspects, unplacedNodes]);

  // Remove an individual message from a card (with Undo)
  const handleDeleteMessage = useCallback((nodeId: string, messageRecordId: string) => {
    const node = placedNodes.find(n => n.nodeId === nodeId) || unplacedNodes.find(n => n.nodeId === nodeId);
    if (!node) return;

    const messages = node.messages || [];
    const messageToRemove = messages.find(m => m.recordId === messageRecordId);
    if (!messageToRemove) return;

    const remainingMessages = messages.filter(m => m.recordId !== messageRecordId);
    const wasPlaced = placedNodes.some(n => n.nodeId === nodeId);
    const placedNode = placedNodes.find(n => n.nodeId === nodeId);
    let severedEdges: CaseGraphEdge[] = [];

    if (remainingMessages.length === 0 && !node.isExplicitConversationPin) {
      // Empty card is removed entirely since conversation wasn't explicitly pinned
      severedEdges = edges.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);
      const updatedPlaced = placedNodes.filter(n => n.nodeId !== nodeId);
      const updatedUnplaced = unplacedNodes.filter(n => n.nodeId !== nodeId);
      const updatedEdges = edges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

      setPlacedNodes(updatedPlaced);
      setUnplacedNodes(updatedUnplaced);
      setEdges(updatedEdges);
      persistCorkboard(caseId, updatedPlaced, updatedEdges);
      if (selectedCardId === nodeId) setSelectedCardId(null);
    } else {
      // Keep card with updated messages list
      const updateNode = (n: CaseGraphNode) => n.nodeId === nodeId ? { ...n, messages: remainingMessages } : n;
      const updatePlaced = (n: PlacedNode) => n.nodeId === nodeId ? { ...n, messages: remainingMessages } : n;
      const nextPlaced = placedNodes.map(updatePlaced);
      setPlacedNodes(nextPlaced);
      setUnplacedNodes(prev => prev.map(updateNode));
      persistCorkboard(caseId, nextPlaced, edges);
    }

    // Update tagged suspects in PlaySession
    const suspectTargetId = node.suspectId || nodeId;
    const updatedSuspects = (taggedSuspects || []).map(s => {
      if (s.suspectId === suspectTargetId || (node.conversationId && s.conversationId === node.conversationId)) {
        return {
          ...s,
          messages: (s.messages || []).filter(m => m.recordId !== messageRecordId),
        };
      }
      return s;
    }).filter(s => (s.messages && s.messages.length > 0) || s.isExplicitConversationPin);
    onUpdateTaggedSuspects?.(updatedSuspects);

    pushUndo({
      id: `undo_msg_${Date.now()}`,
      message: 'Đã bỏ ghim 1 tin nhắn.',
      type: 'message',
      affectedNodeId: nodeId,
      restoredNode: node,
      restoredPlacedNode: placedNode,
      restoredEdges: severedEdges,
      restoredMessage: messageToRemove,
      targetSuspectId: node.suspectId,
      targetConversationId: node.conversationId,
      wasPlaced,
      timestamp: Date.now(),
    });
  }, [caseId, edges, onUpdateTaggedSuspects, placedNodes, pushUndo, selectedCardId, taggedSuspects, unplacedNodes]);

  // Execute Undo
  const handleExecuteUndo = useCallback(() => {
    if (!activeUndo) return;

    if (activeUndo.type === 'card') {
      if (activeUndo.wasPlaced && activeUndo.restoredPlacedNode) {
        setPlacedNodes(prev => [...prev.filter(n => n.nodeId !== activeUndo.affectedNodeId), activeUndo.restoredPlacedNode!]);
      } else if (activeUndo.restoredNode) {
        setUnplacedNodes(prev => [...prev.filter(n => n.nodeId !== activeUndo.affectedNodeId), activeUndo.restoredNode!]);
      }
      if (activeUndo.restoredEdges && activeUndo.restoredEdges.length > 0) {
        setEdges(prev => [...prev, ...activeUndo.restoredEdges!]);
      }

      // Restore tagged suspects
      if (activeUndo.restoredNode) {
        const restoredSuspect: TaggedEvidenceItem = {
          suspectId: activeUndo.restoredNode.suspectId || activeUndo.affectedNodeId,
          displayName: activeUndo.restoredNode.label,
          sourceApp: (activeUndo.restoredNode.sourceAppId || 'internet-messaging') as AppId,
          timestamp: activeUndo.timestamp || Date.now(),
          conversationId: activeUndo.restoredNode.conversationId,
          visibleAlias: activeUndo.restoredNode.visibleAlias,
          isExplicitConversationPin: activeUndo.restoredNode.isExplicitConversationPin,
          messages: activeUndo.restoredNode.messages,
          evidence: activeUndo.restoredNode.recordRefId ? {
            caseId: caseId || 'case_01',
            recordId: activeUndo.restoredNode.recordRefId,
            title: activeUndo.restoredNode.label,
            snippet: activeUndo.restoredNode.subtitle || '',
            clueRefId: activeUndo.restoredNode.clueRefId,
          } : undefined,
        };
        const existing = taggedSuspects || [];
        if (!existing.some(s => s.suspectId === restoredSuspect.suspectId)) {
          onUpdateTaggedSuspects?.([...existing, restoredSuspect]);
        }
      }
    } else if (activeUndo.type === 'message' && activeUndo.restoredMessage) {
      const cardStillExists = placedNodes.some(n => n.nodeId === activeUndo.affectedNodeId) ||
                              unplacedNodes.some(n => n.nodeId === activeUndo.affectedNodeId);

      if (!cardStillExists) {
        const restoredWithMsg: CaseGraphNode = {
          ...activeUndo.restoredNode!,
          messages: [activeUndo.restoredMessage],
        };
        if (activeUndo.wasPlaced && activeUndo.restoredPlacedNode) {
          const placedWithMsg: PlacedNode = {
            ...activeUndo.restoredPlacedNode,
            messages: [activeUndo.restoredMessage],
          };
          setPlacedNodes(prev => [...prev, placedWithMsg]);
        } else {
          setUnplacedNodes(prev => [...prev, restoredWithMsg]);
        }
        if (activeUndo.restoredEdges && activeUndo.restoredEdges.length > 0) {
          setEdges(prev => [...prev, ...activeUndo.restoredEdges!]);
        }
      } else {
        setPlacedNodes(prev => prev.map(n => n.nodeId === activeUndo.affectedNodeId ? {
          ...n,
          messages: [...(n.messages || []).filter(m => m.recordId !== activeUndo.restoredMessage!.recordId), activeUndo.restoredMessage!],
        } : n));
        setUnplacedNodes(prev => prev.map(n => n.nodeId === activeUndo.affectedNodeId ? {
          ...n,
          messages: [...(n.messages || []).filter(m => m.recordId !== activeUndo.restoredMessage!.recordId), activeUndo.restoredMessage!],
        } : n));
      }

      // Restore message in taggedSuspects
      const updatedSuspects = (taggedSuspects || []).map(s => {
        if (s.suspectId === activeUndo.targetSuspectId || (activeUndo.targetConversationId && s.conversationId === activeUndo.targetConversationId)) {
          const currentMessages = s.messages || [];
          if (!currentMessages.some(m => m.recordId === activeUndo.restoredMessage!.recordId)) {
            return {
              ...s,
              messages: [...currentMessages, activeUndo.restoredMessage!],
            };
          }
        }
        return s;
      });
      onUpdateTaggedSuspects?.(updatedSuspects);
    }

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoQueue(prevQueue => {
      if (prevQueue.length > 0) {
        const [next, ...rest] = prevQueue;
        setActiveUndo(next);
        startUndoTimer(8000);
        return rest;
      } else {
        setActiveUndo(null);
        return [];
      }
    });
  }, [activeUndo, caseId, onUpdateTaggedSuspects, placedNodes, startUndoTimer, taggedSuspects, unplacedNodes]);

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
          selectedNodeId={selectedCardId}
          onSelectNode={handleSelectNode}
          onSelectCard={setSelectedCardId}
          onMoveNode={handleMoveNode}
          onSelectEdge={setSelectedEdgeId}
          onSeverEdge={handleSeverEdge}
          onRemoveNode={handleRemoveNode}
          onDeleteCard={handleDeleteCard}
          onDeleteMessage={handleDeleteMessage}
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
          onDeleteCard={handleDeleteCard}
          onDeleteMessage={handleDeleteMessage}
        />

        {/* Undo Notification Banner */}
        {activeUndo && (
          <div
            role="status"
            aria-live="polite"
            className="fixed sm:absolute bottom-16 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[380px] z-50 flex items-center justify-between gap-3 rounded-2xl bg-stone-900/95 text-white px-4 py-3 shadow-2xl border border-white/10 backdrop-blur-md animate-fadeIn"
            onMouseEnter={pauseUndoTimer}
            onMouseLeave={resumeUndoTimer}
            onFocus={pauseUndoTimer}
            onBlur={resumeUndoTimer}
          >
            <span className="text-xs font-medium text-stone-200 truncate">
              {activeUndo.message}
            </span>
            <button
              type="button"
              onClick={handleExecuteUndo}
              className="flex items-center gap-1 shrink-0 px-3 py-1.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <IoArrowUndoOutline className="text-sm" />
              <span>Hoàn tác</span>
            </button>
          </div>
        )}
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
