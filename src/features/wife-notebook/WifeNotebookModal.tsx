import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
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
  placeNewNodesBelow,
  CORKBOARD_COLUMNS_X,
  CANVAS_SIZE,
} from './graphEngine';
import { useCorkboardGestures } from './useCorkboardGestures';
import { MiniMapRadar } from './components/MiniMapRadar';
import { CorkboardCanvas } from './components/CorkboardCanvas';
import './notebook.css';
import type { PlacedNode, PairingState, TaggedEvidenceItem, UndoAction } from './types';
import type { CaseKnowledgeGraph, CaseGraphEdge, CaseGraphNode } from '../../shared/contracts/knowledge-graph';
import type { AppDefinition, AppId } from '../../shared/contracts/app-contracts';
import type { PinnedMessageEntry } from '../../shared/contracts/evidence';

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
function cleanLabel(name?: string): string {
  if (!name) return '';
  return name.replace(/^Tin nhắn:\s*/i, '').trim();
}

/**
 * Maps player tagged clues/suspects from PlaySession to CaseGraphNode items.
 * Matches canonical graph nodes where possible, or generates dynamic nodes.
 * Invariant: All messages from the same conversation/contact map to exactly ONE node.
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
    const rawConvId = tag.conversationId || tag.evidence?.conversationId || (tag.evidence?.kind === 'conversation' ? tag.evidence.recordId : undefined);
    // Resolve conversationId from recordId if format is thread_tuan_m4 or chat:shop:message:1
    let conversationId = rawConvId;
    if (!conversationId && tag.evidence?.recordId) {
      const rec = tag.evidence.recordId;
      if (rec.startsWith('thread_')) {
        const parts = rec.split('_');
        if (parts.length >= 3) conversationId = `${parts[0]}_${parts[1]}`;
        else conversationId = rec;
      } else if (rec.startsWith('chat:')) {
        const parts = rec.split(':');
        if (parts.length >= 2) conversationId = parts[1];
      }
    }
    const cleanedDisplayName = cleanLabel(tag.displayName);
    if (!conversationId && tag.sourceApp === 'internet-messaging' && cleanedDisplayName === 'Anh Tuấn Thợ Điện') {
      conversationId = 'thread_tuan';
    }
    if (!conversationId && (tag.sourceApp === 'messages' || tag.sourceApp === 'phone') && cleanedDisplayName === 'Anh Tuấn Thợ Điện') {
      conversationId = 'sms_contact_10';
    }

    // 1. Try to match by exact recordId or conversationId first, then clueRefId.
    // Invariant: Distinct records (e.g. tx_01 vs tx_02) sharing the same clueRefId must NOT collapse into one card.
    let canonicalMatch = canonicalGraph.nodes.find(n =>
      Boolean(tag.evidence?.recordId && n.sourceAppId === tag.sourceApp && n.recordRefId === tag.evidence.recordId),
    );

    if (!canonicalMatch && conversationId) {
      canonicalMatch = canonicalGraph.nodes.find(n =>
        Boolean(n.sourceAppId === tag.sourceApp && n.recordRefId === conversationId),
      );
    }

    if (!canonicalMatch && tag.evidence?.clueRefId) {
      canonicalMatch = canonicalGraph.nodes.find(n =>
        Boolean(n.clueRefId === tag.evidence!.clueRefId && (!n.sourceAppId || n.sourceAppId === tag.sourceApp)),
      );
    }

    // 2. If no record/clue match, match by label for person tags or conversation pins
    // Invariant: Different apps maintain separate cards and never conflate into each other
    if (!canonicalMatch && (!tag.evidence || conversationId || tag.isExplicitConversationPin)) {
      canonicalMatch = canonicalGraph.nodes.find(n => {
        const matchesLabel = n.label === cleanedDisplayName || n.nodeId === tag.suspectId;
        if (!matchesLabel) return false;
        // If the node has a sourceAppId, it must match the tag's sourceApp
        if (n.sourceAppId && tag.sourceApp && n.sourceAppId !== tag.sourceApp) return false;
        return true;
      });
    }

    const label = (tag.conversationId || tag.isExplicitConversationPin || conversationId)
      ? (cleanedDisplayName || tag.evidence?.visibleAlias || tag.evidence?.title || 'Cuộc trò chuyện')
      : (cleanLabel(tag.evidence?.title) || cleanedDisplayName || 'Manh mối');

    // Extract incoming messages
    const incomingMessages: PinnedMessageEntry[] = [...(tag.messages || [])];
    if (incomingMessages.length === 0 && tag.evidence?.snippet && tag.evidence.snippet.trim()) {
      const isMessageRecord = tag.evidence.kind === 'message' ||
        (tag.evidence.recordId && tag.evidence.recordId !== conversationId) ||
        tag.displayName.startsWith('Tin nhắn:');
      if (isMessageRecord) {
        let eventTime = tag.evidence.eventTime;
        const eventDate = tag.evidence.eventDate;
        if (!eventTime && tag.evidence.subtitle) {
          const timeMatch = tag.evidence.subtitle.match(/(?:Thời gian:\s*|•\s*)(\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}|\d{1,2}:\d{2})/i);
          if (timeMatch) {
            eventTime = timeMatch[1];
          }
        }
        incomingMessages.push({
          recordId: tag.evidence.recordId || `msg_${tag.timestamp}`,
          text: tag.evidence.snippet,
          eventTime,
          eventDate,
          rawTimestamp: tag.evidence.rawTimestamp,
          clueRefId: tag.evidence.clueRefId,
          direction: tag.evidence.direction,
          sender: tag.evidence.sender,
        });
      }
    }

    for (const m of incomingMessages) {
      if (!m.eventTime && tag.evidence?.subtitle) {
        const timeMatch = tag.evidence.subtitle.match(/(?:Thời gian:\s*|•\s*)(\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}|\d{1,2}:\d{2})/i);
        if (timeMatch) {
          m.eventTime = timeMatch[1];
        }
      }
    }

    const targetNodeId = canonicalMatch
      ? canonicalMatch.nodeId
      : `node_${tag.sourceApp}_${conversationId || tag.evidence?.recordId || tag.suspectId}`;

    if (addedNodeIds.has(targetNodeId)) {
      // Merge messages into the existing node
      const existing = nodes.find(n => n.nodeId === targetNodeId);
      if (existing) {
        const curMsgs = [...(existing.messages || [])];
        for (const m of incomingMessages) {
          if (!curMsgs.some(em => (em.recordId && em.recordId === m.recordId) || (em.text && em.text.trim() === m.text.trim()))) {
            curMsgs.push(m);
          }
        }
        existing.messages = curMsgs;
        if (curMsgs.length > 0) existing.subtitle = undefined;
        existing.isExplicitConversationPin = existing.isExplicitConversationPin || tag.isExplicitConversationPin;
      }
    } else {
      const hasMessages = incomingMessages.length > 0;
      const subtitle = hasMessages ? undefined : (tag.isExplicitConversationPin ? undefined : (tag.evidence?.snippet ?? canonicalMatch?.subtitle));

      if (canonicalMatch) {
        nodes.push({
          ...canonicalMatch,
          label,
          subtitle,
          sourceAppId: tag.sourceApp,
          recordRefId: tag.evidence?.recordId || conversationId || canonicalMatch.recordRefId,
          clueRefId: tag.evidence?.clueRefId || canonicalMatch.clueRefId,
          conversationId,
          visibleAlias: tag.visibleAlias || tag.evidence?.visibleAlias || cleanedDisplayName,
          isExplicitConversationPin: tag.isExplicitConversationPin,
          messages: incomingMessages,
          suspectId: tag.suspectId,
          eventTime: tag.evidence?.eventTime,
          eventDate: tag.evidence?.eventDate,
          rawTimestamp: tag.evidence?.rawTimestamp,
          direction: tag.evidence?.direction,
          sender: tag.evidence?.sender,
        });
      } else {
        nodes.push({
          nodeId: targetNodeId,
          type: tag.evidence ? 'record_clue' : 'suspect',
          label,
          subtitle,
          sourceAppId: tag.sourceApp,
          recordRefId: tag.evidence?.recordId || conversationId,
          clueRefId: tag.evidence?.clueRefId,
          conversationId,
          visibleAlias: tag.visibleAlias || tag.evidence?.visibleAlias || cleanedDisplayName,
          isExplicitConversationPin: tag.isExplicitConversationPin,
          messages: incomingMessages,
          suspectId: tag.suspectId,
          eventTime: tag.evidence?.eventTime,
          eventDate: tag.evidence?.eventDate,
          rawTimestamp: tag.evidence?.rawTimestamp,
          direction: tag.evidence?.direction,
          sender: tag.evidence?.sender,
          isInitialDisguise: false,
        });
      }
      addedNodeIds.add(targetNodeId);
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

  // Placed nodes restored from saved state + auto-place any new tagged clues in 3 centered columns below existing clues
  const [placedNodes, setPlacedNodes] = useState<PlacedNode[]>(() => {
    const seenIds = new Set<string>();
    const restoredPlaced: PlacedNode[] = [];

    if (savedState && savedState.placedNodes.length > 0) {
      for (const saved of savedState.placedNodes) {
        // Find matching node from allTaggedNodes
        let targetNode = allTaggedNodes.find(n => n.nodeId === saved.nodeId);
        // If saved was legacy node for a conversation (e.g. node_internet-messaging_thread_tuan_m4 or node_record_zola_chat)
        if (!targetNode && (saved.nodeId.includes('thread_') || saved.nodeId.includes('chat:'))) {
          targetNode = allTaggedNodes.find(n =>
            (n.recordRefId && saved.nodeId.includes(n.recordRefId)) ||
            (n.conversationId && saved.nodeId.includes(n.conversationId)) ||
            (cleanLabel(saved.label) === n.label),
          );
        }

        if (targetNode && !seenIds.has(targetNode.nodeId)) {
          seenIds.add(targetNode.nodeId);
          restoredPlaced.push({
            ...targetNode,
            x: saved.x,
            y: saved.y,
          });
        }
      }
    }

    // Auto-place any newly tagged clues that aren't in the saved placed nodes yet
    const unplaced = allTaggedNodes.filter(n => !seenIds.has(n.nodeId));
    if (unplaced.length === 0) {
      return restoredPlaced;
    }

    const newlyPlaced = placeNewNodesBelow(restoredPlaced, unplaced);
    return [...restoredPlaced, ...newlyPlaced];
  });

  // Edges restored from saved state
  const [edges, setEdges] = useState<CaseGraphEdge[]>(() => {
    return savedState?.edges || [];
  });

  // Synchronize placed nodes content (messages, label, subtitle) and auto-place newly arriving tagged clues
  useEffect(() => {
    setPlacedNodes(prevPlaced => {
      const placedIds = new Set(prevPlaced.map(n => n.nodeId));
      const unplaced = allTaggedNodes.filter(n => !placedIds.has(n.nodeId));

      let changed = false;
      const updatedExisting = prevPlaced.map(placed => {
        const matching = allTaggedNodes.find(n => n.nodeId === placed.nodeId);
        if (!matching) return placed;
        const messagesEqual = JSON.stringify(placed.messages) === JSON.stringify(matching.messages);
        if (placed.label === matching.label && placed.subtitle === matching.subtitle && messagesEqual) {
          return placed;
        }
        changed = true;
        return {
          ...placed,
          ...matching,
          x: placed.x,
          y: placed.y,
        };
      });

      if (unplaced.length > 0) {
        const newlyPlaced = placeNewNodesBelow(updatedExisting, unplaced);
        const nextResult = [...updatedExisting, ...newlyPlaced];
        persistCorkboard(caseId, nextResult, edges);
        return nextResult;
      }

      if (changed) {
        persistCorkboard(caseId, updatedExisting, edges);
        return updatedExisting;
      }

      return prevPlaced;
    });
  }, [allTaggedNodes, caseId, edges]);

  const [activePairing, setActivePairing] = useState<PairingState>({ sourceNodeId: null });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
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

  const handleDismissSelection = useCallback(() => {
    setSelectedCardId(null);
    setSelectedEdgeId(null);
    setActivePairing({ sourceNodeId: null });
  }, []);

  // Corkboard gestures and zoom engine
  const {
    viewport,
    isPinching,
    setViewport,
    setCenter,
    containerProps,
  } = useCorkboardGestures({
    onTapBackground: handleDismissSelection,
  });

  // Graph Evaluation State
  const unmaskedSuspectIds = useMemo(
    () => evaluateUnmaskedSuspects(knowledgeGraph, edges),
    [knowledgeGraph, edges],
  );

  const activeContradictions = useMemo(
    () => evaluateContradictions(edges),
    [edges],
  );

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
    setSelectedEdgeId(null); // Mutually exclusive: deselect string when selecting card
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
        try {
          if (newEdge.isSmokingGun) {
            navigator.vibrate([50, 50, 80]); // Distinct double pulse for smoking gun discovery
          } else if (newEdge.isCanonical) {
            navigator.vibrate([40, 50, 40]); // Confirmed evidence pulse
          } else {
            navigator.vibrate(20);           // Soft speculation tap
          }
        } catch { /* ignore */ }
      }
    }

    // Reset pairing mode
    setActivePairing({ sourceNodeId: null });
  }, [activePairing.sourceNodeId, caseId, edges, knowledgeGraph, placedNodes]);

  const handleSelectEdge = useCallback((edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    if (edgeId !== null) {
      // Mutually exclusive: deselect card and cancel pairing when selecting string
      setSelectedCardId(null);
      setActivePairing({ sourceNodeId: null });
    }
  }, []);

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
    const node = placedNodes.find(n => n.nodeId === nodeId);
    if (!node) return;

    const severedEdges = edges.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);
    const updatedPlaced = placedNodes.filter(n => n.nodeId !== nodeId);
    const updatedEdges = edges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

    setPlacedNodes(updatedPlaced);
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
      restoredPlacedNode: node,
      restoredEdges: severedEdges,
      targetSuspectId: node.suspectId,
      targetConversationId: node.conversationId,
      wasPlaced: true,
      timestamp: Date.now(),
    });
  }, [activePairing.sourceNodeId, caseId, edges, onUpdateTaggedSuspects, placedNodes, pushUndo, selectedCardId, taggedSuspects]);

  // Remove an individual message from a card (with Undo)
  const handleDeleteMessage = useCallback((nodeId: string, messageRecordId: string) => {
    const node = placedNodes.find(n => n.nodeId === nodeId);
    if (!node) return;

    const messages = node.messages || [];
    const messageToRemove = messages.find(m => m.recordId === messageRecordId);
    if (!messageToRemove) return;

    const remainingMessages = messages.filter(m => m.recordId !== messageRecordId);
    let severedEdges: CaseGraphEdge[] = [];

    if (remainingMessages.length === 0 && !node.isExplicitConversationPin) {
      // Empty card is removed entirely since conversation wasn't explicitly pinned
      severedEdges = edges.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);
      const updatedPlaced = placedNodes.filter(n => n.nodeId !== nodeId);
      const updatedEdges = edges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

      setPlacedNodes(updatedPlaced);
      setEdges(updatedEdges);
      persistCorkboard(caseId, updatedPlaced, updatedEdges);
      if (selectedCardId === nodeId) setSelectedCardId(null);
    } else {
      // Keep card with updated messages list
      const updatePlaced = (n: PlacedNode) => n.nodeId === nodeId ? { ...n, messages: remainingMessages } : n;
      const nextPlaced = placedNodes.map(updatePlaced);
      setPlacedNodes(nextPlaced);
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
      restoredPlacedNode: node,
      restoredEdges: severedEdges,
      restoredMessage: messageToRemove,
      targetSuspectId: node.suspectId,
      targetConversationId: node.conversationId,
      wasPlaced: true,
      timestamp: Date.now(),
    });
  }, [caseId, edges, onUpdateTaggedSuspects, placedNodes, pushUndo, selectedCardId, taggedSuspects]);

  // Execute Undo
  const handleExecuteUndo = useCallback(() => {
    if (!activeUndo) return;

    if (activeUndo.type === 'card') {
      const nodeToRestore: PlacedNode = activeUndo.restoredPlacedNode || (activeUndo.restoredNode ? {
        ...activeUndo.restoredNode,
        x: CORKBOARD_COLUMNS_X[0],
        y: 160,
      } : (null as unknown as PlacedNode));

      if (nodeToRestore) {
        setPlacedNodes(prev => [...prev.filter(n => n.nodeId !== activeUndo.affectedNodeId), nodeToRestore]);
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
      const cardStillExists = placedNodes.some(n => n.nodeId === activeUndo.affectedNodeId);

      if (!cardStillExists) {
        const baseNode = activeUndo.restoredPlacedNode || (activeUndo.restoredNode ? {
          ...activeUndo.restoredNode,
          x: CORKBOARD_COLUMNS_X[0],
          y: 160,
        } : null);
        if (baseNode) {
          const placedWithMsg: PlacedNode = {
            ...baseNode,
            messages: [activeUndo.restoredMessage],
          };
          setPlacedNodes(prev => [...prev, placedWithMsg]);
        }
        if (activeUndo.restoredEdges && activeUndo.restoredEdges.length > 0) {
          setEdges(prev => [...prev, ...activeUndo.restoredEdges!]);
        }
      } else {
        setPlacedNodes(prev => prev.map(n => n.nodeId === activeUndo.affectedNodeId ? {
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
  }, [activeUndo, caseId, onUpdateTaggedSuspects, placedNodes, startUndoTimer, taggedSuspects]);

  // Remove a node from the corkboard (delegates directly to handleDeleteCard)
  const handleRemoveNode = useCallback((nodeId: string) => {
    handleDeleteCard(nodeId);
  }, [handleDeleteCard]);

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

  const handleSelectCard = useCallback((id: string | null) => {
    setSelectedCardId(id);
    if (id !== null) setSelectedEdgeId(null);
  }, []);
  const handleNavigateToSource = useCallback((appId?: string, recordId?: string) => {
    onNavigateToSource?.(appId as AppId, recordId);
  }, [onNavigateToSource]);
  const handleCancelPairing = useCallback(() => setActivePairing({ sourceNodeId: null }), []);

  return (
    <div className="wife-notebook absolute inset-0 z-50 flex flex-col bg-[var(--notebook-canvas)] text-stone-800">
      {/* Top Header Floating Overlay (Map only, transparent header) */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-end p-3 pointer-events-none">
        <div className="pointer-events-auto">
          <MiniMapRadar
            viewport={viewport}
            placedNodes={placedNodes}
            onCenterCluster={handleCenterCluster}
            size={56}
          />
        </div>
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
          onSelectCard={handleSelectCard}
          onMoveNode={handleMoveNode}
          onSelectEdge={handleSelectEdge}
          onSeverEdge={handleSeverEdge}
          onRemoveNode={handleRemoveNode}
          onDeleteCard={handleDeleteCard}
          onDeleteMessage={handleDeleteMessage}
          onNavigateToSource={handleNavigateToSource}
          onCancelPairing={handleCancelPairing}
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
