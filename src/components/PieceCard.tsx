import type { MarblePiece, PieceType } from '../types'
import PieceImage from './PieceImage'

const TYPE_LABELS: Record<PieceType, string> = {
  'base': 'Base',
  'block': 'Bloc',
  'rail-straight': 'Rail droit',
  'rail-curved': 'Rail courbe',
  'turn': 'Virage',
  'spiral': 'Spirale',
  'elevator': 'Ascenseur',
  'launcher': 'Lanceur',
  'train-track': 'Rail train',
  'train-car': 'Wagon',
  'funnel': 'Entonnoir',
  'flipper': 'Flipper',
  'cannon': 'Canon',
  'decoration': 'Décoration',
  'marble': 'Bille',
  'connector': 'Connecteur',
  'special': 'Spécial',
}

interface Props {
  piece: MarblePiece
  showSet?: boolean
  compact?: boolean
}

export default function PieceCard({ piece, compact = false }: Props) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <PieceImage code={piece.code} color={piece.color} emoji={piece.emoji} size={42} alt={piece.name} setReference={piece.sourceSetIds?.[0]} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {piece.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {piece.code} · {TYPE_LABELS[piece.type]}
          </p>
        </div>
        <span
          className={`text-xs font-bold text-white rounded-full px-2 py-0.5 piece-${piece.color}`}
        >
          ×{piece.quantity}
        </span>
      </div>
    )
  }

  return (
    <div className="card p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <PieceImage code={piece.code} color={piece.color} emoji={piece.emoji} size={56} alt={piece.name} setReference={piece.sourceSetIds?.[0]} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
              {piece.name}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 flex-shrink-0">
              ×{piece.quantity}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {piece.code} · {TYPE_LABELS[piece.type]}
          </p>
          {piece.function && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {piece.function}
            </p>
          )}
          {piece.dimensions && (
            <p className="text-xs mt-1 opacity-60" style={{ color: 'var(--text-secondary)' }}>
              {piece.dimensions.width}×{piece.dimensions.depth}×{piece.dimensions.height} unités
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
