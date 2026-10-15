---
type: App Features Specification
app_id: techcornbank
app_name: techcornbank
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, customization options, and declarative schemas for techcornbank."
tags: [app-features, techcornbank, clues, schema, functional-spec, customization]
timestamp: "2026-10-15T21:05:00+07:00"
---

# techcornbank — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

techcornbank acts as the financial forensic epicenter. In viral Vietnamese relationship scandals, bank transfer memo fields are famously repurposed as secret chat rooms when blocked on messaging apps. It also exposes secret allowances (*Sugar Mommy*), dining receipts, and hidden stashes (*"quỹ đen"*).

---

## 2. In-App Features & User Interactions

### 2.1. Account Balance & Eyeball Privacy Toggle
* Default view masks current balance (`•••••••• đ`). Tapping the eyeball icon toggles balance visibility (`14.850.000 đ`).

### 2.2. Transaction Feed & Filtering
* Filter chips: *Tất cả*, *Tiền vào (+)*, *Tiền ra (-)*.
* Chronological listing displaying counterparty, timestamp, amount, and memo snippet.

### 2.3. Digital Bank Receipt Modal
* Tapping any transaction opens an authentic receipt drawer detailing beneficiary name, bank, reference number, exact timestamp, and the full un-truncated `Lời nhắn`.
* Direct shortcut: *"Thêm vào Sổ Tay Bắt Ghen"* tags the beneficiary as an active suspect.

### 2.4. Piggy Bank Sub-Vaults ("Hũ Tiết Kiệm / Quỹ Đen")
* Displays dedicated sub-vaults with custom goal names, balances, and deposit histories.

### 2.5. PIN Authentication Gate
* Locks app launch or vault access on Level 2/3. PIN clue is discoverable in Notes (`CLUE-NOTE-01`) or SMS.

### 2.6. Tiered Membership & Theme Customization *(New from Redesign)*
* **Tier Styling Selection**: Allows switching between membership visual themes:
  * `Standard`: Neutral slate / charcoal theme.
  * `Inspire`: Dynamic scarlet & warm coral theme for young active users.
  * `Priority`: Luxury champagne gold theme for affluent accounts.
  * `Private`: High-end obsidian black diamond theme.
* **Feng-Shui & Zodiac Wallpaper Customization**:
  * Users can personalize the hero card background with elemental colors (Kim, Mộc, Thủy, Hỏa, Thổ) or zodiac symbols.
  * *Forensic gameplay value*: The husband's selected theme or feng-shui color can corroborate astrological compatibility clues with a suspect.

### 2.7. Quick Action Bar Customization *(New from Redesign)*
* Configurable 4-button quick access matrix right beneath the card surface (default: Chuyển tiền, Quét QR, Hũ quỹ đen, Tùy biến).

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-BANK-01` | `TechcornbankHistoryView` • Micro-Transfers | Review feed -> Consecutive 1.000 VNĐ transfers sent at midnight form a desperate apology chat log. | Cheating | Easy |
| `CLUE-BANK-02` | `TechcornbankHistoryView` • Sugar Allowance | Filter "Tiền vào" -> Credit inflows of +10M to +20M VNĐ with sugar mommy memos (*"Thuong cho chuot con"*). | Sugar Relationship | Medium |
| `CLUE-BANK-03` | `TechcornbankTransactionModal` • Receipt Drawer | Tap 1.500.000 VNĐ debit -> Categorized as hotel/fine dining, debunking claimed 35k pho. | Cheating | Easy |
| `CLUE-BANK-04` | `TechcornbankVaultView` • Secret Sub-Vault | Open vault tab -> Sub-vault *"Tiet Kiem Mua Nhan Kim Cuong Cho Vo"* reveals husband's innocent surprise. | Innocent (Anniversary) | Hard |
| `CLUE-BANK-05` | `TechcornbankTransactionModal` • Bill Split | Tap transfer -> Memo reads *"Campuchia tien an toi 50/50"* with suspect female account. | Cheating | Medium |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Monthly Salary**: `+ 25.000.000 đ` from "CTY CP CONG NGHE & TRUYEN THONG".
* **Utility Bills**: `- 1.450.000 đ` EVN Hanoi electricity; `- 280.000 đ` VNPT fiber internet.
* **Grocery Purchase**: `- 620.000 đ` at "WINMART VINCOM".

---

## 5. Declarative Data Contract

```typescript
export interface TechcornbankData {
  accountNumber: string;
  maskedBalance: string;
  actualBalance: string;
  isAppLocked?: boolean;
  lockChallengeId?: string;
  // Customization properties extracted from Techcombank redesign
  tier?: 'standard' | 'inspire' | 'priority' | 'private';
  customWallpaper?: string;
  fengShuiColor?: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';
  quickActions?: Array<'transfer' | 'qr_pay' | 'vaults' | 'theme' | 'bills'>;
  vaults: Array<{
    vaultId: string;
    vaultName: string;
    targetAmount: string;
    currentAmount: string;
    depositHistory: Array<{ date: string; amount: string; note: string }>;
    clueRefId?: string;
  }>;
  transactions: Array<{
    transactionId: string;
    type: 'inflow' | 'outflow';
    amount: number;
    formattedAmount: string;
    timestamp: string;
    counterpartyName: string;
    counterpartyBank?: string;
    memo: string;
    category: 'transfer' | 'salary' | 'utility' | 'dining' | 'hotel';
    clueRefId?: string;
  }>;
}
```
