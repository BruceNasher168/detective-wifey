---
name: onboard-project-context
description: "Audits workspace environment, discovers and maps existing knowledge bases (Confluence, SharePoint, Markdown, Word, PDF) into .agent-artifacts/project-knowledge-base/ via hybrid progressive sync, configures Jira and Azure DevOps MCP connections and custom field mappings, and customizes BA workspace instructions and Definition of Ready (DoR) gates. Use when onboarding a new or existing repository to the BA Accelerator, migrating legacy documentation, or calibrating Jira/ADO ALM integration."
---

# Onboard Project Context Skill

Orchestrates the rapid adoption of the BA Accelerator framework into an existing or new project repository, preserving institutional knowledge bases, aligning custom BA delivery workflows, and integrating with Jira or Azure DevOps (ADO).

> [!NOTE]
> **SSOT for Skill Triggers**: The frontmatter `description` above is the **Single Source of Truth** for when to activate this skill. Do NOT repeat a redundant `## When to Use` section in the body—once loaded, the skill is already active. Agents that mount this skill define their dispatch conditions in their own `.agent.md` file.

## References & Assets

> Query these files on demand using progressive disclosure. Do not read entire files into context if a targeted lookup suffices:
> - **Onboarding Plan Template**: [assets/onboarding-plan.template.md](assets/onboarding-plan.template.md) — high-level plan blueprint and user review gate
> - **Onboarding Review Checklist Template**: [assets/onboarding-review-checklist.template.md](assets/onboarding-review-checklist.template.md) — physical sign-off checklist artifact template
> - **Onboarding Readiness Rubric**: [references/onboarding-rubric.md](references/onboarding-rubric.md) — 4-pillar checklist for project onboarding readiness
> - **Jira & ADO Integration Guide**: [references/jira-ado-setup-guide.md](references/jira-ado-setup-guide.md) — MCP configuration, custom field extraction, and troubleshooting
> - **Definition of Ready (DoR)**: [../manage-requirement-artifacts/references/definition-of-ready.md](../manage-requirement-artifacts/references/definition-of-ready.md) — standard quality gates for user story intake
> - **Jira Field Mapping**: [../sync-backlog/references/jira-field-mapping.md](../sync-backlog/references/jira-field-mapping.md) — authoritative Jira field mapping dictionary
> - **Azure DevOps Field Mapping**: [../sync-backlog/references/ado-field-mapping.md](../sync-backlog/references/ado-field-mapping.md) — authoritative ADO field mapping dictionary

## Prerequisites & Inputs

- **Target Project Path**: Confirmed path to the target repository or folder being onboarded (must be explicitly provided by the user or elicited via `ask_question`).
- **Target AI Platform**: Confirmed AI assistant/workspace environment (Google Gemini / Antigravity as recommended, GitHub Copilot, Kiro, Anthropic Claude, OpenAI Codex, Cursor, or Multi-Platform / Universal).
- **Artifact Hosting & Commit Permission**: Explicit confirmation of whether BA artifacts (`.agent-artifacts/`) are generated in a dedicated non-source repo or directly in the application source code repo. If in the source code repo, explicit confirmation of whether committing automation scripts (`.agents/skills/*/scripts/`) and `.agent-artifacts/` into source control is permitted.
- **Workspace Access**: Read and write access to the workspace root directory and `.agent-artifacts/`.
- **Target Project Documentation**: Any existing specifications, wiki pages, diagrams, or proposal documents in folders like `docs/`, `wiki/`, or sibling repositories.
- **ALM Credentials (Optional)**: Atlassian or Azure DevOps credentials if configuring backlog synchronization during onboarding.

---

## Procedure

### Step 1: Target Project Path Verification Gate (Stop & Ask)
1. Inspect the user prompt for an explicit project folder or repository path.
2. **If path is missing or ambiguous**:
   - **STOP IMMEDIATELY**.
   - Invoke the `ask_question` tool:
     - **Question**: *"Which project repository or folder would you like to onboard into the BA Accelerator?"*
     - **Option 1 (Recommended)**: *"Current workspace root (`./`)"*
     - **Option 2**: *"[Select detected sibling repository] (e.g. `../<sibling-repo>`)"*
     - **Option 3**: *"[Enter custom project folder path]"*
   - Wait for the user's selection before initiating any scans or authoring tasks.

### Step 2: Target AI Agent Workspace Platform Gate (Stop & Ask)
1. Invoke the `ask_question` tool to determine the target AI workspace platform:
   - **Question**: *"Which AI agent workspace platform are you setting up this repository for?"*
   - **Option 1 (Recommended)**: *"Google Gemini / Antigravity (configures `AGENTS.md`, `.agents/agents/`, `.agents/skills/`, and `mcp_config.json`)"*
   - **Option 2**: *"GitHub Copilot (VS Code — configures `.github/copilot-instructions.md`, `.github/agents/`, and `.vscode/mcp.json`)"*
   - **Option 3**: *"Kiro (AWS Spec-Driven IDE — configures `.kiro/steering/`, `.kiro/specs/`, and MCP)"*
   - **Option 4**: *"Anthropic Claude (Claude Code / Desktop — configures `CLAUDE.md`, `.claude/rules/`, and MCP)"*
   - **Option 5**: *"OpenAI Codex (configures `CODEX.md` / `INSTRUCTIONS.md` and Assistant prompts)"*
   - **Option 6**: *"Cursor (configures `.cursorrules`, `.cursor/rules/*.mdc`, and `.cursor/mcp.json`)"*
   - **Option 7**: *"Multi-Platform / Universal (scaffolds interoperable instructions referencing SSOT artifacts across all platforms)"*
2. Determine platform-specific scaffolding based on the user's selection.

### Step 3: Artifact Hosting Location & Script Commit Policy Gate (Stop & Confirm)
1. Invoke the `ask_question` tool to determine hosting topology:
   - **Question**: *"Where should BA artifacts (`.agent-artifacts/`) and automation skills be hosted?"*
   - **Option 1 (Recommended)**: *"Dedicated non-source repo / folder (e.g. separate requirements repository or shared BA folder)"*
   - **Option 2**: *"Directly inside the application source code repository"*
2. **If Option 2 (Inside application source repo) is selected**:
   - Prompt the user with a mandatory script commit permission question:
     - **Question**: *"Are you permitted to commit BA automation scripts (`.agents/skills/*/scripts/`) and `.agent-artifacts/` directly into this application source code repository?"*
     - **Option 1 (Permitted)**: *"Yes, commit scripts and artifacts directly into source control."*
     - **Option 2 (Restricted / Configure .gitignore)**: *"No, keep source control clean. Add scripts and `.agent-artifacts/` to `.gitignore`."*
3. **Action Based on User Response**:
   - If restricted: Append `.agent-artifacts/` and `.agents/skills/*/scripts/` to `.gitignore` in the target project root and document the local-only script execution policy in `project-summary.md`.
   - If permitted or hosted in a dedicated repo: Document the confirmed hosting topology and script commit policy in `project-summary.md`.

### Step 4: Pre-Flight Environment Discovery & Workspace Audit
1. Inspect the confirmed target repository directly. Inventory documentation folders, inspect Git history and branches for backlog identifiers, and check BA artifacts and repository topology. Exclude dependency, build, and Git internals from the documentation inventory.
2. Record evidence from that inspection to identify:
   - **Accelerator Baseline**: Presence of `project-summary.md` and status of `.agent-artifacts/`.
   - **Existing Documentation**: Location, formats (`.md`, `.docx`, `.pdf`), and volume of existing documentation assets.
   - **Backlog Management Clues**: Detected Jira project keys (e.g. `PROJ`) or Azure DevOps work item tags (`#123`, `AB#123`).
   - **Workspace Topology**: Single-repository vs multi-repo sibling architecture.
3. Present an executive summary of the environment findings to the user.

### Step 5: High-Level Onboarding Plan & User Approval Gate
Before authoring any files, generating stubs, or modifying configurations, formulate a structured **High-Level Onboarding Plan** based on [assets/onboarding-plan.template.md](assets/onboarding-plan.template.md):

| Phase | Proposed Action | Target Component / File | Source / Baseline Context | Notes / Dependencies |
|---|---|---|---|---|
| **1. Platform Workspace Scaffolding** | `SCAFFOLD` | Target platform manifests | User's AI workspace setup | GitHub Copilot (preferred), Kiro, Claude, Gemini, Codex, Cursor |
| **2. Artifact Topology & Script Commit Policy** | `HOST_DEDICATED` \| `HOST_SRC_REPO` | `.agent-artifacts/` & `scripts/` | Dedicated BA repo vs Source Code repo | Script commit permission confirmed or `.gitignore` configured |
| **3. Knowledge Ingestion** | `MAP_STUBS` \| `SKIP` | `.agent-artifacts/project-knowledge-base/wiki/` | Discovered doc folders (`docs/`, `wiki/`) | Progressive hybrid stubs linking to source docs |
| **4. Glossary Extraction** | `EXTRACT` \| `SKIP` | `.agent-artifacts/project-knowledge-base/glossary/` | Source documents / acronyms | Nouns, actors, and domain terminology |
| **5. Solution Baseline** | `CREATE` \| `UPDATE` | `project-summary.md` | Manifests, README, SOW, Architecture | Core system overview, tech stack, SOW boundaries, Script commit policy |
| **6. Backlog ALM Integration** | `CALIBRATE` \| `DORMANT` | `.agents/skills/sync-backlog/references/` | Jira Key or ADO Area Path | MCP pre-flight and custom field mapping |
| **7. Workflow & DoR Calibration** | `ALIGN` \| `DEFAULT` | Target platform instructions | Team Agile / Scrum conventions | 3-tier Gherkin ACs and Artifact Plan gates |

**Mandatory Gate**: Present this plan to the user and prompt:
> *"Please review the proposed Onboarding Plan above. You can update any actions, exclude specific documentation folders, or customize the target Jira/ADO settings. Reply with **'Proceed'** to execute step by step, or specify any adjustments you would like to make."*
**HALT execution and wait for user confirmation before proceeding.**

### Step 6: Step-by-Step Execution
Once the user confirms the plan, execute each approved phase sequentially:

1. **Step 6.1: Platform Workspace Scaffolding**:
   - Scaffold the platform-specific instructions, steering files, or agent manifests based on the confirmed target platform:
     - **Google Gemini / Antigravity**: Ensure `AGENTS.md`, `.agents/agents/`, `.agents/skills/`, and `mcp_config.json`.
     - **GitHub Copilot**: Ensure `.github/copilot-instructions.md`, `.github/agents/`, and `.vscode/mcp.json`.
     - **Kiro**: Generate `.kiro/steering/product.md`, `tech.md`, and `structure.md`, map `.kiro/specs/` to `.agent-artifacts/requirements/`, and scaffold `.kiro/mcp.json`.
     - **Anthropic Claude**: Scaffold `CLAUDE.md`, `.claude/rules/`, and `.claude/mcp.json`.
     - **OpenAI Codex**: Scaffold `CODEX.md` / `INSTRUCTIONS.md` and Assistant prompts.
     - **Cursor**: Scaffold `.cursorrules`, `.cursor/rules/*.mdc`, and `.cursor/mcp.json`.
     - **Multi-Platform / Universal**: Scaffold thin platform entry points pointing to root `project-summary.md` and `.agent-artifacts/`.
2. **Step 6.2: Hybrid Knowledge Ingestion & Indexing**:
   - If `MAP_STUBS` is selected: Run `map_knowledge_base.ps1` on the confirmed source paths:
     ```powershell
     powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/map_knowledge_base.ps1 --source <path-to-docs>
     ```
   - If `EXTRACT` is selected: Extract domain nouns and acronyms into `.agent-artifacts/project-knowledge-base/glossary/<term>.md`.
3. **Step 6.3: Solution Context & SOW Baseline Scaffolding**:
   - Scaffold or update `project-summary.md` at the repository root covering:
     - Project Name & Domain Overview
     - System Architecture & Technology Stack
     - Primary Personas / User Roles
     - Core Integrations & Third-party Services
     - Commercial Scope Baseline (Contractual boundaries vs Change Request triggers)
     - Repository Governance & Script Commit Policy (dedicated vs source repo; script commit permissions or `.gitignore` isolation)
   - Record any project-specific Definition of Ready (DoR) overrides.
4. **Step 6.4: Backlog ALM Integration (Jira / Azure DevOps)**:
   - Check MCP server connectivity (`atlassian` or `azure-devops`).
   - If Jira: Configure Project Key and custom field IDs in `jira-field-mapping.md`.
   - If Azure DevOps: Configure Organization, Project, Area Path, and Iteration Path in `ado-field-mapping.md`.
   - If MCP is offline: Record dormant configuration and reference [references/jira-ado-setup-guide.md](references/jira-ado-setup-guide.md).

### Step 7: Automated Verification & Review Checklist
1. Execute the automated onboarding verification script:
   ```powershell
   powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/verify_onboarding.ps1 --output .agent-artifacts/onboarding-review-checklist.md
   ```
2. Present the populated **Onboarding Review Checklist** (based on [assets/onboarding-review-checklist.template.md](assets/onboarding-review-checklist.template.md)) to the user.
3. Verify that all critical checkpoints (`[PASS]`) are satisfied.

### Step 8: Guided Smoke Testing & Test-Drive ("Test it out")
Guide the user through immediate interactive smoke testing to verify the end-to-end setup before regular delivery begins:

1. **Test Drive 1: Knowledge Base Search Test**:
   - Run or prompt the user to run:
     ```powershell
     powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 -q "<sample project concept>"
     ```
   - Verify that the newly indexed progressive stubs return expected excerpts and valid source file links.
2. **Test Drive 2: Backlog Query Test (If ALM configured)**:
   - Run a sample read-only query (e.g. fetching an issue or sprint scope via MCP) to confirm API token permissions.
3. **Test Drive 3: Orchestrator Test-Drive with `@business-analyst`**:
   - Provide a copy-pasteable test prompt for the user to try with `@business-analyst`:
     > *"@business-analyst I need to analyze a new feature for [Feature/Module]. Please review our project summary and search our knowledge base to establish the baseline scope."*
   - Verify that `@business-analyst` reads `project-summary.md`, searches the stubs, and initiates the elicitation gate.

---

## Conditional Branching & Fallbacks

- **Branch: No Existing Documentation (Greenfield Project)**:
  - Skip `map_knowledge_base.ps1`.
  - Prompt the user with 3-4 structured questions to capture the core domain, MVP goals, and actors to seed `project-summary.md`.
- **Branch: MCP Server Unavailable or Not Installed**:
  - Do not block onboarding.
  - Document the target Project Key and field mappings offline in `jira-field-mapping.md` / `ado-field-mapping.md`.
  - Provide setup instructions from [references/jira-ado-setup-guide.md](references/jira-ado-setup-guide.md) for later activation.
- **Branch: Multi-Repository Workspace**:
  - Ensure `project-summary.md` includes the relative paths to sibling repositories.
  - In `copilot-instructions.md`, verify instructions allow cross-repo reading.
- **Fallback: Non-Interactive / Automated Pipeline Mode**:
  - Inspect the confirmed repository's documentation, manifests, Git metadata, and BA artifacts directly.
  - Generate a draft `project-summary.md` from README/manifest files.
  - Run `verify_onboarding.ps1 --output .agent-artifacts/onboarding-review-checklist.md` and halt without executing external mutations.

---

## Deliverables & Consumer Soundness

- **Primary Consumers**:
  - *Business Analysts & Delivery Leads*: Clear onboarding status report, customized `project-summary.md`, verified review checklist, and immediate delivery readiness.
  - *AI Agents (`@business-analyst`)*: Token-optimized Knowledge Base stubs with source pointers and calibrated field mappings.
- **Physical Deliverables**:
  - Root `project-summary.md`.
  - Onboarding Review Checklist: `.agent-artifacts/onboarding-review-checklist.md`.
  - Knowledge Base stubs in `.agent-artifacts/project-knowledge-base/wiki/*.md`.
  - Calibrated field mappings in `.agents/skills/sync-backlog/references/`.
  - Verified onboarding status record.

## Core Tooling (in `scripts/`)

Directly invoke these utilities using the exact CLI syntax below; do not inspect script source code unless diagnosing an execution error:

| Utility | Script Command | Description |
|---|---|---|
| **Knowledge Base Mapper** | `powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/map_knowledge_base.ps1 --source "<path-to-docs>"` | Scans external/internal docs and generates hybrid progressive summary stubs linking back to originals. |
| **Onboarding Verifier** | `powershell -NoProfile -File .agents/skills/onboard-project-context/scripts/verify_onboarding.ps1 --output .agent-artifacts/onboarding-review-checklist.md` | Validates end-to-end onboarding completeness and outputs review checklist. |

---

## Anti-Patterns & Negative Constraints

- **Never duplicate frontmatter triggers**: Do not add a redundant `## When to Use` section in the markdown body.
- **Never perform destructive document overwrites**: Always preserve original project documentation; map via hybrid progressive stubs rather than displacing original files.
- **Never guess custom Jira/ADO field IDs**: Verify via MCP test query or ask the project BA/admin.
- **Never proceed with delivery without a baseline `project-summary.md`**: Ensure core project summary exists before handing off to `@business-analyst`.
