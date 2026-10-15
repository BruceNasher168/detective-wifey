import { IoAddOutline, IoBagHandleOutline, IoHappyOutline, IoShieldCheckmarkOutline, IoStorefrontOutline } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import { money } from '../posheeData';
import { posheeEvidence } from '../posheeEvidence';
import type { PosheeChat, PosheeData } from '../types';
import { DisabledControl, EmptyState, Thumbnail } from './PosheeChrome';

interface EvidenceProps { caseId: string; onEvidence: (item: UniversalEvidenceItem) => void }
export function PosheeSearchOverlay({ data, caseId, onEvidence }: EvidenceProps & { data: PosheeData }) {
  return <><input aria-label="Tìm kiếm sản phẩm — chỉ đọc" placeholder="Tìm kiếm sản phẩm" readOnly className="poshee-search-input" /><div className="poshee-row"><h2>Lịch sử tìm kiếm gần đây</h2><DisabledControl>Xóa lịch sử</DisabledControl></div>
    {data.recentSearches.length ? <div className="poshee-search-chips">{data.recentSearches.map(s => <StoryEvidenceTarget key={s.id} item={posheeEvidence(caseId, s.id, 'Lịch sử tìm kiếm', s.text, s)} onTriggerEvidence={onEvidence} className="poshee-search-chip"><span>{s.text}</span></StoryEvidenceTarget>)}</div> : <EmptyState>Chưa có lịch sử tìm kiếm.</EmptyState>}
    {data.popularSearches.length > 0 && <section className="poshee-card"><h2>Tìm kiếm phổ biến</h2>{data.popularSearches.map((s, index) => <p key={index}>{s}</p>)}</section>}
  </>;
}
export function PosheeChatListView({ chats, activeOnly, onFilter, onOpen, caseId, onEvidence }: EvidenceProps & { chats: PosheeChat[]; activeOnly: boolean; onFilter: (value: boolean) => void; onOpen: (chat: PosheeChat) => void }) {
  const canFilter = chats.some(c => c.isActive !== undefined);
  const visible = activeOnly ? chats.filter(c => c.isActive === true) : chats;
  return <><div className="poshee-filters"><button type="button" aria-pressed={!activeOnly} onClick={() => onFilter(false)}>Tất cả</button><button type="button" disabled={!canFilter} aria-pressed={activeOnly} onClick={() => onFilter(true)}>Đang hoạt động</button></div>
    {!visible.length && <EmptyState>{chats.length ? 'Không có cuộc trò chuyện phù hợp.' : 'Chưa có cuộc trò chuyện.'}</EmptyState>}
    {visible.map(chat => <article key={chat.shopId} className="poshee-card"><button type="button" className="poshee-row poshee-chat-header" onClick={() => onOpen(chat)}><IoStorefrontOutline /><strong>{chat.shopName}</strong><span className="poshee-meta">{chat.timestamp ?? '—'}</span>{chat.unreadCount !== undefined && chat.unreadCount > 0 && <span className="poshee-badge">{chat.unreadCount}</span>}</button>{chat.isFavorite && <p className="poshee-meta">Yêu thích</p>}{chat.lastMessage && <StoryEvidenceTarget item={posheeEvidence(caseId, `chat:${chat.shopId}:preview`, chat.shopName, chat.lastMessage, chat)} onTriggerEvidence={onEvidence}><button className="poshee-preview" type="button" onClick={() => onOpen(chat)}>{chat.lastMessage}</button></StoryEvidenceTarget>}</article>)}
  </>;
}
export function PosheeChatDetailView({ chat, caseId, onEvidence }: EvidenceProps & { chat: PosheeChat }) {
  const p = chat.pinnedProduct;
  return <><div className="poshee-thread-heading"><IoStorefrontOutline /><strong>{chat.shopName}</strong>{chat.isActive !== undefined && <span className="poshee-meta">{chat.isActive ? 'Trực tuyến' : 'Ngoại tuyến'}</span>}<DisabledControl label="Cửa hàng"><IoStorefrontOutline /></DisabledControl></div>
    <aside className="poshee-warning"><IoShieldCheckmarkOutline aria-hidden="true" /><p>LƯU Ý: Chỉ mua bán trực tiếp trên Poshee để bảo vệ quyền lợi. Không đặt cọc, chuyển khoản riêng hoặc giao dịch ngoài nền tảng.</p></aside>
    {p && <section className="poshee-card"><h3>Bạn đang hỏi về quy cách sản phẩm</h3><StoryEvidenceTarget item={posheeEvidence(caseId, `chat:${chat.shopId}:product`, p.title ?? 'Sản phẩm', [p.title, p.variant, money(p.price), p.discount, p.salesCount].filter(Boolean).join('\n'), chat)} onTriggerEvidence={onEvidence}><div className="poshee-order-item"><Thumbnail url={p.thumbnailUrl} /><div><strong>{p.title ?? '—'}</strong><p>{p.variant ?? '—'}</p><p className="poshee-price">{money(p.price)}</p>{p.discount && <p>{p.discount}</p>}{p.salesCount && <p>Đã bán {p.salesCount}</p>}</div></div></StoryEvidenceTarget><DisabledControl><IoBagHandleOutline />Mua với voucher</DisabledControl></section>}
    {chat.date && <p className="poshee-date">{chat.date}</p>}
    {!chat.messages.length && <EmptyState>Chưa có tin nhắn.</EmptyState>}
    <div className="poshee-messages">{chat.messages.map((message, index) => <div key={message.id}>{message.date && <p className="poshee-date">{message.date}</p>}{message.isUnread && !chat.messages[index - 1]?.isUnread && <p className="poshee-date">Tin nhắn chưa đọc</p>}<StoryEvidenceTarget className={`poshee-bubble ${message.sender === 'user' ? 'poshee-bubble-user' : ''}`} item={posheeEvidence(caseId, `chat:${chat.shopId}:message:${message.id}`, chat.shopName, [message.text, message.time].filter(Boolean).join('\n'), message)} onTriggerEvidence={onEvidence}><p>{message.text}</p><p className="poshee-meta">{message.isAutoReply && 'Tin nhắn tự động · '}{message.time ?? '—'}</p></StoryEvidenceTarget></div>)}</div>
    <div className="poshee-quick-prompts"><DisabledControl>Hỏi tình trạng còn hàng</DisabledControl><DisabledControl>Tư vấn chọn size</DisabledControl></div>
    <div className="poshee-composer"><DisabledControl label="Đính kèm"><IoAddOutline /></DisabledControl><DisabledControl label="Sản phẩm"><IoBagHandleOutline /></DisabledControl><input aria-label="Soạn tin — chỉ đọc" placeholder="Soạn tin..." readOnly /><DisabledControl label="Biểu tượng cảm xúc"><IoHappyOutline /></DisabledControl></div>
  </>;
}
