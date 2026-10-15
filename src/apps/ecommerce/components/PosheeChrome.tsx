import type { ReactNode } from 'react';
import { IoChatbubbleEllipsesOutline, IoCartOutline, IoChevronBack, IoHomeOutline, IoNotificationsOutline, IoPersonOutline, IoImageOutline } from 'react-icons/io5';
import type { PosheeTab } from '../types';
import { safeImage } from '../posheeData';

export function EmptyState({ children }: { children: ReactNode }) { return <p className="poshee-empty">{children}</p>; }
export function Thumbnail({ url }: { url?: string }) {
  const source = safeImage(url);
  return <span className="poshee-thumbnail">{source ? <img src={source} alt="" /> : <IoImageOutline aria-hidden="true" />}</span>;
}
export function DisabledControl({ children, label }: { children: ReactNode; label?: string }) {
  return <button type="button" disabled aria-label={label} className="poshee-disabled">{children}</button>;
}
export function PosheeHeader({ title, onBack, onChat, cartCount, chatCount, children }: { title: string; onBack: () => void; onChat?: () => void; cartCount?: number; chatCount?: number; children?: ReactNode }) {
  return <header className="poshee-header">
    <button type="button" onClick={onBack} aria-label="Quay lại"><IoChevronBack /></button>
    {children ?? <h1>{title}</h1>}
    {onChat && <><DisabledControl label="Giỏ hàng"><IoCartOutline />{cartCount !== undefined && <span className="poshee-badge">{cartCount}</span>}</DisabledControl>
      <button type="button" onClick={onChat} aria-label="Trò chuyện"><IoChatbubbleEllipsesOutline />{chatCount !== undefined && <span className="poshee-badge">{chatCount}</span>}</button></>}
  </header>;
}
export function PosheeTabs({ active, onSelect, unread }: { active: PosheeTab; onSelect: (tab: PosheeTab) => void; unread?: number }) {
  return <nav className="poshee-tabs" aria-label="Điều hướng Poshee">
    {([{ id: 'home', title: 'Trang chủ', icon: IoHomeOutline }, { id: 'notifications', title: 'Thông báo', icon: IoNotificationsOutline }, { id: 'profile', title: 'Tôi', icon: IoPersonOutline }] as const).map(tab => <button type="button" key={tab.id} aria-current={active === tab.id ? 'page' : undefined} onClick={() => onSelect(tab.id)}><tab.icon /><span>{tab.title}</span>{tab.id === 'notifications' && unread !== undefined && unread > 0 && <span className="poshee-badge">{unread}</span>}</button>)}
  </nav>;
}
