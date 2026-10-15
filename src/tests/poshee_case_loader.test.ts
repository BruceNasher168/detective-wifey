import { describe, expect, it } from 'vitest';
import { mergeWithDefaultAppsData } from '../features/case-runtime';

describe('Poshee case loader provenance', () => {
  it('does not create either Poshee data key when the case omits the app', () => {
    const merged = mergeWithDefaultAppsData({});
    expect(Object.prototype.hasOwnProperty.call(merged, 'ecommerce')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(merged, 'poshee')).toBe(false);
    expect(merged['internet-messaging']).toBeDefined();
  });

  it('preserves partial canonical and alias modules without adding default history', () => {
    for (const key of ['ecommerce', 'poshee']) {
      const supplied = { orders: [{ orderId: 'case-order' }] };
      const original = JSON.stringify(supplied);
      const merged = mergeWithDefaultAppsData({ [key]: supplied });
      expect(merged[key]).toEqual(supplied);
      expect(Object.prototype.hasOwnProperty.call(merged[key], 'recentSearches')).toBe(false);
      expect(JSON.stringify(supplied)).toBe(original);
    }
  });

  it('preserves explicit empty or unavailable data instead of substituting records', () => {
    expect(mergeWithDefaultAppsData({ ecommerce: {} }).ecommerce).toEqual({});
    expect(mergeWithDefaultAppsData({ ecommerce: null }).ecommerce).toBeNull();
  });
});
