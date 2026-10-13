---
type: App Design Specification
app_id: poshee
app_name: Poshee
real_world_parody: Shopee / TikTok Shop
status: approved
description: "Branding, UI/UX visual design system, color tokens, typography, and wireframe layouts for the Poshee e-commerce app."
tags: [app-design, poshee, ecommerce, ui-ux, design-system, branding]
timestamp: "2026-10-13T14:35:00+07:00"
---

# Poshee — App Design & UI/UX Specification

---

## 1. Brand Identity & Parody Theme

| Attribute | Specification |
|---|---|
| **App Name** | **Poshee** (Parody of *Shopee* and *TikTok Shop*) |
| **Slogan / Tagline** | *"Mua gì cũng rẻ — Ship tận tay ai?"* |
| **Real-World Parody** | Shopee / TikTok Shop |
| **Trademark Defense** | Uses a warm sunset coral-orange (`#FF5722`) rather than Shopee's bright reddish-orange (`#EE4D2D`). Logo features a stylized gift box with a heart-shaped bow. |
| **Visual Persona** | High-energy e-commerce platform with promotional vouchers, order status tabs, and product SKU badges. |

---

## 2. Visual Design System & Color Tokens

```
┌────────────────────────────────────────────────────────┐
│                   POSHEE COLOR PALETTE                 │
├────────────────────────────────────────────────────────┤
│ Primary Brand:        Coral Sunset    #FF5722          │
│ Completed Status:     Forest Sage     #2E7D32          │
│ In-Transit Status:    Warm Amber      #FFA000          │
│ Background Surface:   Light Gray      #F8F9FA          │
│ Card Surface:         Pure White      #FFFFFF          │
│ Text Primary:         Dark Charcoal   #212121          │
│ Price Accent:         Vibrant Orange  #E64A19          │
│ Tag Pill Background:  Pale Peach      #FFECB3          │
└────────────────────────────────────────────────────────┘
```

* **Typography**:
  * Product Title: Semibold ($15\text{px}$).
  * Pricing & Total: Bold ($16\text{px}$ / weight $700$).
  * SKU Variant / Address: Regular ($13\text{px}$).
* **Ergonomics & Touch Targets**:
  * Search bar height: $\ge 48\text{px}$.
  * Order status tab buttons $\ge 44\text{px}$ height.
  * Order cards expand via full-card tap area.

---

## 3. UI Wireframes & Layout Architecture

### 3.1. Order History View (`PosheeOrderListView`)
```
┌────────────────────────────────────────────────────────┐
│ [< Trang chủ]       [ 🔍 Tìm kiếm sản phẩm... ] [ 🛒 ] │
├────────────────────────────────────────────────────────┤
│ [ Tất cả ]       [ Đang giao ]       [ Đã giao (4) ]   │
├────────────────────────────────────────────────────────┤
│ 📦 ĐƠN HÀNG #PSH99281              ĐÃ GIAO THÀNH CÔNG  │
│    Váy ngủ lụa satin 2 dây gợi cảm                     │
│    Phân loại: [Màu Đỏ Rượu] - [Size S]                 │
│    Thành tiền: 380.000 đ                               │
│    📍 Người nhận: Thu Trang (0912****88)               │
│       Chung cư mini số 12 ngõ 85 Chùa Láng             │
├────────────────────────────────────────────────────────┤
│ 📦 ĐƠN HÀNG #PSH84112              ĐÃ GIAO THÀNH CÔNG  │
│    Son Dior Rouge 999 Velvet chính hãng                │
│    Phân loại: [Đỏ Thuần 999]                           │
│    Thành tiền: 890.000 đ                               │
├────────────────────────────────────────────────────────┤
│ 📦 ĐƠN HÀNG #PSH72004              ĐÃ GIAO THÀNH CÔNG  │
│    Dây rút nhựa 20cm (Túi 100 sợi)                     │
│    Thành tiền: 25.000 đ                                │
└────────────────────────────────────────────────────────┘
```

### 3.2. Order Detail Invoice Drawer (`PosheeOrderDetailDrawer`)
```
┌────────────────────────────────────────────────────────┐
│ [ Đóng ✕ ]            CHI TIẾT ĐƠN HÀNG                │
├────────────────────────────────────────────────────────┤
│ Trạng thái:            Đã giao thành công              │
│ Ngày đặt hàng:         10/10/2026 14:15                │
├────────────────────────────────────────────────────────┤
│ ĐỊA CHỈ NHẬN HÀNG:                                     │
│ Thu Trang | (+84) 912 345 688                          │
│ Chung cư mini số 12 ngõ 85 Chùa Láng, Đống Đa, Hà Nội  │
├────────────────────────────────────────────────────────┤
│ SẢN PHẨM:                                              │
│ • Váy ngủ lụa satin 2 dây cao cấp                      │
│   Phân loại: Size S / Đỏ Rượu                          │
│   Số lượng: 1 x 380.000 đ                              │
├────────────────────────────────────────────────────────┤
│ [ ➕ Thêm Thu Trang vào Sổ Tay Bắt Ghen ]               │
└────────────────────────────────────────────────────────┘
```

### 3.3. Search Keyword Tag Cloud Overlay (`PosheeSearchOverlay`)
* Tapping the search bar renders recent search tags (*"nội y quyến rũ"*, *"váy body tôn dáng"*, *"quà sinh nhật bạn gái mới quen"*).
