# API Non-Functional Requirements (NFR) Catalog

Query this catalog during API requirements discovery to clarify relevant operational quality attributes. Ask only the categories applicable to the endpoint or integration.

---

## 1. Authentication & Authorization
- **Caller Identity**: Who or what invokes this API (end user, internal service, third-party partner, daemon worker)?
- **Auth Scheme**: OAuth2 (Bearer JWT), mTLS, API Key, HMAC signature, or session cookie?
- **Scopes & Permissions**: What granular roles, claims, or scopes are required (e.g., `orders:read`, `admin`)?
- **Context Propagation**: Does the caller pass tenant ID, user ID, or correlation headers?

## 2. Sensitive Data & Privacy
- **Classification**: Does the payload contain PII, PCI-DSS (cardholder), PHI (healthcare), or commercial secrets?
- **Handling Constraints**:
  - Masking/redaction in logs and traces.
  - At-rest and in-transit encryption requirements.
  - Data retention and purge policies (e.g., GDPR right-to-be-forgotten).

## 3. Performance & Latency
- **Response Time Target**: P50, P95, and P99 latency SLA (e.g., < 200ms P95).
- **Throughput Expectations**: Expected Requests Per Second (RPS) at peak and average load.
- **Payload Size Limits**: Maximum permissible request/response body size (e.g., 2MB).
- **Timeouts**: Client timeout deadline and downstream dependency timeout limits.

## 4. Resilience, Fault Tolerance & Retries
- **Dependency Failure Behavior**: If a downstream database or third-party service is down, fail fast, return cached data, or return degraded response?
- **Retry Strategy**: Exponential backoff, jitter, maximum retry count, and circuit-breaker threshold.
- **Partial Success**: Can batch/bulk endpoints partially succeed (`207 Multi-Status` or failure list in response body)?

## 5. Idempotency & Concurrency
- **Duplicate Protection**: Is retry safety required for non-safe methods (`POST`, `PATCH`)?
- **Idempotency Key**: Header specification (e.g., `Idempotency-Key: <UUID>`), TTL, and replay response semantics.
- **Concurrency Control**: Optimistic locking via `ETag` / `If-Match` headers or pessimistic locking?

## 6. Result Controls (Pagination, Sorting, Filtering)
- **Pagination Strategy**: Cursor-based (`after_token`), keyset, or offset/limit (`page`, `pageSize`)?
- **Max Page Bounds**: Maximum allowed `limit` or `size` (e.g., max 100 items per page).
- **Sorting & Filtering**: Allowed filter fields, comparison operators, and default sort order (e.g., `createdAt:desc`).

## 7. Rate Limiting & Throttling
- **Quota Rules**: Call limits per window (e.g., 100 req/min per IP, 10,000 req/day per API key).
- **Throttling Response**: `429 Too Many Requests` with standard headers (`Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`).
- **Burst Allowance**: Token bucket / leaky bucket burst capacity.

## 8. Observability & Auditability
- **Correlation & Tracing**: Mandatory tracing headers (e.g., `X-Correlation-ID`, `traceparent`).
- **Audit Logging**: Mandatory business audit trail events (who, when, what entity changed).
- **Metric Telemetry**: Error rate alarms, invocation counters, duration metrics.

## 9. Caching & Freshness
- **Cache Eligibility**: Is the response cacheable (safe, idempotent, public vs private)?
- **Headers & Directives**: `Cache-Control` (`max-age`, `no-store`, `must-revalidate`), `ETag`, `Last-Modified`.
- **Invalidation Triggers**: What mutations purge or invalidate cached records?

## 10. Versioning & Evolution
- **Strategy**: URL path versioning (`/v1/orders`), header versioning (`Accept: application/vnd.company.v1+json`), or query param?
- **Backward Compatibility**: Non-breaking additive changes vs deprecation timeline policy for breaking changes.

## 11. Regulatory & Compliance
- **Jurisdiction & Residency**: Local data residency requirements (e.g., EU data must remain within EU boundaries).
- **Consent & Legal Basis**: Specific consent checks or compliance audits required before processing.
