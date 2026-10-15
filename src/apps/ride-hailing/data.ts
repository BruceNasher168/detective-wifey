import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    trips: records(data.trips).map(row => textFields(row, ['id', 'driver', 'time', 'cost', 'pickup', 'dropoff', 'suspectName'] as const)),
  };
}
