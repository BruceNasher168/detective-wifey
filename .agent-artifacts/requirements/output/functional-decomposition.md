---
type: Functional Decomposition
status: draft
description: "Canonical capability breakdown mapping confirmed elicitation output to initiatives, epics, and user story slices."
tags: [requirement, decomposition, slicing]
timestamp: "2026-10-13T13:46:30+07:00"
source_refs:
  - .agent-artifacts/requirements/output/vision-scope.md
  - .agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md
  - .agent-artifacts/requirements/output/clue-ideas-inventory.md
---

# Functional Decomposition — Jealous Wife Detective Game (*Game Vợ Bắt Ghen*)

Single source of truth for confirmed epic and user story slices derived from the signed-off elicitation session and canonical vision & scope baseline. Each section represents exactly one delivery epic containing its complete user story table.

---

## epic-01-virtual-phone-app-ecosystem - Virtual Phone Shell & Modular Parody App Suite

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-001` | Declarative Case & Content Schema Engine | As a **Player**, I want the game to load cases, suspects, and clues from declarative configuration schemas so that I experience structured, scalable detective cases across levels. | Sized $\le 1$ week. Establishes data-driven foundation and schemas for adding levels/husbands without modifying the game loop. |
| `us-002` | Virtual Phone Shell & 8-App Home Screen Grid | As a **Player**, I want to view a virtual smartphone home screen with all 8 parody app icons visible so that I can explore apps without knowing in advance which ones contain clues. | Sized $\le 1$ week. Implements virtual phone container, navigation bar, and universal 8-app grid rule to eliminate process-of-elimination spoilers. |
| `us-003` | Private Messaging & Communication Apps | As a **Player**, I want to open and browse LoZa chats and SMS/Call Logs/Contacts so that I can inspect my husband's private conversations and contacts. | Sized $\le 1$ week. Slices communication channels (LoZa + SMS/Call Log), supporting disguised contacts, 1-minute calls, and benign chat clutter. |
| `us-004` | Financial Transfer & E-Commerce Apps | As a **Player**, I want to inspect Bank/E-Wallet transaction histories and Poshee shopping orders so that I can discover suspicious money transfers and gift purchases. | Sized $\le 1$ week. Slices financial/commerce channels, supporting 1.000 VNĐ chat notes, secret stashes (*quỹ đen*), and wrong-size clothing orders. |
| `us-005` | Lifestyle, Media & Utility Apps | As a **Player**, I want to explore Grap ride histories, Web Browser searches, Photo Gallery albums, and Notes/Calendar entries so that I can uncover behavioral contradictions and hidden items. | Sized $\le 1$ week. Slices utility and media channels (Grap, Browser, Photos, Notes/Calendar), supporting late-night rides and photo reflections. |

### Open Slicing Questions
- None.

---

## epic-02-investigation-suspicion-mechanics - Clue Inspection, Puzzle Unlocks & Suspicion Engine

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-006` | In-App Clue Inspection & Evidence Discovery | As a **Player**, I want to tap and examine suspicious details within apps so that I can uncover clues and link evidence across applications. | Sized $\le 1$ week. Slices inspection interactions (voice note play, receipt expansion, location pins) across app views. |
| `us-007` | PIN Pad & Security Question App Unlocks | As a **Player**, I want to unlock protected apps using numeric PIN pads or answering security questions so that I can access locked evidence on Levels 2 and 3. | Sized $\le 1$ week. Slices unlock challenge interfaces, supporting 4-digit PIN verification and question prompts cross-referenced from notes. |
| `us-008` | Suspicion Meter Escalation & Lockout Animation | As a **Player**, I want incorrect unlock attempts to increment a suspicion strike counter and trigger a skippable lockout timer so that I experience risk and tension while snooping. | Sized $\le 1$ week. Slices strike counter rules (L1: 5 strikes, L2: 4 strikes, L3: 3 strikes) and skippable ~60s lockout delay animation. |
| `us-009` | Caught-Snooping Fail State & Case Retry | As a **Player**, I want the case to trigger a "Caught Snooping" fail screen when the suspicion limit is reached with an immediate retry button so that I can restart the level without penalty. | Sized $\le 1$ week. Slices fail state lifecycle, "Bị giật lại máy" animation/dialogue, and case reset routing. |

### Open Slicing Questions
- None.

---

## epic-03-verdict-progression-social-sharing - Suspect Board, Verdict Submission & Social Sharing

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-010` | Dynamic Cross-App Suspect Board | As a **Player**, I want to add names, aliases, or entities found in any app to a suspect board so that I can maintain a list of potential culprits throughout the case. | Sized $\le 1$ week. CRUD+L slice (add, view, remove suspects) aggregating potential culprits across apps. |
| `us-011` | Verdict Submission & Comedic Roast Endings | As a **Player**, I want to submit my verdict (Innocent, Cheating, Sugar Relationship) and select the accused party so that the game calculates my star rating and unlocks the comedic ending. | Sized $\le 1$ week. Slices verdict evaluation, star rating (1-3 stars based on speed + strikes), wife titles, and "over-jealous" roast for innocent cases. |
| `us-012` | Shareable Comedic Roast Card Generation | As a **Player**, I want to generate and download a visual roast card image showing my verdict, star rating, and wife title so that I can share it to TikTok, Zalo, or Facebook. | Sized $\le 1$ week. Slices client-side Canvas/DOM image rendering, formatting vertical social cards for download and sharing. |
| `us-013` | Level Progression Gating & Local State Persistence | As a **Player**, I want my level completion to unlock the next level via a "Tha thứ" button and save my progress in local storage so that I can resume playing without losing progress. | Sized $\le 1$ week. Slices level advancement gating, comedic "Tha thứ" action, and browser `localStorage` persistence. |

### Open Slicing Questions
- None.
