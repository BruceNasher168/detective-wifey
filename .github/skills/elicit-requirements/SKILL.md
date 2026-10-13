---
name: elicit-requirements
description: "Conduct discovery when eliciting or clarifying product, feature, epic, user-story, API, screen, process, or data requirements, including research and technical follow-ups during discovery. Discovery only: do not author final delivery artifacts."
---

# Elicit Requirements Skill

## Purpose

Conduct requirements elicitation across scope levels, discovery lenses, domain constraints, and UI details. This skill owns the activation criteria, interviewing rules, session lifecycle, and signed-off output format; the calling BA orchestrator owns scenario classification, cross-skill routing, and the later Artifact Plan.

---

## Invocation Contract

Receive discovery scope, the specific target when checking an epic or story, confirmed context, the current session (file or conversation), and persistence authorization from the caller. Reuse known inputs; treat missing authorization as pending. The caller grants write permission and routes delivery; this skill owns the complete discovery procedure.

Read and apply the entire [elicitation-output-guidance.md](./references/elicitation-output-guidance.md) before recording session content or assessing readiness. It governs all session output rules, including progress kept in conversation; do not load only selected sections.

## Execution Flow

1. **Establish baseline**: Reuse confirmed answers and read relevant project evidence through `research-project-knowledge` skill when missing or changed. Use Elicitation Scope Definitions and the scope-level checklist to identify material gaps. For an epic or story check, assess the specific target; earlier project or epic sign-off is supporting evidence, not automatic target readiness.
2. **Elicit**: When gaps remain, the first substantive response includes a focused question batch before broad research, proposed delivery scope, or an Artifact Plan. Use Interview Method; process each answer and continue the current topic. If interactive answers are unavailable, return unresolved questions without inventing answers or advancing delivery.
3. **Handle interruptions**: Answer an explicit technical or research follow-up concisely, then resume unresolved discovery in the same response. Use Targeted Research Loop when evidence is needed. Retain confirmed answers, avoid duplicate pending batches, and reassess readiness after scope changes.
4. **Record progress**: Apply the output guidance. If authorization is pending, keep the same session in conversation and report persistence pending; continue discovery. Once authorized, save accumulated progress to one session file. Never acquire write permission by inference.
5. **Assess readiness and sign-off**: Apply the output guidance. Incomplete discovery remains active; wrap-up records progress only. When ready, obtain stakeholder confirmation of the content and accepted deferred risks. A request to start or approval of setup is not confirmation.
6. **Return outcome**: Report the checked target, current readiness, stakeholder confirmation, unresolved blockers, and persistence state; include the session path only if saved. Record target coverage in the existing session sections without duplicating confirmed facts. If all target facts are already confirmed, explain their coverage and return readiness without redundant questions. Confirmed content awaiting persistence may support the caller's baseline approval plan, but downstream artifact consumers require the persisted signed-off session. Return that file as the sole handoff artifact; do not create another payload or status scheme.

Load interview, scope, and research detail internally as needed. The caller invokes this flow rather than scheduling individual sections.

## Interview Guidance

### Interview Method

Reuse confirmed context; apply `research-project-knowledge` when the baseline is missing or changed. Establish the PACT Baseline (People, Activities, Context, Technologies) and ask only about material gaps.

Use the PACT lifecycle consistently:
1. **PACT Baseline**: extract confirmed People, Activities, Context, and Technologies from project context.
2. **PACT Delta**: identify only the missing, ambiguous, or contradictory elements in the current request.
3. **Targeted Elicitation**: ask questions strictly against the PACT Delta without re-asking known facts.

| Pillar | Capture |
|---|---|
| People | **Multi-Dimensional Persona Profile**: Commercial model (B2B, B2C, Internal Ops), target demographics & age cohorts, digital literacy, device & hardware ecosystem (OS, form factors, multi-monitor, peripherals), ergonomics & user preferences (density, ambient vs focus, notifications), accessibility needs, and Jobs To Be Done (JTBD) with core pain points. |
| Activities | Workflows, triggers, frequency, urgency, criticality, inputs/outputs, and SLAs. |
| Context | Operating environment, team/social context, regulatory/compliance bounds. |
| Technologies | Platforms, devices, network/offline needs, legacy systems, and API dependencies. |

Discover NFRs (for example, latency, security, compliance, and service levels) as cross-cutting solution constraints. Do not fragment global NFRs into individual user stories unless a story requires an explicit SLA override or custom exception.

- Ask 2–4 high-impact questions for one topic per batch, or fewer when fewer gaps remain. Do not repeat answered questions or resubmit a pending asynchronous batch.
- During active elicitation, use a short context line and the questions. When the user explicitly requests research or a technical explanation, include a concise answer and distinguish evidence from provisional recommendations. Do not create final requirements or a full handoff summary while material questions remain.
- Use the VS Code question modal for live interactive questions when available; use unanswered Markdown questions in stateless invocations or if the modal is unavailable.
- Treat each answered batch as a checkpoint: recalculate the PACT Delta, then either ask the next material batch for the current topic or state why the scope is sufficient for the requested output.
- Convert questions the current user can answer into confirmed fields, `Candidate` entries, assumptions, or decisions. Keep only low-confidence, high-impact, or external-owner validation questions in the Parking Lot.
- If the user provides a complete artifact and explicitly skips elicitation, record `Decision: elicitation skipped by user` plus resulting assumptions in the session output before continuing.

### Targeted Research Loop

Targeted research may run between question batches when the conversation raises a concrete question about current project impact or rule consistency. It supplements the PACT baseline; it does not replace stakeholder elicitation or become an unrestricted codebase audit.

| Trigger | Research Focus | Elicitation Follow-up |
|---|---|---|
| Proposed feature may affect existing work | Related epics, stories, screens, flows, shared entities, dependencies, and state transitions | Confirm affected scope and whether each observed impact is intended. |
| Similar business rule may already exist | Existing validation, permission, calculation, lifecycle, or exception rules | Present apparent matches/conflicts and ask which rule is authoritative. |
| Current behavior is unclear | Documented behavior and, only with user confirmation, focused implementation evidence | Separate observed behavior from intended behavior; record defects or legacy behavior as such. |
| Shared resource or integration may ripple | Consumers, source of truth, in-flight/future item effects, and invalidation/state-lock risks | Confirm whether the change is local, cascading, or out of scope. |

When a trigger occurs:

1. Pause the current question sequence and formulate one bounded research question for the relevant target epic, feature, entity, rule, or artifact.
2. Apply `research-project-knowledge`; it owns tier selection, stopping rules, evidence reporting, and permission before any Tier 3 codebase search.
3. Present the research packet, distinguish observed behavior from intended behavior, ask the user to confirm the interpretation, record the result in the same session output, then recalculate the PACT Delta and continue elicitation.

### Guardrails

- Treat hedged statements (for example, "maybe", "I think", or "not sure") as unconfirmed. Ask the user to confirm, revise, or park them when they affect scope, behavior, data, security, compliance, effort, or timeline.
- Challenge vague actors, missing exception paths, hidden manual work, untestable requirements, unbounded scope, risky integrations, and security/compliance gaps.
- When new input contradicts an existing confirmed fact or decision, name both statements and ask one resolving question before changing the record.

### Question Rendering And Response Economy

- **Plain-Language Question Framing**: Frame all questions and selectable options in everyday business terminology and concrete operational scenarios. Never expose framework names or abstract engineering jargon directly in questions posed to the user. If technical alternatives must be decided (e.g. auth methods, integration frequency, data retention), explain their operational impact and trade-offs in plain English.

| Condition | Output |
|---|---|
| Live user-facing question | Present all material questions for the current topic in one VS Code question batch with structured options in plain business language. |
| Modal unavailable, or writing a transcript/summary | Use numbered Markdown questions with lettered options where useful. |
| Stakeholder/external validation item | Record it in the Markdown Parking Lot; do not present it as an interactive question. |
| Non-interactive invocation with material gaps | Return unresolved questions and the incomplete outcome from Execution Flow. |

Keep the `Referenced Documents` section compact during questioning. On wrap-up, record current progress. Downstream handoff requires the [Handoff Status](./references/elicitation-output-guidance.md#handoff-status) criteria.

---

## 1. Scope Level & Mode Checklists

### Elicitation Scope Definitions

Use these scopes to control interview depth, baseline research, and repeat questions.

| Scope | Read first | Elicit | Do not repeat or assume |
|---|---|---|---|
| **Full PACT baseline** | Available project knowledge and supplied context; no reliable baseline assumed for a new project | Material People, Activities, Context, Technologies; objective, boundary, rules/data, dependencies, NFRs, and delivery risks | Do not re-ask facts already confirmed in supplied context. |
| **Epic-level PACT delta** | Confirmed project knowledge, vision/scope, and requirement hierarchy | New, changed, or missing PACT facts; epic objective, boundary, rules/data, dependencies, and NFR impact | Do not repeat unchanged project-wide discovery. |
| **Narrow change delta** | Target epic, its decomposition section, affected stories, implementation status, and relevant research | Changed actor, goal, trigger, behavior, rules, affected stories, implementation impact, dependencies, acceptance boundary, and artifacts | Do not reopen unchanged epic context, rules, or story details. |
| **Reverse elicitation** | Supplied screen, mockup, or diagram and confirmed project context | Underlying goal, workflow, rules, states, permissions, and gaps | Do not treat visual elements as confirmed requirements without user validation. |

### What to Elicit by Scope Level:
- **Product**: Business goal, success signals, target personas, MVP boundaries, integrations, commercial risks, global NFRs.
- **Module / Epic**: Core purpose, module boundaries, user journeys, feature breakdown, shared data entities, dependencies.
- **Feature**: Trigger, actor, preconditions, happy path, business rules, data inputs/outputs, permissions, exception paths.
- **User Story**: Persona, user goal, business value, 3-tier Gherkin ACs, edge cases, error copy, testability.
- **API**: Consumer goal, provider system, endpoint capability, request/response payloads, authentication, error codes, latency SLA.
- **Screen / Form**: User goal, layout entry/exit, UI element dictionary, validation rules, component states, actions, permissions.
- **Process**: As-is vs to-be flow, swimlane roles, decision gates, handoffs, SLA timeouts, audit logging.
- **Data Entity**: Entity purpose, lifecycle states, field definitions, validation constraints, Single Source of Truth (SSOT), retention.

---

## 2. Structured Discovery Phasing & Lenses

### Default Greenfield Discovery Sequence:
1. **Objective, Actors & Ownership**: Business goal, success signals, personas, decision makers, and operational owners.
2. **Scope, Journey & Process**: MVP boundary, exclusions, core workflows, decision branches, and exception handling.
3. **Rules, Data & Integrations**: Validation, permissions, calculations, source of truth, legacy systems, and data exchanges.
4. **NFRs, Delivery & Risks**: Security, compliance, accessibility, SLAs, rollout phasing, assumptions, and handoff readiness.

---

## 3. UI, Form & Data Detail Checklist

Use when eliciting screens, forms, workflows, approvals, or data-capture features:
- **Fields & Data**: Required vs optional, calculated, read-only, hidden, source of truth.
- **Validation**: Exact regex formats, length limits, numerical ranges, uniqueness, cross-field dependencies, exact user-facing error text.
- **Display & States**: Visibility rules, disabled/read-only states, empty states, loading indicators, warning banners.
- **Defaults**: Prefill sources, lookup lists, remembered user preferences, auto-generated values, reset behavior.
- **Actions**: Primary submit, save draft, approve/reject, cancel, modal confirmations, undo capabilities, audit logging.
- **Permissions**: View, create, edit, approve, delete, export, supervisor overrides.
- **Exceptions**: Duplicate submission, session timeout, partial save failure, offline queueing, backend service failure.

---

## 4. Domain Reality Check & Constraints

- **Source of Truth Rule**: Use domain-specific rules only when stated by the user or present verbatim in source material. Never invent regulatory frameworks, industry jargon, or fictitious third-party systems.
- **Unknown Domain Handling**: If the business domain or regulatory framework is ambiguous and materially affects scope, compliance, or architecture, ask a focused clarifying question before assuming industry standards.
- **Domain Considerations as Hypotheses**: Treat domain patterns (e.g., standard banking KYC, retail checkout patterns, HIPAA audit trails) as hypotheses to validate with the user, not confirmed facts.

---

## 5. Session Output

Use [elicitation-session-template.md](./assets/elicitation-session-template.md) for the output skeleton and [elicitation-output-guidance.md](./references/elicitation-output-guidance.md) for persistence, field boundaries, Parking Lot handling, status, and handoff rules. The session file is the sole signed-off handoff artifact; do not create a duplicate brief or payload.

