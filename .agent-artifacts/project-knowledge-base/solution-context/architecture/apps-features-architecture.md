---
type: Software Architecture Document (SAD)
status: approved
description: "Canonical Software Architecture Document (SAD) defining the emulated mobile OS shell, pluggable app engine, systemic detective platform, state persistence, and declarative schema models."
tags: [architecture, sad, technical-specification, pluggable-engine, mobile-shell]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/requirements/output/vision-scope.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/hosting-deployment.md
---

# Software Architecture Document (SAD) — Jealous Wife Detective Game

> **Document Classification**: Canonical Technical Software Architecture Document (SAD).
> 
> Detailed app-specific UI/UX branding and screen features are modularized in the [`apps/`](../apps/) directory. Narrative clue ideas and cross-app puzzle chains are cataloged in [clue-traceability-matrix.md](../clue-traceability-matrix.md).

---

## 1. Architectural Style & Design Principles

The application is architected as an **Event-Driven, Client-Side Modular Single-Page Application (SPA)** executing inside an emulated smartphone container.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VIRTUAL SMARTPHONE SHELL CONTAINER                   │
│   [Status Bar: VinaPhone 5G | 23:45 | 42%]      [Wife's Notebook FAB]  │
├────────────────────────────────────────────────────────────────────────┤
│                       8-APP HOME SCREEN GRID                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │   LoZa   │  │ VietPay  │  │  Poshee  │  │   Grap   │                │
│  │ (Chat)   │  │ (Bank)   │  │ (E-Comm) │  │  (Rides) │                │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ NetSurf  │  │  Photos  │  │  Comms   │  │Husband's │                │
│  │(Browser) │  │ (Gallery)│  │ (Phone)  │  │  Notes   │                │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
├────────────────────────────────────────────────────────────────────────┤
│                     CORE SYSTEMIC ENGINE PLATFORM                      │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ Suspicion & Strike   │ │ Polymorphic Lock &   │ │ Wife's Notebook  │ │
│ │ Engine (3-5 Strikes) │ │ Puzzle Engine (PIN)  │ │ & Decision Hub   │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ Declarative Content  │ │ Verdict Evaluation & │ │ Shareable Roast  │ │
│ │ Schema Repository    │ │ Wife Title Engine    │ │ Card Canvas Gen  │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Architectural Principles
1. **Decoupled Shell & App Modules**: The virtual OS shell is completely agnostic of in-app business logic. Apps register via a pluggable `AppDefinition` contract.
2. **Universal 8-App Grid Invariant**: All 8 app icons are permanently mounted on the home screen across all levels (L1, L2, L3) to eliminate process-of-elimination spoilers. Inactive apps display benign filler content.
3. **Data-Driven Declarative Content**: Zero narrative text or clue mappings are hardcoded in UI components. All cases, suspects, chats, receipts, and ground truths are statically bundled declarative schemas.
4. **100% Client-Side Privacy-First Runtime**: Zero server-side APIs, zero analytics telemetry, and zero cookie persistence. Conforms to minor privacy compliance (13+).
5. **Ultra-Low Latency (< 100ms)**: In-memory state-driven view transitions ensure native mobile responsiveness.

---

## 2. Pluggable Micro-App Registry & Contracts

Every virtual app implements the standard `AppDefinition` interface:

```typescript
export interface AppDefinition {
  appId: 'loza' | 'vietpay' | 'poshee' | 'grap' | 'netsurf' | 'photos' | 'comms' | 'husband_notes';
  displayName: string;
  iconAsset: string;
  notificationBadgeCount?: number;
  isLocked: boolean;
  lockChallengeId?: string;
  component: React.ComponentType<{ 
    caseData: any; 
    onTagSuspect: (name: string, sourceApp: string) => void;
    onReturnHome: () => void;
  }>;
}
```

### Registered Virtual Applications
Individual visual identity, view hierarchies, and clue integrations are documented in:
* **[Virtual Phone OS & Native Suite](../apps/phone-os/index.md)**:
  * **Master OS Design System**: [Phone OS Master Design](../apps/phone-os/app-design.md) *(Applies to all OS apps, shell bezel, status bar & lockpad)*
  * **OS Shell & Launcher**: [Features](../apps/phone-os/shell/features.md)
  * **Native Comms (Phone & SMS)**: [Features](../apps/phone-os/comms/features.md) \| [App Design](../apps/phone-os/comms/app-design.md)
  * **Native Photos (Gallery Forensics)**: [Features](../apps/phone-os/photos/features.md) \| [App Design](../apps/phone-os/photos/app-design.md)
* **LoZa (Zalo Parody)**: [Features](../apps/loza/features.md) \| [App Design](../apps/loza/app-design.md)
* **VietPay (Bank/MoMo Parody)**: [Features](../apps/vietpay/features.md) \| [App Design](../apps/vietpay/app-design.md)
* **Poshee (Shopee Parody)**: [Features](../apps/poshee/features.md) \| [App Design](../apps/poshee/app-design.md)
* **Grap (Grab/Be Parody)**: [Features](../apps/grap/features.md) \| [App Design](../apps/grap/app-design.md)
* **NetSurf (Browser Parody)**: [Features](../apps/netsurf/features.md) \| [App Design](../apps/netsurf/app-design.md)
* **Husband's Notes & Calendar**: [Features](../apps/husband-notes/features.md) \| [App Design](../apps/husband-notes/app-design.md)
* **Sổ Tay Bắt Ghen Của Vợ (Wife's Notebook)**: [Features](../apps/wife-notebook/features.md) \| [App Design](../apps/wife-notebook/app-design.md)

---

## 3. Core Systemic Platform Engines

### 3.1. Wife's Investigation Notebook & Verdict Hub Engine
* **Architectural Role**: Omnipresent floating overlay component on the virtual phone shell.
* **Responsibilities**:
  * Manages reactive suspect collection state across all 8 apps.
  * Provides manual and tap-to-add suspect tagging.
  * Houses the **Final Accusation & Verdict Submission Hub** where the player designates the culprit and verdict category to conclude the level.

### 3.2. Polymorphic Puzzle & Unlock Engine
* **Architectural Role**: Dynamic interception gate guarding locked applications or in-app sub-folders.
* **Supported Lock Decouplings**:
  * `NumericPinLock`: 4-digit PIN pad overlay (e.g. VietPay launch gate, Photos hidden album, LoZa hidden chat).
  * `SecurityQuestionLock`: Text input or choice challenge verified against declarative answers.
* **Suspicion Hook**: Dispatches failed verification events to the Suspicion Engine.

### 3.3. Suspicion & Lockout Engine
* **Architectural Role**: Global tension manager enforcing game stakes.
* **Escalating Strike Thresholds**:
  $$\text{Max Strikes} = \begin{cases} 5, & \text{Level 1} \\ 4, & \text{Level 2} \\ 3, & \text{Level 3} \end{cases}$$
* **Failure Penalty Loop**:
  * Each failed PIN/answer triggers a skippable $\sim 60\text{s}$ lockout animation timer.
  * Reaching the strike limit triggers the "Bị giật lại máy" (Caught snooping) fail screen with instant case reset routing.

### 3.4. Verdict Evaluation & Scoring Engine
* **Architectural Role**: Pure functional rules evaluator executed upon submitting the verdict from the Wife's Notebook.
* **Evaluation Pipeline**:
  1. Compares `submittedVerdict` and `accusedSuspectId` against `caseConfig.groundTruth`.
  2. Computes Star Rating ($1\text{ to }3\text{ stars}$) based on speed and strikes incurred.
  3. Formulates the comedic roast narrative (including "Vợ Sư Tử Hà Đông" over-jealous roast for innocent cases).
  4. Generates a custom "Wife Title" (*e.g. Thám Tử Sư Tử, Vợ Đa Nghi, Nữ Hoàng Bắt Ghen*).

### 3.5. Shareable Social Card Canvas Generator
* **Architectural Role**: Client-side DOM/Canvas capture utility rendering a vertical ($9:16$) graphic card containing verdict, stars, title, and roast punchlines for TikTok, Zalo, and Facebook stories.

---

## 4. Declarative Content Schemas

### Case Configuration Model (`CaseConfig`)
```typescript
export interface CaseConfig {
  caseId: string;
  husbandId: string;
  levelNumber: 1 | 2 | 3;
  allowedStrikes: number; // L1: 5, L2: 4, L3: 3
  groundTruth: {
    verdict: 'innocent' | 'cheating' | 'sugar_relationship';
    culpritSuspectId: string; // Human or non-human entity
    narrativeRoast: string;
    overJealousRoast?: string;
  };
  suspectPool: Array<{
    suspectId: string;
    displayName: string;
    avatarUrl?: string;
    initialDiscoveredApp: string;
  }>;
  lockChallenges: Array<{
    challengeId: string;
    targetType: 'app' | 'album' | 'chat';
    targetId: string;
    lockType: 'numeric_pin' | 'security_question';
    expectedAnswer: string;
    clueSourceApp: string;
  }>;
  appsData: Record<string, any>;
}
```

---

## 5. State Management & Persistence Architecture

```
┌────────────────────────────────────────────────────────┐
│               CLIENT APPLICATION STATE (SPA)           │
├──────────────────────────┬─────────────────────────────┤
│ EPHEMERAL CASE STATE     │ PERSISTENT LEVEL PROGRESS   │
│ (In-Memory / React State)│ (Browser LocalStorage)      │
├──────────────────────────┼─────────────────────────────┤
│ • activeApp ('home'|'...')│ • unlockedHusbandId         │
│ • suspicionStrikes (0..N)│ • unlockedLevel (1..3)      │
│ • wifeNotebook.suspects  │ • bestStarRatings: Record   │
│ • unlockedChallenges: [] │ • earnedWifeTitles: []      │
│ • activeTimerSeconds     │ • audioMutePreference: bool │
└──────────────────────────┴─────────────────────────────┘
```

* **Zero Cloud Latency**: State synchronization operates purely via browser `localStorage`.
* **State Recovery**: If the user refreshes during active gameplay, the case resets to the level start to preserve investigation integrity.

---

## 6. Non-Functional Requirements & Performance SLAs

| Metric / NFR | Engineering Specification | Architecture Enforcement |
|---|---|---|
| **Bundle Size** | Initial JavaScript/CSS bundle $< 5\text{ MB}$ | Tree-shaken build; SVGs for icons; compressed WebP images and mono MP3s |
| **Screen Switching** | View switching latency $< 100\text{ms}$ | In-memory component mounting within virtual phone container |
| **Network SLA** | Zero runtime HTTP network requests post-load | Statically compiled declarative JSON bundles |
| **Ergonomics** | Portrait mobile viewport ($375\text{px}$–$430\text{px}$) | CSS Flexbox/Grid responsive container with centered desktop frame |
| **Touch Targets** | Touch target dimensions $\ge 44 \times 44\text{px}$ | Design system tokens for all buttons, tabs, and list rows |

---

## 7. Hosting & Deployment Architecture (GitHub Pages)

* **Distribution Model**: Static web bundle published to GitHub Pages (`https://<username>.github.io/<repo-name>/`).
* **CI/CD Pipeline**: Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) on push to `main`.
* **Bundler Configuration**: Relative base path (`base: './'`) in `vite.config.ts`.
* **Complete Specification**: See [hosting-deployment.md](hosting-deployment.md).

---

## 8. Architectural Cross-Reference Index

| Artifact | Location | Purpose |
|---|---|---|
| **Clue Traceability Matrix** | [clue-traceability-matrix.md](../clue-traceability-matrix.md) | Maps all 26 clue archetypes to apps, truth twists, and puzzle chains |
| **Clue Ideas Inventory** | [clue-ideas-inventory.md](../clue-ideas-inventory.md) | Canonical narrative catalog of viral Vietnamese marital tropes |
| **Hosting & Deployment** | [hosting-deployment.md](hosting-deployment.md) | GitHub Pages static hosting, GitHub Actions CI/CD, and bundler rules |
| **Virtual Phone OS & Native Suite** | [apps/phone-os/](../apps/phone-os/index.md) | [Shell](../apps/phone-os/shell/features.md), [Comms](../apps/phone-os/comms/features.md), [Photos](../apps/phone-os/photos/features.md) |
| **LoZa App Specification** | [apps/loza/](../apps/loza/) | [Features](../apps/loza/features.md) & [Design](../apps/loza/app-design.md) |
| **VietPay App Specification** | [apps/vietpay/](../apps/vietpay/) | [Features](../apps/vietpay/features.md) & [Design](../apps/vietpay/app-design.md) |
| **Poshee App Specification** | [apps/poshee/](../apps/poshee/) | [Features](../apps/poshee/features.md) & [Design](../apps/poshee/app-design.md) |
| **Grap App Specification** | [apps/grap/](../apps/grap/) | [Features](../apps/grap/features.md) & [Design](../apps/grap/app-design.md) |
| **NetSurf App Specification** | [apps/netsurf/](../apps/netsurf/) | [Features](../apps/netsurf/features.md) & [Design](../apps/netsurf/app-design.md) |
| **Husband's Notes Spec** | [apps/husband-notes/](../apps/husband-notes/) | [Features](../apps/husband-notes/features.md) & [Design](../apps/husband-notes/app-design.md) |
| **Wife's Notebook Spec** | [apps/wife-notebook/](../apps/wife-notebook/) | [Features](../apps/wife-notebook/features.md) & [Design](../apps/wife-notebook/app-design.md) |
