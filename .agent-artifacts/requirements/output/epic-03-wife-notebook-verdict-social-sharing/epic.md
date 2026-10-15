---
type: Requirement Epic
status: draft
description: "Wife's split-section investigation notebook, suspect-evidence linkage hub, anytime dynamic confrontation excuse engine, shareable comedic roast cards, and level progression gating with local state persistence."
tags: [requirement, epic, wife-notebook, confrontation, verdict, social-sharing, local-storage]
timestamp: "2026-10-15T09:33:00+07:00"
---

# Epic 03: Wife's Detective Notebook, Anytime Confrontation & Social Sharing

## Summary

The Wife's Detective Notebook, Anytime Confrontation & Social Sharing establishes the deduction, confrontation, and closure loop for *Bắt được Tiểu tam* (Jealous Wife Detective Game). It provides an omnipresent 2-tab detective dossier sheet (`[ 📋 Hồ sơ điều tra ]` and `[ ⚖️ Phán quyết & Đối chất ]`), enables players to link collected evidence cards directly to specific suspects, powers the "Đối chất" anytime confrontation hub where the husband dynamically gaslights or confesses based on attached proof, generates downloadable 9:16 viral vertical roast cards for social media sharing, and enforces level progression gating via the comedic "Tha thứ" mechanic with local storage persistence.

## Business Value

- Delivers the comedic and emotional payoff of the detective fantasy: confronting the cheating husband and exposing his excuses.
- Enables anytime confrontation with dynamic gaslighting reactions ("chối bay chối biến"), giving casual players complete agency over when to challenge the husband.
- Rewards thorough detective work with tiered star ratings (1–3 stars) and witty Wife Titles (e.g. *Bà Trùm Soi Map*, *Thám Tử Sừng Tê Giác*).
- Drives viral social growth through downloadable 9:16 vertical roast cards optimized for TikTok, Zalo, and Facebook stories.
- Guarantees seamless replayability and level unlocks without server accounts, databases, or privacy/telemetry overhead.

## High-Level Requirements

- Omnipresent 2-Tab Wife's Detective Notebook Sheet accessible via floating AssistiveTouch or top shell navigation:
  - Tab 1: `[ 📋 Hồ sơ điều tra ]` housing Suspects Board (pinned suspects) and Evidence Locker (pinned cards), with suspect-evidence linkage slots and decoy deletion.
  - Tab 2: `[ ⚖️ Phán quyết & Đối chất ]` housing the confrontation workbench, primary suspect selector, evidence attachment slots, and confrontation trigger.
- Active Smoking-Gun Counter badge indicating verified core evidence progress (e.g., *Bằng chứng cốt lõi: 1/3*) without revealing specific clues.
- Anytime Confrontation Hub ("Đối chất") evaluating player claims against case ground truth:
  - Weak / Unlinked Evidence (0–1 cards): Husband triggers humorous gaslighting excuses ("chối bay chối biến") and premature accusation penalties.
  - Substantial Evidence (2 cards): Partial confession earning 2 stars.
  - Watertight Smoking-Gun Evidence (3 cards): Complete breakdown confession earning 3 stars, custom Wife Title, and case victory narrative.
- Shareable Comedic Roast Card Generator capturing a 9:16 vertical image (client-side HTML5 Canvas / DOM capture) showing level verdict, star rating, wife title, and roast quote for instant mobile download/sharing.
- Level Progression Gating enforcing completion of Level $N$ before accessing Level $N+1$, unlocked via a prominent comedic "Tha thứ" (Forgive & proceed) action.
- 100% Client-Side State Persistence via `localStorage` storing unlocked levels, best star scores, earned titles, and active case dossiers.

## Business Outcome

Players experience the full emotional arc of snooping, building a dossier, confronting the husband, laughing at comedic dialogue, and sharing their personalized roast card to social circles.

## Business Rules

- **Anytime Confrontation Allowed**: Players may confront the husband at any time without collecting all clues; outcome and star rating scale dynamically with evidence validity.
- **Scoring & Star Matrix**: 1 card = 1 star (Weak conviction); 2 cards = 2 stars (Strong conviction); 3 cards = 3 stars (Watertight conviction + custom Wife Title).
- **"Tha thứ" Progression Requirement**: Players must pass the current level (minimum 1 star) to unlock the "Tha thứ" button and proceed to the next case.
- **Zero Server State**: All game progress, star ratings, and dossier links persist strictly in browser `localStorage`.
- **Canvas Capture Privacy**: Result card generation is 100% client-side with zero telemetry or image uploads to external servers.

## Dependencies

- **Upstream**: Epic 01 Virtual Phone Shell ([`epic-01-virtual-phone-app-ecosystem`](../epic-01-virtual-phone-app-ecosystem/epic.md)), Epic 02 Clue Inspection & Suspicion Engine ([`epic-02-investigation-suspicion-mechanics`](../epic-02-investigation-suspicion-mechanics/epic.md)), Declarative Case Config Schema ([`us-001`](../epic-01-virtual-phone-app-ecosystem/us-001-declarative-case-content-schema-engine.md)), Signed-off elicitation session ([`2026-10-13-jealous-wife-detective-game.md`](../elicitation/2026-10-13-jealous-wife-detective-game.md)), Vision & Scope ([`vision-scope.md`](../vision-scope.md)), Functional Decomposition ([`functional-decomposition.md`](../functional-decomposition.md)).
- **Downstream**: Level Story Design Specs (`requirements/stories/`).

## User Stories

* [US-015 - Wife's Split-Section Investigation Notebook & Suspect-Evidence Linkage Hub](us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md) - *Status: planned*
* [US-016 - Anytime Confrontation Hub & Dynamic Excuse Engine ("Đối chất & Chối bay chối biến")](us-016-anytime-confrontation-hub-dynamic-excuse-engine.md) - *Status: planned*
* [US-017 - Shareable Comedic Roast Card Generation](us-017-shareable-comedic-roast-card-generation.md) - *Status: planned*
* [US-018 - Level Progression Gating ("Tha thứ") & Local State Persistence](us-018-level-progression-gating-tha-thu-local-state-persistence.md) - *Status: planned*

## GUI Specifications

* None recorded yet. Standalone GUI specifications are bypassed in favor of canonical ASCII wireframes.

## Wireframes

* None recorded yet. Phase 1 ASCII Wireframe pending authoring.

## Diagrams

* None currently required.

## Open Questions

* None. Scope and UX parameters verified against canonical project knowledge.

## Citations

* [Apps & Features Architecture](../../../project-knowledge-base/solution-context/architecture/apps-features-architecture.md)
* [Clue Ideas Inventory](../../stories/clues/clue-ideas-inventory.md)
* [Universal Design System](../../../project-knowledge-base/solution-context/design-system/design.md)

