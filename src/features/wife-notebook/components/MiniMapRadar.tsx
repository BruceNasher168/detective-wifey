import React from 'react';
import { CANVAS_SIZE } from '../graphEngine';
import type { CorkboardViewport, PlacedNode } from '../types';

interface MiniMapRadarProps {
  viewport: CorkboardViewport;
  placedNodes: PlacedNode[];
  onCenterCluster: () => void;
}

export const MiniMapRadar: React.FC<MiniMapRadarProps> = ({
  viewport,
  placedNodes,
  onCenterCluster,
}) => {
  const RADAR_SIZE = 44; // px
  const scale = RADAR_SIZE / CANVAS_SIZE;

  // Approximate mobile viewport dimensions in canvas coordinates
  const viewW = Math.min(CANVAS_SIZE, (393 / viewport.zoom) * scale);
  const viewH = Math.min(CANVAS_SIZE, (680 / viewport.zoom) * scale);
  const viewX = Math.max(0, Math.min(RADAR_SIZE - viewW, (viewport.x * scale) - (viewW / 2)));
  const viewY = Math.max(0, Math.min(RADAR_SIZE - viewH, (viewport.y * scale) - (viewH / 2)));

  return (
    <button
      type="button"
      aria-label="Thu nhỏ bản đồ / Định vị"
      onClick={onCenterCluster}
      className="relative h-11 w-11 rounded-lg border border-pink-400/40 bg-black/60 shadow-inner backdrop-blur-sm overflow-hidden flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-400"
    >
      {/* Node dots */}
      {placedNodes.map(node => (
        <span
          key={node.nodeId}
          className="absolute h-1 w-1 rounded-full bg-pink-300"
          style={{
            left: `${node.x * scale}px`,
            top: `${node.y * scale}px`,
          }}
        />
      ))}

      {/* Viewport indicator rectangle */}
      <div
        className="absolute border border-fuchsia-400 bg-fuchsia-400/20 rounded-sm pointer-events-none transition-all duration-75"
        style={{
          left: `${viewX}px`,
          top: `${viewY}px`,
          width: `${Math.max(8, viewW)}px`,
          height: `${Math.max(8, viewH)}px`,
        }}
      />
    </button>
  );
};
