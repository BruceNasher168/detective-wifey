import {
  IoAddOutline,
  IoBagHandleOutline,
  IoHappyOutline,
  IoShieldCheckmarkOutline,
  IoStorefrontOutline,
} from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../features/investigation';
import type { UniversalEvidenceItem } from '../../../features/investigation';
import { money } from '../ecommerceData';
import { ecommerceEvidence } from '../ecommerceEvidence';
import type { EcommerceChat, EcommerceData } from '../types';
import { DisabledControl, EmptyState, Thumbnail, ShopAvatar } from './EcommerceChrome';

interface EvidenceProps {
  caseId: string;
  onEvidence: (item: UniversalEvidenceItem) => void;
}

export function EcommerceSearchOverlay({
  data,
  caseId,
  onEvidence,
}: EvidenceProps & { data: EcommerceData }) {
  return (
    <>
      <input
        aria-label="Tìm kiếm sản phẩm - chỉ đọc"
        placeholder="Tìm kiếm sản phẩm"
        readOnly
        className="ecommerce-search-input"
      />
      <div className="ecommerce-row">
        <h2>Lịch sử tìm kiếm gần đây</h2>
        <DisabledControl>Xóa lịch sử</DisabledControl>
      </div>
      {data.recentSearches.length ? (
        <div className="ecommerce-search-chips">
          {data.recentSearches.map((s) => (
            <StoryEvidenceTarget
              key={s.id}
              item={ecommerceEvidence(caseId, s.id, 'Lịch sử tìm kiếm', s.text, s)}
              onTriggerEvidence={onEvidence}
              className="ecommerce-search-chip"
            >
              <span>{s.text}</span>
            </StoryEvidenceTarget>
          ))}
        </div>
      ) : (
        <EmptyState>Chưa có lịch sử tìm kiếm.</EmptyState>
      )}
      {data.popularSearches.length > 0 && (
        <section className="ecommerce-card">
          <h2>Tìm kiếm phổ biến</h2>
          {data.popularSearches.map((s, index) => (
            <p key={index}>{s}</p>
          ))}
        </section>
      )}
    </>
  );
}

export const PosheeSearchOverlay = EcommerceSearchOverlay;

export function EcommerceChatListView({
  chats,
  activeOnly,
  onFilter,
  onOpen,
  caseId,
  onEvidence,
}: EvidenceProps & {
  chats: EcommerceChat[];
  activeOnly: boolean;
  onFilter: (value: boolean) => void;
  onOpen: (chat: EcommerceChat) => void;
}) {
  const canFilter = chats.some((c) => c.isActive !== undefined);
  const visible = activeOnly ? chats.filter((c) => c.isActive === true) : chats;
  return (
    <>
      <div className="ecommerce-filters">
        <button type="button" aria-pressed={!activeOnly} onClick={() => onFilter(false)}>
          Tất cả
        </button>
        <button
          type="button"
          disabled={!canFilter}
          aria-pressed={activeOnly}
          onClick={() => onFilter(true)}
        >
          Đang hoạt động
        </button>
      </div>
      {!visible.length && (
        <EmptyState>
          {chats.length ? 'Không có cuộc trò chuyện phù hợp.' : 'Chưa có cuộc trò chuyện.'}
        </EmptyState>
      )}
      {visible.map((chat) => (
        <article key={chat.shopId} className="ecommerce-card ecommerce-chat-row">
          <StoryEvidenceTarget
            item={{
              title: chat.shopName,
              snippet: '',
              suspectToTag: chat.shopName,
              subtitle: 'Shopoo · Cửa hàng',
              kind: 'conversation',
              conversationId: chat.shopId,
              visibleAlias: chat.shopName,
              isExplicitConversationPin: true,
              source: {
                caseId,
                recordId: chat.shopId,
                kind: 'conversation',
                conversationId: chat.shopId,
                visibleAlias: chat.shopName,
                title: chat.shopName,
                snippet: '',
                isExplicitConversationPin: true,
              },
            }}
            onTriggerEvidence={onEvidence}
          >
            <button
              type="button"
              className="ecommerce-row ecommerce-chat-header w-full"
              onClick={() => onOpen(chat)}
            >
              <ShopAvatar logo={chat.logo} style={chat.logoStyle} shopId={chat.shopId} />
              <strong>{chat.shopName}</strong>
              <span className="ecommerce-meta">{chat.timestamp ?? '-'}</span>
              {chat.unreadCount !== undefined && chat.unreadCount > 0 && (
                <span className="ecommerce-badge">{chat.unreadCount}</span>
              )}
            </button>
          </StoryEvidenceTarget>
          {chat.isFavorite && <p className="ecommerce-meta">Yêu thích</p>}
          {chat.lastMessage && (
            <button
              className="ecommerce-preview"
              type="button"
              onClick={() => onOpen(chat)}
            >
              {chat.lastMessage}
            </button>
          )}
        </article>
      ))}
    </>
  );
}

export const PosheeChatListView = EcommerceChatListView;

export function EcommerceChatDetailView({
  chat,
  caseId,
  onEvidence,
}: EvidenceProps & { chat: EcommerceChat }) {
  const p = chat.pinnedProduct;
  return (
    <>
      <div className="ecommerce-thread-heading">
        <ShopAvatar logo={chat.logo} style={chat.logoStyle} shopId={chat.shopId} />
        <strong>{chat.shopName}</strong>
        {chat.isActive !== undefined && (
          <span className="ecommerce-meta">{chat.isActive ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
        )}
        <DisabledControl label="Cửa hàng">
          <IoStorefrontOutline />
        </DisabledControl>
      </div>
      <aside className="ecommerce-warning">
        <IoShieldCheckmarkOutline aria-hidden="true" />
        <p>
          LƯU Ý: Chỉ mua bán trực tiếp trên ứng dụng để bảo vệ quyền lợi. Không đặt cọc, chuyển
          khoản riêng hoặc giao dịch ngoài nền tảng.
        </p>
      </aside>
      {p && (
        <section className="ecommerce-card ecommerce-product-enquiry">
          <h3>Bạn đang hỏi về quy cách sản phẩm</h3>
          <StoryEvidenceTarget
            item={ecommerceEvidence(
              caseId,
              `chat:${chat.shopId}:product`,
              p.title ?? 'Sản phẩm',
              [p.title, p.variant, money(p.price), p.discount, p.salesCount]
                .filter(Boolean)
                .join('\n'),
              chat
            )}
            onTriggerEvidence={onEvidence}
          >
            <div className="ecommerce-order-item">
              <Thumbnail url={p.thumbnailUrl} artwork={p.artwork} />
              <div>
                <strong>{p.title ?? '-'}</strong>
                <p>{p.variant ?? '-'}</p>
                <p className="ecommerce-price">{money(p.price)}</p>
                {p.discount && <p>{p.discount}</p>}
                {p.salesCount && <p>Đã bán {p.salesCount}</p>}
              </div>
            </div>
          </StoryEvidenceTarget>
          <DisabledControl>
            <IoBagHandleOutline />Mua với voucher
          </DisabledControl>
        </section>
      )}
      {chat.date && <p className="ecommerce-date">{chat.date}</p>}
      {!chat.messages.length && <EmptyState>Chưa có tin nhắn.</EmptyState>}
      <div className="ecommerce-messages">
        {chat.messages.map((message, index) => (
          <div key={message.id}>
            {message.date && <p className="ecommerce-date">{message.date}</p>}
            {message.isUnread && !chat.messages[index - 1]?.isUnread && (
              <p className="ecommerce-date">Tin nhắn chưa đọc</p>
            )}
            <StoryEvidenceTarget
              className={`ecommerce-bubble ${
                message.sender === 'user' ? 'ecommerce-bubble-user' : ''
              }`}
              item={{
                ...ecommerceEvidence(
                  caseId,
                  `chat:${chat.shopId}:message:${message.id}`,
                  chat.shopName,
                  message.text,
                  message
                ),
                kind: 'message',
                conversationId: chat.shopId,
                visibleAlias: chat.shopName,
                eventTime: message.time,
                eventDate: message.date || chat.date,
                source: {
                  caseId,
                  recordId: `chat:${chat.shopId}:message:${message.id}`,
                  clueRefId: message.clueRefId,
                  title: chat.shopName,
                  snippet: message.text,
                  kind: 'message',
                  conversationId: chat.shopId,
                  visibleAlias: chat.shopName,
                  eventTime: message.time,
                  eventDate: message.date || chat.date,
                },
              }}
              onTriggerEvidence={onEvidence}
            >
              <p>{message.text}</p>
              <p className="ecommerce-meta">
                {message.isAutoReply && 'Tin nhắn tự động · '}
                {message.time ?? '-'}
              </p>
            </StoryEvidenceTarget>
          </div>
        ))}
      </div>
      <div className="ecommerce-quick-prompts">
        <DisabledControl>Hỏi tình trạng còn hàng</DisabledControl>
        <DisabledControl>Tư vấn chọn size</DisabledControl>
      </div>
      <div className="ecommerce-composer">
        <DisabledControl label="Đính kèm">
          <IoAddOutline />
        </DisabledControl>
        <DisabledControl label="Sản phẩm">
          <IoBagHandleOutline />
        </DisabledControl>
        <input aria-label="Soạn tin - chỉ đọc" placeholder="Soạn tin..." readOnly />
        <DisabledControl label="Biểu tượng cảm xúc">
          <IoHappyOutline />
        </DisabledControl>
      </div>
    </>
  );
}

export const PosheeChatDetailView = EcommerceChatDetailView;
