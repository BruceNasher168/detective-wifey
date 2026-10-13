---
name: generate-wireframe
description: Use when creating or revising HTML wireframes, text wireframes, screen flows, page layouts, form mockups, or screen visualization artifacts.
---

# Wireframe Generation Skill

Create stakeholder-readable wireframes as static HTML/CSS files or structured text-only wireframe descriptions.

## Output Modes & User Selection Gate

Before generating any wireframe, the agent **MUST ask the user** (via interactive question or prompt) whether they prefer an **Interactive HTML Wireframe** or a **Structured Text-Based Wireframe**, unless the format was already explicitly specified in the user request or agreed upon in the upstream Artifact Plan.

- **Format Selection Prompt (`vscode_askQuestions`)**:
  - **Interactive HTML Wireframe (`.html`) (Recommended)**: Self-contained HTML with embedded CSS tokens, responsive layout, browser previewability, and automated screenshot visual inspection gate (`view_image`).
  - **Structured Text-Based Wireframe (`.md`)**: PRD-ready structural hierarchy, ASCII/markdown layout blocks, component inventories, and UX state descriptions for lightweight documentation and pre-visual handoffs.

### Mode Details:
- When **HTML** is chosen: generate a self-contained `.html` file with embedded CSS under `<epic-slug>/wireframes/wireframe-<slug>.html` and run the Automated Multimodal Visual Review Gate.
- When **Text-based** is chosen: generate a structured markdown wireframe file under `<epic-slug>/wireframes/wireframe-<slug>.md` following [references/text-wireframe-guide.md](references/text-wireframe-guide.md).
- Use Mid-Fi fidelity by default unless the user asks for Lo-Fi or Hi-Fi.
- Target both mobile and desktop when the request implies a responsive product; otherwise use the most relevant viewport.
- Avoid JavaScript unless the user asks for click-through behavior or dynamic states.
- Use realistic labels, placeholder data, and component states without final branding unless provided.

## Before Generating

- Infer a practical user flow and layout from the request.
- State assumptions briefly when they affect the screen count, entry point, responsive target, or primary action.
- Ask only when missing context would materially change the wireframe.
- For broad flows, create one focused screen first or split into a small screen sequence.
- Identify whether the wireframe is related to one or more user stories, one epic, or multiple epics before writing a file.

## Requirement Output Placement

Follow the deliverable folder placement and index update rules owned by `manage-requirement-artifacts`:
- Put user-story or epic-related wireframes in `.agent-artifacts/requirements/output/<epic-slug>/wireframes/`.
- Put project-wide wireframes in `.agent-artifacts/requirements/output/wireframes/`.

Placement rules:

- Put user-story-related wireframes in the `wireframes/` folder under the same epic as the related user story.
- Put project-wide wireframes in `.agent-artifacts/requirements/output/wireframes/`, not under a single epic.
- If a wireframe relates to multiple user stories in the same epic, keep one shared wireframe file in that epic's `wireframes/` folder and link each story to it.
- Use stable lowercase filenames: `wireframe-<screen-or-flow-slug>.html` or `wireframe-<screen-or-flow-slug>.md`.
- After creating or updating a user-story-related wireframe, update the related user story to include a relative link such as `./wireframes/wireframe-order-detail.html`.
- Update the nearest epic file: `epic.md` for epic-level wireframes, or the master `output/index.md` for project-wide wireframes.

## HTML Wireframe Rules

- Use semantic HTML (`header`, `nav`, `main`, `section`, `form`, `table`, `aside`) and accessible labels.
- Use CSS variables, an 8px spacing rhythm, clear hierarchy, and restrained grayscale plus one accent color.
- Use visible wireframe styling: simple borders, muted fills, placeholder blocks, and clear section labels.
- Use responsive CSS with stable breakpoints; ensure text and controls fit at mobile widths.
- Include expected UI states where useful: empty, loading, disabled, error, success.
- For forms, include labels, placeholders, required indicators, hints/errors, and native selects for dropdowns.
- Keep all interaction notes visible in the page only when they are part of the wireframe handoff.

## Text-Based Wireframe Rules

- Follow [references/text-wireframe-guide.md](references/text-wireframe-guide.md).
- Do not invent platform, target user, goals, screen scope, flows, key actions, or components.
- Ask targeted clarifying questions when required details are missing.
- Use headings, indentation, and bullets to show layout hierarchy.
- Do not include visual styling, design system references, pixel values, icons, or imagery unless explicitly required.
- In text mode, do not add meta-commentary; output questions only or the wireframe only.

## Fidelity

- Lo-Fi: grayscale blocks, minimal copy, layout and hierarchy only.
- Mid-Fi: realistic structure, labels, sample data, form states, navigation, and annotations.
- Hi-Fi: polished spacing and typography, closer-to-final content, still clearly a wireframe unless the user asks for visual design.

## Reference

- HTML: follow [references/html-wireframe-guide.md](references/html-wireframe-guide.md) for structure, components, file naming, and validation.
- Text-based: follow [references/text-wireframe-guide.md](references/text-wireframe-guide.md) for required sections, clarification rules, and output format.
- Templates: read `assets/text-wireframe-template.md` when producing text-based wireframes from a reusable structure. HTML wireframes should follow `references/html-wireframe-guide.md` directly and do not use a separate HTML template.
- Design tokens & CSS stylesheet: `assets/wireframe-tokens.css` contains accessible 8px-grid styles and UI components.

## Core Tooling (in `scripts/`)

Directly invoke these utilities using the exact CLI syntax below; do not inspect script source code unless diagnosing an execution error:

| Utility | Script Command | Description |
|---|---|---|
| **Wireframe Scaffolder** | `powershell -NoProfile -File .github/skills/generate-wireframe/scripts/scaffold_wireframe.ps1 --title "<Screen Title>" --output "<path.html>"` | Scaffolds responsive HTML shell with embedded CSS tokens, cutting generation tokens by 50–70%. |
| **Screenshot Renderer** | `powershell -NoProfile -File .github/skills/generate-wireframe/scripts/render_screenshot.ps1 --input "<path.html>" [--viewport desktop\|mobile]` | Uses headless Chromium/Edge to render HTML wireframes to crisp PNG images for multimodal visual review. |

## Automated Multimodal Visual Review Gate (`view_image`)

Never evaluate wireframe quality based on raw HTML/CSS syntax or ASCII art alone. After scaffolding, authoring, or modifying an HTML wireframe, the agent must render the wireframe to an image and perform a visual inspection.

### Visual Review Protocol:
1. **Render Screenshot**: Execute `powershell -NoProfile -File .github/skills/generate-wireframe/scripts/render_screenshot.ps1 --input "<path.html>"`.
2. **Visual Inspection**: Call `view_image` on the generated `<path.png>`.
3. **Audit Against Standards**:
   - **`design.md` Grounding (Primary SSOT)**: Check whether `design.md` exists in the knowledge base (`.agent-artifacts/project-knowledge-base/wiki/design.md`, `solution-context/design.md`, or workspace root). If present, audit the rendered layout strictly against the tokens, typography scales, color scheme, border radii, and component styles specified in `design.md`.
   - **Core UI/UX Heuristics (When `design.md` is absent)**:
     - *Visual Hierarchy & Scanning*: Does the primary call-to-action (CTA) or focal workflow immediately draw the user's eye (F/Z reading patterns)?
     - *Gestalt & Spatial Rhythm*: Are padding, margins, and alignments consistent using an 8px grid rhythm?
     - *Legibility & Contrast*: Does text meet WCAG 2.1 AA contrast requirements against background or translucent overlays? Are all labels fully visible with zero awkward clipping or line wrapping?
     - *Interactive Affordance*: Are interactable buttons, drag handles, inputs, and toggles visually distinct from static labels and decorative cards?
     - *State Completeness*: Are realistic empty, loading, or fallback states presented cleanly?

### Strict Anti-Loop Circuit Breaker:
To prevent costly LLM loops and token drain:
- **Maximum 1 Self-Correction Pass**:
  - If critical visual defects (broken layout, illegible contrast, clipping, severe misalignment with `design.md`) are identified during visual inspection, execute **exactly one** targeted HTML/CSS refactoring edit and re-render the screenshot.
  - Re-inspect the updated image once.
- **Halt Condition (No Looping)**:
  - **Never enter a second correction loop.**
  - If minor visual discrepancies or subjective polish items remain after the single refactoring pass, **stop immediately**. Present the deliverable to the user, display the screenshot path, and report the remaining items as "Visual Review Observations & Trade-Offs" for the user to steer.

## Validation

Before presenting:
- For HTML, execute the **Automated Multimodal Visual Review Gate** (render PNG + `view_image` inspection).
- For text-based wireframes, check required sections, screen hierarchy, states, actions, assumptions, and constraints.
- Check alignment, overflow, contrast, placeholder text, and responsive behavior when HTML is generated.
- Confirm the wireframe matches the stated assumptions and requested screen flow.
- Provide the file path and note any viewer/browser instructions for HTML artifacts only.
