---
type: App Design Specification
app_id: phone_os
app_name: Virtual Phone OS & Shell (System Master Design)
status: approved
description: "Master UI/UX design system, physical bezel frame, status bar tokens, home screen launcher grid, shared PIN lock pad, and notification banner architecture applying to all OS applications."
tags: [app-design, phone-os, launcher, lock-screen, notifications, ui-ux, design-system, os-master]
timestamp: "2026-10-13T16:40:00+07:00"
---

# Virtual Phone OS — Master Design & UI/UX Specification

> **Architectural Scope**: This design specification defines the physical phone shell, bezel frame, status bar chrome, shared lockpad, and native OS apps (`comms`, `photos`, launcher shell) for the emulated smartphone. It inherits from and conforms to the overarching [Universal Design System SSOT](../../design-system/design.md).
>
> **Parody App Styling Rule**: As specified in the Universal Design System, third-party parody apps (`LoZa`, `VietPay`, `Poshee`, etc.) inherit universal layout, accessibility, and behavioral standards, while strictly retaining their own local CSS styling tokens under their respective `apps/<app_id>/app-design.md`.

### Master Architecture & Progressive Discovery Map

To prevent monolithic document bloat, detailed specifications for individual OS subsystems are modularized into dedicated topic documents under this universal umbrella:

| Topic Area | Authoritative Specification File | Key Focus & Tokens |
|---|---|---|
| **Universal Design SSOT** | [../../design-system/design.md](../../design-system/design.md) | Universal atomic design, WCAG accessibility, gutters, common behaviors, motion physics, evidence pinning |
| **Typography & Font Stack** | [typography.md](typography.md) | Apple HIG 12-tier dynamic scale, Inter cross-platform fallback, tabular numbers, tracking |
| **Hardware Bezel & Frame** | [bezel-shell.md](bezel-shell.md) | Desktop titanium chassis ($393\text{px} \times 852\text{px}$), Dynamic Island geometry, responsive modes |
| **Status Bar System Chrome** | [status-bar.md](status-bar.md) | 3-zone layout, zero-carrier rule, capsule battery with dynamic fill |
| **Home Screen & SpringBoard** | [home-launcher.md](home-launcher.md) | SpringBoard grid, $2 \times 2$ detective smart widget, continuous squircles, zero-label dock |
| **Phone Shell & Launcher UI** | [shell/app-design.md](shell/app-design.md) | Dedicated physical chassis, Neural Dynamic Island, and 12-app SpringBoard launcher specification |
| **Shared PIN Lockpad** | [pin-lockpad.md](pin-lockpad.md) | Dual-tier button typography (digits + uppercase letters), PIN dots, error shake physics |
| **Native Phone (Dialer & Contacts)** | [phone/app-design.md](phone/app-design.md) | Recents call logs, duration badges, and contact directory inspector |
| **Native Messages (SMS Threads)** | [messages/app-design.md](messages/app-design.md) | SMS bubbles, parody tapbacks, dynamic text effects, and brand notifications |
| **Photos & Media Vault** | [photos/app-design.md](photos/app-design.md) | iOS 27 unified single-view photostream, smart suspect collections, hidden private album PIN lock |
| **Wife's Investigation Notebook** | [wife-notebook/app-design.md](wife-notebook/app-design.md) | Dossier suspect cards, evidence pinning, confrontation HUD |

---

## 1. System Identity & Emulated Mobile OS Theme

| Attribute | Specification |
|---|---|
| **System Name** | **Parody Mobile OS** (Satirical blend of iOS & Android / OneUI) |
| **Ergonomic Viewport** | Mobile-first portrait ratio ($375\text{px}$–$430\text{px}$ base width, $812\text{px}$–$932\text{px}$ height). On desktop browsers, centered inside an elegant curved smartphone bezel frame. |
| **Visual Aesthetic** | Contemporary smartphone operating system with subtle glassmorphic blurs, rounded app icons ($16\text{px}$ border radius), notification badges, and physical device status indicators. |
| **Wallpaper & Mood** | Default aesthetic husband wallpaper: Moody dusk cityscape or abstract dark blue geometric wave (`#0F172A` to `#1E3A8A`), reinforcing a sleek, masculine aesthetic. |

### 1.1. Intellectual Property, Licensing & Safe Design Principles

To ensure complete legal compliance and avoid intellectual property infringement on the web, this design system establishes clear boundaries regarding Apple's design assets:

* **SF Symbols Restriction**: Apple's software license strictly prohibits extracting or using SF Symbols on non-Apple operating systems (including web browsers, Windows, and Android). All UI icons must use open-source alternatives.
* **San Francisco Font Licensing**: Apple's font license strictly prohibits hosting or serving San Francisco (`SF Pro`, `SF Compact`) font files (`.woff2`, `.ttf`) on web servers. We utilize client-side system font fallbacks (`-apple-system, BlinkMacSystemFont`) and open-source equivalents ([Inter](https://rsms.me/inter/)).
* **Trademarks & Copyrighted Icons**: Direct 1:1 copies of Apple app icons (Safari compass, Photos flower, Messages bubble, Settings gear, Apple logo) and proprietary trademarks are strictly forbidden. All apps use satirical, original parody names and iconography (e.g., *NetSurf*, *LoZa*, *VietPay*).
* **Lawful Look-and-Feel (Trade Dress)**: Mobile UI layout paradigms (frosted glass blurs, squircle cards, bottom sheets, toggle switches) are uncopyrightable design patterns and are implemented using custom CSS tokens without imitating Apple branding or misleading users.

---

## 2. Visual Design System & System Tokens

### 2.1. System Color & Bezel Tokens
```
┌────────────────────────────────────────────────────────┐
│                 PHONE OS COLOR TOKENS                  │
├────────────────────────────────────────────────────────┤
│ Shell Bezel Frame:    Titanium Dark   #18181B          │
│ Bezel Border Ring:    Metallic Slate  #3F3F46          │
│ Status Bar Text:      Pure White      #FFFFFF          │
│ App Icon Badge Red:   Notification Red #EF4444         │
│ Keypad Number Button: Charcoal Soft   #334155          │
│ Keypad Pressed State: Indigo Glow     #6366F1          │
└────────────────────────────────────────────────────────┘
```

### 2.2. Dialed-Down iOS Glass System (Compact Tokens)
A lightweight, token-efficient implementation of iOS frosted glass that avoids excessive multi-tier materials while preserving authentic mobile OS aesthetics:

| Glass Tier | Target Components | CSS Recipe (Fills, Blur & Border) |
|---|---|---|
| **Subtle Glass** (`.glass-subtle`) | Dock tray, Search pill, Keypad buttons | `background: rgba(255, 255, 255, 0.12);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid rgba(255, 255, 255, 0.18);` |
| **Elevated Glass** (`.glass-elevated`) | Shared PIN keypad surface, Modals, Action sheets | `background: rgba(30, 41, 59, 0.85);`<br>`backdrop-filter: blur(20px);`<br>`border: 1px solid rgba(255, 255, 255, 0.12);`<br>`box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);` |
| **Light Toast Glass** (`.glass-toast-light`) | Standard incoming notification toasts | `background: rgba(255, 255, 255, 0.92);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid #E2E8F0;`<br>`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);` |

```css
/* Minimalist iOS Glass Utilities */
.glass-subtle {
  background: rgba(255, 255, 255, 0.12);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-elevated {
  background: rgba(30, 41, 59, 0.85);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.glass-dock {
  background: rgba(255, 255, 255, 0.14);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
```

### 2.3. Typography & Dynamic Type Scale

> **Detailed Specification**: See [typography.md](typography.md) for the complete 12-tier Apple HIG dynamic type scale, cross-platform Inter font stack, tabular numeral formatting, and negative optical tracking rules.

* **Canonical Cross-Platform Font Stack**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", -system-ui, sans-serif;
  ```
* **Apple HIG Scale Mapping**: 12 standard tiers ranging from Large Title ($34\text{px}$ / $700$) down to Caption 2 ($11\text{px}$ / $600$).
* **Tabular Numerals**: Enforced via `tabular-nums` across status bar clock, battery, countdown timers, and PIN inputs to prevent horizontal jitter.
* **Dock Label Invariant**: Icons within the frosted dock tray omit text labels (`display: none`). App labels on the Home Screen use $12\text{px}$ Medium with Gaussian drop shadows.

### 2.4. Iconography & System Icon Pack ([Ionicons](https://ionic.io/ionicons) iOS Parody System)

To ensure high-fidelity parity with contemporary iOS while remaining 100% compliant with Apple's licensing restrictions (avoiding unauthorized extraction of SF Symbols on the web), all visual icons across the OS shell and virtual applications MUST adhere to this iconography specification:

* **Canonical Icon Pack**: **[Ionicons](https://ionic.io/ionicons)** (MIT License, designed with iOS-styled glyphs, outline, and filled variants).
  * Integration: Available via Ionicons web components (`<ion-icon name="...">`), React wrapper / `@ionic/core`, or direct standalone SVGs.
* **Vector Design Tokens**:
  * Baseline geometry: $24\text{px} \times 24\text{px}$ viewbox ($20\text{px}$–$24\text{px}$ rendered glyph size).
  * Stroke weight: Consistent $2\text{px}$ stroke or equivalent outline variant (`-outline`), with filled variants (`-sharp` or base name) reserved for active/badge states.
  * Fill & Color: Inherits parent foreground or maps to semantic CSS tokens (`--wf-status-text`, `--wf-primary`, `--wf-accent`).
* **Strict Zero-Emoji Invariant**:
  * Raw Unicode emojis (e.g. 📷, 📶, 🔋, 🔍, 🔒, ⚠️, 💬, 🛍️, 🚗, 🌐, 🖼️, 💳, 📞, 📝, 🏠, 🎀, 🗂️, 🔄, 🔴) are **strictly forbidden** in UI chrome, launchers, buttons, status bars, and notifications.
  * All iconography must be rendered via vector SVGs from the canonical Ionicons pack.

#### Canonical Glyph Mapping Table

| Semantic Element | Canonical Ionicons Name | Render Variant | Emulated iOS Metaphor | Description & Context |
|---|---|---|---|---|
| **Cellular Signal** | `cellular-outline` | Outline / Fill | `cellularbars` | 4-bar status bar cellular strength |
| **Wi-Fi** | `wifi-outline` | Outline / Fill | `wifi` | 3-arc Wi-Fi connection indicator |
| **Battery Level** | `battery-half-outline` | Outline / Fill | `battery.75` | Horizontal capsule with dynamic charge fill |
| **Search Pill** | `search-outline` | Outline | `magnifyingglass` | Home launcher search bar icon |
| **App: LoZa** | `chatbubble-ellipses-outline` | Outline / Fill | `message.fill` | Rounded parody chat bubble |
| **App: VietPay** | `card-outline` | Outline / Fill | `creditcard.fill` | Digital payment card with EMV stripe |
| **App: Poshee** | `bag-handle-outline` | Outline / Fill | `bag.fill` | Minimalist e-commerce shopping bag |
| **App: Grap** | `car-outline` | Outline / Fill | `car.fill` | Ride-hailing vehicle silhouette |
| **App: NetSurf** | `compass-outline` | Outline / Fill | `safari.fill` / `compass` | Safari-parody directional compass |
| **App: Photos** | `images-outline` | Outline / Fill | `photo.fill` | Borderless landscape photo tile |
| **App: Comms** | `call-outline` | Outline / Fill | `phone.fill` | Native call dialer & SMS icon |
| **App: Husband Notes** | `document-text-outline` | Outline / Fill | `note.text` | Lined document note sheet |
| **App: Wife Notebook** | `book-outline` | Outline / Fill | `book.closed.fill` | Dossier investigation notebook |
| **PIN Lockpad** | `lock-closed-outline` | Outline / Fill | `lock.fill` | Security keypad lock indicator |
| **Suspicion / Alert** | `warning-outline` | Outline / Fill | `exclamationmark.triangle.fill` | Strike warning and suspicion alert |
| **Back Navigation** | `chevron-back-outline` | Outline | `chevron.left` | Standard iOS back navigation chevron |
| **Dismiss / Close** | `close-outline` | Outline | `xmark` | Action sheet and toast close button |
| **Keypad Backspace** | `backspace-outline` | Outline / Fill | `delete.left.fill` | Lockpad backspace key |

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Emulated Smartphone Shell & SpringBoard Launcher

> **Authoritative UI/UX Specification**: The physical chassis, Neural Dynamic Island, 12-app SpringBoard grid, and persistent zero-label frosted dock are authoritatively detailed in:
> * **[Phone OS Shell & Launcher](shell/app-design.md)**: Full layout, iOS 26/27 tinted icon styling, and interaction physics.
> * **[Hardware Bezel & Frame](bezel-shell.md)**: Desktop titanium frame tokens ($393\text{px} \times 852\text{px}$), Dynamic Island geometry, and responsive modes.
> * **[Home Screen & SpringBoard Grid](home-launcher.md)**: $4 \times 4$ icon grid rules and $2 \times 2$ Detective Smart Stack Widget mechanics.
> * **[Status Bar System Chrome](status-bar.md)**: 3-zone layout, zero-carrier invariant, and dynamic capsule battery.


### 3.3. Shared PIN Lock Screen Component (`SharedPinLockpad`)

> **Detailed Specification**: See [pin-lockpad.md](pin-lockpad.md) for dual-tiered button typography (digits + alphabet subtext), error shake physics, and suspicion strike rules.

Used universally across any protected app entry or sub-folder (*VietPay root, Photos hidden album, LoZa hidden chat*).

```
┌────────────────────────────────────────────────────────┐
│ [< Thoát ra]              KHÓA BẢO MẬT                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     [Lock] VIETPAY                     │
│               Nhập mã PIN 4 số để truy cập             │
│                                                        │
│                    ○   ○   ○   ○                       │
│                   (Chấm nhập mã)                       │
│                                                        │
├────────────────────────────────────────────────────────┤
│              ┌───────┐   ┌───────┐   ┌───────┐         │
│              │   1   │   │   2   │   │   3   │         │
│              │       │   │  ABC  │   │  DEF  │         │
│              └───────┘   └───────┘   └───────┘         │
│              ┌───────┐   ┌───────┐   ┌───────┐         │
│              │   4   │   │   5   │   │   6   │         │
│              │  GHI  │   │  JKL  │   │  MNO  │         │
│              └───────┘   └───────┘   └───────┘         │
│              ┌───────┐   ┌───────┐   ┌───────┐         │
│              │   7   │   │   8   │   │   9   │         │
│              │ PQRS  │   │  TUV  │   │ WXYZ  │         │
│              └───────┘   └───────┘   └───────┘         │
│                          ┌───────┐   ┌───────┐         │
│                          │   0   │   │ [Del] │         │
│                          │       │   │       │         │
│                          └───────┘   └───────┘         │
├────────────────────────────────────────────────────────┤
│ [Alert] Sai mã sẽ làm tăng mức độ nghi ngờ của chồng!  │
│ Số lần thử còn lại: [ • • • ] (3/4)                    │
└────────────────────────────────────────────────────────┘
```

### 3.4. Top Notification Toast Banner (`NotificationBanner`)
Slides down over any currently open app screen when a simulated real-time event triggers:

```
┌────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────┐ │
│ │ [chatbubble-ellipses] LoZa • Vừa xong      [close] │ │
│ │ Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé" │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ (Giao diện ứng dụng đang mở bên dưới)                  │
└────────────────────────────────────────────────────────┘
```

---

## 4. Interaction & Micro-Animations

* **App Launch Transition**: Tapping an app icon initiates a $180\text{ms}$ ease-out scale expansion into the app interface.
* **Home Return Gesture**: Tapping `< Trang chủ` or swiping the bottom home indicator initiates a $150\text{ms}$ smooth fade return to the 8-app launcher.
* **Lockpad Input & Error Shake**:
  * Tapping digits fills indicator dots sequentially.
  * Incorrect PIN triggers a $400\text{ms}$ horizontal shake animation, clears dots, and flashes red `#EF4444`.
* **Toast Notification Slide**: Dynamic toasts enter with a $250\text{ms}$ spring curve from the top of the viewport and auto-dismiss after $5\text{s}$ unless tapped.

