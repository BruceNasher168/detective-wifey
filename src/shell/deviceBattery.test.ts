import { describe, expect, it, vi } from 'vitest';
import { watchDeviceBattery } from './deviceBattery';

describe('device battery', () => {
  it('reads the level, follows changes, and removes its listener', async () => {
    const battery = Object.assign(new EventTarget(), { level: 0.735 });
    const update = vi.fn();
    const stop = watchDeviceBattery({ getBattery: async () => battery }, update);
    await vi.waitFor(() => expect(update).toHaveBeenLastCalledWith(74));
    battery.level = 0.2;
    battery.dispatchEvent(new Event('levelchange'));
    expect(update).toHaveBeenLastCalledWith(20);
    stop();
    update.mockClear();
    battery.dispatchEvent(new Event('levelchange'));
    expect(update).not.toHaveBeenCalled();
  });

  it('ignores unavailable, denied, and late results after unmount', async () => {
    const update = vi.fn();
    watchDeviceBattery({}, update)();
    watchDeviceBattery({ getBattery: async () => { throw new Error('denied'); } }, update);
    watchDeviceBattery({ getBattery: async () => Object.assign(new EventTarget(), { level: 1 }) }, update)();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(update).not.toHaveBeenCalled();
  });
});
