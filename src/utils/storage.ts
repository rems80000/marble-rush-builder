import type { AppState } from '../types'
import { SEED_SETS } from '../data/seedData'

const STORAGE_KEY = 'marble_rush_builder_v2'
const KID_UI_MIGRATION_KEY = 'marble_rush_kid_ui_v1'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as AppState
    // La nouvelle interface tablette démarre en thème clair une seule fois.
    if (!localStorage.getItem(KID_UI_MIGRATION_KEY)) {
      data.settings.theme = 'light'
      localStorage.setItem(KID_UI_MIGRATION_KEY, 'done')
    }
    // Migration: inject layouts if missing (added in Phase 4)
    if (!data.layouts) data.layouts = []
    // Migration collection 2026 : ajoute les sets photographiés sans écraser
    // les corrections de quantités déjà faites par l'utilisateur.
    const persistedById = new Map(data.sets.map((set) => [set.id, set]))
    data.sets = SEED_SETS.map((seedSet) => {
      const persisted = persistedById.get(seedSet.id)
      if (!persisted) return seedSet
      const persistedByCode = new Map(persisted.pieces.map((piece) => [piece.code, piece]))
      const mergedPieces = seedSet.pieces.map((seedPiece) => {
        const legacyCode = seedPiece.code === 'M-40' ? 'M-40/M-45' : seedPiece.code
        const savedPiece = persistedByCode.get(seedPiece.code) ?? persistedByCode.get(legacyCode)
        if (!savedPiece) return seedPiece
        return {
          ...savedPiece,
          ...seedPiece,
          id: savedPiece.id,
          setId: savedPiece.setId,
          quantity: savedPiece.quantity,
          imageSource: savedPiece.imageSource === 'upload' ? savedPiece.imageSource : seedPiece.imageSource,
          imageUrl: savedPiece.imageSource === 'upload' ? savedPiece.imageUrl : seedPiece.imageUrl,
          imageCrop: savedPiece.imageSource === 'upload' ? savedPiece.imageCrop : seedPiece.imageCrop,
        }
      })
      const knownCodes = new Set(seedSet.pieces.flatMap((piece) => piece.code === 'M-40' ? [piece.code, 'M-40/M-45'] : [piece.code]))
      const customPieces = persisted.pieces.filter((piece) => !knownCodes.has(piece.code))
      return {
        ...seedSet,
        ...persisted,
        name: seedSet.name,
        reference: seedSet.reference,
        coverImage: seedSet.coverImage,
        advertisedPieceCount: seedSet.advertisedPieceCount,
        inventoryStatus: seedSet.inventoryStatus,
        manualUrl: seedSet.manualUrl,
        pieces: seedSet.pieces.length > 0 ? [...mergedPieces, ...customPieces] : persisted.pieces,
      }
    })
    return data
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    console.error('Impossible de sauvegarder l\'état')
  }
}

export function exportJSON(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `marble-rush-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppState
        resolve(data)
      } catch {
        reject(new Error('Fichier JSON invalide'))
      }
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsText(file)
  })
}

export function getDefaultState(): AppState {
  return {
    sets: SEED_SETS,
    plans: [],
    history: [],
    layouts: [],
    settings: {
      theme: 'light',
      gridCols: 8,
      gridRows: 8,
    },
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
