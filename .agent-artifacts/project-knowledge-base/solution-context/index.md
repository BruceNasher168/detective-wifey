# Solution Context

Use this folder for solution facts that help a BA understand requirement behavior and implementation boundaries.

Store these topics here instead of keeping separate top-level folders:

* Business domain context, processes, policies, and operating rules.
* Applications, modules, services, repositories, platforms, environments, and ownership.
  * [Software Architecture Document (SAD)](architecture/apps-features-architecture.md)
  * [Hosting & Deployment Architecture (GitHub Pages)](architecture/hosting-deployment.md)
  * [Clue Traceability & Forensic Coverage Matrix](clue-traceability-matrix.md)
  * [Clue Ideas Inventory](clue-ideas-inventory.md)
  * **Application Specifications (`apps/`)**:
    * **[Virtual Phone OS & Native Suite](apps/phone-os/index.md)**:
      * **Phone OS Master Design**: [Master App Design](apps/phone-os/app-design.md) *(Applies to all OS apps)*
      * **OS Shell & Launcher**: [Features](apps/phone-os/shell/features.md)
      * **Native Comms (Phone & SMS)**: [Features](apps/phone-os/comms/features.md) \| [App Design](apps/phone-os/comms/app-design.md)
      * **Native Photos (Gallery Forensics)**: [Features](apps/phone-os/photos/features.md) \| [App Design](apps/phone-os/photos/app-design.md)
    * **LoZa (Zalo Parody)**: [Features](apps/loza/features.md) \| [App Design](apps/loza/app-design.md)
    * **VietPay (Bank & MoMo Parody)**: [Features](apps/vietpay/features.md) \| [App Design](apps/vietpay/app-design.md)
    * **Poshee (Shopee Parody)**: [Features](apps/poshee/features.md) \| [App Design](apps/poshee/app-design.md)
    * **Grap (Grab/Be Parody)**: [Features](apps/grap/features.md) \| [App Design](apps/grap/app-design.md)
    * **NetSurf (Mobile Browser)**: [Features](apps/netsurf/features.md) \| [App Design](apps/netsurf/app-design.md)
    * **Husband's Notes & Calendar**: [Features](apps/husband-notes/features.md) \| [App Design](apps/husband-notes/app-design.md)
    * **Sổ Tay Bắt Ghen Của Vợ (Wife's Notebook & Verdict Hub)**: [Features](apps/wife-notebook/features.md) \| [App Design](apps/wife-notebook/app-design.md)
* API, event, file, provider/consumer, and dependency context.
* Entities, source-of-truth notes, lifecycle, retention, and mapping context.
* Screen, workflow, reporting, notification, permission, validation, and backend/frontend touchpoints.

For requirement analysis, open this folder after `../requirements/` only when the deliverable depends on domain, system, API, integration, data, or screen context.
