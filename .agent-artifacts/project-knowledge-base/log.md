# Project Knowledge Base Update Log

## 2026-10-15

* **UPDATE & CODIFY**: [solution-context/design-system/design.md] - Codified Universal Semantic Colors & Token Ownership Delegation:
  - Added Section 8.1 defining universal semantic color tokens (`--sys-canvas`, `--sys-surface`, `--sys-text-*`, `--sys-divider`, `--sys-accent`, `--sys-badge-red`, `--sys-clue-amber`, `--sys-success-green`) shared across all virtual parody apps and the phone shell.
  - Formalized strict 3-tier color ownership delegation: Universal rules in `design.md`, physical hardware shell & launcher tokens in `phone-os/shell/app-design.md`, and parody brand palettes in dedicated `apps/<app_id>/app-design.md`.
  - Generalized Section 4.3 height breakpoints and updated Section 9.2 progressive discovery registry to all 12 parody apps plus Phone OS Shell and Wife's Notebook HUD.

* **UPDATE**: [solution-context/design-system/design.md] - Modernized Section 3.1 (Typography Scale & Font Size Boundaries) to 2027 mobile best practices:
  - Transitioned authoritative baseline tokens to `rem` units with explanatory `px` equivalents.
  - Reclassified $34\text{px}$ (`2.125rem`) as Base Scale Ceiling ($100\%$ default) to guarantee unobstructed WCAG 1.4.4 dynamic accessibility scaling up to $200\%$.
  - Documented explicit $10\text{px}$ (`0.625rem`) bold all-caps exception for dialer keypad mnemonic subtext.
  - Added governing principles for REM token authority and optical letter-spacing (negative tracking on display headers, positive tracking on micro-captions).

* **REFACTOR**: [solution-context/design-system/design.md] - Refactored Section 2 (Atomic Design) from an exhaustive concrete component/wireframe catalog into high-level architectural principles:
  - Replaced detailed enumeration of concrete atoms, molecules, organisms, ASCII template wireframes, and pages with governance principles (unidirectional token derivation, single-responsibility composition, subsystem encapsulation, content-agnostic scaffolding, declarative hydration, and reuse-first component governance).
  - Preserved concrete component specifications within their modular companion documents (`phone-os/*.md`, `apps/<app_id>/app-design.md`).

## 2026-10-14

* **RESTRUCTURE & UPDATE**: [solution-context/apps/phone-os/] - Modernized Phone OS design architecture to iOS 26/27 standards and resolved structural overlap:
  - `phone-os/shell/app-design.md`: Created dedicated UI/UX specification for the physical phone chassis, Neural Dynamic Island, 12-app SpringBoard launcher grid, and persistent zero-label frosted dock with iOS 26/27 tinted icon tokens.
  - `phone-os/app-design.md`: Rebalanced into the Master OS System & Design Token Umbrella, delegating launcher/shell wireframes to `shell/app-design.md` and updating progressive discovery mappings.
  - `phone-os/shell/features.md`: Updated to 12-App Grid Invariant and synchronized `PhoneOSState` schema.
  - `phone-os/home-launcher.md`: Synchronized SpringBoard ASCII layout with the 12-app grid.
  - `phone-os/photos/app-design.md`: Upgraded from legacy 3-tab bar to iOS 26/27 unified single-scroll photostream, smart suspect collections, and forensic lightbox with AI Clean Up / Spatial Reframing lens.
  - `phone-os/phone/` & `phone-os/messages/`: Decoupled legacy `comms` into two standalone apps matching iOS 26/27 standards:
    - `phone/`: Dialer, Recents call log (without voice transcripts), Contacts directory, and secret memo inspector.
    - `messages/`: SMS threads, parody Tapbacks, dynamic text effects, and brand hotel booking confirmations.
  - `phone-os/comms/`: Completely purged; refactored all active references (`CLUE-COMM-01/03` -> `CLUE-PHONE-01/02`, `CLUE-COMM-02` -> `CLUE-MSG-01`, and `comms` -> `phone` / `messages`) across `hoang/level-01.md`, `clue-traceability-matrix.md`, `clue-ideas-inventory.md`, and `functional-decomposition.md`.
  - Architecture & Design System: Updated `apps-features-architecture.md` and `design.md` registries.

* **UPDATE & CREATE**: [solution-context/apps/ecommerce/] - Re-anchored and streamlined Poshee e-commerce application design to authentic Shopee captures with strict parody game optimization:
  - `app-design.md`: Upgraded to comprehensive design specification mirroring core e-commerce architecture while pruning non-detective bloat: streamlined 3-tab bottom navigation (`Home`, `Thông báo`, `Tôi`), pruned peripheral modules (`Deals`, `Mall`, `Live/Video streams`, `Dịch vụ tài chính`), retained order lifecycle pipeline (`Chờ xác nhận`, `Chờ lấy hàng`, `Chờ giao hàng`, `Đánh giá`), in-app seller chat with embedded product cards, and multi-channel logistics notifications.
  - `wireframe.md`: Authored complete, pixel-accurate ASCII wireframe specification covering 7 screens (`PosheeHomeView`, `PosheeProfileView`, `PosheeNotificationView`, `PosheeChatListView`, `PosheeChatDetailView`, `PosheeOrderDetailDrawer`, `PosheeSearchOverlay`) adhering strictly to the Zero-Emoji Invariant, mobile portrait viewport ($393\text{px} \times 852\text{px}$), and complete fictionalization/anonymization of all user accounts (`hoang_minh92`), stores (`DudeBasic`, `ToyWorld`), and products.
  - `features.md`: Expanded clue taxonomy with `CLUE-POSH-05` (Seller Chat discrete packaging / sizing concealment) and `CLUE-POSH-06` (Logistics tracking schedule contradiction), and pruned live/video attributes from declarative `PosheeData` contract.


* **CREATE**: [solution-context/design-system/design.md] - Created canonical Universal Design System & UI/UX Standards SSOT:
  - Atomic design principles (atoms, molecules, organisms, templates, pages) for emulated mobile OS and detective game HUD.
  - WCAG 2.1 AA/AAA accessibility baselines ($11\text{px}$ absolute minimum to $34\text{px}$ maximum, dynamic type scaling to 200%, $\ge 44\text{px} \times 44\text{px}$ hit-box ergonomics, contrast ratios, and `prefers-reduced-motion` fallbacks).
  - $8\text{px}$ base layout grid, universal $16\text{px}$ screen gutters, hardware safe area insets ($44\text{px}$ top, $34\text{px}$ bottom), and desktop/mobile viewport clamping.
  - Common systemic behaviors (edge swipe-back gesture, bottom sheet drag-to-dismiss, toast descent/retract, active press state damping, overscroll suppression).
  - Motion & feedback physics (iOS cubic-bezier curves, PIN error oscillation keyframes, simulated audio-haptic cues).
  - Universal evidence interaction UX ("Ghim Bằng Chứng" anti-spoiler invariant, clue inspect zoom modals, suspect tagging).
  - Core design tokens & 3-tier frosted glass hierarchy (`.glass-subtle`, `.glass-elevated`, `.glass-toast-light`).
  - Strict Parody App Token Isolation contract and DRY/SSOT progressive discovery navigation map to canonical `apps/<app_id>/app-design.md` specifications (eliminating token duplication).
  - Legal & parody trade dress boundaries (no Apple SF Symbols or hosted San Francisco fonts, satirical brand deviations).
* **UPDATE**: [solution-context/apps/phone-os/app-design.md] - Cross-referenced new Universal Design System SSOT as overarching parent standard.
  - `typography.md`: Apple HIG 12-tier dynamic type scale, Inter cross-platform font stack, and tabular numerals.
  - `bezel-shell.md`: Desktop titanium chassis frame, Dynamic Island pill cutout geometry, and responsive viewport rules.
  - `status-bar.md`: 3-zone layout, zero-carrier invariant, and capsule battery geometry.
  - `home-launcher.md`: SpringBoard grid, $2 \times 2$ detective smart stack widget, continuous squircles, and 4-app zero-label dock.
  - `pin-lockpad.md`: Authentic iOS passcode screen with dual-tier numeric dialer typography (digits + uppercase alphabet subtext) and error shake physics.
* **UPDATE**: [solution-context/apps/phone-os/app-design.md] - Converted monolithic master design into a high-level progressive discovery hub linking to the dedicated subsystem specifications.

## 2026-10-13

* **DELETE**: [indexes] - Removed redundant directory index files (`index.md`) and automated index synchronization across project-knowledge-base and requirements to eliminate agent CRUD overhead.

* **UPDATE**: [solution-context/apps/phone-os/wife-notebook] - Relocated wife-notebook into phone-os to inherit and reuse master Phone OS design system.

* **UPDATE**: [solution-context/apps] - Expanded virtual app suite from 8 to 11 apps (added GeeMail, InkedLin, Tim), migrated app folders to generic taxonomy, and updated SAD and requirement baselines.

## 2026-07-14

* **Update**: Added placeholder wiki knowledge areas and diagram folders so durable wiki pages can be grouped by project topic, with shared diagrams at `wiki/diagrams/` and area-specific diagrams under each knowledge area.

## 2026-07-09

* **Update**: Removed `references/` and `_templates/` from the project knowledge base; source evidence now belongs in `requirements/input/`, and the root `index.md` carries the compact project snapshot.
* **Update**: Clarified that `requirements/` is the delivery workbench and `wiki/` is the durable project wiki store.
* **Update**: Added explicit maintenance rules for initiative folders, epic folders, user story files, and hierarchy indexes.
* **Update**: Collapsed initiative and epic descriptions into their folder `index.md` files to avoid duplicate hierarchy pages.
* **Update**: Changed requirement output hierarchy to nested initiative folders with initiative `index.md`, nested epic folders with epic `index.md`, and user story Markdown files inside each epic folder.
* **Update**: Changed generated requirement hierarchy to `requirements/output/<epic-slug>/`; removed initiatives and epics wrappers. Moved sprint-scope under `.agent-artifacts/sprint-scope/`.
* **Update**: Added `requirements/input/` for new client requirement material and `requirements/output/` for generated BA deliverables.
* **Update**: Collapsed project governance and solution folders into `wiki/` and `solution-context/` so requirement research starts from fewer BA-relevant entry points.
* **Update**: Added requirement hierarchy guidance and controlled requirement tags.
* **Update**: Tailored the starter structure for outsourced software delivery with stakeholder, scope, delivery, and risk areas.
* **Initialization**: Created a generic OKF-style project knowledge-base structure and starter guide.
