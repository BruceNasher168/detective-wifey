---
type: App Features Specification
app_id: team-collaboration
app_name: Tim
status: approved
description: "Comprehensive functional features, clue integrations, IT security PIN reminders, and declarative schemas for Tim."
tags: [app-features, team-collaboration, tim, teams, clues, schema, functional-spec, puzzle-hooks]
timestamp: "2026-10-13T19:10:00+07:00"
---

# Tim - Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Tim serves as the husband's corporate workplace chat and virtual collaboration platform. For the player, Tim operates as a crucial **Security Puzzle Hook** (containing IT department PIN reminders, default security passcodes, and system credentials) alongside late-night "OT" (overtime) workplace affair evidence, status messages contradictions, and 1-on-1 private syncs.

---

## 2. In-App Features & User Interactions

### 2.1. Workplace Chat & Direct Messages
* 1-on-1 and group chat threads with colleagues.
* Presence indicators: Green (Available), Red (Busy / Do Not Disturb), Amber (Away), Offline.
* Pinned custom status message below profile name.

### 2.2. Channels & IT Support Announcements
* Team channels (`General`, `Dự Án Alpha`, `IT Helpdesk`).
* Public bulletin board posts where IT broadcasts system security notifications.

### 2.3. Cross-App Clue & Suspect Tagging
* Tapping on any colleague or sender allows one-tap suspect tagging into **Sổ Tay Bắt Ghen Của Vợ**.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-TEAM-01` | `TimChannelView` • IT PIN Reminder | Open "IT Helpdesk" channel -> Post reads: *"Lưu ý toàn công ty: Mã PIN bảo mật mặc định phòng ban IT cho thiết bị mới là: 4920. Nhân viên vui lòng đổi sau khi kích hoạt."* -> Solves 4-digit numeric PIN challenge on Husband's Notes app. | Security Puzzle Hook | Easy |
| `CLUE-TEAM-02` | `TimProfileHeader` • Status Message Contradiction | Inspect husband's status message -> Set to *"Đang họp kín dự án đặc biệt (DND) ⛔"* at 23:30, contradicting his claim to his wife that he was fast asleep. | Cheating (Late-night OT) | Medium |
| `CLUE-TEAM-03` | `TimChatThreadView` • Private 1-on-1 Chat | Open direct chat with "Lan Anh Marketing" -> Timestamped 01:15 AM: *"Anh xong việc chưa? Đang đợi anh ở quán pub quen nè..."* | Cheating (Colleague Affair) | Medium |
| `CLUE-TEAM-04` | `TimChannelView` • Urgent Server Incident | Read channel thread in "DevOps Incident" -> Urgent crash logs explaining why husband stayed up until 4:00 AM on Friday night fixing client server. | Innocent (Actual Overtime) | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Chat #TIM-01**: Daily Standup bot asking for sprint status updates.
* **Chat #TIM-02**: "Hội Cơm Trưa TechCorp" group debating whether to order phở or cơm tấm.
* **Channel #TIM-03**: Company general channel welcoming new interns for Q4 2026.

---

## 5. Declarative Data Contract

```typescript
export interface TimMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  relatedClueId?: string;
}

export interface TimChatThread {
  threadId: string;
  type: 'direct' | 'channel';
  title: string;
  presenceStatus?: 'available' | 'busy' | 'away' | 'offline';
  unreadCount?: number;
  lastMessageSnippet: string;
  messages: TimMessage[];
}

export interface TimAppData {
  currentUser: {
    name: string;
    statusMessage: string;
    presence: 'available' | 'busy' | 'away' | 'offline';
  };
  threads: TimChatThread[];
}
```
