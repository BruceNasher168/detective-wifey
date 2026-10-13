---
status: signed-off
artifact_type: elicitation_session
elicitation_status: COMPLETE
created_at: "2026-10-13T13:15:00+07:00"
updated_at: "2026-10-13T13:44:00+07:00"
topic: "jealous-wife-detective-game"
---

# Jealous Wife Detective Game - Elicitation Session

> **ELICITATION SIGNED OFF.** All PACT elements, operational boundaries, rules, suspicion mechanics, clue inventories, and architectural scalability NFRs are confirmed, signed off by stakeholder, and baseline-locked.

## Purpose & Scope

### Objective
Free, comedic, mobile-first web game for Vietnamese Gen Z / Gen Alpha (13+). The player is a jealous wife who inspects her husband's phone to decide whether he is innocent, cheating, or in a sugar relationship, and to name the third party.

### Boundary
| Area | Current Position | Status |
|---|---|---|
| MVP | 1–2 husbands x 3 levels (launch demo). Husband is the suspect. Vietnamese only. Single-player, no accounts, no backend, progress in browser local storage only. Zero analytics/tracking in MVP. | Confirmed |
| In Scope | Parody phone with 8 standard apps: SMS, chat (LoZa-style), bank/e-wallet (VietQR/MoMo-style), browser history, photo gallery incl. hidden folders, ride/food delivery (Grap/Poshee-style), social feed, contacts/call log/Notes/Calendar. **Universal UI Rule:** All 8 app icons are visible on the home screen across all levels (L1, L2, L3) to prevent process-of-elimination spoilers; simpler levels populate non-essential apps with realistic mundane daily clutter. | Confirmed |
| In Scope | Cross-app suspect board: player adds any name/alias seen in any app to a suspect list, then picks one at the end. Suspect may be any gender or non-human (e.g. AI chatbot, sugar mommy/daddy, anything hidden from the player). | Confirmed |
| In Scope | Unlock mechanics: A) PIN/pattern guessed from clues, B) security questions answered from other apps, C) codes/passwords found elsewhere on the phone. No hint system. PINs appear on L2 and L3 only. | Confirmed |
| In Scope | Verdict: Innocent / Cheating / Sugar relationship, plus naming the person. Innocent cases exist with misleading clues and an "over-jealous" roast ending. Retry allowed on wrong verdict. | Confirmed |
| In Scope | End-of-case & Progression: Comic ending, star rating (speed + accuracy), "wife title" (e.g. Detective Wife / Over-Jealous Wife), shareable result card image (ending, title, roast line) for TikTok/Zalo/Facebook. Passing level required to unlock next; player taps comedic "Tha thứ" (Forgive & proceed) button to advance. | Confirmed |
| In Scope | Suspicion mechanics: Wrong PIN/answer raises husband suspicion (+1) and triggers skippable ~60s lockout animation. At limit (L1: 5, L2: 4, L3: 3 wrong actions), husband grabs phone back -> "caught snooping" fail screen with immediate retry. | Confirmed |
| Out of Scope (future) | Wife as suspect; English toggle; Google Analytics / event telemetry; suspicion limit continues the case with harder-to-reach evidence; real 60s wait with pay-to-skip; CMS/admin tool; accounts/leaderboard. | Confirmed (deferred) |

## PACT Baseline

### People
| Persona / Role | Commercial Model | Demographics & Literacy | Devices & Hardware | Ergonomics & Preferences | Accessibility & Constraints | Jobs To Be Done (JTBD) & Pain Points | Status |
|---|---|---|---|---|---|---|---|
| Player (Vietnamese Gen Z / Gen Alpha) | B2C, free | Age 13+ (teens to young adults); digitally native; deeply familiar with Vietnamese social media slang, memes, and viral confession tropes | Mobile smartphones (iOS Safari, Android Chrome); responsive mobile-first web | Short bite-sized play sessions (~10-15 min/case); portrait orientation; high visual reward and shareability | 13+ age rating; clean comedic tone; no vulgarity/profanity | Quick comedic entertainment; satisfaction of snooping/detective deduction; sharing funny roast cards to social circles | Confirmed |

### Activities
- Play a case: browse phone apps, collect clues, unlock locked apps, build suspect list, submit verdict and person, receive ending/rating/title, share result card.
- Progress through levels per husband with escalating cheat sophistication and more apps.
- On case completion: review verdict, tap comedic "Tha thứ" button to advance to the next level, or tap "Chơi lại" (Retry).

### Context
- Satire of Vietnamese family/"bắt ghen" and confession culture, inspired by viral columns and groups like "Tâm sự Eva" and "Vén khéo" (quỹ đen, giấu tiền, chuyển khoản ngân hàng 1.000 VNĐ, mua sắm đồ nữ trên sàn TMĐT, em gái mưa...).
- Humor is a cheeky roast: 13+ rating, no profanity, no mocking real people, no explicit content, cheating only implied via chat/receipts.
- All names, brands and apps are parodies of Vietnamese ones (e.g. Grap, Poshee, LoZa), evocative via puns and hinted colour families. Logos, layouts and icons must clearly deviate from real ones.
- Trend content (slang, memes, stories) ages fast; hardcoded at launch.

### Technologies
- Web app, mobile-first responsive design, client-side static bundle.
- State persistence: Browser `localStorage` for level unlock progress, best scores, and titles.
- Zero analytics / zero third-party tracking in MVP (privacy-first).
- Vietnamese language only.
- Scalable, modular architecture (NFR): Declarative level configuration schemas (allowing new husbands and levels to be added via structured data without editing game flow logic), pluggable virtual app interface/registry (allowing new apps to register icons, UI views, and data adapters cleanly), and extensible clue/puzzle type interfaces (supporting polymorphic mechanics like PINs, security questions, time/location mismatches, and visual forensics).

## Rules & Data

### Rules
| Status | Rule |
|---|---|
| Confirmed | Each case has a hidden truth: Innocent, Cheating, or Sugar relationship, plus a hidden third party (any gender, human or non-human). |
| Confirmed | Innocent cases contain misleading clues; a wrong accusation yields the "over-jealous" roast ending. |
| Confirmed | Bank transfer notes may serve as a messaging channel for clues. |
| Confirmed | Level progression is gated by passing the previous level; player taps "Tha thứ" to advance. |
| Confirmed | Player may freely retry the same case after a wrong verdict or fail state. |
| Confirmed | Wrong PIN/security answer adds +1 husband suspicion and triggers a skippable ~60s lockout animation. |
| Confirmed | Suspicion threshold by level: Level 1 = 5 strikes; Level 2 = 4 strikes; Level 3 = 3 strikes. Reaching threshold ends case in "Bị giật lại máy" with instant retry. |
| Confirmed | App complexity by level: All 8 app icons appear on the home screen across all levels. Active clues escalate: Level 1 has 3-4 apps containing clues (0 locked); Level 2 has 5-6 apps containing clues (1 locked); Level 3 has 7-8 apps containing clues (2 locked). Inactive apps display benign mundane filler. |

### Data
| Area | Detail | Status |
|---|---|---|
| Inputs / Outputs | Inputs: screen taps, PIN/pattern keypad entries, security-question text/select, suspect list tagging, final verdict + suspect selection, "Tha thứ" button tap. Outputs: verdict screen, star rating (1-3 stars based on speed + suspicion count), wife title, shareable HTML/Canvas result card image. | Confirmed |
| Source of Truth | Case scenarios, app data (messages, call logs, receipts, search histories), and clue-answer mappings authored via declarative structured schemas (JSON/TS data models) statically bundled in client code. | Confirmed |
| Lifecycle / Audit | Saved locally in browser `localStorage`. No user accounts, no server database, zero analytics collection for MVP. | Confirmed |

## Decisions & Constraints

| Type | Item | Rationale / Impact | Owner / Status |
|---|---|---|---|
| Decision | Parody brands: evocative pun names, original logos/layouts/icons (deviating clearly) | Reduces trademark/passing-off risk | User, confirmed |
| Decision | Sugar relationship may appear as anything; played for comedy | Aligns with player goal of cheater vs sugar relationship | User, confirmed |
| Decision | Content authored via declarative data-driven schemas (no remote CMS/backend for MVP) | Lowest MVP operational cost while ensuring architecture is strictly scalable to add more levels, apps, and clue types by registering data objects rather than modifying core UI loop | User, confirmed |
| Decision | Zero tracking/analytics for MVP; Google Analytics deferred to future | Simplifies MVP, eliminates cookie/consent compliance overhead for 13+ audience | User, confirmed |
| Decision | Age rating fixed at 13+ | Ensures safe comedic boundaries for Gen Alpha without adult content risks | User, confirmed |
| Decision | Level progression gated + "Tha thứ" progression button | Comedic narrative consistency and clear player progression loop | User, confirmed |
| Decision | Player can retry case upon wrong verdict or caught-snooping fail | Prevents dead ends, encourages replayability | User, confirmed |
| Decision | Story inspiration centered on "Tâm sự Eva" and "Vén khéo" tropes | Grounded in authentic Vietnamese marital/financial drama and viral memes | User, confirmed |
| Risk | Parody of real brands (Grab, Shopee, Zalo, banks/e-wallets) | Trademark/confusion risk; logos/UI must deviate visibly | User accepted |
| Risk (deferred) | Future pay-to-skip with minors | Payments and parental consent review needed before build | Deferred |
| Risk | Trend/meme shelf life | Hardcoded content may age; future updates require release | User accepted |

## Open Questions (Parking Lot)

| ID | Area | Question | Needed From | Status / Notes |
|---|---|---|---|---|
| Q001 | Context | Synthesize 6-8 story archetypes from "Tâm sự Eva" and "Vén khéo" for Husband 1 and Husband 2 cases across Levels 1-3. | BA / Research Agent | Closed (Delivered and cataloged in `clue-ideas-inventory.md` with 25+ specific clue archetypes and cross-app chaining mechanics) |
| Q002 | Constraints | Success metric / analytics tracking in MVP. | User | Closed (No tracking for MVP, GA deferred to future) |
| Q003 | Constraints | Target age rating. | User | Closed (Confirmed 13+) |
| Q004 | Rules/Data | Retry case after wrong verdict. | User | Closed (Confirmed: Yes, retry allowed) |
| Q005 | Rules/Data | Suspicion limits, app counts, and PIN lock rules per level. | BA / User | Closed (Confirmed: All 8 apps displayed; clue distribution: L1: 3-4 apps, 0 lock, 5 strikes; L2: 5-6 apps, 1 lock, 4 strikes; L3: 7-8 apps, 2 locks, 3 strikes) |
| Q006 | Scope | Gated progression & advance mechanic. | User | Closed (Confirmed: Gated by previous level + "Tha thứ" button) |
| Q007 | Constraints | Platform & device support. | User | Closed (Confirmed: Mobile-first responsive web on iOS Safari / Android Chrome) |

## Referenced Documents

- [clue-ideas-inventory.md](../clue-ideas-inventory.md): Canonical Single Source of Truth catalog of 25+ clue archetypes across all 8 apps, puzzle chaining examples, and home screen visibility rules.

## Next Step
Stakeholder confirmed and signed off. Hand off to manage-requirement-artifacts to author vision-scope.md and functional-decomposition to author functional-decomposition.md.
