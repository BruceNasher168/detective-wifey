---
type: App Features Specification
app_id: husband_notes
app_name: Husband's Notes & Calendar
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Husband's Notes & Calendar."
tags: [app-features, husband-notes, calendar, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/personal-notes/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Husband's Notes & Calendar — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

This app is the husband's personal digital notebook on his phone. It holds his secret password hints (*which unlock other apps like VietPay or Hidden Photos*), his secret financial ledgers (*"quỹ đen"*), and calendar schedules that contradict his actual Grap ride destinations.

---

## 2. In-App Features & User Interactions

### 2.1. Note Archive & Pinning
* Search bar filtering note titles and body snippets.
* Pinned notes marked with a gold pushpin (`📌`).

### 2.2. Rich Text Note Reader
* Renders formatted Markdown headers, bullet points, checklists, and financial tables.

### 2.3. Agenda Schedule & Event Modals
* Day/week calendar view showing event blocks, locations, and time windows.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-NOTE-01` | `NoteReaderView` • Password Note | Read note "Mật khẩu quan trọng" -> Hint: *"Ngày đầu tiên ta chạm mặt tại Highland: DDMM"*. Provides PIN to unlock VietPay. | Unlock Mechanic | Medium |
| `CLUE-NOTE-02` | `NoteReaderView` • "Quỹ Đen" Ledger | Read income note -> Compares real freelance income vs official amount given to wife (*"Freelance 18tr - Nộp vợ 5tr"*). | Cheating or Innocent | Medium |
| `CLUE-NOTE-03` | `CalendarAgendaView` • Contradiction | Review schedule -> Calendar says *"OT Dự Án Sprint (19:00 - 23:30)"*, contradicting Grap late-night hotel trip. | Cheating | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Shopping List**: *"Trứng gà 10 quả, hành lá, nước mắm, tiêu sọ"*.
* **Motorcycle Maintenance**: *"Thay dầu xe máy Honda Air Blade ở mốc 15.000 km"*.
* **Dental Appointment**: Calendar event *"Khám răng định kỳ"* on Saturday 09:00.

---

## 5. Declarative Data Contract

```typescript
export interface HusbandNotesData {
  notes: Array<{
    noteId: string;
    title: string;
    bodyMarkdown: string;
    lastModified: string;
    isPinned?: boolean;
    clueRefId?: string;
  }>;
  calendarEvents: Array<{
    eventId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
    description?: string;
    clueRefId?: string;
  }>;
}
```
