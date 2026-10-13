---
type: App Design Specification
app_id: phone_os
app_name: Virtual Phone OS & Shell
status: approved
description: "UI/UX design system, physical bezel frame, status bar tokens, home screen launcher grid, shared PIN lock pad, and notification banner architecture."
tags: [app-design, phone-os, launcher, lock-screen, notifications, ui-ux, design-system]
timestamp: "2026-10-13T14:40:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/features.md
---

# Virtual Phone OS & Shell — App Design & UI/UX Specification

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

```
┌────────────────────────────────────────────────────────┐
│                 PHONE OS COLOR TOKENS                  │
├────────────────────────────────────────────────────────┤
│ Shell Bezel Frame:    Titanium Dark   #18181B          │
│ Bezel Border Ring:    Metallic Slate  #3F3F46          │
│ Status Bar Text:      Pure White      #FFFFFF          │
│ App Icon Badge Red:   Notification Red #EF4444         │
│ Keypad Glass Surface: Frosted Dark    rgba(30,41,59,0.85)│
│ Keypad Number Button: Charcoal Soft   #334155          │
│ Keypad Pressed State: Indigo Glow     #6366F1          │
│ Banner Toast Surface: Frosted White   rgba(255,255,255,0.92)│
│ Banner Toast Border:  Subtle Ice Gray #E2E8F0          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * System Clock (Home Screen): Light sans-serif ($64\text{px}$ / weight $300$).
  * System Clock (Status Bar): Semibold ($14\text{px}$ / weight $600$).
  * App Launcher Labels: Regular ($12\text{px}$ / weight $500$, drop shadow for wallpaper contrast).
  * Lockpad Numbers: Bold ($24\text{px}$).
* **Ergonomics & Touch Targets**:
  * Home Screen App Icons: $\ge 60 \times 60\text{px}$ with tap target padding $\ge 72 \times 72\text{px}$.
  * Lockpad Numeric Buttons: $\ge 68 \times 68\text{px}$ circular touch targets.
  * Home Indicator Bar: $134\text{px}$ width $\times 5\text{px}$ height, located at bottom center.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Home Screen Launcher Grid (`PhoneOSHomeView`)
```
┌────────────────────────────────────────────────────────┐
│ [ VinaPhone 5G ]               23:45           [ 🔋42%]│
├────────────────────────────────────────────────────────┤
│                                                        │
│                         23:45                          │
│                Thứ Ba, 13 tháng 10                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌──────┐       ┌──────┐       ┌──────┐       ┌──────┐ │
│  │ LoZa │ 🔴3   │VietPay│ 🔴1  │Poshee│       │ Grap │ │
│  └──────┘       └──────┘       └──────┘       └──────┘ │
│    LoZa          VietPay        Poshee          Grap   │
│                                                        │
│  ┌──────┐       ┌──────┐       ┌──────┐       ┌──────┐ │
│  │NetSurf│      │Photos│       │Comms │ 🔴2   │Notes │ │
│  └──────┘       └──────┘       └──────┘       └──────┘ │
│   NetSurf        Photos         Comms          Ghi chú │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [ 🎀 SỔ TAY CỦA VỢ (3 NGHI PHẠM) ]                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│ ══════════════════════ [ — ] ═════════════════════════ │
└────────────────────────────────────────────────────────┘
```

### 3.2. Shared PIN Lock Screen Component (`SharedPinLockpad`)
Used universally across any protected app entry or sub-folder *(VietPay root, Photos hidden album, LoZa hidden chat)*.

```
┌────────────────────────────────────────────────────────┐
│ [< Thoát ra]              KHÓA BẢO MẬT                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     🔒 KHÓA MÃ PIN                     │
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
│                         │  0  │   │  ⌫  │              │
│                         └─────┘   └─────┘              │
├────────────────────────────────────────────────────────┤
│ ⚠️ Sai mã sẽ làm tăng mức độ nghi ngờ của chồng!      │
│ Số lần thử còn lại: [ ⚡⚡⚡ ] (3/4)                    │
└────────────────────────────────────────────────────────┘
```

### 3.3. Top Notification Toast Banner (`NotificationBanner`)
```
┌────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────┐ │
│ │ 💬 LoZa • Vừa xong                             ✕   │ │
│ │ Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé" │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ (Giao diện ứng dụng đang mở bên dưới)                  │
└────────────────────────────────────────────────────────┘
```
