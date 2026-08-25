import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Circle, Lightbulb, MapPin, RotateCw } from 'lucide-react'
import type { BuildStep } from '../types'
import MarbleInstructionDiagram from './MarbleInstructionDiagram'
import PieceImage from './PieceImage'

interface Props {
  steps: BuildStep[]
  planName: string
}

export default function StepByStepViewer({ steps, planName }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (current >= steps.length) setCurrent(Math.max(0, steps.length - 1))
  }, [current, steps.length])

  const cumulativeCount = useMemo(
    () => steps.slice(0, current + 1).flatMap((item) => item.pieces).reduce((sum, piece) => sum + piece.quantity, 0),
    [current, steps],
  )

  if (steps.length === 0) {
    return <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>Aucune étape disponible.</div>
  }

  const step = steps[current]!
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: '#312e81' }}>
          <div className="min-w-0 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200">Notice de construction</p>
            <h2 className="truncate text-base font-black">{planName}</h2>
          </div>
          <div className="flex-shrink-0 rounded-lg bg-amber-400 px-3 py-2 text-center text-slate-900">
            <p className="text-[10px] font-bold uppercase">Étape</p>
            <p className="text-xl font-black leading-none">{current + 1}</p>
          </div>
        </div>
        <div className="h-2 bg-indigo-100">
          <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="order-2 flex flex-col gap-3 lg:order-1">
          <div className="rounded-2xl bg-white p-3 text-slate-900" style={{ border: '2px solid #d8dce8' }}>
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
              <p className="text-xs font-black uppercase tracking-wider text-indigo-900">Pièces à ajouter</p>
              <span className="rounded bg-orange-100 px-2 py-1 text-xs font-black text-orange-700">
                +{step.pieces.reduce((sum, piece) => sum + piece.quantity, 0)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {step.pieces.map((piece, index) => (
                <div key={`${piece.pieceCode}-${index}`} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200">
                  <PieceImage code={piece.pieceCode ?? '?'} color={piece.color} emoji={piece.emoji} size={48} alt={piece.pieceName} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-indigo-900">{piece.pieceCode ?? piece.pieceName}</p>
                    <p className="line-clamp-2 text-[11px] leading-tight text-slate-500">{piece.pieceName.replace(`${piece.pieceCode} - `, '')}</p>
                  </div>
                  <span className="text-lg font-black text-orange-600">×{piece.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{cumulativeCount} pièces montées</p>
            <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>Étape {current + 1} sur {steps.length}</p>
          </div>
        </aside>

        <div className="order-1 lg:order-2">
          <MarbleInstructionDiagram steps={steps} currentStep={current} />
        </div>
      </div>

      <div className="card p-4">
        <div className="mb-2 flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-lg font-black text-white">{step.stepNumber}</span>
          <div>
            <h3 className="font-black" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
          </div>
        </div>

        {step.gridPositions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {step.gridPositions.slice(0, 6).map((position, index) => (
              <span key={`${position.pieceId}-${index}`} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <MapPin size={12} /> {String.fromCharCode(65 + Math.min(position.x, 25))}{position.y + 1} · H{position.z}
                {position.rotation ? <><RotateCw size={11} /> {position.rotation}°</> : null}
              </span>
            ))}
          </div>
        )}

        {step.tips && (
          <div className="mt-3 flex gap-2 rounded-xl p-3" style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.3)' }}>
            <Lightbulb size={17} className="mt-0.5 flex-shrink-0 text-yellow-400" />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><strong>Conseil :</strong> {step.tips}</p>
          </div>
        )}

        {step.marbleTest && (
          <div className="mt-3 flex gap-2 rounded-xl p-3" style={{ background: 'rgba(6,182,212,.12)', border: '1px solid rgba(6,182,212,.3)' }}>
            <Circle size={17} className="mt-0.5 flex-shrink-0 text-cyan-400" />
            <p className="text-xs font-semibold text-cyan-300">Test bille : lance une bille depuis le point le plus haut construit. Elle doit atteindre cette étape sans sortir du rail.</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-16 z-30 flex gap-3 rounded-2xl p-2" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
        <button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-30" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <ChevronLeft size={20} /> Précédent
        </button>
        <button onClick={() => setCurrent((value) => Math.min(steps.length - 1, value + 1))} disabled={current === steps.length - 1} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black text-white disabled:opacity-30">
          Suivant <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {steps.map((item, index) => (
          <button key={item.stepNumber} onClick={() => setCurrent(index)} aria-label={`Aller à l'étape ${index + 1}`} className="flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-black transition-all" style={{ background: index === current ? '#f97316' : index < current ? '#312e81' : 'var(--bg-secondary)', color: index <= current ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
