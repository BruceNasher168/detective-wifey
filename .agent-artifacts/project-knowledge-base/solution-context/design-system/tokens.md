---
type: Universal Design Specification
system_name: Parody Phone OS Universal Design System
topic: tokens
status: approved
description: "Authoritative design tokens specification covering universal semantic colors, 3-tier frosted glass hierarchy, spacing scale, elevation z-index ladder, and border radius squircles."
tags: [design-tokens, colors, glassmorphism, z-index, spacing, border-radius]
timestamp: "2026-10-15T09:20:00+07:00"
---

# Design System — Core Design Tokens & System Colors

> **Parent Design Master**: [design.md](design.md)  
> **Scope**: Universal tokens inherited by all virtual parody apps and the Phone OS shell.

---

## 1. Universal Semantic Colors & System Tokens

All parody apps and the Phone OS shell inherit these universal semantic color tokens to guarantee visual cohesion, accessible WCAG contrast, and consistent detective feedback:

| Token Name | Base Value | Semantic Role & Universal Usage |
|---|---|---|
| `--sys-canvas` | `#0B1329` | Base dark backdrop canvas across mobile shell and default screens |
| `--sys-surface` | `rgba(30, 41, 59, 0.70)` / `#1E293B` | Content cards, list rows, chat containers, and modal backdrops |
| `--sys-surface-elevated` | `rgba(15, 23, 42, 0.90)` / `#0F172A` | Elevated bottom sheets, action sheets, and modal barrier surfaces |
| `--sys-text-primary` | `#F8FAFC` (`#FFFFFF`) | Primary high-contrast text, dialogue narrative, view titles, and input text |
| `--sys-text-secondary` | `#94A3B8` | Secondary metadata, timestamps, subtitles, photo EXIF, and list snippets |
| `--sys-text-tertiary` | `#64748B` | Footnotes, inactive labels, and input placeholders |
| `--sys-divider` | `rgba(255, 255, 255, 0.12)` | Hairline dividers ($0.5\text{px}$–$1\text{px}$) and micro-borders |
| `--sys-accent` | `#007AFF` / `#38BDF8` | Universal iOS blue interactive controls, focus outlines, and active state tint |
| `--sys-badge-red` | `#EF4444` | Notification badge counter pills, unread alerts, and strike indicators |
| `--sys-clue-amber` | `#F59E0B` | Uncollected clue warning pills and detective HUD highlights |
| `--sys-success-green` | `#22C55E` | Verified checkmarks, successful transactions, online status, and victory state |

### 1.1. Color Ownership & Delegation Rules
1. **Universal Enforcement**: Universal semantic tokens (`--sys-*`) govern text contrast, hairline borders, feedback states (red/amber/green), and base glass materials across **all virtual apps**.
2. **Phone OS Shell Colors**: Physical hardware bezel (`#18181B`), metallic slate ring (`#3F3F46`), Dynamic Island (`#000000`), wallpaper gradients, and launcher dock styling are authoritatively owned by [phone-os/app-design.md](../apps/phone-os/app-design.md) and [phone-os/shell/app-design.md](../apps/phone-os/shell/app-design.md).
3. **Parody App Brand Palettes**: Third-party parody apps authoritatively define and encapsulate their proprietary brand colors (e.g. `Zola` electric blue, `VietPay` emerald green, `Poshee` vibrant orange, `Grap` green) inside their local scopes under [`../apps/<app_id>/app-design.md`](../apps/). Brand colors must never pollute universal tokens or cross app boundaries.

---

## 2. Dialed-Down iOS Frosted Glass Hierarchy

To preserve native mobile fidelity while ensuring lightweight performance across web browsers, the system uses a compact 3-tier frosted glass hierarchy:

| Glass Tier | Class Name | CSS Recipe | Target Components |
|---|---|---|---|
| **Subtle Glass** | `.glass-subtle` | `background: rgba(255, 255, 255, 0.12);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid rgba(255, 255, 255, 0.18);` | Dock tray, Search pill, Keypad circular buttons |
| **Elevated Glass** | `.glass-elevated` | `background: rgba(30, 41, 59, 0.90);`<br>`backdrop-filter: blur(20px);`<br>`border: 1px solid rgba(255, 255, 255, 0.12);`<br>`box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);` | Shared PIN keypad modal, Bottom sheets, Context menus |
| **Light Toast Glass** | `.glass-toast-light` | `background: rgba(255, 255, 255, 0.95);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid #E2E8F0;`<br>`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);` | Notification banner toasts, Floating timestamps |

---

## 3. Spacing Scale

All margins, paddings, icon bounds, and layout dimensions adhere to an **$8\text{px}$ base grid** with a **$4\text{px}$ micro-step**:

| Token | Dimension | Rem | Semantic Usage |
|---|---|---|---|
| `--space-1` | $4\text{px}$ | `0.25rem` | Micro-padding, icon-to-badge gaps, hairline borders |
| `--space-2` | $8\text{px}$ | `0.5rem` | Compact item gap, badge padding, button text spacing |
| `--space-3` | $12\text{px}$ | `0.75rem` | Card internal padding, dense feed item spacing |
| `--space-4` | **$16\text{px}$** | **`1.0rem`** | **Standard Universal Gutter (Screen side margins)** |
| `--space-5` | $20\text{px}$ | `1.25rem` | Form field padding, section header top spacing |
| `--space-6` | $24\text{px}$ | `1.5rem` | Section vertical separation, modal sheet header gap |
| `--space-8` | $32\text{px}$ | `2.0rem` | Major group separation, lockpad keypad vertical spacing |
| `--space-10` | $40\text{px}$ | `2.5rem` | View header top offset |
| `--space-12` | $48\text{px}$ | `3.0rem` | Bottom dock bottom offset, FAB floating margin |

---

## 4. Elevation & Z-Index Layer Stack

All layered UI elements must respect this standardized z-index ladder to prevent stacking clashes:

| Layer Level | Z-Index Token | Component / Screen Surface |
|---|---|---|
| **Wallpaper & Canvas** | `z-0` | Desktop outer chassis background, OS wallpaper image |
| **SpringBoard Grid** | `z-10` | Home screen icons, Detective widget, Dock tray |
| **Active Virtual App** | `z-20` | Fullscreen virtual app viewport (`Zola`, `VietPay`, etc.) |
| **In-App Sticky Chrome** | `z-30` | In-app navigation header, sticky bottom tab bar |
| **System Status Bar** | `z-40` | Top `StatusBar` and Dynamic Island pill |
| **Persistent Game HUD** | `z-50` | `AssistiveTouch` button, Wife's Notebook FAB trigger |
| **Modal Drawers & Lockpad** | `z-60` | `SharedPinLockpad`, `LevelSelectorSheet`, PWA guide |
| **Notification Toast** | `z-70` | Slide-down `NotificationBanner` |
| **Full-Screen Confrontation** | `z-80` | Wife's Notebook Confrontation evaluation canvas |
| **System Emergency Alerts** | `z-100` | Browser error boundary, fatal network alert toast |

---

## 5. Border Radius Tokens & Squircles

```css
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-sheet: 28px;
  --radius-pill: 9999px;
  --radius-squircle: 22.5%; /* Continuous Apple-style squircle */
}
```
