import { describe, expect, it } from 'vitest';
import { mergeWithDefaultAppsData } from '../features/case-runtime';

describe('Ecommerce case loader provenance', () => {
  it('does not create ecommerce data key when the case omits the app', () => {
    const merged = mergeWithDefaultAppsData({});
    expect(Object.prototype.hasOwnProperty.call(merged, 'ecommerce')).toBe(false);
    expect(merged['internet-messaging']).toBeDefined();
  });

  it('preserves partial canonical modules without adding default history', () => {
    const supplied = { orders: [{ orderId: 'case-order' }] };
    const original = JSON.stringify(supplied);
    const merged = mergeWithDefaultAppsData({ ecommerce: supplied });
    expect(merged.ecommerce).toEqual(supplied);
    expect(Object.prototype.hasOwnProperty.call(merged.ecommerce as object, 'recentSearches')).toBe(false);
    expect(JSON.stringify(supplied)).toBe(original);
  });

  it('preserves explicit empty or unavailable data instead of substituting records', () => {
    expect(mergeWithDefaultAppsData({ ecommerce: {} }).ecommerce).toEqual({});
    expect(mergeWithDefaultAppsData({ ecommerce: null }).ecommerce).toBeNull();
  });
});
