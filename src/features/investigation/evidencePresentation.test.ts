import { expect, it } from 'vitest';
import { formatEvidenceSubtitle } from './evidencePresentation';

it.each([
  ['Thời gian: 5/9/2026 · 8:04', '05/09/2026 · 08:04'],
  ['15/10/2026 20:48', '15/10/2026 · 20:48'],
  ['2026-09-05T08:04:20+07:00', '05/09/2026 · 08:04'],
  ['2026-09-05', '05/09/2026'],
  ['5/9', '05/09'],
  ['8:04', '08:04'],
  ['Hôm qua · 8:04', 'Hôm qua · 08:04'],
  ['Thời gian: 15/10/2026 20:48 • Người gửi: Vợ', '15/10/2026 · 20:48'],
])('formats evidence subtitle %s without inventing missing precision', (subtitle, expected) => {
  expect(formatEvidenceSubtitle({ title: '', snippet: '', suspectToTag: '', subtitle })).toBe(expected);
});

it('retains the year from structured event fields and source timestamps', () => {
  const base = { title: '', snippet: '', suspectToTag: '' };
  expect(formatEvidenceSubtitle({ ...base, eventDate: '5/9/2026', eventTime: '8:04' })).toBe('05/09/2026 · 08:04');
  expect(formatEvidenceSubtitle({ ...base, source: { caseId: 'case', recordId: 'id', title: '', snippet: '', rawTimestamp: '2026-09-05T08:04:00Z' } })).toBe('05/09/2026 · 08:04');
});
