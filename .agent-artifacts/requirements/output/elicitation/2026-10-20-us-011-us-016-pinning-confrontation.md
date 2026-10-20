---
status: signed-off
artifact_type: elicitation_session
elicitation_status: COMPLETE
created_at: "2026-10-20"
updated_at: "2026-10-20"
topic: "us-011-us-016-pinning-confrontation"
---

# Investigation Pinning & Anytime Confrontation - Elicitation Session

## Purpose & Scope

### Objective
Define US-011 (Zero-Spoiler Universal Long-Press Clue & Suspect Pinning) and US-016 (Anytime Confrontation Hub & Dynamic Excuse Engine) to establish the forensic clue capture workflow and dynamic accusation mechanics.

### Boundary
| Area | Current Position | Status |
|---|---|---|
| US-011 | 380ms pointer/touch hold via `StoryEvidenceTarget`, blurred `UniversalEvidenceModal`, single "Ghim Vào Sổ Tay Bắt Ghen" action, single-card consolidation with message bullets in Wife's Detective Notebook, zero UI tells | Confirmed |
| US-016 | Anytime confrontation entry from Wife's Notebook, automatic graph connectivity evaluation, tiered excuse ladder (0 cards = dismissal + 1 strike, 1 card = 1 star, 2 cards = 2 stars, 3 cards = 3 stars + confession + title), comedic roasts, "Tiếp tục điều tra" return path | Confirmed |
| Exclusions | Permanent "Ghim" buttons on parody app screens/modals; manual drag-and-drop card slotting in confrontation; multi-choice action sheets; server-side state | Confirmed |

## PACT Baseline

### People
Player (Wife) inspecting the husband's virtual smartphone. Vietnamese players aged 13+ seeking humorous relationship drama and casual detective deduction.

### Activities
- Long-pressing narrative clues, messages, orders, and receipts across parody apps.
- Curating evidence cards in the Wife's Detective Notebook corkboard drawer.
- Initiating confrontation ("Đối chất") with the husband at any time.
- Reviewing excuses, strikes, and victory roast narratives.

### Context
Client-side web game mimicking a smartphone operating system with 8 parody apps. Operates across Epic 02 (Investigation & Suspicion Mechanics) and Epic 03 (Wife's Notebook, Verdict & Social Sharing).

### Technologies
React, TypeScript, Tailwind CSS, Lucide-free canonical Ionicons (`react-icons/io5`), HTML5 Pointer Events (`onPointerDown`, `onPointerUp`), Web Vibration API (`navigator.vibrate`), and browser `localStorage`.

## Rules & Data

### Rules
| Status | Rule |
|---|---|
| Confirmed | **380ms Hold Threshold**: Long-pressing narrative elements for $\ge 380\text{ms}$ triggers tactile feedback (`scale-98`, 50ms vibration) and opens `UniversalEvidenceModal`. Normal taps or releases before 380ms cancel the gesture without action. |
| Confirmed | **Chrome Exclusion Invariant**: Long-press overlays attach strictly to dynamic story narrative data (`StoryEvidenceTarget`). Structural chrome (headers, back buttons, tabs, search inputs, contact action rows, settings) must never trigger evidence capture. |
| Confirmed | **Zero UI Tells**: Parody apps contain zero spoiler cues (no glowing borders, clue icons, or permanent "Ghim" buttons). Decoy items and genuine clues support identical interaction. |
| Confirmed | **Card Consolidation Invariant**: Pinned items belonging to the same contact/conversation consolidate into exactly one corkboard card bearing the suspect's name/alias and an aggregated bulleted list of pinned messages (`• DD/MM · HH:mm: "..."`). |
| Confirmed | **Automatic Graph Evaluation**: Tapping "Đối chất" passes the active corkboard Knowledge Graph connectivity state (unmasked suspects, bridge edges, contradiction pairs) directly to the confrontation engine without manual card slotting. |
| Confirmed | **Confrontation Excuse Ladder**: 0 verified links = dismissive gaslighting dialogue + 1 suspicion strike + "Tiếp tục điều tra" return button; 1 verified link = defensive excuse + 1-star win; 2 verified links = stammering explanation + 2-star win; 3 verified links = full confession + 3-star victory + custom Wife Title. |
| Confirmed | **Fail State Escalation**: If the 1 strike incurred from a 0-star premature confrontation pushes total strikes to the case limit (5 strikes in Level 1), the "Caught Snooping" fail state ("Bị giật lại máy", US-014) triggers immediately. |

### Data
| Area | Detail | Status |
|---|---|---|
| Inputs | Pointer events (`StoryEvidenceTarget`), `UniversalEvidenceItem`, active corkboard graph state (`CaseKnowledgeGraph`), level `groundTruth` | Confirmed |
| Source of Truth | Implemented runtime contracts (`evidence.ts`, `UniversalEvidenceModal.tsx`, `WifeNotebookModal.tsx`), `wireframe-clue-card.md`, and level case configs | Confirmed |
| Lifecycle | Pinning updates `PlaySession.taggedSuspects` and local corkboard state; confrontation evaluates links against `groundTruth` without network calls | Confirmed |

## Decisions & Constraints

| Type | Item | Rationale / Impact | Owner / Status |
|---|---|---|---|
| Decision | Single "Ghim Vào Sổ Tay Bắt Ghen" action inside `UniversalEvidenceModal` | Replaces earlier multi-choice action sheet; deposits raw cards into notebook drawer per 380ms invariant | User / Confirmed |
| Decision | All pinned clues from same contact/conversation map to a single card | Aggregates messages into timestamped bullets, matching `wireframe-clue-card.md` and current code | User / Confirmed |
| Decision | Automatic active corkboard graph evaluation on "Đối chất" | Eliminates manual card slotting; streamlines mobile UX | User / Confirmed |
| Decision | Premature confrontation (0 cards) shows comedic dismissal, adds 1 strike, and offers return button | Balances comedic narrative with tension and suspicion risk | User / Confirmed |
| Constraint | Plain English Acceptance Criteria | No Gherkins (`Given/When/Then`), business value ("so that"), RAID logs, or pre-conditions in user stories | Delivery Rule / Confirmed |
| Constraint | Wireframe-first lifecycle | Phase 1 ASCII wireframe -> User signoff gate -> Phase 3 HTML wireframe | Delivery Rule / Confirmed |

## Referenced Documents

- [Vision & Scope](../vision-scope.md)
- [Functional Decomposition](../functional-decomposition.md)
- [Epic 02 Container](../epic-02-investigation-suspicion-mechanics/epic.md)
- [Epic 03 Container](../epic-03-wife-notebook-verdict-social-sharing/epic.md)
- [Wife's Notebook Features](../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/features.md)
- [Wife's Notebook Design](../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/app-design.md)
- [Canonical Clue Card Wireframe](../wireframes/wireframe-clue-card.md)
- [US-015 Detective Corkboard Canvas](../epic-03-wife-notebook-verdict-social-sharing/us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md)
- Runtime components: `StoryEvidenceTarget.tsx`, `UniversalEvidenceModal.tsx`, `WifeNotebookModal.tsx`, `evidence.ts`

## Next Step

Scaffold Phase 1 ASCII wireframes (`wireframe-us-011-universal-evidence-modal.md`, `wireframe-us-016-confrontation-hub.md`) and streamlined user story specifications (`us-011`, `us-016`). Present ASCII wireframes for explicit signoff before generating interactive HTML wireframes.

