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
| In Scope | Parody phone with level-based app provisioning: The home screen launcher dynamically mounts only the active apps configured for that specific level (Level 1: 3–4 apps; Level 2: 5–6 apps; Level 3: 8–11 apps), drastically reducing initial reading volume and cognitive load. Apps chosen from: SMS, chat (Zola), bank/e-wallet (VietPay), browser (NetSurf), photo gallery (Photos), ride/food delivery (Grap/Poshee), contacts/call log (Comms), Notes/Calendar, and workplace suite (GeeMail, InkedLin, Tim). | Confirmed |
| In Scope | Universal Evidence Pinning ("Ghim Bằng Chứng") & Objective Counter: Player taps to pin any interactive message, bank memo, delivery receipt, or photo into the Wife's Detective Notebook. To eliminate spoiler giveaways, the "Ghim" action appears across all interactive items (including benign clutter and red herrings). The notebook displays an active smoking-gun counter (e.g. *Bằng chứng cốt lõi: 1/3*). | Confirmed |
| In Scope | Anytime Confrontation & Dynamic Excuse Engine: Player can tap "Đối chất" at any time. Accusing prematurely (0–1 evidence cards) triggers comedic gaslighting and excuses (*"chối bay chối biến"*). Conviction rate and star rating (1–3 stars) scale with each valid evidence card attached (1 card = 1 star, 2 cards = 2 stars, 3 cards = 3 stars / full confession). | Confirmed |
| In Scope | "Giác Quan Thứ 6" (Sixth Sense) Hint Trigger: In-shell/notebook trigger that points directly to or badges the app icon containing the next uncollected clue. Free / cooldown-based in MVP. | Confirmed |
| In Scope | Unlock mechanics: A) PIN/pattern guessed from clues, B) security questions answered from other apps, C) codes/passwords found elsewhere on the phone. PINs appear on L2 and L3 only. | Confirmed |
| In Scope | Snackable visual-first content: Chat dialogues capped at 3–5 punchy lines; forensic clues emphasized through visual receipts, bank transaction memos, map delivery pins, and photo reflections rather than walls of text. | Confirmed |
| In Scope | End-of-case & Progression: Comic ending, star rating (speed + accuracy + evidence completeness), "wife title", shareable result card image (ending, title, roast line) for TikTok/Zalo/Facebook. Passing level required to unlock next; player taps comedic "Tha thứ" (Forgive & proceed) button to advance. | Confirmed |
| In Scope | Suspicion mechanics: Wrong PIN/answer raises husband suspicion (+1) and triggers skippable ~60s lockout animation. At limit (L1: 5, L2: 4, L3: 3 wrong actions), husband grabs phone back -> "caught snooping" fail screen with immediate retry. | Confirmed |
| Out of Scope (future) | Paywall / rewarded-ad monetization for "Giác Quan Thứ 6"; interactive mini-mechanics (scratch-off photos, audio waveform player, sticker passcode math); wife as suspect; English toggle; Google Analytics / telemetry; CMS/admin tool; accounts/leaderboard. | Confirmed (deferred) |

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
- All names, brands and apps are parodies of Vietnamese ones (e.g. Grap, Poshee, Zola), evocative via puns and hinted colour families. Logos, layouts and icons must clearly deviate from real ones.
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
| Confirmed | App complexity & limits by level: The home screen launcher dynamically renders only the active apps for that level (Level 1: 3–4 apps, 0 locks, 5 strikes; Level 2: 5–6 apps, 1 lock, 4 strikes; Level 3: 8–11 apps, 2 locks, 3 strikes). This eliminates clutter and reading fatigue. |
| Confirmed | Anytime Confrontation & Dynamic Excuse Engine: Player may confront the husband at any time. If 0–1 evidence cards are attached, the husband weasels out with humorous excuses ("chối bay chối biến"). Attaching verified evidence cards increases conviction power and star ratings (1 card = 1 star, 2 cards = 2 stars, 3 cards = 3 stars). |
| Confirmed | "Giác Quan Thứ 6" (Sixth Sense) Hint Engine: Dedicated trigger that highlights or badges the app icon housing the next uncollected clue. Free with cooldown in MVP. |
| Confirmed | Universal "Ghim Bằng Chứng" (Pin Evidence): Pinning is enabled on all interactive items (messages, receipts, photos) to prevent the pin button from serving as a spoiler giveaway. |

### Data
| Area | Detail | Status |
|---|---|---|
| Inputs / Outputs | Inputs: screen taps, PIN/pattern keypad entries, security-question text/select, suspect list tagging, universal evidence pinning, "Đối chất" confrontation submission, "Giác Quan Thứ 6" trigger, "Tha thứ" button tap. Outputs: excuse reactions, verdict screen, star rating (1-3 stars based on speed + suspicion count + evidence completeness), wife title, shareable HTML/Canvas result card image. | Confirmed |
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
| Decision | Expanded app suite to 11 registered virtual apps (Row 1: Poshee, Grap, NetSurf, Photos; Row 2: GeeMail, InkedLin, Tim, Notes; Dock: Zola, VietPay, Comms) | Retains all existing apps while introducing corporate workplace suite | User, confirmed (2026-10-13) |
| Decision | Generic app folder naming taxonomy under `solution-context/apps/` (`internet-messaging`, `ecommerce`, `banking`, `ride-hailing`, `web-browser`, `personal-notes`, `email`, `professional-network`, `team-collaboration`) | Enables modular renaming and rebranding of virtual apps without code friction | User, confirmed (2026-10-13) |
| Decision | Workplace parody brands: GeeMail (Gmail design), InkedLin (LinkedIn design), Tim (Microsoft Teams design) | Authentic workplace communication simulation | User, confirmed (2026-10-13) |
| Decision | Clue role for workplace suite: Security puzzle hooks (password reset tokens in Mail, anniversary dates in LinkedIn, IT PIN reminders in Teams) | Deepens cross-app puzzle unlocks and security challenges | User, confirmed (2026-10-13) |
| Decision | Level-based app provisioning (L1: 3–4 apps, L2: 5–6 apps, L3: 8–11 apps) replaces static universal launcher invariant | Eliminates cognitive overload and excessive reading for casual players | User, confirmed (2026-10-13) |
| Decision | Anytime confrontation with dynamic excuse engine and tiered star scoring | Transforms deduction from passive text reading into active interactive confrontation | User, confirmed (2026-10-13) |
| Decision | "Giác Quan Thứ 6" (Sixth Sense) app-badging hint engine | Prevents player frustration; monetized paywall deferred to Phase 2 | User, confirmed (2026-10-13) |
| Decision | Universal "Ghim Bằng Chứng" on all interactive elements | Prevents UI giveaway spoilers while empowering player curation | User, confirmed (2026-10-13) |
| Decision | Phase 2 deferrals: Scratch-off photos, audio voice notes, sticker passcode math, paywalled hints | Protects MVP delivery velocity and avoids mobile audio/physics complexity | User, confirmed (2026-10-13) |
| Decision | Decouple AssistiveTouch floating quick action menu and fullscreen controls into standalone User Story US-023 | Keeps US-002 focused on shell layout/mounting while isolating floating gesture overlay and sheet routing | User, confirmed (2026-10-14) |
| Decision | Add unified Motion Choreography & Transitions User Story US-024 (shell transitions, dummy app feedback, clue micro-animations) | Centralizes spring physics, app zoom expand/shrink, dummy app feedback, and forensic UI pulses in a cohesive UX story | User, confirmed (2026-10-14) |
| Decision | Add dual-layer Splash Screen User Story US-025 (game boot loading screen + parody virtual app launch splash screens) | Provides authentic mobile OS boot and branded 300ms–500ms parody app loading experience across all virtual apps | User, confirmed (2026-10-14) |
| Risk | Parody of real brands (Grab, Shopee, Zalo, banks/e-wallets, Gmail, LinkedIn, Microsoft Teams) | Trademark/confusion risk; logos/UI must deviate visibly | User accepted |
| Risk (deferred) | Future pay-to-skip with minors | Payments and parental consent review needed before build | Deferred |
| Risk | Trend/meme shelf life | Hardcoded content may age; future updates require release | User accepted |

## Open Questions (Parking Lot)

| ID | Area | Question | Needed From | Status / Notes |
|---|---|---|---|---|
| Q001 | Context | Synthesize 6-8 story archetypes from "Tâm sự Eva" and "Vén khéo" for Husband 1 and Husband 2 cases across Levels 1-3. | BA / Research Agent | Closed (Delivered and cataloged in `clue-ideas-inventory.md` with 25+ specific clue archetypes and cross-app chaining mechanics) |
| Q002 | Constraints | Success metric / analytics tracking in MVP. | User | Closed (No tracking for MVP, GA deferred to future) |
| Q003 | Constraints | Target age rating. | User | Closed (Confirmed 13+) |
| Q004 | Rules/Data | Retry case after wrong verdict. | User | Closed (Confirmed: Yes, retry allowed) |
| Q005 | Rules/Data | Suspicion limits, app counts, and PIN lock rules per level. | BA / User | Closed (Confirmed: L1: 3-4 clue apps, 0 lock, 5 strikes; L2: 5-6 clue apps, 1 lock, 4 strikes; L3: 7-8 clue apps, 2 locks, 3 strikes) |
| Q006 | Scope | Gated progression & advance mechanic. | User | Closed (Confirmed: Gated by previous level + "Tha thứ" button) |
| Q007 | Constraints | Platform & device support. | User | Closed (Confirmed: Mobile-first responsive web on iOS Safari / Android Chrome) |
| Q008 | Apps | Addition of Email, LinkedIn, and Teams apps and layout integration. | User | Closed (Confirmed: 11 apps across two 4-icon rows + 3 dock apps; GeeMail, InkedLin, Tim; generic folder taxonomy; security puzzle hooks) |
| Q009 | Gameplay | Scope revision: Less reading, small goals, anytime confrontation with excuses, Giác Quan Thứ 6 hint, universal pinning, level-based app limits. | User | Closed (Confirmed: L1: 3-4 apps, L2: 5-6 apps, L3: 8 apps; anytime confrontation with excuse engine; Giác Quan Thứ 6 app-pointer hint; universal pinning; mini-games & paywalls deferred to Phase 2) |

## Referenced Documents

- [clue-ideas-inventory.md](../../stories/clues/clue-ideas-inventory.md): Canonical Single Source of Truth catalog of clue archetypes across apps, puzzle chaining examples, and home screen visibility rules.
- [apps-features-architecture.md](../../project-knowledge-base/solution-context/architecture/apps-features-architecture.md): Canonical Software Architecture Document for 11-app ecosystem.

## Next Step
Stakeholder confirmed and signed off. Baseline artifacts, SAD, and functional decomposition updated to 11 apps. Ready for story authoring and component development.
