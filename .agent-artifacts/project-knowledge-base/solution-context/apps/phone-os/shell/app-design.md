---
type: App Design Specification
app_id: phone_shell
app_name: Virtual Phone OS Shell & Launcher
status: approved
description: "Authoritative UI/UX design specification for the physical phone chassis, Neural Dynamic Island, Status Bar integration, and iOS 26/27 SpringBoard launcher grid."
tags: [app-design, phone-os, shell, launcher, springboard, dynamic-island, bezel, ios27, ui-ux]
timestamp: "2026-10-14T12:50:00+07:00"
---

# Phone OS — Shell & SpringBoard Launcher UI/UX Specification

> **Parent Design Master**: [../app-design.md](../app-design.md)  
> **Functional Specification**: [features.md](features.md)  
> **Modular Subsystems**: [Hardware Bezel & Chassis](../bezel-shell.md) | [Home Launcher Detail](../home-launcher.md) | [Status Bar System Chrome](../status-bar.md)  
> **Standard**: Modern Flagship Smartphone Parody (iOS 26/27 Liquid Glass & Neural Island Era)

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **Subsystem Name** | **Parody Phone Shell & SpringBoard Launcher** |
| **System Version** | **iOS 27 Parody Edition** |
| **Ergonomic Target** | $393\text{px} \times 852\text{px}$ base viewport ($100\text{dvh}$ mobile edge-to-edge; centered floating chassis on desktop). |
| **Visual Aesthetic** | Contemporary liquid glassmorphic design, continuous squircle app icons ($16\text{px}$ border radius), adaptive dark mode/tinted icons, and persistent zero-label frosted dock. |
| **Wallpaper & Theme** | Default husband wallpaper: Deep midnight blue and slate gradient (`#0B1329` to `#172C66`) with subtle ambient glow, conveying a sleek, masculine, yet secretive aura. |

---

## 2. Visual Design System & System Tokens

### 2.1. Chassis & Surface Tokens
```css
/* Shell & Hardware Frame Tokens */
--wf-shell-bg: #0B1329;
--wf-shell-bezel-border: #18181B; /* Matte Titanium Dark */
--wf-shell-rim-highlight: #3F3F46; /* Metallic Slate Ring */
--wf-shell-radius: 50px;
--wf-shell-island-bg: #000000;
--wf-shell-island-pill-width: 120px;
--wf-shell-island-pill-height: 30px;
--wf-shell-island-radius: 20px;

/* iOS 26/27 Tinted Icon Tokens */
--wf-icon-bg-dark: rgba(30, 41, 59, 0.75);
--wf-icon-border-tint: rgba(255, 255, 255, 0.16);
--wf-icon-glyph-tint: #93C5FD; /* Electric ice blue tint */
--wf-icon-badge-red: #EF4444;
```

### 2.2. Frosted Liquid Dock Tokens
```css
/* Persistent Bottom Dock */
--wf-dock-bg: rgba(255, 255, 255, 0.14);
--wf-dock-backdrop-blur: blur(24px);
--wf-dock-border: 1px solid rgba(255, 255, 255, 0.20);
--wf-dock-radius: 36px;
--wf-dock-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
```

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Master Desktop Hardware Viewport & Dynamic Neural Island

```
┌────────────────── [ Speaker Grille / Bezel Rim ] ──────────────────┐
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ 23:45             [ Neural Dynamic Island ]     [Signal] [Batt]│ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │                                                                │ │
│ │                                                                │ │
│ │                  (ACTIVE APP / LAUNCHER VIEWPORT)              │ │
│ │                                                                │ │
│ │                                                                │ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │ ════════════════════════ [ — Home Bar — ] ════════════════════ │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

* **Neural Dynamic Island Modes**:
  * **Idle Pill**: $120\text{px} \times 30\text{px}$ pill containing front camera aperture and ambient sensor.
  * **Active Audio / Alert Expansion**: Expands horizontally ($210\text{px} \times 34\text{px}$) displaying subtle audio waveform or clue trigger animations.

---

### 3.2. iOS 26/27 SpringBoard Launcher Grid (12-App Invariant)

In accordance with anti-spoiler gameplay architecture, all 12 parody apps are permanently installed across Level 1, Level 2, and Level 3. With `Comms` cleanly separated into **Phone** and **Messages**, the SpringBoard organizes 8 grid apps and 4 dock apps:

```
┌────────────────────────────────────────────────────────┐
│ 23:45             [ Dynamic Island ]    [Signal] [Batt]│
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────┐   ┌──────────────────────┐   │
│  │  🕒 23:45            │   │  📅 THỨ BA           │   │
│  │  Hôm nay             │   │  13 Tháng 10         │   │
│  │  "Chồng báo trực đêm"│   │  Pin: 42% (Tiết kiệm)│   │
│  └──────────────────────┘   └──────────────────────┘   │
│         (iOS 26/27 Detective Smart Stack 2x2 Widget)   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────┐│
│  │  Poshee  │   │   Grap   │   │ NetSurf  │   │ Photos││
│  │ [ShopBag]│   │  [Car]   │   │[Compass] │   │[Image]││
│  └──────────┘   └──────────┘   └──────────┘   └───────┘│
│     Poshee          Grap         NetSurf       Photos  │
│                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────┐│
│  │ GeeMail  │   │ InkedLin │   │   Tim    │   │ Notes ││
│  │  [Mail]  │   │ [Brief]  │   │ [People] │   │[DocTxt││
│  └──────────┘   └──────────┘   └──────────┘   └───────┘│
│     GeeMail       InkedLin         Tim         Notes   │
│                                                        │
│                 ••••   [ [Search] Tìm kiếm ]           │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │  (Frosted Liquid Dock — Strict Zero-Label Invariant│ │
│ │  ┌──────┐       ┌──────┐       ┌──────┐    ┌─────┐ │ │
│ │  │Phone │       │ Zola │(3)    │VietP.│(1) │Msgs │(4)│
│ │  │[Call]│       │[Chat]│       │[Card]│    │[SMS]│ │ │
│ │  └──────┘       └──────┘       └──────┘    └─────┘ │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ ══════════════════════ [ — ] ═════════════════════════ │
└────────────────────────────────────────────────────────┘
```

---

## 4. Interaction Patterns & System Behaviors

### 4.1. App Launch & Return Physics
* **Icon Press & Expansion**: Tapping an icon triggers a $180\text{ms}$ ease-out scale expansion (`transform: scale(0.92)` on press, expanding to $100\%$ viewport).
* **Home Bar Return**: Tapping `< Trang chủ` or flicking upward on the bottom Home Indicator bar initiates a $160\text{ms}$ smooth shrink return to the launcher.

### 4.2. Dock Zero-Label Invariant
* App labels are strictly suppressed within the frosted glass dock tray. Icons scale to $58\text{px} \times 58\text{px}$ squircles with $14\text{px}$ border radius.

### 4.3. Parody App Navigation Bar
Every opened parody app mounts inside the shell below the system status bar, displaying a standardized top utility header:
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]               [App Title]         [ 🔍 ] │
├────────────────────────────────────────────────────────┤
```

---

## 5. Traceability & Associated Deliverables

* **Parent OS Master**: [../app-design.md](../app-design.md)
* **Functional Specification**: [features.md](features.md)
* **Status Bar System Chrome**: [../status-bar.md](../status-bar.md)
* **Hardware Frame Geometry**: [../bezel-shell.md](../bezel-shell.md)
* **SpringBoard Rules**: [../home-launcher.md](../home-launcher.md)
