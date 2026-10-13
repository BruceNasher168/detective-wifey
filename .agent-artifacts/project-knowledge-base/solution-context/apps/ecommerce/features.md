---
type: App Features Specification
app_id: poshee
app_name: Poshee
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Poshee."
tags: [app-features, poshee, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/ecommerce/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Poshee — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Poshee acts as the physical paper-trail channel. In Vietnamese marital investigations, e-commerce order histories frequently uncover infidelity through alternate delivery addresses (mini-apartments), clothing purchased in sizes mismatched from the wife's, and incriminating search bar queries.

---

## 2. In-App Features & User Interactions

### 2.1. Order History & Status Filtering
* Status tabs: *Tất cả*, *Đang giao*, *Đã giao*.
* Displays product thumbnails, SKU options, quantities, prices, and destination addresses.

### 2.2. Order Detail & Shipping Address Inspector
* Full delivery invoice reveals the recipient's name, masked phone number, and exact street address.
* Shortcut button allows one-tap suspect tagging into **Sổ Tay Bắt Ghen Của Vợ**.

### 2.3. SKU Variant & Sizing Forensics
* Displays detailed item attributes: *Phân loại hàng* (e.g. Size S, Size L, Color/Shade).

### 2.4. Search History Tag Cloud
* Search bar triggers a slide-down list of recent queries (*"Lịch sử tìm kiếm gần đây"*).

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-POSH-01` | `PosheeOrderDetailDrawer` • Shipping Address | Inspect order -> Delivered to an unfamiliar mini-apartment address (*"Chung cư mini số 12 ngõ 85 Chùa Láng"*). | Cheating / Sugar | Medium |
| `CLUE-POSH-02` | `PosheeOrderDetailDrawer` • Size Variant | Inspect SKU variant -> Lingerie ordered in **Size S**; wife is known to wear **Size L**. | Cheating | Easy |
| `CLUE-POSH-03` | `PosheeOrderDetailDrawer` • Recipient Tag | Inspect order -> Luxury vacuum or cosmetics shipped to husband's sister's address as an anniversary gift. | Innocent (Surprise Gift) | Hard |
| `CLUE-POSH-04` | `PosheeSearchOverlay` • Search Tags | Tap search bar -> Tags show *"nội y quyến rũ"*, *"váy body tôn dáng"*, *"quà sinh nhật bạn gái mới quen"*. | Cheating | Easy |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Order #PSH72004**: Bag of 100 nylon cable ties ($25.000\text{ đ}$) delivered to family home.
* **Order #PSH65119**: Magnetic dashboard phone car mount ($85.000\text{ đ}$).
* **Order #PSH59821**: 500g roasted Arabica coffee beans ($140.000\text{ đ}$).
* **Order #PSH43120**: Ergonomic memory foam mousepad ($65.000\text{ đ}$).

---

## 5. Declarative Data Contract

```typescript
export interface PosheeData {
  recentSearches: string[];
  orders: Array<{
    orderId: string;
    status: 'completed' | 'in_transit' | 'cancelled';
    orderDate: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    items: Array<{
      productTitle: string;
      variantName: string; // e.g. "Size S"
      price: number;
      thumbnailUrl: string;
    }>;
    totalAmount: number;
    paymentMethod: string;
    clueRefId?: string;
  }>;
}
```
