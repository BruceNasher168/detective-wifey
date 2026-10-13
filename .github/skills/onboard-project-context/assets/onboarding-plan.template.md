# Onboarding Plan Template

When onboarding a new or existing repository, present this structured plan to the user and await approval before modifying files or executing scripts:

---

### High-Level Onboarding Plan

| Phase | Proposed Action | Target Component / File | Source / Baseline Context | Notes / Dependencies |
|---|---|---|---|---|
| **1. Artifact Topology & Script Commit Policy** | `HOST_DEDICATED` \| `HOST_SRC_REPO` | `.agent-artifacts/` & `scripts/` | Dedicated BA repo vs Source Code repo | Script commit permission confirmed or `.gitignore` configured |
| **2. Knowledge Ingestion** | `MAP_STUBS` \| `SKIP` | `.agent-artifacts/project-knowledge-base/wiki/` | `<Discovered doc folders, e.g. docs/, wiki/>` | Progressive hybrid stubs linking to source docs |
| **3. Glossary Extraction** | `EXTRACT` \| `SKIP` | `.agent-artifacts/project-knowledge-base/glossary/` | `<Source documents / acronyms>` | Nouns, actors, and domain terminology |
| **4. Solution Baseline** | `CREATE` \| `UPDATE` | `project-summary.md` | `<Manifests, README, SOW, Architecture>` | Core system overview, tech stack, SOW boundaries |
| **5. Backlog ALM Integration** | `CALIBRATE` \| `DORMANT` | `.github/skills/sync-backlog/references/` | `<Jira Key or ADO Area Path>` | MCP pre-flight and custom field mapping |
| **6. Workflow & DoR Calibration** | `ALIGN` \| `DEFAULT` | `.github/copilot-instructions.md` | `<Team Agile / Scrum conventions>` | 3-tier Gherkin ACs and Artifact Plan gates |

---

### Plan Review Prompt to User

> *"Please review the proposed Onboarding Plan above. You can update any actions, exclude specific documentation folders, or customize the target Jira/ADO settings. Reply with **'Proceed'** to execute step by step, or specify any adjustments you would like to make."*
