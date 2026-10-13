# Virtual App Architecture & Contracts Reference

This document defines the canonical TypeScript interfaces and runtime contracts for all virtual applications in the *Jealous Wife Detective Game*.

---

## 1. Micro-App Registration Contract (`AppDefinition`)

Every virtual application mounted on the phone shell must export an object conforming to `AppDefinition`:

```typescript
import { ComponentType } from 'react';

export type AppId = 
  | 'loza'
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
    loza?: LozaCaseData;
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

## 3. Session State Persistence & Resumption Schema

To support long play sessions and prevent progress loss on browser refresh, the persistence adapter serializes active session state to `localStorage`:

```typescript
export interface ActiveSessionState {
  version: number; // Schema version for future migrations
  timestamp: number;
  activeCaseId: string;
  currentLevel: 1 | 2 | 3;
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
  appSpecificState: Record<AppId, any>; // e.g., active chat ID, current folder
}
```

### Persistence Invariants:
1. **Auto-Save**: The state manager updates `localStorage` on every suspect tag, challenge unlock, strike increment, or screen transition.
2. **Seamless Resume**: On mounting the virtual phone shell, check for an existing `ActiveSessionState`. If valid, restore in-memory state; if absent or completed, initialize a fresh case.
3. **Reset on Complete / Caught**: Clear or archive active session state when the verdict is submitted or the player gets caught (max strikes).
