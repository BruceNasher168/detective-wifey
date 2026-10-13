---
type: App Design Specification
app_id: photos
app_name: Photos
real_world_parody: iOS Photos / Google Photos
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Photos gallery & media forensics app."
tags: [app-design, photos, gallery, media, visual-forensics, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/photos/features.md
---

# Photos — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Photos** (Parody of *iOS Photos* and *Google Photos*) |
| **Slogan / Tagline** | *"Kỷ niệm đáng nhớ — Góc khuất đáng ngờ"* |
| **Real-World Parody** | iOS Photos / Google Photos |
| **Trademark Defense** | Uses an immersive obsidian dark theme (`#000000`) with clean borderless photo tiles and a custom multi-petal camera aperture icon. |
| **Visual Persona** | High-contrast visual media gallery with full-screen pinch-to-zoom lightbox and interactive forensic hotspot inspection. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   PHOTOS COLOR PALETTE                 │
├────────────────────────────────────────────────────────┤
│ Background Canvas:    Obsidian Black  #000000          │
│ Tile Card:            Charcoal Dark   #1C1C1E          │
│ Highlight Accent:     Electric Blue   #2979FF          │
│ Lock Badge:           Amber Yellow    #FFC107          │
│ Text Primary:         Pure White      #FFFFFF          │
│ Text Metadata:        Muted Gray      #8E8E93          │
│ Forensic Magnifier:   Cyan Ring       #00E5FF          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Date Section Header: Bold sans-serif ($18\text{px}$).
  * Metadata / Geotag: Regular ($13\text{px}$).
* **Ergonomics & Touch Targets**:
  * Double-tap to zoom or pinch-to-zoom on full-screen images.
  * Info sheet drawer toggle button $\ge 44 \times 44\text{px}$.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Gallery Grid Screen (`PhotoGridView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]                 Ảnh               [ ⚙️ ] │
├────────────────────────────────────────────────────────┤
│ [ Tất cả ảnh ]             [ Album ]         [ 🔒 Đã ẩn ]│
├────────────────────────────────────────────────────────┤
│ HÔM NAY - 13/10/2026                                   │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐│
│ │ 🍷 Bữa tối│ │ 🚗 Xe ô tô│ │ 🐱 Mèo con│ │ 🍜 Bát phở││
│ │ (Phản chiếu)│ │(Túi xách nữ)│ │           │ │           ││
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘│
├────────────────────────────────────────────────────────┤
│ HÔM QUA - 12/10/2026                                   │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐│
│ │ 🏢 Công ty│ │ ☕ Cafe   │ │ 📑 Hợp đồng│ │ 🅿️ Vé xe  ││
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘│
├────────────────────────────────────────────────────────┤
│ 🔒 MỤC BỊ ẨN (2 ẢNH)                       [ MẬT MÃ ]  │
│    Chạm để mở khoá bằng mã PIN 4 số                     │
└────────────────────────────────────────────────────────┘
```

### 3.2. Forensic Lightbox Screen (`PhotoLightboxView`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            13/10/2026 21:30          [ ℹ️ ] │
├────────────────────────────────────────────────────────┤
│                                                        │
│             ┌─────────────────────────┐                │
│             │   [ 🔍 BẬT KÍNH LÚP ]   │                │
│             │                         │                │
│             │   🍷 Ly rượu vang       │                │
│             │      (Bóng bàn tay phụ  │                │
│             │       nữ làm móng đỏ)   │                │
│             │                         │                │
│             └─────────────────────────┘                │
│                                                        │
├────────────────────────────────────────────────────────┤
│ THÔNG TIN ẢNH:                                         │
│ 📍 Địa điểm: Nhà hàng The Deck Saigon - Thảo Điền      │
│ 📷 Camera: iPhone 15 Pro Max • Tiêu cự 24mm            │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Bằng Chứng vào Sổ Tay Bắt Ghen ]              │
└────────────────────────────────────────────────────────┘
```
