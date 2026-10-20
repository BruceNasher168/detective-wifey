import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  evaluateConfrontation,
  ConfrontationModal,
  WifeNotebookModal,
  LEVEL_01_KNOWLEDGE_GRAPH,
} from '../features/wife-notebook';
import { PlaySession } from '../features/play-session';
import type { CaseConfig } from '../shared/contracts/case-schema';
import type { CaseGraphEdge } from '../shared/contracts/knowledge-graph';
import type { GameStateRepository, ActiveSessionState, PlayerProgress } from '../features/session';

describe('US-016 - Anytime Confrontation Hub & Dynamic Excuse Engine Suite', () => {
  const mockCaseConfig: CaseConfig = {
    caseId: 'case_01',
    husbandId: 'husband_hoang',
    husbandName: 'Hoàng',
    levelNumber: 1,
    allowedStrikes: 5,
    groundTruth: {
      verdict: 'cheating',
      culpritSuspectId: 'suspect_huong',
      narrativeRoast:
        'Thợ điện gì mà hẹn lại đúng ngày, nhận váy kèm thiệp riêng, còn khiến anh họp ở công ty mà quẹt thẻ tận quán cơm! Anh sửa điện hay sửa luôn lời khai?',
      overJealousRoast:
        'Năm người góp mỗi người một trăm mua quà cho sếp. Em đọc đến dòng thứ ba là giải được, sao lại đối chất từ dòng thứ nhất?',
    },
    suspectPool: [
      {
        suspectId: 'suspect_huong',
        displayName: 'Nguyễn Thị Thu Hương',
        initialDiscoveredApp: 'internet-messaging',
      },
      {
        suspectId: 'suspect_lan_anh',
        displayName: 'Lan Anh Kế Toán',
        initialDiscoveredApp: 'internet-messaging',
      },
    ],
    lockChallenges: [],
    deviceMetadata: {
      narrativeTime: '23:45',
      batteryPercent: '42%',
      carrierTag: '5G',
      pwaThemeColor: '#0f172a',
    },
    activeAppIds: ['internet-messaging', 'banking', 'ecommerce', 'phone'],
    appsData: {},
  };

  const smokingGunEdge1: CaseGraphEdge = {
    edgeId: 'edge_name_suspect',
    sourceNodeId: 'node_bridge_name',
    targetNodeId: 'node_suspect_huong',
    relationship: 'bridges_identity',
    isSmokingGun: true,
  };

  const smokingGunEdge2: CaseGraphEdge = {
    edgeId: 'edge_alibi_contradiction',
    sourceNodeId: 'node_record_wife_alibi',
    targetNodeId: 'node_record_bank_receipt',
    relationship: 'contradicts_alibi',
    isSmokingGun: true,
  };

  const smokingGunEdge3: CaseGraphEdge = {
    edgeId: 'edge_zola_order_anniversary',
    sourceNodeId: 'node_record_zola_chat',
    targetNodeId: 'node_record_ecommerce_order',
    relationship: 'bridges_identity',
    isSmokingGun: true,
  };

  describe('Pure Graph Evaluation & Tiered Excuse Ladder', () => {
    it('AC 3: 0 smoking-gun links triggers 0 stars, gaslighting dialogue, and 1 strike penalty', () => {
      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [],
        unmaskedSuspectIds: [],
        currentStrikes: 5,
      });

      expect(result.stars).toBe(0);
      expect(result.verifiedSmokingGunCount).toBe(0);
      expect(result.husbandMood).toBe('confident');
      expect(result.husbandDialogue).toContain('Em lại lướt TikTok drama rồi đa nghi đúng không?');
      expect(result.newStrikesRemaining).toBe(4);
      expect(result.isMaxStrikesReached).toBe(false);
    });

    it('AC 3: 0 smoking-gun links reaching maximum strikes triggers isMaxStrikesReached', () => {
      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [],
        unmaskedSuspectIds: [],
        currentStrikes: 1, // Last strike remaining
      });

      expect(result.stars).toBe(0);
      expect(result.newStrikesRemaining).toBe(0);
      expect(result.isMaxStrikesReached).toBe(true);
    });

    it('AC 7: Accusing an innocent red-herring suspect with bridge edges triggers specific over-jealous roast', () => {
      const redHerringEdge: CaseGraphEdge = {
        edgeId: 'custom_edge_lan_anh',
        sourceNodeId: 'node_bridge_phone',
        targetNodeId: 'node_suspect_lan_anh',
        relationship: 'bridges_identity',
      };

      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [redHerringEdge],
        unmaskedSuspectIds: ['node_suspect_lan_anh'],
        currentStrikes: 5,
      });

      expect(result.stars).toBe(0);
      expect(result.isRedHerringAccusation).toBe(true);
      expect(result.husbandDialogue).toContain('Năm người góp mỗi người một trăm mua quà cho sếp');
    });

    it('AC 4: 1 verified smoking-gun link yields 1 star and defensive stammering excuse', () => {
      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
        rngRoll: 10,
      });

      expect(result.stars).toBe(1);
      expect(result.verifiedSmokingGunCount).toBe(1);
      expect(result.husbandMood).toBe('surprised');
      expect(result.husbandDialogue).toContain('Số thợ điện hôm trước anh gọi nhờ sửa dây mạng văn phòng mà');
    });

    it('AC 5: 2 verified smoking-gun links yield 2 stars and stammering partial explanation', () => {
      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1, smokingGunEdge2],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
      });

      expect(result.stars).toBe(2);
      expect(result.verifiedSmokingGunCount).toBe(2);
      expect(result.husbandMood).toBe('nervous');
      expect(result.husbandDialogue).toContain('Con bé Marketing nhờ anh đặt hộ để áp mã Freeship Extra thôi mà em');
    });

    it('AC 6: 3 verified smoking-gun links yield 3 stars, full breakdown confession, Wife Title, and roast', () => {
      const result = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1, smokingGunEdge2, smokingGunEdge3],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
      });

      expect(result.stars).toBe(3);
      expect(result.verifiedSmokingGunCount).toBe(3);
      expect(result.husbandMood).toBe('broken');
      expect(result.husbandDialogue).toContain('Anh xin lỗi vợ... Thôi anh khai thật! Bọn anh có hẹn riêng tối nay ở quán cơm niêu');
      expect(result.wifeTitle).toBe('Nữ thám tử ghen tuông');
      expect(result.narrativeRoast).toBe(mockCaseConfig.groundTruth.narrativeRoast);
    });
  });

  describe('ConfrontationModal Component Rendering', () => {
    it('Renders 0-star premature confrontation with warning and "Tiếp tục điều tra" button', () => {
      const eval0 = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [],
        unmaskedSuspectIds: [],
        currentStrikes: 5,
      });

      const html = renderToStaticMarkup(
        <ConfrontationModal
          isOpen={true}
          evaluation={eval0}
          maxStrikes={5}
          onContinueInvestigation={vi.fn()}
          onClose={vi.fn()}
        />,
      );

      expect(html).toContain('CẢNH BÁO: Nghi ngờ tăng thêm 1 vạch!');
      expect(html).toContain('1/5'); // 1 strike used
      expect(html).toContain('Tiếp tục điều tra');
      expect(html).toContain('Khoanh tay, tự tin');
    });

    it('Renders 2-star partial verdict with "Tha thứ & Qua màn" and "Điều tra tiếp để đạt 3 sao" buttons', () => {
      const eval2 = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1, smokingGunEdge2],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
      });

      const html = renderToStaticMarkup(
        <ConfrontationModal
          isOpen={true}
          evaluation={eval2}
          maxStrikes={5}
          onForgiveAndAdvance={vi.fn()}
          onContinueInvestigation={vi.fn()}
          onClose={vi.fn()}
        />,
      );

      expect(html).toContain('ĐÃ VẠCH TRẦN MỘT PHẦN');
      expect(html).toContain('Tha thứ &amp; Qua màn');
      expect(html).toContain('Điều tra tiếp để đạt 3 sao');
      expect(html).toContain('Gãi đầu, toát mồ hôi');
    });

    it('Renders 3-star victory with Wife Title, narrative roast, and "Tạo thẻ Roast khoe MXH" button', () => {
      const eval3 = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1, smokingGunEdge2, smokingGunEdge3],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
      });

      const html = renderToStaticMarkup(
        <ConfrontationModal
          isOpen={true}
          evaluation={eval3}
          maxStrikes={5}
          onShareRoastCard={vi.fn()}
          onForgiveAndAdvance={vi.fn()}
          onContinueInvestigation={vi.fn()}
          onClose={vi.fn()}
        />,
      );

      expect(html).toContain('Nữ thám tử ghen tuông');
      expect(html).toContain('Thợ điện gì mà hẹn lại đúng ngày');
      expect(html).toContain('Tạo thẻ Roast khoe MXH');
      expect(html).toContain('Tha thứ &amp; Qua màn');
      expect(html).toContain('Cúi đầu, nhận tội');
    });

    it('Strict Zero-Emoji Invariant: ConfrontationModal contains zero raw Unicode emojis', () => {
      const eval3 = evaluateConfrontation({
        caseConfig: mockCaseConfig,
        knowledgeGraph: LEVEL_01_KNOWLEDGE_GRAPH,
        activeEdges: [smokingGunEdge1, smokingGunEdge2, smokingGunEdge3],
        unmaskedSuspectIds: ['node_suspect_huong'],
        currentStrikes: 5,
      });

      const html = renderToStaticMarkup(
        <ConfrontationModal
          isOpen={true}
          evaluation={eval3}
          maxStrikes={5}
          onContinueInvestigation={vi.fn()}
          onClose={vi.fn()}
        />,
      );

      const rawEmojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(rawEmojiRegex.test(html)).toBe(false);
    });
  });

  describe('PlaySession Confrontation Persistence & Progression Integration', () => {
    const createMockRepo = (): GameStateRepository => {
      let progress: PlayerProgress = {
        schemaVersion: 1,
        unlockedHusbandId: 'husband_hoang',
        unlockedLevel: 1,
        bestStarRatings: {},
        earnedWifeTitles: [],
        audioMutePreference: false,
      };
      let session: ActiveSessionState | null = null;

      return {
        getActiveSession: async () => session,
        saveActiveSession: async (s) => { session = s; },
        clearActiveSession: async () => { session = null; },
        getPlayerProgress: async () => progress,
        savePlayerProgress: async (p) => { progress = { ...progress, ...p }; },
      };
    };

    it('applyConfrontationPenalty reduces strikes and triggers onCaught and restart when strikes exhaust', () => {
      const onCaught = vi.fn();
      let scheduledCallback: (() => void) | null = null;
      const session = new PlaySession({
        repository: createMockRepo(),
        loadCaseByLevel: () => mockCaseConfig,
        getAvailableLevels: () => [],
        getAppDefinition: () => undefined,
        now: () => 1000,
        schedule: (cb) => {
          scheduledCallback = cb;
          return () => {};
        },
        onCaught,
      }, mockCaseConfig);

      expect(session.getSnapshot().strikes).toBe(5);

      session.applyConfrontationPenalty();
      expect(session.getSnapshot().strikes).toBe(4);

      // Deplete strikes
      session.applyConfrontationPenalty();
      session.applyConfrontationPenalty();
      session.applyConfrontationPenalty();
      session.applyConfrontationPenalty();

      expect(session.getSnapshot().strikes).toBe(0);
      expect(onCaught).not.toHaveBeenCalled();

      // Trigger the scheduled caught & restart callback
      scheduledCallback?.();
      expect(onCaught).toHaveBeenCalledTimes(1);
      expect(session.getSnapshot().strikes).toBe(5); // Reset after restart
    });

    it('recordConfrontationVerdict saves star rating, awards Wife Title, and unlocks next level', () => {
      const repo = createMockRepo();
      const session = new PlaySession({
        repository: repo,
        loadCaseByLevel: () => mockCaseConfig,
        getAvailableLevels: () => [],
        getAppDefinition: () => undefined,
        now: () => 1000,
        schedule: (cb) => { cb(); return () => {}; },
        onCaught: vi.fn(),
      }, mockCaseConfig);

      session.recordConfrontationVerdict(3, 'Nữ thám tử ghen tuông');

      const progress = session.getSnapshot().playerProgress;
      expect(progress.bestStarRatings['case_01']).toBe(3);
      expect(progress.earnedWifeTitles).toContain('Nữ thám tử ghen tuông');
      expect(progress.unlockedLevel).toBe(2);
    });

    it('forgiveAndAdvanceLevel selects next level', () => {
      let loadedLevel = 1;
      const session = new PlaySession({
        repository: createMockRepo(),
        loadCaseByLevel: (lvl) => {
          loadedLevel = lvl;
          return { ...mockCaseConfig, levelNumber: lvl as 1 | 2 | 3 };
        },
        getAvailableLevels: () => [],
        getAppDefinition: () => undefined,
        now: () => 1000,
        schedule: () => () => {},
        onCaught: vi.fn(),
      }, mockCaseConfig);

      session.forgiveAndAdvanceLevel();
      expect(loadedLevel).toBe(2);
    });
  });

  describe('WifeNotebookModal Top Bar & Dock Confrontation Buttons', () => {
    it('AC 1: Renders "Đối chất" action button in top bar and bottom dock', () => {
      const html = renderToStaticMarkup(
        <WifeNotebookModal
          caseConfig={mockCaseConfig}
          knowledgeGraph={LEVEL_01_KNOWLEDGE_GRAPH}
          currentStrikes={5}
          maxStrikes={5}
          onClose={vi.fn()}
        />,
      );

      // Contains "Đối chất" buttons
      expect(html).toContain('Đối chất');
    });
  });
});
