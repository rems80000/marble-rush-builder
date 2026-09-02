import { Flag, Play } from 'lucide-react'
import type { BuildStep, StepPieceUsage } from '../types'
import PieceImage from './PieceImage'

interface Props {
  steps: BuildStep[]
  compact?: boolean
}

interface AttractionNode {
  piece: StepPieceUsage
  label: string
}

function isAttraction(piece: StepPieceUsage) {
  const code = piece.pieceCode ?? ''
  if (!code || code === 'MARBLE' || code.startsWith('B-') || code.startsWith('P-')) return false
  if (/^T-(01|02|03|04|05|06|07|08|11|14|23|24|25|26|27)$/.test(code)) return false
  return true
}

function friendlyLabel(piece: StepPieceUsage) {
  return piece.pieceName
    .replace(/^.*?—\s*/, '')
    .replace(/^Pièce\s+/i, '')
    .replace(/\s+M-?\d+.*$/i, '')
}

function extractAttractions(steps: BuildStep[]): AttractionNode[] {
  const nodes: AttractionNode[] = []
  const seen = new Map<string, number>()
  steps.forEach((step) => {
    const attraction = step.pieces.find(isAttraction)
    if (!attraction) return
    const code = attraction.pieceCode ?? attraction.pieceId
    const occurrence = (seen.get(code) ?? 0) + 1
    seen.set(code, occurrence)
    nodes.push({
      piece: attraction,
      label: `${friendlyLabel(attraction)}${occurrence > 1 ? ` ${occurrence}` : ''}`,
    })
  })
  return nodes
}

function nodePoints(count: number) {
  if (count <= 1) return [{ x: 50, y: 51 }]
  if (count === 2) return [{ x: 30, y: 58 }, { x: 70, y: 40 }]
  if (count === 3) return [{ x: 20, y: 60 }, { x: 50, y: 35 }, { x: 80, y: 60 }]
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 3)
    const column = index % 3
    const leftToRight = row % 2 === 0
    const xPositions = [18, 50, 82]
    return {
      x: xPositions[leftToRight ? column : 2 - column] ?? 50,
      y: 31 + row * 34,
    }
  })
}

export default function CircuitOverview({ steps, compact = false }: Props) {
  const attractions = extractAttractions(steps)
  const points = nodePoints(attractions.length)
  const route = [
    { x: 5, y: points[0]?.y ?? 52 },
    ...points,
    { x: 95, y: points.at(-1)?.y ?? 52 },
  ]
  const polyline = route.map((point) => `${point.x * 8},${point.y * 3.2}`).join(' ')

  return (
    <section className="overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-sm" aria-label="Aperçu du parcours terminé">
      <header className="flex items-center justify-between border-b border-sky-100 px-4 py-3">
        <div>
          <p className="text-base font-black text-slate-900">Ton parcours</p>
          <p className="text-xs font-bold text-slate-500">Suis la ligne de la bille</p>
        </div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
          {attractions.length} grande{attractions.length > 1 ? 's' : ''} pièce{attractions.length > 1 ? 's' : ''}
        </span>
      </header>

      <div className={`relative ${compact ? 'h-[245px]' : 'h-[310px] sm:h-[350px]'}`} style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 78%)' }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0f172a" floodOpacity=".16" />
            </filter>
          </defs>
          <polyline points={polyline} fill="none" stroke="#cbd5e1" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" filter="url(#route-shadow)" />
          <polyline points={polyline} fill="none" stroke="#38bdf8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={polyline} fill="none" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 14" />
        </svg>

        <div className="absolute left-[2%] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1 text-sky-700">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg"><Play size={21} fill="currentColor" /></span>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black shadow">DÉPART</span>
        </div>

        {attractions.map((node, index) => {
          const point = points[index] ?? { x: 50, y: 50 }
          const code = node.piece.pieceCode ?? node.piece.pieceId
          const imageSize = compact ? 76 : 92
          return (
            <div key={`${code}-${index}`} className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
              <span className="absolute -left-1 -top-1 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white shadow ring-2 ring-white">{index + 1}</span>
              <span className="flex items-center justify-center rounded-3xl border-4 border-white bg-white/95 p-1.5 shadow-xl">
                <PieceImage code={code} color={node.piece.color} emoji={node.piece.emoji} size={imageSize} setReference={node.piece.setReference} variant="cutout" />
              </span>
              <span className="mt-1 max-w-32 rounded-xl bg-slate-900/90 px-2 py-1 text-center text-[10px] font-black leading-tight text-white shadow">
                {node.label}
              </span>
            </div>
          )
        })}

        <div className="absolute right-[2%] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1 text-orange-600">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-white shadow-lg"><Flag size={22} /></span>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black shadow">ARRIVÉE</span>
        </div>

        {attractions.length === 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-12 text-center">
            <p className="rounded-2xl bg-white p-4 text-sm font-black text-slate-600 shadow">Choisis une grande pièce pour voir le parcours.</p>
          </div>
        )}
      </div>
    </section>
  )
}
