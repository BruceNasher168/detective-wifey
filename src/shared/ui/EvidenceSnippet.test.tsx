import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { EvidenceSnippet } from './EvidenceSnippet';

it('shows accessible field icons and preserves values, multiline addresses and unknown text', () => {
  const text = 'Sản phẩm: Váy satin\nPhân loại: Be, S\nĐịa chỉ: Technosoft\nTầng 2\nSố điện thoại: 0988886677\nThành tiền: 489.000đ';
  const markup = renderToStaticMarkup(createElement(EvidenceSnippet, { text, fieldIconsEnabled: true }));
  expect(markup.match(/<svg/g)).toHaveLength(5);
  for (const label of ['Sản phẩm', 'Phân loại', 'Địa chỉ', 'Số điện thoại', 'Thành tiền']) {
    expect(markup).toContain(`class="sr-only">${label}: `);
  }
  for (const value of ['Váy satin', 'Be, S', 'Technosoft', 'Tầng 2', '0988886677', '489.000đ']) {
    expect(markup).toContain(value);
  }
  expect(renderToStaticMarkup(createElement(EvidenceSnippet, { text }))).not.toContain('<svg');
});
