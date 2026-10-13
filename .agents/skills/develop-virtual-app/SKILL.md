---
name: develop-virtual-app
description: "Scaffold, implement, style, and test pluggable parody virtual applications conforming to the emulated phone shell AppDefinition contract, declarative case schemas, forensic suspect tagging, and app-design.md UI/UX specifications. Use when implementing new virtual apps, revising in-app views, styling components, integrating puzzle locks, or adding forensic clues."
---

# Develop Virtual App

- Implements modular, client-side virtual applications mounted on the emulated smartphone container for the *Jealous Wife Detective Game*.
- Enforces strict adherence to individual `app-design.md` branding tokens, touch target ergonomics ($\ge 44 \times 44\text{px}$), the `AppDefinition` registry contract, and declarative clue wiring.

> [!NOTE]
> **SSOT for Skill Triggers**: The frontmatter `description` above is the **Single Source of Truth** for when to activate this skill. Do NOT repeat a redundant `## When to Use` section in the body. Agents that mount this skill define dispatch conditions in their own `.agent.md` file.

## References

Query these files on demand using progressive disclosure:
- **Authoritative Architecture (SAD)**: [apps-features-architecture.md](../../../.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md) — Shell container, 8-app grid invariant, and engine interactions.
- **Micro-App Design Specifications (SSOT for UI/UX)**:
  - LoZa: [loza/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/loza/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/loza/features.md)
  - VietPay: [vietpay/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/vietpay/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/vietpay/features.md)
  - Poshee: [poshee/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/poshee/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/poshee/features.md)
  - Grap: [grap/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/grap/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/grap/features.md)
  - NetSurf: [netsurf/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/netsurf/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/netsurf/features.md)
  - Comms (Phone & SMS): [phone-os/comms/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/comms/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/comms/features.md)
  - Photos: [phone-os/photos/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/photos/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/photos/features.md)
  - Husband's Notes: [husband-notes/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/husband-notes/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/husband-notes/features.md)
  - Wife's Notebook: [wife-notebook/app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/wife-notebook/app-design.md) \| [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/wife-notebook/features.md)
- **Data & Contract Schemas**: [references/app-contracts.md](references/app-contracts.md) — TypeScript interfaces for `AppDefinition`, `CaseData`, and session state.
- **Component Boilerplate**: [assets/app-component.template.tsx](assets/app-component.template.tsx) — Starter React component.

## Prerequisites & Inputs

> [!IMPORTANT]
> **Stop & Ask on Ambiguity**: If the target `appId`, clue schema, or UI design specification is ambiguous: **STOP IMMEDIATELY**. Ask the user for clarification with structured options (2–4 per turn) and a recommendation.

- **Target App ID**: One of `loza`, `vietpay`, `poshee`, `grap`, `netsurf`, `photos`, `comms`, `husband_notes`.
- **UI Design SSOT**: The corresponding `.agent-artifacts/.../apps/<appId>/app-design.md` must be inspected before making any UI, color, typography, or layout changes.
- **Clue Mapping**: Target clue IDs verified against `clue-traceability-matrix.md` or `caseData.appsData`.

## Procedure

### Step 1: Design & Specification Intake (Mandatory App Design SSOT Gate)
1. Read the target app's `app-design.md` file using `view_file`. Extract:
   - Primary and secondary brand color hex codes.
   - Parody identity and trademark defense guidelines (e.g. avoid real-world app blue/green palettes).
   - Touch target dimensions ($\ge 44 \times 44\text{px}$) and row height constraints.
   - Screen hierarchy and layout wireframes.
2. Read the app's `features.md` to identify forensic capabilities (e.g. chat search, hidden albums, ride history).

### Step 2: Component Scaffolding & Registry Setup
1. Instantiate [assets/app-component.template.tsx](assets/app-component.template.tsx) into `src/apps/<appId>/<AppName>App.tsx`.
2. Configure the `AppDefinition` export in `src/apps/<appId>/index.ts`:
   - `appId`: Strict literal matching `AppId`.
   - `displayName`: Parody app name from `app-design.md`.
   - `themeColor`: Brand hex code.
   - `iconAsset`: Path to optimized SVG icon.
   - `component`: The React component.
3. Register the new app export in `src/apps/registry.ts`.

### Step 3: Implement Forensics, Interactivity & Navigation
1. Implement the header with a back button (`min-h-[44px] min-w-[44px]`) invoking `onReturnHome` or returning to the top list view.
2. Implement feed/list and detail/inspection views.
3. Ensure all list rows and tap targets satisfy $\ge 44 \times 44\text{px}$ minimum clickable bounds.

### Step 4: Wire Suspect Tagging & Declarative Clues
1. Bind suspect mentions or evidence highlights to `onTagSuspect(suspectName, appId)` so the player can transfer clues to the Wife's Notebook with a single tap.
2. Consume dynamic case data exclusively from `caseData.appsData?.[appId]`.
3. If no clues are present for this app in the current case, render realistic benign filler content (parody memes, spam notifications, family chats) to prevent process-of-elimination spoilers.

### Step 5: Verification & Contract Audit
1. Run the companion design and contract verification script:
   ```bash
   python .agents/skills/develop-virtual-app/scripts/validate_app_design.py --app-id <appId> --component src/apps/<appId>/<AppName>App.tsx
   ```
2. Verify TypeScript compilation: ensure zero type errors against `AppDefinition` and `VirtualAppProps`.
3. Inspect screen transitions to guarantee latency remains $< 100\text{ms}$.

## Conditional Branching & Fallbacks

- **Branch: If App or Folder is Locked (`lockChallengeId`)**:
  - Check if `unlockedChallenges.has(challengeId)`.
  - If locked, render the polymorphic lock interceptor overlay (4-digit numeric PIN pad or security question challenge) or invoke `onRequestUnlock(challengeId)`.
  - Dispatch failed attempts to the global Suspicion Engine.
- **Branch: If Declarative Data is Empty for Current Level**:
  - Render benign, realistic parody filler. Never crash with `undefined` property errors.
- **Error: If Contract Validation Fails**:
  - Inspect output of `validate_app_design.py`. Fix missing handlers (`onReturnHome`, `onTagSuspect`) or unaligned color tokens before proceeding.

## Deliverables & Consumer Soundness

- **Primary Consumer**: TypeScript compiler, Vite bundler, React runtime.
- **Artifacts**:
  - `src/apps/<appId>/<AppName>App.tsx` (Component implementation).
  - `src/apps/<appId>/index.ts` (Exporting `AppDefinition`).
  - `src/apps/registry.ts` (Universal 8-app registry entry).
- **Quality Gates**:
  - 100% compliant with colors and wireframes in `app-design.md`.
  - Zero hardcoded clue narratives.
  - Strict TypeScript compliance (zero `any`, full type safety across `VirtualAppProps`).
  - SOLID modularity: Subcomponents separated by responsibility (Header, List, Detail, LockGate).
  - Passes `validate_app_design.py` with zero contract errors.

## Anti-Patterns & Negative Constraints

- **Never bypass `app-design.md`**: Do not invent arbitrary color schemes, fonts, or layouts without checking the authoritative `app-design.md` first.
- **Never hardcode clues or suspect names**: Clue data must come from declarative `caseData` schemas.
- **Never mutate the home screen shell directly**: Pluggable apps must remain strictly decoupled and mount via the registry.
- **Never omit touch targets**: Every interactive button, list row, or tab must have minimum dimensions of $44 \times 44\text{px}$.
- **Never make network calls**: Virtual apps execute 100% client-side; never invoke `fetch()` or external APIs.
- **Never use `any` types or bypass prop validation**: Strongly type all internal component state and props.
- **Never write monolithic single-file apps**: Decompose apps into subcomponents with clear single responsibilities.

