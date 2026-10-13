# User Story Guidelines

Read this file only when creating or refining user stories, acceptance criteria, or backlog-ready story Markdown files.

## Purpose And Ownership

- Purpose: define a backlog-ready behavior slice with plain English acceptance criteria.
- Owner: `manage-requirement-artifacts`.
- Location: `.agent-artifacts/requirements/output/<epic-slug>/<story-id-or-slug>.md`.
- Must include: minimal frontmatter, role and goal (`As a <role>, I want <goal>`), plain English acceptance criteria (numbered or bulleted clear behavioral conditions), canonical wireframe reference, out of scope, non-functional requirements, and open questions.
- Excluded / Prohibited:
  - **No Gherkin**: Fenced ````gherkin```` blocks, Given/When/Then keywords, and 3-tier Gherkin layering are strictly prohibited.
  - **No Business Value**: "so that" clauses are omitted from the story statement.
  - **No RAID Logs**: In-story RAID logs are removed.
  - **No Pre-conditions**: Pre-condition tables are removed.
  - **No Standalone GUI Specs**: `gui-*.md` specs are bypassed in favor of the canonical wireframe pipeline (`ASCII wireframe -> User signoff -> HTML wireframe`).

## Output Contract & Metadata

Every generated user story Markdown file must begin with compatible YAML frontmatter:

```yaml
---
type: Requirement Story
epic: <Epic 1 - Epic Name>
status: draft
description: <One-sentence behavior summary>
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

Place related wireframes under `./wireframes/` and related diagrams under `./diagrams/`. Link to them with relative links such as `./wireframes/wireframe-order-detail.md`, `./wireframes/wireframe-order-detail.html`, or `./diagrams/diagram-order-approval-flow.md`.

## Writing Workflow & Quality Standards

1. Consume the pre-sliced story definition, actor role, and goal from `functional-decomposition.md` (or slicing handoff).
2. Draft the story using `assets/user-story-template.md`. State the story as `As a <user role>, I want <goal>`.
3. Author plain English Acceptance Criteria (numbered or bulleted list of observable behavioral conditions).
4. Direct Visual SSOT Reference: Link to the canonical ASCII wireframe (`./wireframes/wireframe-<slug>.md`) and post-signoff HTML wireframe (`./wireframes/wireframe-<slug>.html`).
5. Authoritative & Concise Delivery: Write direct, high-density statements without conversational narrative, meta-commentary, or Gherkin syntax.

---

## Acceptance Criteria Standards (Plain English)

Acceptance criteria must be written in **clear, concise plain English** as numbered or bulleted behavioral statements.

### Quality Standards for Plain English ACs:
1. **Observable & Testable**: State exact observable behavior and system response (e.g., "Tapping the app tile launches the corresponding app view within 100ms").
2. **Error & Boundary Specificity**: Specify exact user-facing error copy when reporting validation or business rule failures (e.g., 'If the pin code is incorrect, display error toast: "Mã PIN không đúng."').
3. **No Gherkin**: Do not use `Given / When / Then / And` keywords or fenced ````gherkin```` blocks.
4. **Comprehensive Scenarios**:
   - Primary nominal success flow.
   - Alternative and boundary conditions (zero/empty inputs, maximum limits).
   - Validation failure and business logic blocks.
   - Security/permission restrictions and technical failure states.

---

## Wireframe And Diagram Traceability

- Link every related wireframe or US-level diagram from the story body using a relative Markdown link.
- Put US-related wireframes in the story epic's `wireframes/` folder and US-related diagrams in the story epic's `diagrams/` folder.
- Canonical screen delivery pipeline:
  1. **Phase 1: ASCII Wireframe (`wireframes/wireframe-<slug>.md`)** — Canonical screen SSOT grounded in `app-design.md`.
  2. **Phase 2: User Signoff Gate** — Explicit user approval checkpoint.
  3. **Phase 3: Interactive HTML Wireframe (`wireframes/wireframe-<slug>.html`)** — Generated post-signoff with screenshot review.

---

## Story Quality Checklist & Definition of Ready (DoR)

Before saving or certifying any user story file, verify against the authoritative [Definition of Ready (DoR)](./definition-of-ready.md) and this quality checklist:

- [ ] **Specific & Streamlined**: Story role and goal follow `As a <user role>, I want <goal>` (no business value clause). Title uses hyphen separator (`US-XXX - Title`).
- [ ] **Plain English ACs**: Acceptance criteria are numbered or bulleted plain English behavioral statements (zero Gherkin).
- [ ] **Exact Error Copy**: Validation rules and exceptions quote exact user-facing messages.
- [ ] **Independent & Small**: Story is sliced to fit within 1 sprint (<= 1 week) without blocking dependencies.
- [ ] **No RAID Log or Pre-conditions**: Cleanly omitted from the story body.
- [ ] **Canonical Wireframe Linked**: Points directly to the ASCII wireframe and post-signoff HTML wireframe.
- [ ] **Epic Synced**: Story is listed in parent `<epic-slug>/epic.md`.

