---
type: App Features Specification
app_id: comms
app_name: Comms
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Comms."
tags: [app-features, comms, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/comms/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Comms — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Comms provides telecommunication audit records. Call logs uncover short midnight calls to disguised mistresses, brand SMS logs reveal hotel room confirmations, and contact note fields expose hidden apartment addresses.

---

## 2. In-App Features & User Interactions

### 2.1. Call Duration Analysis
* Renders call direction (incoming, outgoing, missed), timestamp, and precise call duration badge (e.g. `1 phút 12 giây`).
* Highlights late-night outgoing calls to suspicious contacts.

### 2.2. SMS Inbox View
* Chronological listing of personal and enterprise brand SMS messages.

### 2.3. Contact Directory & Note Field Inspector
* Displays contact profile cards with name, primary/secondary numbers, and expandable *"Ghi chú"* field.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-COMM-01` | `CommsCallLogView` • 1-Minute Calls | Check call log -> Outgoing calls at 23:45 lasting 1–2 minutes to disguised contacts (*"Tổng Đài Viettel"*). | Cheating | Easy |
| `CLUE-COMM-02` | `CommsSMSInboxView` • Booking SMS | Open SMS thread -> Brand SMS from `HOTEL_SAOMAI` confirming weekend stay for 2 guests. | Cheating | Medium |
| `CLUE-COMM-03` | `CommsContactDetailModal` • Hidden Address | Open contact info for "Bác Sĩ Cương" -> Notes field contains secret apartment address. | Cheating | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Real Estate Spam SMS**: Brand `BDS_LONGTHANH`: *"Mở bán 50 lô đất nền sổ đỏ Long Thành..."*.
* **Family Call**: Incoming call from *"Mẹ Đẻ"* at 18:05 lasting 5m 20s.
* **Water Delivery**: Contact card for *"Giao Nước Lavie"*.

---

## 5. Declarative Data Contract

```typescript
export interface CommsData {
  calls: Array<{
    callId: string;
    contactName: string;
    phoneNumber: string;
    direction: 'incoming' | 'outgoing' | 'missed';
    timestamp: string;
    durationSeconds: number;
    clueRefId?: string;
  }>;
  smsThreads: Array<{
    smsId: string;
    senderNameOrBrand: string;
    timestamp: string;
    messageBody: string;
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
