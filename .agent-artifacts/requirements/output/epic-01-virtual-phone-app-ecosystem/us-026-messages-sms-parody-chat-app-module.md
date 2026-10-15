---
type: Requirement Story
epic: "Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)"
status: draft
description: "Read-only SMS inbox, message search, reaction times and canceled draft inspection."
tags: [requirement, user-story, screen, messages]
timestamp: "2026-10-16"
---

# US-026 - Messages SMS & Parody Chat App Module

### Epic: [Epic 01](./epic.md)

As a Player, I want to browse SMS conversations, inspect booking confirmations, view existing reaction times and inspect canceled scheduled drafts.

### Canonical Wireframe Reference

- [ASCII Wireframe - Screen SSOT](./wireframes/wireframe-messages-investigation.md)
- Interactive HTML: pending ASCII signoff; not generated.

### Acceptance Criteria

1. Opening a provisioned Messages app displays current-level conversations with supplied sender names, previews, narrative dates and unread indicators. Supplied pinned conversations remain viewable; pinning controls are absent.
2. Search filters conversations by sender name or message text within current-level data. Clearing the query restores the inbox; no matches displays “Không tìm thấy cuộc trò chuyện”. Search does not modify messages.
3. Selecting a conversation displays its supplied message history with sender/recipient alignment, narrative timestamps and booking details when present. Back returns to the inbox. No compose/send, edit, delete or reaction-creation controls appear.
4. Hotel booking SMS mapped to `CLUE-MSG-01` preserves supplied booking dates, guest counts and special requests. The app does not invent missing reservation fields or label a thread as decisive evidence.
5. Tapping an existing reaction displays its recorded timestamp. Reaction symbols use canonical Ionicons/vector SVG rather than raw emoji. Reactions cannot be added, replaced or removed.
6. A conversation containing a canceled scheduled draft exposes a read-only draft inspector with supplied text, scheduled send time and cancellation time when available. `CLUE-MSG-02` maps to the configured canceled draft; the player cannot send, reschedule or restore it.
7. Holding a narrative message, reaction record or canceled-draft body for 380ms opens the existing blurred UniversalEvidenceModal through StoryEvidenceTarget. Ordinary narrative items receive the same interaction as clues. Search, headers, navigation and draft-opening controls never receive evidence overlays.
8. Releasing before 380ms or beginning a scroll cancels the hold. Short taps do not collect evidence; reaction taps only inspect timestamps. Closing the shared modal preserves source narrative data; evidence uses the shared collection flow without a permanent “Ghim” button.
9. Phone contact messaging opens an existing matching thread only when Messages is provisioned and the match exists. Otherwise Phone retains its view and displays “Không có cuộc trò chuyện”; no synthetic conversation is created.
10. Empty inbox, unavailable thread, absent draft and absent reaction-time data use the exact states in the wireframe. A closed draft returns to its thread; the shell Home action returns to the launcher.

### Out of Scope

| ID | Description |
|---|---|
| OOS01 | Sending, composing, editing, deleting, changing reactions, restoring or scheduling drafts |
| OOS02 | Real SMS/provider integration, new conversation creation and new narrative clues |

### Non-functional Requirements

| Requirement | Description |
|---|---|
| Platform | Follow existing [global NFRs](../vision-scope.md#4-key-constraints--non-functional-requirements-global); no new service or SLA override. |
| Interaction | Controls at least 44 x 44px; search at least 48px high; existing shell and Ionicons/vector SVG; Vietnamese UI. |
| Source integrity | Reading, searching and inspecting reactions/drafts do not modify source narrative or make network requests. |

### Open Questions

None for confirmed behavior. ASCII signoff and team sizing remain pending; status stays draft.

### Citations

- [Signed-off target discovery](../elicitation/2026-10-16-us-009-us-026-phone-messages.md)
- [Messages features](../../../project-knowledge-base/solution-context/apps/phone-os/messages/features.md)
- [Messages design](../../../project-knowledge-base/solution-context/apps/phone-os/messages/app-design.md)
