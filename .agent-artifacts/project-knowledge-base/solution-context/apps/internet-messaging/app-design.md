---
type: App Design Specification
app_id: loza
app_name: LoZa
real_world_parody: Zalo
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, mascot/sticker guidelines, and wireframe layouts for the LoZa private messaging app and integrated LoZaPay sub-service."
tags: [app-design, loza, lozapay, ui-ux, design-system, branding, brand-guidelines]
timestamp: "2026-10-13T18:15:00+07:00"
---

# LoZa — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **LoZa** (Satirical pun on *Zalo*) |
| **Integrated Sub-Brand** | **LoZaPay** (In-chat e-wallet & peer-to-peer transfer feature, parody of *ZaloPay*) |
| **Slogan / Tagline** | *"Kết nối tình thân — Bí mật khó giấu"* (LoZa App)<br>*"Mở giới hạn quỹ đen — Mới trải nghiệm ghen"* (LoZaPay, parody of ZaloPay 2024 *"Mở giới hạn, Mới trải nghiệm"*). |
| **Real-World Parody** | Zalo messaging platform and integrated ZaloPay e-wallet ecosystem. |
| **Trademark Defense** | • **Color Departure**: Strict departure from Zalo's electric blue (`#0068FF`) and ZaloPay's exact brand blue (`#0033C9`) / brand green (`#00CF6A`). LoZa & LoZaPay adopt a bespoke deep teal (`#0E828A`) paired with vibrant mint-green (`#00C97B`).<br>• **Iconography**: Bespoke conversation-bubble-and-magnifier icon for LoZa, and curved "L" smile wallet badge for LoZaPay, ensuring complete satirical defense against passing-off and trademark infringement. |
| **Visual Persona & Archetype** | **Money Mentor** (Satirical financial advisor persona adapted from ZaloPay 2024 guidelines): Promotes seamless clandestine peer-to-peer micro-transfers, lucky envelopes, and date bills with playful stickers and deceptive ease. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   LOZA COLOR PALETTE                   │
├────────────────────────────────────────────────────────┤
│ Primary Brand:        Deep Teal       #0E828A          │
│ Outgoing Bubble:      Pale Cyan       #E0F7FA          │
│ Incoming Bubble:      Neutral White   #FFFFFF          │
│ Canvas Background:    Ice Gray        #F3F6F8          │
│ Text Primary:         Slate Dark      #1A202C          │
│ Text Timestamp:       Cool Gray       #718096          │
│ Unread Badge / Alert: Coral Red       #FF5722          │
│ Locked Chat Border:   Amber Gold      #F59E0B          │
├────────────────────────────────────────────────────────┤
│         LOZAPAY SUB-BRAND & PROMOTIONAL PALETTE        │
│        (Adapted from ZaloPay 2024 Brand Guidelines)    │
├────────────────────────────────────────────────────────┤
│ LoZaPay Primary Blue: Deep Teal-Blue  #0E828A          │
│ LoZaPay Vibrant Mint: Mint Green      #00C97B          │
│ Supporting Light Blue:Cyan 400        #38BDF8          │
│ Supporting Neon Lime: Neon Green      #A3E635          │
│ Supporting Purple:    Electric Purple #7C3AED          │
│ Supporting Yellow:    Solar Yellow    #FBBF24          │
│ Supporting Orange:    Vivid Orange    #FB923C          │
└────────────────────────────────────────────────────────┘
```

### 2.1. Color Distribution & Co-Branding Ratios
* **Primary Duo Ratio**: All LoZaPay marketing banners and feature cards must maintain a **50:50** or **70:30** visual balance between Primary Deep Teal (`#0E828A`) and Vibrant Mint Green (`#00C97B`).
* **Co-Branding Distribution** (e.g. LoZaPay × Partner integrations):
  * **On LoZa In-App Channels**: LoZaPay colors must occupy $\ge 70\%$ of the layout; partner brand colors are restricted to $\le 30\%$.
  * **On External Partner Channels**: LoZaPay branding must occupy $\ge 30\%$ of total color distribution.

### 2.2. Typography System (Aeonik Pro Standard Adaptation)
* **Typeface Pairing**: Modern geometric sans-serif (Inter / Aeonik Pro style).
* **Capitalization Rules**: Strict **Sentence-case** for all headlines and labels (chỉ viết hoa chữ cái đầu câu/từ đầu tiên, không dùng ALL-CAPS trừ khi nhấn mạnh cảnh báo ngắn).
* **Type Hierarchy**:
  * **Headlines / Banners**: Bold / Heavy ($20\text{px}$–$24\text{px}$ on mobile, $\ge 60\text{pt}$ master art).
  * **Section Headers & Contact Names**: Semibold ($16\text{px}$ / weight $600$).
  * **Message Bubble & Body**: Regular ($14\text{px}$–$15\text{px}$ / line-height $1.4$).
  * **Subtitles & Timestamps**: Regular ($12\text{px}$ / weight $400$).
  * **Captions & Disclaimers**: Regular ($10\text{px}$ / weight $400$, minimum $6\text{pt}$).
* **Prohibitions**: Strictly **no text drop shadows, no text outlines/strokes**, and no gradient fills on text.

### 2.3. Graphic Elements, Stickers & Mascot System
* **"L" Smile Brand Curve**: Derived from the signature smile curve of the brand (parodying ZaloPay's "Z" smile element), utilized as a background masking container or framing element with $30\% - 60\%$ visual coverage.
* **Creative Sticker Badges (Tem nhãn sáng tạo)**:
  * Maximum $1 - 3$ badges per promotional banner or in-chat transaction card.
  * Standard shapes: Pill badge, serrated stamp tag, burst star, and rounded bubble.
  * Canonical satirical copy: *"siêu dễ"*, *"túi đầy tiền"*, *"nhanh & tiện"*, *"quá đã"*, *"Flexing"*, *"Yolo!"*, *"Hey LoZa Buddies!"*.
* **Mascot Trio System (Toro, Tofi, Tofu Parody)**:
  * **Toro Parody (Mèo xanh)**: 100% baseline scale. Proportions: head = 1/2 body, rounded limbs, oval pupils, no eyebrows, solid black outline, strictly never horizontally flipped.
  * **Tofi Parody (Cún vàng)**: 115% scale of Toro. Rounded limbs, has eyebrows, holds security shield in left paw.
  * **Tofu Parody (Thỏ cam)**: 80% scale of Toro. Rounded ears, no eyebrows, always accompanied by floating musical note icons.
  * **Visual Weight**: Mascots occupy $10\% - 20\%$ of composition area on promotional banners and transaction receipts.
* **Button & CTA System**:
  * Pill shape (`border-radius: 9999px`), minimum height $44\text{px}$.
  * **Primary CTA**: Solid Mint Green (`#00C97B`), white bold text (e.g. *"Chuyển ngay"*, *"Nhận tiền"*).
  * **Secondary CTA**: Solid Deep Teal (`#0E828A`), white bold text (e.g. *"Xem ngay"*, *"Khám phá"*).
  * **Ghost CTA**: White background with subtle teal outline (`1px solid #0E828A`).

### 2.4. Ergonomics & Touch Targets
* Back button (`< Trang chủ`) and search icon $\ge 44 \times 44\text{px}$.
* Conversation list row minimum height: $72\text{px}$.
* Message bubbles minimum touch padding: $12\text{px}$ horizontal, $10\text{px}$ vertical.
* Banner CTA touch area $\ge 44\text{px}$ height with full-width or generous pill container.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Conversation List Screen (`LoZaInboxView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]                 LoZa              [ 🔍 ] │
├────────────────────────────────────────────────────────┤
│ [ Tin nhắn (3) ]       [ Danh bạ ]       [ Khám phá ]  │
├────────────────────────────────────────────────────────┤
│ 📌 Anh Tuấn Thợ Điện           12:45        🔴 [ 1 ]   │
│    Em nhớ anh quá... Tối mai chỗ cũ nhé                │
├────────────────────────────────────────────────────────┤
│ 🔒 Tin nhắn bị ẩn              10:20        [ Mật mã ] │
│    Nhập mã PIN 4 số để xem                             │
├────────────────────────────────────────────────────────┤
│ 👨‍👩‍👧‍👦 Gia Đình Là Số 1             Hôm qua                 │
│    Mẹ: Cuối tuần này cả nhà về quê ăn giỗ...           │
├────────────────────────────────────────────────────────┤
│ 📢 BĐS Hưng Vượng Thông Báo     11/10                  │
│    Công ty thông báo lịch nghỉ lễ Quốc Khánh...        │
└────────────────────────────────────────────────────────┘
```

### 3.2. Chat Thread Screen (`LoZaChatThreadView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Quay lại]        Anh Tuấn Thợ Điện           [ ℹ️ ] │
│                     Vừa mới truy cập                   │
├────────────────────────────────────────────────────────┤
│ ⚠️ Tin nhắn tự xoá sau 24h đã được kích hoạt           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [12:30] Anh đang làm gì thế?                           │
│ [Ảnh: Sticker Gấu Mèo gửi nụ hôn 💕]                   │
│                                                        │
│            [12:35] Anh đang họp với sếp, lát anh nhắn  │
│                                                        │
│ [12:45] Nhớ anh quá, tối mai chỗ cũ nhé...             │
│ [Vị trí: 📍 Khách Sạn Sen Vàng - Phố Huế]              │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [ 🎙️ 0:14 ] "Bé cưng của anh đầm tay lắm..." [ ▶ ]    │
└────────────────────────────────────────────────────────┘
```

### 3.3. PIN Pad Modal (`LoZaPinModal`)
* Slide-up modal overlay ($320\text{px}$ width) displaying 4 PIN indicator dots and numeric keypad ($0\text{--}9$) with delete key.
* Failed attempts trigger shake animation and Suspicion Counter increment (+1 strike).

### 3.4. In-Chat LoZaPay Transfer Bubble (`LoZaPayTransferBubble`)
* **Role**: Renders transactional peer-to-peer money transfers sent within a chat thread. Used for forensic clues (e.g. secret transfers disguised as innocent expenses, or $520.000\text{ đ}$ / $1.314.000\text{ đ}$ romantic sums).
```
┌────────────────────────────────────────────────────────┐
│ [< Quay lại]        Anh Tuấn Thợ Điện           [ ℹ️ ] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 💳 LoZaPay • Chuyển tiền nhanh        [ túi đầy  │  │
│  │                                         tiền ✨] │  │
│  │   + 5.200.000 đ                                  │  │
│  │   Giao dịch hoàn tất • 12:46                     │  │
│  │                                                  │  │
│  │   Lời nhắn: "Tặng bé cưng đi spa cuối tuần 💕"   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ [ Nhận tiền ngay ]               [ Xem chi tiết >]│  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│            [12:47] Cảm ơn anh iu nhiều nhaaaa! 😻      │
│                                                        │
└────────────────────────────────────────────────────────┘
```
* **Component Specifications**:
  * Card container: Neutral white (`#FFFFFF`) with $1\text{px}$ subtle mint border (`#00C97B`), border radius $12\text{px}$.
  * Badge sticker: Pill shape with sunny yellow background (`#FBBF24`), bold black text.
  * CTA buttons: Pill button (`#00C97B`) with white text, touch target $\ge 44\text{px}$.

### 3.5. Group Lucky Money Envelope (`LoZaPayLixiBubble`)
* **Role**: Renders group lucky money / lì xì envelopes within group or direct chats.
```
┌────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🧧 Lì Xì Nhóm • LoZaPay               [ siêu dễ ] │  │
│  │   "Chúc bé cưng hay ăn chóng lớn mau về với anh" │  │
│  │                                                  │  │
│  │   [ 🎁 MỞ LÌ XÌ ]   (Đã nhận 1/1 bao lì xì)      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 3.6. Discovery & In-App Promotional Banners (`LoZaBannerView`)
* Conforms strictly to the **ZaloPay 2024 Banner Architecture**:
  * **Aspect Ratio**: 2:1 (`720 × 360 px` on mobile canvas) or 3:1 (`1080 × 360 px` on wide screens).
  * **Horizontal Grid Split**:
    * **Left 2/3**: Headline (Bold, Sentence-case, $\ge 20\text{px}$), Sub-headline, and Pill CTA Button on a clean pastel gradient (`#E0F7FA` to `#E8F5E9`).
    * **Right 1/3**: Key Visual (KV) featuring Phone frame, Mascot Trio (Toro/Tofi/Tofu parody), or partner visual. No overlapping elements disturbing headline legibility.
```
┌────────────────────────────────────────────────────────────────────────┐
│                      LOZAPAY PROMO BANNER (2:1)                        │
├────────────────────────────────────────┬───────────────────────────────┤
│ 2/3 NỘI DUNG CHÍNH (Nền pastel nhẹ)   │ 1/3 KEY VISUAL (Bên phải)     │
│                                        │                               │
│  [ Tem: nhanh & tiện ]                 │        ┌──────────────┐       │
│  Mở ví giấu quỹ, nhận quà mê ly        │        │   📱 Điện    │       │
│  Chuyển tiền siêu tốc bảo mật cao      │        │    thoại     │       │
│                                        │        │   + Mascot   │       │
│  [ Khám phá ngay > ]                   │        │  Toro (100%) │       │
│                                        │        └──────────────┘       │
└────────────────────────────────────────┴───────────────────────────────┘
```

---

## 4. Authoritative External Reference Mapping Stub

This specification incorporates and adapts the visual principles, color rules, layout ratios, and sticker/mascot design guidelines from the following authoritative external standard:

* **Source Document**: [ZaloPay Brand Guidelines 2024](https://simg.zalopay.com.vn/zst/zlp-website/resources/static/2024-07-02/zalopay-brand-guidelines.pdf)
* **Authoritative Organization**: ZaloPay (Zion JSC / VNG Corporation).
* **Parody Adaptation Summary**:
  * **Identity**: Sub-service *LoZaPay* parodying *ZaloPay* within the *LoZa* chat ecosystem.
  * **Palette Mapping**: Shifted from ZaloPay electric blue (`#0033C9`) / green (`#00CF6A`) to LoZa deep teal (`#0E828A`) / mint green (`#00C97B`), while preserving the dual primary 50:50 / 70:30 color balance and supporting 5-color pastel/accent palette.
  * **Typography**: Sentence-case headline standard and hierarchical size tiers inspired by Aeonik Pro guidelines.
  * **Sticker & Badges**: Retained the $1 - 3$ badge density rule and pill/burst graphic shapes with viral Vietnamese marital and financial colloquialisms.
  * **Mascot Trio**: Formally adapted the Toro (100%), Tofi (115%), and Tofu (80%) mascot scale proportions into satirical investigative assets.
  * **Layout Systems**: Exact adoption of the 2:1 and 3:1 in-app banner split (1/3 KV right, 2/3 copy left) and pill CTA button standards.

