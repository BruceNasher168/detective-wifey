# Jira & Azure DevOps (ADO) Integration Setup Guide

This guide details how to configure Model Context Protocol (MCP) servers and calibrate field mappings when adopting the BA Accelerator into an existing Jira or Azure DevOps workspace.

---

## 1. Atlassian Jira Integration

### Step 1.1: MCP Configuration
Ensure the Atlassian MCP server is registered in your environment configuration (e.g., `mcp_config.json` for Gemini Antigravity, `.vscode/mcp.json` for VS Code Copilot, or agent config):

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

### Step 1.2: Discovering Custom Field IDs
Jira Cloud instances often assign unique IDs to custom fields (e.g. `customfield_10014` for Epic Link or Parent).
To discover custom field IDs:
1. Run a test issue query via MCP: `Atlassian:getIssue(issueIdOrKey="SAMPLE-1")`.
2. Inspect the returned JSON payload to locate:
   - Story Points field name (e.g., `customfield_10026`).
   - Epic Name or Parent Link.
   - Acceptance Criteria custom field (if not part of the standard `description`).
3. Update `.agents/skills/sync-backlog/references/jira-field-mapping.md` with the verified keys.

---

## 2. Microsoft Azure DevOps (ADO) Integration

### Step 2.1: MCP Configuration
Register the Azure DevOps MCP server in your workspace configuration (`mcp_config.json`):

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-azure-devops"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/your-organization",
        "AZURE_DEVOPS_PAT": "your-personal-access-token"
      }
    }
  }
}
```

### Step 2.2: Discovering Area & Iteration Paths
ADO requires valid Project, Area Path, and Iteration Path hierarchies:
1. Query a sample work item via MCP: `azure-devops:getWorkItem(id=123)`.
2. Extract:
   - `System.AreaPath` (e.g., `ProjectName\\FeatureTeam`).
   - `System.IterationPath` (e.g., `ProjectName\\Sprint 24`).
   - `Microsoft.VSTS.Common.AcceptanceCriteria` field usage.
3. Update `.agents/skills/sync-backlog/references/ado-field-mapping.md` with the verified path schemas.

---

## 3. Calibrating Status Transitions

Ensure your project's board workflow matches the push/pull states in `sync-backlog`:
- **Draft Requirements**: Local markdown only (`status: draft`).
- **Refined / Backlog Intake**: Pushed to remote board as `To Do` / `New` with `external_key` recorded in frontmatter.
- **In Development**: Status synchronized on pull requests.
