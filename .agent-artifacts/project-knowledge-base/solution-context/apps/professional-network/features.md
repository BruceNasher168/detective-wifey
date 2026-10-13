---
type: App Features Specification
app_id: professional-network
app_name: InkedLin
status: approved
description: "Comprehensive functional features, clue integrations, work anniversary security hooks, and declarative schemas for InkedLin."
tags: [app-features, professional-network, inkedlin, clues, schema, functional-spec, puzzle-hooks]
timestamp: "2026-10-13T19:10:00+07:00"
---

# InkedLin — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

InkedLin acts as the husband's professional persona showcase. In the game loop, InkedLin serves as a **Security Puzzle Hook** (revealing work anniversary milestones, employee start dates, and promotion dates that players use as 4-digit PINs) alongside corporate networking clues (flirty recruiter DMs, secretive endorsements, and profile views).

---

## 2. In-App Features & User Interactions

### 2.1. Professional Feed & Milestone Posts
* Feed stream showing corporate announcements, work anniversaries, certification badges, and self-promotion posts.
* Post cards show likes, comments, and post date.

### 2.2. InMail & Direct Message Inbox
* Chat tab showing 1-on-1 networking conversations.
* Contact cards with job title, company name, and mutual connection counts.
* One-tap suspect tagging from connection names into **Sổ Tay Bắt Ghen Của Vợ**.

### 2.3. Profile & Career Experience Timeline
* Detailed resume view showing start dates, former roles, and employee anniversary dates that provide key numerical puzzle hints.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-LINK-01` | `InkedLinPostCard` • Work Anniversary Date | View husband's 5th work anniversary post -> "Bắt đầu ngày 15/09/2021" -> Provides 4-digit PIN code `1509` to unlock hidden phone photo album or note ledger. | Security Puzzle Hook | Easy |
| `CLUE-LINK-02` | `InkedLinInMailView` • Flirtatious Recruiter DM | Open InMail from "Thảo HR - Headhunter" -> Offers private cafe meetup with suggestive subtext and flirty wink emojis. | Cheating (Flirting) | Medium |
| `CLUE-LINK-03` | `InkedLinProfileView` • Recent Profile Stalker | Check "Ai đã xem hồ sơ của bạn" -> Colleague intern viewed profile 25 times this week. | Cheating (Office Crush) | Medium |
| `CLUE-LINK-04` | `InkedLinPostCard` • Industry Award Congratulation | Read comment thread on company award -> Colleague comments: "Anh Tuấn dẫn cả team đi ăn mừng nhớ khao em trà sữa nhé!" | Innocent (Workplace banter) | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Post #INK-01**: Generic motivational quote about "Lãnh đạo truyền cảm hứng và tinh thần vượt khó" with 120 likes.
* **Post #INK-02**: Connection accepted notification from former university classmate working at FPT.
* **Post #INK-03**: Company newsletter about "Quarterly Town Hall Meeting 2026".

---

## 5. Declarative Data Contract

```typescript
export interface InkedLinPost {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  publishedAt: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  milestoneDate?: string; // e.g. "15/09"
  relatedClueId?: string;
}

export interface InkedLinMessage {
  threadId: string;
  contactName: string;
  contactTitle: string;
  avatarUrl: string;
  snippet: string;
  messages: Array<{
    sender: 'user' | 'contact';
    text: string;
    timestamp: string;
  }>;
}

export interface InkedLinAppData {
  profile: {
    fullName: string;
    headline: string;
    anniversaryDate: string; // "15/09/2021"
    companyName: string;
  };
  posts: InkedLinPost[];
  inbox: InkedLinMessage[];
}
```
