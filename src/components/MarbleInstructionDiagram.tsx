import { useMemo, useState } from 'react'
import { ArrowDown, Layers3, Minus, Plus, RotateCw } from 'lucide-react'
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

interface ScenePoint {
  position: RenderedPosition
  rawX: number
  rawY: number
  baseRawY: number
}

const CELL_X = 58
const CELL_Y = 29
const HEIGHT_UNIT = 34

function rotateGrid(x: number, y: number, quarterTurns: number) {
  if (quarterTurns === 1) return { x: y, y: -x }
  if (quarterTurns === 2) return { x: -x, y: -y }
  if (quarterTurns === 3) return { x: -y, y: x }
  return { x, y }
}

function visualSize(code: string, current: boolean) {
  let size = 66
  if (code.startsWith('P-')) size = 94
  else if (code.startsWith('B-')) size = 58
  else if (code.startsWith('T-')) size = 76
  else if (code === 'M-40' || code === 'M-45') size = 94
  else if (code.startsWith('M-')) size = 82
  return current ? Math.round(size * 1.08) : size
}

export default function MarbleInstructionDiagram({ steps, currentStep }: Props) {
  const [viewRotation, setViewRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  const positions: RenderedPosition[] = useMemo(() => steps
    .slice(0, currentStep + 1)
    .flatMap((step, sourceStep) => step.gridPositions.map((position) => ({
      ...position,
      sourceStep,
      isCurrent: sourceStep === currentStep,
    }))), [currentStep, steps])

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
    const spanX = Math.max(210, maxRawX - minRawX + 100)
    const spanY = Math.max(250, maxRawY - minRawY + 130)
    const centerRawX = (minRawX + maxRawX) / 2
    const centerRawY = (minRawY + maxRawY) / 2
    const project = (rawX: number, rawY: number) => ({
      left: 50 + ((rawX - centerRawX) / spanX) * 76 * zoom,
      top: 52 + ((rawY - centerRawY) / spanY) * 68 * zoom,
    })
    return { points, project }
  }, [viewRotation, visible, zoom])

  const ordered = [...scene.points].sort((first, second) =>
    (first.baseRawY + first.position.z * 0.25) - (second.baseRawY + second.position.z * 0.25),
  )

  const minX = Math.min(...visible.map((position) => position.x))
  const minY = Math.min(...visible.map((position) => position.y))
  const maxX = Math.max(...visible.map((position) => position.x))
  const maxY = Math.max(...visible.map((position) => position.y))
  const maxZ = Math.max(...visible.map((position) => position.z))
  const planeWidth = Math.min(500, Math.max(290, (maxX - minX + 5) * 56 * zoom))
  const planeHeight = Math.min(360, Math.max(220, (maxY - minY + 5) * 44 * zoom))

  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '2px solid #d8dce8' }}>
      <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ background: '#312e81' }}>
        <div className="flex items-center gap-2 text-white">
          <Layers3 size={17} />
          <span className="text-xs font-extrabold uppercase tracking-wider">Assemblage 3D</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.15).toFixed(2))))}
            aria-label="Réduire la vue"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950/40 text-white"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewRotation((value) => (value + 1) % 4)}
            aria-label="Tourner la vue 3D"
            className="flex h-8 items-center justify-center gap-1 rounded-lg bg-indigo-950/40 px-2 text-[11px] font-black text-white"
          >
            <RotateCw size={15} /> Tourner
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(1.35, Number((value + 0.15).toFixed(2))))}
            aria-label="Agrandir la vue"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950/40 text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="relative h-[390px] overflow-hidden sm:h-[470px]" style={{ background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f4f7fb 58%, #e2e8f0 100%)' }}>
        <div
          className="absolute left-1/2 top-[64%]"
          style={{
            width: planeWidth,
            height: planeHeight,
            transform: `translate(-50%, -50%) rotateX(61deg) rotateZ(${45 + viewRotation * 90}deg)`,
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            border: '2px solid #94a3b8',
            borderRadius: 16,
            boxShadow: '18px 24px 34px rgba(15,23,42,.18)',
          }}
        />

        {ordered.map(({ position, rawX, rawY, baseRawY }, index) => {
          const point = scene.project(rawX, rawY)
          const basePoint = scene.project(rawX, baseRawY)
          const code = position.pieceCode ?? '?'
          const size = Math.round(visualSize(code, position.isCurrent) * zoom)
          const guideHeight = Math.max(0, basePoint.top - point.top)
          return (
            <div key={`${position.pieceId}-${index}`}>
              {position.z > 0 && (
                <div
                  className="absolute border-l-2 border-dashed border-indigo-300/70"
                  style={{
                    left: `${point.left}%`,
                    top: `${point.top}%`,
                    height: `${guideHeight}%`,
                    zIndex: 5,
                  }}
                />
              )}
              <div
                className="absolute rounded-full bg-slate-700/20 blur-[2px]"
                style={{
                  left: `${basePoint.left}%`,
                  top: `${basePoint.top + 2}%`,
                  width: Math.max(24, size * 0.72),
                  height: Math.max(8, size * 0.16),
                  transform: 'translate(-50%, -50%)',
                  zIndex: 6,
                  opacity: position.isCurrent ? 0.5 : 0.22,
                }}
              />
              <div
                className="absolute transition-all duration-500"
                style={{
                  left: `${point.left}%`,
                  top: `${point.top}%`,
                  width: size,
                  height: size,
                  transform: 'translate(-50%, -72%)',
                  zIndex: 20 + Math.round(basePoint.top * 2 + position.z),
                  opacity: position.isCurrent ? 1 : 0.48,
                  filter: position.isCurrent ? 'saturate(1.08)' : 'grayscale(.55) saturate(.55)',
                }}
              >
                {position.isCurrent && (
                  <div className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 animate-bounce text-orange-500">
                    <ArrowDown size={25} strokeWidth={3.5} />
                  </div>
                )}
                <div
                  className="relative flex h-full w-full items-center justify-center rounded-2xl"
                  style={{
                    outline: position.isCurrent ? '3px solid #f97316' : 'none',
                    outlineOffset: position.isCurrent ? 2 : 0,
                    background: position.isCurrent ? 'radial-gradient(circle, rgba(255,247,237,.88), rgba(255,255,255,.12) 72%)' : 'transparent',
                    boxShadow: position.isCurrent ? '0 0 24px rgba(249,115,22,.32)' : 'none',
                  }}
                >
                  <span style={{ display: 'block', transform: `rotate(${position.rotation ?? 0}deg)` }}>
                    <PieceImage
                      code={code}
                      color={position.color}
                      emoji={position.emoji}
                      alt={position.pieceName ?? code}
                      size={size}
                      variant="cutout"
                    />
                  </span>
                </div>
                {position.isCurrent && (
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white shadow-lg">
                    {code} · H{position.z}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        <div className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-600 shadow">
          Atténué = monté · Orange = à ajouter
        </div>
        <div className="absolute bottom-2 right-2 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
          {maxZ + 1} niveaux · vue {viewRotation + 1}/4
        </div>
      </div>
    </div>
  )
}
