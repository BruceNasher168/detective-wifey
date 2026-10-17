import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlaySession, type PlaySessionDependencies } from './playSession';
import { loadCaseByLevel, getAvailableLevels } from '../case-runtime';
import { SessionWriter, LocalStorageAdapter, type ActiveSessionState, type GameStateRepository } from '../session';
import type { AppDefinition } from '../../shared/contracts/app-contracts';
import type { CaseConfig } from '../../shared/contracts/case-schema';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function setup(config?: CaseConfig, overrides: Partial<PlaySessionDependencies> = {}) {
  let saved: ActiveSessionState | null = null;
  const repository: GameStateRepository = {
    getActiveSession: vi.fn(async () => saved),
    saveActiveSession: vi.fn(async value => { saved = structuredClone(value); }),
    clearActiveSession: vi.fn(async () => { saved = null; }),
    getPlayerProgress: vi.fn(async () => ({ schemaVersion: 1, unlockedHusbandId: 'husband_hoang',
      unlockedLevel: 1 as const, bestStarRatings: {}, earnedWifeTitles: [], audioMutePreference: false })),
    savePlayerProgress: vi.fn(async () => {}),
  };
  const dependencies: PlaySessionDependencies = {
    repository, loadCaseByLevel, getAvailableLevels, now: () => Date.now(),
    schedule: (callback, delay) => { const timer = setTimeout(callback, delay); return () => clearTimeout(timer); },
    getAppDefinition: appId => ({ appId, displayName: appId, component: () => null,
      icon: () => null, themeGradient: '', themeColor: '', isLocked: false }) satisfies AppDefinition,
    onCaught: vi.fn(), ...overrides,
  };
  return { game: new PlaySession(dependencies, config), dependencies, repository, saved: () => saved };
}

describe('play lifecycle', () => {
  it('keeps different records for one person and deduplicates repeated source records', async () => {
    vi.useFakeTimers();
    const { game, saved } = setup();
    const source = { caseId: 'case_01', recordId: 'order_01', title: 'Đơn mua', snippet: 'Nội dung' };
    game.tag('Nguyễn Thị Thu Hương', 'banking', { ...source, recordId: 'transfer_01' });
    game.tag('Nguyễn Thị Thu Hương', 'ecommerce', source);
    game.tag('Nguyễn Thị Thu Hương', 'ecommerce', source);
    await vi.runAllTimersAsync();
    expect(saved()?.taggedSuspects.map(tag => tag.evidence?.recordId)).toEqual(['transfer_01', 'order_01']);
    game.stop();
  });

  it('keeps name-based tag compatibility and available source attribution through save/resume', async () => {
    vi.useFakeTimers();
    const { game, repository, saved } = setup();
    const source = { caseId: 'case_01', recordId: 'receipt-1', title: 'Hóa đơn', snippet: 'Nội dung được cấp' };
    game.tag('Tên trong dữ liệu', 'ecommerce', source);
    game.tag('Tên trong dữ liệu', 'banking');
    await vi.runAllTimersAsync();
    expect(saved()?.taggedSuspects).toHaveLength(1);
    expect(saved()?.taggedSuspects[0].evidence).toEqual(source);
    const resumed = setup(undefined, { repository }).game;
    await resumed.initialize();
    resumed.resume();
    expect(resumed.getSnapshot().taggedSuspects).toEqual(saved()?.taggedSuspects);
    game.stop(); resumed.stop();
  });

  it('returns app unlocks to the requested app and nested unlocks to the resource owner', () => {
    vi.useFakeTimers();
    const config = structuredClone(loadCaseByLevel(2));
    config.lockChallenges = [
      { challengeId: 'bank-app', targetType: 'app', targetId: 'banking', lockType: 'numeric_pin', expectedAnswer: '1234', clueSourceApp: 'email' },
      { challengeId: 'private-vault', targetType: 'vault', targetId: 'vault-resource', lockType: 'numeric_pin', expectedAnswer: '5678', clueSourceApp: 'email' },
    ];
    const { game } = setup(config);
    game.launch('banking');
    expect(game.getSnapshot().activeAppId).toBe('home');
    game.solveChallenge('bank-app');
    expect(game.getSnapshot().activeAppId).toBe('banking');
    game.requestUnlock('private-vault');
    game.solveChallenge('private-vault');
    expect(game.getSnapshot().activeAppId).toBe('banking');
    expect(game.getSnapshot().unlockedChallenges.has('private-vault')).toBe(true);
    game.stop();
  });

  it('cancels an exhausted-strike callback when switching cases', async () => {
    vi.useFakeTimers();
    const { game, dependencies } = setup();
    for (let index = 0; index < 5; index++) game.failChallenge();
    game.selectLevel(2);
    await vi.runAllTimersAsync();
    expect(dependencies.onCaught).not.toHaveBeenCalled();
    expect(game.getSnapshot().caseConfig.caseId).toBe('case_02');
    expect(game.getSnapshot().strikes).toBe(4);
    game.stop();
  });

  it('does not restore a late storage read over a newly selected case', async () => {
    vi.useFakeTimers();
    let release!: (session: ActiveSessionState | null) => void;
    const { repository } = setup();
    repository.getActiveSession = () => new Promise(resolve => { release = resolve; });
    const { game } = setup(undefined, { repository });
    const initialization = game.initialize();
    game.selectLevel(2);
    release(null);
    await initialization;
    expect(game.getSnapshot().caseConfig.caseId).toBe('case_02');
    expect(game.getSnapshot().resumableSession).toBeNull();
    game.stop();
  });

  it('loads another husband using the active husband identity', () => {
    vi.useFakeTimers();
    const initial = { ...loadCaseByLevel(1), husbandId: 'fixture-husband' };
    const loader = vi.fn((level: number) => ({ ...loadCaseByLevel(level), husbandId: 'fixture-husband' }));
    const { game } = setup(initial, { loadCaseByLevel: loader });
    game.selectLevel(2);
    expect(loader).toHaveBeenCalledWith(2, 'fixture-husband');
    game.stop();
  });
});

describe('save compatibility and ordering', () => {
  it('orders an in-flight old save, reset, and new-case save without losing the new case', async () => {
    const { repository, saved } = setup();
    const originalSave = repository.saveActiveSession;
    let release!: () => void;
    repository.saveActiveSession = vi.fn(async value => {
      if (value.caseId === 'old-case') await new Promise<void>(resolve => { release = resolve; });
      await originalSave(value);
    });
    const writer = new SessionWriter(repository, 'jealous_wife');
    const snapshot = (caseId: string): ActiveSessionState => ({ schemaVersion: 1, gameId: 'jealous_wife',
      caseId, levelNumber: 1, activeApp: 'home', suspicionStrikes: 5, taggedSuspects: [],
      unlockedChallenges: [], elapsedSeconds: 0, lastSavedAt: 0 });
    const first = writer.save(snapshot('old-case'));
    await Promise.resolve();
    const skipped = writer.save(snapshot('queued-old-case'));
    const clear = writer.clear();
    const next = writer.save(snapshot('new-case'));
    release();
    await Promise.all([first, skipped, clear, next]);
    expect(repository.saveActiveSession).toHaveBeenCalledTimes(2);
    expect(saved()?.caseId).toBe('new-case');
  });

  it('retains the v1 keys, legacy aliases, and optional evidence without schema expansion', async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) });
    const legacy: ActiveSessionState = { schemaVersion: 1, gameId: 'jealous_wife', caseId: 'case_01',
      levelNumber: 1, activeApp: 'internet-messaging', suspicionStrikes: 4,
      taggedSuspects: [{ suspectId: 'tag_10', displayName: 'Tên cũ', sourceApp: 'internet-messaging', timestamp: 10 }],
      unlockedChallenges: ['legacy-lock'], elapsedSeconds: 45, lastSavedAt: 10 };
    storage.set('detective:v1:jealous_wife:session', JSON.stringify(legacy));
    const repository = new LocalStorageAdapter();
    expect(await repository.getActiveSession('jealous_wife')).toEqual(legacy);
    await repository.saveActiveSession(legacy);
    expect(JSON.parse(storage.get('detective:v1:jealous_wife:session')!)).toMatchObject({ ...legacy, lastSavedAt: expect.any(Number) });
    expect((await repository.getActiveSession('jealous_wife'))?.taggedSuspects[0]).not.toHaveProperty('evidence');
  });
});
