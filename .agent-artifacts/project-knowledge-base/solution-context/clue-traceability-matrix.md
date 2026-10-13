---
type: Traceability Matrix
status: approved
description: "Canonical Clue Traceability & Coverage Matrix mapping all 26 clue archetypes from clue-ideas-inventory.md to individual virtual apps, UI features, truth twists, and cross-app puzzle chains."
tags: [clues, traceability, coverage-matrix, puzzle-chains, level-mapping]
timestamp: "2026-10-13T14:30:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/loza/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/vietpay/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/poshee/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/grap/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/netsurf/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/photos/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/comms/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/husband-notes/features.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/wife-notebook/features.md
---

# Canonical Clue Traceability & Forensic Coverage Matrix

> **Purpose**: Serves as the operational single source of truth connecting narrative clues in [clue-ideas-inventory.md](clue-ideas-inventory.md) to technical app specifications in `apps/`, level progression gating, and puzzle chaining flows.

---

## 1. Master Clue Traceability Matrix

| Clue ID | Target App | Target UI Feature & Component | Sub-Type | Intended Truth / Twist | Target Level | Forensic Acceptance Criteria |
|---|---|---|---|---|---|---|
| `CLUE-LOZA-01` | [LoZa](apps/loza/features.md) | `LoZaChatThreadView` • Disguised Nickname Decoupling | Text / Tone mismatch | Cheating (Colleague / Affair) | Level 1, 2 | Contact title shows "Anh Tuấn Thợ Điện" or "Sếp Hùng", but message bubbles contain romantic stickers and affectionate dialogues. Tapping adds contact to Wife's Notebook. |
| `CLUE-LOZA-02` | [LoZa](apps/loza/features.md) | `LoZaPinModal` • Pinned Hidden Chat | Locked Feature | Cheating or Sugar | Level 2, 3 | Thread is locked with a 4-digit PIN. Unlocked using date clue found in Notes (`CLUE-NOTE-01`). Failed attempts increment Suspicion meter. |
| `CLUE-LOZA-03` | [LoZa](apps/loza/features.md) | `LoZaChatThreadView` • Disappearing Message Banner | Fragmented Chat | Cheating | Level 1 | System banner shows *"Tin nhắn tự xoá sau 24h đã bật"*; remaining messages contain fragmented meeting plans (*"Tối mai chỗ cũ nhé"*). |
| `CLUE-LOZA-04` | [LoZa](apps/loza/features.md) | `LoZaChatThreadView` • Interactive Location Card | Metadata / Location | Cheating | Level 2 | Location card renders luxury hotel pin (*"Khách Sạn Sen Vàng"*) sent at 21:15, contradicting claimed traffic jam. |
| `CLUE-LOZA-05` | [LoZa](apps/loza/features.md) | `LoZaChatThreadView` • Playable Voice Memo Bubble | Audio / Red Herring | Innocent | Level 2, 3 | Playable voice memo (`0:14`) with passionate dialogue (*"Bé cưng đầm tay lắm..."*) which context reveals is about a vintage Vespa or fishing rod. |
| `CLUE-LOZA-06` | [LoZa](apps/loza/features.md) | `LoZaChatThreadView` • Bot Account Profile & VIP Tier | Bot Chat | Cheating (Non-Human / AI) | Level 1, 2 | Chat thread with verified account *"Em Yêu Ảo - AI Girlfriend"* showing VIP monthly subscription card (`99.000đ/tháng`). |
| `CLUE-BANK-01` | [VietPay](apps/vietpay/features.md) | `VietPayHistoryView` • Consecutive Micro-Transfer Feed | Transaction History | Cheating | Level 1 | Sequential 1,000–2,000 VNĐ transfers where `Lời nhắn` forms a chat log (*"Em gian anh a"*, *"Sao khong nghe may"*). |
| `CLUE-BANK-02` | [VietPay](apps/vietpay/features.md) | `VietPayHistoryView` • Sugar Allowance Inflow Ledger | Statement Inflow | Sugar Relationship | Level 2, 3 | High-value credit inflows (+10M to +20M VNĐ) with sugar mommy memos (*"Thuong cho chuot con"*, *"Tien tieu vat cho be"*). |
| `CLUE-BANK-03` | [VietPay](apps/vietpay/features.md) | `VietPayTransactionModal` • Receipt Detail Drawer | Expense Discrepancy | Cheating | Level 1, 2 | Debit receipt of 1,500,000 VNĐ to hotel/dining merchant, contradicting husband's claim of 35k pho. |
| `CLUE-BANK-04` | [VietPay](apps/vietpay/features.md) | `VietPayVaultView` • Secret Savings Sub-Vault | Hidden Vault | Innocent (Anniversary) | Level 3 | Sub-vault named *"Tiet Kiem Mua Nhan Kim Cuong Cho Vo"* accumulating monthly deposits for wife's anniversary gift. |
| `CLUE-BANK-05` | [VietPay](apps/vietpay/features.md) | `VietPayTransactionModal` • Bill-Split Expense Memo | Expense Split | Cheating | Level 2 | Debit transfer with memo *"Campuchia tien an toi 50/50"* with a female beneficiary bank account. |
| `CLUE-POSH-01` | [Poshee](apps/poshee/features.md) | `PosheeOrderDetailDrawer` • Shipping Address Inspector | Shipping Address | Cheating / Sugar | Level 2 | Order delivered to unfamiliar mini-apartment address (*"Chung cư mini số 12 ngõ 85 Chùa Láng, người nhận: Thu Trang"*). |
| `CLUE-POSH-02` | [Poshee](apps/poshee/features.md) | `PosheeOrderDetailDrawer` • Product Variant Sizing | Product mismatch | Cheating | Level 1 | Women's silk pajamas or lingerie purchased in **Size S**, whereas wife wears **Size L**. |
| `CLUE-POSH-03` | [Poshee](apps/poshee/features.md) | `PosheeOrderDetailDrawer` • Recipient Tag (Red Herring) | Shipping Address | Innocent (Surprise Gift) | Level 2, 3 | Expensive robot vacuum or cosmetics shipped to husband's sister's address (*"Người nhận: Chị Mai - Chị ruột"*). |
| `CLUE-POSH-04` | [Poshee](apps/poshee/features.md) | `PosheeSearchOverlay` • Recent Search Keyword Chips | Search History | Cheating | Level 1 | Search chips reveal *"nội y quyến rũ"*, *"váy body tôn dáng"*, *"quà sinh nhật bạn gái mới quen"*. |
| `CLUE-GRAP-01` | [Grap](apps/grap/features.md) | `GrapActivityListView` • Late-Night Trip Destination | Ride History | Cheating | Level 1, 2 | Ride log displays GrapCar trip booked at 23:45 to love hotel (*"Khách sạn Sao Mai"*). |
| `CLUE-GRAP-02` | [Grap](apps/grap/features.md) | `GrapFoodDetailModal` • Driver Note & Recipient Field | Food Delivery | Cheating | Level 2 | GrapFood order for 2 boba milk teas delivered to unfamiliar office with note: *"Giao tận tay bạn Mai lễ tân"*. |
| `CLUE-GRAP-03` | [Grap](apps/grap/features.md) | `GrapActivityListView` • Express Parcel Delivery | Delivery History | Innocent | Level 2 | GrapExpress delivery of premium bird's nest (*yến sào*) addressed to mother-in-law (*"Mẹ vợ - Bác Nga"*). |
| `CLUE-BROW-01` | [NetSurf](apps/netsurf/features.md) | `NetSurfHistoryView` • Incriminating Search Query Log | Search Query | Cheating | Level 1 | Queries: *"cách tắt định vị iphone mà vợ không biết"*, *"xoá lịch sử zalo có khôi phục được không"*. |
| `CLUE-BROW-02` | [NetSurf](apps/netsurf/features.md) | `NetSurfTabSwitcherView` • Open Incognito Tab | Open Tabs | Cheating or Innocent | Level 2 | Active incognito tab showing hotel room booking confirmation or luxury jewelry shop. |
| `CLUE-BROW-03` | [NetSurf](apps/netsurf/features.md) | `NetSurfMockPageView` • Sugar Dating Forum Reader | Bookmarks / History | Sugar Relationship | Level 2, 3 | Forum thread: *"Kinh nghiệm chu cấp cho sinh viên đại học từ A-Z"*. |
| `CLUE-BROW-04` | [NetSurf](apps/netsurf/features.md) | `NetSurfHistoryView` • Waifu Romance Search History | Search Query | Cheating (Non-Human) | Level 1 | Queries: *"cách tỏ tình với nhân vật anime"*, *"top game bạn gái ảo hay nhất 2026"*. |
| `CLUE-PHOT-01` | [Photos](apps/photos/features.md) | `LockedAlbumGateModal` • 4-Digit PIN Hidden Folder | Hidden Folder | Cheating | Level 2, 3 | Hidden album requires PIN (found in Notes/Calendar). Contains selfies or flirtatious chat screenshots. |
| `CLUE-PHOT-02` | [Photos](apps/photos/features.md) | `PhotoLightboxView` • Reflection Magnifier Hotspot | Visual Forensics | Cheating | Level 3 | Photo of dining table; zooming into reflection on wine glass reveals a woman's manicured hand/face. |
| `CLUE-PHOT-03` | [Photos](apps/photos/features.md) | `PhotoLightboxView` • Car Dashboard Inspection | In-Car Evidence | Cheating | Level 2 | Photo of car dashboard showing an unfamiliar luxury female handbag on front passenger seat. |
| `CLUE-PHOT-04` | [Photos](apps/photos/features.md) | `PhotoLightboxView` • Innocent Anniversary Photos | Hidden Folder | Innocent | Level 3 | Hidden folder contains draft anniversary jewelry sketches, diamond receipts, and photo with sister holding gift. |
| `CLUE-COMM-01` | [Comms](apps/comms/features.md) | `CommsCallLogView` • Late-Night 1-Minute Call Log | Call Log Duration | Cheating | Level 1, 2 | Outgoing calls at 23:45 lasting 1–2 minutes to disguised contacts (*"Tổng Đài Viettel"*, *"Đồng nghiệp Nam"*). |
| `CLUE-COMM-02` | [Comms](apps/comms/features.md) | `CommsSMSInboxView` • Booking Confirmation SMS | Brand SMS | Cheating | Level 2 | Brand SMS from `HOTEL_SAOMAI` confirming weekend stay for 2 guests during claimed work retreat. |
| `CLUE-COMM-03` | [Comms](apps/comms/features.md) | `CommsContactDetailModal` • Hidden Address Note | Contact Card | Cheating | Level 3 | Contact info for *"Bác Sĩ Cương"* reveals secondary phone number and apartment address matching Poshee delivery. |
| `CLUE-NOTE-01` | [Husband's Notes](apps/husband-notes/features.md) | `NoteReaderView` • Cryptic Password Clue Note | Puzzle Clue | Unlock Mechanic | Level 2, 3 | Note titled *"Mật khẩu quan trọng"*: *"Ngày đầu tiên ta chạm mặt tại Highland Nhà Thờ: DDMM"*. Date unlocks Bank or Hidden Photos. |
| `CLUE-NOTE-02` | [Husband's Notes](apps/husband-notes/features.md) | `NoteReaderView` • "Quỹ Đen" Financial Ledger | Financial Log | Cheating or Innocent | Level 2 | Note comparing real freelance earnings vs official amount surrendered to wife (*"Vén khéo" classic*). |
| `CLUE-NOTE-03` | [Husband's Notes](apps/husband-notes/features.md) | `CalendarAgendaView` • Contradictory Schedule Event | Agenda Contradiction | Cheating | Level 2, 3 | Calendar shows *"OT Sprint Dự Án"*, but Grap ride history shows he traveled in the opposite direction. |

---

## 2. Cross-App Puzzle Chaining Mechanics

```
┌─────────────────────────┐
│   Clue A: SMS / Notes   │
│  "Ngày gặp Highland:    │
│         15/06"          │
└────────────┬────────────┘
             │ (Provides PIN "1506")
             ▼
┌─────────────────────────┐       (Reveals Transfer to "Bé Mèo")      ┌─────────────────────────┐
│     Locked VietPay      ├──────────────────────────────────────────►│   Wife's Notebook &     │
│   (Bank 4-Digit PIN)    │                                           │   Suspect Dossier       │
└─────────────────────────┘                                           │   (Accuse Culprit)      │
             │                                                        └───────────▲─────────────┘
             │ (Reveals Secret Phone Number)                                      │
             ▼                                                                    │
┌─────────────────────────┐       (Cross-references alternate address)           │
│     Poshee / Grap       ├───────────────────────────────────────────────────────┘
│  (Delivery to Mai Lễ Tân)│
└─────────────────────────┘
```

### Chaining Example 1: The Hidden Birthday PIN (Level 2)
1. **Entry**: Player attempts to open **VietPay** -> App is locked with a 4-digit PIN pad.
2. **Discovery**: Player explores **Husband's Notes** -> Discovers note: *"Pass thẻ: Ngày bé Mèo nhận việc"*.
3. **Cross-Reference**: Player opens **LoZa** -> Searches contact *"Bé Mèo"*, scrolls to earliest message: *"Hôm nay 15/06 em bắt đầu thử việc, anh chỉ bảo em nhé!"*.
4. **Unlock**: Player enters `1506` into VietPay -> Bank unlocks.
5. **Incrimination**: VietPay statement reveals sequential 1,000 VNĐ transfers with affectionate messages to "Bé Mèo".
6. **Verdict Submission**: Player opens **Sổ Tay Bắt Ghen Của Vợ**, tags "Bé Mèo" as the accused suspect, and selects **Ngoại Tình** (Cheating) to win 3 stars.

### Chaining Example 2: The Innocent Surprise Gift (Level 3 Red Herring)
1. **Suspicion**: Player inspects **Grap** ride history -> Trip to luxury diamond boutique; **VietPay** statement shows $15.000.000\text{ đ}$ debited.
2. **Investigation**: Player inspects **Poshee** -> Finds order for silk lingerie delivered to sister's house address.
3. **Unlock**: Player unlocks **Hidden Photos** using anniversary date from **Calendar** -> Finds a photo of husband holding the jewelry box next to his sister with handwritten note: *"Cảm ơn chị gái đã đi chọn nhẫn kỷ niệm 10 năm cưới giúp em, giấu vợ kỹ nhé!"*.
4. **Resolution**: Husband is **Innocent**. If the player wrongfully accuses him of cheating, the game plays the heartbroken comedic roast ending (*"Vợ Sư Tử Hà Đông ghen bóng ghen gió"*).

---

## 3. Level Difficulty & Puzzle Distribution Matrix

| Difficulty Level | Apps With Clues | Locked Apps / Folders | Strike Limit | Primary Puzzle Mechanics |
|---|---|---|---|---|
| **Level 1 (Introductory)** | 3–4 Apps *(LoZa, VietPay, Poshee)* | **0 Locked** | 5 Strikes | Direct tone mismatches, 1k transfers, size discrepancies. Non-clue apps populated with benign mundane clutter. |
| **Level 2 (Intermediate)** | 5–6 Apps *(LoZa, VietPay, Poshee, Grap, Browser)* | **1 Locked** *(VietPay or LoZa chat)* | 4 Strikes | 4-digit PIN unlock chained from Notes/LoZa, contradictory Grap travel logs, driver delivery instructions. |
| **Level 3 (Master Detective)** | 7–8 Apps *(All apps active)* | **2 Locked** *(VietPay + Hidden Photos)* | 3 Strikes | Multi-step cross-referencing, visual reflection forensics in Photos, complex innocent red herrings, tight 3-strike tolerance. |

