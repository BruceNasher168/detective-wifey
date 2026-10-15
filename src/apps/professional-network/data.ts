import { record, records, textFields } from '../../shared/data/read';

export function readAppData(value: unknown) {
  const data = record(value);
  return {
    posts: records(data.posts).map(row => textFields(row, ['id', 'author', 'time', 'content', 'suspectName'] as const)),
  };
}
