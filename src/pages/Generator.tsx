import { useState, useMemo } from 'react'
import { Sliders, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../store/useStore'
import type {
  CircuitPlan, BuildStep, GeneratorConstraints, Difficulty,
  CircuitSize, CircuitPriority, MarblePiece, ValidationResult,
} from '../types'
import { generateId } from '../utils/storage'
import StepByStepViewer from '../components/StepByStepViewer'
import ValidationPanel from '../components/ValidationPanel'

// ─── Labels UI ────────────────────────────────────────────────────────────────

const DIFF_LABELS: Record<Difficulty, string> = { easy: '🟢 Facile', medium: '🟡 Moyen', hard: '🔴 Difficile' }
const PRIORITY_LABELS: Record<CircuitPriority, string> = {
  fun: '🎉 Fun', speed: '⚡ Vitesse', spiral: '🌀 Spirale',
  train: '🚂 Train', elevator: '⬆️ Ascenseur', stability: '🏗️ Stabilité',
}

// ─── Logique de génération ────────────────────────────────────────────────────

interface PieceRef { code: string; qty: number }
interface StepTemplate {
  title: string; description: string; tips?: string; marbleTest?: boolean; pieces: PieceRef[]
  gridX?: number; gridY?: number; gridZ?: number
}

interface PlanTemplate {
  id: 'A' | 'B' | 'C'
  name: string; difficulty: Difficulty; size: CircuitSize
  estimatedTime: number; tags: CircuitPriority[]; description: string; stabilityRating: number
  stepTemplates: StepTemplate[]
}

const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'A',
    name: 'A. Mini circuit fiable',
    difficulty: 'easy', size: 'small', estimatedTime: 15,
    tags: ['fun', 'stability'],
    description: 'Circuit simple et stable, idéal pour débuter ou pour les plus jeunes. Descente directe avec un virage.',
    stabilityRating: 5,
    stepTemplates: [
      { title: 'Base de départ', description: 'Placer 4 petites bases P-02 en carré 2×2 sur la table.', tips: 'Surface plane indispensable — vérifier avant de continuer.', pieces: [{ code: 'P-02', qty: 4 }], gridX: 3, gridY: 3, gridZ: 0 },
      { title: 'Tour de départ (4× B-01)', description: 'Empiler 4 blocs courts B-01 au centre de la base.', tips: 'Vérifier la verticalité à chaque bloc.', pieces: [{ code: 'B-01', qty: 4 }], gridX: 3, gridY: 3, gridZ: 1 },
      { title: 'Stabilisation (2× B-03)', description: 'Placer 2 blocs longs B-03 de chaque côté de la tour comme contreforts.', pieces: [{ code: 'B-03', qty: 2 }], gridX: 2, gridY: 3, gridZ: 1 },
      { title: 'Lanceur T-01', description: 'Fixer le lanceur T-01 au sommet de la tour.', tips: 'Tester l\'angle de sortie avant de continuer.', marbleTest: true, pieces: [{ code: 'T-01', qty: 1 }], gridX: 3, gridY: 3, gridZ: 5 },
      { title: '1ère descente (2× T-04)', description: 'Enchaîner 2 rails inclinés T-04 vers l\'avant. Chaque rail descend d\'un niveau.', pieces: [{ code: 'T-04', qty: 2 }], gridX: 3, gridY: 4, gridZ: 4 },
      { title: 'Virage T-06', description: 'Ajouter un virage T-06 à 90° vers la droite.', pieces: [{ code: 'T-06', qty: 1 }], gridX: 3, gridY: 6, gridZ: 2 },
      { title: '2ème descente (2× T-08)', description: 'Enchaîner 2 rails plats T-08 après le virage.', pieces: [{ code: 'T-08', qty: 2 }], gridX: 4, gridY: 6, gridZ: 1 },
      { title: 'Arrivée T-27', description: 'Placer la pièce d\'arrivée T-27 à la fin. Le bac récupère les billes.', tips: 'Lancer 3 billes d\'affilée pour valider.', marbleTest: true, pieces: [{ code: 'T-27', qty: 1 }], gridX: 6, gridY: 6, gridZ: 0 },
    ],
  },
  {
    id: 'B',
    name: 'B. Circuit 2 pistes',
    difficulty: 'medium', size: 'medium', estimatedTime: 30,
    tags: ['fun', 'speed'],
    description: 'Circuit à 2 branches avec aiguillage flipper. Les billes alternent entre la piste de gauche et la piste de droite.',
    stabilityRating: 4,
    stepTemplates: [
      { title: 'Grande base (6× P-02)', description: 'Poser 6 petites bases P-02 en rectangle 3×2.', pieces: [{ code: 'P-02', qty: 6 }], gridX: 3, gridY: 3, gridZ: 0 },
      { title: 'Tour centrale (6× B-01 + 2× B-03)', description: 'Empiler 6 blocs courts B-01 + 2 blocs longs B-03 pour la tour principale.', tips: 'Alterner les B-01 et B-03 pour plus de stabilité.', pieces: [{ code: 'B-01', qty: 6 }, { code: 'B-03', qty: 2 }], gridX: 3, gridY: 3, gridZ: 1 },
      { title: 'Lanceur T-01', description: 'Fixer T-01 au sommet de la tour.', marbleTest: true, pieces: [{ code: 'T-01', qty: 1 }], gridX: 3, gridY: 3, gridZ: 9 },
      { title: '1ère descente (3× T-04)', description: 'Enchaîner 3 rails inclinés T-04 depuis le lanceur.', pieces: [{ code: 'T-04', qty: 3 }], gridX: 3, gridY: 4, gridZ: 8 },
      { title: 'Aiguillage flipper T-10', description: 'Installer le flipper T-10 au bas de la descente. Il alternera automatiquement gauche/droite.', tips: 'Le flipper doit être à niveau — vérifier avec un rail à plat.', pieces: [{ code: 'T-10', qty: 1 }], gridX: 3, gridY: 7, gridZ: 5 },
      { title: 'Branche gauche (T-06 + 2× T-04 + T-08)', description: 'Branche gauche : virage T-06 + 2 rails inclinés T-04 + 1 rail plat T-08.', pieces: [{ code: 'T-06', qty: 1 }, { code: 'T-04', qty: 1 }, { code: 'T-08', qty: 1 }], gridX: 1, gridY: 7, gridZ: 4, marbleTest: true },
      { title: 'Branche droite (2× T-02 + T-08)', description: 'Branche droite : 2 rails droits courts T-02 + 1 rail plat T-08.', pieces: [{ code: 'T-02', qty: 2 }, { code: 'T-08', qty: 1 }], gridX: 5, gridY: 7, gridZ: 4 },
      { title: 'Tunnel T-07 (optionnel)', description: 'Ajouter un tunnel T-07 sur la branche droite pour plus de spectacle.', pieces: [{ code: 'T-07', qty: 1 }], gridX: 6, gridY: 7, gridZ: 2 },
      { title: 'Arrivée commune T-27', description: 'Les deux branches rejoignent l\'arrivée T-27. Ajuster les angles pour centrer.', tips: 'Lancer 5 billes d\'affilée — elles doivent alterner G/D.', marbleTest: true, pieces: [{ code: 'T-27', qty: 1 }], gridX: 3, gridY: 9, gridZ: 0 },
    ],
  },
  {
    id: 'C',
    name: 'C. Grand circuit Ascenseur + Train',
    difficulty: 'hard', size: 'large', estimatedTime: 60,
    tags: ['elevator', 'train', 'spiral', 'fun'],
    description: 'Circuit complet avec ascenseur motorisé M-03, section train T-24, spirale T-17 et flipper. Circuit en boucle automatique.',
    stabilityRating: 3,
    stepTemplates: [
      { title: 'Grande base P-01 + socles P-02', description: 'Poser 1 grande base P-01 au centre + 6 petites P-02 autour pour agrandir la surface.', pieces: [{ code: 'P-01', qty: 1 }, { code: 'P-02', qty: 6 }], gridX: 4, gridY: 4, gridZ: 0 },
      { title: 'Tour ascenseur (6× B-03 + 4× B-02)', description: 'Empiler 6 blocs longs B-03 + 4 blocs moyens B-02 pour la colonne de l\'ascenseur. Zone droite de la base.', tips: 'C\'est la colonne la plus haute — vérifier la verticalité à mi-hauteur.', pieces: [{ code: 'B-03', qty: 6 }, { code: 'B-02', qty: 4 }], gridX: 7, gridY: 4, gridZ: 1 },
      { title: 'Module ascenseur M-03', description: 'Clipser le module ascenseur M-03 sur la colonne. Insérer les piles maintenant (avant de fermer).', tips: 'La nacelle doit monter librement. Tester sans bille d\'abord.', marbleTest: false, pieces: [{ code: 'M-03', qty: 1 }], gridX: 7, gridY: 4, gridZ: 2 },
      { title: 'Tour de départ (8× B-01 + 4× B-05)', description: 'Construire la tour de départ centrale avec 8 B-01 + 4 blocs d\'angle B-05 pour la stabilité.', pieces: [{ code: 'B-01', qty: 8 }, { code: 'B-05', qty: 4 }], gridX: 4, gridY: 4, gridZ: 1 },
      { title: 'Lanceur T-01 au sommet', description: 'Fixer T-01 au sommet de la tour de départ.', tips: 'Régler l\'angle pour que la bille parte vers la spirale.', marbleTest: true, pieces: [{ code: 'T-01', qty: 1 }], gridX: 4, gridY: 4, gridZ: 9 },
      { title: 'Descente vers spirale (3× T-04)', description: '3 rails inclinés T-04 mènent vers la spirale T-17.', pieces: [{ code: 'T-04', qty: 3 }], gridX: 4, gridY: 5, gridZ: 8 },
      { title: 'Spirale T-17', description: 'Fixer la spirale T-17 sur ses supports. La bille doit descendre en 4 tours.', tips: 'Spirale parfaitement verticale — ajuster si la bille ralentit.', marbleTest: true, pieces: [{ code: 'T-17', qty: 1 }], gridX: 3, gridY: 6, gridZ: 3 },
      { title: 'Aiguillage flipper T-10', description: 'Après la spirale, le flipper T-10 répartit les billes sur 2 branches.', pieces: [{ code: 'T-10', qty: 1 }], gridX: 3, gridY: 8, gridZ: 1 },
      { title: 'Section train (T-26 + 3× T-24 + T-25)', description: 'Branche 1 : station T-26 + 3 rails droits T-24 + 1 courbe T-25. Poser le wagon M-04.', tips: 'Bien aligner tous les rails — le wagon doit glisser seul.', marbleTest: true, pieces: [{ code: 'T-26', qty: 1 }, { code: 'T-24', qty: 3 }, { code: 'T-25', qty: 1 }, { code: 'M-04', qty: 1 }], gridX: 0, gridY: 8, gridZ: 0 },
      { title: 'Branche 2 classique (T-06 + 2× T-08)', description: 'Branche 2 : virage T-06 + 2 rails plats T-08 + jonctions T-14.', pieces: [{ code: 'T-06', qty: 2 }, { code: 'T-08', qty: 2 }, { code: 'T-14', qty: 2 }], gridX: 5, gridY: 8, gridZ: 0 },
      { title: 'Retour vers ascenseur (T-02 + T-06)', description: 'Les deux branches rejoignent un rail T-02 qui ramène les billes à l\'entrée de l\'ascenseur M-03.', tips: 'La bille doit entrer dans la nacelle de l\'ascenseur sans forcer.', pieces: [{ code: 'T-02', qty: 2 }, { code: 'T-06', qty: 1 }], gridX: 6, gridY: 9, gridZ: 0, marbleTest: true },
      { title: 'Arrivée T-27 (sécurité)', description: 'Placer T-27 comme arrivée de secours si une bille rate l\'ascenseur.', pieces: [{ code: 'T-27', qty: 1 }], gridX: 4, gridY: 10, gridZ: 0, marbleTest: true, tips: 'Circuit en boucle prêt ! Mettre 5 billes en même temps pour le show.' },
    ],
  },
]

// ─── Résolution des pièces depuis l'inventaire ────────────────────────────────

function buildPieceMap(sets: ReturnType<typeof useStore>['state']['sets'], selectedSetIds: string[]) {
  const map = new Map<string, MarblePiece & { available: number }>()
  for (const set of sets) {
    if (!set.owned || !set.active || !selectedSetIds.includes(set.id)) continue
    for (const p of set.pieces) {
      const existing = map.get(p.code)
      if (existing) {
        existing.available += p.quantity
      } else {
        map.set(p.code, { ...p, available: p.quantity })
      }
    }
  }
  return map
}

function resolveTemplate(
  tpl: PlanTemplate,
  pieceMap: Map<string, MarblePiece & { available: number }>,
): CircuitPlan {
  const steps: BuildStep[] = []
  const used = new Map<string, number>() // code → qty used
  let missingCodes: string[] = []

  for (const st of tpl.stepTemplates) {
    const resolvedPieces = st.pieces.map((ref) => {
      const found = pieceMap.get(ref.code)
      const alreadyUsed = used.get(ref.code) ?? 0
      const available = (found?.available ?? 0) - alreadyUsed
      const actualQty = Math.min(ref.qty, Math.max(0, available))
      if (actualQty < ref.qty) missingCodes.push(`${ref.code} (besoin: ${ref.qty}, dispo: ${available})`)
      used.set(ref.code, alreadyUsed + actualQty)
      return {
        pieceId: found?.id ?? ref.code,
        pieceName: found ? `${found.code} — ${found.name}` : `${ref.code} (non trouvé)`,
        pieceCode: ref.code,
        quantity: ref.qty,
        color: found?.color ?? 'gray',
        emoji: found?.emoji ?? '🔷',
      }
    })

    steps.push({
      stepNumber: steps.length + 1,
      title: st.title,
      description: st.description,
      tips: st.tips,
      marbleTest: st.marbleTest,
      pieces: resolvedPieces,
      gridPositions: st.gridX !== undefined ? [{
        x: st.gridX, y: st.gridY!, z: st.gridZ!,
        pieceId: resolvedPieces[0]?.pieceId ?? '',
        color: resolvedPieces[0]?.color,
        emoji: resolvedPieces[0]?.emoji,
      }] : [],
    })
  }

  // Pièces utilisées / restantes
  const usedPiecesSummary: { code: string; used: number; total: number }[] = []
  for (const [code, usedQty] of used.entries()) {
    const total = pieceMap.get(code)?.available ?? 0
    usedPiecesSummary.push({ code, used: usedQty, total })
  }

  // Validation
  const hasMissing = missingCodes.length > 0
  const hasArrival = tpl.stepTemplates.some((s) => s.pieces.some((p) => p.code === 'T-27'))
  const totalBlocks = (used.get('B-01') ?? 0) + (used.get('B-02') ?? 0) + (used.get('B-03') ?? 0)
  const totalRails = Array.from(used.entries())
    .filter(([c]) => ['T-02', 'T-03', 'T-04', 'T-08'].includes(c))
    .reduce((n, [, v]) => n + v, 0)
  const lowSupport = totalRails > totalBlocks * 3

  const validation: ValidationResult = {
    isValid: !hasMissing && hasArrival,
    score: hasMissing ? 40 : !hasArrival ? 55 : lowSupport ? 72 : 85 + tpl.stabilityRating * 3,
    issues: [
      ...(!hasArrival ? [{ type: 'no-arrival' as const, description: 'Aucune pièce d\'arrivée T-27 dans ce plan.' }] : []),
      ...(hasMissing ? [{ type: 'missing-pieces' as const, description: `Pièces insuffisantes : ${[...new Set(missingCodes)].join(' | ')}` }] : []),
    ],
    warnings: [
      ...(lowSupport ? [{ type: 'stability' as const, description: `Beaucoup de rails (${totalRails}) pour peu de blocs (${totalBlocks}) — risque d\'instabilité.` }] : []),
    ],
  }

  return {
    id: generateId(),
    name: tpl.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficulty: tpl.difficulty,
    size: tpl.size,
    maxHeight: tpl.id === 'C' ? 12 : tpl.id === 'B' ? 8 : 5,
    estimatedTime: tpl.estimatedTime,
    steps,
    gridData: [],
    tags: tpl.tags,
    isFavorite: false,
    usedSetIds: [],
    validationResult: validation,
    notes: tpl.description,
  }
}

// ─── Composant PlanCard ───────────────────────────────────────────────────────

function PlanCard({
  plan, onView, onSave, saved,
}: {
  plan: CircuitPlan
  onView: () => void
  onSave: () => void
  saved: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const score = plan.validationResult?.score ?? 0
  const scoreColor = score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444'

  return (
    <div className="card p-4 animate-slide-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ background: scoreColor }}>{score}</div>
        <div className="flex-1">
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{plan.notes}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{DIFF_LABELS[plan.difficulty]}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {plan.steps.length} étapes · ~{plan.estimatedTime} min
            </span>
          </div>
        </div>
      </div>

      {plan.validationResult && (
        <div className="mb-3">
          <ValidationPanel result={plan.validationResult} />
        </div>
      )}

      {/* Pièces clés utilisées */}
      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs w-full mb-3" style={{ color: 'var(--text-secondary)' }}>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? 'Masquer' : 'Voir'} les pièces utilisées ({plan.steps.flatMap(s => s.pieces).reduce((n, p) => n + p.quantity, 0)} pièces)
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {plan.steps.flatMap(s => s.pieces).map((p, i) => (
            <span key={i} className={`text-xs px-2 py-1 rounded-lg text-white piece-${p.color}`}>
              {p.emoji} {p.pieceName.split('—')[0]?.trim()} ×{p.quantity}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onView}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--accent)' }}>
          👁️ Voir les étapes
        </button>
        {!saved ? (
          <button onClick={onSave}
            className="flex-1 py-3 rounded-xl text-sm font-bold"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            💾 Sauvegarder
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm text-emerald-400"
            style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 size={15} /> Sauvegardé
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function Generator() {
  const { state, dispatch } = useStore()
  const [step, setStep] = useState<'config' | 'results'>('config')
  const [viewingPlan, setViewingPlan] = useState<CircuitPlan | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const activeSets = state.sets.filter((s) => s.owned && s.active)

  const [constraints, setConstraints] = useState<GeneratorConstraints>({
    difficulty: 'easy',
    size: 'small',
    maxHeight: 8,
    maxTime: 30,
    priorities: ['fun'],
    childAge: state.settings.defaultChildAge,
    selectedSetIds: activeSets.map((s) => s.id),
  })

  const plans = useMemo<CircuitPlan[]>(() => {
    if (step !== 'results') return []
    const pieceMap = buildPieceMap(state.sets, constraints.selectedSetIds)
    return PLAN_TEMPLATES.map((tpl) => resolveTemplate(tpl, pieceMap))
  }, [step, state.sets, constraints.selectedSetIds])

  function togglePriority(p: CircuitPriority) {
    setConstraints((c) => ({
      ...c,
      priorities: c.priorities.includes(p) ? c.priorities.filter((x) => x !== p) : [...c.priorities, p],
    }))
  }

  function handleSave(plan: CircuitPlan) {
    dispatch({ type: 'ADD_PLAN', plan })
    setSavedIds((s) => new Set([...s, plan.id]))
  }

  // ── Vue étapes d'un plan ──────────────────────────────────────────────────

  if (viewingPlan) {
    return (
      <div className="flex flex-col gap-4 pb-6 px-4">
        <button onClick={() => setViewingPlan(null)} className="text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          ← Retour aux 3 plans
        </button>
        <StepByStepViewer steps={viewingPlan.steps} planName={viewingPlan.name} />
      </div>
    )
  }

  // ── 3 plans générés ───────────────────────────────────────────────────────

  if (step === 'results') {
    return (
      <div className="flex flex-col gap-4 pb-6 px-4">
        <div className="flex items-center justify-between pt-5">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>3 circuits proposés ⚡</h1>
          <button onClick={() => { setStep('config'); setSavedIds(new Set()) }}
            className="text-sm px-3 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            ← Reconfigurer
          </button>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Basé sur {constraints.selectedSetIds.length} set(s) sélectionné(s).
        </p>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onView={() => setViewingPlan(plan)}
            onSave={() => handleSave(plan)}
            saved={savedIds.has(plan.id)}
          />
        ))}
      </div>
    )
  }

  // ── Formulaire de configuration ───────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5 pb-6 px-4">
      <div className="pt-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Générateur ⚡</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Configurez vos préférences — 3 plans seront proposés.
        </p>
      </div>

      {/* Priorités */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
          Priorités (plusieurs possibles)
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRIORITY_LABELS) as CircuitPriority[]).map((p) => (
            <button key={p} onClick={() => togglePriority(p)}
              className="px-3 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: constraints.priorities.includes(p) ? 'var(--accent)' : 'var(--bg-secondary)',
                color: constraints.priorities.includes(p) ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}>
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Âge */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
          Âge de l'enfant (optionnel)
        </label>
        <div className="flex gap-2 flex-wrap">
          {[undefined, 4, 5, 6, 7, 8, 10].map((age) => (
            <button key={age ?? 'none'} onClick={() => setConstraints((c) => ({ ...c, childAge: age }))}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: constraints.childAge === age ? 'var(--accent2)' : 'var(--bg-secondary)',
                color: constraints.childAge === age ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}>
              {age ? `${age} ans` : 'Tous âges'}
            </button>
          ))}
        </div>
      </div>

      {/* Sets */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--text-secondary)' }}>
          Sets à utiliser ({constraints.selectedSetIds.length}/{activeSets.length})
        </label>
        {activeSets.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Aucun set actif — activez des sets dans «&nbsp;Mes Sets&nbsp;».</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeSets.map((s) => (
              <button key={s.id}
                onClick={() => setConstraints((c) => ({
                  ...c,
                  selectedSetIds: c.selectedSetIds.includes(s.id)
                    ? c.selectedSetIds.filter((x) => x !== s.id)
                    : [...c.selectedSetIds, s.id],
                }))}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                style={{
                  background: constraints.selectedSetIds.includes(s.id) ? 'rgba(124,58,237,0.2)' : 'var(--bg-secondary)',
                  border: `1px solid ${constraints.selectedSetIds.includes(s.id) ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                <span className="text-xl">{s.coverEmoji ?? '📦'}</span>
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                {constraints.selectedSetIds.includes(s.id) && <CheckCircle2 size={16} className="text-violet-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setStep('results')}
        disabled={constraints.selectedSetIds.length === 0}
        className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
        <Sliders size={22} /> Générer les 3 plans !
      </button>
    </div>
  )
}
