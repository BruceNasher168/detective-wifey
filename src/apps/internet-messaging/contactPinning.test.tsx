import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MessagingContactsView } from './components/MessagingContactsView';
import { normalizeTaggedSuspects, tagSuspect } from '../../features/investigation';
import { deriveNodesFromTaggedEvidence } from '../../features/wife-notebook/WifeNotebookModal';
import { LEVEL_01_KNOWLEDGE_GRAPH } from '../../features/wife-notebook/level01Fixture';
import type { MessagingContact } from './types';
import type { EvidenceSource } from '../../shared/contracts/evidence';

const state = vi.hoisted(() => ({
  contact: null as MessagingContact | null,
  sheet: null as { onPinEvidence: (name: string) => void; source?: EvidenceSource } | null,
}));
vi.mock('../../shared/motion/useMotionState', () => ({
  useMotionState: (initial: unknown) => [initial === null ? state.contact : initial, vi.fn()],
}));
vi.mock('./components/MessagingEvidenceSheet', () => ({
  MessagingEvidenceSheet: (props: NonNullable<typeof state.sheet>) => {
    state.sheet = props;
    return null;
  },
}));

it.each(['0988886677', undefined])('pins contact details with supplied phone %s into the clue card', phone => {
  state.contact = { id: 'contact_tuan', name: 'Anh Tuấn Thợ Điện', section: 'A', department: 'Bảo trì', phone };
  state.sheet = null;
  const onTagSuspect = vi.fn();
  renderToStaticMarkup(<MessagingContactsView caseId="case_01" contacts={[state.contact]}
    onTagSuspect={onTagSuspect} onReturnHome={vi.fn()} />);

  const sheet = state.sheet!;
  sheet.onPinEvidence(state.contact.name);
  expect(onTagSuspect).toHaveBeenCalledWith(state.contact.name, expect.objectContaining({
    caseId: 'case_01', recordId: 'contact_tuan', kind: 'person',
    snippet: phone ? `SĐT: ${phone} • Bảo trì` : 'Bảo trì',
  }));
  const pinned = tagSuspect([], state.contact.name, 'internet-messaging', 1, onTagSuspect.mock.calls[0][1]);
  const nodes = deriveNodesFromTaggedEvidence(LEVEL_01_KNOWLEDGE_GRAPH, pinned.suspects);
  expect(nodes).toHaveLength(1);
  expect(nodes[0].label).toBe(state.contact.name);
  expect([nodes[0].subtitle, ...(nodes[0].messages?.map(message => message.text) ?? [])]
    .filter(Boolean).join('\n')).toBe(sheet.source!.snippet);

  const message: EvidenceSource = {
    caseId: 'case_01', recordId: 'thread_tuan_m1', conversationId: 'thread_tuan',
    kind: 'message', title: state.contact.name, visibleAlias: state.contact.name,
    snippet: 'Anh tới rồi.', eventTime: '19:30',
  };
  const withMessage = tagSuspect(pinned.suspects, state.contact.name, 'internet-messaging', 2, message);
  const reloaded = normalizeTaggedSuspects(JSON.parse(JSON.stringify(withMessage.suspects)));
  const withSecondMessage = tagSuspect(reloaded, state.contact.name, 'internet-messaging', 3, {
    ...message, recordId: 'thread_tuan_m2', snippet: 'Em xuống nhé.',
  });
  const mergedNodes = deriveNodesFromTaggedEvidence(LEVEL_01_KNOWLEDGE_GRAPH, withSecondMessage.suspects);
  expect(mergedNodes).toHaveLength(1);
  expect(mergedNodes[0].messages?.map(entry => entry.text)).toEqual([
    sheet.source!.snippet, 'Anh tới rồi.', 'Em xuống nhé.',
  ]);
});
