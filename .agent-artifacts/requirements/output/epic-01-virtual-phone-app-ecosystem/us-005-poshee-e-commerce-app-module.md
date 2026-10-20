---
type: Requirement Story
epic: "Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)"
status: draft
description: "Read-only Shopoo investigation across purchase histories, invoices, search records, seller chats, and logistics notifications."
tags: [requirement, user-story, ecommerce, poshee, forensic-clues]
timestamp: "2026-10-15T21:43:45+07:00"
---

# US-005 - Shopoo E-Commerce App Module

### Epic: [Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)](./epic.md)

As a **Player**, I want to inspect Shopoo purchase histories, delivery recipients, item variants, recent searches, seller conversations, and logistics notifications.

### Canonical Wireframe Reference

- [Shopoo ASCII Wireframe - Screen SSOT](./wireframes/wireframe-poshee-ecommerce.md)
- Interactive HTML wireframe: pending explicit signoff on the completed ASCII wireframe; no HTML artifact exists yet.

### Acceptance Criteria

#### AC01: App Entry and Navigation

1. Tapping Shopoo in the current level's active app grid opens the module inside the shared virtual phone shell. The module does not mount a second status bar, Dynamic Island, home indicator, or AssistiveTouch.
2. The primary bottom tabs are **Trang chủ**, **Thông báo**, and **Tôi**, in that order. Marketplace, notification and profile content follows the app design's hierarchy and Shopoo brand tokens.
3. Header chat entries open the seller inbox; selecting a conversation opens its thread. The profile's **Xem lịch sử mua hàng** opens order history; selecting any order opens its invoice drawer.
4. Back returns to the previous view. Dismissing an invoice restores the originating order list and its selected filter and scroll position. Closing search returns to its originating screen.

#### AC02: Marketplace and Profile

1. Home contains the search entry, cart/chat chrome, quick-service card, six service categories, three promotional cards, and two-column discovery feed described in the app design. The profile contains identity/membership information, **Đơn mua**, the four-stage order pipeline, promotional hub and utility sections.
2. The pipeline retains **Chờ xác nhận**, **Chờ lấy hàng**, **Chờ giao hàng**, and **Đánh giá** as the source app's visual structure. These labels must not fabricate pending-order states absent from case data. Order history remains accessible independently of these decorative pipeline controls.
3. Case-dependent identity, balances, product data, prices, discounts, timestamps and counters display only supplied values. Source examples such as usernames, cart counts and wallet balances are not fallback facts.
4. Deals/Mall/Live/Video navigation and micro-lending sections are absent. Decorative commerce controls follow AC08 rather than opening new purchase workflows.

#### AC03: Order History and Filters

1. Order history lists all orders provided by the active case, including ordinary purchases and red herrings. Each entry displays its supplied order ID, date, status, items, variants, prices and destination summary.
2. **Tất cả** includes every supplied status, including `cancelled`; **Đang giao** includes only `in_transit`; **Đã giao** includes only `completed`. Canceled orders display **Đã hủy**. Filtering changes visibility without modifying records.
3. Tapping an ordinary or suspicious order opens the same invoice structure; opening an invoice must not depend on `isClue` or `clueRefId`.
4. Empty history displays **“Chưa có đơn mua.”** An empty selected filter displays **“Không có đơn phù hợp.”** Filters and back navigation remain available.

#### AC04: Invoice, Recipient and Sizing Inspection

1. The order drawer shows status, order ID/date, supplied tracking and courier information, recipient name, masked phone, complete delivery address, itemized titles and variants, supplied quantities, prices, total, and payment method. The module never unmasks a supplied masked phone number.
2. Long addresses and variants wrap and remain fully readable in the scrollable drawer. Missing optional values display `-`; missing quantity must not default to one. No recipient, tracking status, courier, quantity or address is fabricated.
3. Size, color and other SKU details retain the original case text. The interface does not announce a mismatch with the wife; comparison relies on supplied narrative evidence elsewhere in the case.
4. Closing the drawer uses the shared close/backdrop/drag-down behavior and scroll guard. An order's normal tap neither collects evidence nor creates a suspect.

#### AC05: Recent Search Inspection

1. Tapping the structural search entry opens the search overlay with the active case's recent-search chips. **“Chưa có lịch sử tìm kiếm.”** appears when none exist.
2. Supplied narrative search chips can be inspected using AC09. The search input, title, back control and history actions never become evidence targets.
3. Search queries are read-only historical records. The overlay cannot execute a real search, clear history, or replace existing terms. A visible **Xóa lịch sử** control is disabled; illustrative popular-search content must not be represented as the husband's history.

#### AC06: Seller Inbox and Conversations

1. The inbox displays supplied shop names, favorite labels, message previews, timestamps and unread counts. Selecting any thread opens its complete supplied message history, including ordinary sizing questions.
2. The inbox retains **Tất cả** and **Đang hoạt động** pills. Active-status filtering is available only when source data supplies activity state; otherwise **Đang hoạt động** is disabled and no shop is inferred to be online.
3. A thread contains its shop header, security notice, optional pinned product-enquiry card, dated customer/seller bubbles, supplied automatic-reply labels and unread divider. Missing product cards or optional metadata do not produce invented content.
4. Messages preserve sender, original text, timestamps and order. Long text wraps and scrolls. Product cards expose supplied SKU, price, discount and sales information without allowing purchases.
5. Empty inbox displays **“Chưa có cuộc trò chuyện.”** A selected thread without messages displays **“Chưa có tin nhắn.”** Composer, attachments, quick prompts and voucher/cart actions are non-editing controls under AC08.

#### AC07: Notifications and Logistics

1. **Thông báo** contains seller/order summary entries, supplied pinned tracking updates, and the latest-updates feed. Tracking records show their supplied status, timestamp, order reference, tracking ID and delivery narrative without generating live courier events.
2. **Thông báo nổi bật** shows the provided notification set; **Khuyến mãi** selects `promo`; **Đơn hàng** selects `order`; **Cập nhật Shopoo** selects `security`. The seller summary selects `seller`. No separate unsupported featured-ranking flag is inferred.
3. Selecting an order-linked update opens the matching existing invoice only when its order reference is supplied and resolves. A record without a matching order remains readable in the notification feed; it must not open an unrelated order or a fabricated tracking page.
4. Long delivery text expands or wraps for complete reading. Empty notification data displays **“Chưa có thông báo.”** An empty category displays **“Không có thông báo phù hợp.”** **Đọc tất cả** is disabled in this read-only scope.

#### AC08: Read-Only Boundary and Data Availability

1. Navigation, record inspection, filters, closing overlays and shared evidence collection work. Cart, checkout, wallet top-up, voucher redemption, camera/QR scanning, seller messaging, profile/settings edits, and record deletion do not create or modify data or request device permissions.
2. Commerce and edit controls remain recognizable but disabled/decorative, with accessible disabled semantics and no misleading active CTA. No toast or external destination is substituted for an undocumented workflow.
3. Missing Shopoo data displays **“Chưa có dữ liệu Shopoo cho màn này.”** Shared shell navigation remains available. Absent optional arrays behave as empty lists; sample suspicious orders are never injected as fallback content.
4. A missing optional image uses a neutral image placeholder. Supplied text remains readable; no external image fetch is introduced during gameplay.

#### AC09: Universal Evidence Inspection

1. Holding dynamically loaded order narrative, recipient/address/variant data, recent-search chips, seller-message narrative or logistics-update narrative for **380 ms** opens the existing blurred `UniversalEvidenceModal` through `StoryEvidenceTarget`.
2. Ordinary records, innocent gifts and suspicious records use the same inspection affordance. Headers, static product advertising, search bars, contact/shop header actions, bottom tabs, filter pills, settings and decorative shopping controls never trigger evidence overlays.
3. Successful long-press suppresses the same target's short-tap navigation. Scrolling or canceling a hold does not collect evidence. A tap opens the documented view without automatically pinning content.
4. Collection occurs only through the shared modal/notebook flow. App screens, invoice drawers and chat feeds contain no permanent **Ghim** or **Thêm vào sổ tay** evidence shortcut.
5. Evidence retains active-case identity, source record and supplied clue/suspect references. Missing clue metadata must not be guessed from wording or array position. No default truth labels, clue IDs, glowing highlights or artificial clue badges reveal which records matter.

#### AC10: Six Clue Types and Mundane Content

1. Case content can represent `CLUE-POSH-01`, an unfamiliar recipient/delivery address, and `CLUE-POSH-02`, an item size that can be compared with the wife's documented size. The source examples use the Chùa Láng mini-apartment and Size S versus Size L.
2. `CLUE-POSH-03` supports the innocent family gift delivered to the husband's sister. The app preserves recipient context without declaring innocence or guilt.
3. `CLUE-POSH-04` supports configured recent-search terms such as **“quà sinh nhật bạn gái mới quen”**. `CLUE-POSH-05` supports seller messages requesting concealed packaging. `CLUE-POSH-06` supports unusual delivery timing or an alternate pickup location.
4. Ordinary cable ties, phone mounts, coffee, mousepads, polo sizing chats, promotional notices and security notices use the same corresponding views and evidence rules when included as case narrative. The module does not inject all examples or all six clues into every level.

### Out of Scope

| ID | Exclusion |
|---|---|
| OOS01 | Real commerce, payments, wallet operations, live logistics, network search and device camera access. |
| OOS02 | Sending messages, changing order/profile data, clearing search history or notification records. |
| OOS03 | Deals/Mall/Live/Video destinations, micro-lending, new notebook or evidence engines. |
| OOS04 | Runtime implementation, new case narratives, clue-catalog changes and HTML before ASCII signoff. |

### Non-functional Requirements

| Requirement | Acceptance Boundary |
|---|---|
| Platform | Inherit client-side execution, zero runtime network/telemetry and the existing under-100ms navigation response target. No new story-specific SLA. |
| Accessibility | Inherit universal typography floors, contrast, text scaling and safe areas; app-design's small mockup labels cannot override universal readability. Narrative text remains readable without truncation. |
| Touch ergonomics | Buttons at least 44 × 44 px; bottom tabs at least 48 × 44 px; search hit area at least 48 px high even where the source's visual capsule is 38 px. |
| Reuse and styling | Shared shell, drawer and evidence contracts; Shopoo-scoped brand tokens; Ionicons via react-icons/io5 or responsive SVG; no emoji UI iconography. |
| Language and integrity | Vietnamese UI with proper names and supplied narrative preserved. No record mutation or fabricated narrative fallback. |

### Open Questions

No blocking scope questions remain. This story remains `draft` pending ASCII review, subsequent visual delivery, field-mapping verification and team sizing. The original one-week estimate is not revalidated for the expanded scope.

### Citations

| Source | Coverage |
|---|---|
| [Signed-off US-005 elicitation](../elicitation/2026-10-15-us-005-poshee.md) | User scope answers and five-file plan approval |
| [Shopoo features](../../../project-knowledge-base/solution-context/apps/ecommerce/features.md) | Functional scope, six clue types, ordinary content and declarative data |
| [Shopoo app design](../../../project-knowledge-base/solution-context/apps/ecommerce/app-design.md) | Brand, home/profile, inbox/thread, notification and invoice structure |
| [Shopoo source wireframe](../../../project-knowledge-base/solution-context/apps/ecommerce/wireframe.md) | Existing screen sequence and search/invoice layouts |
| [Universal design](../../../project-knowledge-base/solution-context/design-system/design.md) | Shared reuse, no-spoiler interaction and narrative-only 380ms evidence hold |
| [Vision & scope](../vision-scope.md) and [decomposition](../functional-decomposition.md) | Existing epic placement and client-side boundary |

Universal project invariants supersede source examples showing direct notebook shortcuts, 450ms holds, emoji icons, or smaller inaccessible controls. Notification category mappings and unavailable schema-dependent controls are specified above as delivery behavior, rather than claims about current runtime code.
