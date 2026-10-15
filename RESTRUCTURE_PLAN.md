# Vertical Slice Restructure Plan

Status: Proposed. Planning only; implementation requires a separate instruction.

## 1. Recommendation

Keep `src/apps/<app-id>/` as the app slices. Extract gameplay capabilities from `PhoneShell`, give each capability an explicit public entry point, and wire them together in one composition layer. Migrate incrementally, keeping the application runnable after every phase.

- **Pros:** clearer ownership, smaller change scope, testable gameplay rules, reuse of the existing app structure.
- **Cons:** temporary compatibility adapters, import churn, and care needed around saved sessions and active feature work.

A full folder rewrite would produce a cleaner tree immediately, but would mix many unrelated changes and increase regression and merge risk. It is not recommended.

## 2. Evidence and scope

### Confirmed facts

- [The architecture](.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md) requires a modular client-side SPA, a shell agnostic of app business logic, declarative story content, and shared gameplay engines.
- [App registration](src/apps/registry.ts) already composes independent app folders through `AppDefinition`. The reviewed imports contain no sibling-app dependencies.
- [PhoneShell](src/shell/PhoneShell.tsx) combines navigation, level loading, session persistence, suspect collection, unlock handling, and strike penalties.
- [The app contract](src/types/app-contracts.ts) passes the full `CaseConfig` to every app. [CaseConfig](src/types/case-schema.ts) includes ground truth, expected lock answers, and `Record<string, any>` app payloads.
- Banking and Poshee now contain local data adapters, types, view components, and styles. Banking imports its data adapter; the earlier finding that its helpers were disconnected is superseded.
- Evidence types currently live in [UniversalEvidenceModal](src/components/UniversalEvidenceModal.tsx), coupling consumers of the data contract to a UI module.
- [ESLint](eslint.config.js) has no feature import-boundary rules. Existing CI already runs lint, tests, and build.
- The working tree contains active, uncommitted app and shared-component changes. This plan uses that working tree as evidence, not only committed HEAD.

### Proposed decisions

- Retain React, the static SPA deployment, existing app folders, and the current content authoring model.
- Separate app slices, gameplay features, shared platform contracts, and composition.
- Prefer explicit typed callbacks and direct composition. Add no event bus, state library, backend, or dependency-injection framework for this restructure.
- Preserve established behavior and persisted data during extraction. Record existing defects separately before changing their semantics.

### Assumptions

- This is a structural migration. New screens, gameplay rules, and redesigns are outside its scope.
- These decisions remain proposals until implementation is requested.

### Dependencies, risks, and open questions

- **Dependency:** establish a stable checkpoint with the current banking, Poshee, and shared-evidence work before moving their files.
- **Risk:** legacy app aliases and saved sessions can break if identifiers or storage keys change during moves.
- **Risk:** replacing name-based tags with canonical suspect IDs would change existing behavior and require save migration. Do not bundle that change into extraction.
- **Risk:** the design skill and agent references contain legacy names and source paths; those references must follow the final implementation.
- **Open question:** whether to expand saved evidence with source-record attribution. Preserve the existing persisted fields by default; design any expansion separately.

## 3. Target ownership

Proposed paths below are migration targets, not existing directories.

```text
src/
  bootstrap/
    GameRoot.tsx                 # Compose capabilities, storage, shell, and apps
    appRegistry.ts               # Assemble app definitions and legacy aliases
  shell/
    PhoneShell.tsx               # OS frame, launcher, navigation, overlay placement
    components/                  # Status bar, launcher icons, OS-only controls
  apps/
    banking/                     # Keep current types, adapters, components, styles
    ecommerce/
    internet-messaging/
    ...                          # Existing app IDs retained
  features/
    case-runtime/                # Case loading, validation, catalog, default merge
    investigation/               # Suspect collection and duplicate-tag rules
    locks/                       # Challenge lookup, validation, unlock state and UI
    suspicion/                   # Strike rules and exhausted-strike state
    session/                     # Save/restore mapping, progress, storage adapter
  platform/
    contracts/                   # App host, evidence, and cross-feature DTOs
    ui/                          # Reused evidence modal/target, sheet, error boundary
    gestures/                    # Reused swipe-back behavior
  data/
    cases/                       # Declarative story JSON retained
    defaults/                    # Existing benign content retained
  tests/
    integration/                 # Cross-feature flows and save compatibility
```

Each app/feature exposes an explicit `index.ts` API and owns its behavior, relevant models, UI, and unit tests. Create internal subfolders only when the slice needs them. Do not split a small app just to match a template.

The `platform` contains only contracts or primitives with actual cross-slice consumers. OS-specific UI belongs to `shell`; challenge UI belongs to `locks`. Story JSON remains centralized because cases intentionally span multiple apps.

## 4. Dependency rules

| Owner | Allowed dependencies | Boundary |
|---|---|---|
| `bootstrap` | Public APIs of apps/features/shell; platform | Owns concrete wiring and lifecycle coordination |
| `shell` | Platform; injected app catalog, views, state, callbacks | No concrete storage, case loader, or gameplay rule imports |
| `apps/<id>` | Its own internals; platform | No sibling apps, feature internals, shell, or bootstrap |
| `features/<name>` | Its own internals; platform | No apps/shell/bootstrap or direct sibling-feature imports |
| `platform` | Platform internals and external libraries | No app, feature, shell, or bootstrap imports |
| `case-runtime` | Declarative `data` plus platform | Owns the content-loading boundary |

`bootstrap` connects features through typed inputs and callbacks. For example, lock failure invokes suspicion behavior, then the session layer persists the resulting snapshot. Features do not call each other's concrete stores.

Shared contracts may define identifiers, serializable snapshots, and evidence payloads. Feature rules remain inside their owner. The composition layer should coordinate calls, not become a replacement home for gameplay rules.

## 5. Migration sequence

### Phase 0 — Freeze and characterize the baseline

1. Reconcile this plan with the latest working tree; establish a reviewed checkpoint without overwriting or reverting active work.
2. Record canonical app IDs, supported aliases, registry entries, storage keys, schema version, and current save shapes.
3. Run existing lint, tests, and build. Record pre-existing failures separately.
4. Add focused behavior tests where coverage is missing: tag deduplication, app and nested locks, strike exhaustion, level reset, and save/restore.
5. Record specification/implementation discrepancies separately. Assertions should describe the behavior actually tested; data assertions alone do not establish gesture or UI behavior.

**Exit:** reproducible baseline, representative existing-save fixtures, and a documented scope for each migration batch.

### Phase 1 — Establish shared contracts and enforce boundaries

1. Move evidence DTOs out of `UniversalEvidenceModal` into `platform/contracts`; the modal and app adapters consume those types.
2. Separate app-host contracts from session and case models. Keep persisted models owned by `session`; expose only necessary public types.
3. Add explicit public exports for the slices as they are migrated. Avoid blanket exports of internal components.
4. Add ESLint import restrictions for the dependency rules. Allow temporary legacy paths through a documented, shrinking allowlist.
5. Detect circular runtime dependencies with a focused architecture check; reuse existing tooling where practical.

**Exit:** evidence types have no UI dependency, and newly migrated code cannot import forbidden internals.

### Phase 2 — Extract case and session capabilities

1. Move `schemaEngine` behavior into `features/case-runtime`; preserve catalog, validation, merge precedence, and existing content aliases.
2. Move the localStorage adapter and repository contract into `features/session`.
3. Extract save/restore serialization from `PhoneShell`. Inject the storage repository into session orchestration so tests can use an in-memory implementation.
4. Preserve storage keys, schema version, field names, IDs, and current missing/corrupt-save handling. Keep app-local navigation transient unless already persisted.
5. Use temporary forwarding exports for old import paths while consumers migrate.

**Exit:** existing saves round-trip through the extracted session capability; the shell no longer imports concrete storage or case-loading code.

### Phase 3 — Extract gameplay slices and compose them

1. Extract suspect collection and duplicate-tag behavior into `investigation`.
2. Extract challenge lookup, verification, solved-challenge state, and the existing lockpad into `locks`.
3. Extract strike transitions and exhausted-strike state into `suspicion`.
4. Introduce `bootstrap/GameRoot.tsx` to connect those slices, case loading, persistence, and shell props.
5. Keep navigation and transient OS presentation in the shell. Coordinate restart/level switching in bootstrap: replace the case, reset feature state together, and persist only the resulting consistent snapshot.
6. Preserve app-lock versus nested-lock routing. A solved vault, chat, or album challenge must return to its owning app context.

**Exit:** the shell contains presentation/navigation code; rule tests run without mounting the shell; transitions do not save mixed old/new case state.

### Phase 4 — Narrow app inputs, one app at a time

1. Pilot with banking, building on `bankingData`, `bankingEvidence`, local types, and components. Then migrate Poshee and messaging, followed by the remaining apps individually.
2. Replace broad `caseData` view props with app-specific normalized data and the minimal public context required by that app.
3. Keep raw payloads `unknown` at the ingestion boundary; normalize them through the app-owned adapter into typed data. Do not replace `any` with unchecked casts.
4. Provide typed host callbacks for navigation, evidence submission, and unlock requests. Apps receive lock status/context, not expected answers or ground truth.
5. Bind each app's normalizer and typed view through its registration adapter. Preserve type safety when composing heterogeneous app registrations.
6. Keep each app's legitimate story attribution and benign filler behavior. Normalize legacy aliases at a documented ingestion/registration boundary rather than adding new fallback chains in views.
7. Colocate app unit tests; keep tests involving several capabilities in integration tests.

**Exit per app:** no full `CaseConfig` in its view props, no `any` payload in its migrated path, no sibling-app import, and verified navigation/evidence/lock behavior.

### Phase 5 — Finish ownership moves and remove compatibility code

1. Move OS-only components to `shell/components`; move shared primitives and gestures to `platform`. Reuse existing components.
2. Move `src/apps/registry.ts` composition into bootstrap. Keep stable IDs and alias support while exposing each launcher app once.
3. Remove old forwarding exports and temporary boundary exceptions after consumers migrate.
4. Add a migration appendix to the canonical architecture document, preserving its existing content; update affected README and agent/skill source-path references. Use the appropriate authoring skills for those updates.
5. Reuse CI's lint/test/build gates; ensure architecture checks run there too.

**Exit:** each module has one owner; no stale import paths, boundary exceptions, or circular runtime imports remain.

## 6. Verification and completion criteria

- **Dependencies:** forbidden imports and circular runtime dependencies fail CI. Platform contracts never import app or feature implementations.
- **State:** tagging, unlocking, strike failure, reset, level switching, and resume preserve baseline behavior and consistent saved snapshots.
- **Compatibility:** fixtures using existing storage keys/schema/aliases still load; serialization changes require an explicit migration outside mechanical moves.
- **App isolation:** a migrated view can render from its own normalized fixture and host callbacks without loading all case data.
- **Evidence:** verify the existing 380ms narrative-only long-press and blurred modal behavior. Structural chrome has no evidence target. Retain Ionicons/SVG icon rules and the prohibition on permanent visible pin buttons.
- **UI:** inspect launcher, one app list/detail flow, evidence inspection, and app/nested lock flows in the browser after the relevant batches. Verify back/swipe behavior and OS frame reuse.
- **Checks:** run `npm run lint`, `npm test`, and `npm run build` for each implementation batch. Add behavioral coverage for moved rules; avoid tests that merely assert the new folder layout.
- **Scope:** no new verdict/scoring/share-card implementation, narrative edits, framework replacement, or UI redesign as part of this migration. Any new screen still follows the project's ASCII-wireframe/signoff/HTML progression.

## 7. Execution batches and rollback

Use one reviewable change per capability extraction and one per app contract migration. Keep moves separate from behavior changes where possible. Each batch records its affected public API, compatibility adapter, validation results, and remaining exceptions.

Rollback means reverting that migration batch to its reviewed checkpoint. Do not reset or discard unrelated working-tree changes. Remove a compatibility adapter only after all consumers and save fixtures pass.

The restructure is complete when app and gameplay ownership follow the dependency rules, `PhoneShell` is a presentation/navigation boundary, app views have narrow typed inputs, and the compatibility and behavioral checks above pass.
