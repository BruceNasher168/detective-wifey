import { record, records, text, textFields } from '../../shared/data/read';

export function readPhotosData(value: unknown) {
  return { albums: records(record(value).albums).map(album => ({
    ...textFields(album, ['id', 'title'] as const),
    title: text(album.title) || text(album.name),
    isLocked: album.isLocked === true,
    photos: records(album.photos).map(photo => textFields(photo, ['id', 'title', 'description', 'date', 'suspectName', 'clueRefId'] as const)),
  })) };
}
