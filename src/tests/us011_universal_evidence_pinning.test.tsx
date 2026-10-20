import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  StoryEvidenceTarget,
  UniversalEvidenceModal,
  tagSuspect,
  formatMessageBullet,
  type UniversalEvidenceItem,
  type TaggedSuspect,
} from '../features/investigation';
import { PlaySession } from '../features/play-session';
import type { CaseConfig } from '../shared/contracts/case-schema';
import type { GameStateRepository, ActiveSessionState, PlayerProgress } from '../features/session';

describe('US-011 - Universal Evidence Long-Press & Pinning Suite', () => {
  const mockEvidenceItem: UniversalEvidenceItem = {
    title: 'Tin nhắn từ Anh Tuấn Thợ Điện',
    subtitle: 'Thời gian: 15/10 · 20:48',
    snippet: 'Tối nay 20h48 anh qua kiểm tra đường điện cho em nhé!',
    suspectToTag: 'Anh Tuấn Thợ Điện',
    source: {
      caseId: 'case_01',
      recordId: 'thread_tuan_m4',
      conversationId: 'thread_tuan',
      title: 'Anh Tuấn Thợ Điện',
      snippet: 'Tối nay 20h48 anh qua kiểm tra đường điện cho em nhé!',
      eventDate: '15/10',
      eventTime: '20:48',
    },
  };

  it('AC 4 & 5: UniversalEvidenceModal renders header close, quote block, updated width, and primary/secondary buttons', () => {
    const html = renderToStaticMarkup(
      <UniversalEvidenceModal
        isOpen={true}
        item={mockEvidenceItem}
        onPinEvidence={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // Removed badge and suspect attribution row
    expect(html).not.toContain('Bằng Chứng Nghi Vấn');
    expect(html).not.toContain('Đối tượng liên quan:');

    // Title and Subtitle
    expect(html).toContain('Tin nhắn từ Anh Tuấn Thợ Điện');
    expect(html).toContain('Thời gian: 15/10 · 20:48');

    // Evidence Quotation Block
    expect(html).toContain('Tối nay 20h48 anh qua kiểm tra đường điện cho em nhé!');
    expect(html).toContain('border-l-rose-500');

    // Overlay width
    expect(html).toContain('max-w-[420px]');

    // Primary and Secondary Buttons
    expect(html).toContain('Ghim vào sổ');
    expect(html).toContain('Bỏ qua');
    expect(html).toContain('aria-label="Đóng"');
  });

  it('AC 4: UniversalEvidenceModal renders centered over blurred, dimmed backdrop (bg-black/60 backdrop-blur-md)', () => {
    const html = renderToStaticMarkup(
      <UniversalEvidenceModal
        isOpen={true}
        item={mockEvidenceItem}
        onPinEvidence={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(html).toContain('bg-black/60');
    expect(html).toContain('backdrop-blur-md');
  });

  it('UniversalEvidenceModal returns null when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <UniversalEvidenceModal
        isOpen={false}
        item={mockEvidenceItem}
        onPinEvidence={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(html).toBe('');
  });

  it('StoryEvidenceTarget wraps dynamic children and prevents selection/native drag', () => {
    const html = renderToStaticMarkup(
      <StoryEvidenceTarget item={mockEvidenceItem} onTriggerEvidence={vi.fn()}>
        <div data-testid="chat-bubble">Nội dung tin nhắn</div>
      </StoryEvidenceTarget>,
    );

    expect(html).toContain('Nội dung tin nhắn');
    expect(html).toContain('select-none');
    expect(html).toContain('cursor-pointer');
  });

  it('AC 8: Pinned items from the same conversation consolidate into a single card with timestamped bullets', () => {
    const suspects: TaggedSuspect[] = [];

    // Tag first message
    const tag1 = tagSuspect(suspects, 'Anh Tuấn Thợ Điện', 'internet-messaging', 1000, {
      caseId: 'case_01',
      recordId: 'thread_tuan_m1',
      conversationId: 'thread_tuan',
      title: 'Anh Tuấn Thợ Điện',
      snippet: 'Tối nay 20h48 anh qua kiểm tra đường điện cho em nhé!',
      eventDate: '15/10',
      eventTime: '20:48',
    });

    expect(tag1.added).toBe(true);
    expect(tag1.suspects.length).toBe(1);

    // Tag second message in the same conversation
    const tag2 = tagSuspect(tag1.suspects, 'Anh Tuấn Thợ Điện', 'internet-messaging', 2000, {
      caseId: 'case_01',
      recordId: 'thread_tuan_m2',
      conversationId: 'thread_tuan',
      title: 'Anh Tuấn Thợ Điện',
      snippet: 'Xong việc nhớ gọi lại cho em số này...',
      eventDate: '15/10',
      eventTime: '21:05',
    });

    // Does not create duplicate card! Consolidates messages under 1 card.
    expect(tag2.suspects.length).toBe(1);
    const card = tag2.suspects[0];
    expect(card.displayName).toBe('Anh Tuấn Thợ Điện');
    expect(card.messages?.length).toBe(2);

    // Format check for bullets: `• DD/MM · HH:mm: "..."`
    const bullet1 = formatMessageBullet(card.messages![0]);
    const bullet2 = formatMessageBullet(card.messages![1]);

    expect(bullet1).toBe('• 15/10 · 20:48: "Tối nay 20h48 anh qua kiểm tra đường điện cho em nhé!"');
    expect(bullet2).toBe('• 15/10 · 21:05: "Xong việc nhớ gọi lại cho em số này..."');
  });

  it('AC 7: Tagging evidence triggers a 2-second confirmation toast in Dynamic Island area', () => {
    let sessionState: ActiveSessionState | null = null;
    let progressState: PlayerProgress = {
      schemaVersion: 1,
      unlockedHusbandId: 'husband_hoang',
      unlockedLevel: 1,
      bestStarRatings: {},
      earnedWifeTitles: [],
      audioMutePreference: false,
    };

    const mockRepo: GameStateRepository = {
      getActiveSession: async () => sessionState,
      saveActiveSession: async (s) => { sessionState = s; },
      clearActiveSession: async () => { sessionState = null; },
      getPlayerProgress: async () => progressState,
      savePlayerProgress: async (p) => { progressState = { ...progressState, ...p }; },
    };

    const mockCase: CaseConfig = {
      caseId: 'case_01',
      husbandId: 'husband_hoang',
      husbandName: 'Hoàng',
      levelNumber: 1,
      allowedStrikes: 5,
      groundTruth: {
        verdict: 'cheating',
        culpritSuspectId: 'suspect_huong',
        narrativeRoast: 'Roast',
      },
      suspectPool: [],
      lockChallenges: [],
      deviceMetadata: {
        narrativeTime: '23:45',
        batteryPercent: '42%',
        carrierTag: '5G',
        pwaThemeColor: '#0f172a',
      },
      activeAppIds: ['internet-messaging'],
      appsData: {},
    };

    let scheduledDelay = 0;
    const session = new PlaySession({
      repository: mockRepo,
      loadCaseByLevel: () => mockCase,
      getAvailableLevels: () => [],
      getAppDefinition: () => undefined,
      now: () => 1000,
      schedule: (_cb, delay) => {
        scheduledDelay = delay;
        return () => {};
      },
      onCaught: vi.fn(),
    }, mockCase);

    session.tag('Anh Tuấn Thợ Điện', 'internet-messaging', mockEvidenceItem.source);

    // Toast message set
    expect(session.getSnapshot().systemAlertToast).toContain('Đã ghim "Anh Tuấn Thợ Điện" vào Sổ tay của vợ!');
    // Duration is exactly 2000ms (2 seconds)
    expect(scheduledDelay).toBe(2000);
  });

  it('Strict Zero-Emoji Invariant: UniversalEvidenceModal contains zero raw Unicode emojis', () => {
    const html = renderToStaticMarkup(
      <UniversalEvidenceModal
        isOpen={true}
        item={mockEvidenceItem}
        onPinEvidence={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const rawEmojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(rawEmojiRegex.test(html)).toBe(false);
  });
});
