import { useState } from 'react'
import type { GridCell, PieceColor } from '../types'

interface Props {
  cols: number
  rows: number
  cells: GridCell[]
  onCellClick?: (x: number, y: number) => void
  editable?: boolean
}

const COLOR_BG: Record<PieceColor, string> = {
  blue: '#1d4ed8',
  red: '#dc2626',
  yellow: '#ca8a04',
  green: '#16a34a',
  orange: '#ea580c',
  purple: '#7c3aed',
  white: '#e2e8f0',
  gray: '#475569',
  transparent: 'rgba(148,163,184,0.15)',
  mixed: '#7c3aed',
  pink: '#db2777',
  cyan: '#0891b2',
}

export default function BuildGrid({ cols, rows, cells, onCellClick, editable = false }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const cellMap = new Map<string, GridCell>()
  cells.forEach((c) => cellMap.set(`${c.x},${c.y}`, c))

  return (
    <div className="overflow-auto">
      <div
        className="inline-grid gap-0.5 p-2 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          minWidth: `${cols * 36}px`,
        }}
      >
        {Array.from({ length: rows }, (_, y) =>
          Array.from({ length: cols }, (_, x) => {
            const key = `${x},${y}`
            const cell = cellMap.get(key)
            const isHovered = hovered === key

            return (
              <div
                key={key}
                className="grid-iso-cell rounded-lg flex items-center justify-center text-base select-none"
                style={{
                  width: 34,
                  height: 34,
                  background: cell?.pieceId
                    ? COLOR_BG[cell.color ?? 'gray']
                    : isHovered && editable
                    ? 'rgba(124,58,237,0.25)'
                    : 'rgba(255,255,255,0.04)',
                  border: cell?.pieceId
                    ? '1px solid rgba(255,255,255,0.2)'
                    : isHovered && editable
                    ? '1px solid var(--accent)'
                    : '1px dashed rgba(148,163,184,0.15)',
                  cursor: editable ? 'pointer' : 'default',
                }}
                title={cell?.emoji ? `${cell.emoji} (${x},${y})` : `(${x},${y})`}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onCellClick?.(x, y)}
              >
                {cell?.emoji ?? (cell?.pieceId ? '🔷' : '')}
              </div>
            )
          }),
        )}
      </div>

      {/* Légende coordonnées */}
      <div className="flex justify-between px-2 mt-1">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>X:0</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>X:{cols - 1}</span>
      </div>
    </div>
  )
}
