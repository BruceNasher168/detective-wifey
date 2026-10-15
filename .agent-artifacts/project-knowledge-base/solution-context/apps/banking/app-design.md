---
type: App Design Specification
app_id: techcornbank
app_name: techcornbank
real_world_parody: Techcombank Mobile (Redesign) / VietQR
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, layout, and wireframe layouts for the techcornbank bank app inspired by Techcombank Mobile's modern redesign."
tags: [app-design, techcornbank, techcombank, banking, ui-ux, design-system, branding]
timestamp: "2026-10-15T21:05:00+07:00"
---

# techcornbank — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **techcornbank** (Parody of *Techcombank Mobile* and *VietQR*) |
| **Slogan / Tagline** | *"Chuyển tiền siêu tốc — Tin nhắn siêu tình"* |
| **Real-World Parody** | Techcombank Mobile (2024–2026 Redesign) / VietQR |
| **Trademark Defense** | Parodies the sleek geometry and scarlet-and-slate aesthetic of modern Vietnamese digital banking. Uses Techcombank's signature crimson red accents (`#EC1C24`) paired with dark slate and gold tier finishes, distinguishing it clearly from MBBank's navy or MoMo's magenta. |
| **Visual Persona** | High-status, decluttered neobank interface with customizable membership tiers (Inspire, Priority, Private) and feng-shui themes that contrast comically with suspicious 1.000 VNĐ micro-transfer apology memos. |

---

## 2. Visual Design System & Color Tokens

```
┌───────────────────────────────────────────────────────────────────┐
│                       techcornbank COLOR PALETTE                       │
├───────────────────────────────────────────────────────────────────┤
│ Primary Brand Red:       Techcom Scarlet         #EC1C24          │
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
* **Font Family**: Neo-grotesque sans-serif (`SF Pro Display` / `Inter` / system sans-serif) for UI copy; Tabular Monospace figures for balances, amounts, and dates.
* **Typographic Hierarchy**:
  * **Balance Display**: $24\text{px}$ – $28\text{px}$, Bold (weight $700$/$800$), tracking $-0.5\text{px}$, tabular figures.
  * **Card & Header Titles**: $15\text{px}$ – $16\text{px}$, Semibold (weight $600$).
  * **Quick Action Labels**: $12\text{px}$, Medium (weight $500$).
  * **Section Titles**: $12\text{px}$ – $13\text{px}$, Semibold (weight $600$), uppercase, tracking $+0.5\text{px}$, text `#6B7280`.
  * **Transaction Counterparty**: $13\text{px}$ – $14\text{px}$, Bold (weight $700$).
  * **Forensic Transfer Memo**: $13\text{px}$, Italic (weight $400$), line height $1.4$, background tint.
  * **Metadata & Badges**: $10\text{px}$ – $11\text{px}$, Medium (weight $500$).

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
```
┌────────────────────────────────────────────────────────┐
│ [👤 Avatar]       techcornbank [Inspire]           [ 🔔 2 ] │
├────────────────────────────────────────────────────────┤
│ 💳 THẺ CHÍNH • INSPIRE TIER                            │
│    Số dư khả dụng:                                     │
│    •••••••• đ   [ 👁️ Hiện số dư ]                      │
│                                                        │
│    Số TK: 1903 8888 6688  [📋 Sao chép]                │
├────────────────────────────────────────────────────────┤
│ [ 💸 ]        [ 📷 ]          [ 🐷 ]         [ ⚙️ ]   │
│ Chuyển tiền   Quét QR         Hũ quỹ đen     Tùy biến  │
├────────────────────────────────────────────────────────┤
│ BIẾN ĐỘNG GẦN ĐÂY                         [ Bộ lọc ⚙️ ] │
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.000 đ          NGUYEN THI BE MEO         23:46  │
│    💬 "Em gian anh a sao khong nghe may"               │
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.000 đ          NGUYEN THI BE MEO         23:45  │
│    💬 "Anh xin loi ma be tha loi anh di"               │
├────────────────────────────────────────────────────────┤
│ 🟢 + 20.000.000 đ     TRAN THI KIM CUONG        10:15  │
│    💬 "Thuong cho chuot con ngoan ngoan"               │
├────────────────────────────────────────────────────────┤
│ 🔴 - 1.500.000 đ      NHA HANG SEN TAY HO       Hôm qua│
│    💬 "Thanh toan hoa don an toi VIP - Ban 04"         │
├────────────────────────────────────────────────────────┤
│ [ 🏠 Trang chủ ]  [ 📊 Lịch sử ]  [ 🐷 Hũ quỹ ]  [ 👤 Tôi ] │
└────────────────────────────────────────────────────────┘
```

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
│ [ ➕ Thêm NGUYEN THI BE MEO vào Sổ Tay Bắt Ghen ]      │
└────────────────────────────────────────────────────────┘
```

### 3.3. Customization & Theme Drawer (`TechcornbankThemeCustomizer`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]          TÙY BIẾN GIAO DIỆN                 │
├────────────────────────────────────────────────────────┤
│ HẠNG HỘI VIÊN (THEME TIER):                            │
│ ( ) Standard      (*) Inspire (Đỏ Cam)                 │
│ ( ) Priority Gold ( ) Private Obsidian                 │
├────────────────────────────────────────────────────────┤
│ HÌNH NỀN PHONG THỦY (FENG SHUI WALLPAPER):             │
│ [ 🌊 Mạng Thủy ]   [ 🔥 Mạng Hỏa ]   [ 🌿 Mạng Mộc ]    │
│ [ 🪙 Mạng Kim ]    [ ⛰️ Mạng Thổ ]    [ ♈ Hoàng Đạo ]   │
├────────────────────────────────────────────────────────┤
│ [ Lưu cài đặt ]                                        │
└────────────────────────────────────────────────────────┘
```

### 3.4. Full App PIN Keypad (`TechcornbankPinGate`)
* Full-screen bank security challenge requiring a 4-digit PIN upon app launch on Level 2/3.
