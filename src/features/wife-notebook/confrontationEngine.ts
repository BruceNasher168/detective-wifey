import type { CaseConfig } from '../../shared/contracts/case-schema';
import type { CaseKnowledgeGraph, CaseGraphEdge } from '../../shared/contracts/knowledge-graph';

export interface ConfrontationEvaluationParams {
  caseConfig: CaseConfig;
  knowledgeGraph?: CaseKnowledgeGraph;
  activeEdges: CaseGraphEdge[];
  unmaskedSuspectIds: string[];
  currentStrikes: number;
}

export interface ConfrontationEvaluationResult {
  stars: 0 | 1 | 2 | 3;
  verifiedSmokingGunCount: number;
  requiredSmokingGunCount: number;
  verifiedSmokingGunEdgeIds: string[];
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
 * Pure evaluation engine for Anytime Confrontation (US-016).
 * Analyzes active corkboard edges against case ground truth and knowledge graph.
 */
export function evaluateConfrontation({
  caseConfig,
  knowledgeGraph,
  activeEdges,
  unmaskedSuspectIds,
  currentStrikes,
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
    // An edge qualifies if it has isSmokingGun=true and matches requiredEdgeIds (or is canonical smoking-gun)
    const matchesRequired = requiredEdgeIds.includes(edge.edgeId);
    if ((edge.isSmokingGun || matchesRequired) && !verifiedSmokingGunEdgeIds.includes(edge.edgeId)) {
      verifiedSmokingGunEdgeIds.push(edge.edgeId);
    }
  }

  const verifiedCount = verifiedSmokingGunEdgeIds.length;

  // 3. Check for red-herring suspect accusations
  // Occurs if the player connected edges to an innocent suspect or unmasked them while having 0 smoking guns
  let isRedHerringAccusation = false;
  let accusedSuspectName: string | undefined;
  let redHerringRoast: string | undefined;

  if (verifiedCount === 0 && caseConfig.suspectPool) {
    for (const suspect of caseConfig.suspectPool) {
      if (suspect.suspectId === culpritId) continue;

      // Check if this innocent suspect is connected to any active edge or unmasked
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

  // 4. Calculate star rating and tiered excuse ladder
  let stars: 0 | 1 | 2 | 3;
  let husbandDialogue: string;
  let husbandMood: 'confident' | 'surprised' | 'nervous' | 'broken';
  let wifeTitle: string | undefined;
  let narrativeRoast: string | undefined;

  if (verifiedCount >= 3 || (requiredCount > 0 && verifiedCount >= requiredCount)) {
    // 3 Stars: Watertight victory (Bắt quả tang trọn vẹn)
    stars = 3;
    husbandMood = 'broken';
    husbandDialogue =
      'Anh xin lỗi vợ... Thôi anh khai thật! Bọn anh có hẹn riêng tối nay ở quán cơm niêu... Em đừng giận nữa mà!';
    wifeTitle = 'Nữ thám tử ghen tuông';
    narrativeRoast =
      groundTruth.narrativeRoast ||
      'Thợ điện gì mà hẹn lại đúng ngày, nhận váy kèm thiệp riêng, còn khiến anh họp ở công ty mà quẹt thẻ tận quán cơm! Anh sửa điện hay sửa luôn lời khai?';
  } else if (verifiedCount === 2) {
    // 2 Stars: Partial victory (Đã vạch trần một phần)
    stars = 2;
    husbandMood = 'nervous';
    husbandDialogue =
      'Con bé Marketing nhờ anh đặt hộ để áp mã Freeship Extra thôi mà em! Anh có biết gì đâu...';
  } else if (verifiedCount === 1) {
    // 1 Star: Partial victory (Thắng non)
    stars = 1;
    husbandMood = 'surprised';
    husbandDialogue =
      'Số thợ điện hôm trước anh gọi nhờ sửa dây mạng văn phòng mà... chứ có gì đâu!';
  } else {
    // 0 Stars: Premature confrontation failure (Cáo buộc non)
    stars = 0;
    husbandMood = 'confident';
    if (isRedHerringAccusation && redHerringRoast) {
      husbandDialogue = redHerringRoast;
    } else {
      husbandDialogue =
        'Em lại lướt TikTok drama rồi đa nghi đúng không? Anh đi làm cả ngày mệt mỏi, em lại tra khảo anh chuyện vô căn cứ!';
    }
  }

  // 5. Suspicion strike calculation for 0-star premature confrontations
  const newStrikesRemaining = stars === 0 ? Math.max(0, currentStrikes - 1) : currentStrikes;
  const isMaxStrikesReached = stars === 0 && newStrikesRemaining === 0;

  return {
    stars,
    verifiedSmokingGunCount: verifiedCount,
    requiredSmokingGunCount: requiredCount,
    verifiedSmokingGunEdgeIds,
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
