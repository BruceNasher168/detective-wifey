# User Story Guidelines

Read this file only when creating or refining user stories, acceptance criteria, or backlog-ready story Markdown files.

## Purpose And Ownership

- Purpose: define a backlog-ready behavior slice with acceptance criteria.
- Owner: `manage-requirement-artifacts`.
- Location: `.agent-artifacts/requirements/output/<epic-slug>/<story-id-or-slug>.md`.
- Must include: minimal frontmatter, role, goal, value, RAID log (Risks, Assumptions, Issues, Dependencies), preconditions, flow summary, GUI/API/detail references when relevant, 3-tier Gherkin acceptance criteria, open questions, and citations when available.
- Avoid: full UI field dictionaries, full screen component tables, raw endpoint payloads, or generic filler.

## Output Contract & Metadata

Every generated user story Markdown file must begin with compatible YAML frontmatter:

```yaml
---
type: Requirement Story
epic: <Epic 1 - Epic Name>
status: draft
description: <One-sentence behavior/value summary>
tags: [requirement, user-story]
timestamp: <ISO-8601 timestamp>
---
```

Rules:
- Keep `type: Requirement Story`.
- Always include `requirement` and `user-story` in tags.
- Add only relevant optional technical/domain tags such as `api`, `screen`, `frontend`, `backend`, `workflow`, `validation`, `permission`, `data`, `integration`, `reporting`, or `notification`.
- Keep the full user story content in the Markdown body. Frontmatter is metadata, not a replacement for story sections.

## Template

Use `assets/user-story-template.md` for the story body.

Place each user story in:

```text
.agent-artifacts/requirements/output/<epic-slug>/<user-story-id-or-slug>.md
```

Prefer the story ID in the filename when available, for example `us-001-customer-login.md`.

Place related GUI specification files in the same epic folder as the user story. Place related wireframes under `./wireframes/` and related diagrams under `./diagrams/`. Link to them with relative links such as `./gui-order-detail.md`, `./wireframes/wireframe-order-detail.html`, or `./diagrams/diagram-order-approval-flow.md`.

## Writing Workflow & Quality Standards

1. Consume the pre-sliced story definition, actor role, and goal from `functional-decomposition.md` (or slicing handoff). Determine the GUI Spec CRUD Action and any GUI/API links yourself when the story involves a screen or endpoint — `functional-decomposition.md` does not carry them.
2. Draft the story using `assets/user-story-template.md`. Apply 3-tier Gherkin ACs, quote-delimited user-facing error copy, and the 6-column RAID log.
3. Authoritative & Concise Delivery: Write direct, high-density story statements and Gherkin ACs without conversational narrative or meta-commentary.

---

## Acceptance Criteria Standards

Write concise acceptance criteria in Gherkin format, organized progressively across 3 core tiers:

1. **Tier 1 (Core Functional Journeys)**: Primary nominal success flow, valid alternative user workflows, and entry variations (`**AC 1**: <Title>`).
2. **Tier 2 (Business Rules & Boundary Conditions)**: Form validation summary (`**AC 2**: Form Input Validation`) and distinct business rule failure scenarios (`**AC 3**: <Title>`).
   - **Form Field Validation (UI Level)**: Summarize in a single AC and link to the GUI specification (e.g., `Then the system blocks submission and displays field validation errors per the linked [GUI Specification](./gui-screen-name.md)`). Field-level regex and character bounds live in the GUI Spec table.
   - **Business Rule Failures**: For business logic blocks (e.g., duplicate record, limit exceeded, promo restriction), provide dedicated ACs specifying exact, quote-delimited user-facing error copy:
     - *Duplicate*: `Then the system displays error: "An account with this email already exists."`
     - *Business Limit*: `Then the system blocks transfer and displays: "Transfer amount exceeds daily limit of $5,000.00."`
3. **Tier 3 (Security, State & Technical Exceptions)**: Authorization restrictions, invalid lifecycle state transitions, or backend service failures (`**AC 4**: <Title>`).
   - **Permission / Auth**: `Then the system displays: "You do not have permission to approve orders exceeding $10,000."`
   - **Invalid State**: `Then the system prevents cancellation and displays: "Order #1024 has already shipped and cannot be cancelled online."`
   - **Backend / Async Failure**: `Then the system displays toast: "Unable to sync with inventory service. Please try again."`

### Formatting & Syntax (Machine-Executable for AI-SDD)
- **Prefix & Title**: Prefix each criterion with a bold ID followed by a colon and descriptive title (e.g., `**AC 1**: <Title>`). Omit bracketed category tags.
- **Progressive Numbering**: Number ACs sequentially in a single progressive sequence (`AC 1`, `AC 2`, `AC 3`, `AC 4`...).
- **Multiple Scenarios under an AC**:
  - **Single Scenario (Default)**: By default, each AC contains one primary `Given / When / Then` block.
  - **Multiple Scenarios (Allowed for Rule Variants & Boundaries)**: When a single business rule has multiple concrete testable branches (e.g., within boundary vs exceeding boundary, or role-based variations of the same rule), use progressive decimal sub-numbering (`**AC 3.1**: <Variant A>`, `**AC 3.2**: <Variant B>`). Do not combine distinct business rules under one AC.
- **Clean `gherkin` Code Block**: Enclose each scenario inside a clean fenced ```gherkin code block containing only the `Given`, `When`, `Then`, and `And` steps. Omit redundant `Scenario: <Title>` lines since the AC header already defines the scenario.
- **Exact Error Copy**: Never use vague placeholders like *"displays an error message"*. Always specify the exact quote-delimited user-facing text in `Then` statements.
- **Deterministic Assertions**: Ensure all `Then` statements are strictly testable and deterministic (state transitions, exact copy, UI element visibility, response codes) without subjective adjectives (e.g., "fast", "clean", "properly").

### Edge Case & Heuristic Mapping (ZOMBIES, CRUD+L, Entry & Ripple)

Map analysis heuristics cleanly into the 3-tier AC structure and linked specs without story bloat:

- **ZOMBIES**:
  - **Z – Zero (Empty/0)**: UI null/empty regex validation stays in linked [GUI Spec](./gui-screen-slug.md). Business zero blocks ($0 cart, 0 balance) live in **Tier 2 ACs**.
  - **O – One**: Primary success path lives in **Tier 1 AC**.
  - **M – Many**: List rendering/pagination stays in GUI Spec; bulk actions slice into separate stories.
  - **B – Boundaries**: Business limits/caps live in **Tier 2 ACs** with exact error copy. Field length bounds stay in GUI Spec.
  - **I – Interfaces**: Technical payloads/schemas belong in linked `./gui-*.md` or `./api-*.md`.
  - **E – Exceptions**: Security, invalid state, or service failures live in **Tier 3 ACs**.
  - **S – Simple**: Enforce $\le 1$ week scope per story.
- **CRUD+L State Conflicts**:
  - Capture state conflict errors when attempting actions on archived, suspended, expired, or locked entities in **Tier 3 ACs** (e.g., `**AC 4.1**: Block Edit on Archived Record`).
- **Entry & Ripple System Dynamics**:
  - **Multiple Entry Points**: Capture trigger variations (Main Nav vs Deep Link vs Quick Action) in Preconditions and **Tier 1 sub-scenarios** (e.g., `**AC 1.1**: Standard Nav Flow`, `**AC 1.2**: Deep Link with Auth Redirect`).
  - **Cascading Invalidation**: Capture side-effects where changing one variable invalidates another in **Tier 2 ACs** (e.g., changing shipping country resets shipping method and re-evaluates promo code eligibility).
  - **State Locks & Snapshot Rules**: Capture mutation restrictions on shared resources in **Tier 3 ACs** (e.g., block currency edit if pending transfers exist).

---

## Boundary With Detailed Specs

User stories own:

- Story title and value statement
- User role or persona
- Business goal and expected outcome
- Preconditions and dependencies
- Flow summary
- Acceptance criteria and Gherkin scenarios (including exact error messages for business rules and state exceptions)
- References to relevant mockups, wireframes, GUI specs, API specs, or diagrams

System details owned by specialist skills / guidelines:

- Detailed UI field dictionaries, individual regex patterns, character limits, component visual states, and default values belong in GUI Specifications (`gui-<screen-slug>.md` per `references/gui-specification-guidelines.md`).
- Endpoint schemas, database mappings, request/response payloads, technical error codes, and serialization rules belong in `clarify-api-requirements`.

## Screen Enhancement Stories (Modifying Existing Screens)

When a User Story is an **enhancement** to an existing screen (e.g., adding a field, modifying a dropdown, changing a button state):

1. **In the User Story**:
   - **Specify the Enhancement Scope**: Clearly name the specific field/element being added or modified in the Story Title, Goal, and Flow Summary (e.g., *"Adds optional 'Tax ID' field to Billing Section"*).
   - **Link to the GUI Spec**: In the `Screen / GUI Specification References` table, explicitly state the *Story-Relevant Behavior* using the functional field/component name (e.g., *"Adds Tax ID field & updates submit payload"*).
   - **Keep ACs Behavior-Level**: Refer to the new field by business behavior, delegating field validation regex/character limits to the GUI Spec.

2. **In the GUI Specification (`gui-<screen-slug>.md`)**:
   - **Update Cumulative Table**: Add or modify the specific component row in the existing GUI Spec table, including its validation rules and exact error messages.
   - **Append Screen Change Log**: Add a row recording which User Story ID changed which screen element.

## GUI Specification Traceability

- Link every affected GUI specification from the story's `Screen / GUI Specification References` section.
- When a user story changes a screen, make sure the related GUI spec's `Screen Change Log` includes the story link.

## Wireframe And Diagram Traceability

- Link every related wireframe or US-level diagram from the story body using a relative Markdown link.
- If `generate-diagram` was triggered before or during story work, or the user mentions a diagram while asking for the user story, the story must reference the related diagram file.
- Put US-related wireframes in the story epic's `wireframes/` folder and US-related diagrams in the story epic's `diagrams/` folder.
- Put cross-epic or initiative-level wireframes and diagrams in the initiative folder, then link to them from the relevant story or `epic.md` using the correct relative path.
- Use stable filenames and folder-aware links such as `./wireframes/wireframe-order-detail.html`, `./wireframes/wireframe-order-detail.md`, or `./diagrams/diagram-order-approval-flow.md`.
- If a wireframe or diagram spans multiple epics, do not place it under one epic by default; ask whether it should be initiative-level or which epic owns it.
- When creating or updating a story because of a wireframe or diagram, add or refresh the story's reference link to that artifact.

## Story Quality Checklist & Definition of Ready (DoR)

Before saving or certifying any user story file, verify against the authoritative [Definition of Ready (DoR)](./definition-of-ready.md) and this quality checklist:

- [ ] **Specific**: Story role, goal, and business value are unambiguous. Title uses hyphen separator (`US-XXX - Title`).
- [ ] **Measurable & Testable**: Acceptance criteria use 3-tier Gherkin format with explicit expected outcomes.
- [ ] **Deep Validation & Error Specificity**: Every validation rule, business exception, and backend failure branch explicitly quotes its distinct user-facing error message.
- [ ] **Independent & Small**: Story is sliced to fit within 1 sprint (<= 1 week) without blocking dependencies. No pure technical tasks.
- [ ] **No AC Bloat**: Form field dictionaries are delegated to GUI specifications (`gui-*.md`), while story ACs capture business-level outcomes and messages.
- [ ] **Heuristic Scoping Applied**: ZOMBIES, CRUD+L exceptions, Entry multi-triggers, and Ripple downstream effects mapped cleanly across tiers without story bloat.
- [ ] **RAID Log & Governance**: Risks, assumptions, issues, and dependencies are categorized with explicit impact, owner, and resolution status.
- [ ] **Traceable & Ready**: Affected GUI/API specs, wireframes, and diagrams are linked with relative Markdown links.
- [ ] **Epic Synced**: Story is listed in parent `<epic-slug>/epic.md` and the navigation `output/index.md`.
