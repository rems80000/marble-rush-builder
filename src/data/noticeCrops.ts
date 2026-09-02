import type { ImageCrop } from '../types'

export interface NoticeCropDefinition {
  imageUrl: string
  crop: ImageCrop
}

const base = import.meta.env.BASE_URL

const CATALOG_5036 = `${base}reference/catalog-5036.jpg`
const CATALOG_5999 = `${base}reference/catalog-5999.jpg`
const CATALOG_5194 = `${base}reference/catalog-5194.png`
const CATALOG_5423 = `${base}reference/catalog-5423.png`
const CATALOG_5426 = `${base}reference/catalog-5426.png`

type CellMap = Record<string, [number, number, number, number]>

function definitions(imageUrl: string, sourceImageId: string, cells: CellMap) {
  return Object.fromEntries(
    Object.entries(cells).map(([code, [x, y, width, height]]) => [
      code,
      { imageUrl, crop: { x, y, width, height, sourceImageId } },
    ]),
  ) as Record<string, NoticeCropDefinition>
}

// Coordonnées en pixels dans les photos originales 960 × 1280.
// Le recadrage conserve volontairement le code et la quantité imprimés.
const CROPS_5036 = definitions(CATALOG_5036, 'catalog-5036', {
  'M-02': [72, 176, 170, 150],
  'M-03': [244, 176, 174, 150],
  'M-04': [420, 176, 170, 150],
  'M-05': [592, 176, 172, 150],
  'M-07': [72, 330, 170, 164],
  'T-01': [244, 330, 174, 164],
  'T-02': [420, 330, 170, 164],
  'T-03': [592, 330, 172, 164],
  'T-04': [72, 497, 170, 165],
  'T-05': [244, 497, 174, 165],
  'T-06': [420, 497, 170, 165],
  'T-07': [592, 497, 172, 165],
  'T-08': [72, 665, 170, 164],
  'T-10': [244, 665, 174, 164],
  'P-01': [420, 665, 170, 164],
  'B-01': [592, 665, 172, 164],
  'B-02': [72, 831, 170, 162],
  'B-04': [244, 831, 174, 162],
  'MARBLE': [420, 831, 170, 162],
  'M-10': [592, 831, 172, 162],
})

const CROPS_5999 = definitions(CATALOG_5999, 'catalog-5999', {
  'M-03': [72, 92, 128, 119],
  'M-04': [202, 92, 132, 119],
  'M-07': [336, 92, 130, 119],
  'M-34': [468, 92, 127, 119],
  'M-35': [597, 92, 128, 119],
  'M-36': [72, 213, 128, 116],
  'M-37': [202, 213, 132, 116],
  'M-38': [336, 213, 130, 116],
  'M-39': [468, 213, 127, 116],
  'M-40': [597, 213, 82, 233],
  'M-45': [672, 331, 53, 115],
  'M-40/M-45': [597, 213, 128, 233],
  'M-41': [72, 331, 128, 115],
  'M-42': [202, 331, 132, 115],
  'M-43': [336, 331, 130, 115],
  'M-44': [468, 331, 127, 115],
  'T-01': [72, 448, 128, 112],
  'T-02': [202, 448, 132, 112],
  'T-03': [336, 448, 130, 112],
  'T-04': [468, 448, 127, 112],
  'T-06': [597, 448, 128, 112],
  'T-07': [72, 562, 128, 110],
  'T-08': [202, 562, 132, 110],
  'T-10': [336, 562, 130, 110],
  'T-14': [468, 562, 127, 110],
  'T-17': [597, 562, 128, 110],
  'T-23': [72, 674, 128, 110],
  'T-24': [202, 674, 132, 110],
  'T-25': [336, 674, 130, 110],
  'T-26': [468, 674, 127, 110],
  'T-27': [597, 674, 128, 110],
  'B-01': [72, 786, 128, 110],
  'B-02': [202, 786, 132, 110],
  'B-03': [336, 786, 130, 110],
  'B-05': [468, 786, 127, 110],
  'P-01': [597, 786, 128, 110],
  'P-02': [72, 898, 128, 116],
  'MARBLE': [202, 898, 132, 116],
})

// Pages COMPOSANTS rendues depuis les guides officiels VTech.
// Les cases gardent une petite marge afin de ne jamais couper la pièce.
const CROPS_5194 = definitions(CATALOG_5194, 'catalog-5194', {
  'M-04': [26, 52, 186, 220], 'M-05': [212, 52, 186, 220],
  'M-07': [398, 52, 186, 220], 'M-15': [584, 52, 186, 220], 'M-17': [770, 52, 190, 220],
  'M-18': [26, 272, 186, 220], 'T-01': [212, 272, 186, 220],
  'T-02': [398, 272, 186, 220], 'T-03': [584, 272, 186, 220], 'T-04': [770, 272, 190, 220],
  'T-05': [26, 492, 186, 220], 'T-06': [212, 492, 186, 220],
  'T-07': [398, 492, 186, 220], 'T-08': [584, 492, 186, 220], 'T-14': [770, 492, 190, 220],
  'T-15': [26, 712, 186, 220], 'T-17': [212, 712, 186, 220],
  'T-18': [398, 712, 186, 220], 'T-20': [584, 712, 186, 220], 'B-01': [770, 712, 190, 220],
  'B-02': [26, 932, 186, 220], 'B-04': [212, 932, 186, 220],
  'B-05': [398, 932, 186, 220], 'P-01': [584, 932, 186, 220], 'P-02': [770, 932, 190, 220],
  'MARBLE': [26, 1152, 186, 170],
})

const CROPS_5423 = definitions(CATALOG_5423, 'catalog-5423', {
  'M-01': [30, 76, 188, 210], 'M-02': [218, 76, 188, 210],
  'M-03': [406, 76, 188, 210], 'M-04': [594, 76, 188, 210], 'M-05': [782, 76, 188, 210],
  'M-06': [30, 286, 188, 210], 'M-07': [218, 286, 188, 210],
  'M-08': [406, 286, 188, 210], 'M-09': [594, 286, 188, 210], 'T-01': [782, 286, 188, 210],
  'T-02': [30, 496, 188, 202], 'T-03': [218, 496, 188, 202],
  'T-04': [406, 496, 188, 202], 'T-05': [594, 496, 188, 202], 'T-06': [782, 496, 188, 202],
  'T-07': [30, 698, 188, 198], 'T-08': [218, 698, 188, 198],
  'T-09': [406, 698, 188, 198], 'T-10': [594, 698, 188, 198], 'T-11': [782, 698, 188, 198],
  'T-12': [30, 896, 188, 202], 'P-01': [218, 896, 188, 202],
  'B-01': [406, 896, 188, 202], 'B-02': [594, 896, 188, 202], 'B-03': [782, 896, 188, 202],
  'MARBLE': [30, 1098, 188, 178], 'M-15': [218, 1098, 188, 178],
})

const CROPS_5426 = definitions(CATALOG_5426, 'catalog-5426', {
  'B-01': [24, 58, 160, 238], 'B-02': [184, 58, 160, 238],
  'B-04': [344, 58, 160, 238], 'P-02': [504, 58, 160, 238],
  'T-08': [24, 296, 160, 236], 'T-07': [184, 296, 160, 236],
  'T-05': [344, 296, 160, 236], 'T-02': [504, 296, 160, 236],
  'T-01': [24, 532, 160, 236], 'T-12': [184, 532, 160, 236],
  'M-09': [344, 532, 160, 236], 'MARBLE': [504, 532, 160, 236],
})

export function getNoticeCrop(code: string, setReference?: string): NoticeCropDefinition | null {
  const normalized = code.toUpperCase()
  if (setReference === '5036') return CROPS_5036[normalized] ?? null
  if (setReference === '5999') return CROPS_5999[normalized] ?? null
  if (setReference === '5194') return CROPS_5194[normalized] ?? null
  if (setReference === '5423') return CROPS_5423[normalized] ?? null
  if (setReference === '5426') return CROPS_5426[normalized] ?? null
  return CROPS_5999[normalized]
    ?? CROPS_5036[normalized]
    ?? CROPS_5423[normalized]
    ?? CROPS_5194[normalized]
    ?? CROPS_5426[normalized]
    ?? null
}
