import { ArrowDown, Layers3 } from 'lucide-react'
import type { BuildStep, GridPosition } from '../types'
import PieceImage from './PieceImage'

interface Props {
  steps: BuildStep[]
  currentStep: number
}

interface RenderedPosition extends GridPosition {
  isCurrent: boolean
  sourceStep: number
}

const CELL_X = 38
const CELL_Y = 20
const HEIGHT_UNIT = 15

export default function MarbleInstructionDiagram({ steps, currentStep }: Props) {
  const positions: RenderedPosition[] = steps
    .slice(0, currentStep + 1)
    .flatMap((step, sourceStep) => step.gridPositions.map((position) => ({
      ...position,
      sourceStep,
      isCurrent: sourceStep === currentStep,
    })))

  const visible = positions.length > 0
    ? positions
    : [{ x: 3, y: 3, z: 0, pieceId: 'placeholder', pieceCode: '?', isCurrent: true, sourceStep: currentStep }]

  const minX = Math.min(...visible.map((p) => p.x))
  const minY = Math.min(...visible.map((p) => p.y))
  const maxX = Math.max(...visible.map((p) => p.x))
  const maxY = Math.max(...visible.map((p) => p.y))
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  const project = (position: RenderedPosition) => ({
    left: 50 + (position.x - centerX - (position.y - centerY)) * CELL_X / 2,
    top: 68 + (position.x - centerX + position.y - centerY) * CELL_Y / 2 - position.z * HEIGHT_UNIT,
  })

  const ordered = [...visible].sort((a, b) =>
    (a.x + a.y + a.z * 0.1) - (b.x + b.y + b.z * 0.1),
  )

  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '2px solid #d8dce8' }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: '#312e81' }}>
        <div className="flex items-center gap-2 text-white">
          <Layers3 size={16} />
          <span className="text-xs font-extrabold uppercase tracking-wider">Vue de montage</span>
        </div>
        <span className="rounded-md bg-amber-400 px-2 py-1 text-xs font-black text-slate-900">
          {currentStep + 1}
        </span>
      </div>

      <div className="relative h-[300px] sm:h-[360px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[58%] h-[215px] w-[330px] sm:h-[245px] sm:w-[420px]"
          style={{
            transform: 'translate(-50%, -50%) rotateX(58deg) rotateZ(45deg)',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            border: '2px solid #94a3b8',
            boxShadow: '12px 14px 24px rgba(15,23,42,.12)',
          }}
        />

        {ordered.map((position, index) => {
          const point = project(position)
          return (
            <div
              key={`${position.pieceId}-${index}`}
              className="absolute transition-all duration-500"
              style={{
                left: `${point.left}%`,
                top: `${point.top}%`,
                transform: `translate(-50%, -50%) rotate(${position.rotation ?? 0}deg)`,
                zIndex: 20 + Math.round(position.z * 2 + position.x + position.y),
                opacity: position.isCurrent ? 1 : 0.3,
                filter: position.isCurrent ? 'none' : 'grayscale(.85)',
              }}
            >
              {position.isCurrent && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-orange-500 animate-bounce">
                  <ArrowDown size={23} strokeWidth={3.5} />
                </div>
              )}
              <div
                className="rounded-xl bg-white p-1"
                style={{
                  border: position.isCurrent ? '3px solid #f97316' : '2px solid #94a3b8',
                  boxShadow: position.isCurrent ? '0 5px 14px rgba(249,115,22,.35)' : 'none',
                }}
              >
                <PieceImage
                  code={position.pieceCode ?? '?'}
                  color={position.color}
                  emoji={position.emoji}
                  alt={position.pieceName ?? position.pieceCode}
                  size={position.isCurrent ? 46 : 38}
                />
              </div>
              {position.isCurrent && (
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  {position.pieceCode ?? 'PIÈCE'}
                </span>
              )}
            </div>
          )
        })}

        <div className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-600 shadow">
          Gris = déjà monté · Orange = à ajouter
        </div>
        <div className="absolute bottom-2 right-2 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
          Grille {minX}–{maxX} / {minY}–{maxY}
        </div>
      </div>
    </div>
  )
}
