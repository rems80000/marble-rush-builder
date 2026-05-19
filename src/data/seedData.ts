import type { MarbleSet, ModuleTemplate } from '../types'

// ─── Vrai set – inventaire photo 2026-05-13 ───────────────────────────────────

export const REAL_MARBLE_SET: MarbleSet = {
  id: 'set-real-train-elevator-2026',
  name: 'Marble Rush Train / Elevator Set',
  reference: 'inventaire photo 2026-05-13',
  year: 2022,
  owned: true,
  active: true,
  coverEmoji: '🚂',
  ageMin: 5,
  ageMax: 12,
  notes: 'Set principal — inventaire compté le 2026-05-13 sur photos',
  pieces: [
    // ── P : Bases ───────────────────────────────────────────────────────────
    { id: 'real-P-01', setId: 'set-real-train-elevator-2026', name: 'Grande base plate', code: 'P-01', type: 'base', color: 'green', quantity: 2, emoji: '🟩', dimensions: { width: 6, height: 1, depth: 6 }, function: 'Grande plaque de départ pour circuits larges', connectors: ['top'], imageSource: 'missing' as const },
    { id: 'real-P-02', setId: 'set-real-train-elevator-2026', name: 'Petite base support', code: 'P-02', type: 'base', color: 'green', quantity: 17, emoji: '🟩', dimensions: { width: 2, height: 1, depth: 2 }, function: 'Petite plaque support / jonction de sol', connectors: ['top'], imageSource: 'missing' as const },

    // ── B : Blocs supports ──────────────────────────────────────────────────
    { id: 'real-B-01', setId: 'set-real-train-elevator-2026', name: 'Bloc court', code: 'B-01', type: 'block', color: 'blue', quantity: 31, emoji: '🔵', dimensions: { width: 1, height: 1, depth: 1 }, function: 'Bloc de support de hauteur 1 unité', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-B-02', setId: 'set-real-train-elevator-2026', name: 'Bloc moyen', code: 'B-02', type: 'block', color: 'blue', quantity: 11, emoji: '🔵', dimensions: { width: 1, height: 2, depth: 1 }, function: 'Bloc de support de hauteur 2 unités', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-B-03', setId: 'set-real-train-elevator-2026', name: 'Bloc long', code: 'B-03', type: 'block', color: 'gray', quantity: 23, emoji: '⬜', dimensions: { width: 1, height: 3, depth: 1 }, function: 'Bloc de support de hauteur 3 unités', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-B-05', setId: 'set-real-train-elevator-2026', name: 'Bloc spécial angle', code: 'B-05', type: 'block', color: 'gray', quantity: 6, emoji: '🔲', dimensions: { width: 1, height: 1, depth: 2 }, function: 'Bloc d\'angle pour stabiliser les virages', connectors: ['top', 'bottom', 'front'], imageSource: 'missing' as const },

    // ── T : Pistes / Rails ──────────────────────────────────────────────────
    { id: 'real-T-01', setId: 'set-real-train-elevator-2026', name: 'Pièce de départ', code: 'T-01', type: 'launcher', color: 'yellow', quantity: 1, emoji: '🚀', dimensions: { width: 1, height: 2, depth: 1 }, function: 'Lance la bille en tête de circuit', connectors: ['bottom', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-02', setId: 'set-real-train-elevator-2026', name: 'Rail droit court', code: 'T-02', type: 'rail-straight', color: 'blue', quantity: 4, emoji: '➖', dimensions: { width: 1, height: 0.5, depth: 1 }, function: 'Rail plat court — connexion entre modules', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-03', setId: 'set-real-train-elevator-2026', name: 'Rail droit long', code: 'T-03', type: 'rail-straight', color: 'blue', quantity: 1, emoji: '➖', dimensions: { width: 1, height: 0.5, depth: 3 }, function: 'Rail plat long', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-04', setId: 'set-real-train-elevator-2026', name: 'Rail incliné', code: 'T-04', type: 'rail-straight', color: 'blue', quantity: 5, emoji: '📐', dimensions: { width: 1, height: 1, depth: 2 }, function: 'Rail en pente pour faire descendre la bille', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-06', setId: 'set-real-train-elevator-2026', name: 'Virage 90°', code: 'T-06', type: 'rail-curved', color: 'blue', quantity: 4, emoji: '↪️', dimensions: { width: 2, height: 0.5, depth: 2 }, function: 'Change la direction de 90°', connectors: ['front', 'right'], imageSource: 'missing' as const },
    { id: 'real-T-07', setId: 'set-real-train-elevator-2026', name: 'Tunnel / entonnoir', code: 'T-07', type: 'funnel', color: 'blue', quantity: 2, emoji: '🕳️', dimensions: { width: 1, height: 1, depth: 2 }, function: 'Guide la bille dans un tunnel', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-08', setId: 'set-real-train-elevator-2026', name: 'Rail plat long', code: 'T-08', type: 'rail-straight', color: 'blue', quantity: 5, emoji: '➖', dimensions: { width: 1, height: 0.5, depth: 2 }, function: 'Rail plat — section horizontale', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-10', setId: 'set-real-train-elevator-2026', name: 'Flipper / aiguillage', code: 'T-10', type: 'flipper', color: 'orange', quantity: 1, emoji: '🔀', dimensions: { width: 2, height: 1, depth: 1 }, function: 'Envoie les billes alternativement à gauche ou à droite', connectors: ['back', 'left', 'right'], imageSource: 'missing' as const },
    { id: 'real-T-14', setId: 'set-real-train-elevator-2026', name: 'Jonction / connecteur', code: 'T-14', type: 'connector', color: 'gray', quantity: 3, emoji: '🔗', dimensions: { width: 1, height: 0.5, depth: 1 }, function: 'Connecte deux sections de rail', connectors: ['front', 'back', 'left', 'right'], imageSource: 'missing' as const },
    { id: 'real-T-17', setId: 'set-real-train-elevator-2026', name: 'Spirale', code: 'T-17', type: 'spiral', color: 'purple', quantity: 2, emoji: '🌀', dimensions: { width: 2, height: 4, depth: 2 }, function: 'Fait descendre la bille en spirale — effet spectaculaire', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-T-23', setId: 'set-real-train-elevator-2026', name: 'Croisement de pistes', code: 'T-23', type: 'special', color: 'blue', quantity: 1, emoji: '✚', dimensions: { width: 2, height: 0.5, depth: 2 }, function: 'Croisement de deux pistes — les billes se croisent', connectors: ['front', 'back', 'left', 'right'], imageSource: 'missing' as const },
    { id: 'real-T-24', setId: 'set-real-train-elevator-2026', name: 'Rail de train droit', code: 'T-24', type: 'train-track', color: 'gray', quantity: 4, emoji: '🛤️', dimensions: { width: 1, height: 0.5, depth: 3 }, function: 'Rail pour le wagon train — section droite', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-T-25', setId: 'set-real-train-elevator-2026', name: 'Rail de train courbe', code: 'T-25', type: 'train-track', color: 'gray', quantity: 2, emoji: '↪️', dimensions: { width: 3, height: 0.5, depth: 3 }, function: 'Rail courbe pour wagon train', connectors: ['front', 'right'], imageSource: 'missing' as const },
    { id: 'real-T-26', setId: 'set-real-train-elevator-2026', name: 'Station départ train', code: 'T-26', type: 'launcher', color: 'yellow', quantity: 1, emoji: '🚉', dimensions: { width: 2, height: 1, depth: 2 }, function: 'Lance le wagon train sur les rails', connectors: ['back'], imageSource: 'missing' as const },
    { id: 'real-T-27', setId: 'set-real-train-elevator-2026', name: 'Arrivée finale', code: 'T-27', type: 'funnel', color: 'red', quantity: 1, emoji: '🏁', dimensions: { width: 2, height: 1, depth: 2 }, function: 'Zone d\'arrivée — collecte les billes en fin de circuit', connectors: ['front'], imageSource: 'missing' as const },

    // ── M : Modules spéciaux / mécanismes ───────────────────────────────────
    { id: 'real-M-03', setId: 'set-real-train-elevator-2026', name: 'Ascenseur motorisé', code: 'M-03', type: 'elevator', color: 'cyan', quantity: 1, emoji: '⬆️', dimensions: { width: 2, height: 6, depth: 2 }, function: 'Remonte automatiquement les billes au sommet (piles nécessaires)', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-M-04', setId: 'set-real-train-elevator-2026', name: 'Wagon train', code: 'M-04', type: 'train-car', color: 'red', quantity: 2, emoji: '🚃', dimensions: { width: 1, height: 1, depth: 3 }, function: 'Transporte les billes sur les rails de train', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-M-07', setId: 'set-real-train-elevator-2026', name: 'Canon propulseur', code: 'M-07', type: 'cannon', color: 'orange', quantity: 1, emoji: '💥', dimensions: { width: 1, height: 2, depth: 3 }, function: 'Propulse la bille vers le haut ou en avant', connectors: ['back', 'top'], imageSource: 'missing' as const },
    { id: 'real-M-34', setId: 'set-real-train-elevator-2026', name: 'Module M-34', code: 'M-34', type: 'special', color: 'yellow', quantity: 1, emoji: '⚙️', function: 'Module spécial — voir notice', imageSource: 'missing' as const },
    { id: 'real-M-35', setId: 'set-real-train-elevator-2026', name: 'Module M-35', code: 'M-35', type: 'special', color: 'yellow', quantity: 1, emoji: '⚙️', function: 'Module spécial — voir notice', imageSource: 'missing' as const },
    { id: 'real-M-36', setId: 'set-real-train-elevator-2026', name: 'Module looping', code: 'M-36', type: 'special', color: 'purple', quantity: 1, emoji: '🔄', function: 'Looping / boucle verticale pour la bille', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-M-37', setId: 'set-real-train-elevator-2026', name: 'Décoration A', code: 'M-37', type: 'decoration', color: 'mixed', quantity: 1, emoji: '🌟', function: 'Élément décoratif — panneau ou figurine', imageSource: 'missing' as const },
    { id: 'real-M-38', setId: 'set-real-train-elevator-2026', name: 'Décoration B', code: 'M-38', type: 'decoration', color: 'mixed', quantity: 1, emoji: '⭐', function: 'Élément décoratif — panneau ou figurine', imageSource: 'missing' as const },
    { id: 'real-M-39', setId: 'set-real-train-elevator-2026', name: 'Décoration C', code: 'M-39', type: 'decoration', color: 'mixed', quantity: 1, emoji: '✨', function: 'Élément décoratif — panneau ou figurine', imageSource: 'missing' as const },
    { id: 'real-M-40', setId: 'set-real-train-elevator-2026', name: 'Module pivot M-40/M-45', code: 'M-40', type: 'special', color: 'blue', quantity: 1, emoji: '🔀', function: 'Module pivotant — modifie la trajectoire de la bille', imageSource: 'missing' as const },
    { id: 'real-M-41', setId: 'set-real-train-elevator-2026', name: 'Module M-41', code: 'M-41', type: 'special', color: 'green', quantity: 1, emoji: '⚙️', function: 'Module spécial — voir notice', imageSource: 'missing' as const },
    { id: 'real-M-42', setId: 'set-real-train-elevator-2026', name: 'Tunnel court', code: 'M-42', type: 'funnel', color: 'blue', quantity: 1, emoji: '🕳️', function: 'Tunnel court — la bille disparaît et réapparaît', connectors: ['front', 'back'], imageSource: 'missing' as const },
    { id: 'real-M-43', setId: 'set-real-train-elevator-2026', name: 'Module M-43', code: 'M-43', type: 'special', color: 'orange', quantity: 1, emoji: '⚙️', function: 'Module spécial — voir notice', imageSource: 'missing' as const },
    { id: 'real-M-44', setId: 'set-real-train-elevator-2026', name: 'Module portail', code: 'M-44', type: 'decoration', color: 'white', quantity: 1, emoji: '🚪', function: 'Portail décoratif / arche d\'entrée du circuit', imageSource: 'missing' as const },

    // ── Billes ──────────────────────────────────────────────────────────────
    { id: 'real-MRB', setId: 'set-real-train-elevator-2026', name: 'Bille', code: 'MARBLE', type: 'marble', color: 'mixed', quantity: 10, emoji: '⚪', dimensions: { width: 0.3, height: 0.3, depth: 0.3 }, function: 'Bille de jeu standard', imageSource: 'missing' as const },
  ],
}

// ─── Sets d'exemple (non possédés — catalogue de référence) ──────────────────

export const SEED_SETS: MarbleSet[] = [
  REAL_MARBLE_SET,
  {
    id: 'set-example-starter',
    name: 'Marble Rush Starter Pack (exemple)',
    reference: '80-186000',
    year: 2019,
    owned: false,
    active: false,
    coverEmoji: '🎯',
    ageMin: 4,
    ageMax: 9,
    notes: 'Exemple de set de référence — non possédé',
    pieces: [
      { id: 'ex-base-gr', setId: 'set-example-starter', name: 'Base verte', code: 'P-01', type: 'base', color: 'green', quantity: 1, emoji: '🟩', function: 'Base de départ' },
      { id: 'ex-blk-bl', setId: 'set-example-starter', name: 'Bloc support', code: 'B-01', type: 'block', color: 'blue', quantity: 4, emoji: '🔵', function: 'Support de hauteur' },
      { id: 'ex-rail-st', setId: 'set-example-starter', name: 'Rail droit', code: 'T-08', type: 'rail-straight', color: 'blue', quantity: 6, emoji: '➖', function: 'Rail plat' },
      { id: 'ex-lch', setId: 'set-example-starter', name: 'Lanceur', code: 'T-01', type: 'launcher', color: 'yellow', quantity: 1, emoji: '🚀', function: 'Lance la bille' },
      { id: 'ex-marble', setId: 'set-example-starter', name: 'Bille', code: 'MARBLE', type: 'marble', color: 'blue', quantity: 10, emoji: '🔵', function: 'Bille de jeu' },
    ],
  },
]

// ─── Modules réutilisables ────────────────────────────────────────────────────

export const SEED_MODULES: ModuleTemplate[] = [
  {
    id: 'mod-central-tower',
    name: 'Tour Centrale',
    type: 'central-tower',
    difficulty: 'medium',
    description: 'Tour de départ avec lanceur en hauteur. Point de départ classique pour tout circuit.',
    emoji: '🗼',
    tips: 'Stabiliser les blocs avant d\'ajouter le lanceur. Vérifier la verticalité.',
    requiredPieceTypes: ['base', 'block', 'launcher'],
    steps: [
      { stepNumber: 1, title: 'Base', description: 'Poser la base (P-02 x4) au centre.', pieces: [{ pieceId: 'real-P-02', pieceName: 'P-02 Petite base support', quantity: 4, color: 'green', emoji: '🟩' }], gridPositions: [{ x: 3, y: 3, z: 0, pieceId: 'real-P-02', color: 'green', emoji: '🟩' }], tips: 'Surface plate indispensable.' },
      { stepNumber: 2, title: 'Tour (4 blocs B-01)', description: 'Empiler 4 blocs B-01 sur la base.', pieces: [{ pieceId: 'real-B-01', pieceName: 'B-01 Bloc court', quantity: 4, color: 'blue', emoji: '🔵' }], gridPositions: [{ x: 3, y: 3, z: 1, pieceId: 'real-B-01', color: 'blue', emoji: '🔵' }, { x: 3, y: 3, z: 2, pieceId: 'real-B-01', color: 'blue', emoji: '🔵' }, { x: 3, y: 3, z: 3, pieceId: 'real-B-01', color: 'blue', emoji: '🔵' }, { x: 3, y: 3, z: 4, pieceId: 'real-B-01', color: 'blue', emoji: '🔵' }] },
      { stepNumber: 3, title: 'Lanceur T-01', description: 'Fixer le lanceur T-01 au sommet.', pieces: [{ pieceId: 'real-T-01', pieceName: 'T-01 Pièce de départ', quantity: 1, color: 'yellow', emoji: '🚀' }], gridPositions: [{ x: 3, y: 3, z: 5, pieceId: 'real-T-01', color: 'yellow', emoji: '🚀' }], marbleTest: true, tips: 'Tester l\'angle avant d\'ajouter la suite.' },
    ],
  },
  {
    id: 'mod-spiral',
    name: 'Spirale T-17',
    type: 'spiral',
    difficulty: 'easy',
    description: 'Descente en spirale spectaculaire avec T-17. Très appréciée des enfants.',
    emoji: '🌀',
    tips: 'La spirale doit être parfaitement verticale pour ne pas coincer la bille.',
    requiredPieceTypes: ['block', 'spiral'],
    steps: [
      { stepNumber: 1, title: 'Support (2× B-01)', description: 'Poser 2 blocs B-01 comme support de la spirale.', pieces: [{ pieceId: 'real-B-01', pieceName: 'B-01', quantity: 2, color: 'blue', emoji: '🔵' }], gridPositions: [{ x: 0, y: 0, z: 0, pieceId: 'real-B-01', color: 'blue', emoji: '🔵' }] },
      { stepNumber: 2, title: 'Spirale T-17', description: 'Emboîter la spirale T-17 sur les supports.', pieces: [{ pieceId: 'real-T-17', pieceName: 'T-17 Spirale', quantity: 1, color: 'purple', emoji: '🌀' }], gridPositions: [{ x: 0, y: 0, z: 1, pieceId: 'real-T-17', color: 'purple', emoji: '🌀' }], marbleTest: true, tips: '3 à 4 tours complets visibles. Ajuster l\'inclinaison si la bille s\'arrête.' },
    ],
  },
  {
    id: 'mod-elevator',
    name: 'Ascenseur M-03',
    type: 'elevator',
    difficulty: 'hard',
    description: 'Tour avec ascenseur motorisé M-03 pour remonter les billes automatiquement.',
    emoji: '⬆️',
    tips: 'Mettre les piles AVANT d\'assembler. La tour doit être parfaitement verticale.',
    requiredPieceTypes: ['elevator', 'block'],
    steps: [
      { stepNumber: 1, title: 'Base large', description: 'Poser une grande base P-01 pour la stabilité.', pieces: [{ pieceId: 'real-P-01', pieceName: 'P-01 Grande base', quantity: 1, color: 'green', emoji: '🟩' }], gridPositions: [{ x: 0, y: 0, z: 0, pieceId: 'real-P-01', color: 'green', emoji: '🟩' }] },
      { stepNumber: 2, title: 'Colonne (6× B-03)', description: 'Empiler 6 blocs longs B-03 pour la colonne centrale.', pieces: [{ pieceId: 'real-B-03', pieceName: 'B-03 Bloc long', quantity: 6, color: 'gray', emoji: '⬜' }], gridPositions: [{ x: 1, y: 1, z: 1, pieceId: 'real-B-03', color: 'gray', emoji: '⬜' }] },
      { stepNumber: 3, title: 'Module ascenseur M-03', description: 'Clipser le module M-03 sur la colonne. Vérifier que la chaîne remonte librement.', pieces: [{ pieceId: 'real-M-03', pieceName: 'M-03 Ascenseur motorisé', quantity: 1, color: 'cyan', emoji: '⬆️' }], gridPositions: [{ x: 1, y: 1, z: 2, pieceId: 'real-M-03', color: 'cyan', emoji: '⬆️' }], marbleTest: true, tips: 'La bille doit entrer dans la nacelle facilement. Pas de forçage !' },
    ],
  },
  {
    id: 'mod-flipper',
    name: 'Aiguillage Flipper T-10',
    type: 'slow-branch',
    difficulty: 'medium',
    description: 'Bifurcation alternée avec T-10 — envoie les billes à gauche et à droite alternativement.',
    emoji: '🔀',
    tips: 'Les deux branches doivent avoir la même pente pour un rythme équilibré.',
    requiredPieceTypes: ['flipper', 'rail-straight'],
    steps: [
      { stepNumber: 1, title: 'Poser T-10', description: 'Installer le flipper T-10 au carrefour des deux branches.', pieces: [{ pieceId: 'real-T-10', pieceName: 'T-10 Flipper', quantity: 1, color: 'orange', emoji: '🔀' }], gridPositions: [{ x: 2, y: 2, z: 2, pieceId: 'real-T-10', color: 'orange', emoji: '🔀' }] },
      { stepNumber: 2, title: 'Branche gauche (T-04 + T-06)', description: 'Ajouter 1 rail incliné T-04 + 1 virage T-06 à gauche.', pieces: [{ pieceId: 'real-T-04', pieceName: 'T-04 Rail incliné', quantity: 1, color: 'blue', emoji: '📐' }, { pieceId: 'real-T-06', pieceName: 'T-06 Virage 90°', quantity: 1, color: 'blue', emoji: '↪️' }], gridPositions: [{ x: 1, y: 2, z: 1, pieceId: 'real-T-04', color: 'blue', emoji: '📐' }, { x: 0, y: 2, z: 0, pieceId: 'real-T-06', color: 'blue', emoji: '↪️' }] },
      { stepNumber: 3, title: 'Branche droite (T-04 + T-08)', description: 'Ajouter 1 T-04 + 1 T-08 à droite.', pieces: [{ pieceId: 'real-T-04', pieceName: 'T-04 Rail incliné', quantity: 1, color: 'blue', emoji: '📐' }, { pieceId: 'real-T-08', pieceName: 'T-08 Rail plat', quantity: 1, color: 'blue', emoji: '➖' }], gridPositions: [{ x: 3, y: 2, z: 1, pieceId: 'real-T-04', color: 'blue', emoji: '📐' }, { x: 4, y: 2, z: 0, pieceId: 'real-T-08', color: 'blue', emoji: '➖' }], marbleTest: true, tips: 'Lancer plusieurs billes — elles alternent G/D.' },
    ],
  },
  {
    id: 'mod-train-branch',
    name: 'Branche Train',
    type: 'train-branch',
    difficulty: 'medium',
    description: 'Section train avec T-24/T-25 et wagon M-04. Relie deux zones du circuit.',
    emoji: '🚂',
    tips: 'Bien aligner les rails T-24 entre eux. Le wagon M-04 doit glisser librement.',
    requiredPieceTypes: ['train-track', 'train-car'],
    steps: [
      { stepNumber: 1, title: 'Station départ T-26', description: 'Installer la station de départ T-26.', pieces: [{ pieceId: 'real-T-26', pieceName: 'T-26 Station départ', quantity: 1, color: 'yellow', emoji: '🚉' }], gridPositions: [{ x: 0, y: 4, z: 0, pieceId: 'real-T-26', color: 'yellow', emoji: '🚉' }] },
      { stepNumber: 2, title: 'Rails T-24 (x3)', description: 'Enchaîner 3 rails droits T-24.', pieces: [{ pieceId: 'real-T-24', pieceName: 'T-24 Rail train droit', quantity: 3, color: 'gray', emoji: '🛤️' }], gridPositions: [{ x: 1, y: 4, z: 0, pieceId: 'real-T-24', color: 'gray', emoji: '🛤️' }, { x: 2, y: 4, z: 0, pieceId: 'real-T-24', color: 'gray', emoji: '🛤️' }, { x: 3, y: 4, z: 0, pieceId: 'real-T-24', color: 'gray', emoji: '🛤️' }] },
      { stepNumber: 3, title: 'Wagon M-04', description: 'Poser le wagon M-04 sur les rails. Il doit glisser librement.', pieces: [{ pieceId: 'real-M-04', pieceName: 'M-04 Wagon train', quantity: 1, color: 'red', emoji: '🚃' }], gridPositions: [{ x: 1, y: 4, z: 0, pieceId: 'real-M-04', color: 'red', emoji: '🚃' }], marbleTest: true, tips: 'Charger le wagon avec 2 billes et le laisser glisser depuis la station.' },
    ],
  },
  {
    id: 'mod-common-arrival',
    name: 'Arrivée T-27',
    type: 'common-arrival',
    difficulty: 'easy',
    description: 'Zone d\'arrivée finale avec T-27. Collecte les billes de toutes les branches.',
    emoji: '🏁',
    tips: 'Placer T-27 en dessous du niveau des rails d\'arrivée pour ne pas perdre de billes.',
    requiredPieceTypes: ['funnel'],
    steps: [
      { stepNumber: 1, title: 'Arrivée T-27', description: 'Placer la pièce d\'arrivée T-27 à la fin du circuit, bac tourné vers le bas.', pieces: [{ pieceId: 'real-T-27', pieceName: 'T-27 Arrivée finale', quantity: 1, color: 'red', emoji: '🏁' }], gridPositions: [{ x: 4, y: 7, z: 0, pieceId: 'real-T-27', color: 'red', emoji: '🏁' }], marbleTest: true, tips: 'Tester avec 3 billes d\'affilée pour vérifier qu\'aucune ne saute.' },
    ],
  },
]
