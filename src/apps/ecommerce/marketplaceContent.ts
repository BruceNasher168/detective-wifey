import catalog from './assets/catalog.json';
import { normalizePosheeData } from './posheeData';
import type { PosheeData } from './types';

const filler = normalizePosheeData(catalog)!;
/** Authored benign scenery. Case records retain their identity, fields and priority. */
export function populateMarketplace(data: PosheeData | null): PosheeData | null {
  if (!data) return null;
  return {
    ...data,
    profile: data.profile ?? filler.profile,
    cartCount: data.cartCount ?? filler.cartCount,
    chatUnreadCount: data.chatUnreadCount ?? filler.chatUnreadCount,
    products: data.products.length ? data.products : filler.products,
    chats: [...data.chats, ...filler.chats.filter(c => !data.chats.some(source => source.shopId === c.shopId))],
    orders: [...data.orders, ...filler.orders.filter(o => !data.orders.some(source => source.orderId === o.orderId))],
    notifications: [...data.notifications, ...filler.notifications.filter(n => !data.notifications.some(source => source.id === n.id))],
  };
}
