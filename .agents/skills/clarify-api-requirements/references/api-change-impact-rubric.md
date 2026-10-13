# API Change Impact Assessment Rubric

Use when assessing the ripple effect of a requested change on existing API contracts, schemas, consumers, or downstream dependencies before updating specification files.

---

## 1. Change Summary Capture

Before evaluating impact, summarize:
- **Change Driver**: What changed and why (business requirement update, downstream provider schema change, defect fix, deprecation)?
- **Source of Request**: Client team, backend team, regulatory mandate, or third-party provider?
- **Scope Boundary**: Is this a single endpoint change or a cross-service schema alteration?

---

## 2. API Impact Assessment Matrix

Evaluate each dimension using this structured evaluation matrix:

| Impact Area | Evaluation Questions | Severity / Breaking? | Action Required |
|---|---|---|---|
| **Endpoint URI & Method** | Was the path, resource hierarchy, or HTTP verb modified? | **Breaking** if modified | Update routing, deprecate old endpoint, or version URI. |
| **Request Contract** | Are new fields added as required? Are existing fields removed, renamed, or types changed? | **Breaking** if required added or existing altered | If optional, additive change. If required, consider version bump or defaults. |
| **Response Contract** | Were existing response fields removed, renamed, or restructured? | **Breaking** if removed/altered for existing consumers | Maintain backward compatibility, use field aliases if necessary. |
| **Field Dictionary & Constraints** | Did validation rules tighten (e.g., regex, max length, enum reduction)? | **Breaking** if stricter | Review consumer payloads to avoid unexpected 400 rejections. |
| **Processing Rules & Logic** | Did business evaluation order, decision branches, or calculation logic change? | Non-breaking or behavioral change | Update numbered `IF / ELSE` logic in spec. |
| **Downstream Dependencies** | Are new third-party APIs, microservices, or databases involved? | Non-breaking | Update mapping tables, timeout/retry rules, and error codes. |
| **Error Handling & Codes** | Are new error codes introduced or existing codes changed? | Non-breaking / Consumer Impact | Update error response catalog in specification. |
| **Operational & NFRs** | Are rate limits, caching TTLs, auth scopes, or SLAs affected? | Operational Impact | Adjust headers, rate limit tables, or infrastructure notes. |
| **Consumer Migration** | Which specific client applications or services consume this API? | Governance | Document required consumer notification and rollout plan. |

---

## 3. Update Plan Formulation

Structure the remediation plan into concrete actions:
1. **Target Specification File**: State the exact file path `<epic-slug>/api-<api-slug>.md`.
2. **Sections to Update**:
   - Request/Response Data Dictionary tables.
   - Request/Response Mapping tables.
   - Processing rules with numbered `IF / ELSE` logic.
   - Error response tables.
3. **Diagram & Test Impact**:
   - Identify if sequence or state diagrams require regeneration via `generate-diagram`.
   - Identify test scenarios or consumer contracts (Pact) that require updating.
