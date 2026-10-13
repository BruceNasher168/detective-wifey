# API Specification Handoff Readiness Checklist

Evaluate this 10-point checklist before creating or updating physical API specification artifacts (`api-<slug>.md`). All critical gates must be confirmed or explicitly labeled with approved assumptions.

---

## 10-Point Readiness Audit Table

| Gate # | Assessment Area | Verification Criteria | Status (Pass / Gap) | Notes / Clarification Needed |
|---|---|---|---|---|
| **G-01** | **Business Goal & Consumer** | Clear business value and identified client consumers (web, mobile, 3rd party, batch). | `Pass` \| `Gap` | Must not be vague (e.g., "handle data"). |
| **G-02** | **Endpoint Intent & Method** | Concrete resource name and standard HTTP verb (GET, POST, PUT, PATCH, DELETE). | `Pass` \| `Gap` | RESTful resource-noun semantics verified. |
| **G-03** | **Request Contract** | Headers, path/query params, and request body structure known. | `Pass` \| `Gap` | Required vs optional flags defined for all fields. |
| **G-04** | **Response Contract** | Primary success HTTP status (200, 201, 204) and response payload structure known. | `Pass` \| `Gap` | Success body schema defined or explicitly confirmed empty. |
| **G-05** | **Data Dictionary Definitions** | Concrete field data types, nullability, validation constraints, and business meanings. | `Pass` \| `Gap` | Dot notation (`a.b.c`) and array notation (`items[]`) used for nesting. |
| **G-06** | **Source & Target Mappings** | Clear field-level transformation logic, source aliases, and `IF NULL` fallbacks. | `Pass` \| `Gap` | Required for integration/orchestration endpoints. |
| **G-07** | **Processing Rules (`IF/ELSE`)** | Step-by-step business evaluation flow, validation checks, and dependency branch handling. | `Pass` \| `Gap` | Must use explicit `IF / THEN / ELSE` structure. |
| **G-08** | **Error Behavior & Codes** | Client (4xx) and Server (5xx) error conditions, machine-readable codes, and user messages. | `Pass` \| `Gap` | Explicit trigger condition documented per error row. |
| **G-09** | **Operational & NFR Details** | Applicable security (OAuth/scopes), rate limits, idempotency, or timeout rules clarified. | `Pass` \| `Gap` | Inlined where they affect the contract. |
| **G-10** | **Assumptions & Open Questions** | Unconfirmed non-blocking items explicitly marked as assumptions with consequences. | `Pass` \| `Gap` | Zero blocking open questions remaining. |

---

## Decision Routing

Based on the checklist outcome, select one concrete next route:

- **If all gates Pass**: Proceed to Step 4 (Physical API Specification Authoring).
- **If foundational context is missing (G-01, G-02)**: Halt and route to `ba` or `elicit-requirements` to clarify business scope first.
- **If API contract or NFR details are missing (G-03 to G-09)**: Formulate 1–3 targeted questions to clarify the missing contract details before authoring files.
- **If complex multi-system sequence/state is unclear**: Trigger Diagram Planning to generate visual flow before finalizing the specification.
