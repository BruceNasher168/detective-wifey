---
type: Design Specification Topic
app_id: phone_os
topic: status-bar
status: approved
description: "iOS status bar chrome specifications, 3-column layout, capsule battery geometry, and zero-carrier rules for the Virtual Phone OS."
tags: [design-tokens, status-bar, battery, cellular, dynamic-island, system-chrome, phone-os]
timestamp: "2026-10-14T09:25:00+07:00"
---

# Phone OS - Status Bar System Chrome Specification

> **Parent Design Master**: [app-design.md](app-design.md)  
> **Standard**: Modern iOS Status Bar with Dynamic Island Accommodation

---

## 1. Status Bar Anatomy & 3-Column Layout

The status bar spans the full top width ($44\text{px}$ base height, $36\text{px}$ on short viewports) divided into three distinct zones:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 23:45               [  Dynamic Island Cutout  ]        [Signal] [Wifi] [Batt] │
└────────────────────────────────────────────────────────────────────────┘
  ▲ Left Zone                ▲ Center Zone                     ▲ Right Zone
```

| Zone | Contents | Typographic & Vector Tokens | Alignment |
|---|---|---|---|
| **Left Zone** | Narrative Time (`23:45`) | $14\text{px}$–$15\text{px}$ Semibold ($600$), `tabular-nums`, `#ffffff` | Left-aligned, $16\text{px}$ horizontal padding |
| **Center Zone** | Dynamic Island Hardware Pill | Width $120\text{px}$, Height $28\text{px}$–$30\text{px}$, `#000000` | Horizontally centered |
| **Right Zone** | Signal + Wi-Fi + Capsule Battery | 4-bar signal, 3-arc Wi-Fi, battery pill with internal fill | Right-aligned, $16\text{px}$ horizontal padding |

---

## 2. Right-Zone System Indicators

### 2.1. Strict Zero-Carrier Invariant
In modern iOS hardware equipped with a Dynamic Island or camera notch, **carrier network names (e.g. "Viettel", "5G") are never displayed in the status bar**. They are omitted to prevent horizontal text collision with the central Dynamic Island.

### 2.2. Vector Icon Specifications
* **Cellular Signal**: 4 vertical tiered bars (`14\text{px} \times 12\text{px}`), solid fill.
* **Wi-Fi Indicator**: 3 concentric arcs (`14\text{px} \times 12\text{px}`), solid fill.
* **Colors**: Pure white (`#ffffff`) in dark wallpaper mode; dynamic inversion to dark slate (`#18181b`) over light app viewports.

---

## 3. iOS Capsule Battery Anatomy

The battery glyph must accurately reflect iOS capsule geometry rather than a raw percentage badge:

```
    ┌──────────────┬─┐
    │ ████████░░░░ │ │  Cap (Positive Terminal)
    └──────────────┴─┘
      ▲ Charge Bar (Dynamic fill: Green > 20%, Red ≤ 20%)
```

* **Capsule Shell**: $24\text{px} \times 12\text{px}$ rounded rectangle ($3.5\text{px}$ border radius) with a $1.5\text{px}$ solid border (`rgba(255, 255, 255, 0.40)`).
* **Terminal Cap**: $1.5\text{px} \times 4\text{px}$ protruding rounded tab on the right side.
* **Interior Dynamic Fill**:
  - Normal Level ($> 20\%$): Solid white (`#ffffff`) or emerald green (`#10b981`) filling proportional width.
  - Low Power Level ($\le 20\%$): Alert red (`#ef4444`).
* **Percentage Text**: Either rendered inside the capsule fill (at $9\text{px}$ Bold) or directly preceding the capsule at $11\text{px}$ Semibold (`42%`).
