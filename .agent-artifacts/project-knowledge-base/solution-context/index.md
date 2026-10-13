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
      * **Sổ Tay Bắt Ghen Của Vợ (Wife's Notebook & Verdict Hub)**: [Features](apps/phone-os/wife-notebook/features.md) \| [App Design](apps/phone-os/wife-notebook/app-design.md)
    * **LoZa (Internet Messaging)**: [Features](apps/internet-messaging/features.md) \| [App Design](apps/internet-messaging/app-design.md)
    * **VietPay (Banking & E-Wallet)**: [Features](apps/banking/features.md) \| [App Design](apps/banking/app-design.md)
    * **Poshee (E-Commerce)**: [Features](apps/ecommerce/features.md) \| [App Design](apps/ecommerce/app-design.md)
    * **Grap (Ride Hailing)**: [Features](apps/ride-hailing/features.md) \| [App Design](apps/ride-hailing/app-design.md)
    * **NetSurf (Web Browser)**: [Features](apps/web-browser/features.md) \| [App Design](apps/web-browser/app-design.md)
    * **Husband's Notes (Personal Notes)**: [Features](apps/personal-notes/features.md) \| [App Design](apps/personal-notes/app-design.md)
    * **GeeMail (Email)**: [Features](apps/email/features.md) \| [App Design](apps/email/app-design.md)
    * **InkedLin (Professional Network)**: [Features](apps/professional-network/features.md) \| [App Design](apps/professional-network/app-design.md)
    * **Tim (Team Collaboration)**: [Features](apps/team-collaboration/features.md) \| [App Design](apps/team-collaboration/app-design.md)
* API, event, file, provider/consumer, and dependency context.
* Entities, source-of-truth notes, lifecycle, retention, and mapping context.
* Screen, workflow, reporting, notification, permission, validation, and backend/frontend touchpoints.

For requirement analysis, open this folder after `../requirements/` only when the deliverable depends on domain, system, API, integration, data, or screen context.

## Pages

* [Clue Ideas Inventory & Cross-App Distribution Matrix](clue-ideas-inventory.md)
* [Canonical Clue Traceability & Forensic Coverage Matrix](clue-traceability-matrix.md) - Canonical Clue Traceability & Coverage Matrix mapping all clue archetypes to individual virtual apps, UI features, truth twists, and cross-app puzzle chains.

