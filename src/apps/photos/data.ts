import { record, records, textFields } from '../../shared/data/read';

export function readPhotosData(value: unknown) {
  return { albums: records(record(value).albums).map(album => ({
    ...textFields(album, ['id', 'title'] as const),
    photos: records(album.photos).map(photo => textFields(photo, ['id', 'title', 'description', 'suspectName'] as const)),
  })) };
}
