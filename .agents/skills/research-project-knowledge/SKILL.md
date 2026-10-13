---
name: research-project-knowledge
description: Read-only project knowledge and external domain research for BA tasks. Use before or during elicitation and requirements writing to inspect related features, business rules, system behaviors, dependencies, change impact, external standards, or third-party APIs via web search. Implementation-code searches require explicit user confirmation.
---

# Project Knowledge Research Skill

## Purpose

Research the project knowledge base and external domain context for the current agent task and return only the context needed to proceed, including related features, system behaviors, and business rules. This skill is read-only. It must not create, edit, move, or delete files.

Use `update-project-knowledge` only after artifact work when the user confirms that durable knowledge should be updated.

## Core Rules

- Read the knowledge base before broad-scanning the workspace.
- Follow the multi-tier research fallback sequence when facts or system behaviors are incomplete:
  1. **Primary Knowledge Base**: `.agent-artifacts/project-knowledge-base/` (`index.md`, `solution-context/`, `wiki/`, `glossary/`).
  2. **Requirements Fallback**: `.agent-artifacts/requirements/` folder (`.agent-artifacts/requirements/input/` raw client material and `.agent-artifacts/requirements/output/` initiative/epic/story hierarchy).
  3. **Implementation & Codebase Fallback (User-Confirmed)**: Search implementation artifacts (source code, database schemas, API routes, ETL scripts, config files) **only after asking the user for confirmation**.
  4. **External & Web Standards Research**: Search the web (using `search_web` or web search tools) when research questions involve third-party integrations, public API specifications, regulatory/compliance standards (GDPR, HIPAA, PCI-DSS), or industry best practices not captured in local project artifacts.
- **Ignore In-Flight Deliverables**: Never treat artifacts with frontmatter `status: draft` or `status: refinement` (such as in-flight elicitation sessions or unconfirmed user stories) as durable project facts or confirmed baseline evidence. Only `status: signed-off` deliverables represent confirmed project requirements.
- Start from indexes and progress to detail files only when relevant.
- Explicitly trace and relate existing **features**, **system behaviors**, **business rules**, and **state transitions** relevant to the target task.
- Use specified `.agent-artifacts/requirements/input/` files for source evidence and citations.
- Do not treat generated delivery output as durable project wiki unless its file or source says it is confirmed or the user confirms it.
- Do not invent missing facts. Report gaps as open questions or assumptions, specifying which fallback tier was used.

## Research Order & Fallback Strategy

Execute research according to the target task type defined in **Task Routing**, progressing through this fallback sequence:

1. **Tier 1 — Primary Knowledge Base**: Search `.agent-artifacts/project-knowledge-base/` (`index.md`, `solution-context/`, `wiki/`, `glossary/`).
2. **Tier 2 — Requirements Fallback**: If Tier 1 context is missing or incomplete, search `.agent-artifacts/requirements/` (`.agent-artifacts/requirements/input/` raw intake and `.agent-artifacts/requirements/output/` initiative/epic/story hierarchy). Skip in-flight deliverables with `status: draft` or `status: refinement`.
3. **Tier 3 — Codebase & Implementation Evidence (Requires User Confirmation)**: If Tiers 1 & 2 lack technical context or require behavioral verification, **prompt and ask the user whether they want you to research the codebase too** before searching application code, database schemas/migrations, API contracts, ETL data pipelines, configuration files, or low-code definitions in `src/`, `app/`, `db/`, `api/`, `pipelines/`, `configs/`.
   - If user confirms: proceed with focused codebase search in the relevant directories.
   - If user declines or skips: proceed with research findings from Tiers 1 & 2, logging remaining technical gaps as assumptions or open questions.
4. **Tier 4 — External & Web Standards Research**: If the requirement depends on external systems, third-party vendor APIs, industry standards, or regulatory frameworks not documented locally, execute targeted **web searches** (via `search_web` / `read_url_content`). Cite external URLs and specifications directly in the research packet.

Stop at the earliest tier that provides sufficient evidence. If no relevant facts exist across available tiers, report what was checked and proceed relying on direct user input and explicitly labeled assumptions.

## Targeted Research During Elicitation

This skill may be invoked repeatedly during one elicitation session when a concrete research question emerges. It is not limited to the initial project-context pass. Use it for questions such as:

- What existing epics, stories, screens, flows, or integrations could this change affect?
- Is there an existing business rule, validation, permission, calculation, or lifecycle state that is similar or inconsistent?
- What documented behavior, source of truth, dependency, or state transition must the proposed feature fit?
- Does the change mutate a shared resource or create a downstream impact for in-flight or future work?

For each targeted request:

1. State one bounded research question and its target epic, feature, entity, rule, or artifact.
2. Search Tier 1 and then Tier 2 only for evidence relevant to that question. Do not restart a full project scan or repeat the PACT baseline unnecessarily.
3. Stop at the earliest sufficient tier and return the evidence, source paths, apparent conflicts, and remaining gaps.
4. If documented evidence is insufficient and current implementation behavior is needed, explicitly ask the user to confirm a focused Tier 3 codebase search before performing it. The initial permission to research project context does not imply permission to inspect implementation code.
5. Distinguish **observed current behavior** from **confirmed intended behavior**. Existing code or documentation may describe a defect, legacy rule, or accidental behavior; never silently convert it into a requirement.
6. Return the findings to the calling agent so it can present the evidence and ask the user to confirm whether the observed rule is intended, should change, or should be treated as a risk/open question.

Record the targeted research question, files actually read, and resulting confirmed fact, assumption, risk, decision, or open question in the authoritative elicitation session. Do not create a separate research artifact unless the user explicitly requests one.

## Workspace Folder Structure Reference

```text
.agent-artifacts/
|-- sprint-scope/                   <-- Sprint scope records (sprint-N.md)
|-- requirements/
|   |-- index.md
|   |-- input/                      <-- Raw client intake, briefs, tickets, screenshots
|   |   `-- index.md
|   `-- output/                     <-- Generated BA deliverables (Tier 2 search)
|       |-- index.md
|       |-- vision-scope.md
|       |-- functional-decomposition.md
|       |-- elicitation/            <-- Project-wide discovery notes
|       `-- <epic-slug>/
|           |-- index.md
|           |-- elicitation-<slug>.md
|           |-- <user-story-id-or-slug>.md
|           |-- gui-<screen-slug>.md
|           |-- api-<api-slug>.md
|           |-- wireframes/
|           `-- diagrams/
`-- project-knowledge-base/
    |-- index.md
    |-- wiki/                       <-- Durable scope, stakeholders, delivery, risk, UX flows
    |   |-- index.md
    |   |-- diagrams/               <-- Shared cross-area diagrams & visual models
    |   `-- <knowledge-area>/
    |       |-- index.md
    |       `-- diagrams/           <-- Area-specific diagrams
    |-- solution-context/           <-- Technical/domain/system/API/data/screen context
    |   `-- index.md
    `-- glossary/                   <-- Terms, acronyms, definitions
        `-- index.md
```

## Task Routing

Follow the 3-tier research fallback progression for each specific task type:

| Task | Tier 1: Primary KB | Tier 2: Requirements Fallback | Tier 3: Codebase & Implementation Evidence (On User Confirmation) |
|---|---|---|---|
| **Elicitation** | `.agent-artifacts/project-knowledge-base/wiki/` (scope/stakeholders), `solution-context/` (domain/systems) | Specified `.agent-artifacts/requirements/input/` files, `.agent-artifacts/requirements/output/` | Technical architecture specs, environment configs, repository structures |
| **Requirements Analysis** | `.agent-artifacts/project-knowledge-base/solution-context/` (behavior/API/data), `wiki/` (scope/risk) | Specified `.agent-artifacts/requirements/input/` files, related `.agent-artifacts/requirements/output/<epic-slug>/` | Business rules in code/scripts/pipelines, validation logic, API route handlers |
| **API / Data Requirements** | `.agent-artifacts/project-knowledge-base/solution-context/` (systems, APIs, schemas, integrations) | `.agent-artifacts/requirements/output/.../api-*.md`, input files | API controllers, DTOs, OpenAPI specs, SQL schemas, ETL pipelines |
| **User Story Drafting** | `.agent-artifacts/project-knowledge-base/solution-context/` (UI/API behavior), `wiki/` | Target epic folder (`.agent-artifacts/requirements/output/<epic-slug>/epic.md`), parent navigation `output/index.md` | Implementation contracts, entity schemas, state/event handlers, service interfaces |
| **GUI / Wireframe** | `.agent-artifacts/project-knowledge-base/solution-context/` (screens, workflow, permissions), `wiki/` (brand guidelines, UX flows, `wiki/diagrams/`) | Target story/epic wireframes (`wireframe-*.html/md`) & GUI specs (`gui-*.md`) | UI components, page templates/views, layout structures, screen route definitions |
| **Diagram** | `.agent-artifacts/project-knowledge-base/solution-context/` (actors, systems, data flow), `wiki/` (process flows, `wiki/<area>/diagrams/`) | Target story/epic diagrams (`diagram-*.md/bpmn`) & input diagrams | Workflow state machines, event handlers, ETL/service data pipelines, DB ERDs |





## Output Packet

Return a concise research packet to the calling agent:

```markdown
## Knowledge Research Packet

### Research Scope
- **Question:** The bounded question this research answers.
- **Tiers searched / stopping reason:** What was searched and why research stopped.
- **Implementation search:** `Not requested` | `Confirmed` | `Declined`.

### Files Read & External Web Sources
- `path or URL` - why it was inspected or referenced

### Related Features & Functional Scope
- **Existing Features & Modules:** Identified capabilities, feature areas, and related epic/story boundaries with source path.
- **Cross-Feature Dependencies:** Upstream/downstream feature dependencies or integration points with source path.

### Confirmed System Behaviors & Business Rules
- **System Behaviors:** State transitions, automated triggers, background operations, and API/screen behaviors with source path.
- **Business Rules & Constraints:** Validation rules, decision criteria, calculation formulas, and policy constraints with source path.

### Confirmed PACT Facts
- **People (P):** Identified user roles, permissions, accessibility, and personas with source path.
- **Activities (A):** Workflows, SLAs, task triggers, and execution frequency with source path.
- **Context (C):** Environmental, security, and regulatory compliance bounds (GDPR/HIPAA/PCI) with source path.
- **Technologies (T):** APIs, platforms, database schemas, and hardware constraints with source path.

### Identified Gaps (Features, Behavior & PACT)
- Unmentioned, incomplete, or unconfirmed features, behaviors, business rules, or PACT pillars requiring user elicitation or validation.

### Applicable Assumptions & Open Questions
- Assumption and why it is not confirmed.
- Question and impact on scope or estimation.
```

If no relevant KB content exists, state:

```text
No relevant project knowledge-base content was found for this task. Proceeding must rely on current user input and clearly labeled assumptions.
```

## Subagent Delegation & Output Protocol (Crediting `cavecrew` & `caveman`)

When delegating research, exploration, or codebase scanning to subagents (e.g. `@Explore` or specialized scout agents), enforce compressed output contracts to protect main orchestrator context window longevity:

### 1. Compressed Output Contract (`cavecrew` Pattern)
For all factual discovery, file locating, symbol searches, and rule extraction, subagents must return terse, structured results:
```text
<Topic / Target Area>:
- [file.md:L12-L24](file.md#L12-L24) — `entity/symbol/rule` — concise factual note
totals: <counts>. dependencies: <list>. risks: <list>.
```
Subagents must omit conversational preambles ("I found several files...", "Let's inspect..."), hedging, and tool announcements.

### 2. The Cavecrew Golden Rule (Quality & Depth Safeguard)
- **Factual & Structural Search (Use Cavecrew Compressed Mode)**: For "where is X defined?", "list all rules governing Y", "trace API payload fields", or "identify caller dependencies". Zero information loss, ~60–70% context token reduction into the main thread.
- **Architectural Trade-Off Analysis (Use Vanilla Prose Mode)**: Only when the research task explicitly demands evaluating competing architectural alternatives, nuanced stakeholder trade-offs, or ambiguous business policies where full analytical prose and narrative rationale are required.

## Core Tooling (in `scripts/`)

Directly invoke these utilities using the exact CLI syntax below (fallback to `.github/skills/research-project-knowledge/scripts/` in Copilot workspaces); do not inspect script source code unless diagnosing an execution error:

| Utility | Script Command | Description |
|---|---|---|
| **Hybrid & Semantic Search** | `powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 "<query>" [--mode hybrid\|exact\|wildcard\|semantic] [--tier 1\|2\|all] [--json]` | High-speed hybrid search combining exact matching, wildcard globbing (`US-*`, `*epic*`), and semantic BM25 relevance scoring with domain synonym expansion. |
| **Parallel "Full Picture" Search** | `powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 "<q1>" "<q2>" ... --parallel [--json]` | Executes multi-query searches concurrently across worker threads, waiting for all searches to complete to aggregate, deduplicate, and synthesize the 360° "full picture". |
| **Catalog Entity Listing** | `powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 --list-entities [--tier 1\|2\|all] [--json]` | Instantly discovers and catalogs all recognized epics, stories, glossary definitions, and solution-context systems across the repository. |

### Search Modes & Strategy Guidance

- **Wildcard Search**: Use glob wildcards (`*`, `?`) when looking for identifier families or prefixes (e.g., `US-*`, `*auth*`, `api-*`).
- **Semantic BM25 Search**: Set `--mode semantic` or use default `--mode hybrid` for conceptual inquiries (e.g., `"user role permissions"`, `"payment processing transaction"`). The engine automatically leverages domain concept expansion and TF-IDF/BM25 relevance ranking.
- **Parallel Multi-Query ("Full Picture")**: When researching a requirement with multiple facets (e.g., People, Activities, Technologies), pass all queries in one invocation:
  ```bash
  powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 "actor roles" "checkout workflow" "payment gateway" --parallel --json
  ```
  The tool dispatches all queries across background worker threads, waits until every search completes, and aggregates results into a unified `full_picture` payload to ensure no facet is missed.

## Boundaries

- **Read-Only**: Do not create, edit, or delete files. Do not modify `.agent-artifacts/project-knowledge-base/` (use `update-project-knowledge` for updates).
- **Ignore In-Flight Deliverables**: Never treat requirement artifacts with `status: draft` or `status: refinement` as confirmed project knowledge evidence.
- **Codebase Search Confirmation**: Never scan or search project implementation codebases (Tier 3) without explicitly prompting and obtaining confirmation from the user first.
- **No Deliverables or Direct Elicitation**: Do not write final BA artifacts (stories, GUI specs, diagrams) or engage in user elicitation; return structured research findings and gaps to the calling agent.
- **Structured Fallback Execution**: Follow the 4-tier fallback sequence rather than unguided workspace scanning.




