import { IoChevronForward } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';
import type { UniversalEvidenceItem } from '../../../components/UniversalEvidenceModal';
import type { NotificationFilter, PosheeNotification, PosheeOrder } from '../types';
import { filterNotifications, linkedOrder } from '../posheeData';
import { posheeEvidence } from '../posheeEvidence';
import { DisabledControl, EmptyState } from './PosheeChrome';

export function PosheeNotificationView({ notifications, orders, filter, onFilter, onOpen, caseId, onEvidence }: { notifications: PosheeNotification[]; orders: PosheeOrder[]; filter: NotificationFilter; onFilter: (filter: NotificationFilter) => void; onOpen: (order: PosheeOrder) => void; caseId: string; onEvidence: (item: UniversalEvidenceItem) => void }) {
  const visible = filterNotifications(notifications, filter);
  const renderRow = (n: PosheeNotification) => {
    const order = linkedOrder(n, orders);
    const content = <><strong>{n.title}</strong><p className="poshee-meta">{n.timestamp ?? '—'}</p>{n.orderId && <p>Đơn hàng: {n.orderId}</p>}{n.trackingId && <p>Mã vận đơn: {n.trackingId}</p>}<p>{n.snippet ?? '—'}</p></>;
    return <StoryEvidenceTarget key={n.id} item={posheeEvidence(caseId, `notification:${n.id}`, n.title, [n.snippet, n.timestamp, n.orderId, n.trackingId].filter(Boolean).join('\n'), n)} onTriggerEvidence={onEvidence}>{order ? <button type="button" className="poshee-card poshee-notification" onClick={() => onOpen(order)} aria-label={`Xem đơn ${order.orderId}`}>{content}</button> : <article className="poshee-card poshee-notification">{content}</article>}</StoryEvidenceTarget>;
  };
  return <><section className="poshee-card"><button type="button" className="poshee-row" onClick={() => onFilter('seller')}>Cập nhật Người bán <IoChevronForward /></button><button type="button" className="poshee-row" onClick={() => onFilter('order')}>Cập nhật đơn hàng <IoChevronForward /></button></section>
    {filter === 'all' && notifications.filter(n => n.type === 'order' && n.isPinned === true).map(renderRow)}
    <div className="poshee-row"><h2>Cập nhật mới nhất</h2><DisabledControl>Đọc tất cả</DisabledControl></div>
    <div className="poshee-filters" aria-label="Loại thông báo">{([{ id: 'all', title: 'Thông báo nổi bật' }, { id: 'promo', title: 'Khuyến mãi' }, { id: 'order', title: 'Đơn hàng' }, { id: 'security', title: 'Cập nhật Poshee' }] as const).map(f => <button type="button" key={f.id} aria-pressed={filter === f.id} onClick={() => onFilter(f.id)}>{f.title}</button>)}</div>
    {!visible.length && <EmptyState>{notifications.length ? 'Không có thông báo phù hợp.' : 'Chưa có thông báo.'}</EmptyState>}{visible.map(renderRow)}
  </>;
}
