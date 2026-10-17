import { describe, it, expect } from 'vitest';
import {
  createEdgeBetweenNodes,
  evaluateUnmaskedSuspects,
  evaluateContradictions,
  autoArrangeNodes,
  clampZoom,
  MIN_ZOOM,
  MAX_ZOOM,
} from './graphEngine';
import { LEVEL_01_KNOWLEDGE_GRAPH } from './level01Fixture';
import type { PlacedNode } from './types';
import type { CaseGraphEdge } from '../../shared/contracts/knowledge-graph';

describe('US-015: Wife Detective Corkboard & Graph Engine Suite', () => {
  it('clamps zoom scales strictly between 0.5x and 2.0x', () => {
    expect(clampZoom(0.2)).toBe(MIN_ZOOM);
    expect(clampZoom(0.5)).toBe(0.5);
    expect(clampZoom(1.0)).toBe(1.0);
    expect(clampZoom(1.5)).toBe(1.5);
    expect(clampZoom(2.0)).toBe(2.0);
    expect(clampZoom(3.5)).toBe(MAX_ZOOM);
  });

  it('prevents self-connections and duplicate edges between the same two nodes', () => {
    const existingEdges: CaseGraphEdge[] = [];

    // Self connection
    const selfRes = createEdgeBetweenNodes(
      LEVEL_01_KNOWLEDGE_GRAPH,
      existingEdges,
      'node_alias_tuan',
      'node_alias_tuan',
    );
    expect(selfRes.newEdge).toBeNull();
    expect(selfRes.isDuplicate).toBe(false);

    // Initial valid connection
    const firstRes = createEdgeBetweenNodes(
      LEVEL_01_KNOWLEDGE_GRAPH,
      existingEdges,
      'node_alias_tuan',
      'node_bridge_phone',
    );
    expect(firstRes.newEdge).not.toBeNull();
    expect(firstRes.isDuplicate).toBe(false);

    const updatedEdges = [...existingEdges, firstRes.newEdge!];

    // Attempt duplicate connection in same direction
    const dupRes1 = createEdgeBetweenNodes(
      LEVEL_01_KNOWLEDGE_GRAPH,
      updatedEdges,
      'node_alias_tuan',
      'node_bridge_phone',
    );
    expect(dupRes1.newEdge).toBeNull();
    expect(dupRes1.isDuplicate).toBe(true);

    // Attempt duplicate connection in reverse direction
    const dupRes2 = createEdgeBetweenNodes(
      LEVEL_01_KNOWLEDGE_GRAPH,
      updatedEdges,
      'node_bridge_phone',
      'node_alias_tuan',
    );
    expect(dupRes2.newEdge).toBeNull();
    expect(dupRes2.isDuplicate).toBe(true);
  });

  it('inherits canonical metadata, smoking-gun flags, and roast hints when connecting matching nodes', () => {
    const res = createEdgeBetweenNodes(
      LEVEL_01_KNOWLEDGE_GRAPH,
      [],
      'node_record_wife_alibi',
      'node_record_bank_receipt',
    );

    expect(res.newEdge).not.toBeNull();
    expect(res.newEdge?.relationship).toBe('contradicts_alibi');
    expect(res.newEdge?.isSmokingGun).toBe(true);
    expect(res.newEdge?.explanationRoastHint).toContain('lúc đó cả nhóm kéo nhau ra quán ăn đêm');
  });

  it('preserves Zero-Spoiler invariant: unmasks suspect identity ONLY when a complete bridge path exists', () => {
    // Stage 1: No connections -> suspect is NOT unmasked
    expect(evaluateUnmaskedSuspects(LEVEL_01_KNOWLEDGE_GRAPH, [])).toEqual([]);

    // Stage 2: Partial connection (Alias -> Phone number bridge) -> suspect NOT unmasked yet
    const partialEdges: CaseGraphEdge[] = [
      {
        edgeId: 'edge_alias_phone',
        sourceNodeId: 'node_alias_tuan',
        targetNodeId: 'node_bridge_phone',
        relationship: 'bridges_identity',
        isSmokingGun: false,
      },
    ];
    expect(evaluateUnmaskedSuspects(LEVEL_01_KNOWLEDGE_GRAPH, partialEdges)).toEqual([]);

    // Stage 3: Adding bridge to legal name -> still no direct link to suspect_huong
    const multiHopEdges: CaseGraphEdge[] = [
      ...partialEdges,
      {
        edgeId: 'edge_order_phone',
        sourceNodeId: 'node_record_ecommerce_order',
        targetNodeId: 'node_bridge_phone',
        relationship: 'bridges_identity',
        isSmokingGun: false,
      },
      {
        edgeId: 'edge_order_name',
        sourceNodeId: 'node_record_ecommerce_order',
        targetNodeId: 'node_bridge_name',
        relationship: 'bridges_identity',
        isSmokingGun: false,
      },
    ];
    expect(evaluateUnmaskedSuspects(LEVEL_01_KNOWLEDGE_GRAPH, multiHopEdges)).toEqual([]);

    // Stage 4: Connecting legal name to suspect_huong -> PATH IS COMPLETE! Suspect is unmasked!
    const completeChainEdges: CaseGraphEdge[] = [
      ...multiHopEdges,
      {
        edgeId: 'edge_name_suspect',
        sourceNodeId: 'node_bridge_name',
        targetNodeId: 'node_suspect_huong',
        relationship: 'bridges_identity',
        isSmokingGun: true,
      },
    ];
    const unmasked = evaluateUnmaskedSuspects(LEVEL_01_KNOWLEDGE_GRAPH, completeChainEdges);
    expect(unmasked).toContain('node_suspect_huong');
  });

  it('evaluates contradiction edges correctly', () => {
    const edges: CaseGraphEdge[] = [
      {
        edgeId: 'edge_alibi_contradiction',
        sourceNodeId: 'node_record_wife_alibi',
        targetNodeId: 'node_record_bank_receipt',
        relationship: 'contradicts_alibi',
        isSmokingGun: true,
      },
      {
        edgeId: 'edge_alias_phone',
        sourceNodeId: 'node_alias_tuan',
        targetNodeId: 'node_bridge_phone',
        relationship: 'bridges_identity',
        isSmokingGun: false,
      },
    ];

    const contradictions = evaluateContradictions(edges);
    expect(contradictions).toEqual(['edge_alibi_contradiction']);
  });

  it('auto-arranges nodes into 3 distinct magnetic swimlanes', () => {
    const rawNodes: PlacedNode[] = [
      { nodeId: 'n1', type: 'alias', label: 'Alias 1', x: 0, y: 0 },
      { nodeId: 'n2', type: 'suspect', label: 'Suspect 1', x: 0, y: 0 },
      { nodeId: 'n3', type: 'bridge_id', label: 'Bridge 1', x: 0, y: 0 },
      { nodeId: 'n4', type: 'record_clue', label: 'Record 1', x: 0, y: 0 },
      { nodeId: 'n5', type: 'timeline_slot', label: 'Slot 1', x: 0, y: 0 },
    ];

    const arranged = autoArrangeNodes(rawNodes);

    // Left swimlane (X = 180)
    expect(arranged.find(n => n.nodeId === 'n1')?.x).toBe(180);
    expect(arranged.find(n => n.nodeId === 'n2')?.x).toBe(180);

    // Center swimlane (X = 600)
    expect(arranged.find(n => n.nodeId === 'n3')?.x).toBe(600);
    expect(arranged.find(n => n.nodeId === 'n4')?.x).toBe(600);

    // Right swimlane (X = 1000)
    expect(arranged.find(n => n.nodeId === 'n5')?.x).toBe(1000);
  });
});
