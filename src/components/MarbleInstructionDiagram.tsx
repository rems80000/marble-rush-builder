import { useMemo, useState } from 'react'
import { ArrowDown, Minus, Plus, RotateCw } from 'lucide-react'
import type { BuildStep, GridPosition } from '../types'
import PieceImage from './PieceImage'

interface Props {
  steps: BuildStep[]
  currentStep: number
  finalPreview?: boolean
  compact?: boolean
}

interface RenderedPosition extends GridPosition {
  isCurrent: boolean
  sourceStep: number
}

interface ScenePoint {
  position: RenderedPosition
  rawX: number
  rawY: number
  baseRawY: number
}

const CELL_X = 58
const CELL_Y = 29
const HEIGHT_UNIT = 22

function rotateGrid(x: number, y: number, quarterTurns: number) {
  if (quarterTurns === 1) return { x: y, y: -x }
  if (quarterTurns === 2) return { x: -x, y: -y }
  if (quarterTurns === 3) return { x: -y, y: x }
  return { x, y }
}

function visualSize(code: string) {
  if (code.startsWith('P-')) return 92
  if (code.startsWith('B-')) return 59
  if (code.startsWith('T-')) return 76
  if (code === 'M-40' || code === 'M-45') return 94
  if (code.startsWith('M-')) return 82
  return 64
}

function PositionMiniMap({ positions }: { positions: RenderedPosition[] }) {
  const minX = Math.min(0, ...positions.map((position) => position.x))
  const minY = Math.min(0, ...positions.map((position) => position.y))
  const maxX = Math.max(7, ...positions.map((position) => position.x))
  const maxY = Math.max(7, ...positions.map((position) => position.y))
  const columns = Math.min(10, Math.max(8, maxX - minX + 1))
  const rows = Math.min(10, Math.max(8, maxY - minY + 1))
  const cell = 9
  const pad = 12
  const width = columns * cell + pad * 2
  const height = rows * cell + pad * 2

  return (
    <div className="absolute bottom-3 right-3 rounded-md border border-sky-200 bg-sky-50/95 p-1 shadow-sm" aria-label="Repère de position sur la grille">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
        {Array.from({ length: columns + 1 }, (_, index) => (
          <line key={`v-${index}`} x1={pad + index * cell} y1={pad} x2={pad + index * cell} y2={pad + rows * cell} stroke="#94a3b8" strokeWidth=".55" />
        ))}
        {Array.from({ length: rows + 1 }, (_, index) => (
          <line key={`h-${index}`} x1={pad} y1={pad + index * cell} x2={pad + columns * cell} y2={pad + index * cell} stroke="#94a3b8" strokeWidth=".55" />
        ))}
        {Array.from({ length: columns }, (_, index) => (
          <text key={`x-${index}`} x={pad + index * cell + cell / 2} y={8} textAnchor="middle" fill="#64748b" fontSize="5.5" fontWeight="700">
            {index + 1}
          </text>
        ))}
        {Array.from({ length: rows }, (_, index) => (
          <text key={`y-${index}`} x={6} y={pad + index * cell + cell * 0.7} textAnchor="middle" fill="#64748b" fontSize="5.5" fontWeight="700">
            {String.fromCharCode(65 + index)}
          </text>
        ))}
        {positions.map((position, index) => {
          const x = Math.min(columns - 1, Math.max(0, position.x - minX))
          const y = Math.min(rows - 1, Math.max(0, position.y - minY))
          return (
            <rect
              key={`${position.pieceId}-${index}`}
              x={pad + x * cell + 1.5}
              y={pad + y * cell + 1.5}
              width={cell - 3}
              height={cell - 3}
              rx="1.5"
              fill={position.isCurrent ? '#f97316' : '#94a3b8'}
              opacity={position.isCurrent ? 1 : 0.42}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default function MarbleInstructionDiagram({ steps, currentStep, finalPreview = false, compact = false }: Props) {
  const [viewRotation, setViewRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  const positions: RenderedPosition[] = useMemo(() => steps
    .slice(0, currentStep + 1)
    .flatMap((step, sourceStep) => step.gridPositions.map((position) => ({
      ...position,
      sourceStep,
      isCurrent: finalPreview || sourceStep === currentStep,
    }))), [currentStep, finalPreview, steps])

  const visible: RenderedPosition[] = positions.length > 0
    ? positions
    : [{ x: 3, y: 3, z: 0, pieceId: 'placeholder', pieceCode: '?', isCurrent: true, sourceStep: currentStep }]

  const scene = useMemo(() => {
    const points: ScenePoint[] = visible.map((position) => {
      const rotated = rotateGrid(position.x, position.y, viewRotation)
      return {
        position,
        rawX: (rotated.x - rotated.y) * CELL_X / 2,
        rawY: (rotated.x + rotated.y) * CELL_Y / 2 - position.z * HEIGHT_UNIT,
        baseRawY: (rotated.x + rotated.y) * CELL_Y / 2,
      }
    })
    const minRawX = Math.min(...points.map((point) => point.rawX))
    const maxRawX = Math.max(...points.map((point) => point.rawX))
    const minRawY = Math.min(...points.map((point) => point.rawY))
    const maxRawY = Math.max(...points.map((point) => point.baseRawY))
    const spanX = Math.max(205, maxRawX - minRawX + 105)
    const spanY = Math.max(235, maxRawY - minRawY + 125)
    const centerRawX = (minRawX + maxRawX) / 2
    const centerRawY = (minRawY + maxRawY) / 2
    const project = (rawX: number, rawY: number) => ({
      left: 50 + ((rawX - centerRawX) / spanX) * 72 * zoom,
      top: 50 + ((rawY - centerRawY) / spanY) * 67 * zoom,
    })
    return { points, project }
  }, [viewRotation, visible, zoom])

  const ordered = [...scene.points].sort((first, second) =>
    (first.baseRawY + first.position.z * 0.25) - (second.baseRawY + second.position.z * 0.25),
  )
  const currentPoints = scene.points.filter((point) => point.position.isCurrent)
  const projectedCurrent = currentPoints.map((point) => scene.project(point.rawX, point.rawY))
  const insertionArrow = !finalPreview && projectedCurrent.length > 0 ? {
    left: projectedCurrent.reduce((sum, point) => sum + point.left, 0) / projectedCurrent.length,
    top: Math.max(5, Math.min(...projectedCurrent.map((point) => point.top)) - 16),
  } : null

  const maxZ = Math.max(...visible.map((position) => position.z))

  return (
    <div className="overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #cbd5e1' }}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-indigo-800">{finalPreview ? 'Aperçu final' : 'Plan de montage'}</p>
          <p className="text-xs font-bold text-slate-500">{finalPreview ? 'Circuit entièrement assemblé' : 'Couleur = pièces à poser maintenant'}</p>
        </div>
        {!compact && <div className="flex items-center gap-1">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.78, Number((value - 0.12).toFixed(2))))} aria-label="Réduire la vue" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-indigo-900">
            <Minus size={15} />
          </button>
          <button type="button" onClick={() => setViewRotation((value) => (value + 1) % 4)} aria-label="Changer l’angle de vue" className="flex h-8 items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] font-extrabold text-indigo-900">
            <RotateCw size={14} /> Angle
          </button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.28, Number((value + 0.12).toFixed(2))))} aria-label="Agrandir la vue" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-indigo-900">
            <Plus size={15} />
          </button>
        </div>}
      </div>

      <div className={`relative overflow-hidden ${compact ? 'h-[230px]' : 'h-[390px] sm:h-[470px]'}`} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 84%, #f8fafc 100%)' }}>
        {ordered.map(({ position, rawX, rawY, baseRawY }, index) => {
          const point = scene.project(rawX, rawY)
          const basePoint = scene.project(rawX, baseRawY)
          const code = position.pieceCode ?? '?'
          const size = Math.round(visualSize(code) * zoom)
          return (
            <div key={`${position.pieceId}-${index}`}>
              <div
                className="absolute rounded-full bg-slate-500/20 blur-[2px]"
                style={{
                  left: `${basePoint.left}%`,
                  top: `${basePoint.top + 2}%`,
                  width: Math.max(20, size * 0.58),
                  height: Math.max(6, size * 0.1),
                  transform: 'translate(-50%, -50%)',
                  zIndex: 6,
                  opacity: position.isCurrent ? 0.28 : 0.08,
                }}
              />
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${point.left}%`,
                  top: `${point.top}%`,
                  width: size,
                  height: size,
                  transform: 'translate(-50%, -72%)',
                  zIndex: 20 + Math.round(basePoint.top * 2 + position.z),
                  opacity: position.isCurrent ? 1 : 0.2,
                  filter: position.isCurrent
                    ? 'saturate(1.03) drop-shadow(0 4px 3px rgba(15,23,42,.2))'
                    : 'grayscale(.2) saturate(.7)',
                }}
              >
                <span className="flex h-full w-full items-center justify-center" style={{ transform: `rotate(${position.rotation ?? 0}deg)` }}>
                  <PieceImage code={code} color={position.color} emoji={position.emoji} alt={position.pieceName ?? code} size={size} variant="cutout" />
                </span>
              </div>
            </div>
          )
        })}

        {insertionArrow && (
          <div className="pointer-events-none absolute z-[999] flex -translate-x-1/2 flex-col items-center text-orange-500" style={{ left: `${insertionArrow.left}%`, top: `${insertionArrow.top}%` }} aria-hidden="true">
            <span className="mb-0.5 rounded bg-white/90 px-1.5 text-[9px] font-black uppercase tracking-wide">Poser</span>
            <ArrowDown size={32} strokeWidth={3.5} />
          </div>
        )}

        {!compact && <div className="absolute bottom-3 left-3 rounded-md border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm">
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-slate-300 opacity-50" />Déjà monté
          <span className="ml-3 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-orange-500" />À poser
          <span className="ml-3 text-indigo-700">H{maxZ + 1}</span>
        </div>}
        {!compact && <PositionMiniMap positions={visible} />}
      </div>
    </div>
  )
}
