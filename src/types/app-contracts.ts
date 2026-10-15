import React from 'react';
import { CaseConfig } from './case-schema';

/**
 * Standard App Identifiers across the virtual mobile phone ecosystem.
 */
export type AppId =
  | 'internet-messaging'
  | 'zola'
  | 'banking'
  | 'ecommerce'
  | 'ride-hailing'
  | 'web-browser'
  | 'personal-notes'
  | 'email'
  | 'professional-network'
  | 'team-collaboration'
  | 'photos'
  | 'comms';

/**
 * Standard Props for all Pluggable Micro-Apps.
 */
export interface EvidenceSource {
  caseId: string;
  recordId: string;
  clueRefId?: string;
  title: string;
  snippet: string;
}

export interface VirtualAppProps {
  caseData: CaseConfig;
  onTagSuspect: (suspectName: string, sourceApp: AppId, evidence?: EvidenceSource) => void;
  onReturnHome: () => void;
  onRequestUnlock?: (challengeId: string) => void;
  unlockedChallenges: Set<string>;
}

/**
 * Standard Contract for Pluggable App Registration.
 */
export interface AppDefinition {
  appId: AppId;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  themeGradient: string;
  themeColor: string;
  notificationBadgeCount?: number;
  isLocked: boolean;
  lockChallengeId?: string;
  component: React.ComponentType<VirtualAppProps>;
}

/**
 * State Models for Pluggable Session Persistence (GameStateRepository).
 */
export interface ActiveSessionState {
  schemaVersion: number;
  gameId: string;
  caseId: string;
  levelNumber: 1 | 2 | 3;
  activeApp: AppId | 'home';
  suspicionStrikes: number;
  taggedSuspects: Array<{
    suspectId: string;
    displayName: string;
    sourceApp: AppId;
    timestamp: number;
    evidence?: EvidenceSource;
  }>;
  unlockedChallenges: string[];
  elapsedSeconds: number;
  lastSavedAt: number;
  appSpecificState?: Record<string, any>;
}

export interface PlayerProgress {
  schemaVersion: number;
  unlockedHusbandId: string;
  unlockedLevel: 1 | 2 | 3;
  bestStarRatings: Record<string, 1 | 2 | 3>;
  earnedWifeTitles: string[];
  audioMutePreference: boolean;
}

/**
 * Pluggable Persistence Repository Contract.
 * Decouples game logic from storage engine (LocalStorage in Phase 1, BaaS in Phase 2).
 */
export interface GameStateRepository {
  getActiveSession(gameId: string): Promise<ActiveSessionState | null>;
  saveActiveSession(session: ActiveSessionState): Promise<void>;
  clearActiveSession(gameId: string): Promise<void>;

  getPlayerProgress(): Promise<PlayerProgress>;
  savePlayerProgress(progress: Partial<PlayerProgress>): Promise<void>;

  exportSaveCode?(gameId: string): Promise<string>;
  importSaveCode?(saveCode: string): Promise<boolean>;
}

