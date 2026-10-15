---
type: App Design Specification
app_id: wife_notebook
app_name: Wife's Detective Notebook & Final Decision Hub
vietnamese_name: Sổ Tay Bắt Ghen Của Vợ
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Wife's Detective Notebook & Final Decision Hub."
tags: [app-design, wife-notebook, suspect-board, evidence-locker, verdict-hub, ui-ux, design-system, branding]
timestamp: "2026-10-14T13:00:00+07:00"
---

# Sổ Tay Bắt Ghen Của Vợ — App Design & UI/UX Specification

> **Design System Reuse & Inheritance**:
> Sổ Tay Bắt Ghen Của Vợ inherits the global [Phone OS Master Design System](../app-design.md) for its physical container dimensions, `.glass-elevated` modal sheet backdrop blur, AssistiveTouch integration, and touch target standards ($\ge 44 \times 44\text{px}$). This document defines the domain-specific fuchsia detective journal visual overlay.

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **Feature Name** | **Sổ Tay Bắt Ghen** (*Wife's Detective Notebook & Final Decision Hub*) |
| **Slogan / Tagline** | *"Lưới trời lồng lộng — Tay vợ khó thoát"* |
| **Real-World Parody** | Detective Case Dossier / Marital Journal |
| **Visual Persona** | Playful, dramatic, and empowering. Styled like a spiral-bound pink/fuchsia detective notebook with sticker stamps, highlighter notes, and paper clip accents. |
| **Architectural Role** | Omnipresent floating tool on the virtual phone shell container, inheriting Phone OS floating button tokens. Accessible from any screen via a floating action button (FAB) or the AssistiveTouch menu (`../app-design.md`). |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│               WIFE'S NOTEBOOK COLOR PALETTE            │
├────────────────────────────────────────────────────────┤
│ Cover / Primary:      Fuchsia Rose    #D81B60          │
│ Paper Canvas:         Cream Parchment #FFFDF7          │
│ Sticky Note Accent:   Canary Yellow   #FFF59D          │
│ Accent Stamp:         Crimson Stamp   #C2185B          │
│ Verdict Confirm CTA:  Electric Purple #8E24AA          │
│ Innocent Green Badge: Emerald Leaf    #2E7D32          │
│ Cheating Red Badge:   Danger Red      #D32F2F          │
│ Sugar Purple Badge:   Grape Violet    #7B1FA2          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Notebook Header: Playful casual handwritten script ($18\text{px}$).
  * Suspect Name: Bold sans-serif ($16\text{px}$).
  * Verdict Decision CTA: Bold uppercase ($16\text{px}$ / weight $800$).
* **Ergonomics & Touch Targets**:
  * Omnipresent floating button $\ge 56 \times 56\text{px}$ with total item counter badge.
  * Verdict radio selection cards $\ge 64\text{px}$ height with full-card tap targets.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Contextual Long-Press Pinning Action Sheet (`LongPressPinActionSheet`)

> **Trigger**: Long-press ($\ge 450\text{ms}$) on any interactive element in any parody app.  
> **Backdrop**: Translucent dimming overlay with `.glass-elevated` bottom sheet. Zero spoilers on parent screen.

```
┌────────────────────────────────────────────────────────┐
│                        ══════                          │
│                   THÊM VÀO SỔ TAY                      │
├────────────────────────────────────────────────────────┤
│ 📋 Đoạn thông tin đã chọn:                              │
│ "Thu Trang | Chung cư mini số 12 ngõ 85 Chùa Láng"     │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 👥 Ghim làm Đối Tượng Tình Nghi                ] │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 🔍 Ghim làm Manh Mối / Bằng Chứng              ] │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [ Huỷ bỏ                                             ] │
└────────────────────────────────────────────────────────┘
```

---

### 3.2. Investigation Dossier Tab (`InvestigationDossierTabView`)

> **Layout**: 2-tab segmented control. Tab 1 houses a dual-section vertical dossier containing the Suspects Board and the Evidence Locker, with interactive evidence-to-suspect linking affordances.

```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            SỔ TAY BẮT GHEN           [ 🎀 ] │
├────────────────────────────────────────────────────────┤
│ [ 📋 Hồ sơ điều tra (2/3) ]    [ ⚖️ Phán quyết & Đối chất ]│
├────────────────────────────────────────────────────────┤
│ 👥 DANH SÁCH ĐỐI TƯỢNG TÌNH NGHI (2)                   │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 🐱 ] Bé Mèo (Thu Trang)             [ 🗑️ Xoá ]   │ │
│ │ • Phát hiện tại: Techcornbank (Chuyển khoản 1k)         │ │
│ │ • Ghi chú: Nhắn tin xin lỗi lúc 23:45              │ │
│ │ 🔗 Bằng chứng đã liên kết (1):                     │ │
│ │    - [ 🛍️ Shopoo ] Váy ngủ lụa Size S [ ✕ Gỡ ]     │ │
│ │ [ ➕ Gắn thêm bằng chứng từ kho                  ] │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ ⚡ ] Anh Tuấn Thợ Điện               [ 🗑️ Xoá ]   │ │
│ │ • Phát hiện tại: Zola                              │ │
│ │ • Ghi chú: Hẹn tối mai qua lắp ống nước            │ │
│ │ 🔗 Bằng chứng đã liên kết (0):                     │ │
│ │   (Chưa có bằng chứng nào được gán)                │ │
│ │ [ ➕ Gắn bằng chứng từ kho                       ] │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ 🔍 KHO MANH MỐI & BẰNG CHỨNG THU THẬP (3)              │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 🛍️ Shopoo ] Váy ngủ lụa Size S      [ 🗑️ Xoá ]   │ │
│ │ • Chi tiết: Váy ngủ Size S (Vợ mặc Size L). 680k.   │ │
│ │ • Trạng thái: 🔗 Đã gán cho [ Bé Mèo ]             │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 💬 Zola ] Tin nhắn rủ đi ăn đêm     [ 🗑️ Xoá ]   │ │
│ │ • Chi tiết: "Ăn bún đậu quán cũ nhé anh iu". 22:15.│ │
│ │ • Trạng thái: ⚪ Chưa liên kết đối tượng             │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 📸 Photos ] Ảnh chụp vô lăng xe hơi  [ 🗑️ Xoá ]   │ │
│ │ • Chi tiết: Có bóng người nữ lạ phản chiếu trên kính│ │
│ │ • Trạng thái: ⚪ Chưa liên kết đối tượng             │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ 💡 Mẹo: Nhấn tab "Phán quyết" khi đã liên kết đủ chứng cứ!│
└────────────────────────────────────────────────────────┘
```

---

### 3.3. Final Verdict Decision Hub Tab (`FinalVerdictDecisionHubView`)

```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]          PHÁN QUYẾT CUỐI CÙNG        [ ⚖️ ] │
├────────────────────────────────────────────────────────┤
│ BƯỚC 1: BẢN CHẤT SỰ THẬT LÀ GÌ?                        │
│ ( ) 🟢 Chồng Ngoan / Vô Tội (Bị oan)                   │
│ (•) 🔴 Ngoại Tình / Gian Díu                           │
│ ( ) 🟣 Nuôi Sugar Baby / Có Sugar Mommy                │
├────────────────────────────────────────────────────────┤
│ BƯỚC 2: AI LÀ KẺ THỨ BA?                               │
│ [ Chọn từ danh sách nghi phạm: Bé Mèo (1 bằng chứng) ▼]│
├────────────────────────────────────────────────────────┤
│                                                        │
│        [ 🔥 BẮT GHEN! ĐƯA RA PHÁN QUYẾT 🔥 ]           │
│                                                        │
└────────────────────────────────────────────────────────┘
```
