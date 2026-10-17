---
type: App Features Specification
app_id: phone
app_name: Phone
status: approved
description: "Comprehensive functional features, call duration analysis, contact note inspector, mundane clutter, and declarative schemas for Phone."
tags: [app-features, phone, dialer, recents, contacts, clues, schema, functional-spec]
timestamp: "2026-10-14T13:00:00+07:00"
---

# Phone — Functional Features & Clue Integration Specification

> **Parent Architecture**: [../../architecture/apps-features-architecture.md](../../architecture/apps-features-architecture.md)  
> **UI/UX Design Specification**: [app-design.md](app-design.md)  
> **Sister App (Messages)**: [../messages/features.md](../messages/features.md)

---

## 1. Functional Overview

The native **Phone** application provides telecommunication call audit records and an address book. Inspection of call logs uncovers short midnight calls to disguised mistresses, while contact note fields expose hidden apartment addresses and door codes.

---

## 2. In-App Features & User Interactions

### 2.1. Call Duration Analysis
* Renders call direction (`incoming`, `outgoing`, `missed`), narrative timestamp, and precise call duration badge (e.g., `1 phút 12 giây`).
* Highlights suspicious late-night outgoing calls to disguised contacts (*e.g., "Tổng Đài Viettel" called at 23:45*).

### 2.2. Contact Directory & Note Field Inspector
* Displays contact profile cards with name, persona-specific avatar, primary/secondary numbers, and an expandable `"Ghi chú"` field containing incriminating clues or door codes.

### 2.3. T9 Keypad Dialer
* Standard numeric keypad dialer enabling freeform or guided number dialing.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-PHONE-01` | `PhoneRecentsView` • 1-Minute Calls | Check call log -> Outgoing calls at 23:45 lasting 1–2 minutes to disguised contacts (*"Tổng Đài Viettel"*). | Cheating | Easy |
| `CLUE-PHONE-02` | `PhoneContactDetailModal` • Hidden Address | Open contact info for "Bác Sĩ Cương" -> Notes field contains secret apartment address & door lock code (`1408`). | Cheating | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Family Call**: Incoming call from *"Mẹ Đẻ"* at 18:05 lasting 5m 20s.
* **Colleague Call**: Outgoing call to *"Đồng nghiệp Nam"* at 23:10 lasting 1m 45s.
* **Water Delivery**: Contact card for *"Giao Nước Lavie"*.
* **Grab Driver**: Outgoing call to *"Grap Driver"* at 17:30 lasting 32s.

---

## 5. Declarative Data Contract

```typescript
export interface PhoneData {
  calls: Array<{
    callId: string;
    contactName: string;
    phoneNumber: string;
    direction: 'incoming' | 'outgoing' | 'missed';
    timestamp: string;
    durationSeconds: number;
    clueRefId?: string;
  }>;
  contacts: Array<{
    contactId: string;
    displayName: string;
    primaryPhone: string;
    secondaryPhone?: string;
    notesField?: string;
    clueRefId?: string;
  }>;
}
```
