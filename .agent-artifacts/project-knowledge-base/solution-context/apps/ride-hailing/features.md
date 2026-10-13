---
type: App Features Specification
app_id: grap
app_name: Grap
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Grap."
tags: [app-features, grap, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
---

# Grap — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Grap provides spatiotemporal tracking of the husband's physical movements and dining habits. In marital investigations, ride histories expose late-night trips to love hotels, while food delivery notes reveal secret sweet treats ordered for mistresses at other office buildings.

---

## 2. In-App Features & User Interactions

### 2.1. Multi-Service History Tab
* Category switcher: *Di chuyển* (Rides), *Đồ ăn* (Food delivery), *Giao hàng* (Express packages).
* Chronological listing with origin/destination pins, merchant names, timestamps, and fare tags.

### 2.2. Interactive Ride Detail Modal
* Full trip receipt showing exact vehicle type, license plate, pickup/drop-off points, and timestamp.
* Contradicts claimed workplace overtime in Notes/Calendar.

### 2.3. Food Delivery Driver Notes Inspector
* GrapFood card details line items and reveals critical driver delivery instructions (*"Ghi chú cho tài xế"*).
* Shortcut button allows tagging suspects into **Sổ Tay Bắt Ghen Của Vợ**.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-GRAP-01` | `GrapActivityListView` • Late-Night Trip | Review ride history -> GrapCar trip booked at 23:45 to love hotel (*"Khách sạn Sao Mai"*). | Cheating | Easy |
| `CLUE-GRAP-02` | `GrapFoodDetailModal` • Driver Note | Open food order -> 2 cups of boba tea delivered to an unfamiliar office with note: *"Giao tận tay bạn Mai lễ tân"*. | Cheating | Medium |
| `CLUE-GRAP-03` | `GrapActivityListView` • Parcel Delivery | Review delivery history -> Express delivery of bird's nest (*yến sào*) addressed to mother-in-law (*"Mẹ vợ - Bác Nga"*). | Innocent (Surprise) | Medium |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Morning Commute**: GrapBike from home to office at 08:15 ($32.000\text{ đ}$).
* **Evening Commute**: GrapBike from office back home at 18:30 ($35.000\text{ đ}$).
* **Lunch Delivery**: GrapFood order for 1 portion of Cơm Tấm Sườn Bì Chả at 12:10 ($45.000\text{ đ}$).

---

## 5. Declarative Data Contract

```typescript
export interface GrapData {
  activities: Array<{
    activityId: string;
    serviceType: 'ride' | 'food' | 'express';
    status: 'completed' | 'cancelled';
    timestamp: string;
    totalFare: number;
    vehicleType?: 'GrapBike' | 'GrapCar';
    pickupLocation?: string;
    dropoffLocation?: string;
    routeMapThumbnail?: string;
    restaurantName?: string;
    orderItems?: Array<{ itemName: string; quantity: number; options?: string }>;
    deliveryAddress?: string;
    driverNote?: string;
    senderName?: string;
    recipientName?: string;
    packageDescription?: string;
    clueRefId?: string;
  }>;
}
```
