# Review Rubric & Audit Framework

---

## Trigger Mandate: Universal Application Across All Workflows

Execute this rubric as a mandatory quality gate across **all three workflows**:

1. **Mode 1 (Create)**: Run as a mandatory self-audit gate before finalizing any new agent or skill. Every file must satisfy this rubric prior to completion.
2. **Mode 2 (Update)**: Run in two distinct stages:
   - **Pre-Update**: Diagnostic scan to identify latent gaps, regressions, or architectural conflicts.
   - **Post-Update**: Verification gate to confirm changes preserve DRY/SSOT, trigger boundaries, token efficiency, and clean branching.
3. **Mode 3 (Review)**: Primary comprehensive audit framework for analyzing user-specified agents, skills, or prompt architectures.

---

## 1. The 5 Foundational Review Dimensions

All agents and skills must satisfy these 5 foundational dimensions:

### Dimension 1: Sound & Sensible Trigger Workflow
- **Check 1.1: Frontmatter Quality & Token Economy**:
  - Does the YAML `description` clearly state both **WHAT** the agent/skill does and **WHEN** to invoke it in concise, actionable third-person?
  - Are tool permissions scoped cleanly (e.g. `ask_question` instead of arbitrary broad tool lists)?
- **Check 1.2: Trigger Ambiguity & Overlap**: Do multiple agents or skills share vague trigger phrases (e.g., "helps with testing" vs "reviews code")? When boundaries overlap, establish sharp distinguishing criteria.
- **Check 1.3: Handoff Soundness**: When delegating to another agent or skill, is the handoff condition crisp, unidirectional, and loop-free?
- **Check 1.4: Proper Trigger Placement (Agent vs Skill SSOT)**:
  - **In `SKILL.md`**:
    - Place triggers exclusively in YAML frontmatter `description` (the SSOT evaluated during progressive disclosure).
    - Omit `## When to Use` from the markdown body; the skill is already active once loaded.
  - **In `.agent.md`**:
    - Include an explicit skill routing section (e.g., `## Mounted Skills & When to Dispatch` or `## Mounted Skills & When to Use`) with relative markdown links.
    - Map each companion skill directly to its distinct activation trigger.
- **Check 1.5: Assigned Agent Persona & Role Authority**:
  - **Explicit Identity**: Does the agent prompt define an explicit, well-crafted **assigned persona** rather than generic assistant framing?
  - **Persona Dimensions**: Does it specify: (a) professional identity & domain specialization, (b) communication tone & professional demeanor, and (c) operational mindset/perspective (e.g., zero assumptions, verification-first)?
  - **Anti-Pattern Check**: Flag any agent that defaults to vanilla AI assistant framing (e.g., "You are an AI assistant that helps with...", "I am here to assist you"). Agents must embody a dedicated, authoritative domain specialist with clear professional judgment.

### Dimension 2: Strict DRY & SSOT (Single Source of Truth)
- **Check 2.1: Duplicate Rule Definitions**: Are business rules, coding standards, or domain models duplicated across prompts instead of referencing centralized instruction files (e.g., shared coding guidelines, testing standards)?
- **Check 2.2: Contradicting Instructions**: Do instructions contradict global guidelines (e.g., `AGENTS.md` or `.github/copilot-instructions.md`) or sibling skills (e.g., conflicting question caps, disparate artifact directories)?
- **Check 2.3: Shadow Standards**: Does the asset invent custom copies of existing standards that risk becoming stale?
- **Check 2.4: Single-Home Placement**: Does every rule, instruction, or check live in strictly ONE authoritative file? Flag any update that scatters duplicate or paraphrased copies across multiple files instead of establishing one SSOT and having others link to it.

### Dimension 3: Token Consumption & Prompt Bloat
- **Check 3.1: Conversational Fluff & Preamble**: Are there unnecessary introductory essays, motivational speeches, or redundant meta-commentary?
- **Check 3.2: Formatting Micromanagement**: Does the prompt micromanage trivial formatting details (e.g., exact space counts) that consume tokens without functional value?
- **Check 3.3: Verbatim Bot Scripting**: Does the prompt script exact canned sentences for the agent to say? Rely on natural model fluency.
- **Check 3.4: Progressive Disclosure Utilization**: Are large tables, templates, schemas, and deep documentation offloaded into `references/` files?
- **Check 3.5: Pattern Generalization vs Overfitting**: Are prompt instructions properly abstracted? Flag hardcoded session tokens, specific ticket IDs (e.g., `JIRA-123`), transient entity names, or raw error logs patched directly from a chat session rather than generalized into reusable engineering invariants (see [references/session-distillation.md](references/session-distillation.md)).
- **Check 3.6: Template Duplication & Narrative Schema Bloat**: Does the guideline or skill repeat in narrative prose what is already defined in companion templates (`assets/*.template.md`), schemas, or checklists? When a template/example demonstrates the format, keep prose limited to non-obvious constraints rather than restating the structure.
- **Check 3.7: Script Offloading for Deterministic Operations**: Does the asset burn LLM tokens executing deterministic file searching, regex matching, artifact CRUD, index updating, or checklist audits that could be offloaded to helper scripts in `scripts/` for zero-token execution?

### Dimension 4: Instruction Flow & Conditional Branching
- **Check 4.1: Linear Flow Pollution**: Are rare edge cases, error handlers, and tool fallbacks cluttering the main happy path?
- **Check 4.2: Explicit Branching Logic**: Are conditional paths structured with clean, unambiguous `IF <condition> THEN <action> ELSE <action>` logic?
- **Check 4.3: Tool Coupling & Portability**: Does the prompt decouple from ephemeral or proprietary UI tools, providing generic CLI or shell fallbacks?
- **Check 4.4: Non-Interactive Mode Resilience**: When executed by an orchestrator or automated pipeline, does the agent proceed predictably using safe default behaviors?
- **Check 4.5: Stop & Ask on Ambiguity Circuit Breaker**: Does the prompt instruct the agent to halt immediately and prompt the user for clarification whenever requirements, inputs, or steps cannot be interpreted from the prompt, presenting a recommended approach with options (pros/cons) rather than guessing or dumping open-ended questions?
- **Check 4.6: Anti-Loop & Redundant Read Safeguards**:
  - Does the prompt guard against execution loops (e.g. infinite polling, cyclic retries between agents, unbounded recursive decomposition) with explicit recursion depth limits, retry caps, and hard termination circuit breakers?
  - Does the prompt prevent unnecessary reads by relying on index summaries, targeted excerpts, or cached metadata rather than loading whole massive files into prompt context?
- **Check 4.7: Progressive Discovery Compliance**:
  - Does the asset structure intake and elicitation as a layered, progressive discovery process (discovering core objectives and boundaries before drilling into tactical parameters and edge cases)?
  - Does the prompt guard against overwhelming the user with massive question dumps by enforcing 2–4 questions per turn with recommended options?
  - Does it avoid premature interrogation of deep implementation details before the foundational scope is confirmed?

### Dimension 5: Actionability, Tool Grounding & Verification
- **Check 5.1: Grounded Verbs & Specific Commands**: Does each step provide concrete, executable actions (e.g., "Run test suite", "Inspect `src/<module>/endpoints.*`") rather than vague advice?
- **Check 5.2: Verification Checkpoints**: Does the skill or agent verify its changes (compiling, running test suites, inspecting git diffs) before declaring completion?
- **Check 5.3: Output Contract & Deliverables**: Is the expected deliverable (file path, file name, schema, layout) clearly and unambiguously specified?
- **Check 5.4: Intended Consumer Artifact Soundness**: Are output artifacts purpose-built and structurally optimized for their primary consumer?
  - **For AI / Subagent Consumers**:
    - Enforce machine-parseable structures (YAML frontmatter, JSON blocks, rigid Markdown tables).
    - Eliminate conversational fluff, filler commentary, and ambiguous prose.
    - Include explicit metadata (IDs, source links, status flags) for programmatic parsing.
  - **For Code / Compiler / Pipeline Consumers**:
    - Produce syntactically valid code conforming to language standards (file-scoped namespaces, correct imports, valid schemas).
    - Provide exact file paths and naming conventions ready for immediate compilation, linting, or test execution.
    - Pass automated CI/build checks directly upon generation.
  - **For Human Consumers (Engineers, Reviewers, Stakeholders)**:
    - Deliver clear visual hierarchy, executive summaries, scannable tables, and diff blocks.
    - Number all audit findings sequentially (e.g., `F-01`, `F-02`) so they can be referenced and actioned effortlessly.
    - Summarize findings in a compact Markdown table to prevent conversational bloat before presenting detailed remediation diffs.
    - Highlight must-fix items and actionable decisions rather than dumping walls of raw tokens.
  - **For Hybrid Artifacts**:
    - Cleanly separate machine-readable sections (metadata tables, JSON) from human-facing prose.
- **Check 5.5: Industry Best Practice & Domain Standards Grounding**:
  - Does the agent or skill incorporate established industry best practices, standard frameworks, and proven heuristics for the specific task it automates (e.g., BABOK/IREB for requirements, OpenAPI/AsyncAPI for APIs, INVEST/BDD for user stories, OWASP for security)?
  - Are procedural steps, verification checkpoints, and negative constraints aligned with industry standards rather than naive or ad-hoc sequences?
  - Does the prompt avoid inventing improvised conventions when standard industry patterns already exist?
- **Check 5.6: Deterministic Script Automation (Research, CRUD, Review Checklists)**:
  - Are companion scripts provided under `scripts/` for deterministic steps (e.g., regex/semantic search, entity extraction, file scaffolding, index synchronization, or quality checklist linting) to accelerate execution and eliminate LLM token burn?
- **Check 5.7: Parallel Script Execution & Wait-for-All Synchronization**:
  - When multiple searches, files, or checklist validations are required, are scripts executed in parallel to maximize speed?
  - Does the agent enforce a strict barrier to wait for all parallel script executions to complete before synthesizing results and making decisions to establish the full picture?
- **Check 5.8: High-Signal Negative Constraints (Anti-Patterns vs Self-Mirroring Paradox)**:
  - Does the asset define an explicit `Anti-Patterns & Negative Constraints` section capturing forbidden actions (e.g., breaking persona, using broad tool bundles, guessing requirements, fabricating schemas, omitting verification)?
  - **The Self-Mirroring Filter**: Are negative constraints restricted to suppressing pre-trained LLM default habits (de-biasing), preventing cross-boundary domain drift, and stopping destructive side-effects?
  - **Zero Negative Redundancy**: Does the section strictly avoid "negative mirroring" (merely inverting or restating positive procedural instructions in the negative, such as "Do NOT fail to follow Step 2")? If an asset has no legitimate external LLM hazards beyond its step-by-step procedure, is the section omitted to conserve tokens?
  - Are constraints phrased as unambiguous, preventative invariants ("Never ...") to steer the model away from real failure modes?

---

## 2. Creative & Contextual Expansion Dimensions (Open-Ended)

Expand audits beyond the 5 baseline dimensions. Actively apply architectural creativity, domain intuition, and proactive innovation:

### Dimension 6: Cognitive Ergonomics & Developer Experience (DX)
- Does the workflow feel natural, effortless, and pleasant for the human engineer?
- **Interrogation Fatigue Prevention**: Does the agent avoid interrogation fatigue by inferring context from the prompt first, and formulating questions with a **Recommended Approach and structured Options (annotating Pros & Cons)** rather than asking pure open-ended questions?
- Can the output be parsed at a glance via visual hierarchy, tables, or diffs?

### Dimension 7: Model Steering & Hallucination Resilience
- Does the prompt guard against common LLM tendencies (e.g., leaving `// TODO`, omitting assertions, fabricating parameter names)?
- Does the assigned persona reinforce behavioral boundaries and prevent persona drift or ungrounded speculation?
- Does the prompt inject preemptive negative constraints ("Never return empty arrays for nullable collections", "Never fabricate unauthorized domain schemas")?

### Dimension 8: Multi-Agent Synergy & Swarm Orchestration
- How well does this agent or skill integrate into larger agentic swarms, parallel pipelines, or CI runners?
- Can state or memory be handed off cleanly between upstream and downstream agents while preserving full execution context?

### Dimension 9: Extensibility & Evolutionary Design
- Can new domain rules, API versions, or external providers be introduced seamlessly while keeping the prompt core intact?
- Does the architecture uphold open-closed design principles (open for extension, closed for modification)?

### Dimension 10: Workflow Innovation, Script Automation & 10x Velocity Leaps
- **Proactive Script Automation Suggestions**: What deterministic steps in instruction execution (research/lookup, artifact CRUD) or review checklists should be offloaded to helper scripts in `scripts/` to achieve 10x velocity and zero-token consumption?
- **Parallel Multi-Task Execution**: Can multi-faceted research, validation, or generation tasks execute scripts concurrently?
- **Full-Picture Synchronization Gate**: Does the workflow mandate waiting for all parallel scripts to complete before formulating conclusions?
- **Anti-Loop & Redundant Read Safeguards**: Does the design strictly prevent infinite execution loops and redundant full-file reads?

---

## 3. Severity Classification

| Severity | Definition | Examples |
|---|---|---|
| **Critical** | Architectural defect causing infinite loops, contradictory execution gates, complete failure to trigger, or severe security violations. | Two agents delegating recursively to each other; agent instruction directly contradicting global security policy; missing frontmatter description causing skill to never trigger. |
| **High** | Widespread duplication (SSOT violation), severe prompt bloat (>500 wasted tokens), conflicting rule caps, or unhandled edge cases breaking non-interactive runs. | Full coding guidelines copy-pasted across 4 agents; question cap set to 3 in constitution but 5 in agent; failure path missing causing silent stall. |
| **Medium** | Minor redundancy, sub-optimal progressive disclosure, missing verification step, or slight trigger ambiguity. | Reference table inlined instead of linked in `references/`; ambiguous trigger phrase shared with another skill; missing compile check after file write. |
| **Low** | Stylistic inconsistencies, minor wordiness, or formatting improvements. | Minor phrasing redundancy; slightly wordy section headers; missing markdown anchor link. |

---

## 4. Standardized Audit Report Template

When delivering a review, use this standardized markdown structure to ensure responses are compact, scannable, and directly referenceable:

```markdown
# Agent & Skill Architecture Review: [Target Name / Scope]

## 1. Executive Summary
- **Overall Health**: [Healthy / Needs Refactoring / Critical Overhaul]
- **Key Strengths**: [1-2 bullets on what is working well]
- **Primary Risks**: [Summary of key architectural vulnerabilities found]

## 2. Audited Files
| File Path | Component Type | Current Role / Trigger | Soundness Rating |
|---|---|---|---|
| `.github/agents/example.agent.md` | Agent | ... | Needs Refactoring |

## 3. Actionable Findings Table
| ID | Sev | Dimension | Target File & Location | Issue & Architectural Impact | Recommendation |
|---|---|---|---|---|---|
| **F-01** | Critical | Dim 1: Triggers | [`agent.md:L12`](file:///...) | Trigger phrase overlaps with `@analyst`; causes misrouting | Disambiguate with explicit boundary keyword |
| **F-02** | High | Dim 3: Token Bloat | [`SKILL.md:L10-L25`](file:///...) | Duplicate `## When to Use` in body wastes 180 prompt tokens | Remove section; keep trigger in frontmatter SSOT |
| **F-03** | Medium | Dim 2: DRY/SSOT | [`dev.agent.md:L45`](file:///...) | Inlined language rules duplicate standards and risk staleness | Point to shared coding guidelines |

## 4. Script Automation & 10x Velocity Opportunities
| Opportunity | Target Operation (Research, CRUD, Checklist) | Proposed Script (`scripts/`) | Parallel Execution Model | Token & Time Savings |
|---|---|---|---|---|
| **Research Automation** | Entity, term, or code searching | `scripts/search_*.py` | Multi-query parallel threads | Cuts input tokens by 60–80%, <10ms response |
| **Artifacts CRUD** | Index synchronization & link generation | `scripts/sync_*.py` | Single-pass directory walk | Zero LLM token spend, deterministic resolution |
| **Review Checklist** | Structural & compliance checks | `scripts/validate_*.py` | Parallel rule checks | Instant deterministic linting, zero hallucination |

> [!NOTE]
> **Synchronization & Loop Safeguards**: All parallel script executions must be awaited by the calling agent to capture the complete 360° picture before making architectural decisions. Workflows and scripts must strictly implement recursion depth counters, retry limits, and excerpt/index-based read optimization to prevent runaway loops and unnecessary full-file reads.

## 5. SSOT & Duplication Matrix (If Applicable)
[Table or diagram mapping duplicated rules across files to their single authoritative source]

## 6. Remediation Diffs & Actions
> Present exact before/after diffs for **Critical / High** items, or ask the user which IDs to generate:
> *"Which findings would you like me to apply? (e.g., 'Apply all', 'Apply F-01 and F-02', or ask for details on any ID)"*

### Remediation: [F-01] [Brief Title]
```diff
- [target content]
+ [replacement content]
```
```
