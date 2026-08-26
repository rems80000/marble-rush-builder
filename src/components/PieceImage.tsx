// ─── PieceImage ───────────────────────────────────────────────────────────────
// Shows a real photo when available (IndexedDB upload or public/pieces asset),
// falls back to the dedicated SVG icon for the piece code,
// then to a generic coloured tile — never throws.

import { useEffect, useState } from 'react'
import type { PieceColor } from '../types'
import { getImageUrl } from '../services/imageDB'
import { getPieceSVG } from './PieceSVG'
import { getNoticeCrop } from '../data/noticeCrops'
import NoticePieceImage from './NoticePieceImage'

// ── colour → CSS var / hex mapping for the SVG fallback ──────────────────────
const COLOR_BG: Record<PieceColor, string> = {
  blue:        '#3b82f6',
  red:         '#ef4444',
  yellow:      '#eab308',
  green:       '#22c55e',
  orange:      '#f97316',
  purple:      '#a855f7',
  white:       '#e2e8f0',
  gray:        '#64748b',
  transparent: '#334155',
  mixed:       '#7c3aed',
  pink:        '#ec4899',
  cyan:        '#06b6d4',
}

interface Props {
  code: string
  color?: PieceColor
  emoji?: string
  alt?: string
  /** Side length in px — the component renders a square */
  size?: number
  className?: string
  setReference?: string
  variant?: 'tile' | 'cutout'
}

// ── async hook: try IndexedDB upload first, then public-asset URL ─────────────
function usePieceImage(code: string): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // 1. Check IndexedDB (user upload)
      try {
        const dbUrl = await getImageUrl(code)
        if (!cancelled && dbUrl) { setUrl(dbUrl); return }
      } catch { /* ignore IDB errors */ }

      // 2. Try public/pieces/<code>.webp then .png
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      for (const ext of ['webp', 'png', 'jpg']) {
        const assetUrl = `${base}/pieces/${code}.${ext}`
        const ok = await fetch(assetUrl, { method: 'HEAD' }).then(r => r.ok).catch(() => false)
        if (!cancelled && ok) { setUrl(assetUrl); return }
      }

      if (!cancelled) setUrl(null)
    }

    load()
    return () => { cancelled = true }
  }, [code])

  return url
}

// ── SVG fallback tile ─────────────────────────────────────────────────────────
function FallbackTile({ code, color = 'gray', emoji, size }: {
  code: string; color?: PieceColor; emoji?: string; size: number
}) {
  const bg = COLOR_BG[color] ?? '#64748b'
  const fontSize = Math.max(10, Math.round(size * 0.36))
  const codeFontSize = Math.max(7, Math.round(size * 0.18))

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: Math.round(size * 0.18), flexShrink: 0, display: 'block' }}
      aria-label={code}
    >
      {/* Background */}
      <rect width={size} height={size} rx={Math.round(size * 0.18)} fill={bg} opacity="0.25" />
      <rect
        x="1" y="1"
        width={size - 2} height={size - 2}
        rx={Math.round(size * 0.16)}
        fill="none"
        stroke={bg}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Emoji */}
      {emoji && (
        <text
          x="50%" y={size * 0.54}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
        >
          {emoji}
        </text>
      )}

      {/* Code label */}
      <text
        x="50%" y={size - codeFontSize * 0.9}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={codeFontSize}
        fill={bg}
        fontWeight="700"
        fontFamily="monospace"
        opacity="0.9"
      >
        {code}
      </text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PieceImage({ code, color, emoji, alt, size = 48, className, setReference, variant = 'tile' }: Props) {
  const url = usePieceImage(code)
  const [imgError, setImgError] = useState(false)

  // Reset error state when url changes
  useEffect(() => { setImgError(false) }, [url])

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={alt ?? code}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: variant === 'cutout' ? 'contain' : 'cover',
          borderRadius: variant === 'cutout' ? 0 : Math.round(size * 0.18),
          flexShrink: 0,
          display: 'block',
          filter: variant === 'cutout' ? 'drop-shadow(0 8px 6px rgba(15,23,42,.28))' : undefined,
        }}
      />
    )
  }

  // 3. Recadrage fidèle de la case COMPOSANTS photographiée.
  const noticeCrop = getNoticeCrop(code, setReference)
  if (noticeCrop) {
    return (
      <NoticePieceImage
        imageUrl={noticeCrop.imageUrl}
        crop={noticeCrop.crop}
        code={code}
        size={size}
        className={className}
        variant={variant}
      />
    )
  }

  // 4. Dedicated SVG icon for codes absent from the photographed notices.
  const SvgIcon = getPieceSVG(code)
  if (SvgIcon) {
    return (
      <span
        className={className}
        aria-label={alt ?? code}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: variant === 'cutout' ? 0 : Math.round(size * 0.18),
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <SvgIcon size={size} />
      </span>
    )
  }

  // 5. Generic fallback tile (unknown codes)
  return (
    <FallbackTile
      code={code}
      color={color}
      emoji={emoji}
      size={size}
    />
  )
}
