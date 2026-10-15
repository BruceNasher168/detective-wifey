---
status: signed-off
artifact_type: elicitation_session
elicitation_status: COMPLETE
created_at: "2026-10-15T21:20:19+07:00"
updated_at: "2026-10-15T21:20:19+07:00"
topic: us-004-techcornbank
---

# US-004 techcornbank - Elicitation Session

## Purpose & Scope

### Objective
Define the banking inspection module already allocated to US-004 in Epic 01, using the banking features, app design, and universal design specifications.

### Boundary

| Area | Current Position | Status |
|---|---|---|
| MVP | Existing virtual-phone banking module; no new epic or platform scope. | Confirmed |
| In Scope | Balance visibility, transaction history and filters, receipt inspection, savings vaults and deposit histories, configured Level 2/3 PIN gates, configuration-driven shortcuts, and evidence collection. | Confirmed |
| Out of Scope | Player membership-theme, wallpaper, feng-shui, and zodiac customization; actual payment processing or undocumented transfer/QR/bill-payment workflows. | Confirmed |
| Delivery | Create this session, US-004, and an ASCII wireframe; update the epic inventory. HTML requires separate approval of the completed ASCII wireframe. | Confirmed |

## PACT Baseline

### People

| Persona / Role | Commercial Model | Demographics & Literacy | Devices & Hardware | Ergonomics & Preferences | Accessibility & Constraints | Jobs To Be Done (JTBD) & Pain Points | Status |
|---|---|---|---|---|---|---|---|
| Player investigating the husband's phone | Free B2C game | Existing Vietnamese age-13+ audience; unchanged from baseline | Existing mobile-first web phone shell; desktop access | Short investigation sessions and familiar app navigation | Universal accessibility and Vietnamese interface requirements | Inspect financial records and compare them with other case evidence | Confirmed |

### Activities
- Open the active banking app, inspect account information, filter transactions, open complete receipts, inspect savings records, and collect case narrative evidence.
- Solve configured PIN challenges using clues in Notes or SMS; use the shared strike/lockout engine.

### Context
- Fictional detective gameplay inside the current level's virtual phone; no real banking integration.

### Technologies
- Existing client-side, declarative case-data architecture and shared phone-shell components. No source-code audit or implementation was requested.

## Rules & Data

### Rules

| Status | Rule |
|---|---|
| Confirmed | Follow banking `features.md`, except the user's explicit exclusion of theme customization. |
| Confirmed | Use the exact app display name `techcornbank` throughout project documentation, including canonical sources and specification examples. Runtime code changes are outside this documentation task. |
| Confirmed | Home contains the account summary and shortcuts, without a transaction feed or filters. Transactions are reached through account/history navigation, as confirmed in the follow-up answer. |
| Confirmed | Use the universal 380 ms narrative-data long-press and shared evidence overlay. No permanent pin/notebook button in ordinary views or receipts. |
| Confirmed | Keep case-defined appearance read-only. Retain the configuration-driven quick-action bar without exposing the excluded theme customizer. |
| Confirmed | Preserve the documented five banking clue types, including the innocent anniversary vault, and ordinary financial clutter without spoiler indicators. |
| Confirmed | Reuse configured shared PIN challenges on Level 2/3; Level 1 remains unlocked. |

### Data

| Area | Detail | Status |
|---|---|---|
| Inputs / Outputs | Account number, masked/actual balance, transaction direction/amount/time/counterparty/memo/category, receipt metadata, vault targets/balances/deposits, optional clue references and lock configuration. Output evidence is handled by the existing notebook system. | Confirmed |
| Source of Truth | Active case narrative supplies records; banking features and app design define inspection behavior. Sample names, balances, and timestamps illustrate layouts, not mandatory content for every level. | Confirmed |
| Lifecycle / Audit | Inspection must not edit case financial records. Notebook and lockout lifecycle remain owned by their shared systems. | Confirmed |

## Decisions & Constraints

| Type | Item | Rationale / Impact | Owner / Status |
|---|---|---|---|
| Decision | User answered “follow scope defined in feature.md” and “no them customisation”. | Apply the existing `features.md` scope with player theme/wallpaper customization excluded. | User / Confirmed |
| Decision | User approved the recommended file plan and added “use the app name \"techcornbank\"”. | Author story and ASCII now; align new filenames and epic entry with the approved display name. | User / Confirmed |
| Decision | Universal design governs evidence entry and typography when the banking mockup conflicts. | Remove the receipt's visible notebook shortcut; inherit universal text-size floors and Ionicons-only rules. | Approved plan / Confirmed |
| Dependency | Existing evidence overlay, notebook, phone shell, and PIN/strike engine. | Reuse documented shared behavior; no new parallel primitives. | Existing project specifications |
| Dependency | Case receipt metadata must be available to the receipt view. | The source `TechcornbankData` excerpt omits the separate receipt reference and beneficiary-account fields shown in the mockup. Implementers must map supplied case values; never fabricate them. | Case-data implementation |
| Dependency | Quick actions derive from case configuration. | Transfer, QR, and bill-payment workflows are not described in the supplied features; those controls do not introduce transaction creation in this story. | Banking feature boundary |
| Decision | Synchronize the app name across all documents and remove the source-preservation exception. | The user's follow-up explicitly authorizes updates to canonical banking sources and related documents. | User / Confirmed |
| Decision | Remove the Home transaction feed; align banking design, features, US-004, and ASCII. | The original local mockup put transactions on Home without verified real-app parity. The user selected account/history navigation instead. | User / Confirmed |
| Risk | Real-app screenshots have not been visually verified. | The official redesign announcement supports the account/history navigation direction, but the reduced game screen must not be described as a pixel-exact copy. | Recorded |
| Assumption | None introduced for banking providers, real integrations, PIN values, delivery estimates, or dates. | Use supplied evidence and existing global rules only. | Recorded |

## Open Questions (Parking Lot)

| ID | Area | Question | Needed From | Status / Notes |
|---|---|---|---|---|
| Q001 | Scope | Include all current banking features? | User | Closed: follow banking features, with the explicit customization exclusion. |
| Q002 | Rules/Data | Can the player change the case-selected theme? | User | Closed: no theme customization. |
| Q003 | Scope | Approve story, session, ASCII, and epic-inventory writes? | User | Closed: recommended plan approved, with app name changed to `techcornbank`. |
| Q004 | Rules/Data | Keep a transaction feed on Home or use account/history navigation? | User | Closed: remove the Home transaction feed, as selected in the follow-up. |

## Referenced Documents

- [Existing signed-off project elicitation](2026-10-13-jealous-wife-detective-game.md)
- [Vision & scope](../vision-scope.md)
- [Existing decomposition, US-004](../functional-decomposition.md)
- [Epic 01](../epic-01-virtual-phone-app-ecosystem/epic.md)
- [Banking features](../../../project-knowledge-base/solution-context/apps/banking/features.md)
- [Banking app design](../../../project-knowledge-base/solution-context/apps/banking/app-design.md)
- [Universal design](../../../project-knowledge-base/solution-context/design-system/design.md)
- [Accessibility and layout](../../../project-knowledge-base/solution-context/design-system/accessibility-layout.md)
- [Shared PIN lockpad](../../../project-knowledge-base/solution-context/apps/phone-os/pin-lockpad.md)
- [Shared navigation and motion](../../../project-knowledge-base/solution-context/design-system/behaviors-motion.md)
- User replies in this conversation on 2026-10-15: scope answers and approval with the `techcornbank` naming correction.
- User follow-up on 2026-10-15: update the name in all documents and remove the Home transaction feed.
- [Official Techcombank Mobile redesign announcement](https://techcombank.com/thong-tin/thong-bao/techcombank-ra-mat-giao-dien-hoan-toan-moi-nang-tam-trai-nghiem-tai-chinh-so): account/card management provides history access. The game's simplified layout remains a user-confirmed adaptation, not a visually verified reproduction.

## Next Step

Hand this complete, stakeholder-confirmed session to `manage-requirement-artifacts` and `generate-wireframe`. Create the draft US-004 and canonical ASCII wireframe, then request review of that wireframe. Do not create HTML until the user approves the completed ASCII artifact. No new decomposition or vision/scope rewrite is required for this existing story slice.
