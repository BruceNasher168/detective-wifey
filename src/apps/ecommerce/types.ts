export interface EvidenceReference {
  suspectName?: string;
  suspectId?: string;
  clueRefId?: string;
}
export interface PosheeItem {
  artwork?: string;
  discount?: string;
  rating?: string;
  sold?: string;
  location?: string;
  productTitle?: string;
  variantName?: string;
  price?: string | number;
  quantity?: number;
  thumbnailUrl?: string;
}
export interface PosheeOrder extends EvidenceReference {
  orderId: string;
  shopName?: string;
  isFavorite?: boolean;
  status?: string;
  orderDate?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  items: PosheeItem[];
  totalAmount?: string | number;
  paymentMethod?: string;
  trackingNumber?: string;
  courier?: string;
}
export interface PosheeSearch extends EvidenceReference { id: string; text: string }
export interface PosheeMessage extends EvidenceReference {
  id: string;
  sender: 'shop' | 'user';
  text: string;
  time?: string;
  date?: string;
  isAutoReply?: boolean;
  isUnread?: boolean;
}
export interface PosheeChat extends EvidenceReference {
  shopId: string;
  shopName: string;
  logo?: string;
  logoStyle?: string;
  isFavorite?: boolean;
  isActive?: boolean;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  date?: string;
  pinnedProduct?: { title?: string; variant?: string; price?: string | number; discount?: string; salesCount?: string; artwork?: string; thumbnailUrl?: string };
  messages: PosheeMessage[];
}
export type NotificationType = 'order' | 'seller' | 'promo' | 'security';
export interface PosheeNotification extends EvidenceReference {
  id: string;
  type: NotificationType;
  title: string;
  snippet?: string;
  timestamp?: string;
  trackingId?: string;
  orderId?: string;
  isPinned?: boolean;
}
export interface PosheeProfile {
  username?: string;
  membership?: string;
  following?: number;
  followers?: number;
  savings?: string | number;
  walletBalance?: string | number;
  coins?: number;
  voucherCount?: number;
}
export interface PosheeData {
  unreadBadge?: number;
  cartCount?: number;
  chatUnreadCount?: number;
  profile?: PosheeProfile;
  products: PosheeItem[];
  recentSearches: PosheeSearch[];
  popularSearches: string[];
  orders: PosheeOrder[];
  chats: PosheeChat[];
  notifications: PosheeNotification[];
}
export type OrderFilter = 'all' | 'in_transit' | 'completed';
export type NotificationFilter = 'all' | NotificationType;
export type PosheeTab = 'home' | 'notifications' | 'profile';
export type PosheeView = { screen: PosheeTab } | { screen: 'orders' } | { screen: 'search' } | { screen: 'inbox' } | { screen: 'thread'; shopId: string };
