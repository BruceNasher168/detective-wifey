# Level 0 Tutorial and Sixth Sense - Implementation Plan

Status: Planned. Runtime implementation has not started.

## Scope and sources

Build the approved optional tutorial with short prompts, SVG icons, gesture illustrations and limited animation loops. Reuse the existing case engine and investigation surfaces.

| Story | Deliverable |
|---|---|
| [US-022](.agent-artifacts/requirements/output/epic-02-investigation-suspicion-mechanics/us-022-giac-quan-thu-6-sixth-sense-app-badging-hint-engine.md) | Notebook hints and persistent 30-second cooldown |
| [US-034](.agent-artifacts/requirements/output/epic-04-detective-case-stories-level-content/us-034-level-0-practice-case-content.md) | Separately approved practice case dataset |
| [US-031](.agent-artifacts/requirements/output/epic-01-virtual-phone-app-ecosystem/us-031-level-0-entry-skip-replay.md) | First-play offer, Skip and Replay |
| [US-032](.agent-artifacts/requirements/output/epic-02-investigation-suspicion-mechanics/us-032-level-0-guided-evidence-collection.md) | Guided first inspection and evidence capture |
| [US-033](.agent-artifacts/requirements/output/epic-03-wife-notebook-verdict-social-sharing/us-033-level-0-guided-deduction-completion.md) | Notebook practice, independent deduction and completion |

The stories link to approved revision-2 wireframes. [Discovery](.agent-artifacts/requirements/output/elicitation/2026-10-21-level-0-tutorial-sixth-sense.md) governs the confirmed behavior; [runtime code ownership](../project-knowledge-base/solution-context/architecture/runtime-code-ownership.md) governs ownership. The separate [clue-card pinning plan](CLUE_CARD_PINNING_PLAN.md) covers that work.

## Ownership and change reach

| Area | Planned responsibility |
|---|---|
| src/features/play-session/ | Coordinate hint requests, lesson progress, practice outcomes and case changes through public actions |
| src/features/case-runtime/ and src/data/ | Register and validate Level 0 and authored clue ordering; reuse the level selector |
| src/features/session/ | Persist tutorial choice and hint expiry; isolate practice state and protect normal-case saves |
| src/features/investigation/ and existing notebook/graph owners | Reuse evidence events and graph evaluation; resolve exact owners during the prerequisite audit |
| src/shell/ | Render hinted launcher state and existing navigation; receive state through callbacks/props |
| src/bootstrap/ | Wire public feature APIs and repositories; keep hint and completion rules out of rendering glue |
| Existing motion/UI modules and public index.ts exports | Reuse transitions, icons and controls; export only interfaces consumed by the integration |

App views must not receive ground truth or implement tutorial rules. Do not create a general tutorial framework, per-app coaching copies or new dependencies.

## Build sequence

### 0. Verify prerequisites

- [ ] Inspect current public APIs and every affected caller for evidence capture, notebook connections, confrontation, case loading, persistence and navigation.
- [ ] Identify existing tests, fixtures, data validation and export boundaries. Preserve unrelated uncommitted work.
- [ ] Confirm whether prerequisite US-011, US-015, US-016 and planned US-018 behavior is implemented. Architecture documentation lists some capabilities as follow-on work; do not assume readiness.

Exit: record actual reuse points and missing prerequisite work before estimating. No production case facts or implementation claims come from this plan.

### 1. Implement Sixth Sense - US-022

- [ ] Reuse an existing hint resolver if present; otherwise add the smallest resolver under the verified gameplay owner, outside app views.
- [ ] Select the next uncollected authored clue and expose only its app ID/display information to the notebook and launcher. Handle collected-all and invalid-data results separately.
- [ ] Persist an expiry timestamp through the existing session writer; derive the countdown from the injected clock rather than saving a decreasing counter each second.
- [ ] Add the notebook control, short feedback, accessible countdown and requested app marker. Preserve expiry through notebook reopening and reload; clear stale targets on collection or case changes.
- [ ] Test valid hints, the general reminder, invalid targets, repeated requests, background time and reload using existing or isolated test fixtures.

Exit: hints work in an existing supported case without relying on Level 0 content. Normal-case scoring and app behavior remain unchanged.

### 2. Approve and integrate practice content - US-034

- [ ] Run the separate level-design review for narrative, cast, apps, clue order, ground truth and confrontation feedback.
- [ ] Provide a guided first connection and a distinct final connection. Leave an uncollected clue on the intended first-hint route; retain the approved reminder fallback for early independent collection.
- [ ] Add one declarative Level 0 dataset through existing catalog/validation paths. Do not hardcode case-specific logic in app views or substitute fictional production data for the pending design.
- [ ] Verify all referenced apps and clues are reachable and the final deduction is supported by the approved evidence.

Exit: approved content loads independently of Level 1 and supports every lesson. Hint work can proceed while this review is pending; publishing a playable Level 0 cannot.

### 3. Implement entry and replay - US-031

- [ ] Add the first-play offer and a Level 0 entry to the existing level selector. Store the choice locally; Skip enters Level 1 without recording completion.
- [ ] Start replay from the beginning while preserving normal-case progress and the previous tutorial-completion record. Confirm before leaving an active investigation.
- [ ] Isolate practice cards/results and retain existing ordered-write/reset protections. Define compatible defaults for older saves without replacing storage keys or deleting player data.
- [ ] Handle loading failure with Retry or entry to Level 1. Test replay, skip, reload and delayed writes during case changes.

Exit: tutorial entry and replay cannot overwrite a normal investigation or falsely mark completion.

### 4. Implement coaching and completion - US-032 and US-033

- [ ] Add one reusable coaching region with a fixed lesson sequence; use actual app-open, hold, successful-pin, notebook, connection, hint and confrontation events as checkpoints.
- [ ] Guide the first use of each mechanic, then remove gesture demonstrations for the final deduction. Keep the 380ms narrative-only evidence gesture and existing graph/confrontation behavior.
- [ ] Require every lesson, a valid hint/reminder, the player's final connection and successful confrontation before completion. Demonstrations and failed requests never award progress.
- [ ] Keep findings after practice mistakes and allow retry without case loss. Show normal-case penalty guidance before Level 1; do not carry practice immunity or cards into normal play.
- [ ] Add the approved icons, neutral SVG gesture illustrations and motion sequences. Limit demonstrations to two loops, stop on player interaction and support replay. Reduced motion uses static stages; retain short text and accessible names.

Exit: one complete practice run works from entry to Level 1, including the independent deduction and all recovery paths.

### 5. Verify the complete flow

- [ ] Add focused tests for real-action lesson progression, duplicate pinning, safe retry, false completion prevention, save isolation and cooldown persistence.
- [ ] Run npm run lint, npm test and npm run build. Lint already includes architecture checks.
- [ ] Verify in a browser: first-play offer, Skip, Replay, hold/pin, notebook connection, hints, successful completion and return to normal play.
- [ ] Check mobile and desktop layouts, keyboard access, reduced motion, blocked/covered controls and the actual gesture/animation timing. Automated checks do not replace this visual pass.

## Completion criteria

- All five stories' acceptance criteria are exercised against approved content.
- Existing saves and normal-case behavior are preserved; no ground truth leaks into app contexts.
- The tutorial is understandable through short prompts and visual demonstrations without exposing the final answer.
- Automated checks pass and browser results are recorded separately, with any remaining limitations stated.

## Current limits

This plan is based on the approved stories, architecture documentation and package scripts, not a runtime code audit. Exact module edits and estimates follow step 0. Case narrative/clues and live animation verification remain pending. No backend, CMS, account system, analytics, HTML mockup or dependency installation is included.
