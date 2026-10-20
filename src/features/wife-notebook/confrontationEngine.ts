import type { CaseConfig } from '../../shared/contracts/case-schema';
import type { CaseKnowledgeGraph, CaseGraphEdge } from '../../shared/contracts/knowledge-graph';
import type { TaggedEvidenceItem, PlacedNode } from './types';

export interface ClueInfo {
  id: string;
  title: string;
  sourceApp?: string;
  snippet?: string;
  clueRefId?: string;
}

export interface VerifiedStringItem {
  id: string;
  sourceTitle: string;
  targetTitle: string;
  relationship: string;
  isSmokingGun: boolean;
  hint?: string;
}

export type ConvictionChanceLevel = 'very_low' | 'low' | 'high' | 'very_high';

export interface ConvictionChance {
  level: ConvictionChanceLevel;
  label: string;       // e.g. "Rất thấp"
  genericWord: string; // e.g. "Very low"
  displayText: string; // e.g. "Rất thấp (Very low)"
}

export interface ConfrontationPreflightInfo {
  totalClues: number;
  cluesFound: number;
  cluesFoundPercent: number;
  successRate: number;
  convictionChance: ConvictionChance;
  potentialStars: 0 | 1 | 2 | 3;
  isLowSuccessRate: boolean;
  verifiedCluesList: ClueInfo[];
  verifiedStringsList: VerifiedStringItem[];
}

export interface ConfrontationEvaluationParams {
  caseConfig: CaseConfig;
  knowledgeGraph?: CaseKnowledgeGraph;
  activeEdges: CaseGraphEdge[];
  unmaskedSuspectIds: string[];
  currentStrikes: number;
  placedNodes?: PlacedNode[];
  taggedSuspects?: TaggedEvidenceItem[];
  totalClues?: number;
  cluesFound?: number;
  rngRoll?: number; // 0..100, if omitted Math.random() * 100
}

export interface ConfrontationEvaluationResult {
  stars: 0 | 1 | 2 | 3;
  verifiedSmokingGunCount: number;
  requiredSmokingGunCount: number;
  verifiedSmokingGunEdgeIds: string[];
  totalClues: number;
  cluesFound: number;
  successRate: number;
  convictionChance: ConvictionChance;
  rngRoll: number;
  isRngSuccess: boolean;
  husbandName: string;
  husbandDialogue: string;
  husbandMood: 'confident' | 'surprised' | 'nervous' | 'broken';
  wifeTitle?: string;
  narrativeRoast?: string;
  isRedHerringAccusation: boolean;
  accusedSuspectName?: string;
  newStrikesRemaining: number;
  isMaxStrikesReached: boolean;
}

/**
 * Standard red-herring over-jealous roast dialogues for Level 1 suspects.
 */
const RED_HERRING_ROASTS_L1: Record<string, string> = {
  suspect_lan_anh:
    'Năm người góp mỗi người một trăm mua quà cho sếp. Em đọc đến dòng thứ ba là giải được, sao lại đối chất từ dòng thứ nhất?',
  suspect_thao:
    'Người ta nhắc anh mang phiếu đánh giá cột sống. Em bắt được lưng đau, chưa bắt được người tình.',
  suspect_ngoc:
    'Em gái nhắn cảm ơn anh trai còn chưa đủ rõ à? Chủ nhật về quê chắc phải giới thiệu lại gia phả.',
  suspect_mai:
    'Em kiểm tra điện thoại hay kiểm kê cả khu phố đấy? Mai anh còn đi làm!',
};

/**
 * Computes preflight details and RNG success probability based on clues found.
 *
 * Rules:
 * - < 50% (< 5 clues of 10): 0% success (Guaranteed fail -> 0 stars, +1 strike, warning shown).
 * - 5-8 clues (50%-80%): Success rate rises from 0% to 90% -> 1 star victory on success.
 * - 9 clues (90%): 100% success -> 2 stars victory.
 * - 10 clues (100%): 100% success -> 3 stars victory.
 * - If successRate < 50%: isLowSuccessRate is true (prompts warning popup).
 */
export function calculateConfrontationPreflight({
  caseConfig: _caseConfig,
  knowledgeGraph,
  activeEdges,
  placedNodes = [],
  taggedSuspects = [],
  totalClues = 10,
  explicitCluesFound,
}: {
  caseConfig?: CaseConfig;
  knowledgeGraph?: CaseKnowledgeGraph;
  activeEdges: CaseGraphEdge[];
  placedNodes?: PlacedNode[];
  taggedSuspects?: TaggedEvidenceItem[];
  totalClues?: number;
  explicitCluesFound?: number;
}): ConfrontationPreflightInfo {
  const requiredEdgeIds = knowledgeGraph?.requiredSmokingGunEdgeIds ?? [
    'edge_name_suspect',
    'edge_alibi_contradiction',
    'edge_zola_order_anniversary',
  ];

  // 1. Build verified strings list (canonical active edges)
  const canonicalActiveEdges = activeEdges.filter(e => e.isCanonical !== false);
  const verifiedStringsList: VerifiedStringItem[] = [];

  for (const edge of canonicalActiveEdges) {
    const isSmokingGun = Boolean(
      edge.isSmokingGun || (requiredEdgeIds && requiredEdgeIds.includes(edge.edgeId)),
    );

    const sourceNode = placedNodes.find(n => n.nodeId === edge.sourceNodeId) ||
      knowledgeGraph?.nodes.find(n => n.nodeId === edge.sourceNodeId);
    const targetNode = placedNodes.find(n => n.nodeId === edge.targetNodeId) ||
      knowledgeGraph?.nodes.find(n => n.nodeId === edge.targetNodeId);

    const sourceTitle = sourceNode?.label || edge.sourceNodeId;
    const targetTitle = targetNode?.label || edge.targetNodeId;

    verifiedStringsList.push({
      id: edge.edgeId,
      sourceTitle,
      targetTitle,
      relationship: edge.relationship,
      isSmokingGun,
      hint: edge.explanationRoastHint,
    });
  }

  // 2. Build verified clues list (only verified clues with clueRefId or canonical nodes)
  const verifiedCluesList: ClueInfo[] = [];
  const seenClueKeys = new Set<string>();

  for (const node of placedNodes) {
    const hasClueRef = Boolean(node.clueRefId);
    const isCanonical = knowledgeGraph?.nodes.some(kn => kn.nodeId === node.nodeId);
    const isConnectedToString = canonicalActiveEdges.some(
      e => e.sourceNodeId === node.nodeId || e.targetNodeId === node.nodeId,
    );

    if (hasClueRef || isCanonical || isConnectedToString) {
      const key = node.clueRefId || node.recordRefId || node.nodeId;
      if (!seenClueKeys.has(key)) {
        seenClueKeys.add(key);
        verifiedCluesList.push({
          id: key,
          title: node.label,
          sourceApp: node.sourceAppId,
          snippet: node.subtitle,
          clueRefId: node.clueRefId,
        });
      }
    }
  }

  for (const tag of taggedSuspects) {
    const hasClueRef = Boolean(tag.evidence?.clueRefId || tag.messages?.some(m => m.clueRefId));
    if (hasClueRef) {
      const key = tag.evidence?.clueRefId || tag.evidence?.recordId || tag.suspectId;
      if (!seenClueKeys.has(key)) {
        seenClueKeys.add(key);
        verifiedCluesList.push({
          id: key,
          title: tag.evidence?.title || tag.displayName,
          sourceApp: tag.sourceApp,
          snippet: tag.evidence?.snippet,
          clueRefId: tag.evidence?.clueRefId,
        });
      }
    }
  }

  // Fallback if no clues matched clueRefId filter (e.g. basic mock tests)
  if (verifiedCluesList.length === 0) {
    for (const node of placedNodes) {
      const key = node.recordRefId || node.nodeId;
      if (!seenClueKeys.has(key)) {
        seenClueKeys.add(key);
        verifiedCluesList.push({
          id: key,
          title: node.label,
          sourceApp: node.sourceAppId,
          snippet: node.subtitle,
        });
      }
    }
    for (const tag of taggedSuspects) {
      const key = tag.evidence?.recordId || tag.suspectId;
      if (!seenClueKeys.has(key)) {
        seenClueKeys.add(key);
        verifiedCluesList.push({
          id: key,
          title: tag.evidence?.title || tag.displayName,
          sourceApp: tag.sourceApp,
          snippet: tag.evidence?.snippet,
        });
      }
    }
  }

  const verifiedSmokingGunEdges = canonicalActiveEdges.filter(
    e => e.isSmokingGun || requiredEdgeIds.includes(e.edgeId),
  );

  let cluesFound = explicitCluesFound !== undefined
    ? explicitCluesFound
    : Math.max(verifiedCluesList.length, verifiedSmokingGunEdges.length * 3);

  // If player connected all 3 smoking guns, guarantee at least 10 clues
  if (explicitCluesFound === undefined && verifiedSmokingGunEdges.length >= 3) {
    cluesFound = Math.max(cluesFound, 10);
  } else if (explicitCluesFound === undefined && verifiedSmokingGunEdges.length === 2) {
    cluesFound = Math.max(cluesFound, 9);
  } else if (explicitCluesFound === undefined && verifiedSmokingGunEdges.length === 1) {
    cluesFound = Math.max(cluesFound, 5);
  }

  // Clamp cluesFound within [0, totalClues]
  cluesFound = Math.max(0, Math.min(totalClues, cluesFound));
  const cluesFoundPercent = Math.round((cluesFound / totalClues) * 100);

  let successRate: number;
  let potentialStars: 0 | 1 | 2 | 3;
  let convictionChance: ConvictionChance;

  if (cluesFound < 5) {
    // Less than 50%: 0% success
    successRate = 0;
    potentialStars = 0;
    convictionChance = {
      level: 'very_low',
      label: 'Rất thấp',
      genericWord: 'Very low',
      displayText: 'Rất thấp (Very low)',
    };
  } else if (cluesFound >= 5 && cluesFound <= 8) {
    // 5 to 8 clues: 0% to 90% scaling
    // 5 clues: 30%, 6 clues: 50%, 7 clues: 70%, 8 clues: 90%
    successRate = Math.round(30 + ((cluesFound - 5) / 3) * 60);
    potentialStars = 1;
    if (cluesFound === 5) {
      convictionChance = {
        level: 'low',
        label: 'Thấp',
        genericWord: 'Low',
        displayText: 'Thấp (Low)',
      };
    } else {
      convictionChance = {
        level: 'high',
        label: 'Cao',
        genericWord: 'High chance',
        displayText: 'Cao (High chance)',
      };
    }
  } else if (cluesFound === 9) {
    // 9 clues: 100% success -> 2 stars
    successRate = 100;
    potentialStars = 2;
    convictionChance = {
      level: 'very_high',
      label: 'Rất cao',
      genericWord: 'Very high chance',
      displayText: 'Rất cao (Very high chance)',
    };
  } else {
    // 10 clues: 100% success -> 3 stars
    successRate = 100;
    potentialStars = 3;
    convictionChance = {
      level: 'very_high',
      label: 'Rất cao',
      genericWord: 'Very high chance',
      displayText: 'Rất cao (Very high chance)',
    };
  }

  const isLowSuccessRate = successRate < 50;

  return {
    totalClues,
    cluesFound,
    cluesFoundPercent,
    successRate,
    convictionChance,
    potentialStars,
    isLowSuccessRate,
    verifiedCluesList,
    verifiedStringsList,
  };
}

/**
 * Pure evaluation engine for Anytime Confrontation (US-016).
 * Analyzes active corkboard edges, clue counts, and RNG roll.
 */
export function evaluateConfrontation({
  caseConfig,
  knowledgeGraph,
  activeEdges,
  unmaskedSuspectIds,
  currentStrikes,
  placedNodes,
  taggedSuspects,
  totalClues = 10,
  cluesFound: explicitCluesFound,
  rngRoll,
}: ConfrontationEvaluationParams): ConfrontationEvaluationResult {
  const husbandName = caseConfig.husbandName || 'Hoàng';
  const groundTruth = caseConfig.groundTruth;
  const culpritId = groundTruth.culpritSuspectId;

  // 1. Identify canonical required smoking-gun edge IDs
  const requiredEdgeIds = knowledgeGraph?.requiredSmokingGunEdgeIds ?? [
    'edge_name_suspect',
    'edge_alibi_contradiction',
    'edge_zola_order_anniversary',
  ];
  const requiredCount = Math.max(3, requiredEdgeIds.length);

  // 2. Identify verified smoking-gun edges in the player's active corkboard
  const verifiedSmokingGunEdgeIds: string[] = [];
  for (const edge of activeEdges) {
    const matchesRequired = requiredEdgeIds.includes(edge.edgeId);
    if ((edge.isSmokingGun || matchesRequired) && !verifiedSmokingGunEdgeIds.includes(edge.edgeId)) {
      verifiedSmokingGunEdgeIds.push(edge.edgeId);
    }
  }

  const verifiedCount = verifiedSmokingGunEdgeIds.length;

  // 3. Preflight & RNG Calculation
  const preflight = calculateConfrontationPreflight({
    caseConfig,
    knowledgeGraph,
    activeEdges,
    placedNodes,
    taggedSuspects,
    totalClues,
    explicitCluesFound,
  });

  const actualRngRoll = rngRoll !== undefined ? rngRoll : Math.random() * 100;
  const isRngSuccess = actualRngRoll < preflight.successRate;

  // 4. Check for red-herring suspect accusations
  let isRedHerringAccusation = false;
  let accusedSuspectName: string | undefined;
  let redHerringRoast: string | undefined;

  if ((!isRngSuccess || preflight.potentialStars === 0) && caseConfig.suspectPool) {
    for (const suspect of caseConfig.suspectPool) {
      if (suspect.suspectId === culpritId) continue;

      const isConnected = activeEdges.some(
        e => e.sourceNodeId.includes(suspect.suspectId) || e.targetNodeId.includes(suspect.suspectId),
      );
      const isUnmasked = unmaskedSuspectIds.some(id => id.includes(suspect.suspectId));

      if (isConnected || isUnmasked) {
        isRedHerringAccusation = true;
        accusedSuspectName = suspect.displayName;
        redHerringRoast =
          RED_HERRING_ROASTS_L1[suspect.suspectId] ||
          groundTruth.overJealousRoast ||
          'Em đa nghi quá rồi! Người ta chỉ là đồng nghiệp bình thường thôi mà!';
        break;
      }
    }
  }

  // 5. Calculate final stars, dialogue, and husband mood
  let stars: 0 | 1 | 2 | 3;
  let husbandDialogue: string;
  let husbandMood: 'confident' | 'surprised' | 'nervous' | 'broken';
  let wifeTitle: string | undefined;
  let narrativeRoast: string | undefined;

  if (isRngSuccess && preflight.potentialStars > 0) {
    stars = preflight.potentialStars;

    if (stars === 3) {
      // 3 Stars: Watertight victory (Bắt quả tang trọn vẹn)
      husbandMood = 'broken';
      husbandDialogue =
        'Anh xin lỗi vợ... Thôi anh khai thật! Bọn anh có hẹn riêng tối nay ở quán cơm niêu... Em đừng giận nữa mà!';
      wifeTitle = 'Nữ thám tử ghen tuông';
      narrativeRoast =
        groundTruth.narrativeRoast ||
        'Thợ điện gì mà hẹn lại đúng ngày, nhận váy kèm thiệp riêng, còn khiến anh họp ở công ty mà quẹt thẻ tận quán cơm! Anh sửa điện hay sửa luôn lời khai?';
    } else if (stars === 2) {
      // 2 Stars: Partial victory (Đã vạch trần một phần)
      husbandMood = 'nervous';
      husbandDialogue =
        'Con bé Marketing nhờ anh đặt hộ để áp mã Freeship Extra thôi mà em! Anh có biết gì đâu...';
    } else {
      // 1 Star: Partial victory (Thắng non)
      husbandMood = 'surprised';
      husbandDialogue =
        'Số thợ điện hôm trước anh gọi nhờ sửa dây mạng văn phòng mà... chứ có gì đâu!';
    }
  } else {
    // 0 Stars: Premature confrontation failure or RNG roll failed
    stars = 0;
    husbandMood = 'confident';
    if (isRedHerringAccusation && redHerringRoast) {
      husbandDialogue = redHerringRoast;
    } else {
      husbandDialogue =
        'Em lại lướt TikTok drama rồi đa nghi đúng không? Anh đi làm cả ngày mệt mỏi, em lại tra khảo anh chuyện vô căn cứ!';
    }
  }

  // 6. Suspicion strike calculation for 0-star premature confrontations
  const newStrikesRemaining = stars === 0 ? Math.max(0, currentStrikes - 1) : currentStrikes;
  const isMaxStrikesReached = stars === 0 && newStrikesRemaining === 0;

  return {
    stars,
    verifiedSmokingGunCount: verifiedCount,
    requiredSmokingGunCount: requiredCount,
    verifiedSmokingGunEdgeIds,
    totalClues: preflight.totalClues,
    cluesFound: preflight.cluesFound,
    successRate: preflight.successRate,
    convictionChance: preflight.convictionChance,
    rngRoll: actualRngRoll,
    isRngSuccess,
    husbandName,
    husbandDialogue,
    husbandMood,
    wifeTitle,
    narrativeRoast,
    isRedHerringAccusation,
    accusedSuspectName,
    newStrikesRemaining,
    isMaxStrikesReached,
  };
}
