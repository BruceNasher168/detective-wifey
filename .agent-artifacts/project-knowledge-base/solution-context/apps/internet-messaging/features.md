---
type: App Features Specification
app_id: loza
app_name: LoZa
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for LoZa."
tags: [app-features, loza, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/internet-messaging/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# LoZa — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

LoZa serves as the husband's primary domestic chat application. For the player (the jealous wife), LoZa is a high-priority inspection target containing disguised contacts, fragmented messages, audio notes, location pins, and PIN-locked conversations.

---

## 2. In-App Features & User Interactions

### 2.1. Conversation Stream Management
* **List & Search**: Filters active chats by contact name or message keywords.
* **Pinned Threads**: Suspicious or frequent contacts are pinned to the top with a pushpin icon (`📌`).
* **Unread Indicators**: Red badge counter indicating unread incoming messages.

### 2.2. Interactive Bubble Types
* **Text & Romantic Sticker Bubbles**: Renders heart stickers, romantic slang (*"anh iu"*, *"bé cưng"*), and pet names.
* **Playable Audio Memo**: Playable waveform with duration chip (`0:14`) and audio dialogue transcript toggle.
* **Location Pin Card**: Thumbnail map rendering luxury hotel/cafe venue names and timestamps.
* **Disappearing Message Notice**: System banner alerting the player that older context was automatically wiped.

### 2.3. Hidden & PIN-Protected Conversations
* **Protected Thread Access**: Pinned secret chat requires a 4-digit PIN modal.
* **Lockout Penalty**: Incorrect entries dispatch strike events to the Suspicion Engine. Correct PIN unlocks the full uncensored conversation.

### 2.4. Cross-App Suspect Tagging
* Tapping any suspicious contact name or bubble sender allows the player to tag them directly into **Sổ Tay Bắt Ghen Của Vợ**.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-LOZA-01` | `LoZaChatThreadView` • Disguised Contact | Tap contact "Anh Tuấn Thợ Điện" -> Chat history contains romantic stickers and intimate pet names. | Cheating (Colleague/Affair) | Easy |
| `CLUE-LOZA-02` | `LoZaPinModal` • Pinned Hidden Chat | Tap "Tin nhắn bị ẩn" -> Enter 4-digit PIN (found in Notes `CLUE-NOTE-01`) to unlock thread. | Cheating or Sugar | Medium |
| `CLUE-LOZA-03` | `LoZaChatThreadView` • Disappearing Banner | In-chat system notice shows 24h wipe enabled; remaining messages show fragmented plans. | Cheating | Easy |
| `CLUE-LOZA-04` | `LoZaChatThreadView` • Location Pin | Tap location card -> Shows hotel location pin while husband told wife he was in traffic. | Cheating | Medium |
| `CLUE-LOZA-05` | `LoZaChatThreadView` • Voice Memo (Red Herring) | Tap play button -> Audio discussion about "bé cưng" reveals vintage Vespa or fishing rod discussion. | Innocent (Red Herring) | Hard |
| `CLUE-LOZA-06` | `LoZaChatThreadView` • AI Bot Account | Open chat with "Em Yêu Ảo" -> Official bot checkmark and VIP subscription banner. | Cheating (Non-Human) | Medium |

---

## 4. Benign Mundane Clutter (Filler Content)

To satisfy the **Universal 8-App Grid Invariant** on Level 1:
* **"Gia Đình Là Số 1" Group**: Mom sharing herbal remedies; dad reminding about family worship day.
* **"Cty BĐS Hưng Vượng Thông Báo"**: Formal company HR announcements regarding quarterly KPIs.
* **"Viettel CSKH"**: Automated promotional top-up messages.

---

## 5. Declarative Data Contract

```typescript
export interface LoZaData {
  currentUser: { id: string; name: string; avatar: string };
  threads: Array<{
    threadId: string;
    contactName: string;
    avatarUrl: string;
    isPinned?: boolean;
    isLocked?: boolean;
    lockChallengeId?: string;
    unreadCount?: number;
    systemBanner?: string;
    messages: Array<{
      messageId: string;
      senderId: 'husband' | 'other';
      timestamp: string;
      type: 'text' | 'image' | 'voice' | 'location' | 'sticker';
      textContent?: string;
      mediaUrl?: string;
      voiceDurationSeconds?: number;
      voiceTranscript?: string;
      locationData?: { venueName: string; address: string; mapThumbnail: string };
      clueRefId?: string;
    }>;
  }>;
}
```
