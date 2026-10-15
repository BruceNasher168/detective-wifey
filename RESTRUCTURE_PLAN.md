# Vertical Slice Restructure Plan

Status: Structural migration implemented. See [ARCHITECTURE.md](ARCHITECTURE.md) for current ownership. Wider-MVP delivery and unresolved product decisions remain separate.

## Implementation record

- Refreshed from the latest working tree; retained the pre-existing banking UI, CSS, test changes, and design document.
- Applied the later ownership decisions: app-specific components stay local; shell owns OS UI; shared owns generic primitives; investigation exposes evidence UI to apps through its public entry point.
- Extracted case runtime, session persistence, tag rules, locks, suspicion, and the React-independent play-session coordinator. Bootstrap injects dependencies and shell slots.
- Narrowed all app host contexts, added app-owned typed ingestion, removed runtime `any` payloads, and retained existing payload aliases in registration metadata.
- Added lint/import-graph enforcement and colocated gameplay/context regression tests. Existing integration tests remain under `src/tests`.
- Preserved storage v1 and launcher behavior. Fixed nested-resource unlock routing, retained supplied evidence attribution, and guarded delayed writes/reads/failure timers during resets.
- Wider-MVP capability implementation, generalized content manifests/migrations, full lockout/security-question behavior, and baseline conflict resolution remain follow-on work. A source-path migration is not a product-scope signoff.
- Browser verification is unavailable because the browser connector cannot load its request-header policy. Automated tests and static app rendering are the available checks; interaction/layout/performance budgets remain unverified in-browser.
- Validation passed: lint with zero warnings, a 100-module dependency/cycle check, 43 Vitest tests plus 4 architecture-policy tests, TypeScript/production build, and all 11 app design audits. Original case/default JSON is byte-identical; the starting banking app/test bodies, styles, and moved wallpaper were checked against the local baseline.

## 1. Recommendation

Keep `src/apps/<app-id>/` as the app slices. Extract gameplay capabilities from `PhoneShell`, give each capability an explicit public entry point, and coordinate the play lifecycle in a dedicated `play-session` feature. Keep bootstrap responsible for concrete wiring. Migrate incrementally, keeping the application runnable after every phase.

- **Pros:** clearer ownership, smaller change scope, testable gameplay rules, reuse of the existing app structure.
- **Cons:** temporary compatibility adapters, import churn, and care needed around saved sessions and active feature work.

A full folder rewrite would produce a cleaner tree immediately, but would mix many unrelated changes and increase regression and merge risk. It is not recommended.

The previous plan addressed current coupling but omitted boundaries needed by the wider MVP: the evidence locker, objectives, hints, confrontation/excuses/scoring, progression, and sharing. Prepare those boundaries without adding their undelivered behavior to the refactor. Future CMS, cloud, audio, and monetization work gets a documented extension point only.

## 2. Evidence and scope

### Pre-refactor evidence

- **Evidence status:** [vision/scope](.agent-artifacts/requirements/output/vision-scope.md) is marked `draft`, despite its confirmed rows and baseline wording. The [project elicitation](.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md) is `signed-off` / `COMPLETE`. Solution-context documents are marked `approved` but contain the contradictions below. Do not treat every source as a reconciled baseline.
- **Research boundary:** this revision checks requirements and solution context (research tiers 1 and 2). Code observations below come from the preceding working-tree review; Phase 0 must refresh them before implementation.
- [The architecture](.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md) requires a modular client-side SPA, a shell agnostic of app business logic, declarative story content, and shared gameplay engines.
- [App registration](src/bootstrap/appRegistry.ts) already composes independent app folders through `AppDefinition`. The reviewed imports contain no sibling-app dependencies.
- [PhoneShell](src/shell/PhoneShell.tsx) combines navigation, level loading, session persistence, suspect collection, unlock handling, and strike penalties.
- [The app contract](src/shared/contracts/app-contracts.ts) passes the full `CaseConfig` to every app. [CaseConfig](src/shared/contracts/case-schema.ts) includes ground truth, expected lock answers, and `Record<string, any>` app payloads.
- Banking and Poshee now contain local data adapters, types, view components, and styles. Banking imports its data adapter; the earlier finding that its helpers were disconnected is superseded.
- Evidence types currently live in [UniversalEvidenceModal](src/features/investigation/components/UniversalEvidenceModal.tsx), coupling consumers of the data contract to a UI module.
- [ESLint](eslint.config.js) has no feature import-boundary rules. Existing CI already runs lint, tests, and build.
- The working tree contains active, uncommitted app and shared-component changes. This plan uses that working tree as evidence, not only committed HEAD.

### Scope traceability and architectural implications

| Source-backed capability | Evidence | Required boundary / plan change |
|---|---|---|
| New husbands, levels, apps, and puzzle types through declarative data and registration | [Elicitation, Technologies](.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md#technologies), [scope, constraints](.agent-artifacts/requirements/output/vision-scope.md#4-key-constraints--non-functional-requirements-global) | Versioned content manifest, catalog-driven case/progression rules, app-owned ingestion, and typed challenge dispatch |
| Evidence cards, suspect linkage, and objective counter | [Scope, MVP](.agent-artifacts/requirements/output/vision-scope.md#in-scope-mvp), [notebook features](.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/wife-notebook/features.md#3-declarative-state-contract) | `investigation` owns actual evidence records and links; name-only tagging is a legacy adapter, not the final host API |
| Free/cooldown Sixth Sense hints | [Signed-off scope](.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md#boundary) | `hints` consumes evidence progress and authored clue locations; shell renders requested app highlighting |
| Anytime confrontation, excuses, verdict, stars, titles, retry | [Scope, MVP](.agent-artifacts/requirements/output/vision-scope.md#in-scope-mvp), [architecture, engines](.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md#3-core-systemic-shared-engines) | `confrontation` owns evaluation/outcome rules; `progression` owns pass/unlock rules; `play-session` coordinates lifecycle |
| Numeric/security-question locks and skippable lockout | [Shell security subsystem](.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/shell/features.md#23-shared-polymorphic-screen-lock-subsystem) | `locks` owns challenge handlers; `suspicion` owns penalty/lockout state; timers have an injectable clock |
| Vertical local result card and progress persistence | [Scope, MVP](.agent-artifacts/requirements/output/vision-scope.md#in-scope-mvp), [architecture, persistence](.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md#5-state-management--persistence-architecture) | `sharing` consumes an immutable result; `session` handles versioned storage, not scoring or unlock policy |
| Floating controls, motion, boot/app splash screens | [Signed-off decisions](.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md#decisions--constraints), [motion/navigation](.agent-artifacts/project-knowledge-base/solution-context/design-system/behaviors-motion.md#1-common-systemic-behaviors--navigation) | Shell-owned presentation and typed app destinations; no gameplay rules hidden inside animation callbacks |
| Offline active gameplay, bundle/switching budgets, static hosting | [Scope, NFRs](.agent-artifacts/requirements/output/vision-scope.md#4-key-constraints--non-functional-requirements-global), [hosting](.agent-artifacts/project-knowledge-base/solution-context/architecture/hosting-deployment.md#3-bundler--frontend-configuration-rules) | Package required data/assets before play; no first-use runtime chunk fetches, remote images/fonts, or history-routing dependency |

### Source conflicts and decisions required

These are findings, not approved requirement changes. Preserve source documents and current runtime behavior while preparing neutral boundaries. Resolve the relevant decision before a migration changes that behavior; independent extractions can proceed.

| ID | Conflict / gap | Treatment in this plan |
|---|---|---|
| D1 | Signed-off elicitation and vision specify a level-based launcher; SAD requires 11 permanent icons; [shell design](.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/shell/app-design.md#32-ios-2627-springboard-launcher-grid-12-app-invariant) and shell features specify 12 permanent apps after splitting Phone/Messages | Separate registered app catalog, case provisioning, and launcher layout. Supply a prepared launcher model to shell. Do not hardcode 11/12 or select a visibility policy without reconciling the sources. |
| D2 | Scope describes tap-to-pin; notebook describes >=450ms and a choice sheet; workspace instructions require 380ms on narrative data with `UniversalEvidenceModal`, no structural targets, no permanent pin buttons, and Ionicons/SVG | Explicit workspace instructions govern this migration. Retain the useful evidence/suspect model without copying stale gestures, emoji icon examples, or alternate sheets. |
| D3 | SAD scores speed/strikes; notebook adds evidence completeness; scope/elicitation give evidence-count tiers and a premature-confrontation condition that overlaps the one-card tier | Isolate scoring/confrontation policy; resolve valid-evidence thresholds, outcome classification, and weights before implementing evaluation. Do not infer a formula or mandatory card count. |
| D4 | Notebook models evidence and source linkage, while SAD session examples serialize suspect tags only | Treat evidence identity/provenance as a required architectural contract. Add persisted evidence only with an explicit versioned migration; never manufacture evidence from legacy name-only tags. |
| D5 | SAD illustrates future cloud adapters, while scope excludes accounts/backend and identifies them as CR triggers | Preserve the asynchronous repository port. No provider SDK, authentication, remote adapter, or cloud implementation in this restructure. |
| D6 | <100ms switching coexists with approved 300–500ms app splash decisions and longer motion durations | Separate input response, mounting, and presentation timing in measurements. Confirm the acceptance interpretation before changing timing; do not silently relax either source. |
| D7 | Scope claims signoff but its frontmatter remains `draft`; approved shell files also mix 8/11/12-app wording | Track source normalization as a separate documentation change. Do not silently change approval metadata or infer authority from timestamps alone. |

### Structural decisions

- Retain React, the static SPA deployment, existing app folders, and the current content authoring model.
- Separate app slices, gameplay features, shared shared contracts, and composition.
- Keep game-specific cross-capability orchestration in `play-session`. Permit only its declared dependencies on other feature public APIs; forbid peer-to-peer store access and cycles.
- Prefer explicit typed callbacks and direct composition. Add no event bus, state library, backend, or dependency-injection framework for this restructure.
- Preserve established behavior and persisted data during extraction. Record existing defects separately before changing their semantics.
- Give each wider-MVP capability an owner now; create its implementation only when that capability is delivered. Avoid empty directories, speculative plugin loaders, and an open-ended global state bag.

### Assumptions

- This is a structural migration. New screens, gameplay rules, and redesigns are outside its scope.
- Structural implementation was authorized in this conversation. Unresolved product rules and deferred capability policies remain proposals.

### Dependencies, risks, and open questions

- **Dependency:** establish a stable checkpoint with the current banking, Poshee, and shared-evidence work before moving their files.
- **Risk:** legacy app aliases and saved sessions can break if identifiers or storage keys change during moves.
- **Risk:** replacing name-based tags with canonical suspect IDs would change existing behavior and require save migration. Do not bundle that change into extraction.
- **Risk:** the design skill and agent references contain legacy names and source paths; those references must follow the final implementation.
- **Dependency:** resolve D1 before changing launcher provisioning/Comms identities, and D3 before scoring/confrontation delivery. These decisions do not block unrelated file moves.
- **Open questions:** exact hint cooldown/selection rules, evidence-count semantics (pinned versus linked versus attached), timer behavior across suspension/reload, and content-update compatibility. Define their policy contracts now; confirm values before implementing those behaviors.

## 3. Target ownership

The structural owners below now exist. Comments concerning undelivered capabilities describe their intended ownership; no empty future-feature directories were created.

```text
src/
  bootstrap/
    GameRoot.tsx                 # Wire concrete adapters, catalog, and play-session
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
    play-session/                # Case lifecycle and cross-capability orchestration
    case-runtime/                # Case loading, validation, catalog, default merge
    investigation/               # Suspects, evidence locker/linkage, objective selectors
    locks/                       # Challenge lookup, validation, unlock state and UI
    suspicion/                   # Strike rules and exhausted-strike state
    session/                     # Save/restore mapping, storage adapter; no game rules
  shared/
    contracts/                   # App host, evidence, and cross-feature DTOs
    ui/                          # Generic sheets, typography, error boundary
    gestures/                    # Reused swipe-back behavior
  data/
    cases/                       # Declarative story JSON retained
    defaults/                    # Existing benign content retained
  tests/
    integration/                 # Cross-feature flows and save compatibility
```

Each app/feature exposes an explicit `index.ts` API and owns its behavior, relevant models, UI, and unit tests. Create internal subfolders only when the slice needs them. Do not split a small app just to match a template.

The `shared` folder contains only contracts or primitives with actual cross-slice consumers. OS-specific UI belongs to `shell`; challenge UI belongs to `locks`. Story JSON remains centralized because cases intentionally span multiple apps.

Owners reserved for wider-MVP delivery (create modules when implementing them):

- `hints`: clue selection and cooldown policy; returns a target app/destination without exposing answer metadata to app UI.
- `confrontation`: accusation input, excuses, verdict/scoring/title rules, and immutable outcome data. Keeps evaluation independent of notebook presentation.
- `progression`: case eligibility, passing/unlocking, best-result rules, and catalog ordering. `session` serializes its output.
- `sharing`: local 9:16 rendering/export from an outcome DTO; no storage or gameplay mutation.

`investigation` owns the notebook UI and selectors over evidence/suspects. It submits typed accusation requests to the session coordinator; it does not evaluate ground truth. Atomic design remains a UI composition method inside these owners, not another repo-wide layer structure.

## 4. Dependency rules

| Owner | Allowed dependencies | Boundary |
|---|---|---|
| `bootstrap` | Public APIs of apps/features/shell; shared | Wires concrete adapters, catalogs, and coordinator; no game rules |
| `shell` | Shared; injected app catalog, views, state, callbacks | No concrete storage, case loader, or gameplay rule imports |
| `apps/<id>` | Its own internals; shared; investigation public evidence exports | No sibling apps, private feature internals, shell, or bootstrap |
| Leaf feature | Its own internals; shared | No apps/shell/bootstrap or sibling-feature imports |
| `play-session` | Declared public APIs of leaf features; shared | Coordinates transitions; no concrete storage implementation or imported app internals |
| `shared` | Shared internals and external libraries | No app, feature, shell, or bootstrap imports |
| `case-runtime` | Declarative `data` plus shared | Owns the content-loading boundary |

Bootstrap injects the repository, content catalog, app registrations, and clock. `play-session` connects features through typed inputs and callbacks. For example, lock failure invokes suspicion behavior, then the session layer persists the resulting snapshot. Features do not call each other's concrete stores. Enforce an acyclic allowlist rather than banning every public feature dependency and moving all behavior into bootstrap.

Shared contracts may define identifiers, serializable snapshots, and evidence payloads. Feature rules remain inside their owner. The composition layer should coordinate calls, not become a replacement home for gameplay rules.

### Contracts that must survive expansion

The following are proposed contract requirements, not claims that these fields or behaviors already exist:

1. **Content identity and validation:** separate content version from save schema version. A content manifest identifies game, case, husband, catalog position/rules, app payload versions, and referenced assets/clues/challenges. Validate IDs, targets, suspect/evidence references, aliases, and required assets before packaging. Keep launch level constraints validated; add future levels through authored rules rather than copying `1 | 2 | 3` and threshold switches into more modules.
2. **Evidence provenance:** an evidence draft carries stable case/app/source-record identity, preview data, and optional authored clue references. Keep suspect identity separate from evidence identity; support unlinked evidence and benign decoys. Deduplicate by source identity within the case, not display names/snippets. Engine validation resolves truth/validity; app views cannot submit a trusted `isSmokingGun` flag. The objective counter uses a selector over authored case rules, not repeated hardcoded counts in apps.
3. **App identity and destinations:** generic stable IDs are separate from parody display names, icon metadata, legacy aliases, launcher placement, and case visibility. Use typed app-owned destinations for banner/hint navigation and return after unlock; resource IDs are scoped to an owning app. Phone/Messages expansion follows D1 rather than silently reinterpreting existing `comms` saves.
4. **Challenge dispatch:** numeric PIN and security-question requests form a discriminated contract with app/resource targets and an explicit return destination. `locks` owns answer checking; UI receives presentation data only. Register additional approved handlers without adding app-specific branches to shell. A handler registry is sufficient; no dynamic plugin framework.
5. **Lifecycle, time, and persistence:** `play-session` defines explicit transitions for restore, exploring, blocked/lockout, confrontation, completion, failure, restart, and advancement as each capability arrives. Timers use an injectable clock; narrative timestamps remain independent of player elapsed time. Serialize complete consistent state after accepted transitions, with ordered async writes and stale-case guards. UI booleans and React components do not enter snapshots.
6. **Save evolution:** identify legacy keys/versions before selecting the writer; simply changing the namespaced version would strand existing saves. Validate, migrate, and retain a recoverable original until migration succeeds. Missing/newer content and storage failure yield explicit local recovery handling. Do not reconstruct source attribution that old saves never recorded.
7. **Authority boundaries:** narrow app props prevent accidental truth/answer coupling, not client-side secret extraction. Ground truth remains in the static bundle by design. Evaluation reads authoritative content; app adapters receive only public narrative/identity context and host callbacks.

### Extension points and scope limits

| Direction | Prepare now | Defer |
|---|---|---|
| More husbands/cases/levels | Stable IDs, catalog/rule lookup, content validation, save/content versions | New authored content and unconfirmed difficulty rules |
| CMS content pipeline | Bundled content loader/validator contract; build-time import seam | Remote CMS, admin screens, runtime fetching |
| Cloud persistence | Existing async repository port and injected local adapter | Provider selection, accounts, sync/conflict-resolution implementation; formal scope change required |
| Audio, scratch-offs, new puzzle mechanics | Local asset references, challenge/interaction dispatch, shared feedback preference boundary | New mechanics, audio engine, or third-party runtime SDKs |
| Monetized hints/analytics | Keep hint policy separate from shell presentation | Ad/payment/tracking integrations; do not add dormant SDKs or permission flows |

Preparing a seam does not approve or implement deferred scope. Keep all required gameplay chunks, fonts, and media available before the active case starts; on-demand imports during play can violate the zero-network requirement. Content growth must still meet the initial-bundle budget, or require an explicit loading-budget decision.

## 5. Migration sequence

### Phase 0 — Freeze and characterize the baseline

1. Reconcile this plan with the latest working tree; establish a reviewed checkpoint without overwriting or reverting active work.
   Record D1–D7 in the migration review; settle behavior-changing decisions before their dependent batches. Source corrections are separate from mechanical extraction.
2. Record canonical app IDs, supported aliases, registry entries, storage keys, schema version, and current save shapes.
3. Run existing lint, tests, and build. Record pre-existing failures separately.
4. Add focused behavior tests where coverage is missing: tag deduplication, app and nested locks, strike exhaustion, level reset, and save/restore. Include a second-husband catalog fixture and colliding app-local record IDs to expose global-identity assumptions.
5. Record specification/implementation discrepancies separately. Assertions should describe the behavior actually tested; data assertions alone do not establish gesture or UI behavior.

**Exit:** reproducible baseline, representative existing-save fixtures, and a documented scope for each migration batch.

### Phase 1 — Establish shared contracts and enforce boundaries

1. Move evidence DTOs out of `UniversalEvidenceModal` into `shared/contracts`; the modal and app adapters consume those types.
2. Separate app-host contracts from session and case models. Keep persisted models owned by `session`; expose only necessary public types.
   Define evidence drafts/source IDs, app destinations, content-version identity, and typed challenge requests. Retain a legacy tagging adapter; new contracts must not force fabricated evidence or immediately change saves.
3. Add explicit public exports for the slices as they are migrated. Avoid blanket exports of internal components.
4. Add ESLint import restrictions for the dependency rules. Allow temporary legacy paths through a documented, shrinking allowlist.
5. Detect circular runtime dependencies with a focused architecture check; reuse existing tooling where practical.

**Exit:** evidence types have no UI dependency, and newly migrated code cannot import forbidden internals.

### Phase 2 — Extract case and session capabilities

1. Move `schemaEngine` behavior into `features/case-runtime`; preserve catalog, validation, merge precedence, and existing content aliases.
   Centralize alias normalization and reference validation; prepare manifest/version handling without implementing a remote content source or new levels.
2. Move the localStorage adapter and repository contract into `features/session`.
3. Extract save/restore serialization from `PhoneShell`. Inject the storage repository into session orchestration so tests can use an in-memory implementation. Introduce the initial bootstrap root here to supply loaded case data and session callbacks to shell; Phase 3 then relocates the remaining gameplay coordination.
4. Preserve storage keys, schema version, field names, IDs, and current missing/corrupt-save handling during extraction. Establish a version-aware reader and tested migration seam before any later evidence/timer schema expansion. Keep app-local navigation transient unless already persisted.
5. Use temporary forwarding exports for old import paths while consumers migrate.

**Exit:** existing saves round-trip through the extracted session capability; the shell no longer imports concrete storage or case-loading code.

### Phase 3 — Extract gameplay slices and compose them

1. Extract suspect collection and duplicate-tag behavior into `investigation`.
2. Extract challenge lookup, verification, solved-challenge state, and the existing lockpad into `locks`.
3. Extract strike transitions and exhausted-strike state into `suspicion`.
4. Introduce `play-session` for coordinated case state and transitions; extend the bootstrap wiring from Phase 2 to provide its concrete dependencies.
5. Keep navigation and transient OS presentation in the shell. Coordinate restart/level switching in `play-session`: replace the case, reset feature state together, cancel old timers, guard delayed callbacks/writes, and persist only the resulting consistent snapshot.
6. Preserve app-lock versus nested-lock routing. A solved vault, chat, or album challenge must return to its owning app context.

**Exit:** the shell contains presentation/navigation code; rule tests run without mounting the shell; bootstrap contains dependency wiring; transitions do not save mixed old/new case state. Record the future hints/confrontation/progression/sharing contracts without generating unused implementations.

### Phase 4 — Narrow app inputs, one app at a time

1. Pilot with banking, building on `bankingData`, `bankingEvidence`, local types, and components. Then migrate Poshee and messaging, followed by the remaining apps individually.
2. Replace broad `caseData` view props with app-specific normalized data and the minimal public context required by that app.
3. Keep raw payloads `unknown` at the ingestion boundary; normalize them through the app-owned adapter into typed data. Do not replace `any` with unchecked casts.
4. Provide typed host callbacks for navigation, evidence submission, and unlock requests. Apps receive lock status/context, not expected answers or ground truth.
   Preserve available source-record attribution through the adapter; do not reduce the final evidence port back to `onTagSuspect(name)`. Retain compatibility callbacks only for unmigrated consumers.
5. Bind each app's normalizer and typed view through its registration adapter. Preserve type safety when composing heterogeneous app registrations.
6. Keep each app's legitimate story attribution and benign filler behavior. Normalize legacy aliases at a documented ingestion/registration boundary rather than adding new fallback chains in views.
7. Colocate app unit tests; keep tests involving several capabilities in integration tests.

**Exit per app:** no full `CaseConfig` in its view props, no `any` payload in its migrated path, no sibling-app import, and verified navigation/evidence/lock behavior.

### Phase 5 — Finish ownership moves and remove compatibility code

1. Move OS-only components to `shell/components`; move shared primitives and gestures to `shared`. Reuse existing components.
2. Registry composition belongs in `src/bootstrap/appRegistry.ts`. Keep stable IDs and alias support while exposing each launcher app once. Launcher policy changes still depend on D1; adding a registration must not require editing shell JSX.
3. Remove old forwarding exports and temporary boundary exceptions after consumers migrate.
4. Prepare source-alignment patches for the canonical architecture/shell/scope contradictions and changed source paths. Preserve originals and decision provenance; do not append an architecture claim while leaving an unresolved contradictory baseline. Apply confirmed documentation changes through the appropriate authoring skills; do not change approval metadata as a side effect.
5. Reuse CI's lint/test/build gates; ensure architecture checks run there too.

**Exit:** each module has one owner; no stale import paths, boundary exceptions, or circular runtime imports remain.

### Subsequent MVP delivery — use the reserved owners

This is a follow-on delivery sequence, not part of the behavior-preserving refactor:

1. Deliver evidence locker/linking/objective behavior and its versioned save migration in `investigation` + `session` after contract decisions are settled.
2. Deliver hints and complete lockout timing using authored clue/rule data, injected clocks, and explicit suspension/resume policy.
3. Deliver confrontation/excuses/evaluation and progression using confirmed scoring rules. Distinguish a nonterminal excuse response from terminal verdict/failure before clearing sessions or unlocking a case.
4. Deliver sharing from immutable result data with local assets. Export failure must preserve the completed result and earned progress.

Each new UI follows wireframe/signoff governance. Each capability adds focused tests at its own delivery point; the refactor does not claim those capabilities are implemented merely because their owners are named.

## 6. Verification and completion criteria

- **Dependencies:** forbidden imports and circular runtime dependencies fail CI. Platform contracts never import app or feature implementations.
- **State:** tagging, unlocking, strike failure, reset, level switching, and resume preserve baseline behavior and consistent saved snapshots.
- **Compatibility:** fixtures using existing storage keys/schema/aliases still load; serialization changes require an explicit migration outside mechanical moves.
- **Save ordering:** a delayed save/timer from a prior case cannot overwrite the current case after restart/switch. Test ordering through a deliberately delayed in-memory repository.
- **Expansion:** a second husband and another fixture case use catalog data without changes to shell/game-loop conditionals; duplicate display names and app-local IDs do not collide. Current launch constraints still reject unsupported configurations.
- **Evidence readiness:** typed contracts retain stable provenance and support decoys/unlinked evidence without exposing truth flags in app props. Legacy saves round-trip without invented attribution. Full objective/evaluation behavior is verified when delivered.
- **Challenge readiness:** the host contract represents numeric and security-question requests; migrated handlers preserve existing behavior and app/resource return routing. Validate actual handler availability for authored content. Missing handlers are explicit compatibility gaps, never an implicit PIN fallback; delivery of a missing mechanic remains separate from extraction.
- **App isolation:** a migrated view can render from its own normalized fixture and host callbacks without loading all case data.
- **Evidence:** verify the existing 380ms narrative-only long-press and blurred modal behavior. Structural chrome has no evidence target. Retain Ionicons/SVG icon rules and the prohibition on permanent visible pin buttons.
- **UI:** inspect launcher, one app list/detail flow, evidence inspection, and app/nested lock flows in the browser after the relevant batches. Verify back/swipe behavior and OS frame reuse.
- **Checks:** run `npm run lint`, `npm test`, and `npm run build` for each implementation batch. Add behavioral coverage for moved rules; avoid tests that merely assert the new folder layout.
- **Runtime budgets:** verify required assets/chunks are loaded before active play, then record zero gameplay network requests; measure switching response and packaged initial assets against <100ms and <5MB targets. Track the unresolved splash/timing interpretation in D6; build success alone is insufficient evidence.
- **Scope:** no new verdict/scoring/share-card implementation, narrative edits, framework replacement, or UI redesign as part of this migration. Any new screen still follows the project's ASCII-wireframe/signoff/HTML progression.

## 7. Execution batches and rollback

Use one reviewable change per capability extraction and one per app contract migration. Keep moves separate from behavior changes where possible. Each batch records its affected public API, compatibility adapter, validation results, and remaining exceptions.

Rollback means reverting that migration batch to its reviewed checkpoint. Do not reset or discard unrelated working-tree changes. Remove a compatibility adapter only after all consumers and save fixtures pass.

The restructure is complete when app and gameplay ownership follow the dependency rules, `PhoneShell` is a presentation/navigation boundary, bootstrap only wires dependencies, app views have narrow typed inputs with evidence provenance, and applicable compatibility/behavior checks pass. Source conflicts have explicit dispositions before dependent behavior changes. Wider-MVP ownership is documented without prematurely implementing deferred capabilities.
