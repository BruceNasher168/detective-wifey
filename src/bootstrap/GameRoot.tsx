import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { PhoneShell } from '../shell';
import { getAppDefinition, DOCK_APP_IDS } from './appRegistry';
import { createAppContext } from './appContext';
import { getAvailableLevels, loadCaseByLevel, LevelSelectorSheet } from '../features/case-runtime';
import { LocalStorageAdapter, ResumeSessionModal, type GameStateRepository } from '../features/session';
import { PlaySession } from '../features/play-session';
import { SharedPinLockpad } from '../features/locks';
import type { CaseConfig } from '../shared/contracts/case-schema';
import type { AppId } from '../shared/contracts/app-contracts';

export function GameRoot({ repository, initialCaseConfig }: {
  repository?: GameStateRepository; initialCaseConfig?: CaseConfig;
}) {
  const [messageRoute, setMessageRoute] = useState<{ caseId: string; threadId: string } | null>(null);
  const [game] = useState(() => new PlaySession({
    repository: repository ?? new LocalStorageAdapter(), loadCaseByLevel, getAvailableLevels, getAppDefinition,
    now: Date.now,
    schedule: (callback, delay) => { const timer = setTimeout(callback, delay); return () => clearTimeout(timer); },
    onCaught: () => window.alert('CHỒNG ĐÃ PHÁT HIỆN BẠN ĐANG LÉN XEM ĐIỆN THOẠI! Màn chơi sẽ được khởi động lại.'),
  }, initialCaseConfig));
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot, game.getSnapshot);
  useEffect(() => { void game.initialize(); return game.stop; }, [game]);
  const { caseConfig, activeAppId, pendingChallenge } = state;
  const activeApp = activeAppId !== 'home' ? getAppDefinition(activeAppId) ?? null : null;
  const ActiveComponent = activeApp?.component;
  const context = useMemo(() => activeAppId === 'home' ? null : createAppContext(caseConfig, activeAppId), [caseConfig, activeAppId]);
  // Preserve the current level-based provisioning pending the documented launcher decision.
  const provisioned = caseConfig.activeAppIds || ['ecommerce', 'internet-messaging', 'banking', 'comms'];
  const appIds = [...new Set(provisioned.flatMap(id => id === 'comms' ? ['phone', 'messages'] : [id]))];
  const dock = DOCK_APP_IDS.map(getAppDefinition).filter(app => app !== undefined);
  const upper = appIds.filter(id => !DOCK_APP_IDS.includes(id as AppId))
    .map(id => getAppDefinition(id as AppId)).filter(app => app !== undefined);

  return <PhoneShell
    key={caseConfig.caseId}
    deviceMetadata={caseConfig.deviceMetadata}
    activeAppId={activeAppId} activeAppDefinition={activeApp}
    activeUpperApps={upper} activeDockApps={dock} systemAlertToast={state.systemAlertToast}
    demoNotification={caseConfig.notifications?.[0] ?? {
      toastId: 'sim_toast', sourceAppId: 'internet-messaging', senderTitle: 'LoZa • Vừa xong',
      snippetBody: 'Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé"',
    }}
    onLaunchApp={id => { setMessageRoute(null); game.launch(id); }} onReturnHome={game.returnHome} onRestartLevel={game.restart}
    onOpenNotebook={() => game.notify(`Sổ tay của vợ: Đã thu thập ${state.taggedSuspects.length} manh mối.`)}
    onNotify={game.notify}
    renderLevelSelector={onClose => <LevelSelectorSheet levels={game.availableLevels()}
      activeLevelNumber={caseConfig.levelNumber} unlockedMaxLevel={state.playerProgress.unlockedLevel}
      starRatings={state.playerProgress.bestStarRatings}
      onSelectLevel={level => { if (game.selectLevel(level)) onClose(); }} onClose={onClose} />}
    overlays={<>
      {pendingChallenge && <SharedPinLockpad key={`${caseConfig.caseId}:${pendingChallenge.challenge.challengeId}`}
        appName={pendingChallenge.appName} targetChallengeId={pendingChallenge.challenge.challengeId}
        expectedPin={pendingChallenge.challenge.expectedAnswer} currentStrikes={state.strikes}
        maxStrikes={caseConfig.allowedStrikes} onSuccess={game.solveChallenge}
        onFailStrike={game.failChallenge} onCancel={game.cancelChallenge} />}
      {state.resumableSession && <ResumeSessionModal session={state.resumableSession}
        onResume={game.resume} onRestart={game.restart} />}
    </>}
  >
    {ActiveComponent && context && <ActiveComponent key={caseConfig.caseId} caseData={context}
      onTagSuspect={game.tag} onReturnHome={game.returnHome} onRequestUnlock={game.requestUnlock}
      unlockedChallenges={state.unlockedChallenges}
      initialThreadId={messageRoute?.caseId === caseConfig.caseId ? messageRoute.threadId : undefined}
      onOpenMessages={threadId => {
        if (!appIds.includes('messages')) return false;
        setMessageRoute({ caseId: caseConfig.caseId, threadId });
        game.launch('messages');
        return true;
      }} />}
  </PhoneShell>;
}
