// ─── CircuitBuilder ──────────────────────────────────────────────────────────
// Constructeur visuel 2D : grille 12×10, palette de pièces, drag & drop léger.

import { useState, useCallback, useMemo } from 'react'
import { RotateCcw, Trash2, Save, FolderOpen, Plus, Star, ChevronLeft } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { generateId } from '../utils/storage'
import type { PlacedPiece, PieceRotation, CircuitLayout, PieceColor, PieceType } from '../types'
import PieceImage from '../components/PieceImage'

// ─── Constantes grille ─────────────────────────────────────────────────────────
const COLS = 12
const ROWS = 10
const CELL = 52   // px par cellule

// ─── Groupes de types pour filtrer la palette ─────────────────────────────────
const TYPE_GROUPS: { label: string; emoji: string; types: PieceType[] }[] = [
  { label: 'Tout',       emoji: '🔠', types: [] },
  { label: 'Rails',      emoji: '🛤️',  types: ['rail-straight', 'rail-curved', 'train-track'] },
  { label: 'Structures', emoji: '🏗️',  types: ['base', 'block'] },
  { label: 'Mécanismes', emoji: '⚙️',  types: ['elevator', 'launcher', 'cannon', 'flipper', 'spiral', 'funnel', 'special', 'connector'] },
  { label: 'Déco',       emoji: '🌟',  types: ['decoration', 'marble', 'train-car'] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cellPiece(pieces: PlacedPiece[], col: number, row: number): PlacedPiece | undefined {
  return pieces.find(p => p.col === col && p.row === row)
}

function nextRotation(r: PieceRotation): PieceRotation {
  const cycle: PieceRotation[] = [0, 90, 180, 270]
  return cycle[(cycle.indexOf(r) + 1) % cycle.length]
}

// ─── Sous-composant : cellule de grille ───────────────────────────────────────
function GridCell({
  col, row, piece, selected, hovered,
  onClick, onHover, onLeave,
}: {
  col: number; row: number
  piece?: PlacedPiece
  selected: boolean; hovered: boolean
  onClick(): void
  onHover(): void
  onLeave(): void
}) {
  const rotation = piece?.rotation ?? 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={piece ? `Pièce ${piece.code} en (${col},${row})` : `Cellule vide (${col},${row})`}
      style={{
        width: CELL,
        height: CELL,
        position: 'relative',
        cursor: 'pointer',
        border: selected
          ? '2px solid var(--accent)'
          : hovered
          ? '1px dashed var(--accent)'
          : '1px solid var(--border)',
        borderRadius: 6,
        background: selected
          ? 'rgba(99,102,241,0.18)'
          : hovered
          ? 'rgba(99,102,241,0.08)'
          : 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        transition: 'background 0.1s, border-color 0.1s',
        flexShrink: 0,
      }}
    >
      {piece ? (
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PieceImage
            code={piece.code}
            color={piece.color}
            size={CELL - 10}
          />
        </div>
      ) : (
        <div style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--border)', opacity: 0.5 }} />
      )}
    </div>
  )
}

// ─── Sous-composant : indicateur de compteur pièce ───────────────────────────
function PieceCounter({ used, available }: { used: number; available: number }) {
  const remaining = available - used
  const color = remaining < 0 ? '#ef4444' : remaining === 0 ? '#f97316' : '#22c55e'
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        fontFamily: 'monospace',
        color,
        lineHeight: 1,
      }}
    >
      {used}/{available}
    </span>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function CircuitBuilder() {
  const { state, dispatch } = useStore()

  // ── État local du circuit en cours ──────────────────────────────────────────
  const [layoutPieces, setLayoutPieces] = useState<PlacedPiece[]>([])
  const [layoutName, setLayoutName] = useState('Nouveau circuit')
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // ── UI ──────────────────────────────────────────────────────────────────────
  const [selectedCode, setSelectedCode] = useState<string | null>(null)   // palette sélection
  const [selectedUid, setSelectedUid] = useState<string | null>(null)     // pièce posée sélectionnée
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null)
  const [typeFilter, setTypeFilter] = useState(0)   // index dans TYPE_GROUPS
  const [showLoadPanel, setShowLoadPanel] = useState(false)

  // ─── Inventaire agrégé ──────────────────────────────────────────────────────
  const inventory = useMemo(() => {
    const inv: Record<string, { quantity: number; color: PieceColor; emoji?: string }> = {}
    state.sets
      .filter(s => s.owned && s.active)
      .forEach(set => {
        set.pieces.forEach(p => {
          if (!inv[p.code]) {
            inv[p.code] = { quantity: 0, color: p.color, emoji: p.emoji }
          }
          inv[p.code].quantity += p.quantity
        })
      })
    return inv
  }, [state.sets])

  const usedCount = useMemo(() => {
    const used: Record<string, number> = {}
    layoutPieces.forEach(p => { used[p.code] = (used[p.code] ?? 0) + 1 })
    return used
  }, [layoutPieces])

  // ─── Palette de pièces filtrée ──────────────────────────────────────────────
  const paletteItems = useMemo(() => {
    const group = TYPE_GROUPS[typeFilter]
    // Déduplique les pièces de tous les sets actifs possédés
    const seen = new Set<string>()
    const items: { code: string; color: PieceColor; emoji?: string; type: PieceType; quantity: number }[] = []
    state.sets.filter(s => s.owned && s.active).forEach(set => {
      set.pieces.forEach(p => {
        if (seen.has(p.code)) return
        seen.add(p.code)
        if (group.types.length > 0 && !group.types.includes(p.type)) return
        items.push({
          code: p.code,
          color: p.color,
          emoji: p.emoji,
          type: p.type,
          quantity: inventory[p.code]?.quantity ?? 0,
        })
      })
    })
    return items
  }, [inventory, typeFilter, state.sets])

  // ─── Handlers grille ────────────────────────────────────────────────────────
  const handleCellClick = useCallback((col: number, row: number) => {
    const existing = cellPiece(layoutPieces, col, row)

    if (selectedCode) {
      // Mode placement : placer ou remplacer
      if (existing) {
        // Remplace
        setLayoutPieces(prev => prev.map(p =>
          p.col === col && p.row === row
            ? { ...p, code: selectedCode, color: inventory[selectedCode]?.color ?? 'gray', rotation: 0 }
            : p
        ))
      } else {
        const avail = inventory[selectedCode]?.quantity ?? 0
        const used = usedCount[selectedCode] ?? 0
        if (used >= avail) return // quantité dépassée
        setLayoutPieces(prev => [
          ...prev,
          {
            uid: generateId(),
            code: selectedCode,
            col, row,
            rotation: 0,
            color: inventory[selectedCode]?.color ?? 'gray',
          },
        ])
      }
      return
    }

    if (selectedUid) {
      // Mode déplacement : si la cible est vide, on déplace
      if (!existing) {
        setLayoutPieces(prev => prev.map(p =>
          p.uid === selectedUid ? { ...p, col, row } : p
        ))
        setSelectedUid(null)
        return
      }
    }

    // Sélectionner une pièce posée
    if (existing) {
      setSelectedUid(existing.uid === selectedUid ? null : existing.uid)
    } else {
      setSelectedUid(null)
    }
  }, [selectedCode, selectedUid, layoutPieces, inventory, usedCount])

  const handleRotate = useCallback(() => {
    if (!selectedUid) return
    setLayoutPieces(prev => prev.map(p =>
      p.uid === selectedUid ? { ...p, rotation: nextRotation(p.rotation) } : p
    ))
  }, [selectedUid])

  const handleDelete = useCallback(() => {
    if (!selectedUid) return
    setLayoutPieces(prev => prev.filter(p => p.uid !== selectedUid))
    setSelectedUid(null)
  }, [selectedUid])

  // ─── Sauvegarde ─────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const now = new Date().toISOString()
    if (currentLayoutId) {
      dispatch({
        type: 'UPDATE_LAYOUT',
        layout: {
          id: currentLayoutId,
          name: layoutName,
          createdAt: (state.layouts ?? []).find(l => l.id === currentLayoutId)?.createdAt ?? now,
          updatedAt: now,
          cols: COLS,
          rows: ROWS,
          pieces: layoutPieces,
          isFavorite,
        },
      })
    } else {
      const id = generateId()
      setCurrentLayoutId(id)
      dispatch({
        type: 'ADD_LAYOUT',
        layout: {
          id,
          name: layoutName,
          createdAt: now,
          updatedAt: now,
          cols: COLS,
          rows: ROWS,
          pieces: layoutPieces,
          isFavorite,
        },
      })
    }
  }, [currentLayoutId, layoutName, layoutPieces, isFavorite, dispatch, state.layouts])

  // ─── Charger un layout ──────────────────────────────────────────────────────
  const handleLoad = useCallback((layout: CircuitLayout) => {
    setLayoutPieces(layout.pieces)
    setLayoutName(layout.name)
    setCurrentLayoutId(layout.id)
    setIsFavorite(layout.isFavorite)
    setSelectedCode(null)
    setSelectedUid(null)
    setShowLoadPanel(false)
  }, [])

  // ─── Nouveau circuit ────────────────────────────────────────────────────────
  const handleNew = useCallback(() => {
    setLayoutPieces([])
    setLayoutName('Nouveau circuit')
    setCurrentLayoutId(null)
    setIsFavorite(false)
    setSelectedCode(null)
    setSelectedUid(null)
  }, [])

  const selectedPiece = layoutPieces.find(p => p.uid === selectedUid)

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: 'var(--bg-primary)', overflow: 'hidden' }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <NavLink to="/" aria-label="Retour">
          <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </NavLink>
        <input
          value={layoutName}
          onChange={e => setLayoutName(e.target.value)}
          className="flex-1 bg-transparent text-sm font-semibold outline-none"
          style={{ color: 'var(--text-primary)', minWidth: 0 }}
        />
        <button
          onClick={() => setIsFavorite(f => !f)}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          style={{ color: isFavorite ? '#eab308' : 'var(--text-secondary)' }}
        >
          <Star size={18} fill={isFavorite ? '#eab308' : 'none'} />
        </button>
        <button
          onClick={() => { setShowLoadPanel(p => !p); setSelectedCode(null); setSelectedUid(null) }}
          aria-label="Charger un circuit"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FolderOpen size={18} />
        </button>
        <button
          onClick={handleNew}
          aria-label="Nouveau circuit"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Plus size={18} />
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Save size={14} />
          Sauv.
        </button>
      </div>

      {/* ── Panneau chargement ─────────────────────────────────────────────── */}
      {showLoadPanel && (
        <div
          className="shrink-0 px-3 py-2 flex flex-col gap-2"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Circuits sauvegardés
          </p>
          {(state.layouts ?? []).length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Aucun circuit sauvegardé.</p>
          )}
          {(state.layouts ?? []).map(layout => (
            <button
              key={layout.id}
              onClick={() => handleLoad(layout)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <span className="font-medium truncate flex-1">{layout.name}</span>
              <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                {layout.pieces.length} pcs
              </span>
              {layout.isFavorite && <Star size={12} fill="#eab308" color="#eab308" className="ml-1" />}
            </button>
          ))}
        </div>
      )}

      {/* ── Info barre sélection ────────────────────────────────────────────── */}
      {(selectedCode || selectedUid) && (
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-1.5"
          style={{ borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.12)' }}
        >
          {selectedCode && (
            <>
              <PieceImage code={selectedCode} color={inventory[selectedCode]?.color} size={28} />
              <span className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                {selectedCode} — cliquez une cellule pour placer
              </span>
              <button
                onClick={() => setSelectedCode(null)}
                className="text-xs px-2 py-1 rounded"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
              >
                ✕ Annuler
              </button>
            </>
          )}
          {selectedUid && selectedPiece && (
            <>
              <PieceImage code={selectedPiece.code} color={selectedPiece.color} size={28} />
              <span className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                {selectedPiece.code} — cliquez une cellule vide pour déplacer
              </span>
              <button
                onClick={handleRotate}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
                aria-label="Tourner la pièce"
              >
                <RotateCcw size={13} /> {selectedPiece.rotation}°
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                aria-label="Supprimer la pièce"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setSelectedUid(null)}
                className="text-xs px-2 py-1 rounded"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Grille ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-2">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
            gap: 2,
            width: COLS * CELL + (COLS - 1) * 2,
          }}
        >
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const piece = cellPiece(layoutPieces, col, row)
              const isSelected = piece?.uid === selectedUid
              const isHovered = hoveredCell?.col === col && hoveredCell?.row === row
              return (
                <GridCell
                  key={`${col}-${row}`}
                  col={col}
                  row={row}
                  piece={piece}
                  selected={isSelected}
                  hovered={isHovered && !piece}
                  onClick={() => handleCellClick(col, row)}
                  onHover={() => setHoveredCell({ col, row })}
                  onLeave={() => setHoveredCell(null)}
                />
              )
            })
          )}
        </div>

        {/* Légende */}
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
          {layoutPieces.length} pièce{layoutPieces.length !== 1 ? 's' : ''} placée{layoutPieces.length !== 1 ? 's' : ''} · {COLS}×{ROWS} cellules
        </p>
      </div>

      {/* ── Palette bas ─────────────────────────────────────────────────────── */}
      <div
        className="shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        {/* Filtre type */}
        <div className="flex gap-1 px-2 pt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TYPE_GROUPS.map((g, i) => (
            <button
              key={i}
              onClick={() => setTypeFilter(i)}
              className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: typeFilter === i ? 'var(--accent)' : 'var(--bg-primary)',
                color: typeFilter === i ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${typeFilter === i ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <span>{g.emoji}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>

        {/* Pièces */}
        <div
          className="flex gap-2 px-2 py-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {paletteItems.length === 0 && (
            <p className="text-xs py-2" style={{ color: 'var(--text-secondary)' }}>
              Aucune pièce disponible. Activez un set dans Mes Sets.
            </p>
          )}
          {paletteItems.map(item => {
            const used = usedCount[item.code] ?? 0
            const remaining = item.quantity - used
            const isSelected = selectedCode === item.code
            const depleted = remaining <= 0
            return (
              <button
                key={item.code}
                onClick={() => {
                  if (depleted) return
                  setSelectedCode(isSelected ? null : item.code)
                  setSelectedUid(null)
                }}
                className="shrink-0 flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-1.5"
                style={{
                  background: isSelected ? 'var(--accent)' : 'var(--bg-primary)',
                  border: `2px solid ${isSelected ? 'var(--accent)' : depleted ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                  opacity: depleted ? 0.45 : 1,
                  cursor: depleted ? 'not-allowed' : 'pointer',
                  minWidth: 54,
                }}
                aria-label={`${item.code} — ${remaining} restant${remaining > 1 ? 's' : ''}`}
                disabled={depleted}
              >
                <PieceImage
                  code={item.code}
                  color={item.color}
                  emoji={item.emoji}
                  size={40}
                />
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: isSelected ? 'white' : 'var(--text-primary)', fontSize: 9, lineHeight: 1 }}
                >
                  {item.code}
                </span>
                <PieceCounter used={used} available={item.quantity} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
