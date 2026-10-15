---
type: App Features Specification
app_id: wife_notebook
app_name: Wife's Detective Notebook & Final Decision Hub
vietnamese_name: Sổ Tay Bắt Ghen Của Vợ
status: approved
description: "Comprehensive functional features, zero-spoiler long-press pinning, split-section dossier (suspects & evidence locker), suspect-evidence linkage, and final verdict accusation hub for the Wife's Detective Notebook."
tags: [app-features, wife-notebook, suspect-board, evidence-locker, verdict-hub, schema, functional-spec]
timestamp: "2026-10-14T13:00:00+07:00"
---

# Sổ Tay Bắt Ghen Của Vợ — Functional Features Specification

---

## 1. Functional Overview

*Sổ Tay Bắt Ghen Của Vợ* is the player's personal detective dossier and command center. It floats omnipresently on the phone shell, allowing the wife to track suspicious individuals and pin forensic evidence encountered across all parody apps without any UI spoilers. The notebook provides a split-section dossier where wifey links incriminating evidence directly to suspect profiles, culminating in the final confrontation and verdict accusation hub.

---

## 2. In-App Features & User Interactions

### 2.1. Omnipresent Floating Button (FAB)
* Prominent spiral-notebook icon with a dynamic badge displaying total items logged (suspects + unlinked evidence count). Tapping opens the slide-up dossier sheet.

### 2.2. Zero-Spoiler Universal Long-Press Pinning
* **No UI Visual Cues**: Parody apps contain zero spoiler giveaways (no glowing borders, no clue icons, no warning boxes, no static "+ Ghim" buttons).
* **Long-Press Gesture ($\ge 450\text{ms}$)**: Pressing and holding on any interactive element (names, chat bubbles, order rows, transaction notes, search chips, photos) triggers a subtle haptic pulse (`navigator.vibrate(20)`) and displays the contextual choice action sheet (`LongPressPinActionSheet`).
* **Contextual Choice Action Sheet**:
  - Displays a preview snippet of the long-pressed element.
  - Option 1: `[ 👥 Ghim Đối Tượng Tình Nghi ]` — Adds the person/contact to the Suspects Board.
  - Option 2: `[ 🔍 Ghim Manh Mối Bằng Chứng ]` — Adds the content/invoice/message to the Evidence Locker.
  - Option 3: `[ ✕ Huỷ ]` — Closes popup without saving.
* **Universal Pinning & Decoys**: Any interactive element (true clue or innocent decoy) can be pinned. The system never warns or rejects decoys during investigation to preserve mystery.

### 2.3. Investigation Dossier (`[ 📋 Hồ sơ điều tra ]` Tab)
* **Section 1 — Suspects Board (Danh sách Đối tượng tình nghi)**:
  - Displays logged suspect cards with avatar, display name, source app badge, custom notes, and linked evidence items.
  - **Manual Unpin / Delete**: `[ 🗑️ Xoá ]` button to remove false suspects.
  - **Evidence Linkage Slot**: `[ + Gắn bằng chứng từ kho ]` button opening a picker modal to link pinned evidence items directly to this suspect.
* **Section 2 — Evidence Locker (Kho Manh mối & Bằng chứng)**:
  - Displays all pinned evidence cards with source app tag, preview text, and timestamp.
  - **Link Status**: Indicates whether each card is `⚪ Chưa liên kết đối tượng` or `🔗 Đã gán cho [Tên nghi phạm]`.
  - **Manual Unpin / Delete**: `[ 🗑️ Xoá ]` button to remove unneeded or decoy evidence cards.

### 2.4. Final Verdict Decision Hub (`[ ⚖️ Phán quyết & Đối chất ]` Tab)
* **Step 1 — Verdict Category**: Player selects one of 3 verdicts:
  1. 🟢 **Chồng Ngoan / Vô Tội** (*Innocent / Wrongfully Accused*)
  2. 🔴 **Ngoại Tình / Gian Díu** (*Cheating / Extramarital Affair*)
  3. 🟣 **Nuôi Sugar Baby / Sugar Mommy** (*Financial Sugar Relationship*)
* **Step 2 — Culprit Designation**: Dropdown populated directly from the **Suspects Board**.
* **Step 3 — Submit Action ("BẮT GHEN!")**:
  * Evaluates against `caseConfig.groundTruth`.
  * Verifies whether the designated culprit is linked to the required smoking-gun evidence cards.
  * Computes 1–3 star rating based on completion speed, strikes incurred, and evidence completeness.
  * Triggers comedic roast narrative (including over-jealous ending for innocent husbands).
  * Launches the vertical 9:16 shareable roast card generator.

---

## 3. Declarative State Contract

```typescript
export interface PinnedEvidenceItem {
  evidenceId: string;
  sourceAppId: string;
  title: string;
  snippetPreview: string;
  fullDetails?: string;
  timestamp: string;
  linkedSuspectId?: string; // ID of linked suspect, or undefined if unlinked
  isSmokingGun: boolean;    // Evaluated only by game engine, never shown to user
}

export interface TaggedSuspectItem {
  suspectId: string;
  displayName: string;
  avatarUrl?: string;
  sourceAppId: string;
  notesText?: string;
  linkedEvidenceIds: string[]; // List of evidence IDs attached to this suspect
  addedTimestamp: string;
}

export interface WifeNotebookState {
  isOpen: boolean;
  activeTab: 'dossier' | 'verdict';
  suspects: TaggedSuspectItem[];
  evidence: PinnedEvidenceItem[];
  selectedVerdict?: 'innocent' | 'cheating' | 'sugar_relationship';
  accusedSuspectId?: string;
}
```
