import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    calls: records(data.calls).map(row => textFields(row, ['id', 'name', 'time', 'duration', 'type', 'suspectName'] as const)),
    sms: records(data.sms).map(row => textFields(row, ['id', 'sender', 'time', 'text', 'suspectName'] as const)),
  };
}
