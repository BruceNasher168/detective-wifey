import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import { useSwipeBack } from '../../../shared/gestures/useSwipeBack';
import { filterOrders, money, orderStatus } from '../posheeData';
import { orderSnippet, posheeEvidence } from '../posheeEvidence';
import type { OrderFilter, PosheeOrder } from '../types';
import { EmptyState, Thumbnail } from './PosheeChrome';

interface EvidenceProps { caseId: string; onEvidence: (item: UniversalEvidenceItem) => void }
export function PosheeOrderItems({ order }: { order: PosheeOrder }) {
  return <>{order.items.map((item, index) => <div className="poshee-order-item" key={index}><Thumbnail url={item.thumbnailUrl} artwork={item.artwork} /><div><strong>{item.productTitle ?? '—'}</strong><p>Phân loại hàng: {item.variantName ?? '—'}</p><p>Số lượng: {item.quantity ?? '—'}</p><p className="poshee-price">{money(item.price)}</p></div></div>)}</>;
}
export function PosheeOrderHistory({ orders, filter, onFilter, onOpen, caseId, onEvidence }: EvidenceProps & { orders: PosheeOrder[]; filter: OrderFilter; onFilter: (filter: OrderFilter) => void; onOpen: (order: PosheeOrder) => void }) {
  const visible = filterOrders(orders, filter);
  return <><div className="poshee-filters" aria-label="Trạng thái đơn mua">{([{ id: 'all', title: 'Tất cả' }, { id: 'in_transit', title: 'Đang giao' }, { id: 'completed', title: 'Đã giao' }] as const).map(f => <button type="button" key={f.id} aria-pressed={filter === f.id} onClick={() => onFilter(f.id)}>{f.title}</button>)}</div>
    {!visible.length && <EmptyState>{orders.length ? 'Không có đơn phù hợp.' : 'Chưa có đơn mua.'}</EmptyState>}
    {visible.map(order => <StoryEvidenceTarget key={order.orderId} item={posheeEvidence(caseId, order.orderId, `Đơn mua ${order.orderId}`, orderSnippet(order), order)} onTriggerEvidence={onEvidence}><button type="button" className="poshee-card poshee-order" onClick={() => onOpen(order)} aria-label={`Xem đơn ${order.orderId}`}><div className="poshee-row"><strong>{order.isFavorite && <span className="poshee-favorite">Yêu thích</span>}{order.shopName ?? order.orderId}</strong><span className="poshee-order-status">{orderStatus(order.status)}</span></div><p className="poshee-meta">{order.orderDate ?? '—'}</p><PosheeOrderItems order={order} /><p>Người nhận: {order.recipientName ?? '—'}</p><p>Giao đến: {order.shippingAddress ?? '—'}</p><p>Thành tiền: <strong className="poshee-price">{money(order.totalAmount)}</strong></p></button></StoryEvidenceTarget>)}
  </>;
}
/** The existing project has no generic invoice drawer. Only the handle initiates drag-to-dismiss. */
export function PosheeOrderDetailDrawer({ order, caseId, onEvidence, onClose }: EvidenceProps & { order: PosheeOrder; onClose: () => void }) {
  const swipe = useSwipeBack({ onBack: onClose });
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);
  return <div className="poshee-sheet-backdrop" onClick={onClose}><section {...swipe} className="poshee-sheet" role="dialog" aria-modal="true" aria-labelledby="poshee-invoice-title" onClick={e => e.stopPropagation()} onKeyDown={e => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
    if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
  }}>
    <div className="poshee-drag-handle" aria-hidden="true" onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerCancel={() => { drag.current = null; }} onPointerUp={e => { const start = drag.current; drag.current = null; if (start && e.clientY - start.y > 64 && Math.abs(e.clientX - start.x) < (e.clientY - start.y) * 0.8) onClose(); }}><span /></div>
    <div className="poshee-row poshee-sheet-header"><h2 id="poshee-invoice-title">Chi tiết đơn mua</h2><button ref={closeRef} type="button" onClick={onClose} aria-label="Đóng chi tiết đơn"><IoClose /></button></div>
    <div className="poshee-sheet-body"><StoryEvidenceTarget item={posheeEvidence(caseId, order.orderId, `Đơn mua ${order.orderId}`, orderSnippet(order), order)} onTriggerEvidence={onEvidence}>
      <div className="poshee-card"><strong>{orderStatus(order.status)}</strong><p>Mã đơn: {order.orderId}</p><p>Ngày đặt: {order.orderDate ?? '—'}</p></div>
      <section className="poshee-card"><h3>Thông tin vận chuyển</h3><p>Đơn vị vận chuyển: {order.courier ?? '—'}</p><p>Mã vận đơn: {order.trackingNumber ?? '—'}</p><p>Người nhận: {order.recipientName ?? '—'}</p><p>Điện thoại: {order.recipientPhone ?? '—'}</p><p>Địa chỉ: {order.shippingAddress ?? '—'}</p></section>
      <section className="poshee-card"><PosheeOrderItems order={order} /><p>Thành tiền: <strong className="poshee-price">{money(order.totalAmount)}</strong></p><p>Thanh toán: {order.paymentMethod ?? '—'}</p></section>
    </StoryEvidenceTarget></div>
  </section></div>;
}
