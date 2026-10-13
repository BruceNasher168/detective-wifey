# Requirement Output

Store generated BA deliverables here.

## Core Baseline Artifacts
* [Vision & Scope](vision-scope.md) — Canonical product vision, MVP boundary, architectural NFRs, and commercial baseline.
* [Functional Decomposition](functional-decomposition.md) — Capability breakdown mapping confirmed scope into 3 delivery epics and 13 user stories.
* [Elicitation Session: Jealous Wife Detective Game](elicitation/2026-10-13-jealous-wife-detective-game.md) — Signed-off discovery session.
* [Clue Ideas Inventory](clue-ideas-inventory.md) — Single Source of Truth for clue archetypes and cross-app puzzle mechanics.

## Generated Requirement Hierarchy
* [Sample Epic](sample-epic/epic.md) - Placeholder epic page showing where user story files belong.

Required hierarchy:

```text
output/
|-- index.md
|-- vision-scope.md
|-- functional-decomposition.md
|-- elicitation/
|   `-- <session-slug>.md
`-- <epic-slug>/
    |-- epic.md
    |-- elicitation-<slug>.md
    |-- <user-story-id-or-slug>.md
    |-- gui-<screen-slug>.md
    |-- api-<api-slug>.md
    |-- wireframes/
    `-- diagrams/
```

Examples:

* Authoritative elicitation session outputs.
* Requirements analysis outputs.
* User stories and acceptance criteria.
* API specifications.
* GUI specifications.
* Diagrams or diagram source files.
* WBS or estimation breakdowns.
* Handoff notes.

Rules:

* Reference the input files used.
* Reference relevant wiki or solution-context files used.
* Keep generated deliverables separate from durable project wiki.
* After user confirmation, keep deliverables here and distill durable facts into `../../project-knowledge-base/wiki/` or `../../project-knowledge-base/solution-context/`.
* Use `epic.md` as the canonical epic page inside each epic folder.
* Keep `index.md` files short and navigational.
* Store user stories as Markdown files inside the relevant epic folder.

Generated requirement hierarchy:

* [Elicitation](elicitation/) - Project-wide discovery notes & interview sessions.
* [Vision & Scope](vision-scope.md) - Overall product vision & boundary constraints.
* [Functional Decomposition](functional-decomposition.md) - Capability breakdown and story slices.
* [Epic 01: Virtual Phone Shell & Modular Parody App Suite](epic-01-virtual-phone-app-ecosystem/epic.md) - Virtual smartphone shell, system status bar, universal 8-app home screen launcher grid, and modular parody application suite.
* [Sample Epic](sample-epic/epic.md) - Placeholder epic page showing where user story files belong.

