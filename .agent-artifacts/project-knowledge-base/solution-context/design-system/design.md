---
type: Universal Design Specification
system_name: Parody Phone OS Universal Design System
status: approved
description: "Authoritative Universal Design System SSOT governing accessibility, layout grid & gutters, atomic design principles, common systemic behaviors, motion physics, evidence pinning interactions, core tokens, and parody app token isolation."
tags: [design-system, universal-design, accessibility, atomic-design, tokens, glassmorphism, mobile-shell, ui-ux]
timestamp: "2026-10-14T11:58:00+07:00"
---

# Universal Design System & UI/UX Standards

> **Canonical System SSOT**: This document serves as the overarching Single Source of Truth (SSOT) for UI/UX design standards, accessibility baselines, viewport ergonomics, atomic component hierarchies, systemic interaction behaviors, and motion physics across the entire application ecosystem.
>
> **Token Separation Contract**:
> 1. **Universal System Tokens**: Layout grids, gutters, safe areas, typography scale, accessibility thresholds, z-index layers, motion curves, and core glass materials defined herein govern all shell containers, game HUDs, and virtual apps.
> 2. **Parody App Style Isolation**: Individual parody apps (`LoZa`, `VietPay`, `Poshee`, `Grap`, `NetSurf`, etc.) **strictly retain their own brand-specific CSS styling tokens** (brand palettes, chat bubble geometries, header gradients, and domain iconography) documented in their local specifications under [`../apps/<app_id>/app-design.md`](../apps/).

---

## 1. Master Architecture & Subsystem Specification Map

To preserve strict progressive disclosure and prevent monolithic bloat, detailed physical shell specifications reside in modularized companion documents that inherit directly from this universal standard:

| Subsystem / Topic | Canonical Specification | Architectural Scope & Core Tokens |
|---|---|---|
| **Universal Design SSOT** | [design.md](design.md) *(This Document)* | Universal principles, accessibility, gutters, colors, motion, evidence pinning UX. |
| **Phone OS Master & Shell** | [../apps/phone-os/app-design.md](../apps/phone-os/app-design.md) | System master design, physical titanium chassis, Neural Dynamic Island, launcher grid. |
| **Typography & Dynamic Type Scale** | [../apps/phone-os/typography.md](../apps/phone-os/typography.md) | Apple HIG 12-tier dynamic scale, cross-platform Inter font stack, tabular numerals. |
| **Status Bar System Chrome** | [../apps/phone-os/status-bar.md](../apps/phone-os/status-bar.md) | 3-zone layout, zero-carrier invariant, dynamic capsule battery indicator. |
| **Shared PIN Lockpad** | [../apps/phone-os/pin-lockpad.md](../apps/phone-os/pin-lockpad.md) | Passcode modal barrier, dual-tier dialer typography, PIN dots, error shake physics. |
| **Wife's Investigation Notebook HUD** | [../apps/phone-os/wife-notebook/app-design.md](../apps/phone-os/wife-notebook/app-design.md) | Detective dossier drawer, evidence matrix, suspect tagging, confrontation HUD. |
| **Pluggable Virtual Parody Apps** | [../apps/](../apps/) | 12 brand-specific parody designs retaining unique CSS palettes, bubble styling, and domain views. |

---

## 2. Atomic Design Principles for Emulated Smartphone

The user interface follows Brad Frost's **Atomic Design** methodology, adapted as an architectural governance model for an emulated mobile operating system and detective game HUD. Rather than serving as a static component catalog, Atomic Design establishes the principles of composition, decoupling, reusability, and state ownership across the ecosystem:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ATOMIC DESIGN COMPOSITION FLOW                       │
├────────────────────────────────────────────────────────────────────────┤
│  ATOMS       ──► Primitives & Tokens (Indivisible units)               │
│  MOLECULES   ──► Simple Compositions (Context-agnostic functional units)│
│  ORGANISMS   ──► Modular Subsystems (Self-contained functional blocks) │
│  TEMPLATES   ──► Structural Blueprints (Content-agnostic layouts)      │
│  PAGES       ──► Hydrated Contexts (Runtime case data & player state)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Atoms (Foundational Primitives Principle)
Atoms represent the indivisible stylistic, semantic, and functional building blocks:
- **Unidirectional Token Derivation**: Atoms encapsulate raw CSS custom properties (color palettes, dynamic typography tiers, spatial scales, transition curves) and foundational visual primitives (squircles, vector icons, badges, hairline dividers).
- **Global Invariance**: System atoms are globally governed and immutable within application contexts. Micro-apps and shell containers consume universal tokens directly rather than defining competing or ad-hoc raw primitives.
- **Zero Business Logic**: Atoms contain zero game state, narrative context, or clue-handling logic.

### 2.2. Molecules (Component Combinations Principle)
Molecules combine two or more atoms into focused, cohesive functional units:
- **Single-Responsibility Composition**: Each molecule addresses a singular functional need (e.g., icon with label, badge with counter, text line with timestamp).
- **Context Agnosticism**: Molecules remain strictly decoupled from specific narrative storylines or detective clues. A molecule must not hardcode whether it displays an innocent chat line or a smoking-gun transaction.
- **Encapsulated Interaction**: Molecules handle transient local interaction states (such as active press scale or hover states) while delegating business actions upward via event callbacks.

### 2.3. Organisms (Self-Contained Functional Subsystems Principle)
Organisms assemble molecules and atoms into distinct, modular functional sections:
- **Subsystem Encapsulation**: Organisms represent self-contained interface sections (e.g., persistent shell chrome, modal barriers, or application feature views) that orchestrate layout and coordinate internal molecules.
- **Clear Interface Contracts**: Organisms communicate with their parent containers via well-defined props and event handlers, maintaining strict encapsulation of internal DOM hierarchies.
- **Shell vs. App Decoupling**: Universal shell organisms (such as system status chrome, navigation frameworks, and security lockpads) operate as persistent system singletons, while parody app organisms mount dynamically within the active app viewport.

### 2.4. Templates (Structural Layout Blueprints Principle)
Templates define spatial arrangements and layout structures without binding to concrete narrative data:
- **Content-Agnostic Scaffolding**: Templates establish safe-area insets, sticky headers, scrollable viewports, and action bar slots. They dictate layout rhythm, gutters, and responsive behavior across viewports.
- **Composition Slots**: Templates accept organisms and molecules as children or slot inputs, ensuring consistent ergonomics across all virtual apps while leaving visual brand styling to app-specific implementations.

### 2.5. Pages (Runtime Context & Case Hydration Principle)
Pages are the runtime instances hydrated with dynamic case state, declarative clue definitions, and player interactions:
- **Declarative Hydration**: Pages bind declarative level JSON schemas (suspect profiles, message histories, banking statements, photo albums) into templates and organisms.
- **Detective State Convergence**: Pages serve as the integration boundary where game systems (evidence collection, notebook HUD, confrontation logic) interact with UI presentation.

### 2.6. Component Governance & Anti-Duplication Principles
To prevent monolithic bloat and maintain architectural hygiene:
- **Reuse-First Mandate**: Always audit existing components (`src/components/`, `src/shell/`) and canonical specifications before introducing new components. Parallel primitives and redundant implementations are strictly prohibited.
- **Progressive Disclosure of Specifications**: Concrete component APIs, wireframes, and styling rules belong in modular companion specifications (e.g., `phone-os/*.md` and `apps/<app_id>/app-design.md`), preserving this universal design document as a high-level standard of principles.

---

## 3. Accessibility Standards (WCAG 2.1 AA / AAA Compliance)

To guarantee high legibility, comfort, and cognitive accessibility for all players (ages 13+ across mobile browsers), the system enforces strict accessibility boundaries:

### 3.1. Typography Scale & Font Size Boundaries

All text rendered within the app adheres to these mobile typography boundaries and dynamic scaling rules:

| Boundary / Level | Base Size (REM / PX) | Allowed Usage & Dynamic Scaling Behavior |
|---|---|---|
| **Absolute Lower Floor** | `0.6875rem` ($11\text{px}$) | System badges, battery metrics, minor footnotes. *(Sole exception: $10\text{px}$ / `0.625rem` bold all-caps on dialer mnemonic subtext).* |
| **Secondary Metadata Floor** | `0.8125rem` ($13\text{px}$) | Timestamps, subtitles, photo EXIF, list row snippets. |
| **Primary Body Baseline** | `1.0rem`–`1.0625rem` ($16\text{px}$–$17\text{px}$) | Chat dialogue bubbles, narratives, bank records, and form inputs (prevents iOS Safari auto-zoom). |
| **Section & Modal Headings** | `1.25rem`–`1.375rem` ($20\text{px}$–$22\text{px}$) | In-app headers, modal drawer titles, security lockpad target labels. |
| **Major Title** | `1.75rem` ($28\text{px}$) | Case victory headers, level transition titles, confrontation verdicts. |
| **Base Scale Ceiling** | `2.125rem` ($34\text{px}$) | Default 100% Large Title headers and PIN digits. May scale fluidly up to $200\%$ under user accessibility zoom. |

#### Typographic Principles & Scaling Governance
- **REM Token Authority**: Relative units (`rem` rooted at `16px = 1.0rem`) serve as the authoritative standard across all CSS tokens to ensure seamless, fluid font scaling without hardcoded pixel clipping.
- **Dynamic Type Scaling Tolerance**: The application layout must support browser dynamic text scaling up to **$200\%$** without text truncation, overflow clipping, or broken layouts (WCAG 1.4.4: Resize Text). Containers must utilize `min-height` and flexbox wrapping rather than fixed heights on text elements.
- **Optical Tracking**: Display titles and headers ($\ge 20\text{px}$) enforce subtle negative tracking (`-0.015em` to `-0.025em`) for visual tightness, while micro-captions ($\le 12\text{px}$) enforce neutral to positive tracking (`+0.01em` to `+0.08em`) to preserve legibility on high-density displays.

### 3.2. Minimum Interactive Touch Target Ergonomics

To prevent mis-taps on mobile devices and satisfy WCAG 2.5.5 (Target Size - Level AAA) and Apple HIG guidelines:

* **Minimum Interactive Hit-Box**: **$44\text{px} \times 44\text{px}$** ($48\text{px} \times 48\text{px}$ recommended for primary action triggers).
* **Transparent Hit-Box Expansion**: If a visible icon atom is $20\text{px}$ or $24\text{px}$, its parent clickable button element must expand padding to reach at least $44\text{px} \times 44\text{px}$:
  ```css
  /* Touch target expansion utility */
  .touch-target-min {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  ```
* **Inter-Target Spacing Buffer**: A minimum gap of **$\ge 8\text{px}$** must separate adjacent interactive targets.

### 3.3. Contrast Ratios & Legibility Rules

All color pairings must be verified against WCAG 2.1 Level AA and AAA standards:

* **Body Text & Normal Narrative ($< 18\text{px}$)**: Contrast ratio $\ge \mathbf{4.5:1}$ against background canvas.
* **Large Text ($\ge 18\text{px}$ bold or $\ge 24\text{px}$ regular)**: Contrast ratio $\ge \mathbf{3.0:1}$.
* **Active UI Components & Graphical Objects**: Contrast ratio $\ge \mathbf{3.0:1}$ against adjacent colors.
* **Wallpaper Legibility Protection**: Any text rendered directly over dynamic wallpapers (e.g. app icon titles, status bar clock) **must enforce** an ambient dark Gaussian drop shadow to preserve contrast across all background tones:
  ```css
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  ```

---

## 4. Layout Grid, Gutters & Safe Areas

The layout system coordinates fluid responsiveness across native mobile devices and desktop browser bezels.

### 4.1. Base Grid & Spacing Scale

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

### 4.2. Universal Gutters & Safe Margins

* **Standard Viewport Gutter**: **$16\text{px}$** horizontal padding (`px-4` in Tailwind). Applied universally to all screen views, chat lists, settings, and form containers.
* **Dense Media Grid Gutter**: **$12\text{px}$**–$16\text{px}$ screen margin, with **$4\text{px}$**–$8\text{px}$ gap between image tiles (e.g. `PhotosApp`).
* **Card Internal Padding**: **$12\text{px}$** (compact) or **$16\text{px}$** (standard).

### 4.3. Viewport Geometry & Responsive Breakpoints

```
  Desktop Emulated Viewport:          Mobile Native Viewport:
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     Desktop Titanium Bezel    │   │  Full Screen ($100\text{dvh}$) │
│  ┌─────────────────────────┐  │   │  $375\text{px}$–$430\text{px}$│
│  │ Viewport:               │  │   │                               │
│  │ $393\text{px} \times    │  │   │                               │
│  │ $852\text{px}$          │  │   │                               │
│  │ Ratio $\approx 9:19.5$  │  │   │                               │
│  │ (Border Radius: 52px)   │  │   │                               │
│  └─────────────────────────┘  │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
```

* **Desktop Viewport**: Clamped inside an emulated smartphone bezel at **$393\text{px} \times 852\text{px}$** (aspect ratio $\approx 9:19.5$). Specific chassis geometry is governed by [bezel-shell.md](../apps/phone-os/bezel-shell.md).
* **Mobile Viewport**: Full-bleed responsive fit ($100\%$ width between $375\text{px}$ and $430\text{px}$, $100\text{dvh}$ height).
* **Universal Viewport Height Adaptation**:
  - `xshort` (`max-height: 600px`): Ultra-compact mode. Reduces vertical margins and padding tokens by $25\%$ across all views.
  - `short` (`max-height: 759px`): Compact mode. Standard gutters with condensed header offsets.
  - `tall` (`min-height: 760px`): Standard flagship layout with generous whitespace.
  *(Home Launcher-specific widget and dock scaling are governed by [home-launcher.md](../apps/phone-os/home-launcher.md)).*

### 4.4. Hardware Safe Area Insets

To prevent UI elements from clashing with the camera punch-hole, status chrome, or mobile gesture navigation bars:

* **Top Safe Area Inset**: **$44\text{px}$** (or `env(safe-area-inset-top)`). Dedicated exclusively to the `StatusBar` and Dynamic Island. In-app navigation headers begin at $y = 44\text{px}$.
* **Bottom Safe Area Inset**: **$34\text{px}$** (or `env(safe-area-inset-bottom)`). Houses the home gesture bar indicator. Bottom tab bars and sticky buttons must add $34\text{px}$ bottom padding.
* **Lateral Safe Margins**: Standard $16\text{px}$ left and right gutters protect content from edge clipping.

---

## 5. Common Systemic Behaviors & Interaction Patterns

Universal interaction patterns guarantee intuitive, consistent mobile physics across all virtual apps:

### 5.1. Navigation & View Hierarchy

* **Edge Swipe-to-Back Gesture**:
  - Dragging inward from the left screen edge ($< 30\text{px}$ threshold) initiates a horizontal view drag.
  - The active app translates horizontally ($1:1$ drag resistance with backdrop darkening).
  - Releasing beyond **$80\text{px}$** or with swipe velocity $> 0.5\text{px/ms}$ pops the view back to the parent view or SpringBoard.
  - Releasing below the threshold triggers a spring snap-back to $0\text{px}$.
* **Back Button Fallback**: Every subview navigation header provides a chevron-left back button with a $44\text{px} \times 44\text{px}$ touch target.
* **Home Button / Assistive Touch**:
  - Floating `AssistiveTouch` button persists on screen and provides a one-tap return to SpringBoard (`activeAppId = 'home'`).

### 5.2. Modal Bottom Sheets & Drawers

* **Top Grab Handle Pill**: Centered pill ($36\text{px} \times 5\text{px}$, radius $9999\text{px}$, color `rgba(255, 255, 255, 0.35)`).
* **Drag-Down Dismissal**: Pulling down $\ge 80\text{px}$ smoothly animates the sheet off-screen.
* **Scrolled Position Guard**: Drag-to-dismiss is active only when the inner scroll container is at top position (`scrollTop === 0`).
* **Scrim Backdrop**: Semi-transparent dark blur overlay (`background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px);`). Tapping the backdrop dismisses the drawer.

### 5.3. Notification Banner Toast Behaviors

* **Dynamic Island Descent**: Banners drop down from the Dynamic Island position with an iOS spring curve.
* **Auto-Dismissal Timer**: Banners automatically retract after **$4.5\text{s}$** if untouched.
* **Interactive Tap-to-Navigate**: Tapping the banner instantly opens the originating app and routes directly to the relevant clue thread or notification.
* **Flick-to-Dismiss**: Swiping up on the banner dismisses it immediately.

### 5.4. Interactive Button States & Tactile Feedback

* **Active / Pressed State**:
  - All interactive cards, list rows, and buttons exhibit an immediate **$0.97$ scale reduction** and **$0.75$ opacity dip** on touch-down (`active:scale-[0.97] active:opacity-75`).
  - Transition duration: Ultra-fast $0.1\text{s}$ cubic-bezier.
* **Hover States (Desktop Only)**:
  - Hover states apply subtle lightness lifts ($+5\%$) and cursor pointers, strictly disabled on touch devices to avoid sticky hover artifacts.
* **Disabled States**:
  - `opacity: 0.40; pointer-events: none; filter: grayscale(50%);`.

### 5.5. Scroll & Overscroll Physics

* **Overscroll Suppression**: `overscroll-behavior: none` is enforced on `html`, `body`, and outer containers to eliminate native browser pull-to-refresh interference.
* **Momentum Scrolling**: `-webkit-overflow-scrolling: touch; overflow-y: auto;` on all scrollable app viewports.
* **Clean Scrollbars**: Scrollbars are styled as slim, translucent hairlines ($4\text{px}$ width) or hidden (`scrollbar-width: none`) to maintain authentic mobile OS fidelity.

---

## 6. Motion & Feedback Physics

Animations strictly emulate the natural inertia, springs, and mechanical resistances of modern mobile operating systems:

### 6.1. Timing Curves & Easing Recipes

| Motion Token | Curve (Cubic-Bezier) | Duration | Usage |
|---|---|---|---|
| `--ease-ios-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | $0.35\text{s}$–$0.45\text{s}$ | Modal bottom sheet slides, toast drop-downs, app launcher zoom |
| `--ease-ios-default` | `cubic-bezier(0.32, 0.72, 0, 1)` | $0.25\text{s}$–$0.30\text{s}$ | Screen push/pop transitions, drawer slide-overs |
| `--ease-micro-tap` | `cubic-bezier(0.4, 0, 0.2, 1)` | $0.10\text{s}$ | Keypad button presses, card active scale down |
| `--ease-shake` | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` | $0.40\text{s}$ | PIN lockpad error vibration oscillation |

### 6.2. Error Shake Animation (PIN Lock & Lockout Feedback)

When an invalid PIN or security passcode is submitted, the PIN dot indicators execute a horizontal spring shake:

```css
@keyframes shakeDots {
  10%, 90% { transform: translate3d(-3px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
  40%, 60% { transform: translate3d(5px, 0, 0); }
}

.animate-shake {
  animation: shakeDots 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
```

### 6.3. Simulated Audio-Haptic Feedback Standards

To recreate the physical sensation of interacting with a real mobile phone:

* **Dialer Keypad Click**: Short audio tick ($10\text{ms}$, $1.2\text{kHz}$ sine wave) + `navigator.vibrate(10)` on numeric button press.
* **Evidence Pinning Chime**: Uplifting two-tone chime ($520\text{Hz} \to 780\text{Hz}$, $150\text{ms}$) + double vibration pulse (`navigator.vibrate([15, 40, 25])`).
* **Error / Strike Thud**: Low-frequency warning buzz ($180\text{Hz}$, $200\text{ms}$) + warning vibration (`navigator.vibrate([40, 60, 40])`).
* **Level Victory Fanfare**: Celebratory chime sequence + triumphant triple vibration pulse.
* **Audio Preference**: Mute preferences set in the player state (`audioMutePreference: true`) suppress audio playback while preserving silent haptic vibrations where supported.

---

## 7. Universal Evidence Interaction Standards (Detective Gameplay UX)

As a detective game, evidence discovery must be intuitive, rewarding, and fair:

### 7.1. Strict Zero-Spoiler UI Invariant & Universal Long-Press Affordance

* **Strict Zero-Spoiler UI Invariant**:
  - To preserve mystery and player agency, **no interactive element on any parody app screen may display visual clue cues** (no glowing outlines, no warning banners, no pin icons, no amber borders, and no dedicated "Add Suspect" / "Add Clue" buttons).
  - All interactable elements (contact names, chat bubbles, invoice rows, delivery stops, search chips, photos) appear identical to authentic smartphone UI.
* **Interaction Trigger (Universal Long-Press Gesture)**:
  - Long-pressing ($\ge 450\text{ms}$) on any interactive element triggers a subtle haptic vibration (`navigator.vibrate(20)`) and micro-scale feedback (`scale(0.98)`).
  - Long-press summons the **Contextual Choice Action Sheet** (`LongPressPinActionSheet`) rendered via `.glass-elevated` bottom sheet.
* **Contextual Choice Action Sheet Options**:
  - `[ 👥 Ghim làm Đối Tượng Tình Nghi ]`: Routes target entity into the Wife Notebook's **Suspects Board**.
  - `[ 🔍 Ghim làm Manh Mối / Bằng Chứng ]`: Routes target snippet into the Wife Notebook's **Evidence Locker**.
  - `[ ✕ Huỷ bỏ ]`: Dismisses sheet without modifying notebook state.
* **Universal Pinning & Decoy Policy**:
  - Players may long-press and pin *any* interactive element, whether it is a smoking-gun clue or an innocent decoy. The app provides identical feedback for all items; true validity is evaluated strictly during Confrontation/Verdict.
  - Pinned items do not permanently alter parent app UI styling (preserving the zero-spoiler baseline); confirmation is signaled exclusively via a non-intrusive toast notification from the Dynamic Island.

### 7.2. Clue Inspection & Forensic Zoom Modal

* **Photo & Receipt Forensics**:
  - Tapping a photo thumbnail or transaction invoice opens a full-screen forensic viewer.
  - Features: Pinch-to-zoom (up to $3\times$), pan gestures, and a metadata inspect drawer displaying EXIF date/time, geolocation stamp, and transaction reference numbers.
* **Zero-Spoiler Contact Profiles**:
  - Contact cards in messaging and phone apps (`LoZa`, `Phone`, `Messages`) do not render dedicated "Tag as Suspect" buttons. Instead, players long-press the contact row or header to summon the contextual choice popup.

---

## 8. Core Design Tokens & System Colors

### 8.1. Universal Semantic Colors & System Tokens

All parody apps and the Phone OS shell inherit these universal semantic color tokens to guarantee visual cohesion, WCAG accessibility contrast, and consistent detective feedback:

| Token Name | Base Value | Semantic Role & Universal Usage |
|---|---|---|
| `--sys-canvas` | `#0B1329` | Base dark backdrop canvas across mobile shell and default screens |
| `--sys-surface` | `rgba(30, 41, 59, 0.70)` / `#1E293B` | Content cards, list rows, chat containers, and modal backdrops |
| `--sys-surface-elevated`| `rgba(15, 23, 42, 0.90)` / `#0F172A` | Elevated bottom sheets, action sheets, and modal barrier surfaces |
| `--sys-text-primary` | `#F8FAFC` (`#FFFFFF`) | Primary high-contrast text, dialogue narrative, view titles, and input text |
| `--sys-text-secondary` | `#94A3B8` | Secondary metadata, timestamps, subtitles, photo EXIF, and list snippets |
| `--sys-text-tertiary` | `#64748B` | Footnotes, inactive labels, and input placeholders |
| `--sys-divider` | `rgba(255, 255, 255, 0.12)` | Hairline dividers ($0.5\text{px}$–$1\text{px}$) and micro-borders |
| `--sys-accent` | `#007AFF` / `#38BDF8` | Universal iOS blue interactive controls, focus outlines, and active state tint |
| `--sys-badge-red` | `#EF4444` | Notification badge counter pills, unread alerts, and strike indicators |
| `--sys-clue-amber` | `#F59E0B` | Uncollected clue warning pills and detective HUD highlights |
| `--sys-success-green` | `#22C55E` | Verified checkmarks, successful transactions, online status, and victory state |

#### Color Ownership & Delegation Rules
1. **Universal Enforcement**: Universal semantic tokens (`--sys-*`) govern text contrast, hairline borders, feedback states (red/amber/green), and base glass materials across **all virtual apps**.
2. **Phone OS Shell Colors**: Physical hardware bezel (`#18181B`), metallic slate ring (`#3F3F46`), Dynamic Island (`#000000`), wallpaper gradients, and launcher dock styling are authoritatively owned by [phone-os/app-design.md](../apps/phone-os/app-design.md) and [phone-os/shell/app-design.md](../apps/phone-os/shell/app-design.md).
3. **Parody App Brand Palettes**: Third-party parody apps authoritatively define and encapsulate their proprietary brand colors (e.g. `LoZa` electric blue, `VietPay` emerald green, `Poshee` vibrant orange, `Grap` green) inside their local scopes under [`../apps/<app_id>/app-design.md`](../apps/). Brand colors must never pollute universal tokens or cross app boundaries.

### 8.2. Dialed-Down iOS Frosted Glass Hierarchy

To preserve native mobile fidelity while ensuring lightweight performance across web browsers, the system uses a compact 3-tier frosted glass hierarchy:

| Glass Tier | Class Name | CSS Recipe | Target Components |
|---|---|---|---|
| **Subtle Glass** | `.glass-subtle` | `background: rgba(255, 255, 255, 0.12);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid rgba(255, 255, 255, 0.18);` | Dock tray, Search pill, Keypad circular buttons |
| **Elevated Glass** | `.glass-elevated` | `background: rgba(30, 41, 59, 0.90);`<br>`backdrop-filter: blur(20px);`<br>`border: 1px solid rgba(255, 255, 255, 0.12);`<br>`box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);` | Shared PIN keypad modal, Bottom sheets, Context menus |
| **Light Toast Glass** | `.glass-toast-light` | `background: rgba(255, 255, 255, 0.95);`<br>`backdrop-filter: blur(16px);`<br>`border: 1px solid #E2E8F0;`<br>`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);` | Notification banner toasts, Floating timestamps |

### 8.3. Elevation & Z-Index Layer Stack

All layered UI elements must respect this standardized z-index ladder to prevent stacking clashes:

| Layer Level | Z-Index Token | Component / Screen Surface |
|---|---|---|
| **Wallpaper & Canvas** | `z-0` | Desktop outer chassis background, OS wallpaper image |
| **SpringBoard Grid** | `z-10` | Home screen icons, Detective widget, Dock tray |
| **Active Virtual App** | `z-20` | Fullscreen virtual app viewport (`LoZa`, `VietPay`, etc.) |
| **In-App Sticky Chrome** | `z-30` | In-app navigation header, sticky bottom tab bar |
| **System Status Bar** | `z-40` | Top `StatusBar` and Dynamic Island pill |
| **Persistent Game HUD** | `z-50` | `AssistiveTouch` button, Wife's Notebook FAB trigger |
| **Modal Drawers & Lockpad** | `z-60` | `SharedPinLockpad`, `LevelSelectorSheet`, PWA guide |
| **Notification Toast** | `z-70` | Slide-down `NotificationBanner` |
| **Full-Screen Confrontation** | `z-80` | Wife's Notebook Confrontation evaluation canvas |
| **System Emergency Alerts** | `z-100` | Browser error boundary, fatal network alert toast |

### 8.4. Border Radius Tokens & Squircles

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

---

## 9. Parody App Token Isolation & Brand Inheritance Contract

To maintain high satirical immersion while adhering to clean software architecture, the system enforces a strict **Token Separation Contract**:

### 9.1. Architectural Separation Rules

1. **Universal Standards Inherited by All Apps**:
   - Universal semantic colors, dynamic typography scale, and accessibility boundaries.
   - Minimum touch target hit-box ($44\text{px} \times 44\text{px}$).
   - Layout grid ($8\text{px}$), gutters ($16\text{px}$), and safe area offsets ($44\text{px}$ top, $34\text{px}$ bottom).
   - Edge swipe-to-back navigation and bottom drawer gestures.
   - Evidence pinning affordances and forensic inspection modals.
2. **Parody Apps Retain Isolated Styling Tokens**:
   - Each parody app **retains its own unique CSS color tokens, header gradients, bubble aesthetics, and domain iconography** defined in its local `apps/<app_id>/app-design.md`.
   - **No global cross-contamination**: The brand color of `LoZa` (Electric Blue `#0088FF`) must never bleed into `VietPay` (Emerald Green `#005A3C` / `#22C55E`) or `Poshee` (Vibrant Orange `#EE4D2D`).
   - Each app encapsulates its theme inside its root container (e.g. `.app-loza`, `.app-vietpay`).

### 9.2. Progressive Discovery & Canonical App Design SSOTs

In strict compliance with **DRY (Don't Repeat Yourself)** and **Single Source of Truth (SSOT)** architectural principles, specific brand palettes, header gradients, message bubble colors, transaction cards, and icon styling are **not duplicated here**.

Each virtual application authoritatively owns its brand identity in its dedicated specification. AI agents and developers must use progressive disclosure to inspect the target application's design file under [`../apps/`](../apps/) on demand:

| App / Subsystem (`app_id`) | Real-World Parody / Metaphor | Authoritative Brand & UI Specification |
|---|---|---|
| **Phone OS Shell & Launcher** (`phone_shell`) | iOS 27 Chassis & SpringBoard | [../apps/phone-os/shell/app-design.md](../apps/phone-os/shell/app-design.md) |
| **Phone** (`phone`) | iOS Phone (Dialer & Recents) | [../apps/phone-os/phone/app-design.md](../apps/phone-os/phone/app-design.md) |
| **Messages** (`messages`) | iOS Messages (SMS Threads) | [../apps/phone-os/messages/app-design.md](../apps/phone-os/messages/app-design.md) |
| **Photos** (`photos`) | iOS Photos (Unified Stream) | [../apps/phone-os/photos/app-design.md](../apps/phone-os/photos/app-design.md) |
| **LoZa** (`loza`) | Zalo | [../apps/internet-messaging/app-design.md](../apps/internet-messaging/app-design.md) |
| **VietPay** (`vietpay`) | Vietcombank / MBBank | [../apps/banking/app-design.md](../apps/banking/app-design.md) |
| **Poshee** (`poshee`) | Shopee | [../apps/ecommerce/app-design.md](../apps/ecommerce/app-design.md) |
| **Grap** (`grap`) | Grab | [../apps/ride-hailing/app-design.md](../apps/ride-hailing/app-design.md) |
| **GeeMail** (`geemail`) | Gmail | [../apps/email/app-design.md](../apps/email/app-design.md) |
| **InkedLin** (`inkedlin`) | LinkedIn | [../apps/professional-network/app-design.md](../apps/professional-network/app-design.md) |
| **Tim** (`tim`) | MS Teams | [../apps/team-collaboration/app-design.md](../apps/team-collaboration/app-design.md) |
| **NetSurf** (`netsurf`) | Safari / Chrome | [../apps/web-browser/app-design.md](../apps/web-browser/app-design.md) |
| **Husband's Notes** (`notes`) | Apple Notes | [../apps/personal-notes/app-design.md](../apps/personal-notes/app-design.md) |
| **Wife's Notebook HUD** (`wife_notebook`) | Detective Dossier HUD | [../apps/phone-os/wife-notebook/app-design.md](../apps/phone-os/wife-notebook/app-design.md) |

---

## 10. Legal & Parody Trade Dress Principles

To maintain complete legal compliance under Vietnamese and international fair use / trademark regulations:

* **Strict Prohibition of Apple SF Symbols**: Apple's software license strictly forbids extracting or web-serving SF Symbols on non-Apple operating systems. All system iconography must use open-source vector sets (`lucide-react`, `react-icons`).
* **Strict Prohibition of Web-Hosted Apple Fonts**: Hosting Apple's proprietary `SF Pro` font files (`.woff2`) is prohibited. Systems use standard cross-platform system fallbacks and the open-source **Inter** typeface.
* **Parody Trademark Deviations**: Direct replication of commercial brand logos (Zalo, Shopee, Grab, Vietcombank, Apple) is forbidden. All apps feature satirical parody names, altered iconography, and humorous taglines (*"Kết nối tình thân — Bí mật khó giấu"*).
* **Lawful Mobile Trade Dress**: Standard mobile design patterns (frosted glass blurs, squircle icon cards, pull-to-refresh, bottom sheets) are uncopyrightable functional layout paradigms and are safely implemented via open web technologies.
