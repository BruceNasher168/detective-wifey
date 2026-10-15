---
type: App Features Specification
app_id: email
app_name: GeeMail
status: approved
description: "Comprehensive functional features, clue integrations, security password hooks, and declarative schemas for GeeMail."
tags: [app-features, email, geemail, clues, schema, functional-spec, puzzle-hooks]
timestamp: "2026-10-13T19:10:00+07:00"
---

# GeeMail — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

GeeMail acts as the husband's personal and business email hub. For the player, GeeMail functions as an essential forensic channel and a primary **Security Puzzle Hook**, providing password reset PINs, verification tokens, flight/hotel booking confirmations, and hidden correspondence in folders (Spam/Trash).

---

## 2. In-App Features & User Interactions

### 2.1. Inbox Stream & Category Filtering
* Filter chips: `Chính` (Primary), `Quảng cáo` (Promotions), `Mạng xã hội` (Social), `Thư rác` (Spam), `Thùng rác` (Trash).
* Search bar filters emails by sender name, subject line, or body keywords.

### 2.2. Email Message Viewer Drawer
* Full-screen or sliding message detail view showing Sender email, Recipient, Timestamp, Subject, Body text, and Attachment badges (PDF, image invoices).
* One-tap suspect tagging from Sender name into **Sổ Tay Bắt Ghen Của Vợ**.

### 2.3. Security Puzzle & OTP Inspection Hook
* Automated security notification emails from banking or messaging apps contain verification codes that serve as solutions for lockpad challenges elsewhere on the phone.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-MAIL-01` | `GeeMailMessageView` • Password Reset Token | Open email "Techcornbank CSKH: Mã OTP khôi phục PIN" -> Body contains 4-digit numeric code (`8291`) used to unlock Techcornbank secret vault. | Security Puzzle Hook | Easy |
| `CLUE-MAIL-02` | `GeeMailMessageView` • Airline E-Ticket | Open Vietnam Airlines e-ticket -> Discovers 2 flight tickets booked to Da Nang for husband and female colleague ("Trần Thu Trang") during a weekend "business trip". | Cheating (Colleague) | Medium |
| `CLUE-MAIL-03` | `GeeMailSpamFolder` • Hidden Spam Email | Switch tab to `Thư rác` -> Finds boutique hotel reservation receipt tucked away to evade casual inspection. | Cheating / Sugar | Medium |
| `CLUE-MAIL-04` | `GeeMailMessageView` • Surprise Jewelry Receipt | Open email "PNJ CSKH: Xác nhận thanh toán" -> Discovers necklace bought with engraving for the wife's upcoming wedding anniversary. | Innocent (Surprise Gift) | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Newsletter #GM-01**: Shopee newsletter notifying 10.10 Super Sale vouchers.
* **Banking Statement #GM-02**: Monthly credit card electronic billing statement with balance summary.
* **TechCorp IT Announcement #GM-03**: Company-wide notification about scheduled server maintenance over the weekend.

---

## 5. Declarative Data Contract

```typescript
export interface EmailMessage {
  id: string;
  senderName: string;
  senderAddress: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  category: 'primary' | 'promotions' | 'social' | 'spam' | 'trash';
  isUnread: boolean;
  isStarred: boolean;
  attachments?: Array<{
    fileName: string;
    fileType: 'pdf' | 'image' | 'invoice';
    previewUrl?: string;
  }>;
  relatedClueId?: string;
}

export interface EmailAppData {
  accountEmail: string;
  accountName: string;
  messages: EmailMessage[];
}
```
