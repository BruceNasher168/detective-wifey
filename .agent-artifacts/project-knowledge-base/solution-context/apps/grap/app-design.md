---
type: App Design Specification
app_id: grap
app_name: Grap
real_world_parody: Grab / Be
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Grap ride-hailing & food delivery app."
tags: [app-design, grap, transportation, food-delivery, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/grap/features.md
---

# Grap — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Grap** (Parody of *Grab* and *Be*) |
| **Slogan / Tagline** | *"Đưa đón tận tình — Lộ trình giấu kín"* |
| **Real-World Parody** | Grab / Be |
| **Trademark Defense** | Uses a distinct forest mint green (`#00B14F`) combined with deep charcoal slate (`#1F2937`) rather than Grab's neon green. Features a custom steering-wheel pin icon. |
| **Visual Persona** | Real-time mobility and food delivery interface with pickup/drop-off pins, vehicle badges, and delivery notes. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                    GRAP COLOR PALETTE                  │
├────────────────────────────────────────────────────────┤
│ Primary Brand:        Forest Mint Green #00B14F        │
│ Dark Accent:          Slate Charcoal    #1F2937        │
│ Card Surface:         Pure White        #FFFFFF        │
│ Background Canvas:    Light Platinum    #F3F4F6        │
│ Route Origin Pin:     Leaf Green        #10B981        │
│ Route Dest Pin:       Crimson Red       #EF4444        │
│ Food Tag Pill:        Soft Orange       #FFEDD5        │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Vehicle / Service Title: Bold sans-serif ($15\text{px}$).
  * Address & Route: Regular ($14\text{px}$ / line height $1.35$).
  * Fares: Bold ($16\text{px}$).
* **Ergonomics & Touch Targets**:
  * Service category tabs $\ge 48\text{px}$ height.
  * Activity cards expand on full-card touch.
  * Driver note bubble with high-contrast text.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Activity Feed Screen (`GrapActivityListView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]           Hoạt động Grap          [ 🎧 ] │
├────────────────────────────────────────────────────────┤
│ [ Di chuyển (3) ]       [ Đồ ăn (2) ]       [ Giao hàng ]│
├────────────────────────────────────────────────────────┤
│ 🚗 GrapCar • ĐÃ HOÀN THÀNH                       23:45 │
│    🟢 Điểm đón: Tòa nhà Keangnam Landmark 72           │
│    🔴 Điểm đến: Khách sạn Sao Mai - 45 Nguyễn Khang    │
│    Giá cước: 85.000 đ                                  │
├────────────────────────────────────────────────────────┤
│ 🛵 GrapBike • ĐÃ HOÀN THÀNH                      08:15 │
│    🟢 Điểm đón: Chung cư Imperia Garden                │
│    🔴 Điểm đến: Cty BĐS Hưng Vượng - Cầu Giấy          │
│    Giá cước: 32.000 đ                                  │
├────────────────────────────────────────────────────────┤
│ 🧋 GrapFood • ĐÃ HOÀN THÀNH                      15:20 │
│    Trà sữa MayCha - 2 ly Trà sữa trân châu đường đen   │
│    📍 Giao đến: Tòa nhà Techcombank, 191 Bà Triệu       │
│    📝 "Giao tận tay bạn Mai lễ tân giúp mình nhé"      │
└────────────────────────────────────────────────────────┘
```

### 3.2. Activity Detail Modal (`GrapRideDetailModal` / `GrapFoodDetailModal`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            CHI TIẾT CHUYẾN ĐI               │
├────────────────────────────────────────────────────────┤
│ Trạng thái:            Đã hoàn thành                   │
│ Thời gian:             13/10/2026 23:45                │
│ Loại dịch vụ:          GrapCar 4 chỗ                   │
├────────────────────────────────────────────────────────┤
│ LỘ TRÌNH:                                              │
│ 🟢 Điểm đón: Tòa nhà Keangnam Landmark 72              │
│ 🔴 Điểm đến: Khách sạn Sao Mai - 45 Nguyễn Khang       │
│ Khoảng cách: 4.8 km • Cước phí: 85.000 đ               │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Khách sạn Sao Mai vào Sổ Tay Bắt Ghen ]      │
└────────────────────────────────────────────────────────┘
```
