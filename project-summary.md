# Project Summary — Jealous Wife Detective Game (*Game Vợ Bắt Ghen*)

## Domain Overview

- **Product Name**: *Game Vợ Bắt Ghen* (Jealous Wife Detective Game).
- **Domain**: Casual detective deduction web game satirizing viral Vietnamese marital confession tropes.
- **Core Gameplay Loop**: The player assumes the persona of a jealous wife inspecting her husband's virtual smartphone across 8 standardized parody apps. The player gathers evidence, tags suspects on a suspect board, solves lock puzzles, manages suspicion strikes, and submits a final verdict (*Innocent*, *Cheating*, or *Sugar Relationship*) with the accused party to earn 1–3 stars, a custom "Wife Title", and vertical social share cards (TikTok, Zalo, Facebook).

---

## System Architecture & Tech Stack

- **Architecture**: 100% static, client-side web application.
- **Engine Design**:
  - Declarative level configuration schemas (JSON/TypeScript) defining cases, suspects, and clues independently of UI logic.
  - Pluggable Virtual App Registry (`AppDefinition`) allowing new apps to register icons and views without modifying the home screen shell.
  - Polymorphic Clue Engine supporting varied puzzle types (PINs, security questions, timestamp matches, hidden media).
- **Runtime Dependencies**: Zero backend APIs, zero server databases, zero third-party telemetry/cookies, zero network requests during active gameplay after initial page load.
- **State Persistence**: Browser `localStorage` for level unlocks, star ratings, and earned titles.
- **Platform & Viewport**: Mobile-first portrait viewport (375px–430px base width, touch targets >= 44x44px). Evergreen mobile browsers (iOS Safari 15+, Android Chrome 10+). Desktop displays a centered mobile frame. Performance target: < 100ms app switching, < 5MB initial bundle.
- **Brand Safety**: Distinct parody brands/colors (mitigating trademark risks); comedic satire with zero profanity or explicit sexual depiction.

---

## Actors & Personas

- **Primary Persona**: Vietnamese Gen Z & Gen Alpha Player (ages 13+).
  - *Commercial Model*: B2C, 100% Free (zero ad-wall in MVP).
  - *JTBD*: Comedic deduction thrill, unlock roast endings, share results with peer networks.
  - *Pain Points Addressed*: Generic Western puzzles, intrusive pay-to-win ads, privacy friction for minors.
- **Product Lead / Delivery Sponsor**: Commercial accountability and baseline sign-off authority.

---

## Commercial Scope & SOW Baseline

- **In-Scope (MVP Baseline)**:
  - Virtual parody smartphone shell with 8 standard apps (LoZa, VietPay/VietQR, Poshee, Grap/Be, NetSurf, Photos, Comms, Notes/Calendar).
  - Launch content: 1–2 husbands across 3 progressive levels (Level 1: 3–4 clue apps, 0 locks; Level 2: 5–6 clue apps, 1 lock; Level 3: 7–8 clue apps, 2 locks). Benign clutter in non-clue apps.
  - Cross-app suspect board (tagging names/aliases).
  - Unlock mechanics (4-digit PINs, security questions, cross-app clues).
  - Suspicion & lockout engine (L1: 5 strikes, L2: 4, L3: 3; skippable ~60s lockout; caught-snooping fail screen).
  - Deduction submission (verdict + accused person -> stars, title, comedic roast punchline).
  - Client-rendered vertical share card (HTML/Canvas).
  - Progression & retry loop with local storage persistence.
---
