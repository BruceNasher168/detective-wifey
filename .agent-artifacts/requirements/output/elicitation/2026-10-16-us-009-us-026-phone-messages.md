---
status: signed-off
artifact_type: elicitation_session
elicitation_status: COMPLETE
created_at: "2026-10-16"
updated_at: "2026-10-16"
topic: "us-009-us-026-phone-messages"
---

# Phone & Messages - Elicitation Session

## Purpose & Scope

### Objective
Define US-009 and US-026 for investigating call records, contacts and SMS evidence in the virtual phone.

### Boundary
| Area | Current Position | Status |
|---|---|---|
| US-009 | Recents, All/Missed filters, contacts and contact notes | Confirmed |
| US-026 | Inbox/search, existing reaction timestamps, hotel SMS and canceled scheduled drafts; read-only | Confirmed |
| Exclusions | Phone favorites/keypad; sending, editing, deleting or adding reactions; scripted calls | Confirmed |

## PACT Baseline

### People
Player investigating the husband's virtual phone. Existing vision/scope defines Vietnamese players aged 13+; no persona change requested.

### Activities
Inspect calls and notes; read SMS and canceled drafts; inspect existing reaction times; collect narrative evidence.

### Context
Existing single-player detective game; both targets are refinements of planned Epic 01 slices, not new integrations.

### Technologies
Existing client-side virtual phone. No telephony, SMS provider or backend introduced.

## Rules & Data

### Rules
| Status | Rule |
|---|---|
| Confirmed | Phone is investigation-only; editing and deletion are unavailable. |
| Confirmed | Contact messaging opens an existing matching Messages thread. Missing thread displays “Không có cuộc trò chuyện”. |
| Confirmed | Calls provide unavailable feedback; no new dialogue or outgoing call occurs. |
| Confirmed | Messages are read-only, including existing reactions and canceled drafts. |
| Confirmed | Evidence collection requires a 380ms long-press on dynamic narrative data through StoryEvidenceTarget and UniversalEvidenceModal. Structural chrome and contact action rows are excluded. |
| Confirmed | Use Ionicons/vector SVG; no raw emoji icons or permanent evidence buttons. |

### Data
| Area | Detail | Status |
|---|---|---|
| Inputs | Current-level call records, contacts, threads, messages, reactions and canceled drafts | Confirmed |
| Source of Truth | Existing app features/design specifications, constrained by the user's target-specific decisions | Confirmed |
| Lifecycle | Inspection does not modify the source narrative; evidence collection uses the existing shared evidence flow | Confirmed |

## Decisions & Constraints

| Type | Item | Rationale / Impact | Owner / Status |
|---|---|---|---|
| Decision | User selected investigation-only Phone, read-only Messages and local navigation/feedback | Answers confirmed in this conversation | User / Confirmed |
| Decision | User confirmed the combined summary and Phase 1 authoring plan | Authorizes this signed-off record, two draft stories, two ASCII wireframes, epic and decomposition updates | User / Confirmed |
| Decision | HTML follows separate ASCII signoff | No HTML authorization inferred from Phase 1 approval | User / Confirmed |
| Dependency | Existing shared shell, evidence modal and cross-app navigation | Reuse public integration points during implementation; no runtime audit performed | Delivery / Documented |
| Risk | Legacy app mockups show editing, compose actions, emoji and visible evidence CTAs | New target wireframes apply current project invariants and approved scope; original KB files remain preserved | BA / Documented |
| Risk | Historical one-week estimates have not been revalidated | Drafts do not claim implementation readiness or a delivery commitment | Team / Pending sizing |

## Open Questions (Parking Lot)

No unresolved discovery questions. ASCII approval and team sizing are later delivery gates.

## Referenced Documents

- [Vision & scope](../vision-scope.md)
- [Epic 01](../epic-01-virtual-phone-app-ecosystem/epic.md)
- [Decomposition](../functional-decomposition.md)
- [Phone features](../../../project-knowledge-base/solution-context/apps/phone-os/phone/features.md)
- [Phone design](../../../project-knowledge-base/solution-context/apps/phone-os/phone/app-design.md)
- [Messages features](../../../project-knowledge-base/solution-context/apps/phone-os/messages/features.md)
- [Messages design](../../../project-knowledge-base/solution-context/apps/phone-os/messages/app-design.md)
- User answers and explicit “Confirm and proceed” in the active conversation, 2026-10-16.

## Next Step

manage-requirement-artifacts and generate-wireframe author both draft stories and ASCII wireframes together under the approved plan. Present ASCII for explicit signoff before generating HTML. Both targets have COMPLETE, stakeholder-confirmed discovery coverage.
