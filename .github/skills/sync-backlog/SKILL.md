---
name: sync-backlog
description: "Assesses Definition of Ready (DoR) compliance, pushes and pulls Jira/Azure DevOps initiatives, epics, user stories, and linked specs, reconciles sync conflicts, and generates sprint scope, goals, and commitment communications. Use when synchronizing requirement artifacts to Jira or Azure DevOps, pulling sprint scope, or generating sprint commitment emails."
---

# Backlog Sync Skill

Orchestrates backlog lifecycle synchronization with Jira and Azure DevOps, including Definition of Ready (DoR) gatekeeping, parent hierarchy cascading, conflict reconciliation, sprint scope tracking, and sprint goal synthesis.

> [!NOTE]
> **SSOT for Skill Triggers**: The frontmatter `description` above is the **Single Source of Truth** for when to activate this skill. Do NOT repeat a redundant `## When to Use` section in the body—once loaded, the skill is already active. Agents that mount this skill define their dispatch conditions in their own `.agent.md` file.

## References

> Query these files on demand using progressive disclosure. Do not read entire files into context if a targeted lookup suffices:
> - **Jira Field Mapping**: [references/jira-field-mapping.md](references/jira-field-mapping.md) — Jira field mapping table, JQL queries, and component rules
> - **Azure DevOps Field Mapping**: [references/ado-field-mapping.md](references/ado-field-mapping.md) — ADO field mapping table, WIQL queries, and state handling
> - **Sprint Scope Template**: [assets/sprint-scope-template.md](assets/sprint-scope-template.md) — markdown template for sprint scope file and commitment email
> - **Definition of Ready (DoR)**: [../manage-requirement-artifacts/references/definition-of-ready.md](../manage-requirement-artifacts/references/definition-of-ready.md) — gatekeeping criteria for story push readiness

## Prerequisites & Inputs

- **MCP Connectivity**: Either Atlassian MCP (`atlassian/atlassian-mcp-server/*`) or Azure DevOps MCP (`microsoft/azure-devops-mcp/*`) must be configured and connected.
- **Project Key**: Jira project key (e.g., `PROJ`) or Azure DevOps project name must be known or prompted from the user on first invocation.
- **Source Requirement Artifacts**: Approved user stories (`us-*.md`), epics (`epic.md`), GUI specs (`gui-*.md`), API specs (`api-*.md`), diagrams (`diagram-*`), and wireframes (`wireframe-*`) under `.agent-artifacts/requirements/output/<epic-slug>/`.

## Procedure

### Step 1: Intake & MCP Pre-Flight Verification
1. Verify available MCP tools:
   - For Jira: check for `Atlassian:search`, `Atlassian:getIssue`, `Atlassian:getProject`, and issue creation/update tools.
   - For Azure DevOps: check for work item create/update/get and WIQL query tools.
2. If first push in this session, request the project key from the user if not already present in the workspace configuration.
3. Identify target artifacts to synchronize (single story, entire epic, or specific sprint scope).

### Step 2: Push Readiness & Definition of Ready (DoR) Audit
Before pushing any story to the backlog, audit against the in-repo [Definition of Ready (DoR)](../manage-requirement-artifacts/references/definition-of-ready.md):
1. **Deterministic DoR Check**: Run `powershell -NoProfile -File .github/skills/manage-requirement-artifacts/scripts/validate_requirements.ps1 --all --dor`.
2. **Readiness Evaluation**:
   - **Ready to push**: Story satisfies all DoR criteria (compulsory Epic parent, standard INVEST statement, 3-tier Gherkin ACs, linked specs, and zero blocking open questions).
   - **Push with warning**: Story has open questions explicitly marked non-blocking, or assumptions labeled with consequence statements. Inform user before proceeding.
   - **Not ready**: Story fails DoR (missing ACs, unresolved blocking open questions, placeholder/TBD text). Block push and inform user. If user explicitly overrides, push with a warning notice in the work item description.

### Step 3: Push Operation & Hierarchy Cascading
1. Read target story and parent epic files.
2. Determine sync action per artifact:
   - `external_key` empty $\rightarrow$ create new remote work item.
   - File modified after `last_pushed` $\rightarrow$ update existing remote work item.
   - File not modified after `last_pushed` $\rightarrow$ skip (already up to date).
3. **Cascade Up**: If the parent epic or initiative lacks an `external_key`, push the parent work item first. Repeat up the hierarchy so parent keys exist before child linking.
4. **Attachment Decision**: Confirm whether to push story only or also attach linked specs/diagrams/wireframes:
   - Markdown artifacts (`.md` for specs, diagrams, wireframes) are appended directly to the work item description under `Related Specifications`.
   - Non-markdown files (`.bpmn`, `.html`) are uploaded as attachments via MCP.
5. Apply field mappings from [references/jira-field-mapping.md](references/jira-field-mapping.md) or [references/ado-field-mapping.md](references/ado-field-mapping.md).
6. Call MCP tool to create or update the work item and upload any attachments.
7. Receive the external key from the response and update the local file's frontmatter:
   ```yaml
   external_key: "PROJ-123"
   last_pushed: "2026-09-25T18:00:00Z"
   ```
8. Output a concise execution summary: items pushed, items skipped, attachments uploaded, and external keys assigned.

### Step 4: Pull Sprint Scope & Conflict Reconciliation
When querying or reconciling sprint scope:
1. Ask the user for the sprint name or number if not specified.
2. Query backlog items via MCP using standard query patterns:
   - Jira JQL: `sprint = "<Sprint Name>" AND issuetype in standardIssueTypes() ORDER BY parent ASC, priority DESC, issuetype ASC`
   - ADO: WIQL query for the target iteration path.
3. Cross-reference external keys against local workspace story files:
   - Report external stories not found locally.
   - **Conflict Detection**: When remote description or ACs differ from local file content, present the diff to the user.
   - **Conflict Resolution**: Prompt the user to choose:
     - *Keep Local*: re-push local content to overwrite remote.
     - *Keep External*: update local markdown file with remote content.
     - *Manual Merge*: assist user in merging conflicting sections.

### Step 5: Sprint Goal Synthesis & Scope Communications
When generating sprint scope files or commitment communications:
1. **Group & Prioritize**: Group tickets by parent epic or BAU category; identify the highest-priority ticket in each group.
2. **Synthesize Goals**: Generate 3–5 cohesive sprint goals:
   - Formula: **Enhancement Action + Scope + Intended Outcome** (8–14 words).
   - Use result-oriented language (e.g., data completeness, response coverage, checkout flow resiliency).
   - Avoid bug-fix framing unless the sprint is explicitly defect-focused.
3. **Write Sprint Scope File**: Record in `.agent-artifacts/sprint-scope/sprint-N.md` using [assets/sprint-scope-template.md](assets/sprint-scope-template.md).
4. **Generate Sprint Scope Email**:
   - Subject: `<Team name> – Sprint <Sprint number> Scope`.
   - Deliverable ticket table sorted by parent, priority descending, and key.
   - Verify total Story Points (USPs) match the sum of individual ticket points.

## Conditional Branching & Fallbacks

- **Branch: MCP Not Configured or Available**:
  - Halt execution immediately. Inform the user that an active connection to Jira or Azure DevOps MCP server is required.
- **Branch: Story Fails Definition of Ready (DoR)**:
  - Do not push. Report the specific failing criteria. Require user explicit confirmation/override to force-push with warning.
- **Branch: Stale External Key on Remote Update**:
  - If remote update returns 404/Not Found, ask the user to verify if the ticket was moved, deleted, or if the key should be reset.
- **Branch: Partial Push Failure**:
  - Report which items succeeded and which failed. Do not roll back successfully created parent work items.
- **Fallback: Non-Interactive / Automated Pipeline Mode**:
  - If user prompts cannot be answered interactively, run DoR validation, output the readiness report and planned sync actions, and halt without executing remote MCP mutations.

## Deliverables & Consumer Soundness

- **Primary Consumers**:
  - *Engineering & Scrum Teams*: Accurate Jira/ADO work items with linked specifications, explicit Gherkin ACs, and synced story points.
  - *Product Owners & Delivery Leads*: Standardized sprint scope records and polished commitment emails.
- **Physical Artifacts**:
  - Local story frontmatter updates (`external_key`, `last_pushed`).
  - Sprint scope records: `.agent-artifacts/sprint-scope/sprint-N.md`.
  - Sprint scope email draft.

## Anti-Patterns & Negative Constraints

- **Never duplicate frontmatter triggers**: Do not add a `## When to Use` section in the markdown body.
- **Never push unverified requirements**: Always audit against DoR before creating or updating remote work items.
- **Never inject unauthorized frontmatter fields**: Store only `external_key` and `last_pushed` in local frontmatter; do not store assignee, sprint, or story points locally.
- **Never overwrite remote conflicts silently**: Always display diffs and request user confirmation before resolving conflicts.
- **Never roll back parent items on child failure**: Preserve created initiatives or epics when downstream child stories fail.
