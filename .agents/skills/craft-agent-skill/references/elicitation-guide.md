# Elicitation Guide: Workflow & Goal Discovery

Execute an explicit, interactive elicitation phase before creating, updating, or reviewing any agent or skill:
- **Zero Guesswork**: Never assume manual processes, trigger boundaries, or architectural intent.
- **Stop & Ask Circuit Breaker**: If any requirement or step is unclear, pause immediately and clarify with the user.

---

## 1. Core Principles of Elicitation

1. **Infer First, Ask Only What Cannot Be Interpreted**:
   - **Pre-Question Screening**: Before formulating any question, inspect the user's prompt, request metadata, and repository artifacts. If an objective, persona, boundary, trigger, or tool can be reasonably interpreted from the prompt, **DO NOT ASK**. Record the inferred assumption and proceed.
   - **Trigger**: Only ask when a critical requirement, boundary, or technical choice cannot be interpreted from the user's request.
2. **Never Ask Pure Open-Ended Questions (Lead with Recommendation & Options with Pros/Cons)**:
   - **Eliminate Open-Ended Interrogation**: Never dump blank questions like *"What should the persona be?"* or *"What tools do you want?"*.
   - **Lead with a Recommended Approach**: Always present a **Recommended Option** (grounded in prompt interpretation and researched industry standards).
   - **Structured Options with Pros & Cons**: Present 2–3 concrete alternatives with crisp trade-offs (Pros/Cons) so the user can easily select, confirm, or adjust rather than drafting answers from scratch.
3. **Never Assume the Manual Flow**:
   - Workflows vary widely across teams and codebases.
   - When manual workflow details cannot be inferred from the user prompt or existing files, present recommended workflow patterns with options for the user to confirm.
4. **Batching Discipline**:
   - Ask **2 to 4 high-impact questions per turn**.
   - Keep interactions focused; avoid exhausting walls of questions.
5. **Active Reflection**:
   - Summarize elicited answers back to the user in a crisp bulleted list.
   - Confirm alignment before drafting prompts or executing refactors.
6. **Ground Options in Industry Best Practice via Web Search**:
   - Before or during elicitation, run a brief targeted web lookup of established industry methodologies, frameworks, and workflows relevant to the user's task (e.g., BABOK for requirements, OpenAPI for APIs, INVEST/BDD for user stories, OWASP for security).
   - Use these best practices to seed intelligent suggestions, multiple-choice options, and professional defaults rather than presenting blank generic prompts.

---

### Mandatory Question Formulation Template

Whenever a question must be presented to the user, format it using this interactive pattern:

> **[Question Title]**: [1-sentence statement of the specific decision needed]
> 
> - **Option 1 (Recommended)**: [Proposed default based on prompt interpretation & industry standards]
>   - *Pros*: [Primary benefit, execution velocity, standard alignment]
>   - *Cons*: [Trade-off, constraint, or limitation]
> - **Option 2**: [Alternative approach, e.g., lighter-weight, manual, or decoupled]
>   - *Pros*: [Specific benefit]
>   - *Cons*: [Trade-off or additional overhead]
> - **Option 3**: [Alternative approach, e.g., strict/automated, advanced, or custom]
>   - *Pros*: [Specific benefit]
>   - *Cons*: [Trade-off or additional overhead]
> 
> *Prompt: "Select an option (e.g., Option 1) or let me know if you prefer a different approach."*

---

## 2. Unified Core Elicitation (Universal Discovery for Agents & Skills)

> [!IMPORTANT]
> **Pre-Question Screening Gate**: Only ask questions for items that **CANNOT be interpreted from the user's prompt or workspace artifacts**. For any question that must be asked, strictly apply the **Mandatory Question Formulation Template** above (Recommended Approach + Options with Pros & Cons).

Whether creating an Agent (`.agent.md`) or a Skill (`SKILL.md`), first elicit answers across these 4 shared foundation pillars:

### Pillar 1: Objective, Bottleneck & Industry Standards Grounding
- *Question 1*: What primary business or technical goal does this asset achieve, and what daily friction or bottleneck does it eliminate?
- *Question 2*: What **governing industry standards, methodologies, or frameworks** apply to this task? (e.g., IIBA BABOK, IREB, OpenAPI, REST, BDD/INVEST, OWASP, Clean Architecture). *(Conduct quick web research on the user's task to propose relevant industry standards and battle-tested heuristics directly).*

### Pillar 2: Trigger Phrasing, Preconditions & Boundaries
- *Question 3*: Under what exact circumstance or phrasing should this asset be activated?
  - *For an Agent*: `@agent` invocation scenario, PR review trigger, or pipeline stage.
  - *For a Skill*: Explicit "Use when: ..." phrasing in frontmatter `description`.
- *Question 4*: What preconditions must exist before execution starts? (e.g., specific input files exist, environment variables set, local containers running, tests passing).
- *Question 5*: Are there existing agents or skills in the workspace that overlap? Where is the sharp boundary split or handoff?

### Pillar 3: Inputs, Artifact Deliverables & Intended Consumers
- *Question 6*: What input files, schemas, or context artifacts will this asset read or inspect? (e.g., OpenAPI specs, domain schemas, ticket descriptions, git diffs).
- *Question 7*: What concrete output artifacts should this asset produce or update? (e.g., Markdown specifications in `.agent-artifacts/`, code files, test suites, summary checklists).
- *Question 8*: Who or what is the **intended consumer** of these output deliverables, and what structure does it require?
  - *AI / Subagents*: Machine-readable schemas (YAML frontmatter, JSON, rigid Markdown tables), zero conversational filler.
  - *Compilers / CI*: Syntactically valid code, exact file paths, zero lint/build errors.
  - *Humans*: Scannable visual hierarchy, executive summaries, actionable next steps.

### Pillar 4: Manual Workflow, Execution Sequence & Fallbacks
- *Question 9*: **The Manual Workflow Today**: How do you or your team perform this task manually from start to finish? Walk through the step-by-step sequence of actions, decisions, and checks.
- *Question 10*: What verification checkpoints prove that a step succeeded before proceeding to the next? (e.g., running tests, compiling, inspecting diffs).
- *Question 11*: What conditional branches, edge cases, and failure modes exist, and what are their fallback recovery paths?
- *Question 12 (Script Automation Opportunities)*: What deterministic procedural steps (e.g., knowledge research/entity lookup, artifact CRUD/templating/indexing, or quality review checklist audits) should be offloaded to companion helper scripts in `scripts/` to eliminate LLM token burn and latency?
- *Question 13 (Parallel Script Execution & Full-Picture Synchronization)*: Can multi-faceted tasks (e.g., multi-query research, multi-artifact validation) run scripts in parallel, and does the calling prompt mandate waiting for all script executions to finish before synthesizing the full picture?
- *Question 14 (Anti-Loop & Redundant Read Safeguards)*: How does the workflow guard against execution loops (recursion depth caps, retry limits) and unnecessary full-file reads (using targeted excerpts, single-pass indexing, or caching)?

---

## 3. Component-Specific Extension Pillars

After establishing the Unified Core, elicit the specialized extension parameters required for the target component type:

### Extension A: For Creating a New Agent (`.agent.md`)
Agents act as authoritative domain leaders and workflow coordinators. Elicit these 3 agent-specific dimensions:

#### Phase A1: Assigned Persona Profile & Demeanor (Zero Generic Assistants)
- *Question A-1*: What is the agent's **assigned persona and professional identity**? (e.g., "Principal Requirements Architect", "Senior API Solutions Analyst", "Pragmatic Backlog Governor").
- *Question A-2*: What is the agent's **professional demeanor, communication style, and tone**? (e.g., authoritative, analytical, concise, direct, inquisitive, risk-averse, zero conversational filler).
- *Question A-3*: What **operational mindset and mental heuristics** govern its judgment? (e.g., "zero assumptions", "verify before writing", "ruthless traceability", "quality at source").

#### Phase A2: Mounted Skills, Tool Permissions & Web Capabilities
- *Question A-4*: What procedural skills should be linked and dispatched in Section 3? (e.g., `../skills/research-project-knowledge`, `../skills/elicit-requirements`).
- *Question A-5*: What tools should be enabled in `tools:`? Does it need write/execute permissions, or is it read-only?
- *Question A-6*: Does this agent need **web search and external documentation retrieval** capabilities (e.g., `tools: [- web, - search]`, `search_web`, or delegating to the `research` subagent) to look up industry standards, public APIs, regulations, or technical docs?

#### Phase A3: Multi-Agent Handoffs & Non-Interactive Safeguards
- *Question A-7*: What **agent handoffs** exist? Under what condition does this agent delegate to a peer agent (e.g., handoff to `@peer-agent` or `@specialist-agent`), and how is context passed?
- *Question A-8*: How should the agent behave when executed in **non-interactive batch mode** (e.g., CI runner or headless subagent)? Should it halt with open questions or execute safe, conservative defaults?

---

### Extension B: For Creating a New Skill (`SKILL.md`)
Skills provide tactical, step-by-step procedural instructions for executing specific operations. Elicit these 2 skill-specific dimensions:

#### Phase B1: Procedural Grounding, CLI Tooling & Scripts
- *Question B-1*: What exact CLI commands, shell scripts, or API queries are executed during this procedure?
- *Question B-2*: Are there automated helper scripts that should live under `scripts/` (e.g., `scripts/search_*.py`, `scripts/validate_*.py`, `scripts/sync_*.py`) to elevate execution speed, save LLM tokens, support parallel execution with wait-for-all synchronization, and enforce anti-loop/read-optimization safeguards?

#### Phase B2: Progressive Disclosure & Offloading
- *Question B-3*: Are there large reference schemas, data contracts, evaluation rubrics, or extensive checklists that should be offloaded to `references/` (e.g., `references/details.md`) rather than bloating the root `SKILL.md`?

---

## 4. Elicitation Questionnaire for Updating an Existing Agent or Skill

When updating or refactoring an existing agent or skill:

### Phase 1: Update Intent & Drivers
- *Question 1*: What triggered this update? (e.g., new business logic, external integration changes, fixing misfires/hallucinations, reducing token bloat, adapting to model changes)
- *Question 2*: What exact behavior should change, and what core functionality must remain strictly untouched to prevent regression?

### Phase 2: Scope & Boundary Impact
- *Question 3*: Does this update introduce new rules or procedures that might belong in a centralized instruction file (DRY/SSOT) rather than inside this prompt?
- *Question 4*: Are there downstream agents, skills, or workflows that depend on this component's triggers or outputs?
- *Question 4b (Script Offloading)*: Can existing manual or prompt-heavy operations (e.g. manual file grep, iterative index updates, manual checklist verification) be replaced with automated scripts in `scripts/` executed in parallel to save tokens and time?

### Phase 3: Session Distillation Confirmation (When Updating from Current Chat)
- *Question 5*: Based on our chat session, what was the primary friction or correction? Does this synthesized invariant: *"[insert abstracted invariant]"* accurately capture the lesson?
- *Question 6*: Does this rule apply universally across all features/slices, or is it a conditional branch (e.g. only for specific API versions, modules, or integration providers)?

---

## 5. Elicitation Questionnaire for Reviewing Existing Agents & Skills

When asked to review or audit existing agents or skills:

### Phase 1: Review Objectives & Observed Friction
- *Question 1*: What specific problems or unexpected behaviors have you noticed when using these agents/skills? (e.g., agent hallucinates, fails to trigger, consumes too many tokens, gives generic responses, contradicts other rules)
- *Question 2*: Are there specific files you want audited (e.g., `.agents/agents/dev.md`), or should we scan the entire agent/skill ecosystem in this workspace?

### Phase 2: Desired Output & Remediation Scope
- *Question 3*: Would you prefer an architectural report highlighting issues with recommendations, or should we directly generate the refactored files and diffs for your review?
- *Question 4*: Are there particular areas you'd like creative, out-of-the-box suggestions on (e.g., multi-agent orchestration, automation hooks, or developer ergonomics)?
