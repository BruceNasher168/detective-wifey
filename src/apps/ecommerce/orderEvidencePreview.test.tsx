import { beforeEach, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { EcommerceApp } from './EcommerceApp';
import { loadCase } from '../../features/case-runtime';
import type { EcommerceItem } from './types';
import { Thumbnail } from './components/EcommerceChrome';

const state = vi.hoisted(() => ({ nullCalls: 0 }));
vi.mock('../../shared/motion/useMotionState', () => ({
  useMotionState: (initial: unknown) => [
    initial === null && ++state.nullCalls === 2 ? {
      title: 'Order preview', snippet: 'Receipt', suspectToTag: 'Recipient',
      source: { caseId: 'case_01', recordId: 'target-order', title: 'Order preview', snippet: 'Receipt', kind: 'order' },
    } : initial,
    vi.fn(),
  ],
}));

beforeEach(() => { state.nullCalls = 0; });

function renderPreview(item: EcommerceItem) {
  const caseData = loadCase('case_01');
  const html = renderToStaticMarkup(<EcommerceApp
    caseData={{ ...caseData, appsData: { ecommerce: { orders: [
      { orderId: 'other-order', items: [{ artwork: 'perfume' }] },
      { orderId: 'target-order', items: [item, { artwork: 'mouse' }] },
    ] } } }}
    onReturnHome={vi.fn()} onTagSuspect={vi.fn()} unlockedChallenges={new Set()}
  />);
  return html.slice(html.indexOf('aria-labelledby="universal-evidence-title"'));
}

it('shows the source order first product artwork in the pin dialog', () => {
  const html = renderPreview({ artwork: 'case-polo-blue' });
  expect(html).toContain('ecommerce-thumbnail');
  expect(html).toContain(renderToStaticMarkup(<Thumbnail artwork="case-polo-blue" />));
  expect(html).not.toContain('contact-avatar');
});

it('reuses the supplied embedded product image', () => {
  expect(renderPreview({ thumbnailUrl: 'data:image/png;base64,YWJj' })).toContain('src="data:image/png;base64,YWJj"');
});

it('keeps the existing image placeholder when the product has no image', () => {
  const html = renderPreview({ productTitle: 'Product' });
  expect(html).toContain('ecommerce-thumbnail');
  expect(html).not.toContain('contact-avatar');
  expect(html).not.toContain('ecommerce-artwork');
});
