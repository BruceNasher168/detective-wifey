---
type: App Design Specification
app_id: techcornbank
app_name: Techcornbank
real_world_parody: Techcombank Mobile (Redesign) / VietQR
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, layout, and wireframe layouts for the Techcornbank bank app inspired by Techcombank Mobile's modern redesign."
tags: [app-design, techcornbank, techcombank, banking, ui-ux, design-system, branding]
timestamp: "2026-10-15T21:05:00+07:00"
---

# Techcornbank - App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Techcornbank** (Parody of *Techcombank Mobile* and *VietQR*) |
| **Slogan / Tagline** | *"Chuyển tiền siêu tốc - Tin nhắn siêu tình"* |
| **Real-World Parody** | Techcombank Mobile (2024–2026 Redesign) / VietQR |
| **Trademark Defense** | Parodies the sleek geometry and scarlet-and-slate aesthetic of modern Vietnamese digital banking. Uses Techcombank's signature crimson red accents (`#ED1C24`) paired with dark slate and gold tier finishes, distinguishing it clearly from MBBank's navy or MoMo's magenta. |
| **Visual Persona** | High-status, decluttered neobank interface with case-defined membership styling (Inspire, Priority, Private) and read-only feng-shui appearance that contrast comically with suspicious 1.000 VNĐ micro-transfer apology memos. |

---

## 2. Visual Design System & Color Tokens

```
┌───────────────────────────────────────────────────────────────────┐
│                       Techcornbank COLOR PALETTE                       │
├───────────────────────────────────────────────────────────────────┤
│ Primary Brand Red:       Techcom Scarlet         #ED1C24          │
│ Brand Crimson Deep:      Dark Red                #B71C1C          │
│ Inflow Green:            Mint Emerald            #00A86B          │
│ Outflow Red:             Bold Crimson            #E53935          │
│ Canvas Background:       Light Smoke Neutral     #F5F6F8          │
│ Card Surface Default:    Midnight Obsidian       #1F242D          │
│ Card Surface Elevated:   Pure White              #FFFFFF          │
│ Text Primary:            Carbon Charcoal         #111827          │
│ Text Subtitle:           Muted Slate             #6B7280          │
│ Border / Divider:        Subtle Gray             #E5E7EB          │
├───────────────────────────────────────────────────────────────────┤
│                    TIER & CUSTOMIZATION THEMES                    │
├───────────────────────────────────────────────────────────────────┤
│ Inspire Tier (Youth):    Vibrant Coral / Gold    #FF6B6B / #FF8E53│
│ Priority Tier (Affluent):Champagne Gold          #C5A880 / #D4AF37│
│ Private Tier (Ultra):    Obsidian Black Diamond  #121212 / #23272A│
│ Standard Tier:           Slate Titanium          #1E293B / #334155│
└───────────────────────────────────────────────────────────────────┘
```

### 2.1. Typography
* **Font Family**: Neo-grotesque sans-serif (`-apple-system` / `Inter` / system sans-serif) for UI copy; Tabular Monospace figures for balances, amounts, and dates.
* **Typographic Hierarchy**:
  * **Balance Display**: $24\text{px}$ – $28\text{px}$, Bold (weight $700$/$800$), tracking $-0.5\text{px}$, tabular figures.
  * **Card & Header Titles**: $15\text{px}$ – $16\text{px}$, Semibold (weight $600$).
  * **Quick Action Labels**: $12\text{px}$, Medium (weight $500$).
  * **Section Titles**: $12\text{px}$ – $13\text{px}$, Semibold (weight $600$), uppercase, tracking $+0.5\text{px}$, text `#6B7280`.
  * **Transaction Counterparty**: $16\text{px}$ – $17\text{px}$, Bold (weight $700$).
  * **Forensic Transfer Memo**: $16\text{px}$, Italic (weight $400$), line height $1.4$, background tint.
  * **Metadata**: At least $13\text{px}$; minor badges at least $11\text{px}$. Universal accessibility floors and 200% scaling take precedence over compact source examples.

### 2.2. Ergonomics & Touch Targets
* **Sticky Bottom Navigation Bar**: Fixed $64\text{px}$ height bar placed at the bottom safe-area, supporting single-hand mobile reachability.
* **Quick Action Matrix**: 4-column horizontal grid with touch targets $\ge 48 \times 48\text{px}$ with rounded pill container and $12\text{px}$ labels.
* **Eyeball Privacy Toggle**: $\ge 44 \times 44\text{px}$ tap target for quick balance masking/revealing.
* **Transaction History Rows**: $\ge 64\text{px}$ minimum height with full-row tap trigger to expand forensic receipt modals.
* **Border Radiuses**:
  * Hero account cards: $20\text{px}$
  * Transaction item containers: $14\text{px}$
  * Action icon buttons: $14\text{px}$
  * Modals & Drawers: $24\text{px}$ top-corner radius

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Dashboard View with Quick Actions & Bottom Bar (`TechcornbankDashboardView`)

Home displays the account summary and four configured shortcuts. It does not display transaction rows, transfer memo previews, recent activity, or transaction filters. The account entry **Tài khoản & lịch sử** and the **Lịch sử** tab open the separate history view.

```text
+---------------------------------------------------------+
| [Ảnh đại diện]       Techcornbank        [Thông báo]      |
+---------------------------------------------------------+
| THẺ CHÍNH                         [Hạng theo vụ việc]    |
| Số dư khả dụng                                          |
| ******** đ                              [Hiện số dư]    |
| Số TK: 1903 8888 6688                        [Sao chép]  |
| [Tài khoản & lịch sử >]                                 |
+---------------------------------------------------------+
| [Chuyển tiền] [Quét QR] [Tiết kiệm] [Hóa đơn]           |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Tiết kiệm]       [Tôi]   |
+---------------------------------------------------------+
```

The displayed tier and card background come from case configuration and remain read-only. The four non-theme shortcuts are **Chuyển tiền**, **Quét QR**, **Tiết kiệm**, and **Hóa đơn** in the default game configuration. Only documented inspection destinations are enabled; no transfer, QR-scanning, or payment workflow is introduced.

#### 3.1.1. Transaction History (`TechcornbankHistoryView`)

The history screen, reached from the account entry or bottom navigation, contains the **Tất cả**, **Tiền vào (+)**, and **Tiền ra (-)** filters. It lists transactions chronologically, newest first, showing counterparty, signed amount, timestamp, and memo snippet. Tapping a transaction opens its full receipt. Consecutive micro-transfers remain separate records.

This placement was confirmed by the user on 2026-10-15. The [official Techcombank Mobile redesign announcement](https://techcombank.com/thong-tin/thong-bao/techcombank-ra-mat-giao-dien-hoan-toan-moi-nang-tam-trai-nghiem-tai-chinh-so) describes shortcuts on Dashboard and history access through account/card management. The game uses a reduced navigation model; exact real-app screenshot parity has not been verified.

### 3.2. Detailed Digital Receipt Modal (`TechcornbankTransactionModal`)
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
│ Lời nhắn (Nội dung CK):                                │
│ "Em gian anh a sao khong nghe may goi mai khong duoc"  │
├────────────────────────────────────────────────────────┤
└────────────────────────────────────────────────────────┘
```


Case-loaded receipt narrative and memos use the shared **380 ms** long-press evidence overlay. No permanent pin or notebook button appears in the receipt; app chrome and structural controls are not evidence targets.

### 3.3. Read-Only Account View (`TechcornbankProfileView`)

```text
+---------------------------------------------------------+
|                          TÔI                            |
+---------------------------------------------------------+
| Techcornbank                                           |
| Số tài khoản: [Số tài khoản theo vụ việc]                |
| Hạng hội viên: [Hạng theo vụ việc, nếu có]               |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Tiết kiệm]       [Tôi]   |
+---------------------------------------------------------+
```

There is no player theme customizer, wallpaper picker, feng-shui selector, zodiac selector, or save-theme control. Existing tier palette definitions describe read-only case styling, not player settings.

### 3.4. Full App PIN Keypad (`TechcornbankPinGate`)
* Full-screen bank security challenge requiring a 4-digit PIN upon app launch on Level 2/3.
