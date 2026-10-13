/**
 * Canonical Declarative Case & Content Schema Definitions (US-001)
 * Single Source of Truth for game cases, suspect pools, lock puzzles, and device telemetry.
 */

export type VerdictType = 'innocent' | 'cheating' | 'sugar_relationship';

export interface GroundTruth {
  verdict: VerdictType;
  culpritSuspectId: string;
  narrativeRoast: string;
  overJealousRoast?: string;
}

export interface Suspect {
  suspectId: string;
  displayName: string;
  avatarUrl?: string;
  initialDiscoveredApp: string;
}

export interface LockChallenge {
  challengeId: string;
  targetType: 'app' | 'album' | 'chat';
  targetId: string;
  lockType: 'numeric_pin' | 'security_question';
  expectedAnswer: string;
  clueSourceApp: string;
  promptQuestion?: string;
}

export interface DeviceMetadata {
  narrativeTime: string;
  batteryPercent: string;
  carrierTag: string;
  pwaThemeColor: string;
}

export interface NotificationToast {
  toastId: string;
  sourceAppId: string;
  senderTitle: string;
  snippetBody: string;
  triggerDelaySeconds?: number;
  clueRefId?: string;
}

export interface LevelMetadata {
  caseId: string;
  husbandId: string;
  husbandName: string;
  levelNumber: 1 | 2 | 3;
  levelTitle: string;
  storySnippet: string;
  thumbnailAsset?: string;
  allowedStrikes: number;
  unlockRequirementLevel: number;
}

export interface CaseConfig {
  caseId: string;
  husbandId: string;
  husbandName: string;
  levelNumber: 1 | 2 | 3;
  allowedStrikes: number;
  groundTruth: GroundTruth;
  suspectPool: Suspect[];
  lockChallenges: LockChallenge[];
  deviceMetadata: DeviceMetadata;
  activeAppIds: string[];
  appsData: Record<string, any>;
  notifications?: NotificationToast[];
}

