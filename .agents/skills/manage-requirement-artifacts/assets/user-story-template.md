---
type: Requirement Story
epic: "<Epic Name or TBD>"
status: draft
description: "<One-sentence behavior/value summary>"
tags: [requirement, user-story]
timestamp: "<ISO-8601 timestamp>"
---

# `<User Story ID>` - `<User Story Name>`

### Epic: `<Epic Name>`

As a `<user role>` I want to `<goal>` so that I can `<business value>`

---

### Risk, Assumption, Issue, Dependency (RAID) Log
| RAID ID | Type | Description | Impact | Owner | Status |
|---|---|---|---|---|---|
| R01 | Risk | `<Identified delivery, technical, or business risk, or N/A>` | `<Low / Medium / High>` | `<Owner / TBD>` | `<Open / Mitigated>` |
| A01 | Assumption | `<Low-risk assumption needed to draft the story, or N/A>` | `<Low / Medium / High>` | `<Owner / TBD>` | `<Open / Validated>` |
| I01 | Issue | `<Current known blocker or defect affecting this story, or N/A>` | `<Low / Medium / High>` | `<Owner / TBD>` | `<Open / In Progress / Resolved>` |
| D01 | Dependency | `<Prerequisite service, external API, data model, or story, or N/A>` | `<Low / Medium / High>` | `<Owner / TBD>` | `<Open / Ready>` |

---

### Pre-conditions
| Pre-condition ID | Description |
|------------------|-------------|
| PR01             | `<Required configuration, user permission, prior action, external dependency, or N/A>` |

---

### Workflow/Activity Diagram
- [`<Diagram Title>`](./diagrams/<diagram-name.md>)

---

### Screen / GUI Specification References
| Reference ID | Screen / Artifact | Reference | Story-Relevant Behavior |
|--------------|-------------------|-----------|-------------------------|
| UI01         | `<Screen or artifact name>` | [`<GUI Spec or Wireframe>`](./<gui-screen-name.md>) | `<Behavior needed to understand the story and acceptance criteria>` |

---

### Canonical Wireframe SSOT & Functional Specification

> [!IMPORTANT]
> **Wireframe-First Requirement SSOT**: Detailed Gherkin Acceptance Criteria and standalone GUI specs are bypassed for this project. All screen layouts, UI components, touch targets, dynamic states, and player interactions are canonicalized in the structured wireframes:
> - **ASCII Wireframe**: [`wireframe-<slug>.md`](./wireframes/wireframe-<slug>.md) *(Phase 1 - Canonical Screen SSOT & Signed Off)*
> - **Interactive HTML Wireframe**: [`wireframe-<slug>.html`](./wireframes/wireframe-<slug>.html) *(Phase 3 - Visual Verified)*

---

### Out of Scope
| OOS ID | Description |
|--------|-------------|
| OOS01  | `<Scenario, behavior, or dependency excluded from this story, or N/A>` |

---

### Non-functional Requirements
| Requirement       | Description |
|-------------------|-------------|
| `<Requirement>`   | `<Specific performance, security, audit, compatibility, accessibility, or operational requirement, or N/A>` |

---

### Open Questions
| Question ID | Question | Impact |
|-------------|----------|--------|
| Q01         | `<Question that must be answered to finalize scope, logic, data, permissions, dependencies, or acceptance criteria, or N/A>` | `<Impact if unanswered>` |

---

### Citations
| Source ID | Source | Relevant Evidence |
|-----------|--------|-------------------|
| SRC01     | `<Source file, client note, ticket, screenshot, or N/A>` | `<Short citation or summary of source-backed evidence>` |
