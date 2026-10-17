---
type: App Features Specification
app_id: poshee
app_name: Shopoo
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Shopoo."
tags: [app-features, poshee, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
---

# Shopoo — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Shopoo acts as the physical paper-trail channel. In Vietnamese marital investigations, e-commerce order histories frequently uncover infidelity through alternate delivery addresses (mini-apartments), clothing purchased in sizes mismatched from the wife's, and incriminating search bar queries.

---

## 2. In-App Features & User Interactions

### 2.1. Order History & Status Filtering
* History filters show *Tất cả* plus any order statuses and profile queues represented by the supplied data.
* Displays product thumbnails, SKU options, quantities, prices, and destination addresses.
* The profile's *Tất cả đơn* button opens history when orders exist. Status and order-type shortcuts are enabled only when an order declares the matching `profileQueues` entry; empty shortcuts remain visible and disabled.

### 2.2. Order Detail & Shipping Address Inspector
* Full delivery invoice reveals the recipient's name, masked phone number, and exact street address.
* Shortcut button allows one-tap suspect tagging into **Sổ Tay Bắt Ghen Của Vợ**.

### 2.3. SKU Variant & Sizing Forensics
* Displays detailed item attributes: *Phân loại hàng* (e.g. Size S, Size L, Color/Shade).

### 2.4. Search History Tag Cloud
### 2.5. In-App Seller Chat & Inquiry Threads
* Direct chat threads with shop sellers (`PosheeChatListView`, `PosheeChatDetailView`).
* Features pinned product enquiry cards displaying product image, selected SKU variant (e.g. `TRẮNG, 3XL` or `Size S`), price, and voucher CTA.
* Sellers answer sizing questions, custom delivery instructions, and discrete packaging requests.

### 2.6. Multi-Channel Notifications & Logistics Tracking
* Pinned order delivery progress cards (*"Đang vận chuyển"*, *"Giao kiện hàng thành công"*) with SPX tracking IDs.
* Filter category tabs for promotional alerts, seller updates, and account security notifications.
* Notifications with an `orderId` must resolve to an order in the current history; unresolved order notifications are omitted.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-POSH-01` | `PosheeOrderDetailDrawer` • Shipping Address | Inspect order -> Delivered to an unfamiliar mini-apartment address (*"Chung cư mini số 12 ngõ 85 Chùa Láng"*). | Cheating / Sugar | Medium |
| `CLUE-POSH-02` | `PosheeOrderDetailDrawer` • Size Variant | Inspect SKU variant -> Lingerie ordered in **Size S**; wife is known to wear **Size L**. | Cheating | Easy |
| `CLUE-POSH-03` | `PosheeOrderDetailDrawer` • Recipient Tag | Inspect order -> Luxury vacuum or cosmetics shipped to husband's sister's address as an anniversary gift. | Innocent (Surprise Gift) | Hard |
| `CLUE-POSH-04` | `PosheeSearchOverlay` • Search Tags | Tap search bar -> Tags show *"nội y quyến rũ"*, *"váy body tôn dáng"*, *"quà sinh nhật bạn gái mới quen"*. | Cheating | Easy |
| `CLUE-POSH-05` | `PosheeChatDetailView` • Seller Chat | Inspect seller chat -> Husband requests discrete packaging (*"Shop che tên sản phẩm trên bao bì giúp mình nhé"*) or asks about fit for another woman. | Cheating (Concealment) | Medium |
| `CLUE-POSH-06` | `PosheeNotificationView` • Order Tracking | Inspect "Cập nhật đơn hàng" -> Order delivered at unusual hour to alternate pickup point. | Cheating (Schedule) | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Order #PSH72004**: Bag of 100 nylon cable ties ($25.000\text{ đ}$) delivered to family home.
* **Order #PSH65119**: Magnetic dashboard phone car mount ($85.000\text{ đ}$).
* **Order #PSH59821**: 500g roasted Arabica coffee beans ($140.000\text{ đ}$).
* **Order #PSH43120**: Ergonomic memory foam mousepad ($65.000\text{ đ}$).
* **Chat #DudeBasic**: Sizing question regarding basic Polo shirt (*"Bao h thì về thêm áo này sz 3xl hả shop"*).
* **Notification**: Flash sale alert from *Shopoo Xử Lý* and account security alert.

---

## 5. Declarative Data Contract

```typescript
export interface PosheeData {
  unreadBadge?: number;
  recentSearches: string[];
  orders: Array<{
    orderId: string;
    status: 'completed' | 'in_transit' | 'cancelled';
    profileQueues?: Array<'awaiting_confirmation' | 'awaiting_pickup' | 'awaiting_delivery' | 'awaiting_review' | 'mobile_topup' | 'express_delivery'>;
    orderDate: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    items: Array<{
      productTitle: string;
      variantName: string; // e.g. "Size S"
      price: number;
      thumbnailUrl?: string;
    }>;
    totalAmount: number;
    paymentMethod: string;
    trackingNumber?: string;
    isClue?: boolean;
    suspectName?: string;
    clueRefId?: string;
  }>;
  chats?: Array<{
    shopId: string;
    shopName: string;
    isFavorite?: boolean;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    pinnedProduct?: {
      title: string;
      variant: string;
      price: string;
      discount?: string;
      salesCount?: string;
    };
    messages: Array<{
      id: string;
      sender: 'shop' | 'user';
      text: string;
      time: string;
      isAutoReply?: boolean;
      isClue?: boolean;
      clueRefId?: string;
    }>;
  }>;
  notifications?: Array<{
    id: string;
    type: 'order' | 'seller' | 'promo' | 'security';
    title: string;
    snippet: string;
    timestamp: string;
    trackingId?: string;
    isClue?: boolean;
    clueRefId?: string;
  }>;
}
```
