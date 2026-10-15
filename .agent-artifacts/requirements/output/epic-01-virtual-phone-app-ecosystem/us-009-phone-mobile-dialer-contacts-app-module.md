---
type: Requirement Story
epic: "Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)"
status: draft
description: "Read-only inspection of recent calls, contacts and contact notes."
tags: [requirement, user-story, screen, phone]
timestamp: "2026-10-16"
---

# US-009 - Phone Mobile Dialer & Contacts App Module

### Epic: [Epic 01](./epic.md)

As a Player, I want to inspect recent calls, call durations, contacts and contact notes.

### Canonical Wireframe Reference

- [ASCII Wireframe - Screen SSOT](./wireframes/wireframe-phone-investigation.md)
- Interactive HTML: pending ASCII signoff; not generated.

### Acceptance Criteria

1. Opening Phone for a level that provisions it displays recent calls and navigation between “Gần đây” and “Danh bạ”. Favorites and keypad are absent.
2. Recents displays each supplied contact name or unknown number, incoming/outgoing/missed direction, narrative date/time and recorded duration for completed calls. Missed calls do not display a fabricated duration.
3. “Tất cả” shows all current-level records; “Gọi nhỡ” shows only missed calls. Changing filters does not modify or delete records.
4. The contacts directory lists current-level contacts. Selecting a contact or a recent call's information control opens contact details with the supplied name, initials, available numbers and expandable “Ghi chú”. Unknown callers display the available number without invented contact details.
5. The current-level narrative can supply the short late-night call pattern mapped to `CLUE-PHONE-01` and contact notes mapped to `CLUE-PHONE-02`. Sample names, times and door code in the wireframe are illustrative, not universal level facts.
6. Tapping “Nhắn tin” opens the existing Messages thread matched to that contact. An absent thread or unavailable Messages app displays “Không có cuộc trò chuyện” and keeps the player in Phone; no thread is created.
7. Tapping “Gọi điện” displays “Không thể gọi điện trong chế độ điều tra.” without opening device telephony or creating a call record. Contact editing/deletion, FaceTime and mail actions are unavailable.
8. Holding a narrative call record or contact-note block for 380ms opens the existing blurred UniversalEvidenceModal through StoryEvidenceTarget. Ordinary narrative records support the same interaction as clue-bearing records. Headers, tabs, filters, information buttons and contact action rows never trigger evidence inspection.
9. A short tap on an evidence target does not collect evidence. Releasing before 380ms or beginning a scroll cancels the hold. Closing the shared modal leaves narrative data unchanged; evidence collection uses the existing shared flow without a permanent “Ghim” button.
10. Empty recents, missed-call results and contacts display the exact copy specified in the wireframe. Closing contact details returns to its originating list; the shell Home action returns to the launcher.

### Out of Scope

| ID | Description |
|---|---|
| OOS01 | Favorites, keypad/T9, real or scripted calls, contact creation/editing/deletion and call-log deletion |
| OOS02 | New story clues, door-code puzzles, video calls and mail integration |

### Non-functional Requirements

| Requirement | Description |
|---|---|
| Platform | Follow existing [global NFRs](../vision-scope.md#4-key-constraints--non-functional-requirements-global); no new service or SLA override. |
| Interaction | Controls at least 44 x 44px; existing phone shell and Ionicons/vector SVG; Vietnamese UI; no raw emoji icons. |
| Source integrity | Inspection and unavailable-action feedback do not mutate story records or make network requests. |

### Open Questions

None for confirmed behavior. ASCII signoff and team sizing remain pending; status stays draft.

### Citations

- [Signed-off target discovery](../elicitation/2026-10-16-us-009-us-026-phone-messages.md)
- [Phone features](../../../project-knowledge-base/solution-context/apps/phone-os/phone/features.md)
- [Phone design](../../../project-knowledge-base/solution-context/apps/phone-os/phone/app-design.md)
