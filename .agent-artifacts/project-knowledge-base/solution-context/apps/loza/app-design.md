---
type: App Design Specification
app_id: loza
app_name: LoZa
real_world_parody: Zalo
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the LoZa private messaging app."
tags: [app-design, loza, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/loza/features.md
---

# LoZa — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **LoZa** (Satirical pun on *Zalo*) |
| **Slogan / Tagline** | *"Kết nối tình thân — Bí mật khó giấu"* |
| **Real-World Parody** | Zalo (dominant Vietnamese domestic messaging application) |
| **Trademark Defense** | Strict departure from Zalo's signature electric blue (`#0068FF`). LoZa adopts a deep cyan/teal primary theme (`#0E828A`) paired with a bespoke conversation-bubble-and-magnifier icon to completely eliminate passing-off / trademark infringement risks. |
| **Visual Persona** | Clean, intimate mobile chat platform with playful sticker stamps, heart badges, and clean bubble contrasts. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   LOZA COLOR PALETTE                   │
├────────────────────────────────────────────────────────┤
│ Primary Brand:        Deep Teal       #0E828A          │
│ Outgoing Bubble:      Pale Cyan       #E0F7FA          │
│ Incoming Bubble:      Neutral White   #FFFFFF          │
│ Canvas Background:    Ice Gray        #F3F6F8          │
│ Text Primary:         Slate Dark      #1A202C          │
│ Text Timestamp:       Cool Gray       #718096          │
│ Unread Badge / Alert: Coral Red       #FF5722          │
│ Locked Chat Border:   Amber Gold      #F59E0B          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Brand Header: Bold sans-serif ($18\text{px}$ / weight $700$).
  * Contact Name: Semibold ($16\text{px}$ / weight $600$).
  * Message Bubble Body: Regular ($15\text{px}$ / line height $1.4$).
  * Timestamp / Subtitle: Regular ($12\text{px}$ / weight $400$).
* **Ergonomics & Touch Targets**:
  * Back button (`< Trang chủ`) and search icon $\ge 44 \times 44\text{px}$.
  * Conversation list row minimum height: $72\text{px}$.
  * Message bubbles minimum touch padding: $12\text{px}$ horizontal, $10\text{px}$ vertical.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Conversation List Screen (`LoZaInboxView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]                 LoZa              [ 🔍 ] │
├────────────────────────────────────────────────────────┤
│ [ Tin nhắn (3) ]       [ Danh bạ ]       [ Khám phá ]  │
├────────────────────────────────────────────────────────┤
│ 📌 Anh Tuấn Thợ Điện           12:45        🔴 [ 1 ]   │
│    Em nhớ anh quá... Tối mai chỗ cũ nhé                │
├────────────────────────────────────────────────────────┤
│ 🔒 Tin nhắn bị ẩn              10:20        [ Mật mã ] │
│    Nhập mã PIN 4 số để xem                             │
├────────────────────────────────────────────────────────┤
│ 👨‍👩‍👧‍👦 Gia Đình Là Số 1             Hôm qua                 │
│    Mẹ: Cuối tuần này cả nhà về quê ăn giỗ...           │
├────────────────────────────────────────────────────────┤
│ 📢 BĐS Hưng Vượng Thông Báo     11/10                  │
│    Công ty thông báo lịch nghỉ lễ Quốc Khánh...        │
└────────────────────────────────────────────────────────┘
```

### 3.2. Chat Thread Screen (`LoZaChatThreadView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Quay lại]        Anh Tuấn Thợ Điện           [ ℹ️ ] │
│                     Vừa mới truy cập                   │
├────────────────────────────────────────────────────────┤
│ ⚠️ Tin nhắn tự xoá sau 24h đã được kích hoạt           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [12:30] Anh đang làm gì thế?                           │
│ [Ảnh: Sticker Gấu Mèo gửi nụ hôn 💕]                   │
│                                                        │
│            [12:35] Anh đang họp với sếp, lát anh nhắn  │
│                                                        │
│ [12:45] Nhớ anh quá, tối mai chỗ cũ nhé...             │
│ [Vị trí: 📍 Khách Sạn Sen Vàng - Phố Huế]              │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [ 🎙️ 0:14 ] "Bé cưng của anh đầm tay lắm..." [ ▶ ]    │
└────────────────────────────────────────────────────────┘
```

### 3.3. PIN Pad Modal (`LoZaPinModal`)
* Slide-up modal overlay ($320\text{px}$ width) displaying 4 PIN indicator dots and numeric keypad ($0\text{--}9$) with delete key.
* Failed attempts trigger shake animation and Suspicion Counter increment (+1 strike).
