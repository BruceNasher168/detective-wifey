---
type: App Design Specification
app_id: wife_notebook
app_name: Wife's Detective Notebook & Final Decision Hub
vietnamese_name: Sổ Tay Bắt Ghen Của Vợ
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Wife's Detective Notebook & Final Decision Hub."
tags: [app-design, wife-notebook, suspect-board, verdict-hub, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/wife-notebook/features.md
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
  * Omnipresent floating button $\ge 56 \times 56\text{px}$ with unread suspect counter badge.
  * Verdict radio selection cards $\ge 64\text{px}$ height with full-card tap targets.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Suspect Roster Tab (`SuspectRosterTabView`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            SỔ TAY BẮT GHEN           [ 🎀 ] │
├────────────────────────────────────────────────────────┤
│ [ 👥 Hồ sơ nghi phạm (3) ]     [ ⚖️ Phán quyết cuối cùng ]│
├────────────────────────────────────────────────────────┤
│ 📋 DANH SÁCH ĐỐI TƯỢNG KHẢ NGHI           [ ➕ Thêm ]  │
│                                                        │
│ 1. [ 🐱 ] Bé Mèo (Nguyễn Thị Mai)                      │
│    • Phát hiện tại: VietPay (Chuyển khoản 1k)          │
│    • Ghi chú: Nhắn tin xin lỗi lúc 23:45               │
│                                                        │
│ 2. [ ⚡ ] Anh Tuấn Thợ Điện                            │
│    • Phát hiện tại: LoZa (Tin nhắn ngọt ngào)          │
│    • Ghi chú: Gửi sticker trái tim, hẹn tối mai        │
│                                                        │
│ 3. [ 🤖 ] Em Yêu Ảo (AI Girlfriend)                   │
│    • Phát hiện tại: LoZa (Gói cước VIP 99k)            │
│    • Ghi chú: Chat bot trả lời tự động                 │
├────────────────────────────────────────────────────────┤
│ 💡 Mẹo: Nhấn vào tab "Phán quyết" khi đã thu thập đủ!  │
└────────────────────────────────────────────────────────┘
```

### 3.2. Final Verdict Decision Hub Tab (`FinalVerdictDecisionHubView`)
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
│ [ Chọn từ danh sách nghi phạm: Bé Mèo ▼ ]              │
├────────────────────────────────────────────────────────┤
│                                                        │
│        [ 🔥 BẮT GHEN! ĐƯA RA PHÁN QUYẾT 🔥 ]           │
│                                                        │
└────────────────────────────────────────────────────────┘
```
