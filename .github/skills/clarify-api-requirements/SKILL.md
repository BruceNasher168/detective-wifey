---
name: clarify-api-requirements
description: "Clarifies API contracts, consumers, request/response payloads, field mappings, NFRs, edge cases, error behaviors, and change impact, and authors structured BA-friendly API specifications (`api-<slug>.md`). Use when analyzing, clarifying, or authoring API endpoints, integration contracts, or backend interface specifications."
---

# Clarify API Requirements

Executes end-to-end API requirement analysis, contract clarification, change impact assessment, and physical API specification authoring (`api-<slug>.md`) under `.agent-artifacts/requirements/output/<epic-slug>/`.

> [!NOTE]
> **SSOT for Skill Triggers**: The frontmatter `description` above is the **Single Source of Truth** for when to activate this skill. Do NOT repeat a redundant `## When to Use` section in the body—once loaded, the skill is already active. Agents that mount this skill define their dispatch conditions in their own `.agent.md` file.

## References

> Query these files on demand using progressive disclosure. Do not read entire files into context if a targeted lookup suffices:
> - **Specification Template**: [assets/api-specification-template.md](assets/api-specification-template.md) — canonical contract deliverable structure
> - **Authoring Guidelines**: [references/api-specification-guidelines.md](references/api-specification-guidelines.md) — general spec rules, zero-fluff style, compact table syntax
> - **Data Dictionary Rules**: [references/api-body-data-dictionary-guidelines.md](references/api-body-data-dictionary-guidelines.md) — request/response field dictionary standards
> - **Mapping Rules**: [references/api-body-mapping-guidelines.md](references/api-body-mapping-guidelines.md) — source/target transformation and null fallback rules
> - **NFR Catalog**: [references/api-nfr-catalog.md](references/api-nfr-catalog.md) — 11-category operational quality attribute checklist
> - **Change Impact Rubric**: [references/api-change-impact-rubric.md](references/api-change-impact-rubric.md) — breaking change matrix and update plan formulation
> - **Readiness Checklist**: [references/api-readiness-checklist.md](references/api-readiness-checklist.md) — 10-point specification handoff verification gate

## Prerequisites & Inputs

> [!IMPORTANT]
> **Stop & Ask on Ambiguity**: If foundational context (business goal, actor/consumer, trigger, expected outcome, or system boundary) is missing, ambiguous, or contradictory: **STOP IMMEDIATELY**. Do not guess or extrapolate API contracts. Ask the user with recommended options or route to `elicit-requirements` / `ba` before proceeding.

- **Required Inputs**:
  - Foundational requirement statement with identified consumer and business goal.
  - Target epic folder context under `.agent-artifacts/requirements/output/<epic-slug>/`.
  - Available solution context or provider schema references.

## Procedure

Align steps, verification gates, and tooling with contract-first design principles (BABOK & OpenAPI conventions).

### Step 1: Solution & Provider Research (DRY / SSOT Scan)
1. Run `research-project-knowledge` to inspect `.agent-artifacts/project-knowledge-base/` (solution-context, wiki, glossary) and existing epic artifacts.
2. Verify if the target endpoint, data entity, or integration contract already exists. Ensure single source of truth and eliminate duplicate endpoint definitions.
3. Review existing Swagger/OpenAPI docs, payload samples, database schemas, or provider guidelines if available.

### Step 2: Contract & NFR Elicitation
1. **Contract Clarification**: Clarify the core interaction dimensions:
   - Endpoint intent (HTTP verb, REST resource noun, action).
   - Request contract (headers, query/path parameters, request body).
   - Response contract (success status, response body, error statuses).
   - Data dictionary (field names, types, requiredness, nullability, validation rules).
   - Mappings (source-to-target mapping, transformations, fallback defaults).
2. **NFR Discovery**: Query applicable categories from [references/api-nfr-catalog.md](references/api-nfr-catalog.md):
   - Auth & permissions, sensitive data (PII/PCI), performance/latency SLAs, resilience/retries, idempotency keys, pagination, rate limits, observability/tracing, caching, and versioning.
3. **Behavior & Edge Cases**:
   - Happy path flow.
   - Alternate paths and error scenarios (invalid payloads, dependency timeouts, unauthorized callers).
4. **Question Discipline**: Ask 1–3 focused questions per turn, formulating each with a **Recommended Approach** and structured options with pros/cons.

### Step 3: Readiness Audit & Change Plan Gate
1. Audit findings against [references/api-readiness-checklist.md](references/api-readiness-checklist.md) (10-point readiness check).
2. **Approval Gate**:
   - **If invoked via Orchestrator (`ba`) under an approved Artifact Plan**: proceed directly to Step 4 without requesting duplicate plan confirmation.
   - **If invoked standalone**: present a formal **Change Plan** (Target file path `<epic-slug>/api-<slug>.md`, impacted models, DRY rationale, assumptions, consumer impact) and obtain explicit user approval before writing files.

### Step 4: Physical API Specification Authoring
1. Instantiate [assets/api-specification-template.md](assets/api-specification-template.md) at `.agent-artifacts/requirements/output/<epic-slug>/api-<api-slug>.md`.
2. Apply [references/api-specification-guidelines.md](references/api-specification-guidelines.md):
   - Section 1: HTTP Method and Endpoint table.
   - Section 2 & 3: Consumer-focused Summary and Description.
   - Section 4: Request Contract (headers, path/query params, inline request body dictionary, mapping table, sample JSON).
   - Section 5: Processing Rules using numbered steps and strict `IF / THEN / ELSE` conditional logic.
   - Section 6: Response Contract (status codes, inline response body dictionary, mapping table, sample JSON).
   - Section 7: Error Responses table (status code, error code, message, triggering condition).
   - Section 8: Visible Assumptions and Open Questions tables.
3. Enforce AI token optimization: use minimal 3-dash dividers (`|---|---|`) and omit cell-padding whitespace.

### Step 5: Post-Authoring Verification & Knowledge Update
1. Inspect the written markdown file to verify valid links, table alignment, and schema completeness.
2. If diagrams are required to illustrate multi-system sequence or state lifecycles, prepare diagram input and route to `generate-diagram`.
3. If new reusable domain models or integration endpoints were created, offer `update-project-knowledge` to persist durable facts to the project knowledge base upon user confirmation.

## Specialized Execution Modes

### Mode: API Change Impact Assessment
When evaluating changes to existing endpoints or schemas:
1. Follow [references/api-change-impact-rubric.md](references/api-change-impact-rubric.md).
2. Classify changes as Breaking vs Non-Breaking across URIs, parameters, payloads, validation rules, and error codes.
3. Generate an API Update Plan detailing affected specification files, consumer migration steps, and test updates.

### Mode: Diagram Planning
When visual flow is needed to clarify integration complexity:
- **Sequence Diagram**: Service-to-service interactions over time, token exchange, multi-step orchestration.
- **Activity / Flowchart**: Complex branching decisions, conditional fallbacks.
- **State Diagram**: Resource lifecycle transitions (e.g., `PENDING` $\rightarrow$ `PROCESSED` $\rightarrow$ `SETTLED`).
- **ERD**: Entity relationships and database mapping schemas.
Format the diagram request packet (audience, core questions, entities/actors) and hand off to `generate-diagram`.

## Conditional Branching & Fallbacks

- **Branch: Missing Foundational Context**:
  - If business goal, trigger, actor, or scope boundary is missing: halt API contract detailing and route back to `elicit-requirements` or `ba`.
- **Branch: OpenAPI/Swagger Output Requested**:
  - Author the BA-oriented specification in `api-<slug>.md` first as SSOT. If the user explicitly requests raw OpenAPI YAML/JSON, generate it as an accompanying artifact referencing the primary specification.
- **Fallback: Non-Interactive / Batch Execution**:
  - If questions cannot be answered interactively: record assumptions explicitly with stated failure impacts, output open questions in an in-progress summary, create provisional draft specification with `status: draft`, and avoid overwriting confirmed baseline files.

## Deliverables & Consumer Soundness

- **Primary Consumers**:
  - *Engineers & Architects*: Unambiguous `IF / ELSE` logic, concrete validation constraints, deterministic error codes, realistic sample payloads.
  - *AI Subagents & Automated Linters*: Structured markdown tables, predictable headings, zero conversational prose, valid relative links.
  - *Business Analysts & Product Owners*: Clear business summary, traceability to parent epic and user stories, explicit NFRs.
- **Physical Deliverable**:
  - Target Path: `.agent-artifacts/requirements/output/<epic-slug>/api-<api-slug>.md`

## Anti-Patterns & Negative Constraints

- **Never duplicate frontmatter triggers**: Do not add a `## When to Use` section in the markdown body.
- **Never invent endpoints or fields**: Every resource path, parameter, and status code must trace to source evidence or user confirmation.
- **Never scatter models across separate files**: Represent nested request/response bodies inline using dot/array paths (`customer.address.postcode`, `items[].sku`).
- **Never write vague processing rules**: Forbid verbs like "process" or "handle". Use declarative verbs ("match X to Y", "look up X in Y", "return X when Y").
- **Never author files without gate approval**: Respect the Orchestrator's Artifact Plan or present a standalone Change Plan before mutating disk files.
