import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lightbulb, Circle } from 'lucide-react'
import type { BuildStep } from '../types'
import PieceImage from './PieceImage'

interface Props {
  steps: BuildStep[]
  planName: string
}

export default function StepByStepViewer({ steps, planName }: Props) {
  const [current, setCurrent] = useState(0)

  if (steps.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
        Aucune étape disponible.
      </div>
    )
  }

  const step = steps[current]!
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>
          {planName}
        </h2>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {current + 1} / {steps.length}
        </span>
      </div>

      {/* Barre de progression */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--accent)' }}
        />
      </div>

      {/* Carte étape */}
      <div className="card p-5 animate-slide-up" key={current}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {step.stepNumber}
          </span>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {step.title}
          </h3>
        </div>

        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {step.description}
        </p>

        {/* Pièces nécessaires */}
        {step.pieces.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Pièces nécessaires
            </p>
            <div className="flex flex-wrap gap-2">
              {step.pieces.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm text-white font-medium"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <PieceImage
                    code={p.pieceCode ?? p.pieceName.split(' ')[0] ?? '?'}
                    color={p.color}
                    emoji={p.emoji}
                    size={28}
                    alt={p.pieceName}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{p.pieceName}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full piece-${p.color}`}
                  >
                    ×{p.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grille simplifiée */}
        {step.gridPositions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Positions sur la grille
            </p>
            <div
              className="rounded-xl p-3 text-xs font-mono"
              style={{ background: 'var(--bg-secondary)' }}
            >
              {step.gridPositions.map((pos, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5">
                  <span className="text-base">{pos.emoji ?? '🔷'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    X:{pos.x} Y:{pos.y} Z:{pos.z}
                  </span>
                  {pos.rotation !== undefined && pos.rotation !== 0 && (
                    <span style={{ color: 'var(--accent2)' }}>↻ {pos.rotation}°</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseil */}
        {step.tips && (
          <div
            className="flex gap-2 rounded-xl p-3"
            style={{ background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <Lightbulb size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {step.tips}
            </p>
          </div>
        )}

        {/* Test bille */}
        {step.marbleTest && (
          <div
            className="flex gap-2 rounded-xl p-3 mt-3"
            style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6,182,212,0.3)' }}
          >
            <Circle size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-300 font-medium">
              🎯 Test bille recommandé — lancez une bille pour vérifier que le circuit fonctionne jusqu'ici.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-30"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        >
          <ChevronLeft size={18} /> Précédent
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={current === steps.length - 1}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-30 text-white"
          style={{ background: 'var(--accent)' }}
        >
          Suivant <ChevronRight size={18} />
        </button>
      </div>

      {/* Indicateurs de progression */}
      <div className="flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              background: i === current ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
