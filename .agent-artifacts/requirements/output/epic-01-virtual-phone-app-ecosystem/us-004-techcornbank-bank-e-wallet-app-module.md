---
type: Requirement Story
epic: "Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)"
status: draft
description: "techcornbank banking module for inspecting balances, transactions, receipts, savings vaults, and case financial evidence."
tags: [requirement, user-story, banking, techcornbank, forensic-clues]
timestamp: "2026-10-15T21:20:19+07:00"
---

# US-004 - techcornbank Bank & E-Wallet App Module

### Epic: [Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)](./epic.md)

As a **Player**, I want to inspect bank transactions, transfer memos, receipts, allowance inflows, and savings vaults in techcornbank.

### Canonical Wireframe Reference

- [techcornbank ASCII Wireframe - Screen SSOT](./wireframes/wireframe-techcornbank-banking.md)
- Interactive HTML wireframe: pending explicit approval of the completed ASCII wireframe; no HTML artifact exists yet.

### Acceptance Criteria

#### AC01: App Entry, Naming, and Navigation

1. Tapping the banking app icon opens the banking module inside the existing virtual phone shell when that app is active for the current level. The app display name is exactly **techcornbank** in its launcher label, app header, and PIN target label.
2. The app uses the existing shell status bar, Dynamic Island, safe areas, AssistiveTouch, and home navigation. It does not mount a second shell or status bar.
3. The dashboard contains the account hero card, four-position quick-action bar, recent transaction feed, and bottom tabs **Trang chủ**, **Lịch sử**, **Hũ quỹ**, and **Tôi**, in that order.
4. **Lịch sử** opens the complete transaction list; **Hũ quỹ** and the **Hũ quỹ đen** shortcut open the same vault branch. **Tôi** displays existing account information without offering theme customization.
5. Back navigation returns to the parent view. Closing a receipt restores its originating list, selected filter, and scroll position.

#### AC02: Balance Privacy and Account Information

1. Opening the account dashboard initially displays the case-provided masked balance. The source example is `•••••••• đ`; the revealed example is `14.850.000 đ`.
2. Tapping **Hiện số dư** displays the case-provided actual balance and changes the control to **Ẩn số dư**. Tapping it again restores the masked balance. Neither action changes account data or transaction records.
3. The account number comes from the active case. The **Sao chép** action copies that displayed account number without altering it.
4. Any case-provided membership tier or card appearance is read-only. No tier selector, wallpaper selector, feng-shui selector, zodiac selector, or save-theme action is available.

#### AC03: Transaction History and Filtering

1. The recent feed and history display the current case's transaction records with counterparty, timestamp, signed amount, and memo snippet, ordered newest first. Individual micro-transfers remain separate records.
2. **Tất cả** displays all records; **Tiền vào (+)** displays only `inflow`; **Tiền ra (-)** displays only `outflow`. Changing a filter does not edit or remove case data.
3. Amounts retain their incoming/outgoing sign and supplied Vietnamese currency formatting. Direction is understandable from text and signs as well as the source inflow/outflow colors.
4. Tapping any transaction, including salary, utility, grocery, and other ordinary records, opens that transaction's receipt. Receipt access must not depend on the presence of a `clueRefId`.
5. An empty history displays **“Chưa có giao dịch.”** A selected filter with no results displays **“Không có giao dịch phù hợp.”** Navigation and filters remain available.

#### AC04: Complete Digital Receipt

1. The receipt drawer displays the selected transaction's amount and direction, counterparty name, bank, supplied counterparty account details, reference, timestamp, category, and complete **Lời nhắn**. Incoming receipts identify the sender; outgoing receipts identify the recipient.
2. Long memo content wraps and scrolls without truncation. The player can read the entire original memo, including the words needed for cross-app comparison.
3. Receipt values come from case data. A missing optional field displays `—`; the app must not invent a bank, beneficiary account, reference number, timestamp, or payment status. Source mockup values are examples, not fallback records.
4. Closing the drawer, tapping its backdrop, or using the shared drag-down dismissal returns to the previous list. Scrolling within a long receipt follows the shared drawer scroll guard.
5. The receipt contains no permanent **Ghim**, **Ghim manh mối**, or **Thêm vào Sổ Tay Bắt Ghen** button. Evidence collection follows AC07.

#### AC05: Savings Vaults and Deposit Histories

1. **Hũ quỹ** lists case-provided vault names, current amounts, and target amounts. Selecting a vault opens its complete deposit history with the supplied date, amount, and note for each deposit.
2. A configured anniversary vault such as **“Tiet Kiem Mua Nhan Kim Cuong Cho Vo”** remains inspectable without being labeled innocent or guilty in the banking interface.
3. The vault list displays **“Chưa có hũ tiết kiệm.”** when empty. A vault without deposits displays **“Chưa có lịch sử nộp tiền.”**
4. Vault inspection does not allow creating, renaming, funding, withdrawing from, or deleting a vault.

#### AC06: Configured PIN Protection

1. Level 1 banking inspection is unlocked. On Level 2/3, a configured banking-app or vault lock must be satisfied before the protected content is displayed or exposed through its evidence targets.
2. Locked entry reuses the shared four-digit PIN lockpad and the case's configured challenge. It does not hardcode a PIN or create a banking-specific validation or suspicion engine.
3. Correct PIN entry opens the originally requested protected destination. Incorrect entry uses the shared PIN error feedback, strike accounting, and lockout/failure rules; this story does not redefine their limits or messages.
4. The PIN clue is discoverable through the configured Notes or SMS content. The banking gate must not display the solution.
5. Leaving the gate without submitting a complete PIN returns to the prior accessible screen without recording an incorrect attempt.

#### AC07: Universal Evidence Inspection and Notebook Integration

1. Holding a case-loaded transaction memo, receipt narrative, vault record, or deposit record for **380 ms** opens the existing `UniversalEvidenceModal` through `StoryEvidenceTarget`.
2. Eligible ordinary records and red herrings use the same evidence interaction as clue-bearing records. The default interface shows no artificial clue badges, glowing outlines, or truth labels.
3. Headers, static account labels, navigation tabs, filter chips, quick-action buttons, and other app structure never open an evidence overlay on long-press.
4. A short tap on a transaction opens its receipt only. A completed long-press must not also trigger the row's short-tap navigation, and a canceled hold or scroll must not collect evidence.
5. Pinning is available inside the shared evidence overlay and uses the existing notebook flow. The pinned item retains the source record and case identity required for comparison; a normal receipt tap never automatically creates a suspect or pins evidence.

#### AC08: Documented Clue Coverage and Ordinary Records

1. Case content can represent `CLUE-BANK-01`: consecutive small transfers, including the documented `1.000 đ` examples, whose memos form an apology conversation.
2. `CLUE-BANK-02` can be inspected using the incoming filter, exposing the configured `10.000.000`–`20.000.000` VNĐ allowance records and their original memos.
3. Opening the configured `1.500.000 đ` restaurant/hotel debit exposes its receipt and memo for `CLUE-BANK-03`; the banking UI does not announce the contradiction with the claimed `35.000 đ` meal.
4. The configured vault and its deposits support `CLUE-BANK-04`, the innocent anniversary surprise. A transfer receipt preserves the full **“Campuchia tien an toi 50/50”** memo and counterparty for `CLUE-BANK-05`.
5. Salary, electricity, internet, and grocery records use the same list, receipt, and evidence behavior as suspicious records. Only records included in the active case are displayed; the module does not inject all five clue types into every level.

#### AC09: Quick Actions and Read-Only Scope

1. The four-position quick-action bar follows the case-provided configuration and order. The ASCII example uses **Chuyển tiền**, **Quét QR**, **Hũ quỹ đen**, and **Hóa đơn**, corresponding to the documented non-theme action types.
2. A legacy `theme` action must not expose an appearance editor. The active configuration supplies non-theme actions for the delivered bar; this story does not introduce a player shortcut-editing screen.
3. **Hũ quỹ đen** opens vault inspection. Transfer, QR, and bill-payment controls are unavailable in this inspection-only delivery because their transaction-creation workflows are not defined by the supplied features. They must not modify balances, request camera access, or send payments.
4. Missing banking case data displays **“Chưa có dữ liệu ngân hàng cho màn này.”** while preserving access to shell navigation. No made-up financial records are substituted.

### Out of Scope

| ID | Exclusion |
|---|---|
| OOS01 | Player theme, membership-tier, wallpaper, feng-shui, or zodiac customization. |
| OOS02 | Real financial integrations, transfer creation, camera QR scanning, bill payment, and editing financial records. |
| OOS03 | A new shortcut editor, notebook engine, PIN engine, or suspicion/lockout engine. |
| OOS04 | Repository-wide renaming of existing technical interfaces, app keys, or authoritative source documents; HTML before ASCII approval. |

### Non-functional Requirements

| Requirement | Acceptance Boundary |
|---|---|
| Platform alignment | Inherit the existing client-side architecture and navigation response target of under 100 ms; add no server, telemetry, or banking-network dependency. |
| Accessibility | Inherit universal text-size floors, contrast, safe areas, and 200% text scaling. Bank narrative records use the universal 16–17 px body baseline; metadata uses at least 13 px. Source mockup sizes do not override universal floors. |
| Touch ergonomics | Controls and tabs have at least 44 × 44 px hit areas; quick actions have at least 48 × 48 px targets; transaction rows retain the banking minimum height of 64 px and expand for scaled text. |
| Design reuse | Reuse the shared shell, drawer, evidence overlay, and lockpad contracts. Use the banking palette and geometry, scope brand tokens to the banking app, and use Ionicons without emoji UI chrome. |
| Language and data integrity | All user-facing copy is Vietnamese except proper names and supplied narrative text. Financial and evidence records remain attributable to the active case; inspection cannot mutate them. |

### Open Questions

No blocking scope questions remain. This story stays `draft` pending ASCII review and the subsequent visual-delivery gate. Receipt metadata mapping is an implementation dependency recorded in the signed-off session; absent source fields must never be fabricated.

### Citations

| Source | Coverage |
|---|---|
| [Signed-off US-004 elicitation](../elicitation/2026-10-15-us-004-techcornbank.md) | User scope answers, file-plan approval, and exact app name correction |
| [Banking features](../../../project-knowledge-base/solution-context/apps/banking/features.md) | Account, transactions, receipts, vaults, locks, quick-action configuration, clues, and sample data |
| [Banking app design](../../../project-knowledge-base/solution-context/apps/banking/app-design.md) | Source banking layout, brand palette, card, rows, bottom navigation, and receipt drawer |
| [Universal design](../../../project-knowledge-base/solution-context/design-system/design.md) | Shared-component reuse, no-spoiler rule, Ionicons, 380 ms narrative-only long-press, and prohibition of visible pin buttons |
| [Accessibility and layout](../../../project-knowledge-base/solution-context/design-system/accessibility-layout.md) | Universal typography, scaling, touch targets, and contrast |
| [Shared navigation and motion](../../../project-knowledge-base/solution-context/design-system/behaviors-motion.md) | Back navigation, sheet dismissal, scrolling guard, and disabled controls |
| [Shared PIN lockpad](../../../project-knowledge-base/solution-context/apps/phone-os/pin-lockpad.md) | PIN entry, feedback, and shared lockout integration |
| [Existing decomposition](../functional-decomposition.md) and [Vision & scope](../vision-scope.md) | Existing US-004 slice, level provisioning, and client-side platform boundary |

The source documents use the older name **VietPay**. The approved US-004 display name is **techcornbank**. The user's customization exclusion and universal evidence rules take precedence over conflicting source examples; the originals remain unchanged.
