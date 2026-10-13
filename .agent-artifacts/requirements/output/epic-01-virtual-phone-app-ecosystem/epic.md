---
type: Requirement Epic
status: draft
description: "Virtual smartphone shell, system status bar, universal 8-app home screen launcher grid, and modular parody application suite."
tags: [requirement, epic, phone-shell, parody-apps]
timestamp: "2026-10-13T17:35:00+07:00"
---

# Epic 01: Virtual Phone Shell & Modular Parody App Suite

## Summary

The Virtual Phone Shell & Modular Parody App Suite establishes the central player interface for *Bắt được Tiểu tam* (Jealous Wife Detective Game). It emulates a modern Vietnamese husband's smartphone using an authentic iOS-inspired shell architecture, featuring a titanium bezel frame, Dynamic Island pill cutout, split iOS status bar, level-based dynamic home screen launcher (Level 1: 3–4 apps; Level 2: 5–6 apps; Level 3: 8–11 apps), dynamic notification toasts, in-app navigation headers, an iOS AssistiveTouch floating quick action menu, a Level Selector modal sheet, and pluggable micro-app integration contracts.

## Business Value

- Delivers the core immersive "phone snooping" experience central to the game's comedic premise.
- Limits the active apps per level to drastically reduce reading volume and eliminate cognitive overload for casual players.
- Provides an omnipresent iOS AssistiveTouch floating menu allowing players to return home, inspect the Wife's Detective Notebook, select levels, or restart cases from any screen.
- Provides a scalable, decoupled architecture (`AppDefinition`, `CaseConfig`, `LevelCatalog`) allowing future micro-apps and detective cases to be added via declarative data schemas without modifying the UI engine.

## High-Level Requirements

- Outer mobile frame container rendering realistic iOS smartphone ergonomics (393px × 852px viewport base, centered desktop frame).
- Apple Dynamic Island pill cutout with split status bar displaying narrative clock (*23:45*) on the left and status indicators (cellular signal, *5G*, battery glyph *42%*) on the right.
- Level-based dynamic iOS launcher layout displaying only active apps for the current level: Level 1 renders 3–4 apps (e.g. LoZa, Poshee, VietPay); Level 2 renders 5–6 apps; Level 3 renders 8–11 apps across two upper rows and a bottom frosted glass dock.
- Omnipresent iOS AssistiveTouch floating button expanding a quick menu: Home (`🏠`), Wife's Notebook (`🎀`), Level Selector (`🗂️`), Case Restart (`🔄`), and Fullscreen (`⛶`).
- Mobile browser chrome suppression: PWA standalone capability (`apple-mobile-web-app-capable`, `theme-color`), W3C Fullscreen API request on Android/desktop, iOS Safari Add-to-Home-Screen guidance sheet, and viewport scroll/rubber-band lock (`overscroll-behavior: none`).
- Level Selector modal sheet displaying 3 progressive case levels, earned star ratings (1 to 3 stars), and locked gating validation.
- Sub-100ms client-side screen switching between home screen launcher and mounted app views.
- Declarative case configuration schema engine statically bundled for zero runtime server dependencies.

## Business Outcome

Players experience a fluid, culturally authentic smartphone simulation where snooping feels natural and high-stakes. Game designers can deploy new cases and levels entirely through declarative TypeScript schemas.

## Business Rules

- **Level-Based App Launcher Provisioning**: The home screen launcher dynamically mounts only the active apps configured for that level (Level 1: 3–4 apps; Level 2: 5–6 apps; Level 3: 8–11 apps) to eliminate text fatigue and cognitive overload for early players.
- **Client-Side Latency SLA**: App switching and navigation transitions must complete in < 100ms with zero network round-trips.
- **100% Client-Side Privacy**: Zero server calls, zero telemetry, and zero cookie persistence.

## Dependencies

- **Upstream**: Signed-off elicitation session ([`2026-10-13-jealous-wife-detective-game.md`](../elicitation/2026-10-13-jealous-wife-detective-game.md)), Vision & Scope ([`vision-scope.md`](../vision-scope.md)), Functional Decomposition ([`functional-decomposition.md`](../functional-decomposition.md)).
- **Downstream**: Micro-app modules (US-003 through US-010, US-019 through US-021), Clue inspection & suspicion engine (Epic 02), Wife's notebook & verdict hub (Epic 03).

## User Stories

* [US-001 - Declarative Case & Content Schema Engine](us-001-declarative-case-content-schema-engine.md) - *Status: draft*
* [US-002 - Virtual Phone Shell Container & Level-Based App Grid](us-002-virtual-phone-shell-container-8-app-home-grid.md) - *Status: draft*

## GUI Specifications

* None recorded yet.

## Wireframes

* [Phone Shell & Launcher Interactive HTML Wireframe](wireframes/wireframe-phone-shell-launcher.html)
* [Phone Shell & Launcher ASCII Wireframe](wireframes/wireframe-phone-shell-launcher.md)

## Diagrams

* None currently required.

## Open Questions

* None. Scope and UX parameters verified against canonical project knowledge.

## Citations

* [Apps & Features Architecture](../../../project-knowledge-base/solution-context/architecture/apps-features-architecture.md)
* [Phone OS Master Design](../../../project-knowledge-base/solution-context/apps/phone-os/app-design.md)
* [Phone OS Shell Features](../../../project-knowledge-base/solution-context/apps/phone-os/shell/features.md)
