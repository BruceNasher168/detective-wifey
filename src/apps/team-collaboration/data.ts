import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    channels: records(data.channels).map(row => textFields(row, ['id', 'name', 'lastMessage', 'suspectName'] as const)),
  };
}
