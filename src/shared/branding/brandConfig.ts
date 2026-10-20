import type { AppId } from '../contracts/app-contracts';

export interface AppBrand {
  /** Canonical App ID used in the code and data schemas */
  readonly appId: AppId;
  /** Branded parody name displayed to the player in-game (e.g. 'Zola', 'Techcornbank', 'Shopoo') */
  readonly brandName: string;
  /** Generic category name in Vietnamese (e.g. 'Nhắn tin', 'Ngân hàng', 'Mua sắm') */
  readonly genericName: string;
  /** Slogan or satirical tagline */
  readonly tagline?: string;
  /** Sub-brand parody names (wallets, VIP tiers, couriers) */
  readonly subBrands?: {
    readonly wallet?: string;
    readonly membership?: string;
    readonly courier?: string;
  };
  /** Default search placeholder text */
  readonly searchPlaceholder?: string;
  /** Formatted notification sender title */
  readonly notificationTitle?: string;
  /** Message displayed when an app is locked */
  readonly lockedMessage?: string;
  /** Message displayed when an app has no data in current level */
  readonly emptyStateMessage?: string;
}

/**
 * Single Source of Truth (SSOT) for App Parody Branding.
 *
 * To rebrand any app (e.g. change 'Zola' to 'Loza', 'Techcornbank' to 'VietPay',
 * or 'Shopoo' to 'Poshee'), modify ONLY the entries in this table.
 * All UI labels, headers, empty states, and notification titles update automatically
 * without breaking internal code, components, CSS classes, or data schemas.
 */
export const APP_BRANDS: Record<AppId, AppBrand> = {
  'internet-messaging': {
    appId: 'internet-messaging',
    brandName: 'Zola',
    genericName: 'Nhắn tin',
    tagline: 'Kết nối tình thân - Bí mật khó giấu',
    subBrands: {
      wallet: 'ZolaPay',
    },
    searchPlaceholder: 'Tìm kiếm cuộc trò chuyện',
    notificationTitle: 'Zola • Vừa xong',
    emptyStateMessage: 'Chưa có dữ liệu tin nhắn cho màn này.',
  },
  'banking': {
    appId: 'banking',
    brandName: 'Techcornbank',
    genericName: 'Ngân hàng',
    tagline: 'Chuyển tiền siêu tốc - Tin nhắn siêu tình',
    subBrands: {
      wallet: 'TechcornQR',
    },
    searchPlaceholder: 'Tìm kiếm giao dịch',
    notificationTitle: 'Techcornbank • Biến động số dư',
    lockedMessage: 'Techcornbank đang khóa',
    emptyStateMessage: 'Chưa có dữ liệu ngân hàng cho màn này.',
  },
  'ecommerce': {
    appId: 'ecommerce',
    brandName: 'Shopoo',
    genericName: 'Mua sắm',
    tagline: 'Mua gì cũng rẻ - Ship tận tay ai?',
    subBrands: {
      wallet: 'ShopooPay',
      membership: 'Hội viên VIP',
      courier: 'SPX Express',
    },
    searchPlaceholder: 'Tìm kiếm trên Shopoo',
    notificationTitle: 'Shopoo • Thông báo',
    emptyStateMessage: 'Chưa có dữ liệu mua sắm cho màn này.',
  },
  'ride-hailing': {
    appId: 'ride-hailing',
    brandName: 'Grap',
    genericName: 'Đặt xe',
    tagline: 'Đưa đón tận tình - Lộ trình giấu kín',
    notificationTitle: 'Grap • Chuyến đi',
    emptyStateMessage: 'Chưa có dữ liệu chuyến đi.',
  },
  'web-browser': {
    appId: 'web-browser',
    brandName: 'NetSurf',
    genericName: 'Trình duyệt',
    tagline: 'Lướt web không dấu vết - Trừ khi vợ kiểm tra',
    searchPlaceholder: 'Tìm kiếm hoặc nhập địa chỉ web',
    notificationTitle: 'NetSurf • Tin nhanh',
    emptyStateMessage: 'Chưa có lịch sử duyệt web.',
  },
  'email': {
    appId: 'email',
    brandName: 'GeeMail',
    genericName: 'Email',
    tagline: 'Hộp thư vạn năng - Gửi nhận không dấu vết',
    searchPlaceholder: 'Tìm trong thư',
    notificationTitle: 'GeeMail • Thư mới',
    emptyStateMessage: 'Hộp thư đến trống.',
  },
  'professional-network': {
    appId: 'professional-network',
    brandName: 'InkedLin',
    genericName: 'Mạng việc làm',
    tagline: 'Kết nối sự nghiệp - Mở rộng quan hệ... ngoài luồng',
    searchPlaceholder: 'Tìm kiếm đồng nghiệp, bài viết',
    notificationTitle: 'InkedLin • Kết nối',
    emptyStateMessage: 'Chưa có bài viết mới.',
  },
  'team-collaboration': {
    appId: 'team-collaboration',
    brandName: 'Tim',
    genericName: 'Kênh nhóm',
    tagline: 'Cùng nhau làm việc - OT tới sáng',
    searchPlaceholder: 'Tìm kiếm tin nhắn, tệp',
    notificationTitle: 'Tim • Kênh chung',
    emptyStateMessage: 'Không có tin nhắn mới trong kênh.',
  },
  'phone': {
    appId: 'phone',
    brandName: 'Điện thoại',
    genericName: 'Điện thoại',
    notificationTitle: 'Điện thoại • Cuộc gọi nhỡ',
  },
  'messages': {
    appId: 'messages',
    brandName: 'Tin nhắn',
    genericName: 'Tin nhắn SMS',
    notificationTitle: 'Tin nhắn • Tin nhắn mới',
  },
  'photos': {
    appId: 'photos',
    brandName: 'Ảnh',
    genericName: 'Thư viện ảnh',
    notificationTitle: 'Ảnh • Kỷ niệm',
  },
  'personal-notes': {
    appId: 'personal-notes',
    brandName: 'Ghi chú',
    genericName: 'Ghi chú cá nhân',
    notificationTitle: 'Ghi chú • Lời nhắc',
  },
  'comms': {
    appId: 'comms',
    brandName: 'Danh bạ',
    genericName: 'Liên lạc',
  },
};

/**
 * Returns the brand configuration for a given AppId.
 * Falls back to generic appId representation if not registered.
 */
export function getAppBrand(appId: AppId | string): AppBrand {
  if (appId in APP_BRANDS) {
    return APP_BRANDS[appId as AppId];
  }
  return {
    appId: appId as AppId,
    brandName: appId,
    genericName: appId,
  };
}

/**
 * Returns the player-facing display name for a given app.
 */
export function getAppDisplayName(appId: AppId | string): string {
  return getAppBrand(appId).brandName;
}
