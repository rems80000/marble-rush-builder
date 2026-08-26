import type { MarbleSet, ModuleTemplate } from '../types'
import { OWNED_ADDITIONAL_SETS } from './ownedSets'
import { getNoticeCrop } from './noticeCrops'

// ─── Vrai set – inventaire photo 2026-05-13 ───────────────────────────────────

export const REAL_MARBLE_SET: MarbleSet = {
  id: 'set-real-train-elevator-2026',
  name: 'Super Sky Tower Set XL300E',
  reference: '5999',
  year: 2022,
  owned: true,
  active: true,
  coverEmoji: '🚂',
  coverImage: `${import.meta.env.BASE_URL}reference/collection-sets.jpg`,
  advertisedPieceCount: 153,
  inventoryStatus: 'verified-photo',
  manualUrl: 'https://cdn-vtech-jouets.vtech.com/assets/d9982fea-0375-4e84-bfdf-ba05ecc5ce66/559905_IM_Marble%20Rush_Sky%20tower%20Set.pdf',
  ageMin: 5,
  ageMax: 12,
  notes: 'Inventaire vérifié sur la page COMPOSANTS fournie. La notice annonce 143 pièces de construction et 10 billes.',
  pieces: [
    // ── P : Bases ───────────────────────────────────────────────────────────
    { id: 'real-P-01', setId: 'set-real-train-elevator-2026', name: 'Grande plaque de base', code: 'P-01', type: 'base', color: 'white', quantity: 2, emoji: '▦', dimensions: { width: 6, height: 1, depth: 6 }, function: 'Grande plaque de départ pour circuits larges', connectors: ['top'], imageSource: 'asset' as const },
    { id: 'real-P-02', setId: 'set-real-train-elevator-2026', name: 'Petite plaque de base', code: 'P-02', type: 'base', color: 'white', quantity: 17, emoji: '▦', dimensions: { width: 2, height: 1, depth: 2 }, function: 'Petite plaque support / jonction de sol', connectors: ['top'], imageSource: 'asset' as const },

    // ── B : Blocs supports ──────────────────────────────────────────────────
    { id: 'real-B-01', setId: 'set-real-train-elevator-2026', name: 'Bloc court', code: 'B-01', type: 'block', color: 'blue', quantity: 31, emoji: '🔵', dimensions: { width: 1, height: 1, depth: 1 }, function: 'Bloc de support de hauteur 1 unité', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-B-02', setId: 'set-real-train-elevator-2026', name: 'Bloc support orange', code: 'B-02', type: 'block', color: 'orange', quantity: 11, emoji: '🟠', dimensions: { width: 1, height: 2, depth: 1 }, function: 'Bloc de support orange', connectors: ['top', 'bottom'], imageSource: 'asset' as const },
    { id: 'real-B-03', setId: 'set-real-train-elevator-2026', name: 'Bloc long', code: 'B-03', type: 'block', color: 'gray', quantity: 23, emoji: '⬜', dimensions: { width: 1, height: 3, depth: 1 }, function: 'Bloc de support de hauteur 3 unités', connectors: ['top', 'bottom'], imageSource: 'missing' as const },
    { id: 'real-B-05', setId: 'set-real-train-elevator-2026', name: 'Bloc spécial angle', code: 'B-05', type: 'block', color: 'gray', quantity: 6, emoji: '🔲', dimensions: { width: 1, height: 1, depth: 2 }, function: 'Bloc d\'angle pour stabiliser les virages', connectors: ['top', 'bottom', 'front'], imageSource: 'missing' as const },

    // ── T : Pistes / Rails ──────────────────────────────────────────────────
    { id: 'real-T-01', setId: 'set-real-train-elevator-2026', name: 'Grand virage jaune', code: 'T-01', type: 'rail-curved', color: 'yellow', quantity: 1, emoji: '↪', function: 'Grand rail courbe jaune', connectors: ['front', 'right'], imageSource: 'asset' as const },
    { id: 'real-T-02', setId: 'set-real-train-elevator-2026', name: 'Grand virage jaune', code: 'T-02', type: 'rail-curved', color: 'yellow', quantity: 4, emoji: '↪', function: 'Grand rail courbe jaune', connectors: ['front', 'right'], imageSource: 'asset' as const },
    { id: 'real-T-03', setId: 'set-real-train-elevator-2026', name: 'Petit virage orange', code: 'T-03', type: 'rail-curved', color: 'orange', quantity: 1, emoji: '↪', function: 'Petit rail courbe orange', connectors: ['front', 'right'], imageSource: 'asset' as const },
    { id: 'real-T-04', setId: 'set-real-train-elevator-2026', name: 'Grand virage vert', code: 'T-04', type: 'rail-curved', color: 'green', quantity: 5, emoji: '↪', function: 'Grand rail courbe vert', connectors: ['front', 'right'], imageSource: 'asset' as const },
    { id: 'real-T-06', setId: 'set-real-train-elevator-2026', name: 'Rail droit court bleu', code: 'T-06', type: 'rail-straight', color: 'blue', quantity: 4, emoji: '━', function: 'Relie deux éléments proches', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-07', setId: 'set-real-train-elevator-2026', name: 'Rail droit long bleu', code: 'T-07', type: 'rail-straight', color: 'blue', quantity: 2, emoji: '━', function: 'Relie deux éléments éloignés', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-08', setId: 'set-real-train-elevator-2026', name: 'Rail droit court rouge', code: 'T-08', type: 'rail-straight', color: 'red', quantity: 5, emoji: '━', function: 'Rail droit court rouge', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-10', setId: 'set-real-train-elevator-2026', name: 'Module tournant rouge', code: 'T-10', type: 'special', color: 'red', quantity: 1, emoji: '↻', function: 'Module circulaire de piste', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-14', setId: 'set-real-train-elevator-2026', name: 'Rampe bombée rouge', code: 'T-14', type: 'rail-straight', color: 'red', quantity: 3, emoji: '⌒', function: 'Rampe courbe courte', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-17', setId: 'set-real-train-elevator-2026', name: 'Virage spirale vert', code: 'T-17', type: 'spiral', color: 'green', quantity: 2, emoji: '🌀', function: 'Virage compact en spirale', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-23', setId: 'set-real-train-elevator-2026', name: 'Grand virage bleu', code: 'T-23', type: 'rail-curved', color: 'blue', quantity: 1, emoji: '↪', function: 'Grand rail courbe bleu', connectors: ['front', 'right'], imageSource: 'asset' as const },
    { id: 'real-T-24', setId: 'set-real-train-elevator-2026', name: 'Rail de train courbe', code: 'T-24', type: 'train-track', color: 'gray', quantity: 4, emoji: '🛤️', function: 'Rail courbe pour le train', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-25', setId: 'set-real-train-elevator-2026', name: 'Rail de train droit court', code: 'T-25', type: 'train-track', color: 'gray', quantity: 2, emoji: '🛤️', function: 'Rail droit court pour le train', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-26', setId: 'set-real-train-elevator-2026', name: 'Rail de train droit long', code: 'T-26', type: 'train-track', color: 'gray', quantity: 1, emoji: '🛤️', function: 'Rail droit long pour le train', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-T-27', setId: 'set-real-train-elevator-2026', name: 'Virage de sortie bleu', code: 'T-27', type: 'rail-curved', color: 'blue', quantity: 1, emoji: '↪', function: 'Élément courbe de sortie', connectors: ['front', 'back'], imageSource: 'asset' as const },

    // ── M : Modules spéciaux / mécanismes ───────────────────────────────────
    { id: 'real-M-03', setId: 'set-real-train-elevator-2026', name: 'Réceptacle orange', code: 'M-03', type: 'funnel', color: 'orange', quantity: 1, emoji: '◉', function: 'Réceptionne et redirige une bille', connectors: ['bottom'], imageSource: 'asset' as const },
    { id: 'real-M-04', setId: 'set-real-train-elevator-2026', name: 'Support mécanique orange', code: 'M-04', type: 'special', color: 'orange', quantity: 2, emoji: '⚙', function: 'Support de mécanisme', connectors: ['top', 'bottom'], imageSource: 'asset' as const },
    { id: 'real-M-07', setId: 'set-real-train-elevator-2026', name: 'Rampe de lancement jaune', code: 'M-07', type: 'launcher', color: 'yellow', quantity: 1, emoji: '⇢', function: 'Rampe de départ ou de relance', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-M-34', setId: 'set-real-train-elevator-2026', name: 'Support double bleu', code: 'M-34', type: 'special', color: 'blue', quantity: 1, emoji: '▣', function: 'Support de voie double', imageSource: 'asset' as const },
    { id: 'real-M-35', setId: 'set-real-train-elevator-2026', name: 'Toit de gare', code: 'M-35', type: 'decoration', color: 'red', quantity: 1, emoji: '⌂', function: 'Élément de gare rouge et bleu', imageSource: 'asset' as const },
    { id: 'real-M-36', setId: 'set-real-train-elevator-2026', name: 'Pont brun', code: 'M-36', type: 'special', color: 'gray', quantity: 1, emoji: '═', function: 'Plateforme de pont', connectors: ['front', 'back'], imageSource: 'asset' as const },
    { id: 'real-M-37', setId: 'set-real-train-elevator-2026', name: 'Borne rouge', code: 'M-37', type: 'decoration', color: 'red', quantity: 1, emoji: '▮', function: 'Élément vertical décoratif', imageSource: 'asset' as const },
    { id: 'real-M-38', setId: 'set-real-train-elevator-2026', name: 'Boîtier vert', code: 'M-38', type: 'special', color: 'green', quantity: 1, emoji: '▣', function: 'Boîtier de commande du train', imageSource: 'asset' as const },
    { id: 'real-M-39', setId: 'set-real-train-elevator-2026', name: 'Train motorisé', code: 'M-39', type: 'train-car', color: 'green', quantity: 1, emoji: '🚄', function: 'Train motorisé Marble Rush', imageSource: 'asset' as const },
    { id: 'real-M-40', setId: 'set-real-train-elevator-2026', name: 'Colonne d’ascenseur', code: 'M-40', type: 'elevator', color: 'gray', quantity: 1, emoji: '↥', function: 'Chaîne verticale de l’ascenseur', imageSource: 'asset' as const },
    { id: 'real-M-45', setId: 'set-real-train-elevator-2026', name: 'Base bleue d’ascenseur', code: 'M-45', type: 'elevator', color: 'blue', quantity: 1, emoji: '▣', function: 'Base de fixation de la colonne M-40', imageSource: 'asset' as const },
    { id: 'real-M-41', setId: 'set-real-train-elevator-2026', name: 'Décor arbres', code: 'M-41', type: 'decoration', color: 'green', quantity: 1, emoji: '🌳', function: 'Décor de végétation', imageSource: 'asset' as const },
    { id: 'real-M-42', setId: 'set-real-train-elevator-2026', name: 'Pont de glace', code: 'M-42', type: 'decoration', color: 'cyan', quantity: 1, emoji: '♒', function: 'Décor de pont glacé', imageSource: 'asset' as const },
    { id: 'real-M-43', setId: 'set-real-train-elevator-2026', name: 'Pont ferroviaire', code: 'M-43', type: 'decoration', color: 'green', quantity: 1, emoji: '🌉', function: 'Décor de pont pour le train', imageSource: 'asset' as const },
    { id: 'real-M-44', setId: 'set-real-train-elevator-2026', name: 'Tour monument', code: 'M-44', type: 'decoration', color: 'gray', quantity: 1, emoji: '🗼', function: 'Monument décoratif', imageSource: 'asset' as const },

    // ── Billes ──────────────────────────────────────────────────────────────
    { id: 'real-MRB', setId: 'set-real-train-elevator-2026', name: 'Bille', code: 'MARBLE', type: 'marble', color: 'mixed', quantity: 10, emoji: '⚪', dimensions: { width: 0.3, height: 0.3, depth: 0.3 }, function: 'Bille de jeu standard', imageSource: 'missing' as const },
  ],
}

// Associe chaque référence du set 5999 à sa case exacte sur la photo fournie.
REAL_MARBLE_SET.pieces.forEach((piece) => {
  const notice = getNoticeCrop(piece.code, '5999')
  piece.sourceSetIds = ['5999']
  if (notice) {
    piece.imageSource = 'asset'
    piece.imageUrl = notice.imageUrl
    piece.imageCrop = notice.crop
    piece.imageAlt = `${piece.code} - extrait de la notice du set 5999`
  }
})

// ─── Sets d'exemple (non possédés — catalogue de référence) ──────────────────

export const SEED_SETS: MarbleSet[] = [
  REAL_MARBLE_SET,
  ...OWNED_ADDITIONAL_SETS,
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
