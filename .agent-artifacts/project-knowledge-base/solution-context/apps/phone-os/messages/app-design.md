---
type: App Design Specification
app_id: messages
app_name: Messages
real_world_parody: iOS Messages (iOS 26/27 Parody Edition)
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the native Messages SMS & chat app conforming to iOS 26/27 standards."
tags: [app-design, messages, sms, chat, tapbacks, text-effects, ui-ux, design-system, branding, ios27]
timestamp: "2026-10-14T13:00:00+07:00"
---

# Messages — App Design & UI/UX Specification

> **Parent Design Master**: [../app-design.md](../app-design.md)  
> **Functional Specification**: [features.md](features.md)  
> **Sister App (Phone)**: [../phone/app-design.md](../phone/app-design.md)  
> **Standard**: iOS 26/27 Messages Architecture (Dynamic Text Formatting, Tapbacks, Canceled Drafts)

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Messages** (Native iOS Messages Parody) |
| **Slogan / Tagline** | *"Nhắn một câu — Lộ cả đời"* |
| **Real-World Parody** | Native iOS Messages (iOS 26/27 Architecture) |
| **Trademark Defense** | Uses classic cellular green (`#34C759`) and parody iMessage blue (`#007AFF`) with Ionicons `chatbubble-ellipses-outline` vector icon. |
| **Visual Persona** | Clean system messaging inbox with brand sender verified badges, animated bubble tapbacks, and scheduled message draft inspectors. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   MESSAGES COLOR PALETTE               │
├────────────────────────────────────────────────────────┤
│ Background Canvas:    Pure White      #FFFFFF          │
│ iMessage Blue Bubble: Apple Royal Blue #007AFF         │
│ SMS Green Bubble:     Cellular Green  #34C759          │
│ Incoming Bubble:      Neutral Gray    #E9E9EB          │
│ Unread Indicator Dot: Royal Blue Dot  #007AFF          │
│ Tapback Badge Bg:     Frosted Slate   rgba(0,0,0,0.65) │
│ Text Primary:         Jet Black       #000000          │
│ Text Bubble White:    Pure White      #FFFFFF          │
│ Text Subtitle:        Neutral Gray    #8E8E93          │
└────────────────────────────────────────────────────────┘
```

* **Typography & Dynamic Scale**:
  * Sender Name: Semibold ($17\text{px}$ / $600$).
  * Message Snippet: Regular ($15\text{px}$ / $400$).
  * Timestamp: Tabular Regular ($13\text{px}$ / $400$).
  * Tapback Glyph: $16\text{px}$ emoji/stamp container.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Messages List Screen (`MessagesListView`)

Chronological inbox displaying pinned conversations, brand senders, and unread badges:
* Conversation rows and pinned contacts use the identity's persona-specific avatar. The open thread header keeps the same avatar beside the contact name; service senders use a business icon.

```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]               Tin nhắn          [ ✏️ ]   │
├────────────────────────────────────────────────────────┤
│ [ [Search] Tìm kiếm tin nhắn                          ]│
├────────────────────────────────────────────────────────┤
│ PINNED CONVERSATIONS (GIM HÀNG ĐẦU):                   │
│   (👤 Vợ Yêu)            (🏢 Sếp Dũng)                 │
│      Vợ Yêu                Sếp Dũng                    │
├────────────────────────────────────────────────────────┤
│ ● HOTEL_SAOMAI                                   Hôm qua│
│   Xac nhan dat phong VIP 2 khach ngay 15/10 thanh...   │
├────────────────────────────────────────────────────────┤
│   BDS_LONGTHANH                                12 Tháng 10│
│   Mo ban 50 lo dat nen so do Long Thanh gia dau tu...   │
├────────────────────────────────────────────────────────┤
│   VIETCOMBANK                                  11 Tháng 10│
│   TK 0011*** tang 15,000,000 VND. Ref: Tien thuong...   │
├────────────────────────────────────────────────────────┤
│ ● Em Trang Láng                                10 Tháng 10│
│   Anh bảo tối nay bận họp mà?                          │
├────────────────────────────────────────────────────────┤
│   Mẹ Đẻ                                        08 Tháng 10│
│   Cuối tuần này hai đứa có về quê ăn giỗ không con?    │
├────────────────────────────────────────────────────────┤
│ ══════════════════════ [ — ] ═════════════════════════ │
└────────────────────────────────────────────────────────┘
```

---

### 3.2. Chat Thread Screen with iOS 26/27 Tapbacks (`MessagesThreadView`)

Thread view featuring brand booking SMS and interactive message reactions:

```
┌────────────────────────────────────────────────────────┐
│ [< Tin nhắn]          HOTEL_SAOMAI             [ ℹ️ ]   │
│                      Brand SMS Tin Cậy                 │
├────────────────────────────────────────────────────────┤
│                  HÔM QUA - 13/10/2026                  │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Khách Sạn Sao Mai Boutique - Hồ Tràm]             │ │
│ │ Kính gửi Quý khách Nguyen Van A,                   │ │
│ │ Xac nhan dat phong VIP 2 khach:                    │ │
│ │ • Check-in: 14:00 ngay 15/10/2026                  │ │
│ │ • Check-out: 12:00 ngay 16/10/2026                 │ │
│ │ • Yeu cau dac biet: Set up hoa hong & ruou vang vang││
│ └────────────────────────────────────────────────────┘ │
│   20:15                                                │
│                                                        │
│                  HÔM NAY - 14/10/2026                  │
│                                                        │
│             ┌────────────────────────────────────────┐ │
│             │ Da nhan xac nhan, cam on resort.       │ │
│             └────────────────────────────────────────┘ │
│               [ ❤️ Yêu thích ] (Tapback)        20:18 │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🕒 [HẸN GIỜ GỬI ĐÃ HỦY - DRAFT]                     │ │
│ │ "Em chuẩn bị đồ đẹp nhé, mai anh qua đón."        │ │
│ └────────────────────────────────────────────────────┘ │
│   (Bản nháp hẹn giờ bị hủy lúc 23:50)                  │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Đặt Phòng Hotel vào Sổ Tay Bắt Ghen ]         │
├────────────────────────────────────────────────────────┤
│ [ + ] [ Tin nhắn iMessage                          ] [↑]│
├────────────────────────────────────────────────────────┤
│ ══════════════════════ [ — ] ═════════════════════════ │
└────────────────────────────────────────────────────────┘
```

* **iOS 26/27 Forensic Features**:
  * **Brand Hotel SMS**: Unambiguous evidence of room booking for 2 guests with champagne/rose setup (`CLUE-MSG-01`).
  * **Canceled "Send Later" Draft**: Husband drafted an unsent message scheduled for his mistress, acting as forensic timeline proof.
  * **Tapback Reactions**: Reaction bubbles showing timestamps of romantic acknowledgments.

---

## 4. Traceability & Associated Deliverables

* **Parent OS Master**: [../app-design.md](../app-design.md)
* **Functional Specification**: [features.md](features.md)
* **Sister App (Phone)**: [../phone/app-design.md](../phone/app-design.md)
* **Universal Design System**: [../../design-system/design.md](../../design-system/design.md)
