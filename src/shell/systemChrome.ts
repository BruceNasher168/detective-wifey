/** Preserve the system indicators' existing light/dark contrast rule. */
export function systemForeground(backgroundColor: string): '#000000' | '#FFFFFF' {
  const hex = /^#([0-9a-f]{6})$/i.exec(backgroundColor)?.[1];
  const channels = hex ? [0, 2, 4].map(offset => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) : [0, 0, 0];
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
