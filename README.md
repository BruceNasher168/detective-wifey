# BA Accelerator - Gemini Antigravity Workspace

This repository contains Business Analyst (BA) agent and skill configurations natively tailored for **Google Gemini Antigravity** ([`AGENTS.md`](AGENTS.md), [`mcp_config.json`](mcp_config.json), `.agents/agents/`, `.agents/skills/`) alongside shared starter structures: `.agent-artifacts/project-knowledge-base/` and `.agent-artifacts/requirements/`.

## Getting Started

### Workspace Topology

- **Global instructions**: [`AGENTS.md`](AGENTS.md)
- **MCP servers**: [`mcp_config.json`](mcp_config.json)
- **Custom agents**: `.agents/agents/` ([`ba-onboarding.md`](.agents/agents/ba-onboarding.md), [`business-analyst.md`](.agents/agents/business-analyst.md), [`agent-skill-builder.md`](.agents/agents/agent-skill-builder.md))
- **Custom skills**: `.agents/skills/` (declared in [`.agents/skills.json`](.agents/skills.json))
- **Project Knowledge Base & Requirements**: `.agent-artifacts/`

### Script prerequisites

The core BA utilities run on Windows PowerShell 5.1 or PowerShell 7 without Python or additional PowerShell modules. Run them from the target project directory, or pass `--root "<target-project>"` to onboarding, knowledge-search, and requirement-management utilities:

```powershell
powershell -NoProfile -File .agents/skills/research-project-knowledge/scripts/search_kb.ps1 --root "C:\Projects\MyProject" -q "payment" --json
powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/validate_requirements.ps1 --root "C:\Projects\MyProject" --all --dor --json
```

Use `pwsh` instead of `powershell` when running PowerShell 7. Each script supports `--help`; existing double-hyphen options remain supported. Mapping and index synchronization support `--dry-run`. JSON output goes to stdout and errors to stderr. Exit code `0` means success; `1` indicates a failed audit, mapping item, or screenshot operation; `2` indicates other invalid inputs or execution errors. Onboarding audits return `1` when critical readiness checks fail.

Wireframe screenshots require an installed Edge/Chromium browser. BPMN layout still requires Node.js and `npm ci` (`autolayout_bpmn.js`); other diagram utilities and Office/PDF tooling retain their existing Python and native-tool prerequisites. Requirement validation and index synchronization are run directly via PowerShell scripts within their respective skills.

You can adopt the BA Accelerator into your project using either of two methods:

### Option 1: Download Release Package (Recommended for Individual Projects)
- Go to [BA Accelerator releases](https://github.com/NashTech-Global/BA-accelerator/releases) and download the pre-packaged ZIP: `ba-agents-<version>.zip`.
- Extract the `.agents/` folder, plus `AGENTS.md`, `mcp_config.json`, and `.agent-artifacts/` starter structure directly into your project repository.

### Option 2: Use This Repository Directly (Recommended for Multi-Repo Workspaces)
- Clone or add this `BA-Accelerator` repository as a shared folder inside your Antigravity workspace alongside your system repositories (see [Multi-Repo Workspace Setup](#multi-repo-workspace-setup)).

---

> [!IMPORTANT]
> **Mandatory First Step (In Both Cases)**:
> Whichever method you choose, you **MUST start by invoking `@ba-onboarding`** before initiating any delivery tasks with `@business-analyst`. Do not manually create or edit knowledge bases or backlog configs by hand.

Invoke `@ba-onboarding` in GitHub Copilot:

```text
@ba-onboarding assess this workspace and import our existing project documentation from ./docs and connect our Jira/ADO backlog
```

The onboarding agent will:
1. **Target Project Path Gate**: Prompt you to confirm your target project directory or repository path if not provided (via the interactive `ask_question` tool).
2. **Artifact Hosting & Script Commit Policy Gate**: Confirm whether BA artifacts (`.agent-artifacts/`) are hosted in a dedicated non-source repo or inside the application source repo. If hosted in the source repo, confirm permission to commit automation scripts or configure `.gitignore` to keep source control clean.
3. **Environment Discovery & Audit**: Inspect the confirmed repository's documentation (`docs/`, `wiki/`, `.md`, `.docx`, `.pdf`), Git history and branches for Jira/ADO identifiers, BA artifacts, and workspace topology.
4. **High-Level Onboarding Plan**: Present a structured plan for your review and approval before touching files.
5. **Step-by-Step Execution**: Non-destructively map your existing documentation into `.agent-artifacts/project-knowledge-base/wiki/` via progressive summary stubs, scaffold `project-summary.md` (domain, architecture, actors, SOW baseline, script commit policy), and calibrate Definition of Ready (DoR) gates and Jira/ADO field mappings.
6. **Verification & Review Checklist**: Run an automated verification linter and output an Onboarding Review Checklist (`.agent-artifacts/onboarding-review-checklist.md`).
7. **Guided Smoke Testing & Test-Drive**: Walk you through testing knowledge retrieval, ALM queries, and your first test-drive with `@business-analyst` before active delivery begins.

## Multi-Repo Workspace Setup

To manage requirements across interconnected systems, structure your workspace as follows:

```text
📁 My-Interconnected-Systems/
 ├── 📁 backend-api-repo/        
 ├── 📁 frontend-web-repo/       
 ├── 📁 legacy-database-repo/    
 │
 └── 📁 BA-Accelerator/              
      ├── 📁 .agents/                           (Antigravity workspace)
      │    ├── 📁 agents/                       (ba-onboarding.md, business-analyst.md, ...)
      │    ├── 📁 skills/                       (All 15 procedural skills)
      │    ├── 📁 rules/                        (AGENTS.md rule hierarchy)
      │    └── skills.json                      (Skill registry declarations)
      ├── AGENTS.md                             (Root workspace instructions & agent governance)
      └── mcp_config.json                       (Antigravity MCP server definitions)
```

- Create or open a Gemini Antigravity workspace for your project.
- Add your project's source code repositories (like `backend-api-repo`, `frontend-web-repo`, `legacy-database-repo`) as workspace folders.
- Add this `BA-Accelerator` folder as another workspace folder so the agents and skills are reusable across projects.
- In Gemini Antigravity, `AGENTS.md`, `mcp_config.json`, and `.agents/` load natively.
- **IMPORTANT**: Create or let `@ba-onboarding` scaffold `project-summary.md` at your repository root to summarize the project domain, system architecture, core actors, and commercial baseline.

## How To Use The BA Agents

The workspace provides three dedicated custom agents:

1. **`ba-onboarding` (`@ba-onboarding`)**: The onboarding and workspace integration specialist that audits existing repositories, prompts for project paths via `ask_question`, verifies artifact hosting and script commit permissions, presents a High-Level Onboarding Plan for user approval, maps legacy knowledge bases (Confluence, SharePoint, local docs) via hybrid progressive sync, establishes `project-summary.md`, calibrates Jira / Azure DevOps field mappings, executes automated verification, and guides the user through testing the setup.
2. **`business-analyst` (`@business-analyst`)**: The Single Source of Truth (SSOT) orchestrator coordinating end-to-end BA delivery from intake triage, PACT discovery, scenario classification, and combined Artifact Plan approval through to deliverable authoring and closeout.
3. **`agent-skill-builder` (`@agent-skill-builder`)**: The meta-agent for designing, updating, and auditing custom agents and skills across the workspace.

### Orchestrated Delivery Flow

```text
ba-onboarding (Project Onboarding & Migration)
  ├── 1. Target Project Path Gate (ask_question if path not provided)
  ├── 2. Artifact Hosting & Script Commit Policy Gate (ask_question)
  ├── 3. Environment Discovery & Topology Audit (direct inspection)
  ├── 4. High-Level Onboarding Plan & Approval Gate (STOP & WAIT FOR APPROVAL)
  ├── 5. Step-by-Step Execution:
  │     ├── 5.1: Hybrid Knowledge Ingestion (map_knowledge_base.ps1)
  │     ├── 5.2: Solution Context & SOW Baseline (project-summary.md)
  │     └── 5.3: ALM Integration (Jira / ADO field mappings & MCP)
  ├── 6. Verification & Review Checklist (verify_onboarding.ps1 -> checklist artifact)
  └── 7. Guided Smoke Testing & Test-Drive ("Test it out")
        │
        ▼ (Delivery Handoff)
business-analyst (BA Orchestrator)
  ├── Intake Triage & KB Research (research-project-knowledge)
  ├── Elicitation Gate (elicit-requirements)
  ├── Scope Slicing & INVEST (functional-decomposition)
  ├── Artifact Plan Approval
  ├── Authoring Skills
  │     ├── User Stories & UI Specs (manage-requirement-artifacts)
  │     ├── API Clarification (clarify-api-requirements)
  │     ├── Diagrams (generate-diagram)
  │     └── Wireframes (generate-wireframe)
  └── Closeout & Synchronization
        ├── Durable Wiki Updates (update-project-knowledge)
        └── Backlog Sync (sync-backlog)
```

## Skills Overview

Use skills for artifact-specific outputs after the elicitation and BA-analysis checkpoints.

### 1. Workspace Onboarding & Knowledge Migration Skills

- `onboard-project-context`: Audits existing repository topology, discovers and maps existing documentation into `.agent-artifacts/project-knowledge-base/` via hybrid progressive sync stubs, guides Jira / Azure DevOps MCP configuration, executes automated readiness verification (`verify_onboarding.ps1`), and calibrates Definition of Ready (DoR) gates.
  - Companion scripts: `map_knowledge_base.ps1` (hybrid stub indexer) and `verify_onboarding.ps1` (readiness linter). Environment discovery uses direct repository inspection.
  - Blueprints & Templates: `onboarding-plan.template.md` (high-level plan gate) and `onboarding-review-checklist.template.md` (formal sign-off checklist).

### 2. Core BA Analysis & Delivery Skills

- `elicit-requirements`: Structured requirement elicitation with question batching (2–4 high-impact questions with options), PACT framework, and signed-off elicitation summaries.
- `functional-decomposition`: Scope slicing, INVEST validation, and epic/feature hierarchy breakdown.
- `manage-requirement-artifacts`: Maintains the `.agent-artifacts/requirements/` delivery workbench, initiative navigation and explicit epic files, backlog-ready user stories with 3-tier acceptance criteria (Rule, BDD scenario, Non-functional), and GUI specifications (`gui-*.md`) with UI component tables and change logs.
- `clarify-api-requirements`: BA-oriented API contracts, OpenAPI specifications, request/response data dictionaries, payload body mappings, NFR catalogs, breaking change impact rubrics, and readiness checklists.
- `generate-diagram`: Visual models including BPMN process flows, sequence/activity/state diagrams, use cases, and ERDs.
- `generate-wireframe`: Interactive HTML/text wireframes and responsive screen layout specifications.
- `sync-backlog`: Synchronizes approved requirement artifacts into Jira or Azure DevOps (ADO) backlogs using standardized field mappings (`ado-field-mapping.md`) and produces sprint commitment summaries.

### 3. Project Knowledge Base & Research Skills

- `research-project-knowledge`: Fast, read-only KB research powered by companion scripts (`search_kb.ps1`) for semantic and keyword retrieval, glossary extraction, and token optimization before initiating BA work.
- `update-project-knowledge`: Updates the durable project Wiki (`.agent-artifacts/project-knowledge-base/`) with concept files, YAML frontmatter, progressive indexes, and cross-references.

### 4. Agent & Skill Governance

- `craft-agent-skill`: Powers `@agent-skill-builder` to manage the complete lifecycle of agents (`.agent.md`) and skills (`SKILL.md`):
  - **Creation**: Elicits requirements, conducts active web research for domain best practices, and scaffolds boilerplate files with assigned specialist personas.
  - **Session Distillation**: Audits chat sessions to extract de-parameterized, reusable engineering invariants without raw session patching.
  - **Comprehensive Review**: Audits agents and skills against a 10-dimension architectural rubric to detect overlap, shadow rules, and prompt bloat.

### 5. Office & Document Processing Skills

- `docx`: Creates and edits Microsoft Word (.docx) documents.
- `pptx`: Creates and edits PowerPoint (.pptx) presentations.
- `pdf`: Extracts text, tables, and images, and creates/manipulates PDF documents.
- `xlsx`: Reads, updates, and creates Excel (.xlsx) workbooks and recalculates formulas.

## Quick Routing Guide

- **Mandatory First Step for Any Project (ZIP or Direct Repo)**: Always start with `@ba-onboarding` to audit the repository, map existing documentation, calibrate Jira/ADO, and establish `project-summary.md`.
- **For active BA delivery tasks** (elicitation, scope analysis, user stories, API contracts, diagrams, wireframes, backlog syncing): Use `@business-analyst` once onboarding is certified.
- **For creating, updating, or reviewing agents and skills**: Use `@agent-skill-builder`.
- **For direct artifact requests** (when requirements are already fully established): Invoke the matching skill directly (e.g., `clarify-api-requirements`, `generate-diagram`, `generate-wireframe`, `sync-backlog`).
- **For maintenance of requirements hierarchy**: Use `manage-requirement-artifacts`.
- **For durable Wiki updates**: Use `update-project-knowledge` after artifact sign-off.

## Quality Standards & Governance

Deliverables in this workspace adhere to rigorous quality benchmarks:
- **Definition of Ready (DoR)**: Gating criteria that all user stories, acceptance criteria, and API contracts must satisfy prior to sprint intake.

## Suggested VS Code Extensions

### Diagrams

- BPMN Editor: https://marketplace.visualstudio.com/items?itemName=bpmn-io.vs-code-bpmn-io
- draw.io: https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio

### Markdown Utilities

- MarkItDown: https://marketplace.visualstudio.com/items?itemName=bioinfo.markitdown-vscode
- Markdown Paste Image: https://marketplace.visualstudio.com/items?itemName=telesoho.vscode-markdown-paste-image
- Markdown & Office Editor: https://github.com/cweijan/vscode-office

## Model Context Protocol (MCP) Configuration

This workspace integrates with external ALM tools via the Model Context Protocol:

### Google Gemini Antigravity
MCP servers are declared in [`mcp_config.json`](mcp_config.json) at repository root:
- `atlassian`: `@modelcontextprotocol/server-atlassian` (Jira Cloud issue retrieval, updates, and creation)
- `azure-devops`: `@modelcontextprotocol/server-azure-devops` (Azure DevOps work items and WIQL queries)

To configure credentials, provide your instance URL, email/user, and API token / PAT in your environment or `mcp_config.json`.

### VS Code & GitHub Copilot
In VS Code, open Extensions/Plugins and search for `@mcp <mcp-name>`:
- `@mcp atlassian`
- `@mcp Azure DevOps`
- `@mcp figma` (if using Figma design tokens)

