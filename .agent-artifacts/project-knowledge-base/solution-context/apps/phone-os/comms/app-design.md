---
type: App Design Specification
app_id: comms
app_name: Comms
real_world_parody: iOS Phone & SMS / Android Dialer
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Comms phone, SMS, and contacts utility."
tags: [app-design, comms, phone, sms, contacts, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
---

# Comms — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Comms** (Unified parody of *Phone Dialer*, *SMS Messages*, and *Contacts*) |
| **Slogan / Tagline** | *"Gọi một phút — Nghi ngờ một đời"* |
| **Real-World Parody** | Native iOS Phone/Messages & Android Phone |
| **Trademark Defense** | Merges cellular dialer, call logs, SMS, and contacts directory into a unified, lightweight OS utility. Uses royal blue (`#007AFF`) and forest phone green (`#34C759`). |
| **Visual Persona** | Clean system utility with high-contrast call duration badges, brand SMS headers, and contact card modals. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                    COMMS COLOR PALETTE                 │
├────────────────────────────────────────────────────────┤
│ Background Canvas:    Pure White      #FFFFFF          │
│ Outgoing Call Icon:   Apple Green     #34C759          │
│ Missed Call Icon:     Signal Red      #FF3B30          │
│ SMS Bubble Accent:    Sky Blue        #007AFF          │
│ Contact Initials Bg:  Soft Slate      #E5E5EA          │
│ Text Primary:         Jet Black       #000000          │
│ Text Subtitle:        Neutral Gray    #8E8E93          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Contact Name: Semibold ($16\text{px}$).
  * Call Duration / Timestamp: Regular ($13\text{px}$).
* **Ergonomics & Touch Targets**:
  * Tab switcher buttons $\ge 48\text{px}$ height.
  * Contact row minimum height: $56\text{px}$.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Call Log & SMS Screen (`CommsCallLogView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]                 Comms             [ 🔍 ] │
├────────────────────────────────────────────────────────┤
│ [ Cuộc gọi (3) ]       [ Tin nhắn SMS (4) ]   [ Danh bạ ]│
├────────────────────────────────────────────────────────┤
│ 📞 Tổng Đài Viettel (Cuộc gọi đi)                23:45 │
│    ⏱️ Thời lượng: 1 phút 12 giây                       │
├────────────────────────────────────────────────────────┤
│ 📞 Đồng nghiệp Nam (Cuộc gọi đi)                 23:10 │
│    ⏱️ Thời lượng: 1 phút 45 giây                       │
├────────────────────────────────────────────────────────┤
│ 📞 Mẹ Đẻ (Cuộc gọi đến)                         18:05 │
│    ⏱️ Thời lượng: 5 phút 20 giây                       │
├────────────────────────────────────────────────────────┤
│ 💬 HOTEL_SAOMAI                                  Hôm qua│
│    Xac nhan dat phong VIP 2 khach ngay 15/10 thanh cong│
├────────────────────────────────────────────────────────┤
│ 👤 Bác Sĩ Cương (Nhãn khoa)                            │
│    Chạm để xem thông tin chi tiết liên hệ              │
└────────────────────────────────────────────────────────┘
```

### 3.2. Contact Detail Modal (`CommsContactDetailModal`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            CHI TIẾT LIÊN HỆ                 │
├────────────────────────────────────────────────────────┤
│                     [ 👤 BC ]                          │
│                   Bác Sĩ Cương                         │
│                    (Nhãn khoa)                         │
├────────────────────────────────────────────────────────┤
│ Số chính:       0912 888 999                           │
│ Số phụ:         0988 123 456                           │
├────────────────────────────────────────────────────────┤
│ GHI CHÚ:                                               │
│ "Chung cư Sunshine City - Tòa S2 P1408"                │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Bác Sĩ Cương vào Sổ Tay Bắt Ghen ]           │
└────────────────────────────────────────────────────────┘
```
