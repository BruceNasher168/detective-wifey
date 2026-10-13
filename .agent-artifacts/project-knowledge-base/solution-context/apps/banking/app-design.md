---
type: App Design Specification
app_id: vietpay
app_name: VietPay
real_world_parody: VietQR / MoMo / MBBank
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the VietPay bank & e-wallet app."
tags: [app-design, vietpay, banking, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/banking/features.md
---

# VietPay — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **VietPay** (Parody of *VietQR*, *MoMo*, and Vietnamese mobile banking) |
| **Slogan / Tagline** | *"Chuyển tiền siêu tốc — Tin nhắn siêu tình"* |
| **Real-World Parody** | VietQR / MoMo / Techcombank / MBBank |
| **Trademark Defense** | Merges mobile banking aesthetics with e-wallet layouts. Uses deep emerald green (`#006A4E`) and metallic gold accents instead of MoMo's signature magenta or MBBank's blue. |
| **Visual Persona** | Secure, prestigious banking card interface contrasting comically against emotional 1.000 VNĐ transfer messages. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                  VIETPAY COLOR PALETTE                 │
├────────────────────────────────────────────────────────┤
│ Primary Brand:        Deep Emerald    #006A4E          │
│ Accent Gold:          Metallic Gold   #D4AF37          │
│ Inflow Green:         Mint Green      #00C853          │
│ Outflow Red:          Crimson Red     #D32F2F          │
│ Card Surface:         Midnight Slate  #1E293B          │
│ Background Canvas:    Light Platinum  #F8FAFC          │
│ Text Primary:         Dark Charcoal   #0F172A          │
│ Text Subtitle:        Muted Slate     #64748B          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Balances & Currency: Monospace bold numbers ($20\text{px}$ / weight $700$).
  * Account Headers: Semibold ($16\text{px}$).
  * Transfer Memos: Regular italic ($14\text{px}$ / line height $1.4$).
* **Ergonomics & Touch Targets**:
  * Eyeball balance reveal toggle $\ge 44 \times 44\text{px}$.
  * Transaction history rows $\ge 64\text{px}$ height with full-row click/tap expansion.
  * Dismiss modal button $\ge 48\text{px}$ height.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Dashboard & Account View (`VietPayDashboardView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]               VietPay             [ 🔔 ] │
├────────────────────────────────────────────────────────┤
│ 💳 THẺ CHÍNH - DONG VIET BANK                          │
│    Số dư: •••••••• đ  [ 👁️ Hiện số dư ]                │
│    Số TK: 1903 **** **** 888                           │
├────────────────────────────────────────────────────────┤
│ [ 💸 Chuyển tiền ]   [ 📥 Nhận tiền ]   [ 🐷 Hũ tích lũy ]│
├────────────────────────────────────────────────────────┤
│ BIẾN ĐỘNG GẦN ĐÂY                         [ Xem tất cả ]│
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.000 đ          NGUYEN THI BE MEO         23:46  │
│    Lời nhắn: "Em gian anh a sao khong nghe may"        │
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.000 đ          NGUYEN THI BE MEO         23:45  │
│    Lời nhắn: "Anh xin loi ma be tha loi anh di"        │
├────────────────────────────────────────────────────────┤
│ 🟢 + 20.000.000 đ     TRAN THI KIM CUONG        10:15  │
│    Lời nhắn: "Thuong cho chuot con ngoan ngoan"        │
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.500.000 đ      NHA HANG SEN TAY HO       Hôm qua│
│    Thanh toán hóa đơn ăn tối VIP                       │
└────────────────────────────────────────────────────────┘
```

### 3.2. Detailed Digital Receipt Modal (`VietPayTransactionModal`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            BIÊN LAI CHUYỂN TIỀN             │
├────────────────────────────────────────────────────────┤
│                    - 1.000 đ                           │
│             GIAO DỊCH THÀNH CÔNG                       │
├────────────────────────────────────────────────────────┤
│ Ngân hàng thụ hưởng:   DongViet Bank                   │
│ Tên người nhận:        NGUYEN THI BE MEO               │
│ Số tài khoản:          1029 **** 889                   │
│ Thời gian:             13/10/2026 23:46:12             │
│ Mã giao dịch:          FT262879912048                  │
├────────────────────────────────────────────────────────┤
│ Lời nhắn (Nội dung):                                   │
│ "Em gian anh a sao khong nghe may goi mai khong duoc"  │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm NGUYEN THI BE MEO vào Sổ Tay Bắt Ghen ]      │
└────────────────────────────────────────────────────────┘
```

### 3.3. Full App PIN Keypad (`VietPayPinGate`)
* Full-screen bank security challenge requiring a 4-digit PIN upon app launch on Level 2/3.
