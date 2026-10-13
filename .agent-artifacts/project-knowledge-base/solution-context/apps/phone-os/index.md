---
type: OS Specification Index
status: approved
description: "Master index and architecture overview for the Virtual Phone OS and built-in native applications suite (Shell/Launcher, Comms, Photos)."
tags: [phone-os, native-apps, launcher, comms, photos, index]
timestamp: "2026-10-13T16:35:00+07:00"
source_refs:
  - .agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md
  - .agent-artifacts/project-knowledge-base/solution-context/clue-traceability-matrix.md
---

# Virtual Phone OS & Native Applications Suite

> **Architectural Classification**: Unified parent specification for the emulated smartphone operating system and its built-in native applications suite.
> 
> *Third-party installed applications (`internet-messaging`, `banking`, `ecommerce`, `ride-hailing`, `web-browser`, `personal-notes`, `email`, `professional-network`, `team-collaboration`) remain in their respective standalone peer directories under `apps/`.*

---

## 1. Native OS Module Structure

```
.agent-artifacts/project-knowledge-base/solution-context/apps/phone-os/
├── app-design.md   # Unified Phone OS Visual System, Bezel, Status Bar, Shared Lockpad UI & Tokens (Applies to all OS Apps)
├── shell/          # Virtual OS Shell & Launcher Features (11-App Grid, Lock Subsystem, Notifications)
│   └── features.md
├── comms/          # Built-in Telecommunication Suite: Phone Dialer, Call Logs, Cellular SMS, Contacts
│   ├── app-design.md
│   └── features.md
├── photos/         # Built-in Media & Gallery: Photo Grid, Visual Reflection Forensics, Hidden Album
│   ├── app-design.md
│   └── features.md
├── wife-notebook/  # Wife's Detective Notebook & Final Verdict Decision Hub (Omnipresent FAB / Sheet)
│   ├── app-design.md
│   ├── features.md
│   └── index.md
└── index.md        # This native OS master specification index
```

---

## 2. Component Specifications

| Native Component | Architectural Role | UI/UX Design & Branding | Functional Features & Clues |
|---|---|---|---|
| **Phone OS Master System** (`phone-os/`) | Outer device bezel, status bar tokens, 11-app grid layout, shared polymorphic PIN lockpad, and notification banner architecture applying to all OS apps. | [app-design.md](app-design.md) | *(Governing design system)* |
| **OS Shell & Launcher** (`shell/`) | Physical device bezel mounting, synchronized carrier/clock/battery, universal 11-app launcher grid invariant, shared PIN lock engine, and dynamic toast pipeline. | [app-design.md](app-design.md) | [shell/features.md](shell/features.md) |
| **Native Comms** (`comms/`) | Built-in cellular communication suite managing short midnight call durations, brand hotel reservation SMS messages, and hidden contact card notes. | [comms/app-design.md](comms/app-design.md) | [comms/features.md](comms/features.md) |
| **Native Photos** (`photos/`) | Built-in media gallery managing full-screen zoomable lightboxes, wine glass reflection forensics, car dashboard evidence, and PIN-locked hidden albums. | [photos/app-design.md](photos/app-design.md) | [photos/features.md](photos/features.md) |
| **Wife's Notebook** (`wife-notebook/`) | Omnipresent detective dossier and decision hub overlay inheriting Phone OS shell dimensions, `.glass-elevated` modal sheets, and AssistiveTouch integration. | [wife-notebook/app-design.md](wife-notebook/app-design.md) | [wife-notebook/features.md](wife-notebook/features.md) |

## Pages

* [Virtual Phone OS — Master Design & UI/UX Specification](app-design.md) - Master UI/UX design system, physical bezel frame, status bar tokens, home screen launcher grid, shared PIN lock pad, and notification banner architecture applying to all OS applications.

