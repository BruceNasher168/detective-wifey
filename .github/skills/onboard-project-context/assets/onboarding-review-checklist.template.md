# Project Onboarding Review & Readiness Checklist

> **Project Name**: `<Project Name>`  
> **Target Repository**: `<Workspace / Repository Path>`  
> **Onboarding Lead / BA**: `<Name / Role>`  
> **Date Completed**: `<YYYY-MM-DD>`  
> **Target ALM System**: `Jira` | `Azure DevOps (ADO)` | `None (Local Delivery)`

---

## 1. Automated Readiness Verification Audit

Run `powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/verify_onboarding.ps1 --checklist` and record results:

| Audit Checkpoint | Target State | Actual Status | Verification Method |
|---|---|:---:|---|
| **Root Summary (`project-summary.md`)** | Present with Domain, Architecture, Actors, and Scope Baseline | `[PASS / FAIL]` | Verified via `verify_onboarding.ps1` |
| **Knowledge Base (`.agent-artifacts/project-knowledge-base/`)** | Populated with progressive stubs & glossary entries | `[PASS / WARN]` | Verified via `map_knowledge_base.ps1` |
| **Delivery Workbench (`.agent-artifacts/requirements/`)** | `input/` and `output/` directories and indexes exist | `[PASS / FAIL]` | Verified via `sync_indexes.ps1` |
| **ALM Field Mapping Configuration** | `jira-field-mapping.md` or `ado-field-mapping.md` calibrated | `[PASS / WARN]` | Verified in `sync-backlog/references/` |
| **Workspace Governance Registration** | `ba-onboarding` and `business-analyst` in platform instructions | `[PASS / FAIL]` | Verified in `AGENTS.md` or `.github/copilot-instructions.md` |

---

## 2. Business Analyst Manual Sign-Off

Review and check each item prior to initiating active sprint delivery:

### A. Context & Solution Baseline
- [ ] **Domain & Terminology**: `project-summary.md` uses client-approved nomenclature and domain terms.
- [ ] **Commercial Boundary**: MVP contractual scope vs potential Change Request (CR) triggers are documented in `project-summary.md`.
- [ ] **Glossary Completeness**: Key system acronyms and business nouns are registered in `.agent-artifacts/project-knowledge-base/glossary/`.

### B. Knowledge Retrieval & Progressive Disclosure
- [ ] **Search Validation**: Tested `powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 -q "<keyword>"` (or `.github/skills/...`) and confirmed relevant documentation stubs appear in results.
- [ ] **Non-Destructive Stubs**: Confirmed all mapped stubs in `.agent-artifacts/project-knowledge-base/wiki/` link back to authoritative source documents without data loss.

### C. ALM & Backlog Calibration (Jira / ADO)
- [ ] **Project Key / Organization**: Correct project key (e.g. `PROJ`) or ADO organization/project name confirmed.
- [ ] **Custom Field IDs**: Verified whether client instance requires custom fields for Epic links, story points, or acceptance criteria.
- [ ] **Workflow Statuses**: Verified that status transitions (`draft` -> `refinement` -> `ready for dev`) match team Scrum board columns.

### D. Definition of Ready (DoR) Calibration
- [ ] **Story Format**: INVEST statement and vertical 3-tier Gherkin Acceptance Criteria (Rule, BDD scenario, Non-functional) confirmed.
- [ ] **Approval Gate**: Confirmed that no deliverable files will be written until the combined Artifact Plan is signed off by the user.

### E. Repository Governance & Script Commit Policy
- [ ] **Artifact Hosting Location**: Confirmed whether BA artifacts live in a dedicated non-source-code repo/folder or directly inside the application source code repo.
- [ ] **Script Commit Permission**: If hosted in a source code repo, verified that team policy permits committing `.agents/skills/*/scripts/` / `.github/skills/*/scripts/` and `.agent-artifacts/` (or verified `.gitignore` excludes them from git tracking).

---

## 3. Delivery Handoff Decision

- **Sign-Off Status**: `APPROVED FOR ACTIVE DELIVERY` | `CHANGES REQUIRED`
- **Lead BA Signature**: `<Signature / Initials>`
- **Next Action**: Handoff to `@business-analyst` to begin active requirement discovery and story authoring.
