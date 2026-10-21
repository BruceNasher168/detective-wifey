---
name: functional-decomposition
description: Decomposes confirmed, signed-off elicitation output into epics and right-sized user-story slices with evidence-based sizing, dependencies, and scope-change classification. Use when splitting epics, slicing or breaking down a backlog, story mapping, planning releases, or adding scope to an existing epic. Does not author story files, acceptance criteria, or wireframes.
---

# Functional Decomposition Skill

## Purpose

Turn a complete, signed-off elicitation session output into confirmed epic/story slices sized for delivery, recorded in `.agent-artifacts/requirements/output/functional-decomposition.md`. Consumes elicitation session outputs from `.agent-artifacts/requirements/output/elicitation/` or epic-scoped `elicitation-<slug>.md` files.

**Size limit**: the maximum effort for one story; default ≤ 5 working days. If the team uses another limit (e.g., 2-week sprint, story points), confirm it once with the user and apply it wherever this skill says "size limit".

Physical user story (`us-*.md`) and UI/wireframe specification authoring, folder placement, and index synchronization are owned by downstream skills (e.g., `manage-requirement-artifacts` or `generate-wireframe`), not this skill.

---

## Decomposition Levels

Decompose business behavior before screens or technical components. Hierarchy: exactly two levels, **Epic → Story**. No initiative or feature tier.

| Level | Meaning | Example | In `functional-decomposition.md`? |
|---|---|---|---|
| Business outcome | Why the product/change exists | Reduce manual order processing | No — lives in `vision-scope.md` |
| Capability / Epic | Stable business ability / delivery unit | Manage Orders (`epic-01-order-management`) | Yes — one section |
| User story | Deliverable slice for one actor and value | I want to upload orders so that... (`us-001`) | Yes — one row |
| Task / subtask | Delivery work, not BA scope definition | Build parser, add DB migration | No — sprint/engineering tracking |

Do not jump from business outcome to tasks. Do not decompose into technical components (e.g., "Database", "API Gateway") as epics or stories unless the project is explicitly technical/API-only or the item is an enabler/spike per `references/slicing-guidelines.md` Section 7.

**Single-Release Epic Cohesion Invariant**: Each epic must represent a single deliverable release boundary (e.g., Release 1 / MVP, Release 2). Never bundle user stories spanning across multiple releases into a single epic. If scope spans releases, split into separate release-scoped epics so each epic can achieve Definition of Done and be marked `Delivered` upon release completion.

---

## Scope Type: New Epic vs. Existing Epic Addition

Determine this first; the Readiness Check depends on it. Locate the target `<epic-slug>` heading (`## <epic-slug> - ...`) in `.agent-artifacts/requirements/output/functional-decomposition.md` with a targeted search; never load the entire file.

| Scope Type | Detection | Workflow Impact |
|---|---|---|
| **New Epic** | No matching section exists | Slice the full requirement into a fresh story set. |
| **Existing Epic Addition** | A matching section exists | Run the **Delta Assessment** first. Do not re-slice the whole epic from scratch. |

### Delta Assessment (Existing Epic Addition only)

1. Read **only** the target epic's section (view the line range from its heading to the next epic heading), plus its `us-*.md` files if available via `manage-requirement-artifacts`, to establish confirmed stories and each story's `Status` (or frontmatter / backlog sync status via `sync-backlog`). Determine the highest `us-NNN` ID across the whole file with a targeted search.
2. Classify the new requirement against each potentially-affected story. **Check status first, before scope fit:**
   - **Already Implemented / Delivered** (`Status: Delivered`, or closed in backlog/frontmatter): do not extend or split. Create a **New Story**, regardless of size — delivered scope is not reopened.
   - **Extends Existing Story**: only when the closest story is *not yet* delivered and the requirement adds a validation rule, field, or minor path within its original goal. No new row; note `Extends us-NNN` in that story's Slicing Rationale.
   - **New Story**: a new actor, a new CRUD+L lifecycle operation, a new entry trigger, or a distinct happy path not covered by an existing story.
   - **Split of Existing Story**: only when the closest story is *not yet* delivered and combining would exceed the size limit; split per `references/slicing-guidelines.md`. Never split a delivered story.
3. Apply the **Ripple Lens** (`references/slicing-guidelines.md`, Section 6, filter 3): check whether the change mutates a shared resource other stories depend on; record the affected stories in `Depends On` or add a follow-up story rather than silently invalidating them.
4. Number new stories by continuing the file-wide sequence from the highest existing `us-NNN` (IDs are unique across all epics). Never renumber or reuse an ID.

---

## Readiness Check (Lightweight DoR Gate)

Before slicing, evaluate in order and stop at the first failure:

| Check | Action If Failed |
|---|---|
| Input is a complete, signed-off elicitation session output (has `elicitation_status` frontmatter and a stated `## Next Step`) | Do not slice. State what is missing and hand back to `ba`. |
| `elicitation_status` is `COMPLETE`, or remaining gaps are explicitly accepted by the user as a stated risk | If `IN_PROGRESS` and not accepted, hand back to `ba` to close material gaps. |
| API/backend contract behavior is not the primary unresolved uncertainty | If it is, route to `clarify-api-requirements` first. |
| No competing or contradictory interpretations remain unresolved in the session | If present, hand back to `ba` to resolve the conflict. |
| **`vision-scope.md` exists** at `.agent-artifacts/requirements/output/vision-scope.md` | **For a New Epic (greenfield or first-time baseline)**: if absent, **do not slice**. Return to `ba`: _`vision-scope.md` is required before decomposition — author it from the signed-off elicitation session using `manage-requirement-artifacts` and `assets/vision-scope-template.md`, then re-invoke._ This skill does not create `vision-scope.md`. |

Proceed only when all checks pass or the user explicitly accepts a stated risk.

---

## Commercial Scope Lens (All Scope Types)

Classify every candidate story against the committed project baseline.

- **Baseline Sources**: `.agent-artifacts/requirements/output/vision-scope.md` (or raw SOW/brief in `input/`), target `epic.md` capabilities, and existing `Status` values in `functional-decomposition.md`.
- **IF no committed baseline exists (e.g., internal product team without a contract or budget commitment) THEN** set `Scope Class` to `N/A` for all rows. **ELSE** classify:
  - `In Baseline`: traces to confirmed scope in `vision-scope.md` or existing epic requirements, or elaborates an *undelivered* story within original intent.
  - `CR Candidate`: extends or reopens a *delivered* story, introduces an uncontracted third-party integration, adds an actor/workflow outside `vision-scope.md`, or exceeds agreed capability boundaries. A whole new epic can be a CR Candidate.
  - `TBD`: baseline evidence is ambiguous or undocumented. Pause and ask the user whether the item is within budget/timeline or needs a Change Request.

---

## Slicing Guidelines

Apply [`references/slicing-guidelines.md`](references/slicing-guidelines.md) as the authoritative reference for:
- The SMART evaluation framework and 5-factor complexity rubric
- The 4 sizing tripwires (per project type) and automatic split triggers
- Vertical slicing patterns (including workflow, variation, and walking-skeleton/release slicing) and architecture adaptations
- Heuristic filters (CRUD+L, Entry/Exit, Ripple, Zero/One/Many, and suggested independence between stories and epics)
- Enabler, spike, and NFR handling

---

## Workflow

1. Determine the **Scope Type**; for an Existing Epic Addition, run the **Delta Assessment**.
2. Run the **Readiness Check** against the elicitation session output.
3. Apply `references/slicing-guidelines.md` to audit candidate stories against SMART and derive slices within the size limit. Add a `Release` column only when release/MVP slicing is requested.
4. Apply the **Commercial Scope Lens** and record `Depends On` for stories affected by the Ripple Lens or by enablers/spikes.
5. Present the **Candidate Slicing Review Table** for confirmation before writing any file:

| Epic | Story ID | Story Title | Actor / Persona | User Goal | Change Type | Scope Class | Depends On | Slicing Rationale |
|---|---|---|---|---|---|---|---|---|
| | `us-NNN` (new) or `Extends us-NNN` | | | | `New Story` \| `Extends Existing Story` \| `Split of Existing Story` | `In Baseline` \| `CR Candidate` \| `TBD` \| `N/A` | | |

   IF no user is available to confirm (orchestrated or non-interactive run) THEN return the candidate table as a proposal, write no files, and state that confirmation is pending. ELSE continue.
6. On confirmation, write or update `.agent-artifacts/requirements/output/functional-decomposition.md` using `assets/functional-decomposition-template.md`. Add new rows or update existing rows inside the `<epic-slug>` section.
7. Hand off the target `<epic-slug>` section to downstream artifact-authoring skills (e.g., `manage-requirement-artifacts`, wireframe generation) for `us-*.md` files, wireframes/specifications, and parent navigation links.

---

## Anti-Bloat & Quality Rules

- **Lean columns only**: story rows carry the columns defined in the template. Detailed acceptance criteria, UI components, data schemas, and priorities are defined downstream.
- **User Goal as one sentence**: "I want <goal> so that <value>". Omit "so that <value>" only when the project's story convention excludes business value. The persona lives in the `Actor` column.
- **Evidence-based Slicing Rationale**: substantiate the size-limit compliance using the 5-factor rubric and cite the slicing pattern (e.g., `SMART: Achievable [1 view, 1 Read op, 2 rules] | Slicing: View Progression`). Generic strings like `"Sized to limit"` are forbidden.
- **No functional trees** and **no boilerplate matrices** (actors, inputs/outputs, data schemas, completeness checklists, traceability).
- **Conciseness**: a typical epic section should read in well under a minute.

---

## Output Contract (`functional-decomposition.md`)

- Use `assets/functional-decomposition-template.md` for the file skeleton and per-epic section structure.
- One file; each `<epic-slug>` is exactly one section containing exactly one user story table. Update the existing section instead of duplicating it or forking a second file.
- Every row includes story title, actor, user goal, status, and evidence-based slicing rationale.
- `Status` values: `Proposed` (written, awaiting stakeholder sign-off) | `Confirmed` | `Delivered` | `Descoped`.
- For an Existing Epic Addition, append new rows after existing ones; never renumber, delete, or reorder rows. To drop a story, set `Status: Descoped` and keep the row. When a requirement only extends an existing story, add no row; note the extension in that story's Slicing Rationale.

---

## Quality Checklist

Before handoff, confirm:
- [ ] Scope Type determined before the Readiness Check; Delta Assessment and Ripple Lens done for Existing Epic Additions.
- [ ] Single-Release Epic Cohesion: Every epic represents exactly one deliverable release milestone (zero mixing of MVP and Post-MVP stories in one epic container).
- [ ] Every story passed SMART with no tripwire hits for the project type.
- [ ] For data-driven or narrative products, concrete content datasets (levels, cases, scenarios) are explicitly sliced alongside engine mechanisms.
- [ ] Modular components or apps are phased to match active milestone consumption rather than scaffolded en masse.
- [ ] Candidate table confirmed by the user, or returned as proposal-only with no file written.
- [ ] Existing rows untouched; new IDs continue the file-wide sequence.
- [ ] Next route is stated.
