import type { CaseGraphNode, CaseGraphEdge } from '../../shared/contracts/knowledge-graph';

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
