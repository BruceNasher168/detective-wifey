---
type: Vision & Scope
status: draft
description: "<One-sentence product goal summary>"
tags: [requirement, vision, scope]
timestamp: "<ISO-8601 timestamp>"
source_refs: []
---

# Vision & Scope — `<Project Name>`

> **Authoring Rule**: Populate every section from the signed-off elicitation session output. Do not fabricate facts. Mark any uncertain items with `Candidate` status and park gaps in Open Questions. This file is the commercial and scope baseline for all downstream decomposition, story authoring, and Change Request (CR) detection.

---

## 1. Product Vision

### Business Goal
`<Why does this product/system exist? What problem does it solve or opportunity does it capture?>`

### Success Signals
| Signal | Target / Measure | Status |
|---|---|---|
| `<Metric or outcome>` | `<Target value or threshold>` | Confirmed \| Candidate |

### Sponsoring Stakeholder(s)
| Name / Role | Commercial Accountability | Status |
|---|---|---|
| `<Name, Role>` | `<Decision authority or budget holder>` | Confirmed \| Candidate |

---

## 2. Personas & Target Users

| Persona | Commercial Model | Primary JTBD | Key Pain Points | Status |
|---|---|---|---|---|
| `<Persona Name>` | B2B \| B2C \| Internal Ops | `<Core job to be done>` | `<Top 1–2 frustrations with the current state>` | Confirmed \| Candidate |

---

## 3. MVP Scope Boundary

### In Scope (MVP)
| Capability / Feature Area | Description | Status |
|---|---|---|
| `<Capability>` | `<What it does at MVP level>` | Confirmed \| Candidate |

### Out of Scope (Explicit Exclusions)
| Item | Reason for Exclusion | Status |
|---|---|---|
| `<Feature or capability>` | `<Deferred, out of budget, out of contract, etc.>` | Confirmed \| Candidate |

### Phase Boundaries (if applicable)
| Phase | Scope | Target |
|---|---|---|
| Phase 1 / MVP | `<Included capabilities>` | `<Date or sprint target, or TBD>` |
| Phase 2+ | `<Post-MVP capabilities>` | TBD |

---

## 4. Key Constraints & Non-Functional Requirements (Global)

| Category | Constraint / Requirement | Status |
|---|---|---|
| Security | `<Auth model, data protection, compliance, or N/A>` | Confirmed \| Candidate |
| Compliance / Regulatory | `<GDPR, HIPAA, SOC 2, local law, or N/A>` | Confirmed \| Candidate |
| Performance / SLA | `<Latency, uptime, throughput targets, or N/A>` | Confirmed \| Candidate |
| Accessibility | `<WCAG level, assistive tech support, or N/A>` | Confirmed \| Candidate |
| Platforms / Devices | `<Supported OS, browsers, form factors, or N/A>` | Confirmed \| Candidate |
| Integrations | `<Key third-party or internal systems, or N/A>` | Confirmed \| Candidate |

---

## 5. Commercial Baseline (SOW / CR Trigger)

| Category | Detail | Status |
|---|---|---|
| Contracted MVP | `<What is explicitly in contract or agreed budget>` | Confirmed \| Candidate |
| Change Request Trigger | `<What types of requests require a formal CR — new actors, out-of-scope integrations, post-MVP features, reopened delivered stories>` | Confirmed \| Candidate |
| Budget / Timeline Ceiling | `<Agreed budget range or timeline constraint, or Confidential>` | Confirmed \| Candidate |

---

## 6. Key Assumptions & Risks

| Type | Item | Impact | Owner / Status |
|---|---|---|---|
| Assumption | `<Working premise that influences this scope>` | Low \| Medium \| High | `<Owner>, Open \| Validated` |
| Risk | `<Delivery, technical, or commercial risk>` | Low \| Medium \| High | `<Owner>, Open \| Mitigated` |
| Dependency | `<External team, system, or approval needed>` | Low \| Medium \| High | `<Owner>, Open \| Ready` |

---

## 7. Open Questions

| ID | Question | Needed From | Status |
|---|---|---|---|
| Q001 | `<Unresolved scope or commercial question>` | Client \| Architect \| Legal | Open \| Deferred |

---

## Referenced Documents

`<List all source files actually read — elicitation session, SOW, brief, discovery notes — with workspace-relative links. If none: "No project documents were referenced; this response is based on the current conversation context only.">`
