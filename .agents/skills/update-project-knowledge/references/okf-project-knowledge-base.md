# OKF Project Knowledge Base Contract

Use OKF as a lightweight file contract, not as a rigid information architecture.

This reference owns the reusable framework rules for the starter `.agent-artifacts/project-knowledge-base/` and sibling `.agent-artifacts/requirements/` folders. Keep project-specific facts inside the project folders; keep framework rules here in the skill.

## Adopted OKF Practices

- A bundle is a directory tree of Markdown files.
- Each normal concept file starts with YAML frontmatter.
- `type` is required for concept files.
- `title`, `description`, `resource`, `tags`, and `timestamp` are recommended when useful.
- `log.md` records material updates.
- Markdown links express relationships between concepts.
- Citations should appear under `# Citations` when content is derived from sources.

## Workspace Adaptation

Outsourcing project knowledge bases usually need these concept families:

- Requirement hierarchy files under epics and user stories, owned by requirements/artifact agents.
- Solution context: domains, systems, modules, APIs, integrations, data, screens, and environments.
- Wiki: durable project wiki for user personas, system specifications, engagement, stakeholders, ownership, scope boundaries, assumptions, exclusions, dependencies, delivery model, acceptance, handover, support, decisions, and risks.
- Requirements, epics, user stories, and BA artifact references.
- Decisions and rationale.
- Integrations and dependencies.
- Data entities, source-of-truth notes, and mappings.
- Delivery, dependency, acceptance, support, compliance, and commercial risks.
- Glossary terms.
- Source evidence stored under `.agent-artifacts/requirements/input/`.

## Folder Structure

```text
.agent-artifacts/
|-- sprint-scope/
|-- project-knowledge-base/
|   |-- log.md
|   |-- README.md
|   |-- solution-context/
|   |-- wiki/
|   |   |-- diagrams/
|   |   |-- knowledge-area-1/
|   |   |   `-- diagrams/
|   |   `-- knowledge-area-2/
|   |       `-- diagrams/
|   `-- glossary/
`-- requirements/
    |-- input/
    `-- output/
        |-- vision-scope.md
        |-- functional-decomposition.md
        |-- elicitation/
        `-- <epic-slug>/
            `-- <user-story-id-or-slug>.md
```

Add more directories only when there is actual project knowledge to store.

## Directory Guide

| Directory                                                  | Use For                                                                                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.agent-artifacts/requirements/`                                          | Delivery workbench for raw requirement intake and generated BA deliverables.                                                                                           |
| `.agent-artifacts/project-knowledge-base/README.md`                       | Overview guide for using and maintaining the project knowledge base.                                                                                                   |
| `.agent-artifacts/project-knowledge-base/solution-context/`               | Domains, systems, integrations, APIs, data, and technical context needed to understand requirements.                                                                   |
| `.agent-artifacts/project-knowledge-base/wiki/`                           | Durable project wiki organized into placeholder knowledge areas such as `knowledge-area-1/` and `knowledge-area-2/`, renamed to project-specific topics when known. Stores persisted specs including user personas (`wiki/personas.md`), system landscape, and business rules. |
| `.agent-artifacts/project-knowledge-base/wiki/diagrams/`                  | Shared copies of relevant requirement diagrams used by multiple wiki areas. Keep originals in`.agent-artifacts/requirements/` and cite the original path.                             |
| `.agent-artifacts/project-knowledge-base/wiki/<knowledge-area>/diagrams/` | Area-specific copied diagrams used by pages in that knowledge area.                                                                                                    |
| `.agent-artifacts/project-knowledge-base/glossary/`                       | Terms, acronyms, synonyms, and naming conventions.                                                                                                                     |
| `.agent-artifacts/requirements/input/`                                    | Raw source evidence such as briefs, tickets, screenshots, links, copied excerpts, and source metadata.                                                                 |

## Concept File Rules

Every normal `.md` concept file should start with frontmatter:

```yaml
---
type: Scope Boundary
title: Example Scope Boundary
description: One-sentence summary.
tags: [project, scope]
timestamp: 2026-07-09T00:00:00Z
---
```

Required:

- `type`: concept category used by humans and agents for routing.

Recommended:

- `title`: human-readable name.
- `description`: one-sentence summary for previews and frontmatter metadata.
- `tags`: short cross-cutting labels.
- `timestamp`: last meaningful update in ISO 8601 format.

## Authoring Rules

- Do not invent project facts.
- Do not invent client commitments, estimates, commercial terms, contractual scope, delivery responsibilities, acceptance criteria, or support obligations.
- Keep confirmed facts, assumptions, decisions, risks, dependencies, exclusions, and open questions separate.
- Prefer one concept per stable knowledge unit.
- Link related concepts with bundle-relative links such as `/solution-context/core-api.md`.
- Put long evidence, raw source references, screenshots, copied excerpts, and source metadata in `.agent-artifacts/requirements/input/` and link to those files from durable concepts.
- Copy relevant diagrams from supplied requirement folders into the wiki when they support understanding. Use `.agent-artifacts/project-knowledge-base/wiki/<knowledge-area>/diagrams/` for area-specific diagrams and `.agent-artifacts/project-knowledge-base/wiki/diagrams/` for cross-area diagrams. Do not move, edit, or delete the original requirement diagram.
- Do not create standalone directory index files; concepts are navigated directly via meaningful filenames and relative cross-links.
- Use `project-summary.md` or dedicated wiki documents for overall project descriptions and high-level requirements.
- Use each requirement epic folder `epic.md` as the canonical epic page.
- Add `# Citations` when claims depend on source material.

## Research Order For BA Deliverables

When producing BA deliverables, research in this order:

Use only user-specified or calling-agent-supplied input paths from `.agent-artifacts/requirements/input/`. If no input path or source material is specified and the task depends on source evidence, ask which input to use; do not scan the whole input folder to discover it.

1. Open `.agent-artifacts/requirements/output/<epic-slug>/` only for related generated requirement knowledge.
2. Open `.agent-artifacts/project-knowledge-base/solution-context/` only when the deliverable depends on domain rules, systems, APIs, integrations, data, screens, or technical ownership.
3. Open `.agent-artifacts/project-knowledge-base/wiki/` only when the deliverable depends on scope boundaries, assumptions, exclusions, stakeholders, acceptance, risk, handover, support, or delivery commitments.
4. Use specified `.agent-artifacts/requirements/input/` files for source evidence and citations.
5. Artifact-owning agents or skills write generated BA deliverables to `.agent-artifacts/requirements/output/`.

Do not make agents read project governance folders by default for every requirement task.

## Delivery Vs Wiki Rule

- Use top-level `.agent-artifacts/requirements/` as the delivery workbench: raw client inputs go in `.agent-artifacts/requirements/input/`; generated BA deliverables, specs, epics, and user stories go in `.agent-artifacts/requirements/output/`.
- Use `.agent-artifacts/project-knowledge-base/wiki/` as the durable project wiki: confirmed business rules, system behavior, known issues, limitations, important notes, scope boundaries, decisions, assumptions, risks, dependencies, and reusable project facts live there.
- Keep wiki pages under knowledge-area folders. The starter uses `knowledge-area-1/` and `knowledge-area-2/` as placeholders; rename them to project-specific areas when enough context exists.
- Use `.agent-artifacts/project-knowledge-base/wiki/<knowledge-area>/diagrams/` for area-specific copied requirement diagrams and `.agent-artifacts/project-knowledge-base/wiki/diagrams/` for shared copied diagrams. Link to the copied diagram from the wiki page and cite the original `.agent-artifacts/requirements/` path.
- `update-project-knowledge` may read `.agent-artifacts/requirements/` as source evidence, but must not update files under it.
- Do not treat generated requirement output as durable wiki until the user confirms the knowledge-base update.
- When the user confirms a KB update, distill stable facts from `.agent-artifacts/requirements/output/` into `.agent-artifacts/project-knowledge-base/wiki/` or `.agent-artifacts/project-knowledge-base/solution-context/`; do not move the deliverable itself out of `.agent-artifacts/requirements/output/`.

## Folder File Rules

- Use `<epic-slug>/epic.md` to describe the requirement epic and link child stories.
- Store user stories as individual Markdown files inside the epic folder.
- Do not create or maintain directory index files (`index.md`).

## Controlled Tags

Use controlled tags to keep navigation consistent. Tags should be lowercase, hyphenated, reusable across projects, and added to this list before use.

Core tags:

```text
project
outsourcing
client
vendor
stakeholder
scope
assumption
exclusion
dependency
risk
decision
delivery
acceptance
handover
support
requirement
epic
user-story
nfr
api
integration
data
system
domain
glossary
reference
```

Requirement hierarchy tags:

```text
requirement-hierarchy
parent-epic
initiative
parent-initiative
child-epic
child-story
story-slice
backlog
acceptance-criteria
business-rule
validation
permission
reporting
notification
workflow
screen
frontend
backend
blocked
needs-clarification
ready-for-refinement
ready-for-estimation
ready-for-delivery
```

Tagging rules:

- Every initiative concept should include `initiative` and `requirement`.
- Every epic concept should include `epic` and `requirement`.
- Every user story concept should include `user-story` and `requirement`.
- Add domain, system, API, data, screen, frontend, backend, risk, or dependency tags only when they help cross-cutting navigation.
- Do not create one-off tags for a single ticket ID or overly specific screen behavior; put that detail in the title, body, or source reference.

## Starter Workflow

1. Maintain the project overview in `project-summary.md` or relevant wiki/solution-context documents.
2. Add or update `.agent-artifacts/project-knowledge-base/wiki/stakeholders-scope-delivery.md` when stakeholder, scope, delivery, risk, or acceptance context is source-backed.
3. Keep source documents, screenshots, links, excerpts, and source inventories in `.agent-artifacts/requirements/input/`.
4. Store new client-provided requirement material under `.agent-artifacts/requirements/input/`.
5. Generate BA deliverables into `.agent-artifacts/requirements/output/`.
6. If the user confirms knowledge-base update, keep generated deliverables in `.agent-artifacts/requirements/output/` and distill durable facts into `.agent-artifacts/project-knowledge-base/wiki/` or `.agent-artifacts/project-knowledge-base/solution-context/`.
7. Create solution-context, decision, risk, and glossary concepts only when source-backed and useful for future BA work.
8. Update `.agent-artifacts/project-knowledge-base/log.md` for material changes.
9. Route downstream BA artifact creation to the matching BA skill instead of duplicating full artifacts here.
