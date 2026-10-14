# BA Agent Workspace Instructions (Antigravity & Agentic Workspaces)

## Global Principles

- **Zero Assumptions**: Do not assume a business domain, client, product, system type, architecture, integration provider, delivery model, folder path, stakeholder decision, business rule, estimate, date, or commitment unless supplied or verified.
- **Preserve Existing Documentation**: Never overwrite, delete, or displace existing project documentation. Map external documentation via hybrid progressive summary stubs that link back to the authoritative originals.
- **Structured Evidence Handling**: Separate confirmed facts, assumptions, decisions, risks, dependencies, exclusions, and open questions in every analysis.
- **Operational Terseness**: Eliminate conversational filler, pleasantries, apologies, hedging, and verbose tool-call narration. Present findings, risks, and questions with concise, high-signal language.
- **Component & Design Reuse-First**: Always audit existing components (`src/components/`, `src/shell/`) and canonical `app-design.md` specifications before creating new ones. Forbid redundant components, ad-hoc styling, or parallel primitives when reusable assets exist.
- **Wireframe-First Progression & Plain English ACs**: Requirement screen delivery strictly follows: **Generate ASCII Wireframe (`wireframes/wireframe-*.md`) -> User Signoff Gate -> Generate HTML Wireframe (`wireframes/wireframe-*.html`)**. Standalone GUI specs (`gui-*.md`) and Gherkin ACs (`Given/When/Then`) are prohibited. User stories contain clear Acceptance Criteria in plain English (numbered or bulleted). Business value ("so that"), RAID logs, and pre-conditions are removed; stories point directly to the wireframe SSOT.

---

## Project Context Reference

- **Product**: *Bắt được Tiểu tam* (Jealous Wife Detective Game)
- **Project Summary**: [project-summary.md](project-summary.md) (Domain, Architecture, Personas, SOW Baseline)
- **Requirements SSOT**: [.agent-artifacts/requirements/output/vision-scope.md](.agent-artifacts/requirements/output/vision-scope.md)
- **Software Architecture SSOT**: [.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md](.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md)
- **Micro-App Design SSOT**: [.agent-artifacts/project-knowledge-base/solution-context/apps/](.agent-artifacts/project-knowledge-base/solution-context/apps/) (Canonical `app-design.md` UI/UX and branding for each virtual app)
- **Lead Dev Agent**: [.agents/agents/frontend-game-developer.md](.agents/agents/frontend-game-developer.md)
- **Requirements & KB Research Skill**: [.agents/skills/research-project-knowledge/SKILL.md](.agents/skills/research-project-knowledge/SKILL.md) (Mandatory skill for looking up requirements, user stories, plain English ACs, clue matrices, and specifications via `search_kb.ps1` without a static index)

