---
name: update-project-knowledge
description: Use when updating, maintaining, or normalizing durable project knowledge (wiki, solution context, glossary, scope, decisions, assumptions) under .agent-artifacts/project-knowledge-base/.
---

# Project Knowledge Updating Skill

## Purpose

Update durable, source-backed project knowledge in `.agent-artifacts/project-knowledge-base/`.

Use `references/okf-project-knowledge-base.md` for the reusable folder contract, OKF conventions, frontmatter rules, controlled tags, research order, and starter workflow. Use `templates/wiki-document.md` when creating a new durable wiki concept.

Top-level `.agent-artifacts/requirements/` is the delivery workbench for raw intake and generated BA deliverables. This skill may read it as source evidence, but must not modify it.

## Post-Update Indexing and Log Automation

After changing project knowledge under `wiki/`, `solution-context/`, or `glossary/`:
1. **Automated Index & Log Sync**: Run `powershell -NoProfile -File .agents/skills/manage-requirement-artifacts/scripts/sync_indexes.ps1` (fallback: `.github/skills/manage-requirement-artifacts/scripts/sync_indexes.ps1`) to automatically update local `index.md` files and maintain link integrity with zero manual LLM effort.
2. **Log Maintenance**: Append a newest-first entry to `.agent-artifacts/project-knowledge-base/log.md` (or pass `--log-entry "action|path|summary"` to `sync_indexes.ps1`).
3. Require explicit user confirmation before making durable project-knowledge updates.

## Hard Rules

- Do not invent project facts, business rules, stakeholders, dates, integrations, data fields, commitments, estimates, commercial terms, delivery responsibilities, acceptance criteria, or support obligations.
- Preserve user terminology and source wording where it matters.
- Separate confirmed facts, assumptions, decisions, risks, dependencies, exclusions, open questions, and citations.
- Use only user-provided, caller-supplied, or source-backed material. If source material is missing, ask for it or label the gap as an assumption/open question.
- Do not scan all of `.agent-artifacts/requirements/input/` to discover sources. Use user-specified or calling-agent-supplied input paths. If none are provided and evidence matters, ask which input to use.
- Never create, edit, delete, move, rename, reformat, or re-index files under top-level `.agent-artifacts/requirements/`.
- Do not copy a full user story, API spec, WBS, GUI spec, or analysis report into the wiki. Distill durable facts and link back to the source.
- When a confirmed wiki update depends on diagrams in the supplied or relevant requirement folder, copy those diagram files into either the relevant knowledge area `diagrams/` folder or shared `.agent-artifacts/project-knowledge-base/wiki/diagrams/`, then link them from the wiki page. Keep the original files in `.agent-artifacts/requirements/` unchanged.
- Follow the workspace elicitor-first gate before producing downstream BA artifacts. This skill can organize known context, but it does not bypass elicitation.

## Workflow

1. Identify sources and confirmation basis.
   - Read supplied project files, `project-summary.md`, briefs, tickets, specs, diagrams, source code, URLs, or specified `.agent-artifacts/requirements/input/` files before writing facts.
   - Read generated files in `.agent-artifacts/requirements/output/` only as source evidence after the user confirms a knowledge-base update.

2. Choose the smallest durable target.
   - Use `.agent-artifacts/project-knowledge-base/wiki/` for durable business rules, personas (`wiki/personas.md` or `wiki/<knowledge-area>/personas.md`), system behavior, known issues, limitations, important notes, scope boundaries, decisions, assumptions, risks, and dependencies.
   - **Elicitation Distillation on Epic Confirmation**: When an epic is confirmed (`elicitation_status: COMPLETE`), distill the confirmed multi-dimensional user personas, durable system specifications, and core business rules from the elicitation session file into `wiki/` (e.g., `wiki/personas.md` and `wiki/system-landscape.md`). This elevates transient discovery notes into authoritative, persisted knowledge base specifications that epics and user stories can cross-reference.
   - Organize wiki pages under placeholder knowledge areas such as `knowledge-area-1/` and `knowledge-area-2/`, renaming those folders to project-specific topics when the scope is known.
   - Use `.agent-artifacts/project-knowledge-base/solution-context/` for domain, system, API, data, integration, screen, workflow, environment, or technical ownership facts.
   - Use `.agent-artifacts/project-knowledge-base/glossary/` for terms, acronyms, synonyms, and naming conventions.
   - Keep the concise project overview and highest-level business requirements in `.agent-artifacts/project-knowledge-base/index.md`; do not create `wiki/project-overview.md` by default.

3. Update concept content.
   - Create one Markdown concept per stable knowledge unit.
   - Use `templates/wiki-document.md` for new wiki concepts unless an existing project pattern is clearer.
   - Preserve unknown existing frontmatter keys when editing.
   - Copy related requirement diagrams into the wiki area. Use the same knowledge area's `diagrams/` folder for area-specific diagrams, or shared `.agent-artifacts/project-knowledge-base/wiki/diagrams/` for cross-area diagrams. Cite the original requirement path.
   - Add `# Citations` when claims depend on source files, URLs, tickets, screenshots, or stakeholder notes.
   - Add `# Open Questions` for unresolved material gaps.

4. Maintain navigation and log.
   - Update the nearest `index.md` with a concise link and one-line description.
   - Update root `index.md` only when adding a new section, important entry point, or high-level business requirement.
   - Add newest-first entries to `.agent-artifacts/project-knowledge-base/log.md` for material creation, update, deprecation, restructure, or source-refresh events.

5. Review quality.
   - Verify changed concept files have parseable YAML frontmatter and a non-empty `type`.
   - Verify relevant links and source references.
   - Verify no unconfirmed project facts are presented as confirmed.
   - Verify no files under `.agent-artifacts/requirements/` were changed.

## Source Note Distillation & Compression Protocol (Crediting `caveman-compress`)

When reading raw intake documents, client transcripts, or discovery notes to create or update durable wiki concept files:
- **Eliminate Conversational Noise**: Strip pleasantries, social filler, conversational transitions ("Sure, let's look into this...", "I was thinking that maybe..."), hedging, and verbose narrative.
- **Preserve Technical Precision Verbatim**: Never compress, abbreviate, or alter:
  - Code blocks, command lines, inline code (`backticks`).
  - File paths, URLs, markdown relative links.
  - API endpoint paths, HTTP verbs, payload field names, data types.
  - Proper nouns, business acronyms, regulatory terms, version numbers, dates.
  - Critical logical qualifiers (`not`, `never`, `only`, `must`, `except`).
- **Dense Structured Distillation**: Express durable facts in compact, declarative bullet hierarchies or structured markdown tables (`[Entity / Rule] [Condition / Trigger] [Behavior / Invariant]`). Eliminate narrative preamble paragraphs.

## Output Behavior

- Keep the chat summary short.
- Mention changed files and source files or URLs used.
- List assumptions and open questions separately when facts are incomplete.
- Keep detailed structures, indexes, and concept content in files rather than large inline tables.
