interface BatteryManager extends EventTarget {
  readonly level: number;
}

export interface BatteryNavigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function watchDeviceBattery(source: BatteryNavigator, onChange: (percent: number) => void) {
  let disposed = false;
  let battery: BatteryManager | undefined;
  const update = () => {
    if (battery && Number.isFinite(battery.level)) {
      onChange(Math.round(Math.min(1, Math.max(0, battery.level)) * 100));
    }
  };
  // Battery access can be unavailable or denied by the browser's policy.
  void Promise.resolve().then(() => source.getBattery?.()).then(result => {
    if (disposed || !result) return;
    battery = result;
    battery.addEventListener('levelchange', update);
    update();
  }).catch(() => {});
  return () => {
    disposed = true;
    battery?.removeEventListener('levelchange', update);
  };
}
