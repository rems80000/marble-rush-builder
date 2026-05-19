// ─── Pièces ───────────────────────────────────────────────────────────────────

export type PieceType =
  | 'base'
  | 'block'
  | 'rail-straight'
  | 'rail-curved'
  | 'turn'
  | 'spiral'
  | 'elevator'
  | 'launcher'
  | 'train-track'
  | 'train-car'
  | 'funnel'
  | 'flipper'
  | 'cannon'
  | 'decoration'
  | 'marble'
  | 'connector'
  | 'special'

export type PieceColor =
  | 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'purple'
  | 'white' | 'gray' | 'transparent' | 'mixed' | 'pink' | 'cyan'

export type ConnectorSide = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back'

export type ImageSource = 'asset' | 'upload' | 'generated' | 'missing'

export interface ImageCrop {
  x: number
  y: number
  width: number
  height: number
  sourceImageId?: string
}

export interface MarblePiece {
  id: string
  name: string
  code: string
  type: PieceType
  color: PieceColor
  quantity: number
  dimensions?: { width: number; height: number; depth: number }
  connectors?: ConnectorSide[]
  function?: string
  description?: string
  emoji?: string
  setId: string
  imageUrl?: string
  thumbnailUrl?: string
  imageSource?: ImageSource
  imageAlt?: string
  imageCrop?: ImageCrop
}

// ─── Sets ─────────────────────────────────────────────────────────────────────

export interface MarbleSet {
  id: string
  name: string
  reference: string
  year?: number
  pieces: MarblePiece[]
  coverEmoji?: string
  coverImage?: string
  owned: boolean
  active: boolean
  notes?: string
  ageMin?: number
  ageMax?: number
}

// ─── Inventaire ───────────────────────────────────────────────────────────────

export interface InventoryEntry {
  pieceId: string
  code: string
  name: string
  type: PieceType
  color: PieceColor
  totalQuantity: number
  bySet: { setId: string; setName: string; quantity: number }[]
  emoji?: string
}

// ─── Grille & Positions ───────────────────────────────────────────────────────

export interface GridPosition {
  x: number
  y: number
  z: number
  pieceId: string
  pieceName?: string
  rotation?: 0 | 90 | 180 | 270
  color?: PieceColor
  emoji?: string
}

export interface GridCell {
  x: number
  y: number
  z: number
  pieceId?: string
  color?: PieceColor
  emoji?: string
}

// ─── Étapes de construction ───────────────────────────────────────────────────

export interface StepPieceUsage {
  pieceId: string
  pieceName: string
  pieceCode?: string
  quantity: number
  color: PieceColor
  emoji?: string
}

export interface BuildStep {
  stepNumber: number
  title: string
  description: string
  pieces: StepPieceUsage[]
  gridPositions: GridPosition[]
  tips?: string
  marbleTest?: boolean
}

// ─── Plans de circuit ─────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'
export type CircuitSize = 'small' | 'medium' | 'large'
export type CircuitPriority = 'fun' | 'speed' | 'spiral' | 'train' | 'elevator' | 'stability'

export interface CircuitPlan {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  difficulty: Difficulty
  size: CircuitSize
  maxHeight: number
  estimatedTime: number
  steps: BuildStep[]
  gridData: GridCell[][]
  notes?: string
  tags: string[]
  isFavorite: boolean
  photoUrl?: string
  usedSetIds: string[]
  validationResult?: ValidationResult
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationIssueType =
  | 'missing-pieces'
  | 'no-arrival'
  | 'connector-mismatch'
  | 'too-tall'
  | 'insufficient-slope'

export type ValidationWarningType = 'stability' | 'slope' | 'complexity'

export interface ValidationIssue {
  type: ValidationIssueType
  description: string
  stepNumber?: number
}

export interface ValidationWarning {
  type: ValidationWarningType
  description: string
}

export interface ValidationResult {
  isValid: boolean
  issues: ValidationIssue[]
  warnings: ValidationWarning[]
  score: number
}

// ─── Modules réutilisables ────────────────────────────────────────────────────

export type ModuleType =
  | 'central-tower'
  | 'fast-branch'
  | 'slow-branch'
  | 'train-branch'
  | 'common-arrival'
  | 'elevator'
  | 'spiral'
  | 'launcher'

export interface ModuleTemplate {
  id: string
  name: string
  type: ModuleType
  description: string
  difficulty: Difficulty
  requiredPieceTypes: PieceType[]
  steps: BuildStep[]
  emoji: string
  tips: string
}

// ─── Générateur ───────────────────────────────────────────────────────────────

export interface GeneratorConstraints {
  difficulty: Difficulty
  size: CircuitSize
  maxHeight: number
  maxTime: number
  priorities: CircuitPriority[]
  childAge?: number
  selectedSetIds: string[]
}

// ─── Historique ───────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string
  planId: string
  planName: string
  builtAt: string
  duration?: number
  notes?: string
  photoUrl?: string
  rating?: 1 | 2 | 3 | 4 | 5
  isFavorite?: boolean
  usedSetIds?: string[]
  perceivedDifficulty?: Difficulty
}

// ─── Constructeur visuel (CircuitBuilder) ────────────────────────────────────

export type PieceRotation = 0 | 90 | 180 | 270

export interface PlacedPiece {
  /** Unique ID for this placement instance */
  uid: string
  /** Piece code (e.g. "T-06") */
  code: string
  /** Grid column (0-based) */
  col: number
  /** Grid row (0-based) */
  row: number
  rotation: PieceRotation
  /** Display color, inherited from piece definition */
  color: PieceColor
}

export interface CircuitLayout {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  /** Grid dimensions */
  cols: number
  rows: number
  pieces: PlacedPiece[]
  notes?: string
  isFavorite: boolean
}

// ─── Paramètres & État global ─────────────────────────────────────────────────

export type AppTheme = 'dark' | 'colorful' | 'light'

export interface AppSettings {
  theme: AppTheme
  defaultChildAge?: number
  gridCols: number
  gridRows: number
}

export interface AppState {
  sets: MarbleSet[]
  plans: CircuitPlan[]
  history: HistoryEntry[]
  layouts: CircuitLayout[]
  settings: AppSettings
}
