---
type: App Features Specification
app_id: messages
app_name: Messages
status: approved
description: "Comprehensive functional features, brand SMS verification, Tapback interactions, mundane clutter, and declarative schemas for Messages."
tags: [app-features, messages, sms, chat, clues, tapbacks, schema, functional-spec]
timestamp: "2026-10-14T13:00:00+07:00"
---

# Messages - Functional Features & Clue Integration Specification

> **Parent Architecture**: [../../architecture/apps-features-architecture.md](../../architecture/apps-features-architecture.md)  
> **UI/UX Design Specification**: [app-design.md](app-design.md)  
> **Sister App (Phone)**: [../phone/features.md](../phone/features.md)

---

## 1. Functional Overview

The native **Messages** application manages SMS conversations, enterprise brand notifications, and parody iMessage threads. Inspection of incoming brand messages confirms illicit hotel bookings, while draft messages and reaction stamps expose deceitful coordination.

---

## 2. In-App Features & User Interactions

### 2.1. Brand SMS & Booking Verifications
* Displays official automated brand SMS threads *(e.g., HOTEL_SAOMAI, VIETCOMBANK, SPX_EXPRESS)*.
* Highlights confirmed reservations with dates, guest counts, and special romantic setup requests.

### 2.2. Interactive Parody Tapbacks & Reactions
* Message bubbles support reaction stamps (`❤️`, `👍`, `😂`, `‼️`).
* Tapping a reaction reveals the exact timestamp when the reaction was placed.

### 2.3. Canceled "Send Later" Draft Inspection
* Detects unsent drafts scheduled to be sent during the husband's claimed work hours.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-MSG-01` | `MessagesThreadView` • Hotel SMS | Open SMS thread `HOTEL_SAOMAI` -> Brand confirmation of VIP weekend stay for 2 guests with wine/rose setup. | Cheating | Medium |
| `CLUE-MSG-02` | `MessagesThreadView` • Canceled Draft | Inspect draft drawer -> Canceled "Send Later" message promising to pick up suspect tomorrow evening. | Cheating | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Real Estate Spam SMS**: Brand `BDS_LONGTHANH`: *"Mở bán 50 lô đất nền sổ đỏ Long Thành..."*.
* **Bank Transaction SMS**: Brand `VIETCOMBANK`: *"TK 0011*** tang 15,000,000 VND. Ref: Tien thuong quy 3"*.
* **Family Discussion**: Thread with *"Mẹ Đẻ"* discussing returning to ancestral home for anniversary weekend.

---

## 5. Declarative Data Contract

```typescript
export interface MessagesData {
  threads: Array<{
    threadId: string;
    senderTitle: string;
    isBrandSender: boolean;
    isPinned: boolean;
    lastMessageTimestamp: string;
    unreadCount: number;
    messages: Array<{
      messageId: string;
      sender: 'incoming' | 'outgoing';
      bodyText: string;
      timestamp: string;
      tapback?: {
        type: 'heart' | 'like' | 'laugh' | 'exclamation';
        timestamp: string;
      };
      isCanceledDraft?: boolean;
      clueRefId?: string;
    }>;
  }>;
}
```
