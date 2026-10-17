import type { AppId } from '../../shared/contracts/app-contracts';
import type { EvidenceSource, PinnedMessageEntry } from '../../shared/contracts/evidence';

export type PinnedMessageItem = PinnedMessageEntry;

export interface TaggedSuspect {
  suspectId: string;
  displayName: string;
  sourceApp: AppId;
  timestamp: number;
  evidence?: EvidenceSource;
  conversationId?: string;
  isExplicitConversationPin?: boolean;
  messages?: PinnedMessageItem[];
}

/**
 * Pinned evidence aggregator and deduplicator.
 *
 * Invariants:
 * - Grouping key for conversations: (caseId, sourceApp, conversationId).
 * - Pinning a conversation pins the visible alias only (no body/preview).
 * - Pinning a message adds a unique message bullet to that conversation's card.
 * - Re-pinning an existing message does not duplicate it or increase card count.
 * - Pinning a conversation when messages already exist preserves those messages and marks conversation as explicitly pinned.
 * - Transactions, orders, and non-conversation clues remain individually addressable.
 * - Legacy person tags without evidence remain supported.
 */
export function tagSuspect(
  suspects: readonly TaggedSuspect[],
  name: string,
  appId: AppId,
  timestamp: number,
  evidence?: EvidenceSource,
): { suspects: TaggedSuspect[]; added: boolean } {
  const conversationId = evidence?.conversationId || (evidence?.kind === 'conversation' ? evidence.recordId : undefined);

  // Grouped conversation flow
  if (conversationId && evidence?.caseId) {
    const caseId = evidence.caseId;
    const existingIndex = suspects.findIndex(
      s => s.sourceApp === appId &&
           s.evidence?.caseId === caseId &&
           (s.conversationId === conversationId || s.evidence?.conversationId === conversationId || s.evidence?.recordId === conversationId),
    );

    const isConversationPin = evidence.kind === 'conversation' || evidence.isExplicitConversationPin;
    const visibleName = evidence.visibleAlias?.trim() || name.trim();

    if (isConversationPin) {
      if (existingIndex !== -1) {
        const existing = suspects[existingIndex];
        // If already explicitly pinned and visible name matches, nothing new added
        if (existing.isExplicitConversationPin && existing.displayName === visibleName) {
          return { suspects: [...suspects], added: false };
        }
        // Upgrade to explicitly pinned conversation while preserving all existing messages
        const updatedList = [...suspects];
        updatedList[existingIndex] = {
          ...existing,
          displayName: visibleName || existing.displayName,
          isExplicitConversationPin: true,
          evidence: {
            ...existing.evidence,
            ...evidence,
            title: visibleName || existing.displayName,
            snippet: '',
            isExplicitConversationPin: true,
          },
        };
        return { suspects: updatedList, added: true };
      }

      // New title-only conversation card
      const newSuspect: TaggedSuspect = {
        suspectId: `tag_${timestamp}`,
        displayName: visibleName,
        sourceApp: appId,
        timestamp,
        conversationId,
        isExplicitConversationPin: true,
        messages: [],
        evidence: {
          ...evidence,
          title: visibleName,
          snippet: '',
          isExplicitConversationPin: true,
        },
      };
      return { suspects: [...suspects, newSuspect], added: true };
    }

    // Message pin flow
    const messageEntry: PinnedMessageItem = {
      recordId: evidence.recordId,
      text: evidence.snippet,
      eventTime: evidence.eventTime,
      eventDate: evidence.eventDate,
      rawTimestamp: evidence.rawTimestamp,
      clueRefId: evidence.clueRefId,
    };

    if (existingIndex !== -1) {
      const existing = suspects[existingIndex];
      const currentMessages = existing.messages || [];

      // Deduplicate message by recordId
      if (currentMessages.some(m => m.recordId === messageEntry.recordId)) {
        return { suspects: [...suspects], added: false };
      }

      const updatedCard: TaggedSuspect = {
        ...existing,
        displayName: existing.displayName || visibleName,
        messages: [...currentMessages, messageEntry],
      };
      const updatedList = [...suspects];
      updatedList[existingIndex] = updatedCard;
      return { suspects: updatedList, added: true };
    }

    // Create new conversation card with this first message
    const newSuspect: TaggedSuspect = {
      suspectId: `tag_${timestamp}`,
      displayName: visibleName,
      sourceApp: appId,
      timestamp,
      conversationId,
      isExplicitConversationPin: false,
      messages: [messageEntry],
      evidence: {
        ...evidence,
        title: visibleName,
      },
    };
    return { suspects: [...suspects, newSuspect], added: true };
  }

  // Non-conversation records (transactions, orders, generic evidence)
  if (evidence) {
    if (suspects.some(s => s.sourceApp === appId &&
                           s.evidence?.caseId === evidence.caseId &&
                           s.evidence.recordId === evidence.recordId)) {
      return { suspects: [...suspects], added: false };
    }
    return {
      added: true,
      suspects: [...suspects, {
        suspectId: `tag_${timestamp}`,
        displayName: evidence.visibleAlias || name,
        sourceApp: appId,
        timestamp,
        evidence,
      }],
    };
  }

  // Legacy person tag without evidence
  if (suspects.some(s => s.displayName === name)) {
    return { suspects: [...suspects], added: false };
  }

  return {
    added: true,
    suspects: [...suspects, {
      suspectId: `tag_${timestamp}`,
      displayName: name,
      sourceApp: appId,
      timestamp,
    }],
  };
}

/**
 * Removes an individual message from a conversation card.
 * If the card has no remaining messages:
 * - If the conversation was explicitly pinned, keeps the title-only card.
 * - Otherwise, removes the empty card entirely.
 */
export function removePinnedMessage(
  suspects: readonly TaggedSuspect[],
  targetId: string, // suspectId or conversationId
  messageRecordId: string,
): {
  suspects: TaggedSuspect[];
  removedMessage?: PinnedMessageItem;
  removedCard?: TaggedSuspect;
} {
  const cardIndex = suspects.findIndex(
    s => s.suspectId === targetId || s.conversationId === targetId,
  );
  if (cardIndex === -1) {
    return { suspects: [...suspects] };
  }

  const card = suspects[cardIndex];
  const messages = card.messages || [];
  const messageToRemove = messages.find(m => m.recordId === messageRecordId);
  if (!messageToRemove) {
    return { suspects: [...suspects] };
  }

  const remainingMessages = messages.filter(m => m.recordId !== messageRecordId);
  if (remainingMessages.length === 0 && !card.isExplicitConversationPin) {
    // Remove the entire card since it was not explicitly pinned
    const updated = suspects.filter((_, idx) => idx !== cardIndex);
    return {
      suspects: updated,
      removedMessage: messageToRemove,
      removedCard: card,
    };
  }

  // Keep card with updated messages list
  const updatedCard: TaggedSuspect = {
    ...card,
    messages: remainingMessages,
  };
  const updated = [...suspects];
  updated[cardIndex] = updatedCard;

  return {
    suspects: updated,
    removedMessage: messageToRemove,
  };
}

/**
 * Removes a whole clue card (and all its pinned messages).
 */
export function removePinnedCard(
  suspects: readonly TaggedSuspect[],
  targetId: string,
): {
  suspects: TaggedSuspect[];
  removedCard?: TaggedSuspect;
} {
  const card = suspects.find(
    s => s.suspectId === targetId || s.evidence?.recordId === targetId || s.conversationId === targetId,
  );
  if (!card) {
    return { suspects: [...suspects] };
  }
  return {
    suspects: suspects.filter(s => s !== card),
    removedCard: card,
  };
}

/**
 * Restores removed evidence (either a card or an individual message).
 * Handles idempotency: if the card or message was re-pinned in the meantime, merges cleanly without duplication.
 */
export function restorePinnedEvidence(
  suspects: readonly TaggedSuspect[],
  restored: {
    card?: TaggedSuspect;
    message?: PinnedMessageItem;
    targetSuspectId?: string;
    targetId?: string;
  },
): TaggedSuspect[] {
  // 1. Restoring a whole card
  if (restored.card) {
    const existingIndex = suspects.findIndex(
      s => s.suspectId === restored.card!.suspectId ||
           (s.conversationId && restored.card!.conversationId &&
            s.conversationId === restored.card!.conversationId &&
            s.sourceApp === restored.card!.sourceApp),
    );
    if (existingIndex === -1) {
      return [...suspects, restored.card];
    }
    // If card exists, merge explicit pin state and messages
    const existing = suspects[existingIndex];
    const mergedMessages = [...(existing.messages || [])];
    for (const msg of restored.card.messages || []) {
      if (!mergedMessages.some(m => m.recordId === msg.recordId)) {
        mergedMessages.push(msg);
      }
    }
    const updated = [...suspects];
    updated[existingIndex] = {
      ...existing,
      isExplicitConversationPin: existing.isExplicitConversationPin || restored.card.isExplicitConversationPin,
      messages: mergedMessages,
    };
    return updated;
  }

  // 2. Restoring an individual message
  const targetId = restored.targetSuspectId || restored.targetId;
  if (restored.message && targetId) {
    const cardIndex = suspects.findIndex(
      s => s.suspectId === targetId || s.conversationId === targetId || s.evidence?.recordId === targetId,
    );
    if (cardIndex !== -1) {
      const card = suspects[cardIndex];
      const messages = card.messages || [];
      if (!messages.some(m => m.recordId === restored.message!.recordId)) {
        const updatedCard = {
          ...card,
          messages: [...messages, restored.message],
        };
        const updated = [...suspects];
        updated[cardIndex] = updatedCard;
        return updated;
      }
      return [...suspects];
    }
  }

  return [...suspects];
}
