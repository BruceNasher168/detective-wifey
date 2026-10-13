---
type: App Features Specification
app_id: netsurf
app_name: NetSurf
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for NetSurf."
tags: [app-features, netsurf, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/netsurf/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# NetSurf — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

NetSurf reveals digital intent and research footprints. It uncovers guilt through search queries on how to hide tracking, open incognito hotel reservation tabs, sugar dating guide threads, and waifu girlfriend inquiries.

---

## 2. In-App Features & User Interactions

### 2.1. Chronological History Log
* Groups visited pages and search engine queries by date (*Hôm nay, Hôm qua*).
* Highlights queries with a search icon and visited sites with a domain icon.

### 2.2. Incognito Tab Switcher
* Allows switching between standard open tabs and dark-themed incognito tabs.
* Exposes active private tabs the husband forgot to close.

### 2.3. Simulated Mock Web Reader
* Tapping a forum or news link renders a simulated web article / forum thread reader view.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-BROW-01` | `NetSurfHistoryView` • Search Queries | Review history -> Late-night queries: *"cách tắt định vị iphone mà vợ không biết"*, *"xoá lịch sử zalo có khôi phục được không"*. | Cheating | Easy |
| `CLUE-BROW-02` | `NetSurfTabSwitcherView` • Incognito Tab | Open incognito tabs -> Open booking confirmation page at *"Khách sạn tình yêu Phố Cổ"*. | Cheating or Innocent | Medium |
| `CLUE-BROW-03` | `NetSurfMockPageView` • Sugar Dating Forum | Open forum link -> Article: *"Kinh nghiệm chu cấp cho sinh viên đại học từ A-Z"*. | Sugar Relationship | Medium |
| `CLUE-BROW-04` | `NetSurfHistoryView` • Waifu Search | Review history -> Queries: *"cách tỏ tình với nhân vật anime"*, *"top game bạn gái ảo hay nhất 2026"*. | Cheating (Non-Human) | Easy |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Premier League News**: *"Lịch thi đấu và kết quả bóng đá Ngoại Hạng Anh"*.
* **Gold Prices**: *"Giá vàng hôm nay 13/10: Vàng miếng SJC chạm mốc kỷ lục"*.
* **Weather Forecast**: *"Thời tiết Hà Nội cuối tuần có mưa rét không"*.

---

## 5. Declarative Data Contract

```typescript
export interface NetSurfData {
  searchHistory: Array<{
    historyId: string;
    timestamp: string;
    queryOrTitle: string;
    url: string;
    isSearchQuery: boolean;
    clueRefId?: string;
  }>;
  openTabs: Array<{
    tabId: string;
    isIncognito: boolean;
    title: string;
    url: string;
    mockContentPreview?: string;
    clueRefId?: string;
  }>;
}
```
