import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  formatEventDateTime,
  formatMessageBullet,
  tagSuspect,
  removePinnedMessage,
  removePinnedCard,
  restorePinnedEvidence,
  type EvidenceSource,
  type PinnedMessageItem,
} from '../investigation';
import { deriveNodesFromTaggedEvidence } from './WifeNotebookModal';
import { CorkboardCanvas } from './components/CorkboardCanvas';
import { UnorganizedDrawer } from './components/UnorganizedDrawer';
import { LEVEL_01_KNOWLEDGE_GRAPH } from './level01Fixture';
import type { CaseGraphNode } from '../../shared/contracts/knowledge-graph';
import type { PlacedNode } from './types';

describe('Clue Card Revamp & Pinning Invariants Suite', () => {
  describe('formatEventDateTime & formatMessageBullet', () => {
    it('formats date and time together with dot separator', () => {
      expect(formatEventDateTime('28/09', '12:10')).toBe('28/09 · 12:10');
    });

    it('formats time only when date is absent', () => {
      expect(formatEventDateTime(undefined, '12:10')).toBe('12:10');
    });

    it('formats date only when time is absent', () => {
      expect(formatEventDateTime('28/09')).toBe('28/09');
    });

    it('formats ISO rawTimestamp fallback when neither time nor date provided', () => {
      const formatted = formatEventDateTime(undefined, undefined, '2026-09-28T12:10:00Z');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('28/09');
    });

    it('returns empty string when no temporal data is provided', () => {
      expect(formatEventDateTime()).toBe('');
    });

    it('formats message bullet with event timestamp and quotes', () => {
      const msg: PinnedMessageItem = {
        recordId: 'msg_01',
        text: 'Em đang đợi ở sảnh.',
        eventTime: '12:10',
        eventDate: '28/09',
      };
      expect(formatMessageBullet(msg)).toBe('• 28/09 · 12:10: "Em đang đợi ở sảnh."');
    });

    it('formats message bullet with time only if date is not specified', () => {
      const msg: PinnedMessageItem = {
        recordId: 'msg_02',
        text: 'Anh tới liền.',
        eventTime: '12:15',
      };
      expect(formatMessageBullet(msg)).toBe('• 12:15: "Anh tới liền."');
    });

    it('formats message bullet without timestamp if none exists', () => {
      const msg: PinnedMessageItem = {
        recordId: 'msg_03',
        text: 'Tin nhắn bí mật',
      };
      expect(formatMessageBullet(msg)).toBe('• "Tin nhắn bí mật"');
    });
  });

  describe('Investigation Evidence Aggregation & Pinning', () => {
    const caseId = 'case_hoang_01';

    it('pins identity-only conversation with empty body and isExplicitConversationPin: true', () => {
      const conversationSource: EvidenceSource = {
        caseId,
        recordId: 'thread_thu_huong',
        title: 'Hương Em',
        snippet: '',
        kind: 'conversation',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        isExplicitConversationPin: true,
      };

      const result = tagSuspect([], 'Hương Em', 'internet-messaging', 100, conversationSource);
      expect(result.added).toBe(true);
      expect(result.suspects).toHaveLength(1);

      const tagged = result.suspects[0];
      expect(tagged.displayName).toBe('Hương Em');
      expect(tagged.sourceApp).toBe('internet-messaging');
      expect(tagged.conversationId).toBe('thread_thu_huong');
      expect(tagged.isExplicitConversationPin).toBe(true);
      expect(tagged.messages).toEqual([]);
      expect(tagged.evidence?.snippet).toBe('');
    });

    it('aggregates multiple pinned messages from the same conversation into ONE clue card', () => {
      const conversationSource: EvidenceSource = {
        caseId,
        recordId: 'thread_thu_huong',
        title: 'Hương Em',
        snippet: '',
        kind: 'conversation',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        isExplicitConversationPin: true,
      };

      // Step 1: Pin conversation
      const step1 = tagSuspect([], 'Hương Em', 'internet-messaging', 100, conversationSource);
      expect(step1.added).toBe(true);

      // Step 2: Pin message 1
      const msg1Source: EvidenceSource = {
        caseId,
        recordId: 'msg_101',
        title: 'Hương Em',
        snippet: 'Em đợi anh ở khách sạn Metropole.',
        kind: 'message',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        eventTime: '12:10',
        eventDate: '28/09',
      };
      const step2 = tagSuspect(step1.suspects, 'Hương Em', 'internet-messaging', 101, msg1Source);
      expect(step2.added).toBe(true);
      expect(step2.suspects).toHaveLength(1);
      expect(step2.suspects[0].messages).toHaveLength(1);
      expect(step2.suspects[0].messages![0].recordId).toBe('msg_101');
      expect(step2.suspects[0].messages![0].text).toBe('Em đợi anh ở khách sạn Metropole.');

      // Step 3: Pin message 2 from same conversation
      const msg2Source: EvidenceSource = {
        caseId,
        recordId: 'msg_102',
        title: 'Hương Em',
        snippet: 'Đừng quên xóa tin nhắn nhé.',
        kind: 'message',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        eventTime: '12:15',
        eventDate: '28/09',
      };
      const step3 = tagSuspect(step2.suspects, 'Hương Em', 'internet-messaging', 102, msg2Source);
      expect(step3.added).toBe(true);
      expect(step3.suspects).toHaveLength(1);
      expect(step3.suspects[0].messages).toHaveLength(2);
      expect(step3.suspects[0].messages![1].recordId).toBe('msg_102');
    });

    it('rejects duplicate message in the same conversation', () => {
      const msg1Source: EvidenceSource = {
        caseId,
        recordId: 'msg_101',
        title: 'Hương Em',
        snippet: 'Em đợi anh ở sảnh.',
        kind: 'message',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        eventTime: '12:10',
      };

      const step1 = tagSuspect([], 'Hương Em', 'internet-messaging', 100, msg1Source);
      expect(step1.added).toBe(true);

      // Attempt to pin same message again
      const step2 = tagSuspect(step1.suspects, 'Hương Em', 'internet-messaging', 101, msg1Source);
      expect(step2.added).toBe(false);
      expect(step2.suspects[0].messages).toHaveLength(1);
    });

    it('preserves existing messages when conversation is explicitly pinned later', () => {
      const msgSource: EvidenceSource = {
        caseId,
        recordId: 'msg_101',
        title: 'Hương Em',
        snippet: 'Tin nhắn trước đó.',
        kind: 'message',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
      };

      const step1 = tagSuspect([], 'Hương Em', 'internet-messaging', 100, msgSource);
      expect(step1.suspects[0].isExplicitConversationPin).toBe(false);
      expect(step1.suspects[0].messages).toHaveLength(1);

      // Now pin conversation explicitly
      const conversationSource: EvidenceSource = {
        caseId,
        recordId: 'thread_thu_huong',
        title: 'Hương Em',
        snippet: '',
        kind: 'conversation',
        conversationId: 'thread_thu_huong',
        visibleAlias: 'Hương Em',
        isExplicitConversationPin: true,
      };

      const step2 = tagSuspect(step1.suspects, 'Hương Em', 'internet-messaging', 101, conversationSource);
      expect(step2.added).toBe(true);
      expect(step2.suspects).toHaveLength(1);
      expect(step2.suspects[0].isExplicitConversationPin).toBe(true);
      expect(step2.suspects[0].messages).toHaveLength(1);
      expect(step2.suspects[0].messages![0].recordId).toBe('msg_101');
    });
  });

  describe('Message and Card Deletion & Retention Rules', () => {
    it('removes single message while keeping remaining messages', () => {
      const initial = [
        {
          suspectId: 's1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          conversationId: 'thread_1',
          isExplicitConversationPin: true,
          messages: [
            { recordId: 'm1', text: 'Msg 1' },
            { recordId: 'm2', text: 'Msg 2' },
          ],
          evidence: {
            caseId: 'case_1',
            recordId: 'thread_1',
            title: 'Hương Em',
            snippet: '',
          },
        },
      ];

      const { suspects: updated, removedMessage } = removePinnedMessage(initial, 'thread_1', 'm1');
      expect(removedMessage?.recordId).toBe('m1');
      expect(updated).toHaveLength(1);
      expect(updated[0].messages).toHaveLength(1);
      expect(updated[0].messages![0].recordId).toBe('m2');
    });

    it('retains title-only card when last message is removed IF conversation was explicitly pinned', () => {
      const initial = [
        {
          suspectId: 's1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          conversationId: 'thread_1',
          isExplicitConversationPin: true,
          messages: [{ recordId: 'm1', text: 'Msg 1' }],
          evidence: {
            caseId: 'case_1',
            recordId: 'thread_1',
            title: 'Hương Em',
            snippet: '',
          },
        },
      ];

      const { suspects: updated, removedMessage, removedCard } = removePinnedMessage(initial, 'thread_1', 'm1');
      expect(removedMessage?.recordId).toBe('m1');
      expect(Boolean(removedCard)).toBe(false);
      expect(updated).toHaveLength(1);
      expect(updated[0].messages).toHaveLength(0);
      expect(updated[0].isExplicitConversationPin).toBe(true);
    });

    it('removes entire card when last message is removed IF conversation was NOT explicitly pinned', () => {
      const initial = [
        {
          suspectId: 's1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          conversationId: 'thread_1',
          isExplicitConversationPin: false,
          messages: [{ recordId: 'm1', text: 'Msg 1' }],
          evidence: {
            caseId: 'case_1',
            recordId: 'm1',
            title: 'Hương Em',
            snippet: 'Msg 1',
          },
        },
      ];

      const { suspects: updated, removedMessage, removedCard } = removePinnedMessage(initial, 'thread_1', 'm1');
      expect(removedMessage?.recordId).toBe('m1');
      expect(Boolean(removedCard)).toBe(true);
      expect(updated).toHaveLength(0);
    });

    it('removes whole card via removePinnedCard', () => {
      const initial = [
        {
          suspectId: 's1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          evidence: {
            caseId: 'case_1',
            recordId: 'rec_1',
            title: 'Hương Em',
            snippet: '',
          },
        },
      ];

      const { suspects: updated, removedCard } = removePinnedCard(initial, 'rec_1');
      expect(removedCard).toBeDefined();
      expect(removedCard?.evidence?.recordId).toBe('rec_1');
      expect(updated).toHaveLength(0);
    });
  });

  describe('Undo Restoration', () => {
    it('restores removed card to tagged list', () => {
      const card = {
        suspectId: 's1',
        displayName: 'Hương Em',
        sourceApp: 'internet-messaging' as const,
        timestamp: 100,
        evidence: {
          caseId: 'case_1',
          recordId: 'rec_1',
          title: 'Hương Em',
          snippet: '',
        },
      };

      const restored = restorePinnedEvidence([], { card });
      expect(restored).toHaveLength(1);
      expect(restored[0].suspectId).toBe('s1');
    });

    it('restores removed message back into the card', () => {
      const initial = [
        {
          suspectId: 's1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          conversationId: 'thread_1',
          isExplicitConversationPin: true,
          messages: [{ recordId: 'm2', text: 'Msg 2' }],
          evidence: {
            caseId: 'case_1',
            recordId: 'thread_1',
            title: 'Hương Em',
            snippet: '',
          },
        },
      ];

      const messageToRestore: PinnedMessageItem = {
        recordId: 'm1',
        text: 'Msg 1',
        eventTime: '12:00',
      };

      const restored = restorePinnedEvidence(initial, {
        targetId: 'thread_1',
        message: messageToRestore,
      });

      expect(restored).toHaveLength(1);
      expect(restored[0].messages).toHaveLength(2);
      expect(restored[0].messages!.map(m => m.recordId)).toContain('m1');
    });
  });

  describe('Knowledge Graph Node Derivation', () => {
    it('derives aggregated conversation nodes with messages and visible alias', () => {
      const tagged = [
        {
          suspectId: 'tag_1',
          displayName: 'Hương Em',
          sourceApp: 'internet-messaging' as const,
          timestamp: 100,
          conversationId: 'thread_huong',
          visibleAlias: 'Hương Em',
          isExplicitConversationPin: true,
          messages: [
            { recordId: 'm1', text: 'Gặp em nhé', eventTime: '12:00', eventDate: '28/09' },
          ],
          evidence: {
            caseId: 'case_1',
            recordId: 'thread_huong',
            title: 'Hương Em',
            snippet: '',
          },
        },
      ];

      const nodes = deriveNodesFromTaggedEvidence(LEVEL_01_KNOWLEDGE_GRAPH, tagged);
      expect(nodes).toHaveLength(1);
      expect(nodes[0].visibleAlias).toBe('Hương Em');
      expect(nodes[0].conversationId).toBe('thread_huong');
      expect(nodes[0].isExplicitConversationPin).toBe(true);
      expect(nodes[0].messages).toHaveLength(1);
      expect(nodes[0].messages![0].text).toBe('Gặp em nhé');
    });
  });

  describe('CorkboardCanvas & UnorganizedDrawer Wireframe Compliance', () => {
    const sampleConversationNode: CaseGraphNode = {
      nodeId: 'node_huong',
      type: 'record_clue',
      label: 'Hương Em',
      sourceAppId: 'internet-messaging',
      recordRefId: 'thread_huong',
      conversationId: 'thread_huong',
      visibleAlias: 'Hương Em',
      isExplicitConversationPin: true,
      messages: [
        { recordId: 'm1', text: 'Em đang đợi.', eventTime: '12:10', eventDate: '28/09' },
      ],
      isInitialDisguise: false,
    };

    const placedNode: PlacedNode = {
      ...sampleConversationNode,
      x: 100,
      y: 100,
    };

    it('renders [Đến chat] and [Xóa] on card when selected, hidden when not selected', () => {
      // 1. Not selected
      const unselectedHtml = renderToStaticMarkup(
        <CorkboardCanvas
          placedNodes={[placedNode]}
          edges={[]}
          viewport={{ x: 0, y: 0, zoom: 1 }}
          activePairing={{ sourceNodeId: null }}
          unmaskedSuspectIds={[]}
          activeContradictions={[]}
          selectedEdgeId={null}
          selectedNodeId={null}
          onSelectNode={vi.fn()}
          onSelectCard={vi.fn()}
          onMoveNode={vi.fn()}
          onSelectEdge={vi.fn()}
          onSeverEdge={vi.fn()}
          onDeleteCard={vi.fn()}
          onDeleteMessage={vi.fn()}
          onNavigateToSource={vi.fn()}
          onCancelPairing={vi.fn()}
        />
      );

      // Action buttons must have invisible class when not selected
      expect(unselectedHtml).toContain('invisible');

      // 2. Selected
      const selectedHtml = renderToStaticMarkup(
        <CorkboardCanvas
          placedNodes={[placedNode]}
          edges={[]}
          viewport={{ x: 0, y: 0, zoom: 1 }}
          activePairing={{ sourceNodeId: null }}
          unmaskedSuspectIds={[]}
          activeContradictions={[]}
          selectedEdgeId={null}
          selectedNodeId="node_huong"
          onSelectNode={vi.fn()}
          onSelectCard={vi.fn()}
          onMoveNode={vi.fn()}
          onSelectEdge={vi.fn()}
          onSeverEdge={vi.fn()}
          onDeleteCard={vi.fn()}
          onDeleteMessage={vi.fn()}
          onNavigateToSource={vi.fn()}
          onCancelPairing={vi.fn()}
        />
      );

      expect(selectedHtml).toContain('Đến chat');
      expect(selectedHtml).toContain('Xóa');
      expect(selectedHtml).toContain('• 28/09 · 12:10: &quot;Em đang đợi.&quot;');
    });

    it('renders UnorganizedDrawer with message bullets and per-bullet delete buttons', () => {
      const html = renderToStaticMarkup(
        <UnorganizedDrawer
          unplacedNodes={[sampleConversationNode]}
          isOpen={true}
          onToggleOpen={vi.fn()}
          onPlaceNode={vi.fn()}
          onNavigateToSource={vi.fn()}
          onDeleteCard={vi.fn()}
          onDeleteMessage={vi.fn()}
        />
      );

      expect(html).toContain('Hương Em');
      expect(html).toContain('• 28/09 · 12:10: &quot;Em đang đợi.&quot;');
      expect(html).toContain('Đưa lên bảng');
      expect(html).toContain('Đi tới nguồn');
      expect(html).toContain('Xóa');
    });
  });
});
