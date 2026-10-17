import type { CaseKnowledgeGraph, CaseGraphEdge, CaseGraphNode } from '../../shared/contracts/knowledge-graph';
import type { PlacedNode } from './types';

export const CANVAS_SIZE = 1200;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.0;

/**
 * 3 columns centered horizontally on the 1200px canvas.
 * Card width = 210px. Gap = 120px. Total span = 870px.
 * Left & right margins = (1200 - 870) / 2 = 165px.
 * Column 0: 165 (center 270)
 * Column 1: 495 (center 600 - exact canvas center)
 * Column 2: 825 (center 930)
 */
export const CARD_WIDTH = 210;
export const COLUMN_GAP = 40;
export const CORKBOARD_ROW_HEIGHT = 220;
export const CORKBOARD_VERTICAL_GAP = 40;
export const INITIAL_BASE_Y = 160;

/**
 * Default fallback columns (centered at 600 with 40px gap).
 * Col 0: 245 (center 350)
 * Col 1: 495 (center 600 - canvas center)
 * Col 2: 745 (center 850)
 */
export const CORKBOARD_COLUMNS_X = [245, 495, 745] as const;

/**
 * Calculates symmetric, centered X coordinates for `count` cards (1..3) in a row,
 * centered horizontally around `clusterCenterX`.
 */
export function getRowColumnPositions(count: number, clusterCenterX: number): number[] {
  const clampedCount = Math.max(1, Math.min(3, count));
  const totalWidth = clampedCount * CARD_WIDTH + (clampedCount - 1) * COLUMN_GAP;
  let startX = clusterCenterX - totalWidth / 2;

  // Clamp within canvas boundaries [30, CANVAS_SIZE - totalWidth - 30]
  startX = Math.max(30, Math.min(CANVAS_SIZE - totalWidth - 30, startX));

  const positions: number[] = [];
  for (let i = 0; i < clampedCount; i++) {
    positions.push(Math.round(startX + i * (CARD_WIDTH + COLUMN_GAP)));
  }
  return positions;
}

/**
 * Computes an estimated card height to prevent row overlap.
 */
export function getEstimatedCardHeight(node: CaseGraphNode): number {
  const msgCount = node.messages?.length ?? 0;
  if (msgCount > 0) {
    return Math.max(100, 75 + Math.min(msgCount, 4) * 25);
  }
  return node.subtitle ? 120 : 80;
}

/**
 * Places newly pinned nodes below all existing placed nodes in rows of up to 3 columns,
 * centered horizontally according to the current card areas (cluster center).
 * Guaranteed zero overlap with existing cards.
 */
export function placeNewNodesBelow(
  existingNodes: PlacedNode[],
  newNodes: CaseGraphNode[],
): PlacedNode[] {
  if (newNodes.length === 0) return [];

  // 1. Calculate the horizontal center of existing card areas
  let clusterCenterX = CANVAS_SIZE / 2; // 600 default
  if (existingNodes.length > 0) {
    const lefts = existingNodes.map(n => n.x);
    const rights = existingNodes.map(n => n.x + CARD_WIDTH);
    const clusterLeft = Math.min(...lefts);
    const clusterRight = Math.max(...rights);
    clusterCenterX = Math.round((clusterLeft + clusterRight) / 2);
  }

  const result: PlacedNode[] = [];
  const remainingNewNodes = [...newNodes];

  // 2. Check if the bottom-most row in existingNodes has capacity (< 3 cards)
  if (existingNodes.length > 0) {
    const maxY = Math.max(...existingNodes.map(n => n.y));
    const bottomRowCards = existingNodes.filter(n => Math.abs(n.y - maxY) <= 30);

    // Verify bottomRowCards is an open shelf row below other cards
    const otherCards = existingNodes.filter(n => Math.abs(n.y - maxY) > 30);
    const otherMaxBottom = otherCards.length > 0
      ? Math.max(...otherCards.map(n => n.y + getEstimatedCardHeight(n)))
      : 0;

    const currentXs = getRowColumnPositions(bottomRowCards.length, clusterCenterX);
    const isMatchingShelf = bottomRowCards.every(card =>
      currentXs.some(cx => Math.abs(card.x - cx) <= 25)
    );

    const isBottomShelf = isMatchingShelf && (otherCards.length === 0 || maxY >= otherMaxBottom - 20);

    if (isBottomShelf && bottomRowCards.length >= 1 && bottomRowCards.length < 3) {
      const slotsToFill = Math.min(3 - bottomRowCards.length, remainingNewNodes.length);
      const newTotalInRow = bottomRowCards.length + slotsToFill;
      const newXs = getRowColumnPositions(newTotalInRow, clusterCenterX);

      // Re-align existing cards on this row to stay centered
      bottomRowCards.forEach((card, idx) => {
        card.x = newXs[idx];
      });

      // Place incoming nodes into remaining slots on this row
      for (let i = 0; i < slotsToFill; i++) {
        const node = remainingNewNodes.shift()!;
        result.push({
          ...node,
          x: newXs[bottomRowCards.length + i],
          y: maxY,
        });
      }
    }
  }

  // 3. For any remaining new nodes, create new rows below the lowest existing card
  if (remainingNewNodes.length > 0) {
    const allExisting = [...existingNodes, ...result];
    const bottoms = allExisting.map(n => n.y + getEstimatedCardHeight(n));
    let baseY = Math.max(...bottoms, INITIAL_BASE_Y - CORKBOARD_VERTICAL_GAP) + CORKBOARD_VERTICAL_GAP;

    let idx = 0;
    while (idx < remainingNewNodes.length) {
      const nodesInThisRow = Math.min(3, remainingNewNodes.length - idx);
      const xs = getRowColumnPositions(nodesInThisRow, clusterCenterX);
      const currentY = Math.max(40, Math.min(CANVAS_SIZE - 200, baseY));

      for (let c = 0; c < nodesInThisRow; c++) {
        const node = remainingNewNodes[idx + c];
        result.push({
          ...node,
          x: xs[c],
          y: currentY,
        });
      }

      idx += nodesInThisRow;
      baseY += CORKBOARD_ROW_HEIGHT;
    }
  }

  return result;
}

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

  // Helper to find equivalent canonical node IDs (e.g. node_alias_tuan and node_record_zola_chat share recordRefId)
  const getEquivalentNodeIds = (targetId: string): string[] => {
    const ids = [targetId];
    const node = canonicalGraph.nodes.find(n => n.nodeId === targetId);
    if (node?.recordRefId) {
      for (const other of canonicalGraph.nodes) {
        if (other.nodeId !== targetId && other.recordRefId === node.recordRefId && (!other.sourceAppId || !node.sourceAppId || other.sourceAppId === node.sourceAppId)) {
          ids.push(other.nodeId);
        }
      }
    }
    return ids;
  };

  const nodeAIds = getEquivalentNodeIds(nodeAId);
  const nodeBIds = getEquivalentNodeIds(nodeBId);

  // Look for canonical match in both directions (including equivalent conversation nodes)
  const canonical = canonicalGraph.edges.find(
    e => (nodeAIds.includes(e.sourceNodeId) && nodeBIds.includes(e.targetNodeId)) ||
         (nodeBIds.includes(e.sourceNodeId) && nodeAIds.includes(e.targetNodeId)),
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
