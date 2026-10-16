import { IoChevronForward, IoCubeOutline, IoPricetagOutline, IoStorefrontOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import type { NotificationFilter, PosheeNotification, PosheeOrder } from '../types';
import { filterNotifications, linkedOrder } from '../posheeData';
import { posheeEvidence } from '../posheeEvidence';
import { EmptyState } from './PosheeChrome';

const categoryIcons = { order: IoCubeOutline, promo: IoPricetagOutline, seller: IoStorefrontOutline, security: IoShieldCheckmarkOutline };

export function PosheeNotificationView({ notifications, orders, filter, onFilter, onOpen, caseId, onEvidence }: { notifications: PosheeNotification[]; orders: PosheeOrder[]; filter: NotificationFilter; onFilter: (filter: NotificationFilter) => void; onOpen: (order: PosheeOrder) => void; caseId: string; onEvidence: (item: UniversalEvidenceItem) => void }) {
  const visible = filterNotifications(notifications, filter);
  const renderRow = (n: PosheeNotification) => {
    const order = linkedOrder(n, orders);
    const Icon = categoryIcons[n.type];
    const content = <><Icon className="poshee-notification-icon" aria-hidden="true" /><div className="poshee-notification-body"><strong>{n.title}</strong><p className="poshee-meta">{n.timestamp ?? '—'}</p><p>{n.snippet ?? '—'}</p>{(n.orderId || n.trackingId) && <p className="poshee-meta">{[n.orderId && `Đơn hàng: ${n.orderId}`, n.trackingId && `Mã vận đơn: ${n.trackingId}`].filter(Boolean).join(' · ')}</p>}</div>{order && <IoChevronForward className="poshee-notification-link" aria-hidden="true" />}</>;
    return <StoryEvidenceTarget key={n.id} item={posheeEvidence(caseId, `notification:${n.id}`, n.title, [n.snippet, n.timestamp, n.orderId, n.trackingId].filter(Boolean).join('\n'), n)} onTriggerEvidence={onEvidence}>{order ? <button type="button" className="poshee-card poshee-notification" onClick={() => onOpen(order)} aria-label={`Xem đơn ${order.orderId}`}>{content}</button> : <article className="poshee-card poshee-notification">{content}</article>}</StoryEvidenceTarget>;
  };
  return <><div className="poshee-filters" aria-label="Loại thông báo">{([{ id: 'all', title: 'Tất cả' }, { id: 'order', title: 'Đơn hàng' }] as const).map(f => <button type="button" key={f.id} aria-pressed={filter === f.id} onClick={() => onFilter(f.id)}>{f.title}</button>)}</div>
    {!visible.length && <EmptyState>{notifications.length ? 'Không có thông báo phù hợp.' : 'Chưa có thông báo.'}</EmptyState>}{visible.map(renderRow)}
  </>;
}
