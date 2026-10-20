---
type: Design Specification Topic
app_id: phone_os
topic: pin-lockpad
status: approved
description: "iOS Passcode lockpad design system, numeric dialer typography with alphabet subtext, PIN dot feedback, error shake physics, and suspicion strike rules."
tags: [design-tokens, security, lockpad, passcode, pin, strike-engine, phone-os]
timestamp: "2026-10-14T09:25:00+07:00"
---

# Phone OS - Shared PIN Lockpad & Passcode Specification

> **Parent Design Master**: [app-design.md](app-design.md)  
> **Standard**: Authentic iOS Passcode Screen with Detective Strike Integration

---

## 1. Passcode Screen Wireframe & Ergonomics

The shared PIN lockpad renders over protected folders, hidden chat threads, and financial apps (*Techcornbank, Photos Private Album, Zola Hidden Chat*):

```
┌────────────────────────────────────────────────────────┐
│ [< Thoát ra]              KHÓA BẢO MẬT                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     [Lock] Techcornbank                     │
│               Nhập mật mã gồm 4 chữ số                 │
│                                                        │
│                    ○   ○   ○   ○                       │
│                   (PIN Dot Indicators)                 │
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
│ ⚠️ Sai mã sẽ làm tăng mức độ nghi ngờ của chồng!       │
│ Lượt thử còn lại: [ • • • ] (3/4)                      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Numeric Button Anatomy & Alphabet Subtext

Authentic iOS passcodes feature dual-tiered button typography:

| Button | Primary Digit ($34\text{px}$ Light / $300$) | Secondary Alphabet Subtext ($10\text{px}$ Bold / $700$, Tracking `+0.08em`) |
|---|---|---|
| **1** | `1` | *(Empty / blank)* |
| **2** | `2` | `ABC` |
| **3** | `3` | `DEF` |
| **4** | `4` | `GHI` |
| **5** | `5` | `JKL` |
| **6** | `6` | `MNO` |
| **7** | `7` | `PQRS` |
| **8** | `8` | `TUV` |
| **9** | `9` | `WXYZ` |
| **0** | `0` | *(Empty / blank)* |

### Button Visual Styling:
* **Geometry**: $68\text{px} \times 68\text{px}$ circular touch targets ($56\text{px}$–$60\text{px}$ on short viewports).
* **Resting Glass**: `background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.18); backdrop-filter: blur(16px);`.
* **Pressed State**: `background: rgba(255, 255, 255, 0.35); transform: scale(0.94); transition: transform 0.08s ease;`.

---

## 3. PIN Indicator Dots & Error Shake Physics

* **Dot Count**: 4 dots horizontally centered ($12\text{px}$ diameter each, spaced $16\text{px}$ apart).
* **Empty State**: Hollow circle with $1.5\text{px}$ border (`border: 1.5px solid rgba(255, 255, 255, 0.60)`).
* **Filled State**: Solid pure white disc (`background: #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.40)`).
* **Error Animation**:
  - Incorrect 4th digit triggers a $400\text{ms}$ horizontal shake:
    ```css
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
    }
    ```
  - During the shake, dots flash `#ef4444` (alert red) and clear all inputs on animation completion.

---

## 4. Detective Strike Status & Lockout Rules

* **Strike Warning Badge**: Displayed in the lockpad footer with warning icon and tabular strike counter:
  `Lượt thử còn lại: 3/4`
* **Exhaustion Lockout**: Failing all strikes triggers the Husband Suspicion Lockout Engine (temporary lock countdown or level restart prompt).
