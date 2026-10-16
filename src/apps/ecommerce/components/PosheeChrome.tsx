import type { ReactNode } from 'react';
import { IoChatbubbleEllipsesOutline, IoCartOutline, IoHomeOutline, IoNotificationsOutline, IoPersonOutline, IoImageOutline, IoArrowBack, IoHome, IoNotifications, IoPerson } from 'react-icons/io5';
import type { PosheeTab } from '../types';
import { safeImage } from '../posheeData';
import { ProductArtwork } from './ProductArtwork';

export function EmptyState({ children }: { children: ReactNode }) { return <p className="poshee-empty">{children}</p>; }
export function Thumbnail({ url, artwork }: { url?: string; artwork?: string }) {
  const source = safeImage(url);
  return <span className="poshee-thumbnail">{source ? <img src={source} alt="" /> : artwork ? <ProductArtwork kind={artwork} /> : <IoImageOutline aria-hidden="true" />}</span>;
}
export function ShopAvatar({ logo, style }: { logo?: string; style?: string }) {
  return <span className={`poshee-shop-avatar poshee-shop-logo-${style ?? 'default'}`}>{logo ? <span>{logo}</span> : <IoImageOutline aria-hidden="true" />}</span>;
}
export function DisabledControl({ children, label }: { children: ReactNode; label?: string }) {
  return <button type="button" disabled aria-label={label} className="poshee-disabled">{children}</button>;
}
export function PosheeHeader({ title, onBack, onChat, cartCount, chatCount, children }: { title: string; onBack: () => void; onChat?: () => void; cartCount?: number; chatCount?: number; children?: ReactNode }) {
  return <header className="poshee-header">
    <button type="button" onClick={onBack} aria-label="Quay lại"><IoArrowBack /></button>
    {children ?? <h1>{title}</h1>}
    {onChat && <div className="poshee-header-actions"><DisabledControl label="Giỏ hàng"><IoCartOutline />{cartCount !== undefined && cartCount > 0 && <span className="poshee-badge">{cartCount > 99 ? '99+' : cartCount}</span>}</DisabledControl>
      <button type="button" onClick={onChat} aria-label="Trò chuyện"><IoChatbubbleEllipsesOutline />{chatCount !== undefined && chatCount > 0 && <span className="poshee-badge">{chatCount > 99 ? '99+' : chatCount}</span>}</button></div>}
  </header>;
}
export function PosheeTabs({ active, onSelect, unread }: { active: PosheeTab; onSelect: (tab: PosheeTab) => void; unread?: number }) {
  return <nav className="app-bottom-nav poshee-tabs" aria-label="Điều hướng Shopoo">
    {([{ id: 'home', title: 'Trang chủ', icon: active === 'home' ? IoHome : IoHomeOutline }, { id: 'notifications', title: 'Thông báo', icon: active === 'notifications' ? IoNotifications : IoNotificationsOutline }, { id: 'profile', title: 'Tôi', icon: active === 'profile' ? IoPerson : IoPersonOutline }] as const).map(tab => <button type="button" key={tab.id} aria-current={active === tab.id ? 'page' : undefined} onClick={() => onSelect(tab.id)}><tab.icon /><span>{tab.title}</span>{tab.id === 'notifications' && unread !== undefined && unread > 0 && <span className="poshee-badge">{unread}</span>}</button>)}
  </nav>;
}
