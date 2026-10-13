---
type: App Features Specification
app_id: wife_notebook
app_name: Wife's Detective Notebook & Final Decision Hub
vietnamese_name: Sổ Tay Bắt Ghen Của Vợ
status: approved
description: "Comprehensive functional features, suspect management, and final verdict accusation hub for the Wife's Detective Notebook."
tags: [app-features, wife-notebook, suspect-board, verdict-hub, schema, functional-spec]
timestamp: "2026-10-13T14:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/wife-notebook/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/app-design.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-ideas-inventory.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Sổ Tay Bắt Ghen Của Vợ — Functional Features Specification

---

## 1. Functional Overview

*Sổ Tay Bắt Ghen Của Vợ* is the player's personal detective dossier and command center. It floats omnipresently on the phone shell, allowing the wife to track suspicious individuals encountered across all 11 apps and serve as the final screen where she selects the verdict and culprit to conclude the case.

---

## 2. In-App Features & User Interactions

### 2.1. Omnipresent Floating Button (FAB)
* Prominent spiral-notebook icon with a badge displaying the number of suspects currently logged. Tapping opens the slide-up dossier sheet.

### 2.2. Suspect Dossier Management
* **Auto & Manual Tagging**: Suspects can be added manually or by tapping shortcut buttons in apps *(e.g. "Thêm Bé Mèo vào sổ tay")*.
* **Suspect Cards**: Displays avatar, display name, source app badge (*VietPay, LoZa, Grap, v.v.*), and custom player notes.
* **CRUD+L Lifecycle**: Supports adding, editing notes, viewing, and removing suspects.

### 2.3. Final Verdict Decision Hub (Trang Phán Quyết)
* **Step 1 — Verdict Category**: Player selects one of 3 verdicts:
  1. 🟢 **Chồng Ngoan / Vô Tội** (*Innocent / Wrongfully Accused*)
  2. 🔴 **Ngoại Tình / Gian Díu** (*Cheating / Extramarital Affair*)
  3. 🟣 **Nuôi Sugar Baby / Sugar Mommy** (*Financial Sugar Relationship*)
* **Step 2 — Culprit Designation**: Dropdown populated directly from the **Suspect Dossier** (supports human or non-human entities like AI Bots).
* **Step 3 — Submit Action ("BẮT GHEN!")**:
  * Evaluates against `caseConfig.groundTruth`.
  * Computes 1–3 star rating based on completion speed and strikes incurred.
  * Triggers comedic roast narrative (including over-jealous ending for innocent husbands).
  * Launches the vertical 9:16 shareable roast card generator.

---

## 3. Declarative State Contract

```typescript
export interface WifeNotebookState {
  isOpen: boolean;
  activeTab: 'suspects' | 'verdict';
  suspects: Array<{
    suspectId: string;
    displayName: string;
    aliasOrRole?: string;
    sourceAppId: string;
    notesText?: string;
    isTaggedByPlayer: boolean;
    addedTimestamp: string;
  }>;
  selectedVerdict?: 'innocent' | 'cheating' | 'sugar_relationship';
  accusedSuspectId?: string;
}
```
