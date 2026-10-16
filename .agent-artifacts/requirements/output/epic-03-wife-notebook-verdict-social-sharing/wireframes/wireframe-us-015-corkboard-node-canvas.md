# Sổ Tay Bắt Ghen — Bảng Điều Tra Nối Dây (Detective Corkboard Node Canvas) ASCII Wireframe

**App ID**: `wife_notebook`  
**Parent Epic**: [`epic-03-wife-notebook-verdict-social-sharing`](../epic.md)  
**Related User Story**: [`us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md`](../us-015-wife-split-section-investigation-notebook-suspect-evidence-linkage-hub.md)  
**Parent Specification**: [wife-notebook/app-design.md](../../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/app-design.md)  
**Functional Features**: [wife-notebook/features.md](../../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/features.md)  
**Viewport Target**: Mobile Portrait Viewport (393px × 852px base container)  
**Interaction Paradigm**: 2A Mobile-Optimized Detective Corkboard (Tap-to-Connect Red-String Graph Canvas)  
**Design Standard**: Strict Zero-Emoji Invariant, Canonical Ionicons (`react-icons/io5`), Parchment Corkboard Texture, High-Contrast Node Cards  

---

## 1. Physical Container & Top Navigation Header

```
┌────────────────────────────────────────────────────────────────────────┐
│ 23:45 [App: SoTay]                         [Signal: 5G] [||||] [Batt: 42%] │
├────────────────────────────────────────────────────────────────────────┤
│ [Back] Quay lại     BẢNG ĐIỀU TRA NỐI DÂY               [Radar: MiniMap]│
├────────────────────────────────────────────────────────────────────────┤
│ [Tab: BangNoiDay (Active)]           [Tab: PhanQuyet (DoiChat)]        │
│ ══════════════════════════           ──────────────────────────        │
```

- **Top Bar Surface**: Fuchsia Rose Header (`#D81B60`) with white text and status indicators.
- **[Back] Button**: Closes the Notebook and returns to the active virtual app or OS home screen.
- **[Radar: MiniMap]**: Compact floating radar indicator (44px × 44px) showing the player's current viewport relative to the overall 2D canvas boundary (1200px × 1200px virtual canvas).
- **Segmented Tabs**:
  - `[Tab: BangNoiDay]`: Interactive 2D Node Canvas.
  - `[Tab: PhanQuyet]`: Final Verdict Confrontation & Accusation Hub.

---

## 2. Screen 1: Canvas Viewport & Node Canvas Layout

> **Mobile Viewport Invariant**: To prevent gesture collision with OS back navigation (`useSwipeBack`), horizontal/vertical panning is constrained to single-finger drag when touching empty corkboard canvas, or two-finger pinch to zoom (0.75x to 1.5x).

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ┌──────────────────────┐              ┌──────────────────────┐       │
│   │ [Mask] VO BOC        │              │ [Phone] SĐT CHUNG    │       │
│   │ "Anh Tuấn Thợ Điện"  │═════(Dây Đỏ)═╡ 0988456234           │       │
│   │ [Zola] 23:44 Tra ao  │              │ [Phone] [Shopoo]     │       │
│   └──────────────────────┘              └──────────┬───────────┘       │
│                                                    │                   │
│                                                (Dây Đỏ)                │
│                                                    │                   │
│   ┌──────────────────────┐              ┌──────────▼───────────┐       │
│   │ [Clock] 20:46 Zola   │              │ [Cart] DON HANG      │       │
│   │ "Chồng: Vẫn đang họp"│              │ Váy be S + Thiệp     │       │
│   └──────────┬───────────┘              │ "Nguyen Thi Thu Huong"       │
│              │                          └──────────┬───────────┘       │
│         (Tia Set Mau Thuan)                        │                   │
│              │                                 (Dây Đỏ)                │
│   ┌──────────▼───────────┐                         │                   │
│   │ [Bank] 20:48 Bank    │              ┌──────────▼───────────┐       │
│   │ Com Nieu Pho Co 640k │              │ [Target] THU PHAM    │       │
│   │ (Lech loi khai!)     │              │ Nguyễn Thị Thu Hương │       │
│   └──────────────────────┘              │ Marketing            │       │
│                                         └──────────────────────┘       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [Zoom: -] [100%] [Zoom: +]     [Auto-Arrange]    [Reset-View: Center]  │
├────────────────────────────────────────────────────────────────────────┤
│ [Drawer-Handle: ^] KHAY MANH MỐI MỚI (3 thẻ chưa kéo vào bảng)         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Card: SMS 1900]   [Card: Grap 18:30]   [Card: GhiChu MatKhau]     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Screen 2: Tap-to-Connect Pairing Mode (Mobile One-Handed Interaction)

> **Tap-to-Connect Invariant**: Mobile screens make dragging cables between small pins imprecise. Players tap Node A to select it, then tap Node B to create an edge.

```
┌────────────────────────────────────────────────────────────────────────┐
│ 23:45 [App: SoTay]                         [Signal: 5G] [||||] [Batt: 42%] │
├────────────────────────────────────────────────────────────────────────┤
│ [Cancel-Link: X]  ĐANG NỐI DÂY: Chọn thẻ thứ hai để kết nối...         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌──────────────────────────────────┐                                 │
│   │ [Active-Node: Highlight-Pulsing] │                                 │
│   │ [Mask] "Anh Tuấn Thợ Điện"       │                                 │
│   │ Trạng thái: ĐANG CHỌN ĐẦU DÂY    │                                 │
│   └─────────────────┬────────────────┘                                 │
│                     ┆ (Đường nét đứt dẫn hướng theo ngón tay)          │
│                     ▼                                                  │
│   ┌──────────────────────────────────┐                                 │
│   │ [Target-Candidate: Glow-Green]   │                                 │
│   │ [Phone] SĐT: 0988456234          │ <── Nhấn vào đây để CHỐT NỐI    │
│   │ Chạm để hoàn tất nối dây đỏ      │                                 │
│   └──────────────────────────────────┘                                 │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ GỢI Ý NỐI DÂY:                                                         │
│ • Nối Vỏ bọc với SĐT / Tên tài khoản để bóc trần chân tướng.          │
│ • Nối 2 mốc thời gian lệch nhau để tạo bằng chứng Mâu thuẫn lời khai.  │
├────────────────────────────────────────────────────────────────────────┤
│ [Button: HuyNoiDay] Huỷ thao tác               [Button: CatDay] Cắt dây│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Screen 3: Identity Unmasking & Cluster Snap (Zero-Spoiler Resolution)

> **Zero-Spoiler Progression**: When a mystery alias card connects via a bridge identifier to a suspect's legal identity, the cards trigger a celebratory snap animation and merge into an unmasked suspect card.

```
┌────────────────────────────────────────────────────────────────────────┐
│ 23:45 [App: SoTay]                         [Signal: 5G] [||||] [Batt: 42%] │
├────────────────────────────────────────────────────────────────────────┤
│ [Back] Quay lại     BẢNG ĐIỀU TRA NỐI DÂY               [Radar: MiniMap]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │ [Check-Circle] ĐÃ BÓC TRẦN DANH TÍNH TIỂU TAM!               │     │
│   │ ════════════════════════════════════════════════════════════ │     │
│   │ [Target] NGUYỄN THỊ THU HƯƠNG (Marketing Technosoft)         │     │
│   │                                                              │     │
│   │ • Vỏ bọc Zola: "Anh Tuấn Thợ Điện"                           │     │
│   │ • Số điện thoại trùng khớp: 0988456234 (Danh bạ & Đơn Shopee)│     │
│   │ • Tên nhận hàng & Tài khoản: Nguyen Thi Thu Huong            │     │
│   │                                                              │     │
│   │ [Trạng thái: 🔗 Đã nối 3 mắt xích chứng cứ hoàn chỉnh]       │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │ [Warning] MÂU THUẪN NGOẠI PHẠM ĐÃ XÁC LẬP                    │     │
│   │ • 20:46 Zola: "Vẫn đang họp công ty"                         │     │
│   │ • 20:48 Bank: Thanh toán Cơm Niêu Phố Cổ 640.000đ            │     │
│   │ ──> Chứng cứ nói dối vợ không thể chối cãi!                  │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ TIẾN ĐỘ ĐIỀU TRA: [||||||||||||||||||||] 3/3 Bằng chứng cốt lõi        │
├────────────────────────────────────────────────────────────────────────┤
│ [Button: ChuyenSangPhanQuyet] SẴN SÀNG ĐỐI CHẤT VỚI CHỒNG! [Arrow-Right]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Screen 4: "Khay Manh Mối Chưa Phân Loại" (Bottom Drawer Sheet)

> **Ergonomics**: Newly pinned items from long-pressing app elements land in this bottom sheet so they don't clutter the 2D canvas until the player intentionally places them.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ══════ [Drag-Handle] ══════                     │
│ KHAY MANH MỐI THU THẬP (3 thẻ sẵn sàng đưa lên bảng)            [Close]│
├────────────────────────────────────────────────────────────────────────┤
│ [Filter: Tất cả]     [Filter: Tin nhắn]   [Filter: Hoá đơn]   [Filter: SĐT] │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Cart] Váy lụa Satin Size S (Đơn Shopee #SPX-8821)                 │ │
│ │ Chi tiết: Người nhận "Nguyen Thi Thu Huong" - SĐT 0988456234        │ │
│ │ [Button: DuaLenBang] Đưa lên bảng điều tra                         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Bank] Hoàn tiền ăn trưa 160.000đ                                  │ │
│ │ Chi tiết: Tài khoản chuyển: Nguyen Thi Thu Huong                   │ │
│ │ [Button: DuaLenBang] Đưa lên bảng điều tra                         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [Call] Cuộc gọi đêm 23:30 (96 giây)                                │ │
│ │ Chi tiết: Gọi đến "Anh Tuấn Thợ Điện" (0988456234)                 │ │
│ │ [Button: DuaLenBang] Đưa lên bảng điều tra                         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Canonical Icon Mapping (`react-icons/io5`)

| Wireframe Token | Canonical Ionicons Component | Purpose |
|---|---|---|
| `[Back]` | `IoChevronBack` | Close notebook and return to virtual app/launcher |
| `[Radar: MiniMap]` | `IoScanOutline` | Visual viewport radar & canvas overview |
| `[Mask]` | `IoGlassesOutline` | Disguised contact alias node |
| `[Phone]` | `IoCallOutline` | Phone number identifier bridge node |
| `[Cart]` | `IoBagHandleOutline` | E-commerce order / parcel record node |
| `[Bank]` | `IoCardOutline` | Bank transaction / payment record node |
| `[Clock]` | `IoTimeOutline` | Timestamp & alibi node |
| `[Target]` | `IoPersonOutline` / `IoFlameOutline` | Suspect / Culprit profile node |
| `[Check-Circle]` | `IoCheckmarkCircle` | Solved link / verified identity badge |
| `[Warning]` | `IoAlertCircle` / `IoFlashOutline` | Alibi contradiction lightning edge |
| `[Zoom: +]` / `[Zoom: -]` | `IoAddOutline` / `IoRemoveOutline` | Canvas zoom controls |
| `[Auto-Arrange]` | `IoGridOutline` | Snap nodes into tidy semantic columns |
| `[Reset-View: Center]` | `IoLocateOutline` | Re-center canvas on active cluster |
| `[Cancel-Link: X]` | `IoCloseOutline` | Cancel tap-to-connect pairing mode |
| `[CatDay]` | `IoCutOutline` | Cut / remove existing connection line |
| `[Arrow-Right]` | `IoArrowForward` | Proceed to Verdict & Confrontation tab |

