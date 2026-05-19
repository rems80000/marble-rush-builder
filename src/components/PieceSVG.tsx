// ─── PieceSVG — icônes SVG vectorielles pour chaque code de pièce ─────────────
// Basées sur les catalogues visuels des images de référence.
// Chaque icône est un composant React pur (pas de state, pas d'effets).

import React from 'react'

// ── Couleurs de référence ─────────────────────────────────────────────────────
const C = {
  blue:   '#3b82f6',
  red:    '#ef4444',
  yellow: '#eab308',
  green:  '#22c55e',
  orange: '#f97316',
  purple: '#a855f7',
  white:  '#e2e8f0',
  gray:   '#94a3b8',
  cyan:   '#06b6d4',
  mixed:  '#7c3aed',
  pink:   '#ec4899',
}

// ── Wrapper SVG standard ──────────────────────────────────────────────────────
const Svg = ({ size, children }: { size?: number; children: React.ReactNode }) => (
  <svg
    width={size ?? 80} height={size ?? 80}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {children}
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// ── Shapes paramétriques ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/** Base plate en grille (P-01, P-02) */
const GridBase = ({ color, cols, rows, s }: { color: string; cols: number; rows: number; s?: number }) => {
  const cw = 72 / cols
  const rh = 72 / rows
  const holes: [number, number][] = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      holes.push([4 + (c + 0.5) * cw, 4 + (r + 0.5) * rh])
  const hr = Math.min(cw, rh) * 0.22
  return (
    <Svg size={s}>
      <rect x="3" y="3" width="74" height="74" rx="7" fill={color} opacity="0.18" stroke={color} strokeWidth="1.8"/>
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <line key={`v${i}`} x1={4 + (i + 1) * cw} y1="3" x2={4 + (i + 1) * cw} y2="77" stroke={color} strokeWidth="1" opacity="0.45"/>
      ))}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <line key={`h${i}`} x1="3" y1={4 + (i + 1) * rh} x2="77" y2={4 + (i + 1) * rh} stroke={color} strokeWidth="1" opacity="0.45"/>
      ))}
      {holes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={Math.max(2.5, hr)} fill={color} opacity="0.65"/>
      ))}
    </Svg>
  )
}

/** Bloc support (B-01..B-05) — vue de face */
const BlockShape = ({ color, h = 1, s }: { color: string; h?: number; s?: number }) => {
  const bh = Math.min(56, 16 + h * 18)
  const y0 = 76 - bh
  return (
    <Svg size={s}>
      <rect x="18" y={y0} width="44" height={bh} rx="5" fill={color} opacity="0.85"/>
      <rect x="18" y={y0} width="44" height="9" rx="5" fill="white" opacity="0.22"/>
      <rect x="29" y={y0 - 9} width="22" height="13" rx="3" fill={color} opacity="0.9"/>
      <rect x="33" y={y0 + bh * 0.32} width="14" height="14" rx="3" fill="black" opacity="0.18"/>
      <line x1="18" y1={y0 + bh - 10} x2="62" y2={y0 + bh - 10} stroke="white" strokeWidth="1.5" opacity="0.15"/>
    </Svg>
  )
}

/** Bloc angle (B-05) — L-shape */
const AngleBlock = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="16" y="30" width="48" height="34" rx="5" fill={color} opacity="0.8"/>
    <rect x="30" y="14" width="22" height="22" rx="5" fill={color} opacity="0.7"/>
    <rect x="16" y="30" width="48" height="8" rx="4" fill="white" opacity="0.2"/>
    <rect x="30" y="14" width="22" height="7" rx="3" fill="white" opacity="0.2"/>
  </Svg>
)

/** Rail courbe 90° */
const CurvedRail = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 8 72 A 60 60 0 0 1 72 8" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.85"/>
    <path d="M 8 72 A 60 60 0 0 1 72 8" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.28"/>
    <path d="M 8 72 A 60 60 0 0 1 72 8" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" strokeDasharray="4 10" strokeDashoffset="2"/>
  </Svg>
)

/** Rail droit horizontal */
const StraightRail = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="5" y="29" width="70" height="22" rx="5" fill={color} opacity="0.85"/>
    <rect x="5" y="29" width="70" height="7" rx="5" fill="white" opacity="0.22"/>
    <line x1="5" y1="36" x2="75" y2="36" stroke="white" strokeWidth="2" opacity="0.2"/>
    <line x1="5" y1="44" x2="75" y2="44" stroke="white" strokeWidth="2" opacity="0.2"/>
  </Svg>
)

/** Rail incliné */
const InclinedRail = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 5 64 L 75 16 L 75 30 L 5 78 Z" fill={color} opacity="0.85"/>
    <path d="M 5 64 L 75 16 L 75 22 L 5 70 Z" fill="white" opacity="0.2"/>
    <line x1="5" y1="68" x2="75" y2="20" stroke="white" strokeWidth="2" opacity="0.2"/>
    <line x1="5" y1="74" x2="75" y2="26" stroke="white" strokeWidth="2" opacity="0.2"/>
  </Svg>
)

/** Lanceur (T-01, T-26) */
const LauncherShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 12 30 L 68 30 L 62 14 L 18 14 Z" fill={color} opacity="0.72"/>
    <rect x="20" y="30" width="40" height="38" rx="6" fill={color} opacity="0.85"/>
    <rect x="20" y="30" width="40" height="9" rx="4" fill="white" opacity="0.22"/>
    <circle cx="40" cy="53" r="9" fill="white" opacity="0.32"/>
    <circle cx="40" cy="53" r="5" fill={color} opacity="0.6"/>
  </Svg>
)

/** Tunnel / entonnoir (T-07, M-42) */
const TunnelShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="5" y="34" width="70" height="18" rx="4" fill={color} opacity="0.65"/>
    <path d="M 18 52 L 18 28 A 22 22 0 0 1 62 28 L 62 52 Z" fill={color} opacity="0.85"/>
    <rect x="18" y="34" width="44" height="10" rx="3" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="30" rx="16" ry="9" fill="black" opacity="0.28"/>
  </Svg>
)

/** Arrivée finale (T-27) */
const FunnelShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 6 16 L 74 16 L 56 60 L 24 60 Z" fill={color} opacity="0.75"/>
    <ellipse cx="40" cy="60" rx="18" ry="8" fill={color} opacity="0.9"/>
    <line x1="14" y1="24" x2="66" y2="24" stroke="white" strokeWidth="2.5" opacity="0.28"/>
    <line x1="18" y1="34" x2="62" y2="34" stroke="white" strokeWidth="1.5" opacity="0.2"/>
  </Svg>
)

/** Flipper / aiguillage (T-10) */
const FlipperShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="30" y="6" width="20" height="26" rx="5" fill={color} opacity="0.82"/>
    <path d="M 22 32 L 40 52 L 58 32 Z" fill={color} opacity="0.75"/>
    <rect x="6" y="50" width="28" height="18" rx="5" fill={color} opacity="0.82"/>
    <rect x="46" y="50" width="28" height="18" rx="5" fill={color} opacity="0.82"/>
    <circle cx="40" cy="44" r="5" fill="white" opacity="0.5"/>
  </Svg>
)

/** Connecteur 4 voies (T-14) */
const ConnectorCross = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <circle cx="40" cy="40" r="12" fill={color} opacity="0.88"/>
    <rect x="33" y="7" width="14" height="29" rx="5" fill={color} opacity="0.75"/>
    <rect x="33" y="44" width="14" height="29" rx="5" fill={color} opacity="0.75"/>
    <rect x="7" y="33" width="29" height="14" rx="5" fill={color} opacity="0.75"/>
    <rect x="44" y="33" width="29" height="14" rx="5" fill={color} opacity="0.75"/>
  </Svg>
)

/** Croisement de pistes (T-23) */
const CrossingShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="5" y="29" width="70" height="22" rx="4" fill={color} opacity="0.72"/>
    <rect x="29" y="5" width="22" height="70" rx="4" fill={color} opacity="0.72"/>
    <circle cx="40" cy="40" r="14" fill={color} opacity="0.9"/>
    <circle cx="40" cy="40" r="7" fill="white" opacity="0.3"/>
    <line x1="5" y1="36" x2="75" y2="36" stroke="white" strokeWidth="1.5" opacity="0.22"/>
    <line x1="5" y1="44" x2="75" y2="44" stroke="white" strokeWidth="1.5" opacity="0.22"/>
  </Svg>
)

/** Spirale (T-17) */
const SpiralShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <circle cx="40" cy="40" r="34" stroke={color} strokeWidth="7" fill="none" opacity="0.85"/>
    <circle cx="40" cy="40" r="23" stroke={color} strokeWidth="6" fill="none" opacity="0.75"/>
    <circle cx="40" cy="40" r="13" stroke={color} strokeWidth="5" fill="none" opacity="0.65"/>
    <circle cx="40" cy="40" r="5" fill={color} opacity="0.7"/>
    {/* Entry opening */}
    <path d="M 40 6 L 47 6 A 34 34 0 0 1 74 40" stroke="#1e1b4b" strokeWidth="5" fill="none" opacity="0.55"/>
  </Svg>
)

/** Rails de train double (T-24 droit, T-25 courbe) */
const TrainTrack = ({ color, curved = false, s }: { color: string; curved?: boolean; s?: number }) => (
  <Svg size={s}>
    {curved ? (
      <>
        <path d="M 6 74 A 62 62 0 0 1 74 6" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85"/>
        <path d="M 14 74 A 54 54 0 0 1 74 14" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85"/>
        {[12, 28, 44, 62].map(a => {
          const rad = (a * Math.PI) / 180
          const r = 40
          const x = 74 - r * Math.cos(rad)
          const y = 74 - r * Math.sin(rad)
          return <line key={a} x1={x - 6 * Math.sin(rad)} y1={y - 6 * Math.cos(rad)} x2={x + 6 * Math.sin(rad)} y2={y + 6 * Math.cos(rad)} stroke={color} strokeWidth="5" opacity="0.55"/>
        })}
      </>
    ) : (
      <>
        <line x1="6" y1="28" x2="74" y2="28" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.85"/>
        <line x1="6" y1="52" x2="74" y2="52" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.85"/>
        {[14, 26, 40, 54, 66].map(x => (
          <line key={x} x1={x} y1="22" x2={x} y2="58" stroke={color} strokeWidth="5" opacity="0.55"/>
        ))}
      </>
    )}
  </Svg>
)

/** Ascenseur motorisé (M-03) */
const ElevatorShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="27" y="8" width="26" height="62" rx="5" fill={color} opacity="0.68"/>
    <rect x="22" y="58" width="36" height="12" rx="5" fill={color} opacity="0.88"/>
    <rect x="14" y="68" width="52" height="9" rx="6" fill={color} opacity="0.82"/>
    <path d="M 40 16 L 31 30 L 36 30 L 36 44 L 44 44 L 44 30 L 49 30 Z" fill="white" opacity="0.82"/>
    <rect x="27" y="52" width="26" height="8" rx="3" fill="white" opacity="0.25"/>
  </Svg>
)

/** Wagon train (M-04) */
const TrainCarShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="8" y="22" width="64" height="34" rx="7" fill={color} opacity="0.85"/>
    <rect x="8" y="22" width="64" height="10" rx="7" fill="white" opacity="0.22"/>
    <rect x="16" y="28" width="16" height="12" rx="3" fill="white" opacity="0.48"/>
    <rect x="48" y="28" width="16" height="12" rx="3" fill="white" opacity="0.48"/>
    <circle cx="20" cy="60" r="9" fill={color} opacity="0.9" stroke="white" strokeWidth="1.5" strokeOpacity="0.25"/>
    <circle cx="60" cy="60" r="9" fill={color} opacity="0.9" stroke="white" strokeWidth="1.5" strokeOpacity="0.25"/>
    <circle cx="20" cy="60" r="4" fill="white" opacity="0.3"/>
    <circle cx="60" cy="60" r="4" fill="white" opacity="0.3"/>
  </Svg>
)

/** Canon propulseur (M-07) */
const CannonShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="10" y="46" width="60" height="24" rx="6" fill={color} opacity="0.8"/>
    <rect x="30" y="12" width="20" height="38" rx="6" fill={color} opacity="0.9"/>
    <rect x="30" y="12" width="20" height="9" rx="5" fill="white" opacity="0.25"/>
    <circle cx="40" cy="24" r="7" fill="white" opacity="0.42"/>
    <rect x="10" y="46" width="60" height="8" rx="4" fill="white" opacity="0.2"/>
  </Svg>
)

/** Looping (M-36) */
const LoopShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <circle cx="40" cy="36" r="26" stroke={color} strokeWidth="14" fill="none" opacity="0.85"/>
    <rect x="26" y="56" width="28" height="16" rx="5" fill={color} opacity="0.82"/>
    <rect x="27" y="60" width="26" height="10" fill={color} opacity="0.82"/>
    <line x1="26" y1="56" x2="26" y2="72" stroke="white" strokeWidth="1.5" opacity="0.2"/>
    <line x1="54" y1="56" x2="54" y2="72" stroke="white" strokeWidth="1.5" opacity="0.2"/>
  </Svg>
)

/** Engrenage / roue dentée (B-05, M-34, M-35, M-41, M-43) */
const GearShape = ({ color, s }: { color: string; s?: number }) => {
  const teeth = 8
  const ro = 33, ri = 23
  const pts: string[] = []
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth - Math.PI / 2
    const r = i % 2 === 0 ? ro : ri
    pts.push(`${40 + r * Math.cos(a)},${40 + r * Math.sin(a)}`)
  }
  return (
    <Svg size={s}>
      <polygon points={pts.join(' ')} fill={color} opacity="0.85"/>
      <circle cx="40" cy="40" r="13" fill={color} opacity="0.4"/>
      <circle cx="40" cy="40" r="6" fill="white" opacity="0.35"/>
    </Svg>
  )
}

/** Bille multicolore */
const MarbleShape = ({ s }: { s?: number }) => (
  <Svg size={s}>
    <defs>
      <radialGradient id="mg" cx="38%" cy="32%" r="60%">
        <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="black" stopOpacity="0.3"/>
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="34" fill="#7c3aed" opacity="0.85"/>
    <circle cx="26" cy="30" r="12" fill="#3b82f6" opacity="0.78"/>
    <circle cx="54" cy="26" r="9" fill="#ef4444" opacity="0.78"/>
    <circle cx="52" cy="52" r="8" fill="#22c55e" opacity="0.78"/>
    <circle cx="28" cy="52" r="8" fill="#eab308" opacity="0.78"/>
    <circle cx="40" cy="40" r="34" fill="url(#mg)"/>
    <circle cx="28" cy="22" r="4" fill="white" opacity="0.7"/>
  </Svg>
)

/** Décoration étoile (M-37, M-38, M-39) */
const DecoStar = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <polygon
      points="40,6 47,28 70,28 52,44 59,66 40,51 21,66 28,44 10,28 33,28"
      fill={color} opacity="0.82"
    />
    <polygon
      points="40,18 44,28 56,28 46,36 49,48 40,41 31,48 34,36 24,28 36,28"
      fill="white" opacity="0.22"
    />
  </Svg>
)

/** Pivot / rotateur (M-40) */
const PivotShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <circle cx="40" cy="40" r="26" stroke={color} strokeWidth="10" fill="none" opacity="0.72"/>
    <circle cx="40" cy="40" r="6" fill={color} opacity="0.85"/>
    {/* Arrows */}
    <path d="M 40 14 L 34 24 L 40 20 L 46 24 Z" fill={color} opacity="0.85"/>
    <path d="M 40 66 L 46 56 L 40 60 L 34 56 Z" fill={color} opacity="0.85"/>
  </Svg>
)

/** Tunnel court (M-42) */
const ShortTunnel = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="10" y="34" width="60" height="18" rx="4" fill={color} opacity="0.65"/>
    <path d="M 22 52 L 22 30 A 18 18 0 0 1 58 30 L 58 52 Z" fill={color} opacity="0.85"/>
    <ellipse cx="40" cy="30" rx="14" ry="8" fill="black" opacity="0.28"/>
  </Svg>
)

/** Portail / arche (M-44) */
const ArchShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="8" y="28" width="14" height="46" rx="5" fill={color} opacity="0.85"/>
    <rect x="58" y="28" width="14" height="46" rx="5" fill={color} opacity="0.85"/>
    <path d="M 8 28 A 32 32 0 0 1 72 28" stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85"/>
    <rect x="6" y="68" width="68" height="9" rx="5" fill={color} opacity="0.72"/>
  </Svg>
)

/** Mécanisme générique (M-xx) */
const MechGeneric = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <rect x="12" y="16" width="56" height="48" rx="7" fill={color} opacity="0.75"/>
    <rect x="12" y="16" width="56" height="12" rx="7" fill="white" opacity="0.22"/>
    <circle cx="26" cy="48" r="9" fill="white" opacity="0.28"/>
    <circle cx="54" cy="48" r="9" fill="white" opacity="0.28"/>
    <rect x="20" y="30" width="40" height="7" rx="3" fill="white" opacity="0.22"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="white" opacity="0.15"/>
  </Svg>
)

/** Demi-arc (T-09) */
const HalfArc = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 4 56 A 36 36 0 0 1 76 56" stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.85"/>
    <path d="M 4 56 A 36 36 0 0 1 76 56" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.28"/>
  </Svg>
)

/** Courbe large / glissoire (T-27, T-29) */
const WideCurve = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 4 68 A 72 72 0 0 1 68 4" stroke={color} strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.78"/>
    <path d="M 4 68 A 72 72 0 0 1 68 4" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.28"/>
  </Svg>
)

/** Courbe S (T-11, M-17) */
const SCurve = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 16 70 C 16 50 64 46 64 26 L 64 10" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.85"/>
    <path d="M 16 70 C 16 50 64 46 64 26 L 64 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.28"/>
  </Svg>
)

/** Disque / plateau tournant (T-18, T-20, M-03 flat) */
const DiscShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <circle cx="40" cy="40" r="34" fill={color} opacity="0.78"/>
    <circle cx="40" cy="40" r="20" fill={color} opacity="0.45"/>
    <circle cx="40" cy="40" r="8" fill={color} opacity="0.82"/>
    <circle cx="40" cy="40" r="4" fill="white" opacity="0.4"/>
    <circle cx="40" cy="40" r="34" stroke="white" strokeWidth="2.5" fill="none" opacity="0.2"/>
    {[0, 60, 120, 180, 240, 300].map(a => {
      const rad = (a * Math.PI) / 180
      const x = 40 + 27 * Math.cos(rad), y = 40 + 27 * Math.sin(rad)
      return <circle key={a} cx={x} cy={y} r="3" fill="white" opacity="0.35"/>
    })}
  </Svg>
)

/** Rampe (M-18) */
const RampShape = ({ color, s }: { color: string; s?: number }) => (
  <Svg size={s}>
    <path d="M 4 68 L 76 32 L 76 48 L 4 78 Z" fill={color} opacity="0.82"/>
    <path d="M 4 68 L 76 32 L 76 40 L 4 74 Z" fill="white" opacity="0.2"/>
    <line x1="15" y1="64" x2="65" y2="38" stroke="white" strokeWidth="2" opacity="0.22"/>
  </Svg>
)

/** Barrière transparente (M-15) */
const BarrierShape = ({ s }: { s?: number }) => (
  <Svg size={s}>
    <rect x="12" y="14" width="56" height="52" rx="6" fill="#e2e8f0" opacity="0.4" stroke="#e2e8f0" strokeWidth="2"/>
    <rect x="20" y="20" width="40" height="40" rx="4" fill="#e2e8f0" opacity="0.2"/>
    <line x1="20" y1="20" x2="60" y2="60" stroke="#e2e8f0" strokeWidth="2" opacity="0.4"/>
    <line x1="60" y1="20" x2="20" y2="60" stroke="#e2e8f0" strokeWidth="2" opacity="0.4"/>
    <rect x="30" y="62" width="20" height="10" rx="3" fill="#e2e8f0" opacity="0.6"/>
  </Svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// ── Lookup Map — code → composant SVG ────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

type SvgFC = React.FC<{ size?: number }>

function make(fn: (size?: number) => React.ReactElement): SvgFC {
  return ({ size }: { size?: number }) => fn(size)
}

export const PIECE_SVG_MAP: Record<string, SvgFC> = {
  // ── Bases ──────────────────────────────────────────────────────────────────
  'P-01':   make(s => <GridBase color={C.green}  cols={3} rows={3} s={s}/>),
  'P-02':   make(s => <GridBase color={C.green}  cols={2} rows={2} s={s}/>),

  // ── Blocs supports ─────────────────────────────────────────────────────────
  'B-01':   make(s => <BlockShape color={C.blue}   h={1}   s={s}/>),
  'B-02':   make(s => <BlockShape color={C.blue}   h={2}   s={s}/>),
  'B-03':   make(s => <BlockShape color={C.gray}   h={3.2} s={s}/>),
  'B-04':   make(s => <BlockShape color={C.yellow} h={1.2} s={s}/>),
  'B-05':   make(s => <AngleBlock color={C.gray}          s={s}/>),

  // ── Pistes / Rails ─────────────────────────────────────────────────────────
  'T-01':   make(s => <LauncherShape color={C.yellow} s={s}/>),
  'T-02':   make(s => <StraightRail  color={C.blue}   s={s}/>),
  'T-03':   make(s => <StraightRail  color={C.blue}   s={s}/>),
  'T-04':   make(s => <InclinedRail  color={C.blue}   s={s}/>),
  'T-05':   make(s => <CurvedRail    color={C.green}  s={s}/>),
  'T-06':   make(s => <CurvedRail    color={C.blue}   s={s}/>),
  'T-07':   make(s => <TunnelShape   color={C.blue}   s={s}/>),
  'T-08':   make(s => <StraightRail  color={C.blue}   s={s}/>),
  'T-09':   make(s => <HalfArc       color={C.green}  s={s}/>),
  'T-10':   make(s => <FlipperShape  color={C.orange} s={s}/>),
  'T-11':   make(s => <SCurve        color={C.yellow} s={s}/>),
  'T-12':   make(s => <StraightRail  color={C.orange} s={s}/>),
  'T-14':   make(s => <ConnectorCross color={C.gray}  s={s}/>),
  'T-15':   make(s => <CurvedRail    color={C.orange} s={s}/>),
  'T-16':   make(s => <HalfArc       color={C.green}  s={s}/>),
  'T-17':   make(s => <SpiralShape   color={C.purple} s={s}/>),
  'T-18':   make(s => <DiscShape     color={C.green}  s={s}/>),
  'T-19':   make(s => <WideCurve     color={C.yellow} s={s}/>),
  'T-20':   make(s => <DiscShape     color={C.green}  s={s}/>),
  'T-23':   make(s => <CrossingShape color={C.blue}   s={s}/>),
  'T-24':   make(s => <TrainTrack    color={C.gray}   curved={false} s={s}/>),
  'T-25':   make(s => <TrainTrack    color={C.gray}   curved={true}  s={s}/>),
  'T-26':   make(s => <LauncherShape color={C.yellow} s={s}/>),
  'T-27':   make(s => <FunnelShape   color={C.red}    s={s}/>),
  'T-29':   make(s => <WideCurve     color={C.yellow} s={s}/>),

  // ── Mécanismes (set utilisateur) ────────────────────────────────────────────
  'M-03':   make(s => <ElevatorShape color={C.cyan}   s={s}/>),
  'M-04':   make(s => <TrainCarShape color={C.red}    s={s}/>),
  'M-07':   make(s => <CannonShape   color={C.orange} s={s}/>),
  'M-34':   make(s => <GearShape     color={C.yellow} s={s}/>),
  'M-35':   make(s => <GearShape     color={C.yellow} s={s}/>),
  'M-36':   make(s => <LoopShape     color={C.purple} s={s}/>),
  'M-37':   make(s => <DecoStar      color={C.yellow} s={s}/>),
  'M-38':   make(s => <DecoStar      color={C.orange} s={s}/>),
  'M-39':   make(s => <DecoStar      color={C.mixed}  s={s}/>),
  'M-40':   make(s => <PivotShape    color={C.blue}   s={s}/>),
  'M-41':   make(s => <GearShape     color={C.green}  s={s}/>),
  'M-42':   make(s => <ShortTunnel   color={C.blue}   s={s}/>),
  'M-43':   make(s => <GearShape     color={C.orange} s={s}/>),
  'M-44':   make(s => <ArchShape     color={C.white}  s={s}/>),

  // ── Mécanismes (catalogue de référence) ────────────────────────────────────
  'M-01':   make(s => <LauncherShape color={C.yellow} s={s}/>),
  'M-02':   make(s => <MechGeneric   color={C.blue}   s={s}/>),
  'M-05':   make(s => <GearShape     color={C.green}  s={s}/>),
  'M-06':   make(s => <MechGeneric   color={C.yellow} s={s}/>),
  'M-08':   make(s => <MechGeneric   color={C.green}  s={s}/>),
  'M-09':   make(s => <DiscShape     color={C.blue}   s={s}/>),
  'M-14':   make(s => <FlipperShape  color={C.green}  s={s}/>),
  'M-15':   make(s => <BarrierShape                   s={s}/>),
  'M-16':   make(s => <CurvedRail    color={C.red}    s={s}/>),
  'M-17':   make(s => <SCurve        color={C.yellow} s={s}/>),
  'M-18':   make(s => <RampShape     color={C.green}  s={s}/>),

  // ── Bille ──────────────────────────────────────────────────────────────────
  'MARBLE': make(s => <MarbleShape s={s}/>),
}

/**
 * Renvoie le composant SVG pour un code pièce, ou null si non trouvé.
 * Usage: const Cmp = getPieceSVG('T-04'); if (Cmp) return <Cmp size={48} />
 */
export function getPieceSVG(code: string): SvgFC | null {
  return PIECE_SVG_MAP[code] ?? null
}
