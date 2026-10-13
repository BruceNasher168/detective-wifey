import React, { useState, useEffect, useCallback } from 'react';
import { CaseConfig, LevelMetadata, NotificationToast } from '../types/case-schema';
import { AppId, ActiveSessionState, PlayerProgress } from '../types/app-contracts';
import { getAppDefinition, DOCK_APP_IDS } from '../apps/registry';
import { getAvailableLevels, loadCaseByLevel, validateCaseConfig } from '../engines/schemaEngine';
import { sessionStore } from '../storage/sessionStore';

import { StatusBar } from '../components/StatusBar';
import { AppIconSquircle } from '../components/AppIconSquircle';
import { SharedPinLockpad } from '../components/SharedPinLockpad';
import { NotificationBanner } from '../components/NotificationBanner';
import { AssistiveTouch } from '../components/AssistiveTouch';
import { LevelSelectorSheet } from '../components/LevelSelectorSheet';
import { PwaGuideSheet } from '../components/PwaGuideSheet';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { ResumeSessionModal } from '../components/ResumeSessionModal';

import { Search, ShieldCheck } from 'lucide-react';

interface PhoneShellProps {
  initialCaseConfig?: CaseConfig;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({ initialCaseConfig }) => {
  // 1. Core State
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(
    initialCaseConfig?.levelNumber || 1
  );
  const [caseConfig, setCaseConfig] = useState<CaseConfig>(() => {
    try {
      return initialCaseConfig || loadCaseByLevel(1);
    } catch {
      return loadCaseByLevel(1);
    }
  });

  const [activeAppId, setActiveAppId] = useState<AppId | 'home'>('home');
  const [unlockedChallenges, setUnlockedChallenges] = useState<Set<string>>(new Set());
  const [strikes, setStrikes] = useState<number>(caseConfig.allowedStrikes);
  const [taggedSuspects, setTaggedSuspects] = useState<Array<{
    suspectId: string;
    displayName: string;
    sourceApp: AppId;
    timestamp: number;
  }>>([]);

  // 2. Progression & Catalog
  const [availableLevels, setAvailableLevels] = useState<LevelMetadata[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    schemaVersion: 1,
    unlockedHusbandId: 'husband_hoang',
    unlockedLevel: 1,
    bestStarRatings: { case_01: 3, case_02: 2 },
    earnedWifeTitles: [],
    audioMutePreference: false,
  });

  // 3. UI Shell Modals & Overlays
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingLockChallenge, setPendingLockChallenge] = useState<{
    appName: string;
    challengeId: string;
    expectedPin: string;
  } | null>(null);

  const [activeToast, setActiveToast] = useState<NotificationToast | null>(null);
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [resumableSession, setResumableSession] = useState<ActiveSessionState | null>(null);
  const [systemAlertToast, setSystemAlertToast] = useState<string | null>(null);

  // Initialize Case & Validation
  useEffect(() => {
    try {
      const levels = getAvailableLevels(caseConfig.husbandId);
      setAvailableLevels(levels);
    } catch {
      setSystemAlertToast('Không thể tải dữ liệu vụ án. Vui lòng thử lại!');
    }
  }, [caseConfig.husbandId]);

  // Load Player Progress & Check for Active Session on Mount
  useEffect(() => {
    const initStorage = async () => {
      const progress = await sessionStore.getPlayerProgress();
      setPlayerProgress(progress);

      const session = await sessionStore.getActiveSession('jealous_wife');
      if (session && session.caseId === caseConfig.caseId && session.taggedSuspects.length > 0) {
        setResumableSession(session);
      }
    };
    initStorage();
  }, [caseConfig.caseId]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Auto-save session state on mutation
  const persistSession = useCallback(
    async (
      overrideApp: AppId | 'home' = activeAppId,
      overrideStrikes: number = strikes,
      overrideSuspects = taggedSuspects,
      overrideChallenges = unlockedChallenges
    ) => {
      const sessionState: ActiveSessionState = {
        schemaVersion: 1,
        gameId: 'jealous_wife',
        caseId: caseConfig.caseId,
        levelNumber: caseConfig.levelNumber,
        activeApp: overrideApp,
        suspicionStrikes: overrideStrikes,
        taggedSuspects: overrideSuspects,
        unlockedChallenges: Array.from(overrideChallenges),
        elapsedSeconds: 0,
        lastSavedAt: Date.now(),
      };
      await sessionStore.saveActiveSession(sessionState);
    },
    [activeAppId, strikes, taggedSuspects, unlockedChallenges, caseConfig]
  );

  // Resume active session
  const handleResumeSession = () => {
    if (!resumableSession) return;
    setStrikes(resumableSession.suspicionStrikes);
    setTaggedSuspects(resumableSession.taggedSuspects);
    setUnlockedChallenges(new Set(resumableSession.unlockedChallenges));
    setActiveAppId(resumableSession.activeApp);
    setResumableSession(null);
    showToastNotification('Đã khôi phục phiên điều tra dở dang!');
  };

  // Restart level
  const handleRestartLevel = useCallback(async () => {
    setStrikes(caseConfig.allowedStrikes);
    setTaggedSuspects([]);
    setUnlockedChallenges(new Set());
    setActiveAppId('home');
    setPendingLockChallenge(null);
    setResumableSession(null);
    await sessionStore.clearActiveSession('jealous_wife');
    showToastNotification(`Đã chơi lại Màn ${caseConfig.levelNumber}!`);
  }, [caseConfig]);

  // Switch level
  const handleSelectLevel = (levelNumber: number) => {
    try {
      const nextConfig = loadCaseByLevel(levelNumber);
      const validation = validateCaseConfig(nextConfig);
      if (!validation.isValid) {
        setSystemAlertToast(validation.error || 'Dữ liệu màn chơi không hợp lệ. Vui lòng tải lại trang!');
        return;
      }

      setCaseConfig(nextConfig);
      setActiveLevelNumber(levelNumber);
      setStrikes(nextConfig.allowedStrikes);
      setTaggedSuspects([]);
      setUnlockedChallenges(new Set());
      setActiveAppId('home');
      setShowLevelSheet(false);
      sessionStore.clearActiveSession('jealous_wife');
      showToastNotification(`Đã nạp ${nextConfig.husbandName} - Màn ${levelNumber}!`);
    } catch (e: any) {
      setSystemAlertToast(e.message || 'Không tìm thấy màn chơi yêu cầu.');
    }
  };

  // Tag suspect into Wife's Notebook
  const handleTagSuspect = (suspectName: string, sourceApp: AppId) => {
    const exists = taggedSuspects.some((s) => s.displayName === suspectName);
    if (!exists) {
      const newSuspect = {
        suspectId: `tag_${Date.now()}`,
        displayName: suspectName,
        sourceApp,
        timestamp: Date.now(),
      };
      const updated = [...taggedSuspects, newSuspect];
      setTaggedSuspects(updated);
      persistSession(activeAppId, strikes, updated, unlockedChallenges);
      showToastNotification(`Đã ghim "${suspectName}" vào Sổ tay của vợ!`);
    } else {
      showToastNotification(`"${suspectName}" đã có trong Sổ tay của vợ.`);
    }
  };

  // Launch App
  const handleLaunchApp = (appId: AppId) => {
    const appDef = getAppDefinition(appId);
    if (!appDef) {
      setSystemAlertToast('Ứng dụng tạm thời không phản hồi. Vui lòng thử lại!');
      return;
    }

    // Check lock challenge for this app
    const lockChallenge = caseConfig.lockChallenges.find(
      (c) => c.targetType === 'app' && c.targetId === appId
    );

    if (lockChallenge && !unlockedChallenges.has(lockChallenge.challengeId)) {
      setPendingLockChallenge({
        appName: appDef.displayName,
        challengeId: lockChallenge.challengeId,
        expectedPin: lockChallenge.expectedAnswer,
      });
      return;
    }

    // Normal launch: sub-100ms
    setActiveAppId(appId);
    persistSession(appId);
  };

  // Solve Lock Challenge
  const handleSolveChallenge = (challengeId: string) => {
    const updated = new Set(unlockedChallenges);
    updated.add(challengeId);
    setUnlockedChallenges(updated);
    setPendingLockChallenge(null);

    // If pending app launch, proceed
    if (pendingLockChallenge) {
      const targetAppId = caseConfig.lockChallenges.find(
        (c) => c.challengeId === challengeId
      )?.targetId as AppId;

      if (targetAppId) {
        setActiveAppId(targetAppId);
        persistSession(targetAppId, strikes, taggedSuspects, updated);
      }
    }
    showToastNotification('Mở khóa thành công!');
  };

  // Handle PIN Failure (Strike Penalty)
  const handlePinFail = () => {
    const remaining = Math.max(0, strikes - 1);
    setStrikes(remaining);
    persistSession(activeAppId, remaining, taggedSuspects, unlockedChallenges);

    if (remaining === 0) {
      setTimeout(() => {
        alert('CHỒNG ĐÃ PHÁT HIỆN BẠN ĐANG LÉN XEM ĐIỆN THOẠI! Màn chơi sẽ được khởi động lại.');
        handleRestartLevel();
      }, 500);
    }
  };

  // Trigger Notification Toast Simulation
  const handleTriggerToastDemo = () => {
    const notification = caseConfig.notifications?.[0] || {
      toastId: 'sim_toast',
      sourceAppId: 'loza',
      senderTitle: 'LoZa • Vừa xong',
      snippetBody: 'Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé"',
    };
    setActiveToast(notification);
  };

  const showToastNotification = (msg: string) => {
    setSystemAlertToast(msg);
    setTimeout(() => {
      setSystemAlertToast(null);
    }, 3000);
  };

  // Active micro-app component
  const activeAppDefinition = activeAppId !== 'home' ? getAppDefinition(activeAppId) : null;
  const ActiveComponent = activeAppDefinition?.component;

  // Level-based App Filtering (US-002 AC 1 & AC 3)
  const activeAppIds = caseConfig.activeAppIds || ['loza', 'vietpay', 'poshee', 'comms'];
  const activeDockApps = DOCK_APP_IDS.filter((id) => activeAppIds.includes(id))
    .map(getAppDefinition)
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const activeUpperApps = activeAppIds
    .filter((id) => !DOCK_APP_IDS.includes(id as AppId))
    .map((id) => getAppDefinition(id as AppId))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <div
      className="w-full sm:max-w-[480px] h-[100dvh] flex flex-col justify-between relative overflow-hidden select-none font-sans"
      style={{
        background: 'linear-gradient(180deg, #0b1329 0%, #172c66 50%, #080c18 100%)',
      }}
    >
      {/* 1. Phone OS Status Bar */}
      <StatusBar deviceMetadata={caseConfig.deviceMetadata} />

      {/* 2. Top Notification Toast Banner */}
      <NotificationBanner
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onClick={(toast) => {
          setActiveToast(null);
          handleLaunchApp(toast.sourceAppId as AppId);
        }}
      />

      {/* 3. System Alert Toast */}
      {systemAlertToast && (
        <div className="absolute top-12 left-4 right-4 z-50 p-2.5 rounded-xl bg-slate-900/90 border border-white/20 text-white text-xs font-medium shadow-xl text-center animate-fadeIn flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{systemAlertToast}</span>
        </div>
      )}

      {/* 4. Active Screen Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {activeAppId === 'home' ? (
          /* =================================================================
             HOME SCREEN LAUNCHER (PhoneOSHomeView)
             ================================================================= */
          <div className="flex-1 flex flex-col justify-between px-4 pt-2 pb-2 relative">
            {/* Top Section: Clock & Upper Apps */}
            <div className="flex flex-col">
              {/* Clock Widget */}
              <div className="text-center mt-2 mb-8">
                <div className="text-6xl font-extralight tracking-tight text-white drop-shadow-md">
                  {caseConfig.deviceMetadata.narrativeTime}
                </div>
                <div className="text-xs font-medium text-slate-300 mt-1">
                  Thứ Ba, 13 tháng 10
                </div>
              </div>

              {/* Upper App Grid (Level-Based Filtered) */}
              <div className="grid grid-cols-4 gap-4 px-2">
                {activeUpperApps.map((app) => (
                  <AppIconSquircle
                    key={app.appId}
                    app={app}
                    onClick={() => handleLaunchApp(app.appId)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Section: Search Pill, Dock, Home Bar */}
            <div className="flex flex-col gap-3">
              {/* Search Pill (Interactive Toast Trigger) */}
              <div className="flex justify-center mb-1">
                <button
                  type="button"
                  onClick={handleTriggerToastDemo}
                  className="glass-subtle rounded-full px-5 py-2 flex items-center gap-2 text-xs text-white/90 hover:bg-white/20 active:scale-95 transition-all shadow-md"
                >
                  <Search className="w-3.5 h-3.5 text-sky-300" />
                  <span>Tìm kiếm (Chạm để thử Toast)</span>
                </button>
              </div>

              {/* Frosted Glass Dock Tray (Fast Access Apps) */}
              <div className="glass-dock p-3 mx-1 rounded-[32px] grid grid-cols-3 gap-2">
                {activeDockApps.map((app) => (
                  <AppIconSquircle
                    key={app.appId}
                    app={app}
                    onClick={() => handleLaunchApp(app.appId)}
                  />
                ))}
              </div>

              {/* In-game Home Indicator */}
              <button
                type="button"
                onClick={() => setActiveAppId('home')}
                className="w-32 h-1 bg-white/40 hover:bg-white/70 rounded-full mx-auto my-1 transition-colors"
                aria-label="Về trang chủ"
              />
            </div>
          </div>
        ) : (
          /* =================================================================
             ACTIVE MICRO-APP VIEWPORT
             ================================================================= */
          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
            <AppErrorBoundary
              onErrorFallback={() => {
                setActiveAppId('home');
                setSystemAlertToast('Ứng dụng tạm thời không phản hồi. Vui lòng thử lại!');
              }}
            >
              {ActiveComponent && (
                <ActiveComponent
                  caseData={caseConfig}
                  onTagSuspect={handleTagSuspect}
                  onReturnHome={() => setActiveAppId('home')}
                  onRequestUnlock={(challengeId) => {
                    const ch = caseConfig.lockChallenges.find(
                      (c) => c.challengeId === challengeId
                    );
                    if (ch) {
                      setPendingLockChallenge({
                        appName: activeAppDefinition?.displayName || 'Thư mục',
                        challengeId: ch.challengeId,
                        expectedPin: ch.expectedAnswer,
                      });
                    }
                  }}
                  unlockedChallenges={unlockedChallenges}
                />
              )}
            </AppErrorBoundary>

            {/* In-app bottom home indicator */}
            <button
              type="button"
              onClick={() => setActiveAppId('home')}
              className="w-32 h-1 bg-white/30 hover:bg-white/70 rounded-full mx-auto my-1.5 transition-colors shrink-0"
              aria-label="Về trang chủ"
            />
          </div>
        )}
      </div>

      {/* 5. Shared PIN Lockpad Overlay */}
      {pendingLockChallenge && (
        <SharedPinLockpad
          appName={pendingLockChallenge.appName}
          targetChallengeId={pendingLockChallenge.challengeId}
          expectedPin={pendingLockChallenge.expectedPin}
          currentStrikes={strikes}
          maxStrikes={caseConfig.allowedStrikes}
          onSuccess={handleSolveChallenge}
          onFailStrike={handlePinFail}
          onCancel={() => setPendingLockChallenge(null)}
        />
      )}

      {/* 6. AssistiveTouch Floating Button */}
      <AssistiveTouch
        onGoHome={() => setActiveAppId('home')}
        onOpenNotebook={() => {
          showToastNotification(
            `Sổ tay của vợ: Đã thu thập ${taggedSuspects.length} manh mối.`
          );
        }}
        onOpenLevelSelector={() => setShowLevelSheet(true)}
        onRestartLevel={handleRestartLevel}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenPwaGuide={() => setShowPwaGuide(true)}
        isFullscreen={isFullscreen}
      />

      {/* 7. Level Selector Modal Sheet */}
      {showLevelSheet && (
        <LevelSelectorSheet
          levels={availableLevels}
          activeLevelNumber={activeLevelNumber}
          unlockedMaxLevel={playerProgress.unlockedLevel}
          starRatings={playerProgress.bestStarRatings}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSheet(false)}
        />
      )}

      {/* 8. PWA Guidance Modal Sheet */}
      {showPwaGuide && (
        <PwaGuideSheet
          onClose={() => setShowPwaGuide(false)}
          onPreviewFullscreen={handleToggleFullscreen}
        />
      )}

      {/* 9. Session Resumption Modal */}
      {resumableSession && (
        <ResumeSessionModal
          session={resumableSession}
          onResume={handleResumeSession}
          onRestart={handleRestartLevel}
        />
      )}
    </div>
  );
};

export default PhoneShell;
