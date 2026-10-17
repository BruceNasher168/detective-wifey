import type { CaseGraphNode, CaseGraphEdge } from '../../shared/contracts/knowledge-graph';
import type { AppId } from '../../shared/contracts/app-contracts';
import type { EvidenceSource, PinnedMessageEntry } from '../../shared/contracts/evidence';

export interface TaggedEvidenceItem {
  suspectId: string;
  displayName: string;
  sourceApp: AppId;
  timestamp: number;
  evidence?: EvidenceSource;
  conversationId?: string;
  visibleAlias?: string;
  isExplicitConversationPin?: boolean;
  messages?: PinnedMessageEntry[];
}

export interface UndoAction {
  id: string;
  message: string;
  type: 'card' | 'message';
  affectedNodeId: string;
  restoredNode?: CaseGraphNode;
  restoredPlacedNode?: PlacedNode;
  restoredEdges?: CaseGraphEdge[];
  restoredMessage?: PinnedMessageEntry;
  targetSuspectId?: string;
  targetConversationId?: string;
  wasPlaced: boolean;
  timestamp: number;
}

export interface PlacedNode extends CaseGraphNode {
  x: number;
  y: number;
}

export interface CorkboardViewport {
  x: number;       // Camera center X in canvas coordinates (0..1200)
  y: number;       // Camera center Y in canvas coordinates (0..1200)
  zoom: number;    // Clamped scale 0.5 .. 2.0
}

export interface PairingState {
  sourceNodeId: string | null;
  targetNodeId?: string | null;
}

export interface WifeNotebookState {
  placedNodes: PlacedNode[];
  unplacedNodes: CaseGraphNode[];
  edges: CaseGraphEdge[];
  requiredSmokingGunEdgeIds: string[];
  activePairing: PairingState;
  unmaskedSuspectIds: string[];
  activeContradictions: string[];
  isDrawerOpen: boolean;
  selectedEdgeId: string | null;
}
