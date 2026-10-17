---
type: Universal Design Specification
system_name: Parody Phone OS Universal Design System
topic: behaviors-motion
status: approved
description: "Authoritative specification for systemic interaction patterns, gesture navigation, modal drawers, toast behaviors, spring animations, and audio-haptic feedback."
tags: [interactions, gestures, navigation, modal-sheets, toasts, motion-physics, spring-curves, haptics]
timestamp: "2026-10-15T09:20:00+07:00"
---

# Design System — Systemic Behaviors & Motion Physics

> **Parent Design Master**: [design.md](design.md)  
> **Scope**: Universal interaction patterns, spring curves, and audio-haptics across all virtual apps.

---

## 1. Common Systemic Behaviors & Navigation

Universal interaction patterns guarantee intuitive, consistent mobile physics across all virtual apps:

### 1.1. Navigation & View Hierarchy

* **Edge Swipe-to-Back Gesture**:
  - Dragging inward from the left screen edge ($< 30\text{px}$ threshold) initiates a horizontal view drag.
  - The active app translates horizontally ($1:1$ drag resistance with backdrop darkening).
  - Releasing beyond **$80\text{px}$** or with swipe velocity $> 0.5\text{px/ms}$ pops the view back to the parent view or SpringBoard.
  - Releasing below the threshold triggers a spring snap-back to $0\text{px}$.
* **Back Button Fallback**: Every subview navigation header provides a chevron-left back button with a $44\text{px} \times 44\text{px}$ touch target.
* **Home Button / Assistive Touch**:
  - Floating `AssistiveTouch` button persists on screen and provides a one-tap return to SpringBoard (`activeAppId = 'home'`).

### 1.2. Modal Bottom Sheets & Drawers

* **Top Grab Handle Pill**: Centered pill ($36\text{px} \times 5\text{px}$, radius $9999\text{px}$, color `rgba(255, 255, 255, 0.35)`).
* **Drag-Down Dismissal**: Pulling down $\ge 80\text{px}$ smoothly animates the sheet off-screen.
* **Scrolled Position Guard**: Drag-to-dismiss is active only when the inner scroll container is at top position (`scrollTop === 0`).
* **Scrim Backdrop**: Semi-transparent dark blur overlay (`background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px);`). Tapping the backdrop dismisses the drawer.

### 1.3. Notification Banner Toast Behaviors

* **Dynamic Island Descent**: Banners drop down from the Dynamic Island position with an iOS spring curve.
* **Auto-Dismissal Timer**: Banners automatically retract after **$4.5\text{s}$** if untouched.
* **Interactive Tap-to-Navigate**: Tapping the banner instantly opens the originating app and routes directly to the relevant clue thread or notification.
* **Flick-to-Dismiss**: Swiping up on the banner dismisses it immediately.

### 1.4. Interactive Button States & Tactile Feedback

* **Active / Pressed State**:
  - All interactive cards, list rows, and buttons exhibit an immediate **$0.97$ scale reduction** and **$0.75$ opacity dip** on touch-down (`active:scale-[0.97] active:opacity-75`).
  - Transition duration: Ultra-fast $0.1\text{s}$ cubic-bezier.
* **Hover States (Desktop Only)**:
  - Hover states apply subtle lightness lifts ($+5\%$) and cursor pointers, strictly disabled on touch devices to avoid sticky hover artifacts.
* **Disabled States**:
  - `opacity: 0.40; pointer-events: none; filter: grayscale(50%);`.

### 1.5. Scroll & Overscroll Physics

* **Overscroll Suppression**: `overscroll-behavior: none` is enforced on `html`, `body`, and outer containers to eliminate native browser pull-to-refresh interference.
* **Momentum Scrolling**: `-webkit-overflow-scrolling: touch; overflow-y: auto;` on all scrollable app viewports.
* **Clean Scrollbars**: Scrollbars are styled as slim, translucent hairlines ($4\text{px}$ width) or hidden (`scrollbar-width: none`) to maintain authentic mobile OS fidelity.

---

## 2. Motion & Feedback Physics

Animations strictly emulate the natural inertia, springs, and mechanical resistances of modern mobile operating systems:

### 2.1. Timing Curves & Easing Recipes

| Motion Token | Curve (Cubic-Bezier) | Duration | Usage |
|---|---|---|---|
| `--ease-ios-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | $0.35\text{s}$–$0.45\text{s}$ | Modal bottom sheet slides, toast drop-downs |
| `--ease-ios-default` | `cubic-bezier(0.32, 0.72, 0, 1)` | $0.25\text{s}$–$0.30\text{s}$ | Screen push/pop transitions, drawer slide-overs |
| `--ease-ios-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)` | $0.2\text{s}$–$0.4\text{s}$ | App launch/close zoom and fades |
| `--ease-micro-tap` | `cubic-bezier(0.4, 0, 0.2, 1)` | $0.10\text{s}$ | Keypad button presses, card active scale down |
| `--ease-shake` | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` | $0.40\text{s}$ | PIN lockpad and input error vibration oscillation |

App launch/close and notebook tab/workbook transitions round their clipping surfaces toward the launcher icon or tab, then settle to square edges when fully open.
When the notebook closes, it stays opaque for 260 ms and fades during the final 40 ms. Opening reverses this: the 40 ms fade happens first, then the notebook stays opaque for the remaining zoom.
Moving app, launcher, and notebook surfaces blur up to 4 px while travelling, then sharpen on arrival.

### 2.2. Error Shake Animation (PIN Lock & Validation Feedback)

When an invalid PIN or security passcode is submitted, input indicators execute a horizontal spring shake:

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

### 2.3. Simulated Audio-Haptic Feedback Standards

To recreate the physical sensation of interacting with a real mobile phone:

* **Dialer Keypad Click**: Short audio tick ($10\text{ms}$, $1.2\text{kHz}$ sine wave) + `navigator.vibrate(10)` on numeric button press.
* **Evidence Pinning Chime**: Uplifting two-tone chime ($520\text{Hz} \to 780\text{Hz}$, $150\text{ms}$) + double vibration pulse (`navigator.vibrate([15, 40, 25])`).
* **Error / Strike Thud**: Low-frequency warning buzz ($180\text{Hz}$, $200\text{ms}$) + warning vibration (`navigator.vibrate([40, 60, 40])`).
* **Level Victory Fanfare**: Celebratory chime sequence + triumphant triple vibration pulse.
* **Audio Preference**: Mute preferences set in the player state (`audioMutePreference: true`) suppress audio playback while preserving silent haptic vibrations where supported.
