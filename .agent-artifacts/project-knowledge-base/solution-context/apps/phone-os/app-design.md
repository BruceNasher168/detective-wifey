---
type: App Design Specification
app_id: phone_os
app_name: Virtual Phone OS & Shell (System Master Design)
status: approved
description: "Master UI/UX design system, physical bezel frame, status bar tokens, home screen launcher grid, shared PIN lock pad, and notification banner architecture applying to all OS applications."
tags: [app-design, phone-os, launcher, lock-screen, notifications, ui-ux, design-system, os-master]
timestamp: "2026-10-13T16:40:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/shell/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/comms/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/photos/app-design.md
---

# Virtual Phone OS — Master Design & UI/UX Specification

> **Architectural Scope**: This master design specification defines the visual identity, viewport ergonomics, bezel shell, status bar tokens, shared security lockpad, and notification banners for the emulated smartphone. These rules and design tokens govern the entire phone container and apply universally across all native OS apps (`comms`, `photos`, and launcher shell).

---

## 1. System Identity & Emulated Mobile OS Theme

| Attribute | Specification |
|---|---|
| **System Name** | **Parody Mobile OS** (Satirical blend of iOS & Android / OneUI) |
| **Ergonomic Viewport** | Mobile-first portrait ratio ($375\text{px}$–$430\text{px}$ base width, $812\text{px}$–$932\text{px}$ height). On desktop browsers, centered inside an elegant curved smartphone bezel frame. |
| **Visual Aesthetic** | Contemporary smartphone operating system with subtle glassmorphic blurs, rounded app icons ($16\text{px}$ border radius), notification badges, and physical device status indicators. |
| **Wallpaper & Mood** | Default aesthetic husband wallpaper: Moody dusk cityscape or abstract dark blue geometric wave (`#0F172A` to `#1E3A8A`), reinforcing a sleek, masculine aesthetic. |

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

### 2.3. Typography & Ergonomics
* **Typography**:
  * System Clock (Home Screen): Light sans-serif ($64\text{px}$ / weight $300$).
  * System Clock (Status Bar): Semibold ($14\text{px}$ / weight $600$).
  * App Launcher Labels: Regular ($12\text{px}$ / weight $500$, drop shadow for wallpaper contrast).
  * Lockpad Numbers: Bold ($24\text{px}$).
* **Ergonomics & Touch Targets**:
  * Home Screen App Icons: $\ge 60 \times 60\text{px}$ with tap target padding $\ge 72 \times 72\text{px}$.
  * Lockpad Numeric Buttons: $\ge 68 \times 68\text{px}$ circular touch targets.
  * Home Indicator Bar: $134\text{px}$ width $\times 5\text{px}$ height, located at bottom center.

### 2.4. Iconography & System Icon Pack (iOS SF / Lucide Parody System)

To ensure high-fidelity parity with contemporary iOS and avoid amateurish emoji styling, all visual icons across the OS shell and virtual applications MUST adhere to this iconography specification:

* **Canonical Icon Pack**: **Lucide Icons** (`lucide-react` / `@lucide/react`) styled to match Apple iOS SF Symbols.
* **Vector Design Tokens**:
  * Baseline geometry: $24\text{px} \times 24\text{px}$ viewbox ($20\text{px}$–$24\text{px}$ rendered glyph size).
  * Stroke weight: $2\text{px}$ (`stroke-width="2"`), rounded linecaps (`stroke-linecap="round"`), and rounded joins (`stroke-linejoin="round"`).
  * Fill & Color: Inherits parent foreground or maps to semantic CSS tokens (`--wf-status-text`, `--wf-primary`, `--wf-accent`).
* **Strict Zero-Emoji Invariant**:
  * Raw Unicode emojis (e.g. 📷, 📶, 🔋, 🔍, 🔒, ⚠️, 💬, 🛍️, 🚗, 🌐, 🖼️, 💳, 📞, 📝, 🏠, 🎀, 🗂️, 🔄, 🔴) are **strictly forbidden** in UI chrome, launchers, buttons, status bars, and notifications.
  * All iconography must be rendered via vector SVGs from the canonical icon pack.

#### Canonical Glyph Mapping Table

| Semantic Element | Canonical Lucide Icon | iOS SF Symbol Equivalent | Description & Context |
|---|---|---|---|
| **Cellular Signal** | `SignalHigh` / `Signal` | `cellularbars` | 4-bar status bar cellular strength |
| **Wi-Fi** | `Wifi` | `wifi` | 3-arc Wi-Fi connection indicator |
| **Battery Level** | `Battery` | `battery.75` | Horizontal capsule with dynamic charge fill |
| **Search Pill** | `Search` | `magnifyingglass` | Home launcher search bar icon |
| **App: LoZa** | `MessageCircle` | `message.fill` | Rounded parody chat bubble |
| **App: VietPay** | `CreditCard` | `creditcard.fill` | Digital payment card with EMV stripe |
| **App: Poshee** | `ShoppingBag` | `bag.fill` | Minimalist e-commerce shopping bag |
| **App: Grap** | `Car` | `car.fill` | Ride-hailing vehicle silhouette |
| **App: NetSurf** | `Compass` | `safari.fill` / `compass` | Safari-parody directional compass |
| **App: Photos** | `Image` | `photo.fill` | Borderless landscape photo tile |
| **App: Comms** | `PhoneCall` | `phone.fill` | Native call dialer & SMS icon |
| **App: Husband Notes** | `FileText` | `note.text` | Lined document note sheet |
| **App: Wife Notebook** | `BookOpen` | `book.closed.fill` | Dossier investigation notebook |
| **PIN Lockpad** | `Lock` | `lock.fill` | Security keypad lock indicator |
| **Suspicion / Alert** | `AlertTriangle` | `exclamationmark.triangle.fill` | Strike warning and suspicion alert |
| **Back Navigation** | `ChevronLeft` | `chevron.left` | Standard iOS back navigation chevron |
| **Dismiss / Close** | `X` | `xmark` | Action sheet and toast close button |
| **Keypad Backspace** | `Delete` | `delete.left.fill` | Lockpad backspace key |

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Emulated Smartphone Physical Bezel Shell
The outer container renders the physical phone hardware frame around the 375px–430px viewport on desktop displays, maintaining mobile immersion:

```
┌────────────────── [ Camera / Dynamic Island ] ──────────────────┐
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ 23:45             [ Dynamic Island ]    [Signal] 5G [Batt 42%] │ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │                                                                │ │
│ │                  (ACTIVE APP / LAUNCHER VIEWPORT)              │ │
│ │                                                                │ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │ ════════════════════════ [ — Home Bar — ] ════════════════════ │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2. Home Screen Launcher Grid (`PhoneOSHomeView`)
```
┌────────────────────────────────────────────────────────┐
│ 23:45             [ Dynamic Island ] [Signal] 5G [Batt]│
├────────────────────────────────────────────────────────┤
│                                                        │
│                         23:45                          │
│                Thứ Ba, 13 tháng 10                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────┐│
│  │  Poshee  │   │   Grap   │   │ NetSurf  │   │ Photos││
│  │ [ShopBag]│   │  [Car]   │   │[Compass] │   │[Image]││
│  └──────────┘   └──────────┘   └──────────┘   └───────┘│
│     Poshee          Grap         NetSurf       Photos  │
│                                                        │
│                 ••••   [ [Search] Tìm kiếm ]           │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │  (Frosted Glass Dock — backdrop-filter: blur)      │ │
│ │  ┌──────┐       ┌──────┐       ┌──────┐    ┌─────┐ │ │
│ │  │ LoZa │(3)    │VietP.│(1)    │Comms │(2) │Notes│ │ │
│ │  │[Chat]│       │[Card]│       │[Call]│    │[Doc]│ │ │
│ │  └──────┘       └──────┘       └──────┘    └─────┘ │ │
│ │    LoZa          VietPay        Comms      Ghi chú │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ ══════════════════════ [ — ] ═════════════════════════ │
└────────────────────────────────────────────────────────┘
```

### 3.3. Shared PIN Lock Screen Component (`SharedPinLockpad`)
Used universally across any protected app entry or sub-folder (*VietPay root, Photos hidden album, LoZa hidden chat*).

```
┌────────────────────────────────────────────────────────┐
│ [< Thoát ra]              KHÓA BẢO MẬT                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     [Lock] KHÓA MÃ PIN                 │
│               Nhập mã PIN 4 số để truy cập             │
│                                                        │
│                    ○   ○   ○   ○                       │
│                   (Chấm nhập mã)                       │
│                                                        │
├────────────────────────────────────────────────────────┤
│               ┌─────┐   ┌─────┐   ┌─────┐              │
│               │  1  │   │  2  │   │  3  │              │
│               └─────┘   └─────┘   └─────┘              │
│               ┌─────┐   ┌─────┐   ┌─────┐              │
│               │  4  │   │  5  │   │  6  │              │
│               └─────┘   └─────┘   └─────┘              │
│               ┌─────┐   ┌─────┐   ┌─────┐              │
│               │  7  │   │  8  │   │  9  │              │
│               └─────┘   └─────┘   └─────┘              │
│                         ┌─────┐   ┌─────┐              │
│                         │  0  │   │[Del]│              │
│                         └─────┘   └─────┘              │
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
│ │ [MessageCircle] LoZa • Vừa xong                [X] │ │
│ │ Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé" │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ (Giao diện ứng dụng đang mở bên dưới)                  │
└────────────────────────────────────────────────────────┘
```
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

