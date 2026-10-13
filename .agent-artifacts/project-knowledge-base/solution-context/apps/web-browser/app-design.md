---
type: App Design Specification
app_id: netsurf
app_name: NetSurf
real_world_parody: Safari / Google Chrome
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the NetSurf mobile browser app."
tags: [app-design, netsurf, browser, search, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/web-browser/features.md
---

# NetSurf — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **NetSurf** (Parody of mobile *Safari* and *Google Chrome*) |
| **Slogan / Tagline** | *"Lướt web không dấu vết — Trừ khi vợ kiểm tra"* |
| **Real-World Parody** | Safari / Chrome |
| **Trademark Defense** | Uses a frosted minimalist slate and neutral light gray palette (`#F2F2F7`) with a stylized compass-and-keyhole icon. |
| **Visual Persona** | Sleek, modern mobile browser with tab cards, incognito mode styling, and simulated web reader views. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   NETSURF COLOR PALETTE                │
├────────────────────────────────────────────────────────┤
│ Background Canvas:    Frosted Slate   #F2F2F7          │
│ Card / Address Bar:   Pure White      #FFFFFF          │
│ Incognito Canvas:     Midnight Dark   #1C1C1E          │
│ Accent Link:          Royal Indigo    #3F51B5          │
│ Search Query Icon:    Medium Slate    #6B7280          │
│ Text Primary:         Jet Black       #111827          │
│ Incognito Text:       Ghost White     #F9FAFB          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Address Bar URL: Regular monospace ($14\text{px}$).
  * Visited Page Title: Semibold ($15\text{px}$).
  * Search Query String: Italic ($14\text{px}$).
* **Ergonomics & Touch Targets**:
  * Bottom toolbar actions $\ge 48 \times 48\text{px}$.
  * History list item touch target height $\ge 52\text{px}$.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Browsing History Screen (`NetSurfHistoryView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]   [ 🔒 netsurf://history/today ]  [ ↻ ]  │
├────────────────────────────────────────────────────────┤
│ [ Lịch sử tìm kiếm ]                [ Thẻ đang mở (3) ]│
├────────────────────────────────────────────────────────┤
│ HÔM NAY - 13/10/2026                                   │
├────────────────────────────────────────────────────────┤
│ 🔍 "cách tắt định vị iphone mà vợ không biết"    23:15 │
│    netsurf.search/q=tat-dinh-vi-iphone                 │
├────────────────────────────────────────────────────────┤
│ 🔍 "xoá lịch sử zalo có khôi phục được không"    22:40 │
│    netsurf.search/q=xoa-tin-nhan-zalo                  │
├────────────────────────────────────────────────────────┤
│ 🌐 Diễn đàn Trải Nghiệm Sugar Baby & Sugar Daddy 21:05 │
│    diendan-tamsu.vn/topic-kinh-nghiem-chu-cap-sv       │
├────────────────────────────────────────────────────────┤
│ 📰 VnExpress - Giá vàng SJC hôm nay tăng kỷ lục  14:30 │
│    vnexpress.net/kinh-doanh/gia-vang-sjc               │
├────────────────────────────────────────────────────────┤
│ [ ⬅️ ]     [ ➡️ ]     [ 📑 Lịch sử ]     [ 🕶️ Ẩn danh ]│
└────────────────────────────────────────────────────────┘
```

### 3.2. Incognito Tab Switcher (`NetSurfTabSwitcherView`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]          THẺ ẨN DANH (INCOGNITO)     [ 🕶️ ] │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🕶️ Khách Sạn Tình Yêu Phố Cổ - Đặt Phòng VIP        │ │
│ │ 🌐 lovehotel-phoco.vn/booking-confirm-12048        │ │
│ │                                                    │ │
│ │ [ Xác nhận đặt phòng: 15/10 - 2 Khách ]            │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Khách Sạn Tình Yêu vào Sổ Tay Bắt Ghen ]     │
└────────────────────────────────────────────────────────┘
```
