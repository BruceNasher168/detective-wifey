---
type: Vision & Scope
status: draft
description: "Free, comedic, mobile-first web detective game where the player inspects a virtual smartphone to uncover whether a husband is innocent, cheating, or in a sugar relationship."
tags: [requirement, vision, scope]
timestamp: "2026-10-13T13:45:00+07:00"
source_refs:
  - .agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md
  - .agent-artifacts/requirements/output/clue-ideas-inventory.md
---

# Vision & Scope — Jealous Wife Detective Game (*Bắt được Tiểu tam*)

> **Authoring Rule**: Populated strictly from the signed-off elicitation session output and clue inventory baseline. This file establishes the canonical scope, architectural constraints, and commercial boundaries for all downstream capability decomposition, user stories, and change request governance.

---

## 1. Product Vision

### Business Goal
Deliver a free, comedic, mobile-first web game tailored for Vietnamese Gen Z and Gen Alpha audiences (ages 13+). The game satirizes viral Vietnamese marital confession tropes (*Tâm sự Eva*, *Vén khéo*, *quỹ đen*, 1.000 VNĐ bank transfer chats) through an interactive detective deduction loop: the player assumes the persona of a jealous wife inspecting her husband's virtual smartphone to deduce whether he is innocent, cheating, or in a sugar relationship, and to name the third party.

### Success Signals
| Signal | Target / Measure | Status |
|---|---|---|
| Level 1 Completion Rate | >= 75% of users who open the game complete Level 1 | Confirmed |
| Viral Social Shareability | High engagement in generating and downloading/sharing roast result cards to TikTok, Zalo, and Facebook | Confirmed |
| Casual Session Length | 10–15 minutes per level, optimized for short bite-sized mobile play sessions | Confirmed |
| Privacy Compliance | 100% client-side execution with zero telemetry, tracking, or cookie compliance friction for minors (13+) | Confirmed |

### Sponsoring Stakeholder(s)
| Name / Role | Commercial Accountability | Status |
|---|---|---|
| Product Lead / Delivery Sponsor | Commercial scope, product direction, and baseline sign-off authority | Confirmed |

---

## 2. Personas & Target Users

| Persona | Commercial Model | Primary JTBD | Key Pain Points | Status |
|---|---|---|---|---|
| Vietnamese Gen Z / Gen Alpha Player (Age 13+) | B2C, Free (Zero Ad-wall in MVP) | Experience the satisfying comedic thrill of snooping and detective deduction; unlock humorous roast endings; share funny "Wife Title" cards to peer social networks | Tired of generic Western puzzle games; frustrated by intrusive pay-to-win ads; craves culturally authentic Vietnamese internet drama and slang | Confirmed |

---

## 3. MVP Scope Boundary

### In Scope (MVP)
| Capability / Feature Area | Description | Status |
|---|---|---|
| Virtual Parody Smartphone Shell | Responsive mobile phone frame with home screen displaying all 8 standardized parody app icons across all levels to prevent elimination spoilers: LoZa (chat), Bank/VietQR/MoMo (transfers), Poshee (e-commerce), Grap/Be (rides/food), Web Browser, Photo Gallery, SMS/Calls/Contacts, Notes/Calendar. | Confirmed |
| Launch Content Suite | 1–2 husbands across 3 progressive levels (Level 1: 3–4 clue apps, 0 locked; Level 2: 5–6 clue apps, 1 locked; Level 3: 7–8 clue apps, 2 locked). Benign mundane clutter populates non-clue apps. | Confirmed |
| Cross-App Suspect Board | Dynamic evidence list where players tag any suspicious name, alias, or entity encountered across apps, selecting one as the accused party at case conclusion. | Confirmed |
| Unlock & Puzzle Mechanics | Multi-layered unlock mechanics: 4-digit PINs, security question challenges, and cross-referenced password clues hidden in other apps. (Locks active in L2 & L3). | Confirmed |
| Suspicion & Lockout Engine | Strike counter tracking failed PIN entries and incorrect answers. Limit escalates by difficulty: L1 = 5 strikes, L2 = 4 strikes, L3 = 3 strikes. Each strike triggers a skippable ~60s lockout animation. Reaching the strike limit triggers a "Bị giật lại máy" (Caught snooping) fail screen with instant retry. | Confirmed |
| Verdict & Comedic Roast Endings | Deduction submission: Verdict selection (Innocent / Cheating / Sugar Relationship) + Accused Person selection. Generates 1–3 star rating, custom "Wife Title" (e.g. *Thám Tử Sư Tử*, *Vợ Đa Nghi*), and comedic roast narrative (including over-jealous roast for innocent husbands). | Confirmed |
| Shareable Result Card | Client-rendered visual summary card (Canvas/HTML capture) displaying verdict, star rating, wife title, and roast punchline formatted for vertical social media sharing (TikTok, Zalo, Facebook). | Confirmed |
| Progression & Retry Loop | Passing a level unlocks the next via a comedic "Tha thứ" (Forgive & proceed) action. Immediate retry supported on wrong verdict or caught-snooping fail state. | Confirmed |
| Local State Persistence | Browser `localStorage` persistence for level unlock progression, best star ratings, and earned wife titles. Zero server database required. | Confirmed |

### Out of Scope (Explicit Exclusions)
| Item | Reason for Exclusion | Status |
|---|---|---|
| Backend API & Server Database | Client-side static architecture selected for zero operational cost and high scalability | Confirmed |
| User Accounts & Cloud Sync | Excluded to maximize frictionless casual play and avoid PII storage for 13+ users | Confirmed |
| English Localization / Language Toggle | Vietnamese-only idiom, humor, and cultural references for launch MVP | Confirmed |
| Google Analytics & Third-Party Telemetry | Deferred to post-MVP to eliminate cookie banners and privacy overhead | Confirmed |
| In-App Purchases / Pay-to-Skip | Avoids payment processing and minor regulatory hurdles in launch demo | Confirmed |
| Remote CMS / Admin Editing Portal | Content hardcoded at launch via declarative schemas; CMS deferred to future scale | Confirmed |
| Wife as Suspect / Dual Perspective | Deferred to future expansion packs | Confirmed |
| Global Leaderboards | Excluded due to zero-backend constraint | Confirmed |

### Phase Boundaries
| Phase | Scope | Target |
|---|---|---|
| Phase 1 / MVP | 1–2 husbands x 3 levels, 8 virtual parody apps, declarative engine, local storage, shareable card | Launch Baseline |
| Phase 2+ | Additional husbands & levels, background audio & comedic SFX, CMS content pipeline, analytics | Post-MVP |

---

## 4. Key Constraints & Non-Functional Requirements (Global)

| Category | Constraint / Requirement | Status |
|---|---|---|
| Architecture & Scalability | **Data-Driven Modular Client Engine**: 1) Declarative level configuration schemas (JSON/TypeScript) defining cases, suspects, and clues independently of UI logic; 2) Pluggable Virtual App Registry (`AppDefinition`) allowing new apps to register icons and views without modifying the home screen; 3) Polymorphic Clue Engine supporting varied puzzle types (PINs, security questions, timestamp matches, hidden media) without altering the core game loop. | Confirmed |
| Security & Privacy | Zero server collection. No tracking pixels, cookies, or personal data collected. Fully compliant with minor privacy best practices (13+). | Confirmed |
| Compliance & Brand Safety | Parody brand assets (names, colors, icons, layouts) must noticeably deviate from real-world trademarks (Grab, Shopee, Zalo, MoMo, VietQR) to mitigate passing-off risk. Content restricted to safe comedic satire: zero profanity, zero explicit sexual depiction, infidelity implied solely through humorous receipts and chat dialogues. | Confirmed |
| Performance / SLA | Instantaneous screen-to-screen app switching (< 100ms); initial asset bundle < 5MB; zero network requests during active gameplay after initial page load. | Confirmed |
| Accessibility & Ergonomics | Mobile-first portrait viewport (375px–430px base width); touch-target sizes >= 44x44px; high contrast text rendering for readability on small mobile screens. | Confirmed |
| Platforms & Devices | Responsive web application running on evergreen mobile browsers: iOS Safari (iOS 15+) and Android Chrome (Android 10+). Desktop browsers render a centered mobile device frame. | Confirmed |
| Integrations | None. Zero third-party runtime dependencies or external API integrations in MVP. | Confirmed |

---

## 5. Commercial Baseline (SOW / CR Trigger)

| Category | Detail | Status |
|---|---|---|
| Contracted MVP Scope | Single-player client-side static web application containing 1–2 husbands across 3 levels, 8 virtual apps, declarative content architecture, local storage persistence, and Canvas-based shareable roast cards. | Confirmed |
| Change Request (CR) Triggers | The following requirements fall outside the agreed commercial baseline and will trigger a formal Change Request: 1) Introducing cloud backend services, user authentication, or server databases; 2) Integrating third-party payment gateways or monetization ad networks; 3) Implementing a web-based CMS/admin authoring dashboard; 4) Multi-language localization (e.g. English); 5) Multiplayer or synchronized leaderboard systems. | Confirmed |
| Delivery Phasing | Rapid iterative delivery from approved functional decomposition to user stories and visual mockups. | Confirmed |

---

## 6. Key Assumptions & Risks

| Type | Item | Impact | Owner / Status |
|---|---|---|---|
| Assumption | Browser `localStorage` provides sufficient reliability for casual progression retention without cloud sync | Medium | Engineering, Validated |
| Assumption | Organic viral sharing of downloadable roast card images will drive player acquisition without paid ad spend | Medium | Marketing / Product, Open |
| Risk | Parodying prominent Vietnamese apps (Zalo, Grab, Shopee) could draw trademark complaints if UI is too similar | Medium | Design / BA, Mitigated (mandated distinct color palettes and satirical naming) |
| Risk | Hardcoded meme references may age over a 6–12 month window | Low | Content / BA, Mitigated (declarative schema enables rapid content patching) |
| Dependency | Clue catalog and puzzle logic mapped to authentic Vietnamese relationship tropes | High | BA / Story Designer, Ready (SSOT cataloged in `clue-ideas-inventory.md`) |

---

## 7. Open Questions

| ID | Question | Needed From | Status |
|---|---|---|---|
| — | None. All discovery items (Q001–Q007) resolved and signed off. | — | Closed |

---

## Referenced Documents

* [.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md](<C:/Users/KhanhChuNgoc/Documents/Personal Projects/Detective/.agent-artifacts/requirements/output/elicitation/2026-10-13-jealous-wife-detective-game.md>)
* [.agent-artifacts/requirements/output/clue-ideas-inventory.md](<C:/Users/KhanhChuNgoc/Documents/Personal Projects/Detective/.agent-artifacts/requirements/output/clue-ideas-inventory.md>)
