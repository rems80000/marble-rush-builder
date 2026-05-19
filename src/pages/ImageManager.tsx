// ─── ImageManager ─────────────────────────────────────────────────────────────
// 3 tabs: piece list with individual upload, bulk import, crop from notice

import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Trash2, Image as ImageIcon, Scissors, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { MarblePiece } from '../types'
import PieceImage from '../components/PieceImage'
import { saveImage, deleteImage, getAllImageCodes, compressToWebP, cropAndCompress } from '../services/imageDB'

// ─── Tab types ─────────────────────────────────────────────────────────────────
type Tab = 'pieces' | 'bulk' | 'crop'

// ─── Helper: pick a file via input ────────────────────────────────────────────
function useFileInput(onFile: (f: File) => void) {
  const ref = useRef<HTMLInputElement>(null)
  function trigger() { ref.current?.click() }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) { onFile(f); e.target.value = '' }
  }
  return { ref, trigger, handleChange }
}

// ─── Tab 1 : liste pièce par pièce ────────────────────────────────────────────

// Each row is its own component so hooks are called at the top level
function PieceRow({
  piece, hasImg, busy,
  onUpload, onDelete,
}: {
  piece: MarblePiece
  hasImg: boolean
  busy: boolean
  onUpload: (f: File) => void
  onDelete: () => void
}) {
  const { ref, trigger, handleChange } = useFileInput(onUpload)
  return (
    <div
      className="card p-3 flex items-center gap-3"
      style={hasImg ? { borderColor: 'var(--accent)', borderWidth: '1px' } : {}}
    >
      <PieceImage code={piece.code} color={piece.color} emoji={piece.emoji} size={44} alt={piece.name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {piece.code} — {piece.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {hasImg ? '✅ Photo importée' : '⬜ Pas encore de photo'}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {hasImg && (
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        )}
        <button
          onClick={trigger}
          disabled={busy}
          className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          {busy
            ? <span className="text-[10px]">…</span>
            : <Upload size={14} style={{ color: 'var(--accent)' }} />}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    </div>
  )
}

function PiecesTab({ pieces }: { pieces: MarblePiece[] }) {
  const [uploadedCodes, setUploadedCodes] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    getAllImageCodes().then((codes) => setUploadedCodes(new Set(codes)))
  }, [])

  async function handleUpload(piece: MarblePiece, file: File) {
    setBusy(piece.code)
    try {
      const blob = await compressToWebP(file)
      await saveImage(piece.code, blob)
      setUploadedCodes((prev) => new Set([...prev, piece.code]))
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setBusy(null)
    }
  }

  async function handleDelete(piece: MarblePiece) {
    await deleteImage(piece.code)
    setUploadedCodes((prev) => { const s = new Set(prev); s.delete(piece.code); return s })
  }

  const sorted = [...pieces].sort((a, b) => {
    const aHas = uploadedCodes.has(a.code) ? 0 : 1
    const bHas = uploadedCodes.has(b.code) ? 0 : 1
    if (aHas !== bHas) return aHas - bHas
    return a.code.localeCompare(b.code)
  })

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {uploadedCodes.size}/{pieces.length} photos ajoutées — appuyez sur une ligne pour importer.
      </p>
      {sorted.map((piece) => (
        <PieceRow
          key={piece.id}
          piece={piece}
          hasImg={uploadedCodes.has(piece.code)}
          busy={busy === piece.code}
          onUpload={(f) => handleUpload(piece, f)}
          onDelete={() => handleDelete(piece)}
        />
      ))}
    </div>
  )
}

// ─── Tab 2 : import en masse par nom de fichier ────────────────────────────────
function BulkTab({ pieces }: { pieces: MarblePiece[] }) {
  const [results, setResults] = useState<{ code: string; name: string; status: 'ok' | 'error' | 'skip' }[]>([])
  const [busy, setBusy] = useState(false)

  const codeSet = new Set(pieces.map((p) => p.code))

  // Parse filename → code: "T-04.jpg", "piece-B-01.webp", "M-03_ascenseur.png" → "T-04", "B-01", "M-03"
  function extractCode(filename: string): string | null {
    const stem = filename.replace(/\.[^.]+$/, '') // remove extension
    // Try exact match first
    if (codeSet.has(stem)) return stem
    // Try regex: look for pattern like P-01, B-03, T-17, M-03, MARBLE
    const m = stem.match(/([A-Z]{1,6}-\d{2,3}|MARBLE)/i)
    if (m) {
      const candidate = m[1].toUpperCase()
      return codeSet.has(candidate) ? candidate : null
    }
    return null
  }

  async function handleFiles(files: FileList) {
    setBusy(true)
    const newResults: typeof results = []
    for (const file of Array.from(files)) {
      const code = extractCode(file.name)
      if (!code) { newResults.push({ code: file.name, name: file.name, status: 'skip' }); continue }
      const piece = pieces.find((p) => p.code === code)!
      try {
        const blob = await compressToWebP(file)
        await saveImage(code, blob)
        newResults.push({ code, name: `${code} — ${piece.name}`, status: 'ok' })
      } catch {
        newResults.push({ code, name: `${code} — ${piece.name}`, status: 'error' })
      }
    }
    setResults(newResults)
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Convention de nommage</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Nommez vos fichiers d'après le code pièce :<br />
          <code className="text-violet-400">T-04.jpg</code>, <code className="text-violet-400">M-03_ascenseur.png</code>, <code className="text-violet-400">B-01.webp</code>…<br />
          Les fichiers non reconnus sont ignorés.
        </p>
      </div>

      <label
        className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl cursor-pointer transition-colors"
        style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border)' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }}
      >
        <input
          type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }}
        />
        <ImageIcon size={32} style={{ color: 'var(--accent)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {busy ? 'Import en cours…' : 'Sélectionner ou glisser plusieurs photos'}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>JPG, PNG, WebP — compressés automatiquement</p>
      </label>

      {results.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Résultats — {results.filter(r => r.status === 'ok').length} importés
          </p>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <span>{r.status === 'ok' ? '✅' : r.status === 'error' ? '❌' : '⏭️'}</span>
              <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tab 3 : recadrer depuis une photo de la notice ───────────────────────────
function CropTab({ pieces }: { pieces: MarblePiece[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [selectedCode, setSelectedCode] = useState<string>(pieces[0]?.code ?? '')
  const [drag, setDrag] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [saved, setSaved] = useState(false)

  function loadSourceFile(file: File) {
    setSourceFile(file)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      setSourceImg(img)
      setRect(null)
      setSaved(false)
      drawCanvas(img, null)
    }
    img.src = url
  }

  const drawCanvas = useCallback((img: HTMLImageElement | null, selection: typeof rect) => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const maxW = canvas.parentElement?.clientWidth ?? 360
    const scale = Math.min(1, maxW / img.width)
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    if (selection) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.clearRect(selection.x, selection.y, selection.w, selection.h)
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 2
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h)
    }
  }, [])

  useEffect(() => {
    drawCanvas(sourceImg, rect)
  }, [sourceImg, rect, drawCanvas])

  function getCanvasCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const bounds = canvas.getBoundingClientRect()
    return {
      x: Math.round((e.clientX - bounds.left) * (canvas.width / bounds.width)),
      y: Math.round((e.clientY - bounds.top) * (canvas.height / bounds.height)),
    }
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = getCanvasCoords(e)
    setDrag({ startX: x, startY: y, endX: x, endY: y })
    setRect(null)
    setSaved(false)
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drag || !sourceImg) return
    const { x, y } = getCanvasCoords(e)
    const d = { ...drag, endX: x, endY: y }
    setDrag(d)
    const sel = {
      x: Math.min(d.startX, d.endX), y: Math.min(d.startY, d.endY),
      w: Math.abs(d.endX - d.startX), h: Math.abs(d.endY - d.startY),
    }
    if (sel.w > 4 && sel.h > 4) {
      setRect(sel)
      drawCanvas(sourceImg, sel)
    }
  }

  function onMouseUp() { setDrag(null) }

  async function saveCrop() {
    if (!rect || !sourceFile || !sourceImg) return
    const canvas = canvasRef.current!
    const scaleX = sourceImg.width / canvas.width
    const scaleY = sourceImg.height / canvas.height
    const realCrop = {
      x: Math.round(rect.x * scaleX), y: Math.round(rect.y * scaleY),
      width: Math.round(rect.w * scaleX), height: Math.round(rect.h * scaleY),
    }
    const blob = await cropAndCompress(sourceFile, realCrop)
    await saveImage(selectedCode, blob)
    setSaved(true)
  }

  const { ref: fileRef, trigger: triggerFile, handleChange: handleFileChange } = useFileInput(loadSourceFile)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Pièce cible
        </label>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="w-full rounded-xl px-3 py-3 text-sm"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        >
          {pieces.map((p) => (
            <option key={p.id} value={p.code}>{p.code} — {p.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={triggerFile}
        className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold"
        style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border)', color: 'var(--text-primary)' }}
      >
        <Upload size={18} style={{ color: 'var(--accent)' }} />
        {sourceImg ? 'Changer la photo source' : 'Charger une photo (notice, plateau…)'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {sourceImg && (
        <>
          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            Tracez un rectangle autour de la pièce <strong style={{ color: 'var(--accent)' }}>{selectedCode}</strong>
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <canvas
              ref={canvasRef}
              className="w-full touch-none select-none"
              style={{ cursor: 'crosshair', display: 'block' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
          </div>

          {rect && (
            <button
              onClick={saveCrop}
              className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{ background: saved ? '#10b981' : 'var(--accent)' }}
            >
              {saved
                ? <><CheckCircle2 size={18} /> Enregistré !</>
                : <><Scissors size={18} /> Recadrer et enregistrer pour {selectedCode}</>}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ImageManager() {
  const { state } = useStore()
  const [tab, setTab] = useState<Tab>('pieces')

  // All pieces from active, owned sets
  const pieces: MarblePiece[] = state.sets
    .filter((s) => s.owned && s.active)
    .flatMap((s) => s.pieces)
    .filter((p, i, arr) => arr.findIndex((x) => x.code === p.code) === i) // deduplicate by code
    .sort((a, b) => a.code.localeCompare(b.code))

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'pieces', label: 'Par pièce', icon: '🧩' },
    { id: 'bulk', label: 'Import lot', icon: '📂' },
    { id: 'crop', label: 'Recadrer', icon: '✂️' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      {/* En-tête */}
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Photos des pièces 📸</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Importez les photos de vos pièces depuis la notice ou vos propres clichés.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            style={{
              background: tab === t.id ? 'var(--accent)' : 'var(--bg-secondary)',
              color: tab === t.id ? 'white' : 'var(--text-secondary)',
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'pieces' && <PiecesTab pieces={pieces} />}
      {tab === 'bulk'   && <BulkTab pieces={pieces} />}
      {tab === 'crop'   && <CropTab pieces={pieces} />}
    </div>
  )
}
