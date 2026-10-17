# Clue Cards and Pinning Revamp

Status: Proposed implementation plan. Runtime implementation has not started.

## Confirmed requirements

- Pinning a contact or conversation pins the visible person/alias only, without message content.
- Long-pressing a specific message pins that message.
- Shopoo messaging follows the same rules, including pinning conversations and shop aliases.
- Clue-card titles always show the pinned person/alias.
- Card bodies contain the main message, transaction, or order content. Person/conversation-only pins have no body.
- Multiple pinned messages from one conversation occupy one clue card, with messages listed as bullets.
- Each message bullet shows its event date/time beside the content: `28/09 · 12:10: "Nội dung tin nhắn..."`.
- Each message bullet occupies at most two lines.
- Event date/time must be separate from content and the time the player pinned the evidence.
- Support removing an individual pinned message and removing the entire conversation card, with Undo for both actions.
- Removing pinned evidence does not delete the original conversation or messages.
- Card and item action buttons appear only after tapping/selecting the card; tapping outside hides them.
- The selected card has exactly two actions: delete the whole card and navigate to the original chat location. Each message item has only a delete action.
- Optimize for mobile with separate touch targets of at least 44 by 44 screen pixels, no overlapping content, no horizontal overflow, and no reliance on hover.

## Current findings

Verified during the preceding code review:

- `src/shared/contracts/evidence.ts` stores source identity, title, and snippet, without structured event date/time or conversation identity.
- `src/features/investigation/tagSuspect.ts` deduplicates evidence by app, case, and record ID; it does not aggregate messages by conversation.
- Zola conversation-list evidence includes the latest-message preview.
- Shopoo exposes evidence on chat previews and message bubbles, but conversation/shop identity pinning is incomplete.
- `src/features/wife-notebook/WifeNotebookModal.tsx` derives card labels and bodies from evidence titles/snippets.
- Existing data includes time-only messages, relative date labels, and date-only orders. Exact timestamps are not available for every record.
- Notebook, corkboard, gestures, and shell files already contain uncommitted changes. Review their current state before implementation and preserve that work.

## Working interpretations and open decisions

- **Working interpretation:** selecting a conversation for pinning uses the existing evidence gesture. An ordinary tap continues to open the conversation without automatically pinning it.
- **Working interpretation:** the two-line limit applies to each message bullet, not the entire multi-message card.
- **Recommended grouping:** one card per case, app, and conversation; separate transaction/order cards.
  - Pro: keeps distinct financial events and source records inspectable.
  - Con: one person can still have multiple cards across apps or transactions.
- **Open decision:** which visible party supplies the title for records with multiple parties, such as an order recipient and seller. Follow an existing explicit pinned identity where available; do not infer a hidden identity.
- **Removal behavior:** removing a message removes only that entry. If the last entry is removed, keep a title-only card only when the conversation was explicitly pinned; otherwise remove the empty card. Removing the whole card removes its conversation pin and all pinned entries. Offer Undo at both levels.
- **Proposed Undo behavior:** restore the removed entries, explicit conversation-pin state, placement, drawer membership, and affected connections. Expose direct buttons only on the selected card: delete and open chat at card level, delete only at item level. The proposed card controls do not include a move-to-drawer button.

## Proposed ASCII wireframe

See [Clue card and Undo states](.agent-artifacts/requirements/output/wireframes/wireframe-clue-card.md). Status: awaiting review; no HTML or runtime changes.

## Implementation sequence

### 1. Audit contracts, components, and canonical specifications

- Review the current evidence flow, notebook graph, persistence contracts, and source navigation.
- Review applicable `app-design.md` and `features.md` specifications for Zola, Phone/Messages, Shopoo, Banking, and the notebook.
- Audit shared UI and existing evidence primitives before adding components.
- Inventory every evidence producer so the new contract remains compatible across apps.
- Record existing unsaved work and affected tests before editing shared files.

### 2. Separate pinned identity from record content

- Define explicit evidence kinds for person/conversation, message, transaction, and order pins, with compatibility for other existing evidence kinds.
- Store the visible pinned person/alias independently of record titles, content, and internal suspect attribution.
- Carry stable case, app, conversation, and record identifiers where applicable.
- Preserve per-record clue references and source-navigation metadata when messages are grouped.
- Keep shared evidence contracts independent of app-specific adapters.

Primary areas: `src/shared/contracts/evidence.ts`, investigation contracts, app-owned adapters, and session types.

### 3. Normalize story event date/time

- Inventory timestamp fields in bundled cases, defaults, and every pinnable record adapter.
- Separate event date, event time, known precision, and pin/capture time. Retain year and timezone when supplied.
- Keep presentation labels such as `Hôm qua` separate from canonical event values.
- Resolve relative dates only against a verified fictional story clock, never the player's current date.
- Preserve separate event roles where relevant: message sent time, transaction time, order creation time, and logistics updates.
- Populate exact values only from authoritative story data. Track missing or ambiguous values as content gaps.
- Add a shared formatter for `DD/MM · HH:mm`; display only known precision when exact values are unavailable.

Dependency: exact timestamps for all records require verified source data. Formatting alone cannot supply missing dates or times.

### 4. Correct app-level pinning behavior

- Contact/conversation row: produce an identity-only pin with no preview content.
- Specific message: produce a message pin with its conversation identity, content, event time, and source metadata.
- Apply consistently across Zola, SMS, and Shopoo seller chats; audit other messaging surfaces for the same contract.
- Enable Shopoo narrative conversation rows and shop identity records to pin the visible shop alias without requiring hidden suspect attribution.
- Preserve normal tap navigation and suppress accidental navigation after a completed long-press.
- Reuse `StoryEvidenceTarget` and `UniversalEvidenceModal` with the 380ms gesture.
- Keep evidence gestures off structural chrome and retain the prohibition on permanent pin buttons.

### 5. Aggregate conversation pins

- Use case, app, and stable conversation ID as the grouping key; never merge by display name alone.
- An identity-only pin creates a title-only card.
- Pinning a message creates or updates that conversation card with a unique message entry.
- Re-pinning a message does not duplicate the entry or increase the card count.
- Pinning the identity after messages exist preserves those messages.
- Order entries by verified event time; preserve source order where timestamps are incomplete or tied.
- Treat adding a message to an existing card as a persisted update even when card count does not change.
- Keep transactions and orders individually addressable under the recommended grouping scope.

Primary areas: `src/features/investigation/tagSuspect.ts`, play-session coordination, and persisted session state.

### 6. Revamp notebook cards

- Use the pinned visible person/alias as the title on both the corkboard and unorganized drawer.
- Omit the content body for identity-only pins.
- Render grouped messages as bullets with date/time beside each message.
- Clamp each bullet to two lines while keeping full content available through existing source inspection.
- Show transaction/order summaries and their corresponding event time without embedding dates in content strings.
- Preserve per-message source metadata internally; expose source navigation only at card level, opening the original conversation. Items expose delete only.
- Reveal all action buttons only when the card is tapped/selected; hide on deselection. Button taps must not initiate card dragging or source navigation through event bubbling.
- Keep card geometry and connection anchors stable when actions appear. Preserve usable screen-space touch targets when the board is zoomed, and reserve separate space for each item delete button while keeping message text to two lines.
- Make displayed clue counts reflect grouped cards, including resume/session summaries.
- Keep visible UI copy Vietnamese and use existing typography, spacing, and Ionicons conventions.

Illustrative layout only; the text below is not case data:

```text
Anh Tuấn
• 28/09 · 12:10: "Nội dung tin nhắn..."
• 28/09 · 12:15: "Nội dung tiếp theo..."
```

### 7. Preserve existing saves and board state

- Design backward-compatible loading or an explicit save migration before changing persisted shapes.
- Merge legacy pins only when their conversation/source identity can be verified.
- Do not fabricate timestamps, aliases, or relationships for old pins.
- Preserve board positions, connections, drawer membership, and source links when multiple cards become one.
- Define deterministic handling of merged positions and connections, and verify canonical graph mappings still work.
- Add Undo for individual message removal and whole-card removal, restoring the complete affected state. Undo must not overwrite unrelated edits made afterward.
- Keep Undo scoped to the active case and prevent pending actions from restoring evidence after a case switch or reset.
- Verify removal, reload, reset, and case-switch behavior under the grouped model.

### 8. Review and verification

- Create ASCII wireframes for identity-only, single-message, multi-message, transaction, order, and incomplete-timestamp states.
- Obtain user signoff before generating HTML wireframes; follow the project wireframe progression before UI implementation.
- Add focused tests for identity-only pins, message aggregation, duplicate pins, app/conversation isolation, visible aliases, and Shopoo pinning.
- Test event-time formatting, relative-date resolution, unknown precision, migration, board connections, and source navigation.
- Test Undo for both removal levels, including last-message removal, title-only pins, consecutive removals, restored connections, case switches, and resets.
- Run lint, the test suite, and production build.
- Verify in the browser: tap versus long-press, two-line truncation, drawer/corkboard consistency, source navigation, and save/reload behavior.

## Acceptance checks

- Pinning a conversation never captures its latest-message preview.
- Pinning two messages from the same conversation produces one card with two unique bullets.
- Identical aliases in different conversations or apps do not cause accidental merges.
- Card titles show the visible pinned identity rather than a generic record title or hidden real identity.
- Shopoo conversation/shop pins and message pins follow the same behavior as other messaging apps.
- Each message bullet uses its own event time and occupies no more than two lines.
- Missing timestamps remain explicit data gaps; capture time is never substituted for story event time.
- Existing evidence, connections, and board state survive migration and reload.
- Both message removal and whole-card removal offer Undo; restoration retains the original evidence and affected board state.

## Risks and exclusions

- **Data risk:** some exact dates/times are absent; completing them depends on authoritative story evidence.
- **Migration risk:** grouping changes card identity and can affect saved board positions and connections.
- **Integration risk:** existing uncommitted notebook work overlaps this scope.
- **Excluded:** changing story conclusions, inventing narrative records, merging aliases across apps into a proven identity, or redesigning unrelated phone-shell behavior.
