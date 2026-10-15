import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    notes: records(data.notes).map(row => textFields(row, ['id', 'title', 'content', 'suspectName'] as const)),
  };
}
