import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    emails: records(data.emails).map(row => textFields(row, ['id', 'subject', 'sender', 'time', 'snippet', 'suspectName'] as const)),
  };
}
