# Session Distillation: Generalizing Feedback into Reusable Prompt Assets

## Core Mandate: Abstract Invariants, Never Raw Patch
When updating an agent or skill from session feedback, learnings, or bug fixes:
- **Prohibition**: Never copy-paste session-specific variables, user identities, ticket keys, transient error logs, or verbatim chat dialogue into prompt files.
- **Requirement**: Distill the root friction into an abstract, reusable engineering invariant.
- **Placement**: Route the generalized invariant to its authoritative Single Source of Truth (SSOT).

---

## 1. The Anti-Pattern: "As-Is" Patching

Blindly copying chat context into prompt files leads to rapid prompt degeneration:

| Anti-Pattern | Example of "As-Is" Patching | Consequence |
|---|---|---|
| **Instance Overfitting** | *"When editing `GetResourceDetails`, make sure `payloadItems` is not null."* | Useless for all other endpoints; bloats prompt tokens for irrelevant tasks. |
| **Error Code Hardcoding** | *"If linter outputs code ERR_NULL_42 on line 45, add a fallback default."* | Brittle; fails when lines change; treats symptoms instead of root causes. |
| **Verbatim Dialogue Copying** | *"The user said they prefer camelCase for JSON keys and don't use tuples."* | Degrades prompt clarity; consumes context window on conversational narrative. |
| **SSOT Misplacement** | Adding language coding standards directly inside a specific task agent prompt. | Duplicates standards, causes drift/staleness, and fragments the single source of truth. |
| **Template Narrative Duplication** | Re-explaining frontmatter schemas, ID formatting, or file layouts in narrative preamble paragraphs when an accompanying template already defines them. | Bloats prompt tokens; creates maintenance hazards when templates evolve but prose descriptions become stale. |

---

## 2. The 4-Step Distillation Framework

Follow this structured workflow whenever updating agents or skills from session feedback:

```
┌──────────────────────────────┐
│  1. Session Friction Audit   │  Identify the exact point where failure, friction,
│     (What went wrong?)       │  or user correction occurred during the session.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   2. Pattern Abstraction     │  Strip away session-specific parameters (variable names,
│   (De-parameterization)      │  usernames, ticket IDs, endpoints). Uncover the root invariant.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  3. SSOT Placement Decision  │  Determine the authoritative home for this rule
│   (Where does it belong?)    │  (Global standards, agent roles, skill procedures, references).
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  4. User Elicitation Gate    │  Present the generalized rule to the user for confirmation
│   (Confirm before editing)   │  BEFORE applying surgical, minimal-diff updates.
└──────────────────────────────┘
```

### Step 1: Session Friction & Execution Trajectory Audit
Analyze the conversation trajectory not only for explicit errors, but systematically audit the execution steps taken by the target agent or skill:

1. **Trigger Events & User Corrections**:
   - What specific action did the agent take that caused failure, tool error, or user correction?
   - What boundary, rule, or preference did the user explicitly correct?

2. **Execution Trajectory Audit (Inefficiencies, Unnecessary Steps, Wrong Steps)**:
   - **Inefficiencies**:
     - Did the agent execute slow, sequential operations (e.g. single-file grep, linear tool calls) where parallel execution should be implemented?
     - Did the agent burn LLM context tokens performing deterministic tasks (e.g. searching, file CRUD, index updating, checklist audits) that should be offloaded to helper scripts in `scripts/`?
     - Were massive files read in their entirety when bounded excerpts or metadata index lookups would suffice?
   - **Unnecessary Steps**:
     - Were redundant tool calls made (e.g. re-reading files already in context or inspecting unrelated directories)?
     - Did the agent ask unnecessary questions for information that could be inferred from prompt/workspace context?
     - Was conversational filler, repetitive apologies, or unprompted narrative generated?
   - **Wrong / Erroneous Steps**:
     - Did the agent make ungrounded assumptions or hallucinate file paths, schemas, or tool arguments?
     - Did the agent proceed prematurely before all background or parallel searches completed, missing the full picture?
     - Did the agent enter a cyclic loop or skip mandatory verification gates (e.g. compiling, testing, diff inspection)?

3. **Underlying Invariant & Remediation**:
   - What invariant, constraint, helper script, or workflow gate permanently resolves this friction?

### Step 2: Pattern Abstraction (De-parameterization)
Translate the specific incident into an abstract, invariant engineering rule using this checklist:
- **Strip identities**: Remove personal names, developer handles, ticket IDs (`PROJ-123`), and Git branch names.
- **Strip instance names**: Replace concrete symbols (`order.lineItems[].price`) with abstract patterns (`<entity>.<collection>[].<property>`).
- **Strip transient markers**: Remove specific line numbers, local container hashes, or temporary paths.
- **Identify the "Why"**: Formulate the rule as: *"When [performing action X], always [enforce invariant Y], because [reason Z]."*

### Step 3: SSOT Placement Routing (Single Authoritative Home)
Route the abstracted rule to strictly **ONE** Single Source of Truth. **Crucial Rule:** An invariant must never be applied by scattering duplicate or paraphrased copies across multiple files. Establish one authoritative home; all other files must link to it via progressive disclosure.

| Abstracted Pattern Type | Target SSOT Location (Agnostic Pattern) | Typical File Path Convention |
|---|---|---|
| **Language syntax, naming, formatting** | Shared coding standards | `<instructions-dir>/coding-standards.*` |
| **Testing conventions & scenario structure** | Shared testing standards | `<instructions-dir>/testing.*` |
| **Architectural guidelines & workflows** | Shared development guidelines | `<instructions-dir>/architecture.*` |
| **Agent routing, role boundaries, handoffs** | Agent definition file | `<agents-dir>/<name>.agent.md` |
| **Step-by-step procedural workflows** | Skill procedural guide | `<skills-dir>/<name>/SKILL.md` |
| **Conditional edge cases & error handlers** | Skill branching/fallbacks | `<skills-dir>/<name>/SKILL.md` (Branching section) |
| **Bulky data schemas or reference tables** | Skill reference library | `<skills-dir>/<name>/references/<schema>.md` |

### Step 4: User Elicitation & Confirmation Gate
Before editing any prompt files, present the generalized update to the user:
```markdown
Based on our session, I've distilled the following reusable pattern:
- **Observed Friction**: [Brief recap of failure or correction]
- **Abstracted Invariant**: [Generalized rule or procedural requirement]
- **Target File & Section**: [e.g. `<instructions-dir>/coding-standards.md` under API Serialization]
- **Proposed Diff**: [Minimal surgical edit]

Would you like me to apply this update?
```

---

## 3. Real-World Before / After Generalization Examples

### Case 1: Fixing a Response Serialization Bug
- **Session Event**: When an endpoint returned an empty collection instance, serialization emitted `{"items": []}` in JSON, breaking a consumer that expected property omission (`null`). The user corrected: *"Never return an empty list here, return null"*.
- **Incorrect (As-Is Patch)**:
  > *"When mapping items in `GetResourceDetails`, if there are no items, write `return null;` instead of `new List<Item>();`."*
- **Correct (Generalized Invariant in Coding Standards)**:
  > **Nullable Collections in API Response Contracts**: When an API response model property represents an optional collection, mapping logic must produce `null` rather than an empty collection `[]` when no records exist. This preserves JSON omission semantics and prevents ambiguity between missing records and empty collections.

### Case 2: Environment Precondition Failure
- **Session Event**: An agent executed the test runner command and timed out because a required local database container was stopped.
- **Incorrect (As-Is Patch)**:
  > *"Run `docker start db_service_dev` before running `test-runner`."*
- **Correct (Generalized Invariant in Test Skill Prerequisites)**:
  > **Environment Dependency Verification**: Before invoking integration or end-to-end test suites, verify that all declared runtime dependencies (containers, mock services, test databases) are active and healthy. If any dependency is stopped, initialize it prior to running tests.

### Case 3: Conversational Friction During Requirements Gathering
- **Session Event**: The user said: *"Wait, don't ask 5 questions at once. Ask 2 questions maximum and make a recommendation."*
- **Incorrect (As-Is Patch)**:
  > *"Don't ask 5 questions to the user. Ask 2 questions and recommend option 1."*
- **Correct (Generalized Invariant in Agent Operating Principles)**:
  > **Progressive Elicitation Gate**: When requirements are underspecified, limit clarifying questions to 2–3 per turn. Always accompany questions with a recommended default based on established project conventions.

### Case 4: Verbose, Unstructured Audit Outputs
- **Session Event**: The user said: *"The review response is too long and unstructured to scan. Number the findings so we can refer to them easily and use a table."*
- **Incorrect (As-Is Patch)**:
  > *"When reviewing files, don't write big headings like '[HIGH] - Missing Section', format it into a table."*
- **Correct (Generalized Invariant in Review Rubric & Audit Delivery)**:
  > **Numbered Findings Table**: Review and audit deliverables must present findings in a compact Markdown table with sequential IDs (`F-01`, `F-02`, etc.). Keep cell contents concise (1–2 lines) to enable reviewers to effortlessly scan, reference, and selectively approve specific remediations before presenting detailed diffs.

### Case 5: Preamble Narrative Duplicating Templates & Checklists
- **Session Event**: An authoring guideline opened with multiple narrative paragraphs re-explaining frontmatter fields, scenario ID numbering, and structure exclusions that were already explicitly declared in the companion template and checklist.
- **Incorrect (As-Is Patch / Bloated Prose)**:
  > Writing long descriptive paragraphs at the top of a guideline re-stating every field in the template, how IDs look, and what sections belong where.
- **Correct (Generalized Invariant in Template & Guideline Governance)**:
  > **Template as SSOT for Structure & Layout**: Treat companion templates (`assets/*.template.md`) as the authoritative Single Source of Truth for artifact structure, frontmatter schemas, and formatting examples. Guideline prose must never narrate what the template already demonstrates; restrict introductory text to a link to the template and 1–2 bulleted negative/boundary constraints.
