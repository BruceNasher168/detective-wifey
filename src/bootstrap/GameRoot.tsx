import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { PhoneShell } from '../shell';
import { getAppDefinition, APP_REGISTRY, DOCK_APP_IDS } from './appRegistry';
import { createAppContext } from './appContext';
import { getAvailableLevels, loadCaseByLevel, LevelSelectorSheet } from '../features/case-runtime';
import { LocalStorageAdapter, ResumeSessionModal, type GameStateRepository } from '../features/session';
import { PlaySession } from '../features/play-session';
import { SharedPinLockpad } from '../features/locks';
import { WifeNotebookModal } from '../features/wife-notebook';
import type { CaseConfig } from '../shared/contracts/case-schema';
import type { AppId } from '../shared/contracts/app-contracts';
import { appTransition, transition } from '../shared/motion/transition';
import { AnchoredOverlay } from '../shared/ui/AnchoredOverlay';

export function GameRoot({ repository, initialCaseConfig }: {
  repository?: GameStateRepository; initialCaseConfig?: CaseConfig;
}) {
  const [isNotebookOpen, setNotebookOpen] = useState(false);
  const [notebookVisitedCase, setNotebookVisitedCase] = useState<string | null>(null);
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
  const notebookOpen = isNotebookOpen && notebookVisitedCase === caseConfig.caseId;
  const activeApp = activeAppId !== 'home' ? getAppDefinition(activeAppId) ?? null : null;
  const ActiveComponent = activeApp?.component;
  const context = useMemo(() => activeAppId === 'home' ? null : createAppContext(caseConfig, activeAppId), [caseConfig, activeAppId]);
  // Preserve the current level-based provisioning pending the documented launcher decision.
  const provisioned = caseConfig.activeAppIds || ['ecommerce', 'internet-messaging', 'banking', 'photos', 'comms'];
  const appIds = [...new Set(provisioned.flatMap(id => id === 'comms' ? ['phone', 'messages'] : [id]))];
  const dock = DOCK_APP_IDS.map(getAppDefinition).filter(app => app !== undefined);
  const upper = appIds.filter(id => !DOCK_APP_IDS.includes(id as AppId))
    .map(id => getAppDefinition(id as AppId)).filter(app => app !== undefined);
  const returnHome = () => {
    if (activeAppId !== 'home') appTransition('close', activeAppId, game.returnHome);
  };
  const launch = (id: AppId) => {
    if (id === activeAppId) return;
    if (caseConfig.grayedOutAppIds?.includes(id)) {
      const def = getAppDefinition(id);
      game.notify(`${def?.displayName ?? id}: Tính năng đang phát triển cho các màn sau.`);
      return;
    }
    appTransition('open', id, () => { setMessageRoute(null); game.launch(id); });
  };

  return <PhoneShell
    key={caseConfig.caseId}
    deviceMetadata={caseConfig.deviceMetadata}
    activeAppId={activeAppId} activeAppDefinition={activeApp}
    activeUpperApps={upper} activeDockApps={dock}
    grayedOutAppIds={caseConfig.grayedOutAppIds}
    systemAlertToast={state.systemAlertToast}
    demoNotification={caseConfig.notifications?.[0] ?? {
      toastId: 'sim_toast', sourceAppId: 'internet-messaging', senderTitle: 'Tin nhắn • Vừa xong',
      snippetBody: 'Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé"',
    }}
    onLaunchApp={launch} onReturnHome={returnHome} onRestartLevel={game.restart}
    onOpenNotebook={() => { setNotebookVisitedCase(caseConfig.caseId); setNotebookOpen(true); }}
    onCloseNotebook={() => setNotebookOpen(false)}
    notebookOpen={notebookOpen}
    onNotify={game.notify}
    renderLevelSelector={onClose => <LevelSelectorSheet levels={game.availableLevels()}
      activeLevelNumber={caseConfig.levelNumber} unlockedMaxLevel={state.playerProgress.unlockedLevel}
      starRatings={state.playerProgress.bestStarRatings}
      onSelectLevel={level => { if (game.selectLevel(level)) onClose(); }} onClose={onClose} />}
    overlays={<>
      <AnchoredOverlay key={caseConfig.caseId} open={notebookOpen} anchorSelector="[data-notebook-tab]"
        label="Sổ tay của vợ" onClose={() => setNotebookOpen(false)}>
      {notebookVisitedCase === caseConfig.caseId && <WifeNotebookModal
        caseId={caseConfig.caseId}
        caseConfig={caseConfig}
        knowledgeGraph={caseConfig.knowledgeGraph}
        currentStrikes={state.strikes}
        maxStrikes={caseConfig.allowedStrikes}
        getSourceApp={id => APP_REGISTRY[id]}
        taggedSuspects={state.taggedSuspects}
        onClose={() => setNotebookOpen(false)}
        onReturnHome={() => {
          setNotebookOpen(false);
          returnHome();
        }}
        onNavigateToSource={(appId) => {
          setNotebookOpen(false);
          launch(appId);
        }}
        onUpdateTaggedSuspects={game.updateTaggedSuspects}
        onApplyConfrontationStrike={game.applyConfrontationPenalty}
        onConfrontationVictory={game.recordConfrontationVerdict}
        onNextLevel={game.forgiveAndAdvanceLevel}
      />}
      </AnchoredOverlay>
      {pendingChallenge && <SharedPinLockpad key={`${caseConfig.caseId}:${pendingChallenge.challenge.challengeId}`}
        appName={pendingChallenge.appName} targetChallengeId={pendingChallenge.challenge.challengeId}
        expectedPin={pendingChallenge.challenge.expectedAnswer} currentStrikes={state.strikes}
        maxStrikes={caseConfig.allowedStrikes} onSuccess={id => transition('sheet-out', () => game.solveChallenge(id))}
        onFailStrike={game.failChallenge} onCancel={() => transition('sheet-out', game.cancelChallenge)} />}
      {state.resumableSession && <ResumeSessionModal session={state.resumableSession}
        onResume={() => transition('fade', game.resume)} onRestart={() => transition('fade', game.restart)} />}
    </>}
  >
    {ActiveComponent && context && <ActiveComponent key={caseConfig.caseId} caseData={context}
      onTagSuspect={game.tag} onReturnHome={returnHome} onRequestUnlock={id => transition('sheet-in', () => game.requestUnlock(id))}
      unlockedChallenges={state.unlockedChallenges}
      initialThreadId={messageRoute?.caseId === caseConfig.caseId ? messageRoute.threadId : undefined}
      onOpenMessages={threadId => {
        if (!appIds.includes('messages')) return false;
        transition('push', () => {
          setMessageRoute({ caseId: caseConfig.caseId, threadId });
          game.launch('messages');
        });
        return true;
      }} />}
  </PhoneShell>;
}
