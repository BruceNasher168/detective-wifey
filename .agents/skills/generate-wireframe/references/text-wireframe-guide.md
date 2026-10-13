# Text-Based Wireframe Guide

Use this mode for PRDs, early UX validation, documentation, or handoff before visual design.

## Clarity Gate

Before generating, confirm the requirement includes:

- Platform
- Target user / persona
- Primary goal
- Scope: single screen or flow
- Key actions

If any are missing or ambiguous, ask targeted clarifying questions only. Do not invent screens, flows, components, styling, or UI patterns.

## Required Output Structure

When enough information is available, use this structure:

- User Role / Persona
- Primary Goal
- Context / Use Case
- Platform
- Screen Inventory
- Per-Screen Layout
  - Header
  - Primary content
  - Secondary content
  - Actions
  - Navigation model
- Key Interactions & States
- Constraints & Assumptions

Use headings, indentation, and bullets to express hierarchy. Keep each screen readable in under about one page of text.

## Text-Only Rules

- Focus on information architecture, content order, layout hierarchy, and user actions.
- Use placeholder content such as `[User name]`, `[Record status]`, or `[Primary CTA]` where needed.
- Do not use visual styling language: colors, typography, spacing, shadows, design system names, or pixel values.
- **Strict Zero-Emoji Invariant**: Never use raw Unicode emojis (e.g. 📷, 📶, 🔋, 🔍, 🔒, 💬, 🛍️, 🚗, 🌐, 🖼️, 💳, 📞, 📝, 🏠, 🎀, 🗂️, 🔄, 🔴) in text or ASCII wireframes. Use structured bracketed semantic tokens such as `[Signal 5G]`, `[Battery 42%]`, `[Search]`, `[LoZa] (3)`, `[Lock]`, `[Back]`, `[Close]`.
- Do not describe icons or imagery unless explicitly required.
- Do not mention internal reasoning, instructions, tools, frameworks, or how the output was generated.
- Use professional, direct, neutral headings and bullet points only.

## UX Rules

- Put the clearest hierarchy first, top to bottom.
- Keep one primary action per screen.
- Group related content logically.
- Use progressive disclosure for complex information.
- Include empty, loading, and error states when relevant.
- Prefer modular reusable sections.

## Micro-App Alignment with `app-design.md`

When creating structured text wireframes for any virtual app in the workspace:
- **Canonical Design Source**: Reference the app's `app-design.md` under `.agent-artifacts/project-knowledge-base/solution-context/apps/<app-id>/app-design.md`.
- **Layout Architecture Mirroring**: Directly align the screen layout, headers, content groups, and navigation with the ASCII wireframe models documented in Section 3 of that app's `app-design.md` (e.g., drawer overlays, search clouds, transaction items).
- **Forensic Touchpoints**: Note forensic interaction points (e.g., clue tagging trigger into Wife's Detective Notebook) in Key Interactions & States without violating text-mode styling constraints.

## Output Rule

- If unclear: output clarifying questions only.
- If clear: output the final text-based wireframe only.

