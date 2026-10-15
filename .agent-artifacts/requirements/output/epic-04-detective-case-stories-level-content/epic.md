---
type: Requirement Epic
status: draft
description: "Declarative case configurations, narrative suspect webs, forensic clue mapping, and comedic roast content translating level story design specs into playable game cases."
tags: [requirement, epic, case-stories, level-content, narrative-integration, declarative-cases]
timestamp: "2026-10-15T09:48:00+07:00"
---

# Epic 04: Husband Hoàng Level 1 MVP Case Implementation (Release 1)

## Summary

The Husband Hoàng Level 1 MVP Case Implementation epic governs the translation of creative level story designs (from `requirements/stories/husband-hoang/level-01.md`) into production declarative case configuration datasets (`src/data/cases/hoang/level_01.json`) for **Release 1 (MVP)**. It delivers the narrative content, suspect casts, forensic evidence chains across 4 active apps, comedic excuse ladders, and roast endings that bring the MVP launch case to life.

## Business Value

- Bridges creative game design (`level-designer`) and frontend implementation (`frontend-game-developer`) through standardized declarative case contracts.
- Enables modular delivery of detective cases without modifying core UI loops or smartphone engine components.
- Delivers culturally authentic Vietnamese comedic drama (*Tâm sự Eva*, *Vén khéo*, tech office tropes) to engage the target 13+ audience.
- Focuses strictly on Level 1 to ship immediately as an MVP playable demo.

## High-Level Requirements

- Implementation of Husband Hoàng Level 1 ("Cơn ghen lúc nửa đêm") JSON dataset matching `src/data/cases/hoang/level_01.json` specifications: 4 active apps (`internet-messaging`, `banking`, `ecommerce`, `comms`), 5 suspects, 3 core smoking-gun evidence cards, and 5-strike limit.
- Configuration of 5 distinct suspect profiles (`suspect_huong`, `suspect_lan_anh`, `suspect_thao`, `suspect_ngoc`, `suspect_mai`) with disguised contact cards and avatar assets.
- Packaging of forensic clue metadata across active apps adhering to the Subtle Clues Invariant (Zero Obvious Spoilers).
- Integration of tiered confrontation excuse dialogues ("Chối bay chối biến") and comedic roast narratives for victory, over-jealous fail states, and caught-snooping restarts.

## Business Outcome

Players can immediately immerse themselves in a fully realized, culturally resonant Vietnamese detective case with authentic clues, witty excuses, and viral roast punchlines, while engineering scales new cases purely through declarative configuration.

## Business Rules

- **Single Source of Truth**: Case data must strictly reflect approved level story specs under [requirements/stories/husband-hoang/level-01.md](../../stories/husband-hoang/level-01.md).
- **Subtle Clues Invariant**: Clues must rely on indirect cross-app contradictions rather than overt confessions or explicit dialogue.
- **Zero Code Duplication**: Level content must be delivered 100% via declarative schemas (`CaseConfig`) with zero hardcoded case logic in app views.

## Dependencies

- **Upstream**: Epic 01 Virtual Phone Shell ([`epic-01-virtual-phone-app-ecosystem`](../epic-01-virtual-phone-app-ecosystem/epic.md)), Epic 02 Clue Engine ([`epic-02-investigation-suspicion-mechanics`](../epic-02-investigation-suspicion-mechanics/epic.md)), Epic 03 Confrontation Hub ([`epic-03-wife-notebook-verdict-social-sharing`](../epic-03-wife-notebook-verdict-social-sharing/epic.md)), Level Story SSOT ([`level-01.md`](../../stories/husband-hoang/level-01.md)), Functional Decomposition ([`functional-decomposition.md`](../functional-decomposition.md)).
- **Downstream**: Game Runtime Engine (`src/data/cases/`).

## User Stories

* [US-027 - Husband Hoàng Level 1 Case Implementation ("Cơn ghen lúc nửa đêm")](us-027-husband-hoang-level-1-case-implementation.md) - *Status: planned*

## GUI Specifications

* None recorded yet. Standalone GUI specifications are bypassed in favor of canonical ASCII wireframes.

## Wireframes

* None recorded yet. Content epic maps into existing micro-app and shell wireframes.

## Diagrams

* None currently required.

## Open Questions

* None. Level 1 spec locked; Level 2 & 3 specs to be authored by `level-designer`.

## Citations

* [Husband Hoàng Level 1 Design Spec](../../stories/husband-hoang/level-01.md)
* [Clue Ideas Inventory](../../stories/clues/clue-ideas-inventory.md)
* [Apps & Features Architecture](../../../project-knowledge-base/solution-context/architecture/apps-features-architecture.md)

