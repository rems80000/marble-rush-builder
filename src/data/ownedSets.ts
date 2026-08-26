import type { MarblePiece, MarbleSet, PieceColor, PieceType } from '../types'
import { getNoticeCrop } from './noticeCrops'

const SET_5036 = 'set-5036-spiral-starter'

function piece(
  code: string,
  name: string,
  type: PieceType,
  color: PieceColor,
  quantity: number,
  emoji: string,
  notes?: string,
): MarblePiece {
  const notice = getNoticeCrop(code, '5036')
  return {
    id: `${SET_5036}-${code}`,
    setId: SET_5036,
    code,
    name,
    type,
    color,
    quantity,
    emoji,
    notes,
    sourceSetIds: ['5036'],
    imageSource: 'asset',
    imageUrl: notice?.imageUrl,
    imageCrop: notice?.crop,
    imageAlt: `${code} - extrait de la notice officielle du set 5036`,
  }
}

export const SPIRAL_STARTER_5036: MarbleSet = {
  id: SET_5036,
  name: 'Spiral Starter Set',
  reference: '5036',
  owned: true,
  active: true,
  coverEmoji: '🌀',
  coverImage: `${import.meta.env.BASE_URL}reference/collection-sets.jpg`,
  ageMin: 4,
  advertisedPieceCount: 67,
  inventoryStatus: 'verified-photo',
  notes: 'Inventaire vérifié sur la photo de la page COMPOSANTS fournie.',
  manualUrl: 'https://www.vtechkids.com/assets/data/products/%7BE76A0F9F-E7BD-4F6E-974E-F3A44B28BFAB%7D/manuals/503600_Manual.pdf',
  pieces: [
    piece('M-02', 'Lanceur double', 'launcher', 'blue', 1, '🚀'),
    piece('M-03', 'Grand entonnoir', 'funnel', 'green', 1, '🌀'),
    piece('M-04', 'Tourbillon mécanique', 'special', 'orange', 1, '⚙️'),
    piece('M-05', 'Bascule de sortie', 'special', 'green', 1, '🔀'),
    piece('M-07', 'Rampe de lancement', 'launcher', 'yellow', 1, '🚀'),
    piece('M-10', 'Panneau transparent', 'decoration', 'transparent', 1, '🪟'),
    piece('T-01', 'Grand virage jaune', 'rail-curved', 'yellow', 2, '↪️'),
    piece('T-02', 'Grand virage orange', 'rail-curved', 'orange', 1, '↪️'),
    piece('T-03', 'Petit virage orange', 'rail-curved', 'orange', 4, '↪️'),
    piece('T-04', 'Grand virage rouge', 'rail-curved', 'red', 2, '↪️'),
    piece('T-05', 'Petit virage vert', 'rail-curved', 'green', 2, '↪️'),
    piece('T-06', 'Rail droit court bleu', 'rail-straight', 'blue', 3, '➖'),
    piece('T-07', 'Rail droit long bleu', 'rail-straight', 'blue', 2, '➖'),
    piece('T-08', 'Rail droit court rouge', 'rail-straight', 'red', 1, '➖'),
    piece('T-10', 'Vortex bleu', 'spiral', 'blue', 1, '🌀'),
    piece('P-01', 'Grande plaque de base', 'base', 'white', 4, '▦'),
    piece('B-01', 'Bloc support bleu', 'block', 'blue', 14, '🔵'),
    piece('B-02', 'Bloc support orange', 'block', 'orange', 13, '🟠'),
    piece('B-04', 'Bloc support transparent', 'block', 'transparent', 7, '⬜'),
    piece('MARBLE', 'MarbleBille', 'marble', 'mixed', 5, '🔴'),
  ],
}

function ownedSet(
  reference: string,
  name: string,
  advertisedPieceCount: number,
  coverEmoji: string,
  manualUrl?: string,
): MarbleSet {
  return {
    id: `set-${reference}`,
    name,
    reference,
    owned: true,
    active: true,
    coverEmoji,
    coverImage: `${import.meta.env.BASE_URL}reference/collection-sets.jpg`,
    advertisedPieceCount,
    inventoryStatus: 'needs-catalog',
    ageMin: 4,
    notes: 'Set confirmé par la photo de collection. Inventaire détaillé à valider depuis la page COMPOSANTS de sa notice.',
    manualUrl,
    pieces: [],
  }
}

export const OWNED_ADDITIONAL_SETS: MarbleSet[] = [
  SPIRAL_STARTER_5036,
  ownedSet('5426', 'Fun Fair Set Electronic M300E', 31, '🎡', 'https://cdn-vtech-jouets.vtech.com/assets/a6831cc5-8f49-4bf0-9b77-2fa3ea9e64e1/5426_Guide%20de%20construction_Fun%20Fair%20Set.pdf'),
  ownedSet('5718', 'Gaming Set S300', 80, '🎯', 'https://cdn-vtech-jouets.vtech.com/assets/a3d43322-7def-4a6b-b022-2f4005ad2382/571805%20Marble%20Rush%20Gaming%20Set%20S300.pdf'),
  ownedSet('5022', 'Discovery Set XS100', 33, '🚀', 'https://cdn-vtech-jouets.vtech.com/assets/22ec3b62-000c-44e0-9b00-96c4fd7b54a3/5022_Discovery%20Set_full_IM.pdf'),
  ownedSet('5296', 'Tip & Swirl Set', 52, '🌀'),
  ownedSet('5423', 'Ultimate Set Electronic XL100E', 145, '🎡', 'https://cdn-vtech-jouets.vtech.com/assets/7ce25a25-2ad5-476a-a034-42c58aa8b0fc/5423_Ultimate%20Set_Guide%20de%20construction.pdf'),
  ownedSet('5194', 'Super Action / Corkscrew Rush Set', 112, '🎢', 'https://cdn-vtech-jouets.vtech.com/assets/590f84d7-3aa3-45ae-bc16-7b1b4352bc01/5194_Guide%20de%20contruction.pdf'),
]
