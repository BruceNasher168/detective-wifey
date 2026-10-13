---
type: Functional Decomposition
status: draft
description: "Canonical capability breakdown mapping confirmed elicitation output to initiatives, epics, and modular user story slices."
tags: [requirement, decomposition, slicing, app-matrix]
timestamp: "2026-10-13T14:15:00+07:00"
source_refs:
  - .agent-artifacts/requirements/output/vision-scope.md
  - .agent-artifacts/requirements/output/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps-features-architecture.md
---

# Functional Decomposition — Jealous Wife Detective Game (*Game Vợ Bắt Ghen*)

Single source of truth for confirmed delivery epics and user story slices. Decomposed into **10 foundational app & shell stories**, **4 clue inspection & suspicion stories**, and **4 wife notebook, verdict, and progression stories**. Each story is sized to $\le 1$ week of development.

---

## epic-01-virtual-phone-app-ecosystem - Virtual Phone Shell & Modular Parody App Suite

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-001` | Declarative Case & Content Schema Engine | As a **Player**, I want the game to load cases, suspects, and clues from declarative configuration schemas so that I experience structured, scalable detective cases across levels. | Sized $\le 1$ week. Establishes data-driven schemas (`CaseConfig`, `AppDefinition`) for loading cases without modifying the UI loop. |
| `us-002` | Virtual Phone Shell Container & 8-App Home Grid | As a **Player**, I want to view a virtual smartphone frame with an OS status bar and all 8 parody app icons visible so that I can explore apps without knowing in advance which ones contain clues. | Sized $\le 1$ week. Implements mobile phone shell, status bar (carrier/clock/battery), in-shell virtual navigation, and universal 8-app grid rule. |
| `us-003` | `LoZa` Private Messaging App Module | As a **Player**, I want to browse LoZa chat threads, view voice notes, examine disguised contact names, and inspect location pins so that I can discover private messaging clues. | Sized $\le 1$ week. Standalone app module for LoZa (`CLUE-LOZA-01` to `06`), disguised names, voice bubbles, and family chat clutter. |
| `us-004` | `VietPay` Bank & E-Wallet App Module | As a **Player**, I want to inspect bank transaction histories, examine micro-transfer memo chats, view sugar allowance inflows, and explore secret savings vaults so that I can trace financial footprints. | Sized $\le 1$ week. Standalone app module for VietPay (`CLUE-BANK-01` to `05`), 1k transfer chat feed, and secret "Quỹ Đen" vault. |
| `us-005` | `Poshee` E-Commerce App Module | As a **Player**, I want to inspect order histories, verify shipping delivery addresses, check clothing sizes, and view search suggestions so that I can uncover suspicious purchases. | Sized $\le 1$ week. Standalone app module for Poshee (`CLUE-POSH-01` to `04`), order detail invoice drawer, and size/variant inspection. |
| `us-006` | `Grap` Ride-Hailing & Delivery App Module | As a **Player**, I want to view ride history destinations, food delivery driver notes, and parcel delivery recipients so that I can detect late-night travel contradictions. | Sized $\le 1$ week. Standalone app module for Grap (`CLUE-GRAP-01` to `03`), ride detail modals, and food delivery notes. |
| `us-007` | `NetSurf` Mobile Web Browser App Module | As a **Player**, I want to inspect browsing history, open incognito tabs, and view visited forums so that I can uncover private web searches and secrets. | Sized $\le 1$ week. Standalone app module for NetSurf (`CLUE-BROW-01` to `04`), search query history, private tabs, and mock webpage viewer. |
| `us-008` | `Photos` Gallery & Media Forensics App Module | As a **Player**, I want to browse photo albums, zoom into reflective background details, and inspect car dashboard pictures so that I can discover visual forensic evidence. | Sized $\le 1$ week. Standalone app module for Photos (`CLUE-PHOT-01` to `04`), full-screen lightbox, tap-to-zoom magnifier, and hidden album. |
| `us-009` | `Comms` Unified Phone, SMS & Contacts App Module | As a **Player**, I want to review recent call durations, read booking confirmation SMS messages, and inspect contact notes so that I can uncover telecommunication footprints. | Sized $\le 1$ week. Standalone app module for Comms (`CLUE-COMM-01` to `03`), 1-minute call badges, hotel SMS, and contact card notes. |
| `us-010` | `Husband's Notes & Calendar` Productivity App Module | As a **Player**, I want to read my husband's private notes, review hidden ledgers, and check calendar schedules so that I can find password hints and appointment contradictions. | Sized $\le 1$ week. Standalone app module on husband's phone (`CLUE-NOTE-01` to `03`), agenda contradiction, and password hints. |

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
| `us-011` | In-App Clue Inspection & Interactive Evidence Tapping | As a **Player**, I want to tap on suspicious elements across apps to inspect them and tag them into my investigation notes so that I can link evidence together. | Sized $\le 1$ week. Slices in-app tap interactions, evidence discovery events, and clue-to-notebook linking. |
| `us-012` | Polymorphic PIN Pad & Security Question App Unlocks | As a **Player**, I want to enter numeric PINs or answer security questions when opening locked apps or folders so that I can access protected evidence on Levels 2 and 3. | Sized $\le 1$ week. Slices polymorphic lock decorator component supporting 4-digit PIN pad and security prompt verification. |
| `us-013` | Suspicion Meter Escalation & Lockout Animation | As a **Player**, I want failed unlock attempts to increment a suspicion strike counter and trigger a skippable lockout timer so that I feel genuine tension while snooping. | Sized $\le 1$ week. Slices strike counter rules (L1: 5 strikes, L2: 4 strikes, L3: 3 strikes) and skippable ~60s lockout delay animation. |
| `us-014` | Caught-Snooping Fail State & Case Retry ("Bị giật lại máy") | As a **Player**, I want reaching the strike limit to trigger a "Caught Snooping" fail screen with an instant retry button so that I can restart the level without penalty. | Sized $\le 1$ week. Slices fail state modal, comedic "Bị giật lại máy" animation, and seamless case reset routing. |

### Open Slicing Questions
- None.

---

## epic-03-wife-notebook-verdict-social-sharing - Wife's Detective Notebook, Verdict Decision & Social Sharing

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-015` | Wife's Investigation Notebook & Suspect Dossier (*Sổ Tay Bắt Ghen Của Vợ*) | As a **Player (Wife)**, I want to open my personal detective notebook from the phone shell at any time to add suspects, tag evidence, and record notes on discovered persons so that I maintain a complete case dossier. | Sized $\le 1$ week. CRUD+L detective dossier overlay sheet; distinct from husband's notes app; maintains suspects (human/AI/sugar) collected across all 8 apps. |
| `us-016` | In-Notebook Final Verdict Decision Hub (*Trang Phán Quyết Cuối Cùng*) | As a **Player (Wife)**, I want to submit my final verdict (Innocent / Cheating / Sugar Relationship) and select the accused culprit directly within my investigation notebook so that the game evaluates my deduction and reveals the ending. | Sized $\le 1$ week. In-notebook accusation decision tab; evaluates ground truth, calculates 1-3 stars, assigns comedic "Wife Title", and triggers roast narrative. |
| `us-017` | Shareable Comedic Roast Card Generation | As a **Player**, I want to generate and download a vertical roast card image showing my verdict, star rating, and wife title so that I can share it to TikTok, Zalo, or Facebook. | Sized $\le 1$ week. Slices client-side HTML5 Canvas / DOM capture engine generating 9:16 vertical cards for instant mobile download/sharing. |
| `us-018` | Level Progression Gating ("Tha thứ") & Local State Persistence | As a **Player**, I want passing a case to unlock the next level via a comedic "Tha thứ" action and save my progress in local storage so that I can continue my playthrough later. | Sized $\le 1$ week. Slices level advancement gating, comedic "Tha thứ" transition, and browser `localStorage` persistence. |

### Open Slicing Questions
- None.
