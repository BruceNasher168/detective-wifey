import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    history: records(data.history).map(row => textFields(row, ['id', 'title', 'time', 'url', 'suspectName'] as const)),
  };
}
