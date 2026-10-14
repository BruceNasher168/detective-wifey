---
type: Design Specification Topic
app_id: phone_os
topic: bezel-shell
status: approved
description: "Physical hardware frame specifications, desktop chassis rendering, Dynamic Island cutout geometry, and responsive viewport rules for the Virtual Phone OS."
tags: [design-tokens, bezel, hardware-frame, dynamic-island, viewport, responsive, phone-os]
timestamp: "2026-10-14T09:25:00+07:00"
---

# Phone OS — Bezel Shell & Viewport Architecture

> **Parent Design Master**: [app-design.md](app-design.md)  
> **Standard**: Modern iOS Flagship Hardware Presentation (Dynamic Island Era)

---

## 1. Ergonomic Viewport & Dual Mode Behavior

The virtual phone adapts dynamically to the host device context:

| Context | Container Behavior | Dimensions | Hardware Frame Chrome |
|---|---|---|---|
| **Mobile Browser** (iOS Safari, Android Chrome) | Fullscreen edge-to-edge | $100\text{dvh} \times 100\text{vw}$ ($375\text{px}$–$430\text{px}$ width) | Borderless full-bleed; leverages device native screen edges |
| **Desktop Browser** (macOS, Windows, Linux) | Centered floating mobile chassis | Base $393\text{px} \times 852\text{px}$ (max $420\text{px} \times 880\text{px}$) | Physical curved hardware bezel with matte titanium finish |

---

## 2. Desktop Hardware Frame Tokens

When viewed on viewport widths $> 640\text{px}$, the phone shell mounts inside a hardware bezel container:

```css
/* Desktop Hardware Bezel Container */
.phone-chassis {
  width: 393px;
  height: min(852px, 94vh);
  background: linear-gradient(180deg, #0b1329 0%, #172c66 50%, #080c18 100%);
  border: 10px solid #18181b; /* Matte Titanium Dark */
  border-radius: 50px;       /* Flagship Screen Curvature */
  box-shadow: 
    0 24px 60px -12px rgba(0, 0, 0, 0.85),
    0 0 0 2px #3f3f46;        /* Metallic Rim Ring */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

### Color & Finish Tokens:
* `--wf-bezel-chassis`: `#18181b` (Matte Titanium Dark)
* `--wf-bezel-rim`: `#3f3f46` (Metallic Slate chamfer)
* `--wf-bezel-speaker`: `#27272a` (Top ear speaker grille)
* `--wf-bezel-shadow`: `0 24px 60px -12px rgba(0, 0, 0, 0.85)`

---

## 3. Dynamic Island Cutout Architecture

Centered horizontally at the top of the viewport (within the Status Bar header):

```
┌────────────────────────────────────────────────────────┐
│ 23:45             [ Dynamic Island ]    [Signal] [Batt]│
└────────────────────────────────────────────────────────┘
```

### Dimensions & Tokens:
* **Idle Pill Dimensions**: Width $120\text{px}$, Height $30\text{px}$ (compact $26\text{px}$–$30\text{px}$ on short viewports).
* **Corner Radius**: $16\text{px}$–$18\text{px}$ (continuous capsule curvature).
* **Color**: `#000000` pure black surface.
* **Internal Cutouts**:
  - Front Camera Lens: $8\text{px} \times 8\text{px}$ circular dot (`#18181b`, border `#27272a`).
  - FaceID / Ambient Sensor: $6\text{px} \times 6\text{px}$ dark circle (`#111827`).
* **Interactive State (Future Expansion)**: Tapping or triggering an active alert (e.g. incoming call, suspicion strike) animates expansion via CSS spring transition ($280\text{ms}$ cubic bezier curve).

---

## 4. iOS Home Indicator Bar

Positioned at the bottom center of the viewport across all screens and micro-apps:

* **Dimensions**: Width $134\text{px}$, Height $4.5\text{px}$ (scaled to $120\text{px} \times 4\text{px}$ on short viewports).
* **Styling**: `background: rgba(255, 255, 255, 0.40); border-radius: 999px;`.
* **Hover / Active State**: `rgba(255, 255, 255, 0.75)`.
* **Gesture Action**: Tapping or swiping returns to the Home Screen (`activeAppId = 'home'`).
* **Safe Area Margin**: $8\text{px}$ bottom margin on desktop; respects `env(safe-area-inset-bottom)` on physical iOS devices.
