import { Package, CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import type { MarbleSet } from '../types'
import { useStore } from '../store/useStore'

interface Props {
  set: MarbleSet
  onSelect?: () => void
}

export default function SetCard({ set, onSelect }: Props) {
  const { dispatch } = useStore()

  const totalPieces = set.pieces.reduce((sum, p) => sum + p.quantity, 0)
  const pieceTypes = [...new Set(set.pieces.map((p) => p.type))].length

  return (
    <div
      className="card p-4 animate-slide-up"
      style={set.active ? { borderColor: 'var(--accent)' } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Cover emoji / icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: set.active ? 'var(--accent)' : 'var(--bg-secondary)' }}
        >
          {set.coverEmoji ?? <Package size={24} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                {set.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Réf. {set.reference}{set.year ? ` · ${set.year}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {set.owned ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                  Possédé
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">
                  Pas encore
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {totalPieces} pièces · {pieceTypes} types
            </span>
            {set.ageMin && (
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {set.ageMin}–{set.ageMax} ans
              </span>
            )}
          </div>

          {set.notes && (
            <p className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>
              {set.notes}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        {set.owned && (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SET_ACTIVE', setId: set.id })}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: set.active ? 'var(--accent2)' : 'var(--text-secondary)' }}
          >
            {set.active ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : (
              <Circle size={15} />
            )}
            {set.active ? 'Inclus dans l\'inventaire' : 'Exclure de l\'inventaire'}
          </button>
        )}
        <button
          onClick={onSelect}
          className="ml-auto flex items-center gap-1 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          Voir les pièces <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
