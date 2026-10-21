# Virtual App Architecture & Contracts Reference

> **Runtime migration**: Current executable contracts are [app host](../../../../src/shared/contracts/app-contracts.ts), [evidence](../../../../src/shared/contracts/evidence.ts), and [session](../../../../src/features/session/types.ts). The examples below describe the earlier interface; use the linked source for current IDs, public context, and optional attribution.

This document defines the canonical TypeScript interfaces and runtime contracts for all virtual applications in the *Jealous Wife Detective Game*.

---

## 1. Micro-App Registration Contract (`AppDefinition`)

Every virtual application mounted on the phone shell must export an object conforming to `AppDefinition`:

```typescript
import { ComponentType } from 'react';

export type AppId = 
  | 'zola'
  | 'vietpay'
  | 'poshee'
  | 'grap'
  | 'netsurf'
  | 'photos'
  | 'comms'
  | 'husband_notes';

export interface VirtualAppProps {
  /** Declarative case data for the active level and case */
  caseData: CaseData;
  /** Callback to tag a suspect into the Wife's Notebook */
  onTagSuspect: (suspectName: string, sourceApp: AppId) => void;
  /** Callback to exit the app and return to the OS home screen */
  onReturnHome: () => void;
  /** Callback to request unlocking a protected view or folder */
  onRequestUnlock?: (challengeId: string) => void;
  /** Set of challenge IDs currently solved/unlocked */
  unlockedChallenges: Set<string>;
}

export interface AppDefinition {
  appId: AppId;
  displayName: string;
  iconAsset: string;
  themeColor: string;
  notificationBadgeCount?: number;
  isLocked: boolean;
  lockChallengeId?: string;
  component: ComponentType<VirtualAppProps>;
}
```

---

## 2. Declarative Case Data Contract (`CaseData`)

Apps must read clues and feed items dynamically from `caseData.appsData[appId]` and never hardcode narrative strings:

```typescript
export interface CaseData {
  caseId: string;
  husbandId: string;
  levelNumber: 1 | 2 | 3;
  allowedStrikes: number;
  appsData: {
    zola?: ZolaCaseData;
    vietpay?: VietPayCaseData;
    poshee?: PosheeCaseData;
    grap?: GrapCaseData;
    netsurf?: NetSurfCaseData;
    photos?: PhotosCaseData;
    comms?: CommsCaseData;
    husband_notes?: HusbandNotesCaseData;
    [key: string]: any;
  };
}
```

---

## 3. Pluggable State Persistence Architecture (`GameStateRepository`)

To support long gameplay sessions, prevent progress loss on browser reload, and allow seamless future migration to cloud databases (Option B), persistence is abstracted behind `GameStateRepository`:

```typescript
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
  }>;
  unlockedChallenges: string[];
  elapsedSeconds: number;
  lastSavedAt: number;
  appSpecificState?: Record<AppId, any>;
}

export interface PlayerProgress {
  schemaVersion: number;
  unlockedHusbandId: string;
  unlockedLevel: 1 | 2 | 3;
  bestStarRatings: Record<string, 1 | 2 | 3>;
  earnedWifeTitles: string[];
  audioMutePreference: boolean;
}

export interface GameStateRepository {
  getActiveSession(gameId: string): Promise<ActiveSessionState | null>;
  saveActiveSession(session: ActiveSessionState): Promise<void>;
  clearActiveSession(gameId: string): Promise<void>;

  getPlayerProgress(): Promise<PlayerProgress>;
  savePlayerProgress(progress: Partial<PlayerProgress>): Promise<void>;

  exportSaveCode?(gameId: string): Promise<string>;
  importSaveCode?(saveCode: string): Promise<boolean>;
}
```

### Persistence Invariants:
1. **Repository Abstraction**: All shell and engine components interact with `GameStateRepository`, never directly with `localStorage` or cloud APIs.
2. **Phase 1 (MVP)**: Implemented via `LocalStorageAdapter` (100% client-side, zero backend, $0 OpEx).
3. **Phase 2 (Cloud Expansion)**: Migrating to Supabase/Firebase requires providing a `RemoteApiAdapter` without modifying game logic.
4. **Auto-Save on Event**: State synchronizes asynchronously on every suspect tag, challenge unlock, strike increment, or screen transition.
5. **Resume Workflow**: On shell mount, `getActiveSession` checks for active progress and presents "Tiếp tục điều tra" (Resume) vs "Bắt đầu lại" (Restart).

---

## 4. Universal Evidence Pinning Contract (`StoryEvidenceTarget` & `UniversalEvidenceModal`)

All virtual applications must implement evidence pinning strictly through the universal long-press modal pattern:

```typescript
export interface UniversalEvidenceItem {
  title: string;
  subtitle?: string;
  snippet: string;
  suspectToTag: string;
}

export interface StoryEvidenceTargetProps {
  item: UniversalEvidenceItem;
  onTriggerEvidence: (item: UniversalEvidenceItem) => void;
  className?: string;
  children: React.ReactNode;
}

export interface UniversalEvidenceModalProps {
  isOpen: boolean;
  item: UniversalEvidenceItem;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
}
```

### Forensic Pinning Invariants:
1. **Story Narrative Data Only**: The 380ms long-press target (`StoryEvidenceTarget`) strictly wraps dynamic narrative items loaded from story `data.json` (messages, calls, SMS, transaction memos, receipts, notes, private photos, ride trips).
2. **Prohibition on App Chrome**: Static navigation headers, back buttons, tabs, search bars, contact action rows, and utility buttons must NEVER trigger evidence overlays.
3. **Zero Visible Pin Buttons**: Physical or permanent `<button>Ghim ...</button>` buttons are strictly forbidden in regular screens. Evidence is pinned exclusively through `UniversalEvidenceModal`.

