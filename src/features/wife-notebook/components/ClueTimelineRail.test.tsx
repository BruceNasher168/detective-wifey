import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClueTimelineRail, type TimelineEntryItem } from './ClueTimelineRail';

it.each([false, true])('shows item delete buttons only for multiple entries (selected: %s)', isSelected => {
  const entries: TimelineEntryItem[] = [
    { id: 'first', timestampText: '15/10', direction: 'incoming', content: 'First clue' },
    { id: 'second', timestampText: '16/10', direction: 'outgoing', content: 'Second clue' },
  ];
  const render = (items: TimelineEntryItem[]) => renderToStaticMarkup(
    <ClueTimelineRail entries={items} isSelected={isSelected} onDeleteItem={vi.fn()} />,
  );

  expect(render(entries).match(/<button /g)).toHaveLength(2);
  expect(render(entries.slice(0, 1))).not.toContain('<button ');
  expect(render(entries.slice(0, 1))).toContain('First clue');
  expect(render([])).toBe('');
});
