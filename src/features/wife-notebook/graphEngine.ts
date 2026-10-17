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
 * Calculates auto-arrange positions for placed nodes in a spread-out,
 * triangular and staggered constellation layout.
 * Ensures cards never overlap and preserves clear sightlines for red connection strings.
 */
export function autoArrangeNodes(nodes: PlacedNode[]): PlacedNode[] {
  const count = nodes.length;
  if (count === 0) return [];

  if (count === 1) {
    return [{ ...nodes[0], x: 495, y: 350 }];
  }

  if (count === 2) {
    return [
      { ...nodes[0], x: 330, y: 320 },
      { ...nodes[1], x: 670, y: 320 },
    ];
  }

  if (count === 3) {
    // Iconic conspiracy triangle
    return [
      { ...nodes[0], x: 495, y: 180 },
      { ...nodes[1], x: 270, y: 480 },
      { ...nodes[2], x: 730, y: 480 },
    ];
  }

  // Staggered honeycomb network positions for 4+ nodes (equilateral triangle sightlines)
  const staggeredSlots = [
    { x: 330, y: 170 },
    { x: 670, y: 170 },
    { x: 170, y: 390 },
    { x: 500, y: 390 },
    { x: 830, y: 390 },
    { x: 330, y: 610 },
    { x: 670, y: 610 },
    { x: 170, y: 830 },
    { x: 500, y: 830 },
    { x: 830, y: 830 },
  ];

  return nodes.map((node, i) => {
    const slot = staggeredSlots[i % staggeredSlots.length];
    const cycle = Math.floor(i / staggeredSlots.length);
    return {
      ...node,
      x: slot.x + (cycle * 30),
      y: slot.y + (cycle * 30),
    };
  });
}

/**
 * Clamps zoom scale within [MIN_ZOOM, MAX_ZOOM].
 */
export function clampZoom(scale: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}
