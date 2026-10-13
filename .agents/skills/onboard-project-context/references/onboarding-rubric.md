# BA Accelerator Onboarding & Project Readiness Rubric

Evaluate target workspace readiness across 4 essential pillars before handing off delivery tasks to `@business-analyst`:

---

## Pillar 1: Knowledge Base & Solution Context Health

| Checkpoint | Pass Criteria | Remediation If Failing |
|---|---|---|
| **1.1 Workspace Summary** | `project-summary.md` exists at repository root; contains high-level domain, system architecture, tech stack, and primary actors. | Run `@ba-onboarding` to scaffold `project-summary.md` from SOW, README, or initial interview. |
| **1.2 Durable Wiki Index** | `.agent-artifacts/project-knowledge-base/wiki/index.md` exists and lists active functional domain concepts. | Execute `powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/map_knowledge_base.ps1` on existing project documentation folders. |
| **1.3 Domain Glossary** | `.agent-artifacts/project-knowledge-base/glossary/` contains project acronyms, core business entities, and state definitions. | Extract domain nouns from existing specifications or run `@ba-onboarding` with glossary extraction mode. |
| **1.4 Progressive Source Linking** | External documentation stubs reference authoritative sources without duplicating unverified text. | Verify YAML frontmatter `source_path` and `source_type: external-mapped` in generated stubs. |

---

## Pillar 2: ALM & Backlog System Integration (Jira / Azure DevOps)

| Checkpoint | Pass Criteria | Remediation If Failing |
|---|---|---|
| **2.1 MCP Connectivity** | Either Atlassian MCP (`atlassian` / `atlassian-mcp-server`) or Azure DevOps MCP (`azure-devops` / `azure-devops-mcp`) is active and responding. | Inspect `mcp_config.json`; verify API tokens and endpoints. |
| **2.2 Project Key / Iteration Scope** | Target Jira Project Key (e.g., `PROJ`) or ADO Project & Area/Iteration Path is verified with read/write permissions. | Confirm project key using MCP query test; document in `project-summary.md`. |
| **2.3 Custom Field Mapping** | Custom fields (Epic Link / Parent ID, Story Points, Acceptance Criteria, Components) are mapped in `.agents/skills/sync-backlog/references/`. | Edit `jira-field-mapping.md` or `ado-field-mapping.md` using the IDs discovered during onboarding audit. |
| **2.4 State Transitions** | Target workflow states (`To Do`, `In Analysis`, `Ready for Dev`) match project team conventions. | Align `sync-backlog` status transitions with team Scrum board rules. |

---

## Pillar 3: BA Delivery Workflow & Definition of Ready (DoR) Calibration

| Checkpoint | Pass Criteria | Remediation If Failing |
|---|---|---|
| **3.1 Global Instructions** | `AGENTS.md` reflects project delivery model, client constraints, and non-negotiables. | Add project-specific boundaries and compliance mandates to `AGENTS.md`. |
| **3.2 Definition of Ready (DoR)** | Stories enforce 3-tier Acceptance Criteria (Rule, BDD scenario, Non-functional) and explicit Epic parents. | Review `.agents/skills/manage-requirement-artifacts/references/definition-of-ready.md` against client contract. |
| **3.3 SOW / Scope Baseline** | Commercial boundaries (Contractual MVP vs Change Request triggers) are documented in `.agent-artifacts/requirements/input/` or `vision-scope.md`. | Place initial proposal or scope matrix into `.agent-artifacts/requirements/input/` and index it. |

---

## Pillar 4: Repository & Multi-System Topology

| Checkpoint | Pass Criteria | Remediation If Failing |
|---|---|---|
| **4.1 Architecture Topology** | Multi-repo sibling folders or monorepo packages are declared in `project-summary.md`. | If multi-repo, list connected frontend/backend repos and their relative paths. |
| **4.2 Delivery Workbench Integrity** | `.agent-artifacts/requirements/input/` and `output/` folders exist with valid `index.md` files. | Run `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/sync_indexes.ps1` to initialize index structures. |
| **4.3 Script Commit Policy** | Confirmed whether BA artifacts reside in a dedicated repo or source code repo. If in source repo, explicit permission to commit scripts/artifacts is verified (or `.gitignore` configured). | Confirm script commit permission with team lead or configure `.gitignore` to prevent committing scripts to source tree. |
