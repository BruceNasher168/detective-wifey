import content from './data/content.json';
import { normalizeEcommerceData } from './ecommerceData';
import type { EcommerceData, EcommerceItem } from './types';

const normalizeQuery = (value: string) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Rank supplied products only. Stable ties preserve the catalog's editorial order. */
export function recommendProducts(data: EcommerceData): EcommerceItem[] {
  const signals = [...data.browsingPatterns, ...data.recentSearches.map((search) => search.text)]
    .map(normalizeQuery)
    .filter(Boolean);
  const score = (product: EcommerceItem) => {
    const keywords = (product.keywords ?? []).map(normalizeQuery).filter(Boolean);
    return signals.reduce(
      (total, signal) =>
        total + keywords.filter((keyword) => ` ${signal} `.includes(` ${keyword} `)).length,
      0
    );
  };
  return data.products
    .map((product, index) => ({ product, index, score: score(product) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.product);
}

/** Case JSON replaces supplied sections, including explicit empty arrays. */
export function resolveMarketplaceData(value: unknown): EcommerceData | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const data = normalizeEcommerceData({ ...content, ...value });
  if (!data) return null;
  const orderIds = new Set(data.orders.map((order) => order.orderId));
  const notifications = data.notifications.filter(
    (notification) => !notification.orderId || orderIds.has(notification.orderId)
  );
  return { ...data, notifications, products: recommendProducts(data) };
}
