---
name: manage-requirement-artifacts
description: Use after slices are confirmed to inspect existing requirement artifacts and maintain canonical epic containers and lightweight user stories under .agent-artifacts/requirements/. Enforces the wireframe-first requirement lifecycle: do NOT generate detailed US ACs or standalone GUI specs; only generate ASCII wireframe -> signoff -> generate HTML wireframe. Do not perform decomposition or create backend API contracts.
---

# Requirement Artifact Management Skill

## Purpose & Scope

Maintain `.agent-artifacts/requirements/` as the BA delivery workbench. Manage canonical epic files (`epic.md`), lightweight user stories (`us-*.md`) without detailed ACs, and coordinate the canonical visual specification workflow:
**Generate ASCII Wireframe -> Signoff Gate -> Generate HTML Wireframe**.

> [!IMPORTANT]
> **Wireframe-First Requirement SSOT (No Detailed US ACs)**:
> - **Zero Detailed US ACs**: Do NOT generate detailed User Story Acceptance Criteria (no 3-tier Gherkin `Given/When/Then` scenarios, no semantic predicate testability matrices, no exhaustive boundary/fallback decision tables in user stories).
> - **GUI Spec Bypass**: Standalone GUI specifications (`gui-*.md`) are bypassed.
> - **Canonical Specification Pipeline**: All screen layout, component inventories, touch targets, state indicators, and interactions are specified through:
>   1. **ASCII Wireframe Generation (`wireframes/wireframe-*.md`)**: Authored first and grounded in canonical `app-design.md`.
>   2. **Signoff Gate**: Explicit user review and signoff checkpoint.
>   3. **HTML Wireframe Generation (`wireframes/wireframe-*.html`)**: Interactive HTML mockup created only after signoff, verified with screenshot visual review.
> - **Lightweight User Stories**: User stories (`us-*.md`) remain lightweight delivery and traceability containers (actor persona, user goal, business value, RAID log, pre-conditions, and direct link to the wireframe SSOT).

This skill is the **Single Source of Truth (SSOT)** for deliverable placement, artifact lifecycle, and folder indexing rules under `.agent-artifacts/requirements/output/`.

---

## Artifact Traceability & Structure Scope

This diagram illustrates the artifact relationships and indexing structure managed within `.agent-artifacts/requirements/output/`:

```mermaid
%%{init: {"flowchart": {"defaultRenderer": "elk"}}}%%
flowchart TD
    subgraph MRA_Scope ["manage-requirement-artifacts Delivery Scope"]
        EPIC["Epic Files (epic.md)"]
        US["Lightweight User Stories (us-*.md)\n(No Detailed ACs)"]
        ASCII_WF["ASCII Wireframe (wireframe-*.md)\n(Canonical Screen SSOT)"]
        SIGNOFF{"User Signoff Gate\n(ask_question)"}
        HTML_WF["HTML Wireframe (wireframe-*.html)\n(Visual Verified)"]

        EPIC --> US
        EPIC --> ASCII_WF
        US -.->|"References SSOT"| ASCII_WF
        ASCII_WF -->|"Phase 1 -> Phase 2"| SIGNOFF
        SIGNOFF -->|"Approved -> Phase 3"| HTML_WF
        HTML_WF --> EPIC
    end
```

### Incoming Handoffs:
- **From `functional-decomposition` / `functional-decomposition.md`**: Reads target `<epic-slug>` capability slices $\rightarrow$ authors `<epic-slug>/epic.md`, lightweight `us-*.md` user stories (without detailed ACs), and initiates ASCII wireframe authoring (`<epic-slug>/wireframes/wireframe-<slug>.md`). Standalone `gui-*.md` specs are bypassed.
- **From `generate-wireframe`**: Provides wireframe guidelines and scaffolding $\rightarrow$ authors ASCII wireframe first; upon user signoff, generates interactive `.html` wireframe and executes automated screenshot visual inspection.
- **From `generate-diagram`**: Receives process/state flow diagrams $\rightarrow$ embeds links into epic and lightweight user story reference tables.

### Outgoing Handoffs:
- **To `generate-wireframe`**: Invoked post-signoff to build interactive HTML wireframes and render screenshot for visual multimodal review.
- **To `clarify-api-requirements`**: When backend endpoint contracts or schemas are required.
- **To `sync-backlog`**: When backlog-ready items are ready for Jira or Azure DevOps sprint synchronization.
- **To `update-project-knowledge`**: When stable domain concepts or UI patterns distill into `.agent-artifacts/project-knowledge-base/`.

---

## Ownership (SSOT for `.agent-artifacts/requirements/`)

This skill manages files within the canonical folder hierarchy:

```text
.agent-artifacts/requirements/
|-- index.md
|-- input/                          <-- Raw client intake, briefs, tickets, screenshots
|   `-- index.md
`-- output/                         <-- Canonical delivery hierarchy (using frontmatter status: draft / refinement / signed-off)
    |-- index.md                    <-- Master index linking epics & root artifacts
    |-- vision-scope.md             <-- Overall product vision & scope
    |-- functional-decomposition.md <-- Overall capability breakdown
    |-- elicitation/                <-- Project-wide discovery notes & interview sessions
    |   |-- index.md
    |   `-- elicitation-<session-slug>.md
    `-- <epic-slug>/                <-- Epic delivery folder
        |-- epic.md                 <-- Canonical epic definition and child artifact links
        |-- elicitation-<session-slug>.md  <-- Epic discovery & Q&A notes
        |-- <user-story-id-or-slug>.md     <-- Lightweight story (No detailed ACs)
        |-- api-<api-slug>.md              <-- Optional API spec (if needed)
        |-- wireframes/
        |   |-- wireframe-<slug>.md        <-- Phase 1: ASCII Wireframe (Canonical Screen SSOT)
        |   |-- wireframe-<slug>.html      <-- Phase 3: Interactive HTML Wireframe (Post-Signoff)
        |   `-- wireframe-<slug>.png       <-- Rendered screenshot for visual review
        `-- diagrams/
            |-- diagram-<diagram-slug>.md
            `-- diagram-<diagram-slug>.bpmn
```

### Reference Guidelines & Templates
- **User Stories (Lightweight)**: `assets/user-story-template.md` & `references/user-story-guidelines.md` (detailed AC generation bypassed; points to wireframe SSOT)
- **Definition of Ready (DoR)**: `references/definition-of-ready.md` (wireframe-first DoR standards)
- **ASCII Wireframes (Canonical Screen SSOT)**: `.agents/skills/generate-wireframe/references/text-wireframe-guide.md` & Canonical Micro-App `app-design.md` specifications
- **Interactive HTML Wireframes**: `.agents/skills/generate-wireframe/references/html-wireframe-guide.md`
- **Epic Placement & Navigation**: `assets/epic-template.md` & `references/artifact-guidelines.md`
- **Vision & Scope**: `assets/vision-scope-template.md`

---

## Workflow

1. **Read Current State & Vision-Scope Gate**:
   - **Vision-Scope Prerequisite**: Before drafting any epic, story, or wireframe, check whether `.agent-artifacts/requirements/output/vision-scope.md` exists.
     - If this is a **new project** (no `vision-scope.md` present): author it now using `assets/vision-scope-template.md`, populated from the signed-off elicitation session passed by `ba`. Do not author epics or stories until `vision-scope.md` is written and confirmed.
     - If this is an **ongoing project** with an existing `vision-scope.md`: read it to establish the current scope baseline before proceeding.
   - Read the target epic folder's current `epic.md`, navigation index, and existing wireframes/stories. Note existing story IDs to continue numbering without collision.

2. **Consume Decomposed Slices & Mandatory Elicitation Gate**:
   - Read the target `<epic-slug>` section from `functional-decomposition.md` to retrieve capability slices and actor goals.
   - **Stand-Alone GUI Spec Bypass**: Skip authoring `gui-*.md` files. Screen layouts, component hierarchies, and interactive states are specified directly via wireframes.
   - **No Detailed US ACs Rule**: Do NOT draft detailed 3-tier Gherkin Acceptance Criteria or semantic testability matrices for stories.
   - **Pre-Authoring Elicitation Gate (Universal Invariant)**: Before creating or modifying any deliverable, verify that an interactive clarification batch (`ask_question`) for that specific target was presented and answered in the active conversation turn, or that the user explicitly directed `"skip elicitation"` / `"use defaults"`. If neither condition is met, HALT file creation/editing and return that target to `elicit-requirements`.

3. **Present Authoring Plan for Approval & Cadence**:
   - Before creating, editing, or overwriting any file, contribute this skill's Epic, Lightweight User Story, and Wireframe rows to the orchestrator's combined artifact plan:

   | Artifact Type | Action | Owner | File Path | What Changes / Dependency |
   |---|---|---|---|---|
   | Epic | `CREATE` \| `UPDATE` \| `NONE` | `manage-requirement-artifacts` | `<epic-slug>/epic.md` | New epic container & child artifact inventory |
   | Lightweight User Story | `CREATE` \| `UPDATE` \| `NONE` | `manage-requirement-artifacts` | `<epic-slug>/us-<id>-<slug>.md` | Delivery slice with INVEST statement & wireframe link (**NO detailed ACs**) |
   | ASCII Wireframe | `CREATE` \| `UPDATE` \| `NONE` | `generate-wireframe` / `manage-requirement-artifacts` | `<epic-slug>/wireframes/wireframe-<slug>.md` | **Phase 1**: Canonical screen hierarchy, layout, touch targets & clue placement |
   | User Signoff Gate | `GATE` | User | N/A | **Phase 2**: Mandatory signoff on ASCII wireframe before HTML wireframe generation |
   | HTML Wireframe | `CREATE` \| `UPDATE` \| `NONE` | `generate-wireframe` | `<epic-slug>/wireframes/wireframe-<slug>.html` | **Phase 3**: Interactive HTML mockup with CSS tokens & multimodal visual review |
   | GUI Specification | `NO ACTION` (Bypassed) | `manage-requirement-artifacts` | `<epic-slug>/gui-*.md` | Standalone GUI spec bypassed in favor of ASCII wireframe SSOT |

   - Do not write any file until the user confirms the combined plan and authoring cadence (**Iterative Visual Review** recommended).

3a. **Visual & Structural Specification Gate (Grounded in `app-design.md`)**:
   - Before authoring or presenting the ASCII wireframe, inspect the canonical `app-design.md` for the target micro-app under `.agent-artifacts/project-knowledge-base/solution-context/apps/<app-id>/app-design.md` (or `phone-os/app-design.md`).
   - Ground the ASCII wireframe in:
     - Exact ASCII screen layout blocks and component hierarchy.
     - Brand color palette and surface background tokens.
     - Strict touch target minimums ($\ge 44 \times 44\text{px}$ for buttons/tabs; $\ge 48\text{px}$ for search bars/inputs).
     - Apple Dynamic Island pill, split status bar, and Lucide vector SVG icons (Strict Zero-Emoji Policy).
     - Clue discovery points and forensic suspect tags.
   - Prohibit writing detailed Gherkin Given/When/Then AC scenarios in user stories; the ASCII wireframe is the sole behavioral and UI layout specification.

4. **Folder & Naming Conventions**:
   - Use stable lowercase hyphenated slugs (e.g., `epic-01-virtual-phone-app-ecosystem`, `us-001-case-schema-engine.md`, `wireframe-phone-shell-launcher.md`).
   - Store wireframes under `<epic-slug>/wireframes/`.

5. **Draft Artifacts (The 3-Phase Wireframe-First Progression)**:
   - **Lightweight User Stories (`us-*.md`)**:
     - Frontmatter with `status: draft`, `epic: <Epic Name>`, and tags.
     - Standard INVEST statement: `As a <persona>, I want <goal>, so that <value>`.
     - Structured RAID log, Pre-conditions, and Non-functional Requirements.
     - Direct pointer to the wireframe SSOT: `[ASCII Wireframe](./wireframes/wireframe-<slug>.md)`.
     - **Strictly NO detailed Gherkin Acceptance Criteria.**
   - **Phase 1: Generate ASCII Wireframe (`wireframe-*.md`)**:
     - Author `<epic-slug>/wireframes/wireframe-<slug>.md` with PRD-ready structural hierarchy, ASCII layout boxes, bracketed semantic tokens (`[Dynamic Island]`, `[Signal 5G]`), component inventories, touch target annotations, and UX interaction notes.
   - **Phase 2: User Signoff Gate**:
     - Present the completed ASCII wireframe to the user for explicit review and signoff (`ask_question`).
     - **HALT CONDITION**: Never proceed to HTML wireframe generation without explicit user approval of the ASCII wireframe.
   - **Phase 3: Generate Interactive HTML Wireframe (`wireframe-*.html`)**:
     - After signoff is granted, trigger `generate-wireframe` to scaffold `<epic-slug>/wireframes/wireframe-<slug>.html` with embedded CSS tokens and mobile container.
     - Execute the automated multimodal visual review gate: render screenshot via `render_screenshot.ps1` and visually inspect `<slug>.png` via `view_file`.

6. **Synchronize Navigation & Relative Links**:
   - Run `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/sync_indexes.ps1` to deterministically synchronize `epic.md` inventories, child indexes, and `output/index.md` without consuming LLM tokens.
   - Run `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/validate_requirements.ps1 --epic "<epic-folder-path>" --wireframe-first --terse` to verify relative link integrity, frontmatter status, and INVEST story statement compliance.

---

## Core Tooling (in `scripts/`)

Directly invoke these utilities using the exact CLI syntax below; do not inspect script source code unless diagnosing an execution error:

| Utility | Script Command | Description |
|---|---|---|
| **Index Synchronizer** | `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/sync_indexes.ps1 --root "<repo-root>"` | Auto-syncs `epic.md`, child indexes, and parent navigation with zero token cost. `--root` accepts target repository path. |
| **DoR & Link Linter** | `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/validate_requirements.ps1 --epic "<epic-folder-path>" --wireframe-first --terse` | Verifies frontmatter status, INVEST story statements, wireframe link resolution, and relative markdown links. `--wireframe-first` recognizes ASCII Wireframe SSOT and bypasses detailed Gherkin AC requirements. `--terse` emits 1-line actionable findings (`path: severity: issue`). Use `--all` for repository-wide audits. |

---

## Terse Audit Findings Protocol (Crediting `caveman-review`)

When auditing requirements, user stories, or PR deliverables, output findings in terse, 1-line format rather than verbose narrative:
- **Format**: `<file>:L<line>: <emoji> <severity>: <problem>. <fix>.`
- **Severities**: `🔴 error:` (broken links / unlinked wireframe), `🟡 warning:` (missing RAID or unpopulated placeholders), `🔵 nit:` (styling / minor copy), `❓ q:` (unresolved question).
- **Totals**: `totals: N🔴 N🟡 N🔵 N❓` or `No issues.`

---

## Artifact Boundaries

- **Owns**: Canonical epic containers (`epic.md`), lightweight user stories (`us-*.md`) without detailed ACs, ASCII wireframe coordination and linking, user signoff gate enforcement, navigation indexing.
- **Does Not Own**: Detailed US AC authoring (strictly prohibited), standalone GUI specs (bypassed), system decomposition (`functional-decomposition`), endpoint schemas (`clarify-api-requirements`), Mermaid/BPMN diagrams (`generate-diagram`), or raw HTML mockup scaffolding (`generate-wireframe`).
- Do not move deliverables to `.agent-artifacts/project-knowledge-base/` or edit raw files in `.agent-artifacts/requirements/input/`.

