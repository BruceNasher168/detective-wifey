---
type: Requirement Story
epic: "Epic 02: Clue Inspection, Puzzle Unlocks, Hints & Suspicion Engine"
status: draft
description: "First-use exploration and evidence capture taught through short prompts and gesture illustrations."
tags: [requirement, user-story, tutorial, level-0, evidence]
timestamp: "2026-10-21"
---

# US-032 - Level 0 Guided Evidence Collection

### Epic: [Investigation & Suspicion Mechanics](./epic.md)

As a Player, I want to practice inspecting and pinning information with guidance on my first use.

### Canonical Wireframe Reference

- [Approved ASCII wireframe, revision 2](./wireframes/wireframe-level-0-evidence-coaching.md).
- HTML preview is not included in this delivery.

### Acceptance Criteria

1. Level 0 guides opening the lesson's configured app, holding narrative content, pinning the selected information and opening the notebook. Each step presents one short Vietnamese prompt and a gesture illustration outside the content being inspected.
2. Prompts follow the approved sequence: “Mở [tên ứng dụng].”, “Nhấn giữ để xem.”, “Ghim vào sổ tay.” and “Mở sổ tay.” Substitute the configured app's display name without hardcoding a particular app.
3. A 380ms hold on eligible narrative content opens the shared evidence modal. Quick taps, scrolling, header controls and searches keep their existing behavior; they do not complete the hold lesson.
4. Only real successful actions advance the lesson. Opening the modal does not count as pinning, closing it does not complete the pin step, and animations never perform or record the action for the player.
5. The hold illustration fills a ring over 380ms on a neutral sample card. The pin illustration shows a pin landing; after a successful real pin, the card image travels toward the existing notebook entry. Reuse existing app and notebook transitions.
6. Demonstrations run at most twice, stop when the player acts and can be replayed through “Xem lại minh họa”. They never highlight the correct live clue, distinguish true clues from decoys, or add permanent pin controls.
7. Exploring another app or closing the modal leaves the current lesson available. Duplicate pins follow existing consolidation rules without duplicate cards or lesson credit. A save failure shows “Chưa ghim được.” with “Thử lại” and preserves saved findings.
8. “Bỏ qua” follows US-031 without marking the tutorial complete. Opening the notebook after a successful pin continues to US-033.

### Out of Scope

New app layouts, new evidence rules, automatic pinning, and teaching puzzle locks.

### Non-functional Requirements

| Requirement | Description |
|---|---|
| Visual accessibility | Use the approved SVG icons and illustrations. Reduced motion shows static hand-placement, hold and open stages; sound is not required. Controls retain accessible names and existing touch targets. |
| Interaction access | Coaching must not cover narrative content, navigation or notebook access, or intercept the action being taught. |

### Dependencies

[Shared evidence capture](./us-011-zero-spoiler-universal-long-press-clue-suspect-pinning.md), [tutorial entry](../epic-01-virtual-phone-app-ecosystem/us-031-level-0-entry-skip-replay.md), and [Level 0 content](../epic-04-detective-case-stories-level-content/us-034-level-0-practice-case-content.md).

### Open Questions

None for this teaching behavior. Exact practice content is supplied through US-034.

### Citations

[Tutorial discovery and approval](../elicitation/2026-10-21-level-0-tutorial-sixth-sense.md) and [signed-off 380ms capture rules](../elicitation/2026-10-20-us-011-us-016-pinning-confrontation.md).
