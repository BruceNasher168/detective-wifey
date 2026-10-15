import React, { useState, useEffect, type ReactNode } from 'react';
import type { AppDefinition, AppId } from '../shared/contracts/app-contracts';
import type { DeviceMetadata, NotificationToast } from '../shared/contracts/case-schema';
import { detectDeviceMode } from './deviceMode';
import { StatusBar } from './components/StatusBar';
import { AppIconSquircle } from './components/AppIconSquircle';
import { NotificationBanner } from './components/NotificationBanner';
import { AssistiveTouch } from './components/AssistiveTouch';
import { PwaGuideSheet } from './components/PwaGuideSheet';
import { usePwa } from './usePwa';
import { AppErrorBoundary } from '../shared/ui/AppErrorBoundary';
import { useSwipeBack } from '../shared/gestures/useSwipeBack';
import defaultWallpaper from './assets/ios-27-blue.jpg';
import { IoCamera, IoSearchOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

export interface PhoneShellProps {
  deviceMetadata: DeviceMetadata;
  activeAppId: AppId | 'home';
  activeAppDefinition: AppDefinition | null;
  activeUpperApps: AppDefinition[];
  activeDockApps: AppDefinition[];
  systemAlertToast: string | null;
  demoNotification: NotificationToast;
  children: ReactNode;
  overlays: ReactNode;
  renderLevelSelector: (onClose: () => void) => ReactNode;
  onLaunchApp: (appId: AppId) => void;
  onReturnHome: () => void;
  onRestartLevel: () => void;
  onOpenNotebook: () => void;
  onNotify: (message: string) => void;
}

/** Phone presentation and transient OS state. Gameplay is supplied by the host. */
export const PhoneShell: React.FC<PhoneShellProps> = ({
  deviceMetadata, activeAppId, activeAppDefinition, activeUpperApps, activeDockApps,
  systemAlertToast, demoNotification, children, overlays, renderLevelSelector,
  onLaunchApp: handleLaunchApp, onReturnHome, onRestartLevel: handleRestartLevel,
  onOpenNotebook, onNotify,
}) => {
  const [isIOS] = useState(() => typeof navigator !== 'undefined' && detectDeviceMode(navigator) === 'ios');
  const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' && Boolean(document.fullscreenElement));
  const [activeToast, setActiveToast] = useState<NotificationToast | null>(null);
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const pwa = usePwa();

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    if (isIOS || !document.documentElement.requestFullscreen) {
      setShowPwaGuide(true);
      return;
    }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setIsFullscreen(Boolean(document.fullscreenElement));
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
      onNotify('Không thể bật chế độ toàn màn hình. Vui lòng thử lại.');
    }
  };

  const handleTriggerToastDemo = () => setActiveToast(demoNotification);
  const shellAppSwipeHandlers = useSwipeBack({ onBack: onReturnHome, enabled: activeAppId !== 'home' });

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', activeAppDefinition?.themeColor || deviceMetadata.pwaThemeColor || '#0f172a',
    );
  }, [activeAppDefinition, deviceMetadata.pwaThemeColor]);

  return (
    <div
      data-device-mode={isIOS ? 'ios' : 'default'}
      className="phone-shell flex flex-col relative overflow-hidden select-none font-sans"
      style={{
        backgroundImage: `url(${defaultWallpaper})`,
        ...(isIOS ? { paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' } : {}),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 1. Phone OS Status Bar */}
      {!isIOS && <StatusBar
        deviceMetadata={deviceMetadata}
        backgroundColor={activeAppDefinition ? activeAppDefinition.themeColor : 'transparent'}
      />}
      {isIOS && <div aria-hidden="true" className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 'env(safe-area-inset-top, 0px)', backgroundColor: activeAppDefinition?.themeColor }} />}

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
          <IoShieldCheckmarkOutline className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{systemAlertToast}</span>
        </div>
      )}

      {/* 4. Active Screen Content */}
      <div className={`flex-1 flex flex-col relative min-h-0 ${activeAppId === 'home' ? 'overflow-visible' : 'overflow-hidden'}`}>
        {activeAppId === 'home' ? (
          /* =================================================================
             HOME SCREEN LAUNCHER (PhoneOSHomeView)
             ================================================================= */
          <div className="phone-launcher flex-1 flex flex-col justify-between relative min-h-0">
            {/* Top Section: Clock & Upper Apps */}
            <div className="flex flex-col min-h-0">
              {/* Clock Widget */}
              <div className="phone-clock-widget">
                <div className="text-4xl font-light tracking-tight text-white leading-none tabular-nums">
                  {deviceMetadata.narrativeTime}
                </div>
                <div className="text-ios-caption-2 tall:text-ios-caption-1 font-medium text-slate-300 mt-0.5 tall:mt-1">
                  Thứ Ba, 13 tháng 10
                </div>
              </div>

              {/* Upper App Grid (Level-Based Filtered) */}
              <div className="phone-app-grid grid grid-cols-4">
                {activeUpperApps.map((app) => (
                  <AppIconSquircle
                    key={app.appId}
                    app={app}
                    onClick={() => handleLaunchApp(app.appId)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Section: IoSearchOutline Pill, Dock, Home Bar */}
            <div className="flex flex-col gap-3 shrink-0">
              {/* Search Pill (Interactive Toast Trigger) */}
              <div className="flex justify-center mb-0.5 tall:mb-1">
                <button
                  type="button"
                  onClick={handleTriggerToastDemo}
                  className="glass-subtle rounded-full px-4 min-h-[44px] flex items-center gap-1.5 text-ios-caption-1 text-white/90 hover:bg-white/20 active:scale-95 transition-all"
                >
                  <IoSearchOutline className="w-3.5 h-3.5 text-sky-300" />
                  <span>Tìm kiếm (Chạm để thử Toast)</span>
                </button>
              </div>

              {/* Frosted Glass Dock Tray (Fast Access Apps) */}
              <div className="glass-dock phone-dock grid grid-flow-col auto-cols-fr">
                {activeDockApps.map((app) => (
                  <AppIconSquircle
                    key={app.appId}
                    app={app}
                    hideLabel
                    onClick={() => handleLaunchApp(app.appId)}
                  />
                ))}
                <AppIconSquircle
                  app={{ displayName: 'Camera', icon: IoCamera, themeGradient: 'from-slate-400 to-slate-600' }}
                  hideLabel
                  onClick={() => onNotify('Camera: ch\u1ee9c n\u0103ng \u0111ang ph\u00e1t tri\u1ec3n.')}
                />
              </div>

            </div>
          </div>
        ) : (
          /* =================================================================
             ACTIVE MICRO-APP VIEWPORT
             ================================================================= */
          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900" {...shellAppSwipeHandlers}>
            <AppErrorBoundary
              onErrorFallback={() => {
                onReturnHome();
                onNotify('Ứng dụng tạm thời không phản hồi. Vui lòng thử lại!');
              }}
            >
              {children}
            </AppErrorBoundary>

          </div>
        )}
      </div>

      {/* One gesture area keeps launcher and app geometry identical. */}
      {!isIOS && <button
        type="button"
        onClick={onReturnHome}
        className="relative isolate flex w-full shrink-0 items-center justify-center transition-colors duration-200"
        style={{
          backgroundColor: activeAppId === 'home' ? 'transparent' : activeAppDefinition?.bottomBarColor ?? activeAppDefinition?.themeColor,
          height: 'calc(34px + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Về trang chủ"
      >
        <span aria-hidden="true" className="h-1 w-32 rounded-full bg-white mix-blend-difference" />
      </button>}

      {overlays}

      {/* 6. AssistiveTouch Floating Button */}
      <AssistiveTouch
        onGoHome={() => onReturnHome()}
        onOpenNotebook={onOpenNotebook}
        onOpenLevelSelector={() => setShowLevelSheet(true)}
        onRestartLevel={handleRestartLevel}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenPwaGuide={() => setShowPwaGuide(true)}
        isFullscreen={isFullscreen}
        isIOS={isIOS}
      />

      {/* 7. Level Selector Modal Sheet */}
      {showLevelSheet && renderLevelSelector(() => setShowLevelSheet(false))}

      {/* 8. PWA Guidance Modal Sheet */}
      {showPwaGuide && (
        <PwaGuideSheet
          pwa={pwa}
          onClose={() => setShowPwaGuide(false)}
          onPreviewFullscreen={handleToggleFullscreen}
          isIOS={isIOS}
        />
      )}

    </div>
  );
};

export default PhoneShell;
