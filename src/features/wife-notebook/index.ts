export { WifeNotebookModal } from './WifeNotebookModal';
export type { WifeNotebookModalProps } from './WifeNotebookModal';
export { CorkboardCanvas } from './components/CorkboardCanvas';
export { MiniMapRadar } from './components/MiniMapRadar';
export { useCorkboardGestures } from './useCorkboardGestures';
export {
  createEdgeBetweenNodes,
  evaluateUnmaskedSuspects,
  evaluateContradictions,
  autoArrangeNodes,
  placeNewNodesBelow,
  CORKBOARD_COLUMNS_X,
  CORKBOARD_ROW_HEIGHT,
  CORKBOARD_VERTICAL_GAP,
  clampZoom,
  CANVAS_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
} from './graphEngine';
export { LEVEL_01_KNOWLEDGE_GRAPH } from './level01Fixture';
export type {
  PlacedNode,
  CorkboardViewport,
  PairingState,
  WifeNotebookState,
} from './types';
