---
type: Requirement Story
epic: "Epic 03: Wife's Detective Notebook, Anytime Confrontation & Social Sharing"
status: draft
description: "Guided notebook practice followed by independent deduction, safe retries and tutorial completion."
tags: [requirement, user-story, tutorial, level-0, notebook, confrontation]
timestamp: "2026-10-21"
---

# US-033 - Level 0 Guided Deduction & Completion

### Epic: [Wife's Notebook, Confrontation & Social Sharing](./epic.md)

As a Player, I want to practice notebook reasoning before independently finishing the introductory investigation.

### Canonical Wireframe Reference

- [Approved ASCII wireframe, revision 2](./wireframes/wireframe-level-0-deduction-completion.md).
- [Shared hint behavior](../epic-02-investigation-suspicion-mechanics/wireframes/wireframe-sixth-sense.md).
- HTML preview is not included in this delivery.

### Acceptance Criteria

1. The first notebook lesson uses “Nối hai thẻ liên quan.” with sample-card selection and a drawn-string illustration. Guide the first authored practice connection using existing card-selection and connection controls; do not connect live cards automatically.
2. With no pinned cards, show “Ghim thông tin trước.” and allow return to collection. Coaching must not obstruct the board or its controls.
3. Introduce Sixth Sense with “Thử Giác quan thứ 6.” and a touch demonstration. Record practice only after US-022 returns a valid app hint or collected-all reminder; a cooldown tap or failed request does not count.
4. After first-use guidance, collapse the demonstration to “Tìm mối nối cuối.” The player creates the final authored connection independently; neither coaching nor hints reveal its correct pair. Allow further exploration and optional hints.
5. “Sẵn sàng? Đối chất.” demonstrates the confrontation control without submitting. The player's actual submission invokes the existing automatic notebook-graph evaluation, with no manual evidence slots.
6. Premature or unsuccessful confrontation shows “Chứng cứ chưa đủ.” and allows continued investigation without losing Level 0. Preserve collected cards and connections. If a lesson remains unpractised, show “Còn thiếu [thao tác].” with that action substituted, without revealing the solution.
7. Mark the tutorial complete only after real exploration, inspection, long-press, pinning, notebook connection, at least one valid hint use, the final deduction and successful confrontation. A partial win or watched demonstration alone cannot satisfy completion.
8. Completion shows “XONG MÀN TẬP!” with a single badge animation and the illustrated rules “Thiếu chứng cứ: tăng nghi ngờ.”, “Chạm giới hạn: thua màn.” and “Giác quan thứ 6: chờ 30 giây.” These illustrate normal-case consequences without adding practice penalties. Offer “Vào Màn 1” and “Tập lại”.
9. Failure to evaluate completion shows “Chưa kiểm tra được.” with “Thử lại” or “Bỏ qua”, preserving findings without recording success. Entering Level 1 uses normal rules and does not carry over practice cards or immunity.

### Out of Scope

Case dialogue, new graph or scoring rules, answer-revealing guidance, and changes to normal-case outcomes.

### Non-functional Requirements

| Requirement | Description |
|---|---|
| Accessible coaching | Approved SVG gestures run at most twice, stop on real interaction and support replay. Reduced motion uses static before/after illustrations with accessible control names. |
| Safe practice | Illustrations never mutate the live graph or advance lessons. Practice mistakes do not delete findings or trigger case loss. |

### Dependencies

[Notebook](./us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md), [confrontation](./us-016-anytime-confrontation-hub-dynamic-excuse-engine.md), planned US-018 progression, [Sixth Sense](../epic-02-investigation-suspicion-mechanics/us-022-giac-quan-thu-6-sixth-sense-app-badging-hint-engine.md), [collection coaching](../epic-02-investigation-suspicion-mechanics/us-032-level-0-guided-evidence-collection.md), and [practice content](../epic-04-detective-case-stories-level-content/us-034-level-0-practice-case-content.md).

### Open Questions

Exact first and final authored connections await the separately approved Level 0 design in US-034. The tutorial mechanism is defined; this content dependency remains open for implementation.

### Citations

[Tutorial discovery and approval](../elicitation/2026-10-21-level-0-tutorial-sixth-sense.md) and [automatic confrontation rules](../elicitation/2026-10-20-us-011-us-016-pinning-confrontation.md).
