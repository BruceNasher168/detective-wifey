import { record, records, text, textFields } from '../../shared/data/read';
import photosAnniversary from './assets/photos-anniversary.jpg';
import photosEveryday01 from './assets/photos-everyday-01.jpg';
import photosEveryday02 from './assets/photos-everyday-02.jpg';
import photosEveryday03 from './assets/photos-everyday-03.jpg';
import photosEveryday04 from './assets/photos-everyday-04.jpg';
import photosForensic from './assets/photos-forensic.jpg';

export type PhotoArtwork = Readonly<{ src: string; position: string }>;

type SpriteQuadrant = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

function spriteArtwork(src: string): Record<SpriteQuadrant, PhotoArtwork> {
  return {
    topLeft: { src, position: '0% 0%' },
    topRight: { src, position: '100% 0%' },
    bottomLeft: { src, position: '0% 100%' },
    bottomRight: { src, position: '100% 100%' },
  };
}

const everyday01 = spriteArtwork(photosEveryday01);
const everyday02 = spriteArtwork(photosEveryday02);
const everyday03 = spriteArtwork(photosEveryday03);
const everyday04 = spriteArtwork(photosEveryday04);
const anniversary = spriteArtwork(photosAnniversary);
const forensic = spriteArtwork(photosForensic);

const photoArtworkById: Readonly<Record<string, PhotoArtwork>> = {
  photo_0: everyday01.topLeft,
  photo_1: everyday01.topRight,
  photo_2: everyday01.bottomLeft,
  photo_3: everyday01.bottomRight,
  photo_4: everyday02.topLeft,
  photo_5: everyday02.topRight,
  photo_6: everyday03.topRight,
  photo_7: everyday03.topLeft,
  photo_8: everyday02.bottomRight,
  photo_9: everyday04.topLeft,
  photo_history_0: everyday04.bottomRight,
  photo_history_1: everyday02.bottomLeft,
  photo_history_2: everyday03.bottomRight,
  photo_history_3: everyday03.bottomLeft,
  photo_history_4: everyday04.topRight,
  photo_history_5: everyday04.bottomLeft,
  p1: anniversary.topLeft,
  p2: anniversary.topRight,
};

const photoArtworkByClue: Readonly<Record<string, PhotoArtwork>> = {
  'CLUE-PHOT-01': forensic.bottomLeft,
  'CLUE-PHOT-02': forensic.topLeft,
  'CLUE-PHOT-03': forensic.topRight,
  'CLUE-PHOT-04': forensic.bottomRight,
};

function getPhotoArtwork(photo: Record<string, unknown>): PhotoArtwork | undefined {
  const clueArtwork = photoArtworkByClue[text(photo.clueRefId)];
  return clueArtwork || photoArtworkById[text(photo.id)];
}

export function readPhotosData(value: unknown) {
  return { albums: records(record(value).albums).map(album => ({
    ...textFields(album, ['id', 'title'] as const),
    title: text(album.title) || text(album.name),
    isLocked: album.isLocked === true,
    photos: records(album.photos).map(photo => ({
      ...textFields(photo, ['id', 'title', 'description', 'date', 'suspectName', 'clueRefId'] as const),
      artwork: getPhotoArtwork(photo),
    })),
  })) };
}
