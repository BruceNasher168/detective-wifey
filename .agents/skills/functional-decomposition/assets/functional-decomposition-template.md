---
type: Functional Decomposition
status: draft
description: "Canonical capability breakdown mapping confirmed elicitation output to initiatives, epics, and user story slices."
tags: [requirement, decomposition, slicing]
timestamp: "<ISO-8601 timestamp>"
---

# Functional Decomposition

Single source of truth for confirmed epic → story slices derived from elicitation session output. One section per `<epic-slug>`, each containing exactly one user story table. Update the matching epic section in place when re-slicing or adding stories — do not create a second decomposition file.

Optional columns: add `Release` (after `Story Title`) only when release/MVP slicing is requested. `Scope Class` is `N/A` when no committed baseline exists. Never delete rows; set `Status: Descoped` instead.

---

## <epic-slug> - <Epic Title>

- **Source Elicitation Session**: `<link to elicitation-<session-slug>.md>`
- **Readiness Check**: `PASS` | `PASS_WITH_ACCEPTED_RISK` | `BLOCKED`
- **Project Type**: `Full-Stack / User-Facing` | `API-Only / Integration` | `Data / Platform Migration`

### User Stories

| Story ID | Story Title | Actor | User Goal | Change Type | Scope Class | Status | Depends On | Slicing Rationale |
|---|---|---|---|---|---|---|---|---|
| us-001 | <Story Title> | <Actor> | I want **<goal>** so that **<value>**. | `New Story` \| `Extends Existing Story` \| `Split of Existing Story` | `In Baseline` \| `CR Candidate` \| `TBD` \| `N/A` | `Proposed` \| `Confirmed` \| `Delivered` \| `Descoped` | `us-NNN` list or `None` | <Evidence-based rationale, e.g., SMART: Achievable [1 view, 1 Read op, 2 rules] \| Slicing: View Progression> |

### Open Slicing Questions
- <Unresolved slicing question needing user or client confirmation, or `None`>

---

<!-- Repeat the "## <epic-slug> - <Epic Title>" section above for each additional epic. -->
