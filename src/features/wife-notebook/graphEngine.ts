import type { CaseKnowledgeGraph, CaseGraphEdge } from '../../shared/contracts/knowledge-graph';
import type { PlacedNode } from './types';

export const CANVAS_SIZE = 1200;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.0;

/**
 * Validates whether two nodes are already connected in the active notebook state.
 */
export function areNodesConnected(edges: CaseGraphEdge[], nodeAId: string, nodeBId: string): boolean {
  return edges.some(
    e => (e.sourceNodeId === nodeAId && e.targetNodeId === nodeBId) ||
         (e.sourceNodeId === nodeBId && e.targetNodeId === nodeAId),
  );
}

/**
 * Creates an edge between nodeA and nodeB.
 * Matches against the canonical CaseKnowledgeGraph to inherit properties like isSmokingGun and explanation.
 * If not in canonical graph, creates a player-speculative edge.
 */
export function createEdgeBetweenNodes(
  canonicalGraph: CaseKnowledgeGraph,
  existingEdges: CaseGraphEdge[],
  nodeAId: string,
  nodeBId: string,
): { newEdge: CaseGraphEdge | null; isDuplicate: boolean } {
  if (nodeAId === nodeBId) return { newEdge: null, isDuplicate: false };
  if (areNodesConnected(existingEdges, nodeAId, nodeBId)) {
    return { newEdge: null, isDuplicate: true };
  }

  // Look for canonical match in both directions
  const canonical = canonicalGraph.edges.find(
    e => (e.sourceNodeId === nodeAId && e.targetNodeId === nodeBId) ||
         (e.sourceNodeId === nodeBId && e.targetNodeId === nodeAId),
  );

  const edgeId = canonical?.edgeId ?? `custom_edge_${nodeAId}_${nodeBId}_${Date.now()}`;
  const relationship = canonical?.relationship ?? 'bridges_identity';
  const isSmokingGun = canonical?.isSmokingGun ?? false;
  const explanationRoastHint = canonical?.explanationRoastHint;

  return {
    newEdge: {
      edgeId,
      sourceNodeId: nodeAId,
      targetNodeId: nodeBId,
      relationship,
      isSmokingGun,
      explanationRoastHint,
    },
    isDuplicate: false,
  };
}

/**
 * Evaluates whether an alias is unmasked by checking if there is a path connecting
 * the alias node to the target suspect profile node.
 */
export function evaluateUnmaskedSuspects(
  canonicalGraph: CaseKnowledgeGraph,
  activeEdges: CaseGraphEdge[],
): string[] {
  const unmaskedIds: string[] = [];

  // Build adjacency list for active edges
  const adj = new Map<string, string[]>();
  for (const edge of activeEdges) {
    if (!adj.has(edge.sourceNodeId)) adj.set(edge.sourceNodeId, []);
    if (!adj.has(edge.targetNodeId)) adj.set(edge.targetNodeId, []);
    adj.get(edge.sourceNodeId)!.push(edge.targetNodeId);
    adj.get(edge.targetNodeId)!.push(edge.sourceNodeId);
  }

  const aliasNodes = canonicalGraph.nodes.filter(n => n.type === 'alias');
  const suspectNodes = canonicalGraph.nodes.filter(n => n.type === 'suspect');

  for (const suspect of suspectNodes) {
    // Check if any alias has a path to this suspect
    for (const alias of aliasNodes) {
      if (hasPath(adj, alias.nodeId, suspect.nodeId)) {
        unmaskedIds.push(suspect.nodeId);
        break;
      }
    }
  }

  return unmaskedIds;
}

function hasPath(adj: Map<string, string[]>, start: string, goal: string): boolean {
  if (start === goal) return true;
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === goal) return true;
    for (const neighbor of adj.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}

/**
 * Evaluates active alibi contradictions in the graph.
 */
export function evaluateContradictions(activeEdges: CaseGraphEdge[]): string[] {
  return activeEdges
    .filter(e => e.relationship === 'contradicts_alibi')
    .map(e => e.edgeId);
}

/**
 * Calculates auto-arrange positions for placed nodes into 3 swimlanes:
 * - Left: aliases & suspects (X: 180)
 * - Center: bridge identifiers & app records (X: 600)
 * - Right: timeline slots & contradictions (X: 1000)
 */
export function autoArrangeNodes(nodes: PlacedNode[]): PlacedNode[] {
  let leftY = 120;
  let centerY = 120;
  let rightY = 120;
  const ROW_GAP = 160;

  return nodes.map(node => {
    let x: number;
    let y: number;

    if (node.type === 'alias' || node.type === 'suspect') {
      x = 180;
      y = leftY;
      leftY += ROW_GAP;
    } else if (node.type === 'bridge_id' || node.type === 'record_clue') {
      x = 600;
      y = centerY;
      centerY += ROW_GAP;
    } else {
      // timeline_slot or other
      x = 1000;
      y = rightY;
      rightY += ROW_GAP;
    }

    return { ...node, x, y };
  });
}

/**
 * Clamps zoom scale within [MIN_ZOOM, MAX_ZOOM].
 */
export function clampZoom(scale: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}
