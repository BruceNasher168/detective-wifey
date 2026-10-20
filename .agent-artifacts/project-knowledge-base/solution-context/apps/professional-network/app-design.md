---
type: App Design Specification
app_id: professional-network
app_name: InkedLin
real_world_parody: LinkedIn
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for InkedLin professional networking application."
tags: [app-design, professional-network, inkedlin, linkedin, ui-ux, design-system, branding]
timestamp: "2026-10-13T19:10:00+07:00"
---

# InkedLin - App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **InkedLin** (Satirical parody of *LinkedIn*) |
| **Slogan / Tagline** | *"Kết nối sự nghiệp - Mở rộng quan hệ... ngoài luồng"* |
| **Real-World Parody** | LinkedIn mobile app (Professional networking & corporate feed). |
| **Trademark Defense** | Adopts a royal navy blue (`#0A66C2`) badge with rounded square frame and stylized stylized "in" ligature featuring a subtle quill/ink droplet icon. |
| **Visual Persona** | Corporate, high-density professional networking feed displaying corporate updates, job titles, milestone congratulations, and direct messages (InMail). |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                 INKEDLIN COLOR PALETTE                 │
├────────────────────────────────────────────────────────┤
│ Primary Brand Blue:   LinkedIn Blue   #0A66C2          │
│ Dark Accent:          Deep Charcoal   #191919          │
│ Background Canvas:    Warm Gray       #F3F2F0          │
│ Card Surface:         Pure White      #FFFFFF          │
│ Secondary Text:       Muted Slate     #666666          │
│ Connection Button:    Outlined Blue   #0A66C2          │
│ Milestone Gold:       Badge Amber     #B27B00          │
│ Border Divider:       Soft Gray       #E0E0E0          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Member Name: Bold ($15\text{px}$ / weight $700$).
  * Job Headline / Sub-title: Regular ($13\text{px}$ / text secondary `#666666`).
  * Post Content / Bio: Regular ($14\text{px}$ / line-height $1.4$).
  * Milestone Banner Text: Semibold ($13\text{px}$ / weight $600$).
* **Ergonomics & Touch Targets**:
  * Top navigation / search bar height: $\ge 48\text{px}$.
  * Bottom or sub-tab items (`Bảng tin`, `Mạng lưới`, `Thông báo`, `Tin nhắn`): $\ge 44\text{px}$ touch targets.
  * Connect / Congratulate CTA buttons: $\ge 36\text{px}$ height with generous padding.

---

## 3. UI Wireframes & Layout Architecture

```
┌────────────────────────────────────────────────────────┐
│ 23:45             [ Dynamic Island ]    [Signal] 5G [Batt 42%]
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ [in] 🔍 Tìm kiếm đồng nghiệp, công ty...   [💬 Tin]│ │
│ └────────────────────────────────────────────────────┘ │
│  [Bảng tin]      [Mạng lưới]      [Thông báo]          │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Avatar] Hoàng Minh Tuấn • 1st                     │ │
│ │          Senior Tech Lead @ TechCorp VN            │ │
│ │          Kỷ niệm 5 năm làm việc tại TechCorp 🎉    │ │
│ │          (Bắt đầu từ: 15/09/2021)                  │ │
│ │                                                    │ │
│ │ "Biết ơn hành trình 5 năm gắn bó cùng anh em..."   │ │
│ │ 👍 42 Thích  💬 18 Bình luận                       │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ [Avatar] Thảo HR • Talent Acquisition              │ │
│ │          Đã xem hồ sơ của bạn 15 lần hôm nay       │ │
│ │          "Anh ơi khi nào rảnh cà phê trao đổi      │ │
│ │          cơ hội hợp tác riêng nhé 😉"              │ │
│ │          [ Kết nối ]      [ Bỏ qua ]               │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│                 ═══════ [ - ] ═══════                  │
└────────────────────────────────────────────────────────┘
```
