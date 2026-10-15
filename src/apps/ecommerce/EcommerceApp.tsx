import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { IoBagHandle, IoSearchOutline, IoCameraOutline } from 'react-icons/io5';
import type { AppDefinition, VirtualAppProps } from '../../types/app-contracts';
import { useSwipeBack } from '../../hooks/useSwipeBack';
import { UniversalEvidenceModal, type UniversalEvidenceItem } from '../../components/UniversalEvidenceModal';
import { normalizePosheeData, popView } from './posheeData';
import { resolveEvidenceAttribution } from './posheeEvidence';
import type { NotificationFilter, OrderFilter, PosheeOrder, PosheeTab, PosheeView } from './types';
import { EmptyState, DisabledControl, PosheeHeader, PosheeTabs } from './components/PosheeChrome';
import { PosheeHomeView, PosheeProfileView } from './components/PosheeMarketplace';
import { PosheeOrderDetailDrawer, PosheeOrderHistory } from './components/PosheeOrders';
import { PosheeChatDetailView, PosheeChatListView, PosheeSearchOverlay } from './components/PosheeMessages';
import { PosheeNotificationView } from './components/PosheeNotifications';
import './poshee.css';

const titles = { home: 'Poshee', notifications: 'Thông báo', profile: 'Tôi', orders: 'Lịch sử mua hàng', search: 'Tìm kiếm', inbox: 'Trò chuyện', thread: 'Trò chuyện' };

export function EcommerceApp(props: VirtualAppProps) { return <PosheeSession key={props.caseData.caseId} {...props} />; }
/** Navigation/filter state is transient; narrative records remain immutable. */
function PosheeSession({ caseData, onReturnHome, onTagSuspect }: VirtualAppProps) {
  const data = useMemo(() => normalizePosheeData(caseData.appsData?.ecommerce ?? caseData.appsData?.poshee), [caseData]);
  const [stack, setStack] = useState<PosheeView[]>([{ screen: 'home' }]);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all');
  const [activeChatsOnly, setActiveChatsOnly] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PosheeOrder | null>(null);
  const [evidence, setEvidence] = useState<UniversalEvidenceItem | null>(null);
  const scrollPositions = useRef(new Map<string, number>());
  const scrollArea = useRef<HTMLElement | null>(null);
  const view = stack[stack.length - 1];
  const viewKey = JSON.stringify(view);
  useLayoutEffect(() => {
    if (scrollArea.current) scrollArea.current.scrollTop = scrollPositions.current.get(viewKey) ?? 0;
  }, [viewKey]);
  const saveScroll = () => { if (scrollArea.current) scrollPositions.current.set(JSON.stringify(view), scrollArea.current.scrollTop); };
  const push = (next: PosheeView) => { saveScroll(); setStack(s => [...s, next]); };
  const back = () => {
    if (evidence) { setEvidence(null); return; }
    if (selectedOrder) { setSelectedOrder(null); return; }
    if (stack.length > 1) { saveScroll(); setStack(popView); } else onReturnHome();
  };
  const swipe = useSwipeBack({ onBack: back, enabled: !evidence && !selectedOrder });
  const selectTab = (tab: PosheeTab) => { saveScroll(); setStack([{ screen: tab }]); };
  const evidenceProps = { caseId: caseData.caseId, onEvidence: (item: UniversalEvidenceItem) => setEvidence(resolveEvidenceAttribution(item, caseData.suspectPool)) };
  const root = view.screen === 'home' || view.screen === 'notifications' || view.screen === 'profile';
  const selectedChat = view.screen === 'thread' ? data?.chats.find(c => c.shopId === view.shopId) : undefined;
  return <div {...swipe} className="poshee-app" style={{ '--poshee-brand': '#EE4D2D' } as CSSProperties}>
    <div className="poshee-screen min-h-[44px]" inert={selectedOrder !== null || evidence !== null}>
    <PosheeHeader title={titles[view.screen]} onBack={back} onChat={root ? () => push({ screen: 'inbox' }) : undefined} cartCount={data?.cartCount} chatCount={data?.chatUnreadCount}>
      {view.screen === 'home' ? <div className="poshee-search-entry"><button type="button" onClick={() => push({ screen: 'search' })}><IoSearchOutline /><span>Tìm kiếm sản phẩm</span></button><DisabledControl label="Máy ảnh"><IoCameraOutline /></DisabledControl></div> : undefined}
    </PosheeHeader>
    <main key={viewKey} ref={scrollArea} className="poshee-content">
      {!data ? <EmptyState>Chưa có dữ liệu Poshee cho màn này.</EmptyState> : <>
        {view.screen === 'home' && <PosheeHomeView data={data} />}
        {view.screen === 'profile' && <PosheeProfileView data={data} onOrders={() => push({ screen: 'orders' })} />}
        {view.screen === 'orders' && <PosheeOrderHistory orders={data.orders} filter={orderFilter} onFilter={setOrderFilter} onOpen={setSelectedOrder} {...evidenceProps} />}
        {view.screen === 'search' && <PosheeSearchOverlay data={data} {...evidenceProps} />}
        {view.screen === 'inbox' && <PosheeChatListView chats={data.chats} activeOnly={activeChatsOnly} onFilter={setActiveChatsOnly} onOpen={chat => push({ screen: 'thread', shopId: chat.shopId })} {...evidenceProps} />}
        {selectedChat && <PosheeChatDetailView chat={selectedChat} {...evidenceProps} />}
        {view.screen === 'notifications' && <PosheeNotificationView notifications={data.notifications} orders={data.orders} filter={notificationFilter} onFilter={setNotificationFilter} onOpen={setSelectedOrder} {...evidenceProps} />}
      </>}
    </main>
    {root && <PosheeTabs active={view.screen as PosheeTab} onSelect={selectTab} unread={data?.unreadBadge} />}
    </div>
    {selectedOrder && <div style={{ display: 'contents' }} inert={evidence !== null}><PosheeOrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} {...evidenceProps} /></div>}
    {evidence && <UniversalEvidenceModal isOpen item={evidence} onClose={() => setEvidence(null)} onPinEvidence={suspect => { if (suspect.trim()) onTagSuspect(suspect, 'ecommerce', evidence.source); }} />}
  </div>;
}

export const appDefinition: AppDefinition = { appId: 'ecommerce', displayName: 'Poshee', icon: IoBagHandle, themeGradient: 'from-orange-500 to-amber-600', themeColor: '#EE4D2D', notificationBadgeCount: 0, isLocked: false, component: EcommerceApp };
export const PosheeApp = EcommerceApp;
export default EcommerceApp;
