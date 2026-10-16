const MENU_SIZE = 280;
const within = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

/** Coordinates are local to the shell, including its safe-area padding. */
export function assistiveMenuPosition(
  viewport: { width: number; height: number },
  anchor: { x: number; y: number; width: number; height: number },
  insets: { top: number; right: number; bottom: number; left: number },
) {
  const size = Math.max(0, Math.min(MENU_SIZE,
    viewport.width - insets.left - insets.right, viewport.height - insets.top - insets.bottom));
  const centerX = anchor.x + anchor.width / 2;
  const centerY = anchor.y + anchor.height / 2;
  const left = within(centerX - size / 2, insets.left, viewport.width - insets.right - size);
  // Home occupies the bottom row of the existing three-row action grid.
  const top = within(centerY - size * 5 / 6, insets.top, viewport.height - insets.bottom - size);
  const originX = within(centerX - left, 0, size);
  const originY = within(centerY - top, 0, size);
  const scale = size ? anchor.width / size : 1;
  return { left, top, size, originX, originY, closed: {
    scale,
    x: centerX - left - (1 - scale) * originX - size * scale / 2,
    y: centerY - top - (1 - scale) * originY - size * scale / 2,
  } };
}
