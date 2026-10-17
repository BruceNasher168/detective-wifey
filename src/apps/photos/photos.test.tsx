import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { readPhotosData } from './data';
import { PhotosApp, appDefinition } from './PhotosApp';

describe('case-supplied photo library', () => {
  const albums = [
    { id: 'recent', name: 'Gần đây', isLocked: false, photos: [{ id: 'family', title: 'Mâm cơm nhà', description: 'Bữa tối gia đình.', date: '11/10' }] },
    { id: 'private', title: 'Riêng tư', isLocked: true, photos: [{ id: 'private-photo', title: 'Nội dung đã khóa' }] },
  ];
  const render = (payload: unknown) => renderToStaticMarkup(createElement(PhotosApp, {
    caseData: { caseId: 'case', husbandName: 'Hoàng', levelNumber: 1, suspectPool: [], lockChallenges: [], appsData: { photos: payload } },
    onReturnHome: vi.fn(), onTagSuspect: vi.fn(), onRequestUnlock: vi.fn(), unlockedChallenges: new Set<string>(),
  }));

  it('shows supplied ordinary photos while protecting locked album contents', () => {
    const html = render({ albums });
    expect(html).toContain('Mâm cơm nhà');
    expect(html).toContain('11/10');
    expect(html).not.toContain('Nội dung đã khóa');
    expect(html).toContain('Mục bị ẩn');
    expect(readPhotosData({ albums }).albums[0].title).toBe('Gần đây');
  });

  it('does not invent a hidden lock or placeholder photos for an ordinary library', () => {
    const html = render({ albums: [albums[0]] });
    expect(html).not.toContain('Mục bị ẩn');
    expect(html).not.toContain('Ảnh 1');
    expect(render(null)).toContain('Chưa có ảnh.');
  });

  it('exports a valid appDefinition with parody homescreen iconAsset', () => {
    expect(appDefinition.appId).toBe('photos');
    expect(appDefinition.displayName).toBe('Photos');
    expect(appDefinition.iconAsset).toBeDefined();
    expect(typeof appDefinition.iconAsset).toBe('string');
    expect(appDefinition.dataKeys).toContain('photos');
  });
});

