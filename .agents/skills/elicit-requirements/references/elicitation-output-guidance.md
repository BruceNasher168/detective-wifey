# Elicitation Output Guidance

## Ownership

- `assets/elicitation-session-template.md` contains reusable output skeletons only.
- This file contains the rules for completing, persisting, and handing off those skeletons.
- The session output records discovery progress and becomes the authoritative handoff after stakeholder sign-off.
- Do not repeat an unresolved question as a second scope or decision entry.

## Information Boundaries

- **Purpose & Scope**: Objective states why; Boundary states the current MVP, in-scope, and out-of-scope position.
- **PACT Baseline**: People, Activities, Context, and Technologies capture the actors, work, operating environment, and technology constraints. Do not repeat objective, boundary, or decisions here.
- **Rules & Data**: Capture behavior, validation, permissions, exceptions, inputs, outputs, sources of truth, lifecycle, and audit details.
- **Decisions & Constraints**: Use typed rows for decisions, assumptions, dependencies, and risks. Do not repeat boundary or open-question text.
- **Open Questions**: Capture unresolved questions only. If a scope item is uncertain, keep its current candidate position in Boundary and record only the question here.
- Use `Type`, `Area`, and `Status` to preserve classification without creating a separate heading for every category.

## Session Persistence

- Use one session file at `.agent-artifacts/requirements/output/elicitation/YYYY-MM-DD-<topic-slug>.md`.
- Create it after confirmed meaningful scope direction, only when the caller supplies write authorization after onboarding. The caller owns approval; this skill handles pending authorization through Execution Flow.
- Until authorized, retain progress in conversation and identify persistence as pending. Authorization permits recording discovery; it does not confirm requirements or permit downstream delivery.
- Update the same session file after scope decisions, answered or parked questions, assumptions, or handoff preparation. Do not create a second session file for the same elicitation session.
- Once authorized, persist confirmed facts and pending questions from conversation into the same session file.
- Do not create a session output for a pure meta question unless the user asks for one.
- If persistence fails, state that plainly and do not claim the output was saved.

## Referenced Documents

- Include only documents actually read or supplied.
- Use workspace-relative file links for workspace files.
- If a relevant document was unavailable, name it and state that it could not be accessed without inferring its contents.
- When no documents were referenced, use the no-reference variant in the template.

## Parking Lot

- Use stable IDs such as `Q001`, `Q002`; never reuse or renumber an existing ID.
- Use `Open` for a question requiring an answer, `Deferred` for a question intentionally postponed, and `Closed` only after the question is resolved or explicitly withdrawn.
- Use the `Area` field to identify whether the question concerns Objective, PACT, Scope, Rules/Data, or Constraints.
- If the current user answers the question, convert it into the appropriate typed row or field instead of parking it.
- Park only unresolved, deferred, high-impact, or external-validation questions.

## Candidate and Assumption Status

- Use `Candidate` for a proposed boundary, rule, or data detail that is under consideration and not yet confirmed.
- Use an `Assumption` row in `Decisions & Constraints` for a temporary working premise that influences delivery, scope, behavior, or risk.
- Do not use `Assumed` as a parking-lot status. Resolve the question into an `Assumption` row or retain it as `Open` or `Deferred`.

## Handover

- Apply the status rules below, update the authorized session output, and hand over the complete file only after sign-off. A wrap-up request may produce an incomplete progress checkpoint; it does not authorize downstream requirement work.
- Do not create a duplicate handoff summary or payload file. Report progress conversationally; the session file is the complete downstream handoff artifact.
- Set `elicitation_status` in the session frontmatter, and write the routing decision as prose in `## Next Step`, before handoff.
- The downstream agent must read the whole session file, including its frontmatter and `## Next Step`, rather than treating a chat summary as the source of truth.

### Handoff Status

| `status` | `elicitation_status` | Meaning |
|---|---|---|
| `refinement` | `IN_PROGRESS` | Material gaps remain; continue discovery. |
| `refinement` | `COMPLETE` | Readiness criteria met; awaiting stakeholder confirmation. |
| `signed-off` | `COMPLETE` | Stakeholder confirmed the session content and accepted any deferred risks; downstream handoff allowed. |
| `signed-off` | `IN_PROGRESS` | Invalid; return to refinement before further use. |

- Set `signed-off` only after explicit stakeholder confirmation of the current session content. A request to start or wrap up is not sign-off. If confirmed scope changes, return to refinement and reassess readiness; retain unchanged confirmed facts.
- `elicitation_status` tracks readiness; `status` tracks stakeholder sign-off. Downstream handoff requires both `COMPLETE` and `signed-off`. `COMPLETE` means every material question was answered or intentionally deferred with an acknowledged risk; `IN_PROGRESS` means material questions remain open and unaddressed.
- Do not set `elicitation_status: COMPLETE` merely because a handoff was requested. It must reflect the Parking Lot's actual state: any row still `Open` (not `Deferred` or `Closed`) that materially blocks confident downstream use keeps elicitation `IN_PROGRESS`.
- A `Deferred` Parking Lot row does not block `COMPLETE`, provided the user has knowingly accepted proceeding with that gap as a stated risk (recorded as an `Assumption` or `Risk` row in `Decisions & Constraints`).
- `## Next Step` carries the routing decision as prose (target agent/skill and the primary reason). There is no separate frontmatter routing field — the session file is the complete handoff artifact, so the routing record lives in the body, not a duplicate machine enum.
