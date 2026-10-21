# Requirements Slicing & SMART Scope Assessment Guidelines

Use when slicing elicited business requirements, briefs, mockups, or system specifications into backlog-ready Epics and User Stories across any project architecture.

**Size limit**: the maximum effort for one story. Default: ≤ 5 working days for one engineer or pair. If the team states another limit (2-week sprint, story points, flow-based cycle time), confirm it once with the user and apply it wherever this document says "size limit". The zones in Section 2 are calibrated to the default; scale them proportionally for another limit.

---

## 1. The SMART User Story Evaluation Framework

Audit every candidate story against **SMART** before inclusion. If a story fails any dimension, refine or slice it.

| Dimension | Standard | Evaluation Test | Pass Signal | Red Flag (Fail) |
|---|---|---|---|---|
| **S — Specific** | Exactly **one** discrete user goal, transaction, or capability. | Can the outcome be stated in one sentence without "and", "as well as", or bundled actions? | Clear, bounded actor goal. | Broad container scope (*"Manage profile settings"*, *"In-app messaging system"*). |
| **M — Measurable** | Completion is objectively verifiable. | Can QA verify it with a finite set of pass/fail scenarios? | Observable UI states, explicit API responses, or deterministic data records. | Subjective qualities (*"intuitive experience"*, *"fast load times"*). |
| **A — Achievable** | Deliverable within the **size limit**. | Passes the **5-Factor Complexity Rubric** (Section 2) with **zero** tripwire hits (Section 3). | Green across all 5 factors. | Any tripwire hit; bundled views or full CRUD+L. |
| **R — Relevant** | Advances the parent Epic outcome. | Does it deliver an observable user workflow or system capability? | Traces to an agreed capability. | Pure technical task with no observable value (see Section 7 for allowed enablers). |
| **T — Time-boxed** | Has defined entry and exit states. | Do edge cases and review fit inside the size limit without spillover? | Bounded scope. | Open-ended exploration or unbounded scope (use a spike, Section 7). |

---

## 2. The 5-Factor Complexity Rubric (Objective Sizing)

| Factor | Green (within size limit) | Yellow (scrutinize) | Red (MUST split) |
|---|---|---|---|
| **1. Surface Footprint (UI / API)** | 1 view/page, 1 list with a simple slide-over, or 1 API endpoint. | 1 primary view + 1 complex multi-step modal, or 2 trivial API endpoints. | ≥ 2 distinct full screens, multi-step wizards, ≥ 2 non-trivial API endpoints, or ≥ 3 API endpoints. |
| **2. Data & Entity Lifecycle (CRUD+L)** | Read-only query/list, create-only form, or single-entity mutation. | Create + Read on one simple entity. | Create + Read + Update + Delete + lifecycle transitions in one story. |
| **3. Business Logic & Branching** | ≤ 3 rules: 1 happy path + 1–2 standard validations. | 4–5 conditional branches or role-based variations. | > 5 branches: state machine, multi-party approval, combinatorial fallbacks. |
| **4. Integration & Boundary Span** | Internal state or 1 standard external call. | 2 synchronous interactions with standard error handling. | Multi-system orchestration: webhooks + queues + third-party APIs + cache sync. |
| **5. Test & Verification Footprint** | ≤ 5 deterministic scenarios. | 6–8 edge cases and assertions. | > 8 scenarios, large combinatorial matrix, or multi-party async verification. |

---

## 3. The 4 Sizing Tripwires (Automatic Split Triggers)

Ask these 4 questions about a candidate story. If the answer to **any** is YES, the story is too big and **MUST be split**.

| # | Tripwire | Ask | Trips when | Example that trips it | If tripped, split with (Section 4) |
|---|---|---|---|---|---|
| 1 | **Multi-Surface** | Does it touch too many screens / endpoints / pipelines? | UI app: 2+ full screens or sub-views. API: 2+ endpoint contracts or integration events, unless both are trivial and the combined story is still Green on all 5 rubric factors. Data: 2+ pipelines or schema domains | "Browse orders, view order details, and edit my profile" = 3 screens | Pattern 1 |
| 2 | **Full-Lifecycle (CRUD+L)** | Does it create, read, update, **and** delete the same entity? | All 4 operations are in one story | "Manage products" | Pattern 2 |
| 3 | **Multi-Actor** | Does it serve 2+ user types with *different goals or flows*? | 2 or more user types with different flows (one flow shared by several roles is fine) | Customer submits a claim + admin moderates it | Pattern 6 |
| 4 | **Heterogeneous Subsystem** | Does it mix unrelated subsystems? | 2 or more unrelated subsystems | Data feed + real-time chat + media upload | Pattern 5 |

---

## 4. Systematic Slicing Patterns

When a story fails SMART or hits a tripwire, apply a vertical slicing pattern:

| # | Pattern | Apply When | Slices |
|---|---|---|---|
| 1 | **View / Surface Progression** | Overview/list plus deep detail modal or drawer (Tripwire 1). | A: core overview, search/filter, data binding. B: detail / deep inspection. |
| 2 | **CRUD+L Lifecycle Partitioning** | Full entity lifecycle in one story (Tripwire 2). | A: query/browse. B: capture/create. C: maintain (edit, archive, delete). |
| 3 | **Core Flow vs. Advanced Recovery** | High rule density where some failure handling is a distinct user-visible capability (Factor 3 Red). | A: primary flow **including** input validation, error states, and safe failure behavior. B: advanced recovery capabilities with their own user value (conflict resolution, offline sync, retry/refund/cancellation flows). Never defer basic validation or error handling to B. |
| 4 | **Rule & Logic Staging (Simple → Complex)** | Advanced or dynamic business rules (Factor 3 Red). | A: baseline static rules. B: advanced/dynamic rules (tiered thresholds, exemptions, configuration engines). |
| 5 | **Channel & Subsystem Decoupling** | Disparate paradigms bundled (Tripwire 4). | One slice per interaction channel (feed, messaging, media). |
| 6 | **Persona & Permission** | Multiple roles or tiers (Tripwire 3). | Standard end-user interactions vs. privileged/admin operations. |
| 7 | **Workflow Steps** | A long end-to-end workflow with distinct steps. | Thinnest end-to-end path first, then enrich each step in later slices. |
| 8 | **Data & Interface Variations** | Same behavior across many data types, formats, or input channels. | One slice for the simplest variation; add each further variation (file type, payment method, locale, input mode) as its own slice. |
| 9 | **Walking Skeleton / Release Slicing (Story Mapping)** | A release or MVP boundary is required. | Map the user journey backbone left to right; the thinnest end-to-end slice goes into the earliest release; record the target in the optional `Release` column. Enforce Milestone Consumer Alignment: prune modular component/app suites to only those components consumed by the target release milestone (e.g. Level 1 MVP), deferring unmounted components to future milestones. |

---

## 5. Project Architecture Adaptations

Adapt slicing boundaries to the architecture while preserving SMART:

- **Full-Stack / User-Facing (Web, Mobile, Desktop)**: slice vertically across UI, business logic, and data layer per discrete user goal; each story is testable in the UI.
- **API-Only / Integration / Microservice**: slice by consumer goal, endpoint contract, or integration event (*"As an API Consumer, I want to authenticate via OAuth2 to obtain a JWT token"*); each story delivers a complete testable contract (contract + validation + processing + status codes). Default is one endpoint contract per story; when endpoints depend on each other (e.g., create, then retrieve), make separate stories and record the order in `Depends On`.
- **Data / Platform / Migration**: slice by data capability, pipeline transformation unit, or schema domain; each story delivers a testable ingestion, transformation, or verification pipeline.
- **Data-Driven, Narrative & Simulation (Games, Scenarios, Rule Engines)**: slice by the duality of **Engine/Mechanism Slices** (how the platform processes and displays data) vs. **Content/Scenario Slices** (the declarative datasets, levels, quests, or schemas that deliver concrete user value). Never assume engine stories cover data ingestion; author explicit case/scenario integration stories connecting design specs to production data.

---

## 6. Heuristic Analysis Filters

Before finalizing slices, evaluate against 5 filters (filters 1–4 are checks; filter 5 is a suggestion):

1. **CRUD+L Entity Lifecycle**: confirm all lifecycle operations for key entities (Create, Read, Update, Delete, plus Archive, Expire, Suspend, Restore) are covered across the story set; never bundle all in one story.
2. **Entry & Exit Dynamics**: if the feature has ≥ 2 entry points (navigation, deep link, quick action, system event), verify initial state (pre-filled vs empty), authentication state, and exit/cancel routing.
3. **Ripple Lens (Shared Resource Side-Effects)**: when a shared resource or schema changes, check:
   - **Snapshot Rule**: does it affect past records, in-flight processes, or future items only?
   - **Cascading Invalidation**: does changing entity X invalidate entity Y, requiring resets or re-evaluation?
   - **State Locks**: block mutations on entities locked by active workflows.
   Record any affected story in `Depends On`.
4. **Zero / One / Many**: start with the simple scope and one primary success path; slice *Many* (bulk operations, batch imports, large lists) into dedicated stories.
5. **Independence (suggested, not enforced)**: prefer stories and epics that can be built, tested, and released on their own, in any order.
   - Reduce coupling by re-slicing along different seams, or by moving shared setup into the first story that needs it.
   - When a dependency remains, record it in `Depends On` and order the stories accordingly.
   - The size limit wins: never merge stories to remove a dependency if that pushes a story over the size limit.

---

## 7. Enablers, Spikes & NFRs

Pure engineering tasks (indexing, pipeline config, boilerplate, unit-test authoring) belong in sprint task tracking, with these exceptions:

| Type | Rule |
|---|---|
| **NFR** (performance, security, accessibility, availability) | Attach as a measurable constraint in the Slicing Rationale of each story it governs. Create a standalone story only when it is cross-cutting and has its own verifiable outcome (e.g., audit logging across the system). |
| **Enabler** (architecture, infrastructure, tech debt) | Allowed as a story only when a user-facing story depends on it and it cannot be sliced into that story, or the project is explicitly technical. Prefix the title `[Enabler]`; the actor is the consuming team or system; list the dependent stories in `Depends On`. |
| **Spike** (research / feasibility) | Allowed only when an unknown blocks sizing. Prefix the title `[Spike]`; state the learning question and exit decision in the rationale; time-box it within the size limit. Re-slice dependent stories after the spike result. |

---

## 8. Anti-Patterns

- **App-as-a-Story / Subsystem-as-a-Story**: never treat an entire multi-screen application, module, or portal as one story.
- **Technical task as a story**: never record engineering sub-tasks as stories outside the Section 7 exceptions.
- **Happy-path-only slices**: never ship a slice without its own validation and error handling, and never create a follow-up story that only makes an earlier slice safe.
- **Ghost Content Fallacy (Engine without Content)**: in declarative or data-driven systems, decomposing only technical mechanisms while assuming narrative/business datasets magically appear without explicit delivery stories.
- **Unphased Component Sprawl**: scaffolding or specifying components/apps that are not consumed by the active milestone or level, creating unvalidated backlog bloat.
- **Multi-Release Epic Bundling (Zombie Epics)**: grouping stories across multiple release boundaries (e.g. mixing MVP and Post-MVP/deferred stories) in a single epic container, preventing the epic from achieving Definition of Done or closing upon release completion. Slices spanning releases must be partitioned into release-specific epics.
