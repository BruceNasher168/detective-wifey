import { describe, expect, it } from 'vitest';
import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { normalizePosheeData, filterOrders, filterNotifications, linkedOrder, orderStatus, popView, safeImage } from '../apps/ecommerce/posheeData';
import { orderSnippet, posheeEvidence, resolveEvidenceAttribution } from '../apps/ecommerce/posheeEvidence';
import { PosheeOrderHistory, PosheeOrderItems } from '../apps/ecommerce/components/PosheeOrders';
import { PosheeChatListView, PosheeChatDetailView, PosheeSearchOverlay } from '../apps/ecommerce/components/PosheeMessages';
import { PosheeNotificationView } from '../apps/ecommerce/components/PosheeNotifications';
import { EcommerceApp, appDefinition } from '../apps/ecommerce/EcommerceApp';
import type { PosheeView } from '../apps/ecommerce/types';
import { loadCase } from '../features/case-runtime';
import { populateMarketplace } from '../apps/ecommerce/marketplaceContent';

const fixture = () => normalizePosheeData({
  orders: ['completed', 'in_transit', 'cancelled'].map((status, i) => ({ orderId: `order-${i}`, status, recipientName: 'Người nhận trong hồ sơ', recipientPhone: '09***123', shippingAddress: 'Địa chỉ rất dài\nDòng tiếp theo', items: [{ productTitle: 'Sản phẩm được cấp', variantName: 'Size S / Đỏ', price: 125000 }], totalAmount: 125000, paymentMethod: 'Đã cung cấp', clueRefId: 'CLUE-POSH-01' })),
  recentSearches: ['Từ khóa thường', { id: 'search-clue', text: 'Từ khóa có định danh', clueRefId: 'CLUE-POSH-04', suspectId: 's1' }],
  chats: [{ shopId: 'shop', shopName: 'Cửa hàng trong hồ sơ', lastMessage: 'Xem trước được cấp', unreadCount: 2, messages: [{ id: 'm1', sender: 'user', text: 'Nội dung được cấp', time: '20:00', clueRefId: 'CLUE-POSH-05' }] }],
  notifications: ['order', 'seller', 'promo', 'security'].map((type, i) => ({ id: `notice-${i}`, type, title: `Thông báo ${i}`, snippet: 'Nội dung giao hàng đầy đủ', orderId: type === 'order' ? 'order-1' : undefined, trackingId: 'Mã được cấp', clueRefId: 'CLUE-POSH-06' })),
})!;
const noop = () => {};
const evidenceProps = { caseId: 'case-test', onEvidence: noop };
type EventProps = { children?: ReactNode; onClick?: () => void; disabled?: boolean; 'aria-label'?: string; 'aria-pressed'?: boolean };
function elements(node: ReactNode): ReactElement<EventProps>[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<EventProps>(node)) return [];
  return [node, ...elements(node.props.children)];
}

describe('US-005 Shopoo read-only investigation', () => {
  it('rejects absent/malformed modules and tolerates optional arrays', () => {
    for (const value of [null, undefined, [], 'wrong']) expect(normalizePosheeData(value)).toBeNull();
    expect(normalizePosheeData({ orders: [null, {}], chats: [{}], notifications: [{}], recentSearches: [null, 42] })).toMatchObject({ orders: [], chats: [], notifications: [], recentSearches: [] });
  });
  it('filters canonical statuses including cancelled in All without mutation', () => {
    const data = fixture();
    const before = JSON.stringify(data);
    expect(filterOrders(data.orders, 'all')).toHaveLength(3);
    expect(filterOrders(data.orders, 'in_transit').map(o => o.orderId)).toEqual(['order-1']);
    expect(filterOrders(data.orders, 'completed').map(o => o.orderId)).toEqual(['order-0']);
    expect(orderStatus('cancelled')).toBe('Đã hủy');
    expect(JSON.stringify(data)).toBe(before);
  });
  it('preserves existing level order fields without inventing dates, quantity, totals or suspect', () => {
    const loaded = loadCase('case_01');
    const data = normalizePosheeData(loaded.appsData.ecommerce)!;
    expect(data.orders[0].status).toBe('completed');
    expect(data.orders[1].status).toBe('in_transit');
    expect(data.orders[0].items[0].variantName).toContain('Size S');
    expect(data.orders[0].recipientName).toContain('0988***123');
    expect(data.orders[0].recipientPhone).toBeUndefined();
    expect(data.orders[0].totalAmount).toBeUndefined();
    expect(data.orders[0].items[0].quantity).toBeUndefined();
    expect(data.orders[1].suspectName).toBeUndefined();
  });
  it('shows all supplied fields and missing quantity as dash, never a guessed one', () => {
    const data = fixture();
    const markup = renderToStaticMarkup(createElement(PosheeOrderItems, { order: data.orders[0] }));
    expect(markup).toContain('Size S / Đỏ');
    expect(markup).toContain('Số lượng: —');
    expect(orderSnippet(data.orders[0])).toContain('09***123');
    expect(orderSnippet(data.orders[0])).toContain('Dòng tiếp theo');
    expect(markup).not.toContain('CLUE-POSH');
  });
  it('opens ordinary records via tap and sends filter selection without collecting evidence', () => {
    const data = fixture();
    let opened = ''; let filter = ''; let collected = false;
    const tree = PosheeOrderHistory({ ...evidenceProps, orders: data.orders, filter: 'all', onOpen: order => { opened = order.orderId; }, onFilter: value => { filter = value; }, onEvidence: () => { collected = true; } });
    const buttons = elements(tree).filter(e => e.type === 'button');
    buttons.find(e => e.props['aria-label'] === 'Xem đơn order-2')!.props.onClick!();
    expect(opened).toBe('order-2');
    expect(collected).toBe(false);
    buttons.find(e => e.props.children === 'Đang giao')!.props.onClick!();
    expect(filter).toBe('in_transit');
  });
  it('renders specified empty history and filter states with controls available', () => {
    const data = fixture();
    const render = (orders: typeof data.orders, filter: 'all' | 'completed') => renderToStaticMarkup(createElement(PosheeOrderHistory, { ...evidenceProps, orders, filter, onOpen: noop, onFilter: noop }));
    expect(render([], 'all')).toContain('Chưa có đơn mua.');
    expect(render([data.orders[1]], 'completed')).toContain('Không có đơn phù hợp.');
    expect(render([], 'all')).toContain('Đang giao');
  });
  it('filters every notification category and resolves only supplied exact order references', () => {
    const data = fixture();
    expect(filterNotifications(data.notifications, 'all')).toHaveLength(4);
    for (const type of ['order', 'seller', 'promo', 'security'] as const) expect(filterNotifications(data.notifications, type)).toHaveLength(1);
    expect(linkedOrder(data.notifications[0], data.orders)?.orderId).toBe('order-1');
    expect(linkedOrder({ ...data.notifications[0], orderId: 'missing' }, data.orders)).toBeUndefined();
    expect(linkedOrder({ ...data.notifications[0], orderId: undefined }, data.orders)).toBeUndefined();
  });
  it('keeps unlinked notifications readable and without an invoice action', () => {
    const data = fixture();
    const markup = renderToStaticMarkup(createElement(PosheeNotificationView, { ...evidenceProps, notifications: data.notifications, orders: data.orders, filter: 'all', onFilter: noop, onOpen: noop }));
    expect((markup.match(/aria-label="Xem đơn/g) ?? [])).toHaveLength(1);
    expect(markup).toContain('Nội dung giao hàng đầy đủ');
    expect(markup).not.toContain('CLUE-POSH');
  });
  it('disables active shop filtering without source activity and never infers online state', () => {
    const data = fixture();
    const tree = PosheeChatListView({ ...evidenceProps, chats: data.chats, activeOnly: false, onFilter: noop, onOpen: noop });
    expect(elements(tree).find(e => e.type === 'button' && e.props.children === 'Đang hoạt động')?.props.disabled).toBe(true);
    const markup = renderToStaticMarkup(createElement(PosheeChatDetailView, { ...evidenceProps, chat: data.chats[0] }));
    expect(markup).toContain('Nội dung được cấp');
    expect(markup).toContain('readOnly');
    expect(markup).not.toContain('Trực tuyến');
    expect(markup).not.toContain('Bạn đang hỏi về quy cách sản phẩm');
  });
  it('keeps history read-only and separates popular suggestions from evidence targets', () => {
    const data = fixture();
    data.popularSearches = ['Gợi ý quảng bá'];
    const markup = renderToStaticMarkup(createElement(PosheeSearchOverlay, { ...evidenceProps, data }));
    expect(markup).toContain('Từ khóa có định danh');
    expect(markup).toMatch(/disabled=""[^>]*>Xóa lịch sử/);
    expect(markup).toContain('Tìm kiếm phổ biến');
    expect(markup).not.toContain('CLUE-POSH');
    expect(data.recentSearches[0].clueRefId).toBeUndefined();
    expect(data.recentSearches[1].clueRefId).toBe('CLUE-POSH-04');
  });
  it('pops only one navigation level, preserving origin', () => {
    const stack: PosheeView[] = [{ screen: 'notifications' }, { screen: 'inbox' }, { screen: 'thread', shopId: 'shop' }];
    expect(popView(stack)).toEqual([{ screen: 'notifications' }, { screen: 'inbox' }]);
    expect(popView([{ screen: 'home' }])).toEqual([{ screen: 'home' }]);
    expect(stack).toHaveLength(3);
  });
  it('retains six clue references, source identity and only exact supplied suspect attribution', () => {
    for (let i = 1; i <= 6; i++) {
      const item = posheeEvidence('case-test', 'source-record', 'Titre', 'Texte', { clueRefId: `CLUE-POSH-0${i}` });
      expect(item).toMatchObject({ source: { caseId: 'case-test', recordId: 'source-record', clueRefId: `CLUE-POSH-0${i}` }, suspectToTag: '' });
    }
    const pool = [{ suspectId: 's1', displayName: 'Tên được cấp' }];
    const item = posheeEvidence('c', 'r', 'T', 'S', { suspectId: 's1' });
    expect(resolveEvidenceAttribution(item, pool).suspectToTag).toBe('Tên được cấp');
    expect(resolveEvidenceAttribution({ ...item, suspectId: 'missing' }, pool).suspectToTag).toBe('');
    expect(resolveEvidenceAttribution({ ...item, suspectToTag: 'Tên trực tiếp' }, pool).suspectToTag).toBe('Tên trực tiếp');
  });
  it('blocks runtime image requests and permits only supplied embedded raster bytes', () => {
    for (const url of ['https://example.com/p.png', '/assets/p.png', 'javascript:alert(1)', 'data:image/svg+xml,<svg/>']) expect(safeImage(url)).toBeUndefined();
    expect(safeImage('data:image/png;base64,YWJj')).toBe('data:image/png;base64,YWJj');
  });
  it('renders missing data safely and accepts the poshee alias without adding narrative', () => {
    const config = loadCase('case_01');
    const render = (appsData: typeof config.appsData) => renderToStaticMarkup(createElement(EcommerceApp, { caseData: { ...config, appsData }, onReturnHome: noop, onTagSuspect: noop, unlockedChallenges: new Set<string>() }));
    expect(render({})).toContain('Chưa có dữ liệu Shopoo cho màn này.');
    expect(render({ poshee: {} })).toContain('Chuột không dây Lô Gì Tếch');
    expect(render({ poshee: {} })).not.toContain('Mai Lễ Tân');
    expect(appDefinition.appId).toBe('ecommerce');
    expect(appDefinition.themeColor).toBe('#EE4D2D');
  });
  it('adds authored marketplace scenery without changing case evidence or duplicating records', () => {
    const source = fixture();
    const before = JSON.stringify(source);
    const populated = populateMarketplace(source)!;
    expect(JSON.stringify(source)).toBe(before);
    expect(populated.orders.slice(0, source.orders.length)).toEqual(source.orders);
    expect(populated.products).toHaveLength(8);
    expect(populated.chats.find(c => c.shopId === 'matme-official')?.pinnedProduct?.artwork).toBe('polo');
    expect(populated.chats.filter(c => c.shopId !== 'shop').every(c => !c.suspectId && !c.suspectName && !c.clueRefId)).toBe(true);
    const repeated = populateMarketplace(populated)!;
    expect(repeated.orders).toHaveLength(populated.orders.length);
    expect(repeated.chats).toHaveLength(populated.chats.length);
    expect(populateMarketplace(null)).toBeNull();
    expect(appDefinition.iconAsset).toBeTruthy();
  });
});
