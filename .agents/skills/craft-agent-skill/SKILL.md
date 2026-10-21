---
name: craft-agent-skill
description: "Create new custom agents and skills, update or refactor existing ones, distill session feedback and bug fixes into generalized architectural patterns, or review and audit existing agents and skills against architectural best practices"
---

# Craft Agent & Skill

Orchestrates the end-to-end lifecycle of custom agents (`.agent.md`) and procedural skills (`SKILL.md`):
- **High-Performance Prompts**: Deliver clean execution flow with minimal token waste.
- **Strict DRY & SSOT**: Enforce zero duplicated standards or shadow rules.
- **Reliable Boundaries**: Maintain unambiguous triggers with clean handoffs.
- **Consumer Soundness**: Produce artifacts structurally tailored for AI, code/compilers, or humans.

---

## Core Architectural Principles

All agents and skills designed or reviewed under this skill MUST strictly adhere to these 10 principles:

1. **Mandatory Elicitation, Progressive Discovery & "Infer First, Ask with Options" Rule**:
   - **Interpret First**: Exhaustively analyze prompt, request metadata, and workspace context first. **Only ask if something cannot be interpreted from the prompt**. Never interrogate the user for details already supplied or inferable.
   - **Progressive Discovery & Staged Inquiry**: Structure discovery into logical, sequential tiers (Tier 1: Objective & Boundaries → Tier 2: Workflow & Architecture → Tier 3: Schemas, Tools & Edge Cases). Never interrogate users about low-level configuration, deep parameters, or rare edge cases before confirming foundational goals and scope baseline.
   - **Branch-Aware Progression**: Formulate next-tier questions dynamically based on confirmed choices rather than asking speculative questions about unselected paths.
   - **No Pure Open-Ended Questions**: Formulate clarification questions with a **Recommended Approach** alongside concrete **Options (with Pros & Cons)**.
   - **Discipline & Pacing**: Ask **2–4 high-impact questions per turn**.
2. **Sound & Sensible Trigger Workflows**:
   - **SSOT Triggers**: Skill triggers belong exclusively in YAML frontmatter `description`; agent dispatch belongs in skill routing sections (e.g. `Mounted Skills & When to Dispatch` / `Mounted Skills & When to Use`).
   - **Isolation**: Triggers must be distinct, unambiguous, and non-overlapping.
3. **Strict DRY & SSOT (Single Source of Truth)**:
   - **Single Home**: Every rule, instruction, or check must live in strictly ONE authoritative file. Never duplicate or paraphrase rules across files.
   - **Referencing Over Duplication**: Link to authoritative SSOT files via progressive disclosure instead of copying rules inline.
4. **Token Optimization & Progressive Disclosure**:
   - **Lean Prompts**: Eliminate conversational filler, fluff, and formatting micromanagement.
   - **Offloading**: Move large schemas, rubrics, templates, and deep documentation into `references/`.
5. **Clean Conditional Branching**:
   - Keep the happy path linear. Isolate edge cases, non-interactive modes, and fallbacks using explicit `IF / THEN / ELSE` structures.
6. **Consumer-Targeted Artifact Soundness**:
   - Format deliverables specifically for their primary consumer:
     - *AI / Subagents*: Machine-parseable schemas (JSON/YAML), structured tables, zero conversational filler.
     - *Code / Compilers*: Valid syntax, exact file paths, zero compile/lint errors.
     - *Humans*: Scannable visual hierarchy, executive summaries, actionable next steps.
7. **Pattern Generalization over Raw Patching**:
   - **De-parameterize**: Strip instance-specific ticket IDs, entity names, URLs, or one-off code snippets from session feedback.
   - **Abstract Invariants**: Formulate reusable, universal architectural rules in their authoritative SSOT file (see [references/session-distillation.md](references/session-distillation.md)).
8. **Mandatory Assigned Agent Persona & Role Authority**:
   - **Explicit Persona Profile**: Every agent MUST have an explicitly assigned professional persona defining its identity, domain specialization, professional demeanor/tone, and operational mindset.
   - **Zero Generic Assistants**: Never frame agents as generic AI chatbots or vanilla assistants. Agents must embody authoritative specialists with domain-appropriate judgment.
9. **Industry Best Practice & Domain Grounding**:
   - **Task-Driven Domain Research**: Conduct targeted research on industry standards (e.g., BABOK/IREB, OpenAPI, INVEST/BDD, OWASP, Clean Architecture) via web search (`search_web`, `read_url_content`, or delegate to `research` subagent).
   - **Incorporate Battle-Tested Patterns**: Ground personas, workflows, verification criteria, and quality standards in proven industry heuristics.
10. **Script Automation, Parallel Execution & Token Economy**:
    - **Proactive Script Offloading**: Offload deterministic procedural steps (research/lookup, artifact CRUD, review checklists) to companion helper scripts in `scripts/` to eliminate LLM token burn.
    - **Parallel Execution & Synchronization Barrier**: Execute multi-faceted operations in parallel and enforce a mandatory wait barrier for all executions to complete before synthesizing results ("Full Picture").
    - **Anti-Loop & Read Optimization**: Enforce recursion depth limits, retry caps, circuit breakers, and targeted excerpt/index reading over loading full massive files.
11. **High-Signal Negative Constraints (Anti-Patterns vs Self-Mirroring Paradox)**:
    - **Filter Out Negative Mirroring**: Never write anti-patterns that merely invert or restate positive procedural instructions (e.g., "Do not skip validation"). Such constraints are pure token dead-weight.
    - **Valid Negative Constraints**: Only apply negative constraints that suppress pre-trained LLM default reflexes (de-biasing), prevent cross-boundary domain creep, or halt destructive side-effects.
    - **Omission When Purely Procedural**: If an asset's workflow is strictly linear and procedural with no external model hazards, omit the `## Anti-Patterns` section entirely.

---

> [!IMPORTANT]
> **The Stop-and-Ask Circuit Breaker**: If at ANY point during execution (discovery, codebase inspection, drafting, distillation, or review report generation) a requirement, dependency, or step cannot be interpreted from the prompt or workspace: **STOP IMMEDIATELY**. Do NOT guess or extrapolate blindly. Pause and ask the user with a **Recommended Approach and structured Options (annotating Pros & Cons)** before continuing. Never ask pure open-ended questions.

---

## References & Assets

Query these sub-documents using progressive disclosure:

**Methodology & Rules (`references/`)**:
- **Elicitation Questionnaire & Strategy**: [references/elicitation-guide.md](references/elicitation-guide.md)
- **Session Distillation & Pattern Extraction**: [references/session-distillation.md](references/session-distillation.md)
- **Comprehensive Review Rubric & Audit Template**: [references/review-rubric.md](references/review-rubric.md)

**Scaffolding Blueprints (`assets/`)**:
- **Agent Boilerplate Template**: [assets/agent.template.md](assets/agent.template.md)
- **Skill Boilerplate Template**: [assets/skill.template.md](assets/skill.template.md)

---

## Operating Modes

Identify the user's intent and follow the corresponding workflow:

| Operating Mode | User Intent / Trigger | Core Workflow Steps |
| :--- | :--- | :--- |
| **Mode 1: Creation Mode** | Create new custom agent (`.agent.md`) or skill (`SKILL.md`) | 1. Elicitation Gate → 2. SSOT & Domain Research → 3. Scaffold & Draft → 4. Review Rubric Self-Audit |
| **Mode 2: Update Mode** | Modify / refactor existing asset or distill session learnings | 1. Update Elicitation & Distillation → 2. Pre-Update Scan → 3. Targeted Refactoring → 4. Post-Update Verification |
| **Mode 3: Review Mode** | Audit and diagnose agents, skills, or prompt architecture | 1. Scope & Goal Gate → 2. Deep Rubric Audit → 3. Conflict Matrix & Diff Report → 4. Refactoring Execution |

---

## Mode 1: Creating a New Agent or Skill

### Step 1: Mandatory Elicitation Gate
Follow [references/elicitation-guide.md](references/elicitation-guide.md) before creating files or drafting prompts:
- **Interpret First, Ask Only What Cannot Be Inferred**: Extract all known requirements, roles, boundaries, and tools from prompt and workspace context first.
- **Progressive Discovery Staging**:
  - *Stage 1 (Strategic Baseline)*: Primary objective & bottleneck, governing industry standards, activation triggers, and scope boundaries.
  - *Stage 2 (Architectural Mechanics)*: Input/output deliverables, target consumer format (AI/Code/Human), step-by-step workflow sequence, script automation in `scripts/`, and parallel execution with wait-for-all barrier.
  - *Stage 3 (Tactical Configuration)*: Component-specific extensions (persona profile and tool permissions for agents; CLI commands and progressive disclosure offloading into `references/` for skills; edge-case fallbacks).
- **Discipline & Pacing**: Ask **2–4 high-impact questions per turn**. Advance to the next stage only after previous choices are confirmed. **Never assume the manual workflow**.

### Step 2: Workspace Conflict Scan & Industry Best Practice Research
1. **Workspace Conflict & SSOT Scan**:
   - Scan workspace directories (`.agents/agents/`, `.agents/skills/`, `AGENTS.md`):
     - **Overlap Detection**: Verify whether an existing agent or skill already covers this domain or intent.
     - **Boundary Definition**: If partial overlap exists, extend the existing asset or define sharp boundary splits.
     - **SSOT Discovery**: Identify authoritative instruction files to link rather than duplicate.
2. **Targeted Industry Best Practice & Domain Research (Active Web Search)**:
   - **Task Profiling**: Identify governing domain methodologies and technical conventions (e.g., BABOK/IREB for BA, OpenAPI/AsyncAPI for APIs, INVEST/BDD for stories, OWASP for security, Clean Architecture/DDD for software design).
   - **Active Web Search Execution**: Execute targeted queries via `search_web`, inspect authoritative URLs via `read_url_content`, or delegate to `research` subagent:
     - Run high-signal searches: `"<domain/task> industry best practices"`, `"<standard name> specification"`, `"<methodology> workflow steps and quality gates"`.
     - Inspect authoritative links and standard specifications (IIBA, W3C, ISO, OpenAPI, OWASP) for standard phases, checklists, verification gates, schema formats, and anti-patterns.
   - **Synthesize Battle-Tested Heuristics**: Integrate researched best practices directly into:
     - *Agent Persona & Principles*: Ground persona in recognized professional standards (specialization, methodology, operational mindset).
     - *Execution Workflow*: Structure steps according to industry-standard phases and verification checkpoints.
     - *Deliverable Standards*: Enforce industry-standard output schemas and conventions for the target consumer.

### Step 3: Scaffold & Draft
1. **Instantiate Template**:
   - **For an Agent**: Instantiate [assets/agent.template.md](assets/agent.template.md) to `.agents/agents/<name>.md`. Mandate an explicit Assigned Persona Profile (identity, domain depth, professional tone, operational mindset) to establish authoritative leadership; never allow generic assistant framing.
   - **For a Skill**: Instantiate [assets/skill.template.md](assets/skill.template.md) to `.agents/skills/<name>/SKILL.md`. Structure steps and verification commands according to industry best practices.
2. **Define Triggers in Frontmatter**: Write an actionable, third-person `description` stating both **WHAT** it does and **WHEN** to invoke it.
3. **Enforce Progressive Disclosure**: Keep root prompt files lean; offload schemas, reference tables, and deep documentation into `references/`.
4. **Scaffold Companion Automation Scripts (`scripts/`)**:
   - Scaffold helper scripts in `scripts/` (Python/shell) for deterministic research/lookup, artifact CRUD, and review checklists.
   - Implement parallel multi-query/multi-file execution; instruct the agent to wait for all executions before synthesizing findings.
   - Enforce anti-loop guards (max retries, recursion limits) and read-optimization (targeted excerpts, caching).

### Step 4: Mandatory Review Rubric Self-Audit Gate
Run a self-audit against [references/review-rubric.md](references/review-rubric.md) before finalizing or saving files:
- [ ] **Baseline 1 (Trigger Soundness & Assigned Persona)**: Unambiguous `description`, clean activation boundaries, zero overlap, and explicit assigned agent persona (no generic assistant framing).
- [ ] **Baseline 2 (DRY & SSOT)**: Zero copy-pasted rules; points directly to centralized instruction files.
- [ ] **Baseline 3 (Token Economy & Script Offloading)**: Zero conversational filler, formatting micromanagement, or canned speech; deterministic tasks offloaded to `scripts/`.
- [ ] **Baseline 4 (Branching & Loop Prevention)**: Explicit `IF / THEN / ELSE` paths for edge cases, non-interactive mode, fallbacks, and strict recursion/loop limits.
- [ ] **Baseline 5 (Consumer Soundness & Tool Grounding)**: Grounded verbs, verification checkpoints, deliverables tailored for target consumer (AI, Code, Human), parallel scripts with wait-for-all barrier, and workflows aligned with industry best practices.
- [ ] **Creative Dimensions**: Evaluate cognitive ergonomics, hallucination traps, multi-agent synergy, and 10x automation leaps.

---

## Mode 2: Updating an Existing Agent or Skill

### Step 1: Update Elicitation & Session Distillation Gate
Elicit modification intent before editing files:
- **From Explicit User Requirements**:
  - **Drivers**: Identify update triggers (new capability, convention updates, hallucination fix, token optimization).
  - **Scope**: Identify what must change vs what must remain strictly untouched.
  - **Dependencies**: Determine if cross-references, dependent agents, or downstream consumers are affected.
  - **Script Automation Opportunities**: Evaluate if procedural steps (grep, repetitive file CRUD, index updating, checklist reviews) can be offloaded to scripts in `scripts/`.
- **From Chat Session Feedback / Learnings ("Session Distillation")**:
  - **Audit Friction & Trajectory**: Inspect recent session history for *Inefficiencies* (slow linear operations, unscripted deterministic tasks), *Unnecessary Steps* (redundant reads, duplicate tool calls, filler), and *Wrong Steps* (false assumptions, hallucinated parameters, premature decisions; see [references/session-distillation.md](references/session-distillation.md)).
  - **De-parameterize**: Strip instance-specific ticket IDs, entity names, URLs, and raw error messages to extract the root invariant.
  - **Confirm with User**: Present synthesized invariant, target SSOT file, and proposed changes before editing:
    > *"Based on our session, I distilled this recurring invariant: **[rule]**. I propose updating **[target file]**. Does this capture your intent?"*

### Step 2: Pre-Update Rubric Diagnostic Scan
Run a diagnostic scan against [references/review-rubric.md](references/review-rubric.md):
- Detect latent anti-patterns, missing personas, deterministic token burn, or missing script automation.
- Verify loop breakers and read-optimization to prevent infinite loops and redundant full-file reads.
- Ensure planned edits avoid compounding prompt bloat.

### Step 3: Apply Targeted Refactoring (Zero Raw Patching)
1. **Apply Abstracted Invariants**: Never patch raw session tokens, ticket IDs, or transient error strings as-is.
2. **Uphold SSOT Placement (Single Home)**: Route updates strictly to ONE authoritative file. Never scatter duplicate or paraphrased copies; dependent components must link to this source.
3. **Perform Surgical Edits**: Avoid inserting verbose paragraphs or verbatim conversational logs.
4. **Implement Helper Scripts Where Beneficial**: Offload repetitive procedural operations to `scripts/` with parallel execution and synchronization.
5. **Preserve Consumer Soundness**: Ensure deliverable contracts fulfill downstream requirements (AI, Code, Human).

### Step 4: Post-Update Rubric Verification & Creative Polish
Re-evaluate the updated asset against [references/review-rubric.md](references/review-rubric.md):
- **Integrity**: Confirm trigger boundaries, assigned persona sharpness, instruction flow, and artifact fitness remain intact.
- **Token Economy & Velocity**: Verify optimal token usage, script offloading, parallel script execution with wait-for-all synchronization, and zero instance-specific session tokens leaked into prompts.
- **Loop & Read Resilience**: Confirm hard loop breakers exist and redundant full-file reads are eliminated.
- **Creative Polish**: Apply creative lenses to enhance cognitive ergonomics and model resilience.

---

## Mode 3: Reviewing User-Specified Agents & Skills

### Step 1: Elicitation & Scope Alignment
When user requests an audit of agents, skills, or prompt architecture:
1. **Target Confirmation**: Identify specific target files (`.agent.md`, `SKILL.md`) or define workspace-wide scope.
2. **Elicit Context**:
   - **Observed Friction**: Identify confusing behaviors, hallucinations, execution loops, or token bottlenecks.
   - **Boundary Expectations**: Define intended workflow splits between components.
   - **Automation Opportunities**: Identify manual or prompt-heavy steps (research, CRUD, checklists) suitable for scripting.
   - **Consumer Requirements**: Identify consumers (AI, Code, Human) and past deliverable failures.
   - **Output Delivery**: Confirm whether user wants recommendations only, or refactored files and diffs directly.

### Step 2: Comprehensive Multi-Dimensional Audit
Evaluate target files against [references/review-rubric.md](references/review-rubric.md):
- **Foundational Dimensions**:
  1. Trigger Soundness, Scope Boundary & Assigned Persona Profile
  2. Strict DRY & SSOT Compliance
  3. Token Optimization, Prompt Bloat Reduction & Script Offloading
  4. Instruction Flow, Conditional Branching & Anti-Loop Safeguards
  5. Actionability, Verification & Consumer Artifact Soundness (AI / Code / Human)
- **Creative Open-Ended Dimensions**:
  6. Cognitive Ergonomics & Developer Experience (DX)
  7. Model Steering & Hallucination Resilience
  8. Multi-Agent Synergy & Swarm Orchestration
  9. Extensibility & Evolutionary Design
  10. Workflow Innovation, Script Automation & 10x Velocity Leaps:
      - *Instruction Execution Automation*: Offloading research, search, entity extraction, and artifact CRUD to companion scripts.
      - *Review Checklist Automation*: Offloading deterministic validation and DoR/DoD checks to automated scripts before LLM qualitative review.
      - *Parallel Script Execution*: Running multi-faceted scripts concurrently with a mandatory wait-for-all barrier.
      - *Loop & Unnecessary Read Safeguards*: Enforcing recursion depth limits, retry caps, and targeted excerpt/index reading over massive full-file reads.

### Step 3: Generate Structured Audit Report
Format findings using a **compact, numbered table** to keep responses lean and directly referenceable:
- **Executive Summary**: Health score, key strengths, and primary architectural risks.
- **Audited Files & Roles**: Table of audited files, current triggers, and designated owners.
- **Actionable Numbered Findings Table**:
  - Number findings sequentially (`F-01`, `F-02`, etc.) with Severity (**Critical** / **High** / **Medium** / **Low**), Dimension, Target File & Line, Issue & Impact, and Recommendation.
  - Keep cell entries punchy (1–2 lines) to prevent conversational bloat.
- **Script Automation & 10x Velocity Opportunities**:
  - Specific recommendations for companion scripts in `scripts/` to automate research, artifact CRUD, or review checklists.
  - Architecture for parallel script execution with wait-for-all synchronization, loop-breakers, and read-minimization rules.
- **SSOT & Duplication Matrix**: (If applicable) Map duplicated rules to authoritative sources.
- **Remediation Options & Diffs**:
  - Present exact before/after diffs for **Critical / High** items first.
  - Prompt user to select specific finding IDs to apply.

### Step 4: Execute Approved Refactoring
Apply refactored changes upon user confirmation:
- Preserve workspace naming and structure conventions.
- Implement recommended helper scripts in `scripts/` where approved.
- Update all cross-references across dependent agents and skills.
- Verify deliverables against consumer contracts.
