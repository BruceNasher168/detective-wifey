---
type: Functional Decomposition
status: draft
description: "Canonical capability breakdown mapping confirmed elicitation output to initiatives, epics, and modular user story slices."
tags: [requirement, decomposition, slicing, app-matrix]
timestamp: "2026-10-13T14:15:00+07:00"
---

# Functional Decomposition — Jealous Wife Detective Game (*Bắt được Tiểu tam*)

Single source of truth for confirmed delivery epics and user story slices. Decomposed into **13 foundational app & shell stories**, **5 clue inspection, hint & suspicion stories**, and **4 wife notebook, confrontation, and progression stories**. Each story is sized to $\le 1$ week of development.

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
| `us-002` | Virtual Phone Shell Container & Level-Based App Grid | As a **Player**, I want to view a virtual smartphone frame mounting only the active apps configured for my current level (Level 1: 3–4 apps; Level 2: 5–6 apps; Level 3: 8–11 apps) so that I can explore apps without cognitive clutter or excessive reading. | Sized $\le 1$ week. Implements mobile phone shell, status bar (carrier/clock/battery), in-shell virtual navigation, and level-based dynamic app mounting. |
| `us-003` | `LoZa` Private Messaging App Module | As a **Player**, I want to browse LoZa chat threads, view voice notes, examine disguised contact names, and inspect location pins so that I can discover private messaging clues. | Sized $\le 1$ week. Standalone app module for LoZa (`CLUE-LOZA-01` to `06`), disguised names, voice bubbles, and family chat clutter. Folder: `internet-messaging`. |
| `us-004` | `VietPay` Bank & E-Wallet App Module | As a **Player**, I want to inspect bank transaction histories, examine micro-transfer memo chats, view sugar allowance inflows, and explore secret savings vaults so that I can trace financial footprints. | Sized $\le 1$ week. Standalone app module for VietPay (`CLUE-BANK-01` to `05`), 1k transfer chat feed, and secret "Quỹ Đen" vault. Folder: `banking`. |
| `us-005` | `Poshee` E-Commerce App Module | As a **Player**, I want to inspect order histories, verify shipping delivery addresses, check clothing sizes, and view search suggestions so that I can uncover suspicious purchases. | Sized $\le 1$ week. Standalone app module for Poshee (`CLUE-POSH-01` to `04`), order detail invoice drawer, and size/variant inspection. Folder: `ecommerce`. |
| `us-006` | `Grap` Ride-Hailing & Delivery App Module | As a **Player**, I want to view ride history destinations, food delivery driver notes, and parcel delivery recipients so that I can detect late-night travel contradictions. | Sized $\le 1$ week. Standalone app module for Grap (`CLUE-GRAP-01` to `03`), ride detail modals, and food delivery notes. Folder: `ride-hailing`. |
| `us-007` | `NetSurf` Mobile Web Browser App Module | As a **Player**, I want to inspect browsing history, open incognito tabs, and view visited forums so that I can uncover private web searches and secrets. | Sized $\le 1$ week. Standalone app module for NetSurf (`CLUE-BROW-01` to `04`), search query history, private tabs, and mock webpage viewer. Folder: `web-browser`. |
| `us-008` | `Photos` Gallery & Media Forensics App Module | As a **Player**, I want to browse photo albums, zoom into reflective background details, and inspect car dashboard pictures so that I can discover visual forensic evidence. | Sized $\le 1$ week. Standalone app module for Photos (`CLUE-PHOT-01` to `04`), full-screen lightbox, tap-to-zoom magnifier, and hidden album. Folder: `phone-os/photos`. |
| `us-009` | `Comms` Unified Phone, SMS & Contacts App Module | As a **Player**, I want to review recent call durations, read booking confirmation SMS messages, and inspect contact notes so that I can uncover telecommunication footprints. | Sized $\le 1$ week. Standalone app module for Comms (`CLUE-COMM-01` to `03`), 1-minute call badges, hotel SMS, and contact card notes. Folder: `phone-os/comms`. |
| `us-010` | `Husband's Notes & Calendar` Productivity App Module | As a **Player**, I want to read my husband's private notes, review hidden ledgers, and check calendar schedules so that I can find password hints and appointment contradictions. | Sized $\le 1$ week. Standalone app module on husband's phone (`CLUE-NOTE-01` to `03`), agenda contradiction, and password hints. Folder: `personal-notes`. |
| `us-019` | `GeeMail` Email App Module | As a **Player**, I want to inspect inbox threads, check spam/trash folders, and find security reset tokens and flight tickets so that I can unlock password-protected apps and expose deceptive itineraries. | Sized $\le 1$ week. Standalone app module for GeeMail (`CLUE-MAIL-01` to `04`), Gmail parody design, security OTP recovery codes, and booking confirmations. Folder: `email`. |
| `us-020` | `InkedLin` Professional Network App Module | As a **Player**, I want to inspect professional posts, view work anniversary milestones, and examine recruiter InMail messages so that I can discover password PIN dates and office flirting. | Sized $\le 1$ week. Standalone app module for InkedLin (`CLUE-LINK-01` to `04`), LinkedIn parody design, career anniversary PIN clues, and networking DMs. Folder: `professional-network`. |
| `us-021` | `Tim` Team Collaboration App Module | As a **Player**, I want to browse company channels, inspect IT support PIN announcements, and read late-night 1-on-1 chats so that I can find system credentials and uncover office affairs. | Sized $\le 1$ week. Standalone app module for Tim (`CLUE-TEAM-01` to `04`), MS Teams parody design, IT security PIN reminders, and OT status message contradictions. Folder: `team-collaboration`. |

### Open Slicing Questions
- None.

---

## epic-02-investigation-suspicion-mechanics - Clue Inspection, Puzzle Unlocks, Hints & Suspicion Engine

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-011` | In-App Clue Inspection & Universal Evidence Pinning ("Ghim Bằng Chứng") | As a **Player**, I want to tap on any interactive message, receipt, delivery note, or photo across apps to pin it into my investigation notes so that I can curate evidence without spoiler tells. | Sized $\le 1$ week. Slices in-app tap interactions, universal evidence pinning across all elements, and clue-to-notebook linking. |
| `us-012` | Polymorphic PIN Pad & Security Question App Unlocks | As a **Player**, I want to enter numeric PINs or answer security questions when opening locked apps or folders so that I can access protected evidence on Levels 2 and 3. | Sized $\le 1$ week. Slices polymorphic lock decorator component supporting 4-digit PIN pad and security prompt verification. |
| `us-013` | Suspicion Meter Escalation & Lockout Animation | As a **Player**, I want failed unlock attempts to increment a suspicion strike counter and trigger a skippable lockout timer so that I feel genuine tension while snooping. | Sized $\le 1$ week. Slices strike counter rules (L1: 5 strikes, L2: 4 strikes, L3: 3 strikes) and skippable ~60s lockout delay animation. |
| `us-014` | Caught-Snooping Fail State & Case Retry ("Bị giật lại máy") | As a **Player**, I want reaching the strike limit to trigger a "Caught Snooping" fail screen with an instant retry button so that I can restart the level without penalty. | Sized $\le 1$ week. Slices fail state modal, comedic "Bị giật lại máy" animation, and seamless case reset routing. |
| `us-022` | "Giác Quan Thứ 6" (Sixth Sense) App-Badging Hint Engine | As a **Player**, I want to trigger the "Giác Quan Thứ 6" hint button when stuck so that the game badges or highlights the specific app icon housing the next uncollected evidence. | Sized $\le 1$ week. Slices hint trigger state, target app resolution from unpinned clues, and launcher badge/pulse animation. |

### Open Slicing Questions
- None.

---

## epic-03-wife-notebook-verdict-social-sharing - Wife's Detective Notebook, Anytime Confrontation & Social Sharing

- **Initiative**: N/A
- **Source Elicitation Session**: [elicitation/2026-10-13-jealous-wife-detective-game.md](elicitation/2026-10-13-jealous-wife-detective-game.md)
- **Readiness Check**: `PASS`
- **Project Type**: `Full-Stack / User-Facing`

### User Stories

| Story ID | Story Title | User Goal | Slicing Rationale |
|---|---|---|---|
| `us-015` | Wife's Investigation Notebook, Clue Counter & Pinned Evidence Dossier | As a **Player (Wife)**, I want to open my personal detective notebook from the phone shell at any time to review pinned evidence cards, track the smoking-gun objective counter, and inspect suspect profiles so that I maintain a complete case dossier. | Sized $\le 1$ week. CRUD+L detective dossier overlay sheet; tracks pinned evidence cards, maintains suspect entries, and renders the active smoking-gun counter. |
| `us-016` | Anytime Confrontation Hub & Dynamic Excuse Engine ("Đối chất & Chối bay chối biến") | As a **Player (Wife)**, I want to initiate confrontation ("Đối chất") at any time, where weak evidence triggers comedic husband excuses and attaching verified smoking-gun evidence cards convicts him to earn 1–3 stars, custom Wife Titles, and roast narratives. | Sized $\le 1$ week. Confrontation modal; evaluates ground truth vs attached evidence cards, triggers dynamic gaslighting excuse reactions on weak proof, calculates 1–3 stars, and reveals roast endings. |
| `us-017` | Shareable Comedic Roast Card Generation | As a **Player**, I want to generate and download a vertical roast card image showing my verdict, star rating, and wife title so that I can share it to TikTok, Zalo, or Facebook. | Sized $\le 1$ week. Slices client-side HTML5 Canvas / DOM capture engine generating 9:16 vertical cards for instant mobile download/sharing. |
| `us-018` | Level Progression Gating ("Tha thứ") & Local State Persistence | As a **Player**, I want passing a case to unlock the next level via a comedic "Tha thứ" action and save my progress in local storage so that I can continue my playthrough later. | Sized $\le 1$ week. Slices level advancement gating, comedic "Tha thứ" transition, and browser `localStorage` persistence. |

### Open Slicing Questions
- None.
