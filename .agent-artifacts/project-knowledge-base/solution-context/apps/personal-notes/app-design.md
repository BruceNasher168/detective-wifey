---
type: App Design Specification
app_id: husband_notes
app_name: Husband's Notes & Calendar
real_world_parody: Apple Notes & Google Calendar
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the husband's phone notes and calendar utility."
tags: [app-design, husband-notes, calendar, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
---

# Husband's Notes & Calendar — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Ghi Chú & Lịch** (Parody of *Apple Notes* and *Google Calendar*) |
| **Slogan / Tagline** | *"Việc cần làm — Điều cần giấu"* |
| **Real-World Parody** | Apple Notes / Google Calendar |
| **Trademark Defense** | Merges lined note paper textures with modern agenda time-blocks. Uses warm parchment yellow (`#FFF9E6`) and calendar sapphire blue (`#1A73E8`). |
| **Visual Persona** | Target smartphone productivity utility. Intimate personal memos, password hints, secret financial stashes, and conflicting calendar appointments. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│             HUSBAND'S NOTES COLOR PALETTE              │
├────────────────────────────────────────────────────────┤
│ Note Surface:         Warm Parchment  #FFF9E6          │
│ Calendar Primary:     Sapphire Blue   #1A73E8          │
│ Pinned Note Badge:    Golden Amber    #F9A825          │
│ Text Ink Primary:     Charcoal Ink    #202124          │
│ Text Body:            Dark Lead       #374151          │
│ Agenda Block Bg:      Soft Sky        #E8F0FE          │
│ Divider Line:         Pale Sand       #E5E7EB          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Note Header: Casual handwritten script ($18\text{px}$).
  * Ledger / Table Text: Monospace ($14\text{px}$).
  * Calendar Event Time: Bold sans-serif ($14\text{px}$).
* **Ergonomics & Touch Targets**:
  * Top switcher tabs (*Ghi chú, Lịch biểu*) $\ge 48\text{px}$ height.
  * Note cards expand on full-card touch.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Notes & Schedule View (`NotesListView` / `CalendarAgendaView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]             Ghi chú & Lịch        [ ➕ ] │
├────────────────────────────────────────────────────────┤
│ [ 📝 Ghi chú (4) ]                   [ 📅 Lịch biểu ]  │
├────────────────────────────────────────────────────────┤
│ 📌 Mật khẩu quan trọng                     12/10/2026  │
│    Pass thẻ ngân hàng: Ngày đầu tiên ta chạm mặt tại   │
│    Highland Nhà Thờ: DDMM                              │
├────────────────────────────────────────────────────────┤
│ 📑 Thu nhập ngoài (Quỹ Đen)                05/10/2026  │
│    Freelance tháng 9: 18tr (Nộp vợ: 5tr, Giấu: 13tr)   │
├────────────────────────────────────────────────────────┤
│ 🛒 Danh sách đồ cần mua                    01/10/2026  │
│    Trứng gà, hành lá, nước mắm, tiêu sọ                │
├────────────────────────────────────────────────────────┤
│ 📅 LỊCH TRÌNH - 13/10/2026                             │
│    19:00 - 23:30 • OT Sprint Dự Án Khẩn Cấp           │
│    📍 Địa điểm: Văn phòng công ty tầng 12              │
└────────────────────────────────────────────────────────┘
```

### 3.2. Note Reader Screen (`NoteReaderView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trở lại]             MẬT KHẨU QUAN TRỌNG     [ 🗑️ ] │
├────────────────────────────────────────────────────────┤
│ Ngày sửa đổi: 12/10/2026 lúc 21:10                     │
├────────────────────────────────────────────────────────┤
│ • Pass vali du lịch: 1204                              │
│ • Pass thẻ ngân hàng techcornbank:                          │
│   Ngày đầu tiên ta chạm mặt tại Highland Nhà Thờ       │
│   Định dạng: DDMM                                      │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm gợi ý vào Sổ Tay Bắt Ghen ]                  │
└────────────────────────────────────────────────────────┘
```
