---
type: App Features Specification
app_id: photos
app_name: Photos
status: approved
description: "Comprehensive functional features, clue integrations, mundane clutter, and declarative schemas for Photos."
tags: [app-features, photos, clues, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/photos/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Photos — Functional Features & Clue Integration Specification

---

## 1. Functional Overview

Photos houses visual evidence and forensic details. The player analyzes reflections on glassware to discover hidden dining companions, inspects car passenger seats for female accessories, and unlocks protected hidden albums.

---

## 2. In-App Features & User Interactions

### 2.1. Media Grid & Albums
* Multi-column thumbnail grid grouped chronologically.
* Album tabs: *Tất cả ảnh*, *Album*, *Đã ẩn* (Hidden).

### 2.2. Interactive Forensic Lightbox
* Double-tap or tap *"Bật kính lúp"* to magnify reflective surfaces or background details.
* Swipe-up info drawer reveals capture time, camera EXIF, and geotag location.

### 2.3. Locked Hidden Folder Sub-system
* Protected by a 4-digit numeric PIN pad. PIN is hidden in Notes (`CLUE-NOTE-01`) or Calendar.

---

## 3. Clue Mapping & Interactive Evidence

| Clue ID | Feature Component | User Action & Forensic Reveal | Truth Twist | Difficulty |
|---|---|---|---|---|
| `CLUE-PHOT-01` | `LockedAlbumGateModal` • Hidden Folder | Enter 4-digit PIN -> Unlocks selfies and screenshots with lover. | Cheating | Medium |
| `CLUE-PHOT-02` | `PhotoLightboxView` • Reflection Magnifier | Zoom into wine glass -> Reveals woman's manicured hand and silhouette. | Cheating | Hard |
| `CLUE-PHOT-03` | `PhotoLightboxView` • Car Dashboard | View dashboard photo -> Unfamiliar designer female handbag sitting on passenger seat. | Cheating | Medium |
| `CLUE-PHOT-04` | `PhotoLightboxView` • Anniversary Photo | Unlock hidden folder -> Photo with sister holding anniversary gift box. | Innocent (Anniversary) | Hard |

---

## 4. Benign Mundane Clutter (Filler Content)

* **Photo 1**: Cat sleeping on a Honda motorcycle seat.
* **Photo 2**: Motorcycle parking ticket stub at a shopping mall.
* **Photo 3**: Company group photo at a team-building retreat.
* **Photo 4**: Plate of Vietnamese broken rice (*cơm tấm*).

---

## 5. Declarative Data Contract

```typescript
export interface PhotosData {
  hiddenAlbumLocked: boolean;
  lockChallengeId?: string;
  photos: Array<{
    photoId: string;
    thumbnailUrl: string;
    highResUrl: string;
    caption?: string;
    timestamp: string;
    locationTag?: string;
    isHiddenAlbum: boolean;
    hasForensicHotspot?: boolean;
    hotspotCoordinates?: { x: number; y: number; zoomLevel: number };
    hotspotClueDescription?: string;
    clueRefId?: string;
  }>;
}
```
