export { WifeNotebookModal } from './WifeNotebookModal';
export type { WifeNotebookModalProps } from './WifeNotebookModal';
export { CorkboardCanvas } from './components/CorkboardCanvas';
export { MiniMapRadar } from './components/MiniMapRadar';
export { ConfrontationModal } from './components/ConfrontationModal';
export type { ConfrontationModalProps } from './components/ConfrontationModal';
export { ConfrontationConfirmModal } from './components/ConfrontationConfirmModal';
export type { ConfrontationConfirmModalProps } from './components/ConfrontationConfirmModal';
export { HusbandCharacterImage } from './components/HusbandCharacterImage';
export type { HusbandMood } from './components/HusbandCharacterImage';
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
  calculateClueCardsCenter,
  CANVAS_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
} from './graphEngine';
export {
  evaluateConfrontation,
  calculateConfrontationPreflight,
  getSuspectsOnBoard,
} from './confrontationEngine';
export type {
  ConfrontationEvaluationParams,
  ConfrontationEvaluationResult,
  ConfrontationPreflightInfo,
  ClueInfo,
  VerifiedStringItem,
  ConvictionChance,
  ConvictionChanceLevel,
  SuspectOnBoard,
} from './confrontationEngine';
export { LEVEL_01_KNOWLEDGE_GRAPH } from './level01Fixture';
export type {
  PlacedNode,
  CorkboardViewport,
  PairingState,
  WifeNotebookState,
} from './types';
