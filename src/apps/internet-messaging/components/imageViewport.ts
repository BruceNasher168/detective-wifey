export interface ImageView { zoom: number; x: number; y: number }
export interface ImageBounds { width: number; height: number; imageWidth: number; imageHeight: number }
export const fitImage: ImageView = { zoom: 1, x: 0, y: 0 };

export function clampImage(view: ImageView, bounds: ImageBounds): ImageView {
  const zoom = Math.max(1, Math.min(5, view.zoom));
  const maxX = Math.max(0, (bounds.imageWidth * zoom - bounds.width) / 2);
  const maxY = Math.max(0, (bounds.imageHeight * zoom - bounds.height) / 2);
  return { zoom, x: Math.max(-maxX, Math.min(maxX, view.x)), y: Math.max(-maxY, Math.min(maxY, view.y)) };
}

/** Keep the image point under the cursor/fingers fixed while zooming. */
export function zoomImage(view: ImageView, nextZoom: number, point: { x: number; y: number }, bounds: ImageBounds): ImageView {
  const zoom = Math.max(1, Math.min(5, nextZoom));
  const ratio = zoom / view.zoom;
  return clampImage({ zoom, x: point.x - (point.x - view.x) * ratio, y: point.y - (point.y - view.y) * ratio }, bounds);
}
