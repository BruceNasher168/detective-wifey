---
type: Requirement Story
epic: "Epic 02: Clue Inspection, Puzzle Unlocks, Hints & Suspicion Engine"
status: draft
description: "Free notebook hints with a 30-second cooldown, app-level direction and a spoiler-free notebook reminder."
tags: [requirement, user-story, hint, sixth-sense, notebook]
timestamp: "2026-10-21"
---

# US-022 - Giác Quan Thứ 6 (Sixth Sense) App-Badging Hint Engine

### Epic: [Investigation & Suspicion Mechanics](./epic.md)

As a Player, I want to request an app-level hint from the notebook when stuck.

### Canonical Wireframe Reference

- [Approved ASCII wireframe, revision 2](./wireframes/wireframe-sixth-sense.md).
- HTML preview is not included in this delivery.

### Acceptance Criteria

1. “Giác quan thứ 6” is a free tool inside the notebook in Level 0 and normal cases. It adds no floating hint button to investigative apps or the launcher.
2. With a required clue still uncollected, a valid request identifies its app from the active case's authored clue order. Show the app icon and “Xem [tên ứng dụng].” using its actual display name; never target an app outside that case.
3. “Về màn hình chính” returns to the launcher without changing notebook findings or automatically opening the app. Only the hinted app icon is marked after the request; its contents and the correct notebook connection remain unmarked.
4. The hint icon responds for at most two animation cycles, then retains a static marker. Collecting the target removes that marker without automatically issuing another hint. Changing cases removes the previous case's hint target and marker.
5. Each valid app hint or collected-all reminder starts a 30-second cooldown, including in Level 0. Display remaining seconds with a progress ring; disable new requests while other investigation actions remain available.
6. Repeated taps produce one result and never restart or queue the cooldown. Closing or reopening the notebook, changing screens or reloading preserves its real-time expiry; time spent in the background still counts.
7. With all required clues collected and the case unsolved, show the notebook icon and “Xem lại các mối liên hệ.” Do not identify the missing pair, correct suspect or final connection. This valid reminder counts as a hint use in Level 0.
8. Missing or invalid target data shows “Chưa có gợi ý.” with “Thử lại”. It neither starts a cooldown nor counts as successful hint use, and must not be treated as proof that all clues were collected.
9. A finished case does not accept new hint requests; existing result, replay and progression actions remain available.

### Out of Scope

Answer-revealing hints, paid hints, automatic evidence collection, and changes to confrontation scoring.

### Non-functional Requirements

| Requirement | Description |
|---|---|
| Accessible feedback | Use the approved SVG icons, labels and numeric countdown. Reduced motion uses static marking and numbers; assistive tools announce results without reading every second or moving focus unexpectedly. |
| State isolation | Keep hint targets within the active case and preserve notebook state. No server, account or analytics is introduced. |

### Dependencies

[Case schema](../epic-01-virtual-phone-app-ecosystem/us-001-declarative-case-content-schema-engine.md), [launcher](../epic-01-virtual-phone-app-ecosystem/us-002-virtual-phone-shell-container-8-app-home-grid.md), and [notebook](../epic-03-wife-notebook-verdict-social-sharing/us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md).

### Open Questions

None for the approved hint behavior. Animation appearance still requires visual verification during implementation.

### Citations

[Signed-off discovery and revision-2 approval](../elicitation/2026-10-21-level-0-tutorial-sixth-sense.md).
