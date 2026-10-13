---
type: App Design Specification
app_id: team-collaboration
app_name: Tim
real_world_parody: Microsoft Teams
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for Tim team collaboration application."
tags: [app-design, team-collaboration, tim, teams, microsoft-teams, ui-ux, design-system, branding]
timestamp: "2026-10-13T19:10:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/team-collaboration/features.md
---

# Tim — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Tim** (Satirical parody of *Microsoft Teams*, playing on Vietnamese word *Tim* = Heart / Team) |
| **Slogan / Tagline** | *"Cùng nhau làm việc — OT tới sáng"* |
| **Real-World Parody** | Microsoft Teams mobile application (Enterprise messaging, channels, status updates). |
| **Trademark Defense** | Uses a signature Teams purple/indigo (`#464EB8`) paired with lavender accents. Icon features two overlapping corporate avatar silhouettes inside a rounded purple square with a lettermark "T". |
| **Visual Persona** | Corporate enterprise communication tool with presence status dots (Available, Busy, Away), status message quotes, and department channels. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   TIM COLOR PALETTE                    │
├────────────────────────────────────────────────────────┤
│ Primary Brand Purple: Microsoft Teams #464EB8          │
│ Lavender Accent:      Soft Lavender   #6264A7          │
│ Status Active:        Presence Green  #92C353          │
│ Status Busy / DND:    Presence Red    #C4314B          │
│ Status Away:          Presence Amber  #FFAA44          │
│ Canvas Background:    Light Gray      #F5F5F5          │
│ Card Surface:         Pure White      #FFFFFF          │
│ Text Primary:         Dark Slate      #252424          │
│ Text Secondary:       Medium Gray     #616161          │
│ Banner Notification:  Soft Purple Tint#EBEBF5          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Channel / Contact Name: Semibold ($15\text{px}$ / weight $600$).
  * Status Message Quote: Italic / Regular ($13\text{px}$ / text secondary `#616161`).
  * Message Bubble: Regular ($14\text{px}$ / line-height $1.4$).
  * Channel Header: Bold ($16\text{px}$ / weight $700$).
* **Ergonomics & Touch Targets**:
  * Top navigation header & status chip: $\ge 48\text{px}$ height.
  * Channel item / Chat row height: $\ge 64\text{px}$ with full-width touch area.
  * Presence indicator badge: $12 \times 12\text{px}$ circular chip pinned to bottom-right of avatar.
  * Bottom navigation tabs (`Hoạt động`, `Trò chuyện`, `Nhóm`, `Lịch`): $\ge 44\text{px}$ height.

---

## 3. UI Wireframes & Layout Architecture

```
┌────────────────────────────────────────────────────────┐
│ 23:45             [ Dynamic Island ]    [Signal] 5G [Batt 42%]
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Avatar 🔴] Hoàng Minh Tuấn                 [🔍] [✏️]│ │
│ │  Status: "Đang họp kín dự án đặc biệt (DND) ⛔"    │ │
│ └────────────────────────────────────────────────────┘ │
│  [Trò chuyện]       [Nhóm]       [Lịch]       [Cuộc gọi]│
├────────────────────────────────────────────────────────┤
│ (Danh sách trò chuyện)                                 │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [IT] IT Support Helpdesk                   14:20   │ │
│ │      "Nhắc nhở: Mã PIN phòng IT mặc định là 4920"  │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ [Avatar 🟢] Lan Anh (Marketing)            23:10   │ │
│ │      "Anh xong việc chưa? Qua quán pub cũ nhé..."  │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ [Avatar ⚪] Sếp Hoàng (Director)           18:05   │ │
│ │      "Báo cáo tuần gửi trước sáng mai nhé Tuấn"    │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│                 ═══════ [ — ] ═══════                  │
└────────────────────────────────────────────────────────┘
```
