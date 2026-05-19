import { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, MarbleSet, CircuitPlan, CircuitLayout, HistoryEntry, AppSettings, AppTheme } from '../types'
import { loadState, saveState, getDefaultState } from '../utils/storage'

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_SET'; set: MarbleSet }
  | { type: 'UPDATE_SET'; set: MarbleSet }
  | { type: 'DELETE_SET'; setId: string }
  | { type: 'TOGGLE_SET_ACTIVE'; setId: string }
  | { type: 'UPDATE_PIECE_QUANTITY'; setId: string; pieceId: string; delta: number }
  | { type: 'ADD_PLAN'; plan: CircuitPlan }
  | { type: 'UPDATE_PLAN'; plan: CircuitPlan }
  | { type: 'DELETE_PLAN'; planId: string }
  | { type: 'TOGGLE_PLAN_FAVORITE'; planId: string }
  | { type: 'ADD_HISTORY'; entry: HistoryEntry }
  | { type: 'UPDATE_HISTORY'; entry: HistoryEntry }
  | { type: 'DELETE_HISTORY'; entryId: string }
  | { type: 'TOGGLE_HISTORY_FAVORITE'; entryId: string }
  | { type: 'ADD_LAYOUT'; layout: CircuitLayout }
  | { type: 'UPDATE_LAYOUT'; layout: CircuitLayout }
  | { type: 'DELETE_LAYOUT'; layoutId: string }
  | { type: 'TOGGLE_LAYOUT_FAVORITE'; layoutId: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SET_THEME'; theme: AppTheme }
  | { type: 'IMPORT_STATE'; state: AppState }
  | { type: 'RESET' }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SET':
      return { ...state, sets: [...state.sets, action.set] }

    case 'UPDATE_SET':
      return {
        ...state,
        sets: state.sets.map((s) => (s.id === action.set.id ? action.set : s)),
      }

    case 'DELETE_SET':
      return { ...state, sets: state.sets.filter((s) => s.id !== action.setId) }

    case 'TOGGLE_SET_ACTIVE':
      return {
        ...state,
        sets: state.sets.map((s) =>
          s.id === action.setId ? { ...s, active: !s.active } : s,
        ),
      }

    case 'UPDATE_PIECE_QUANTITY':
      return {
        ...state,
        sets: state.sets.map((s) =>
          s.id === action.setId
            ? {
                ...s,
                pieces: s.pieces.map((p) =>
                  p.id === action.pieceId
                    ? { ...p, quantity: Math.max(0, p.quantity + action.delta) }
                    : p,
                ),
              }
            : s,
        ),
      }

    case 'ADD_PLAN':
      return { ...state, plans: [...state.plans, action.plan] }

    case 'UPDATE_PLAN':
      return {
        ...state,
        plans: state.plans.map((p) => (p.id === action.plan.id ? action.plan : p)),
      }

    case 'DELETE_PLAN':
      return { ...state, plans: state.plans.filter((p) => p.id !== action.planId) }

    case 'TOGGLE_PLAN_FAVORITE':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.planId ? { ...p, isFavorite: !p.isFavorite } : p,
        ),
      }

    case 'ADD_HISTORY':
      return { ...state, history: [action.entry, ...state.history] }

    case 'UPDATE_HISTORY':
      return {
        ...state,
        history: state.history.map((h) => (h.id === action.entry.id ? action.entry : h)),
      }

    case 'DELETE_HISTORY':
      return { ...state, history: state.history.filter((h) => h.id !== action.entryId) }

    case 'TOGGLE_HISTORY_FAVORITE':
      return {
        ...state,
        history: state.history.map((h) =>
          h.id === action.entryId ? { ...h, isFavorite: !h.isFavorite } : h,
        ),
      }

    case 'ADD_LAYOUT':
      return { ...state, layouts: [...(state.layouts ?? []), action.layout] }

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layouts: (state.layouts ?? []).map((l) => (l.id === action.layout.id ? action.layout : l)),
      }

    case 'DELETE_LAYOUT':
      return { ...state, layouts: (state.layouts ?? []).filter((l) => l.id !== action.layoutId) }

    case 'TOGGLE_LAYOUT_FAVORITE':
      return {
        ...state,
        layouts: (state.layouts ?? []).map((l) =>
          l.id === action.layoutId ? { ...l, isFavorite: !l.isFavorite } : l,
        ),
      }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }

    case 'SET_THEME':
      return { ...state, settings: { ...state.settings, theme: action.theme } }

    case 'IMPORT_STATE':
      return action.state

    case 'RESET':
      return getDefaultState()

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

export const StoreContext = createContext<StoreContextValue | null>(null)

export function useStoreReducer() {
  const persisted = loadState()
  const [state, dispatch] = useReducer(reducer, persisted ?? getDefaultState())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-dark', 'theme-colorful', 'theme-light')
    root.classList.add(`theme-${state.settings.theme}`)
  }, [state.settings.theme])

  return { state, dispatch }
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore doit être utilisé dans StoreContext.Provider')
  return ctx
}
