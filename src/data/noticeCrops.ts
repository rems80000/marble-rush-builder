import type { ImageCrop } from '../types'

export interface NoticeCropDefinition {
  imageUrl: string
  crop: ImageCrop
}

const base = import.meta.env.BASE_URL

const CATALOG_5036 = `${base}reference/catalog-5036.jpg`
const CATALOG_5999 = `${base}reference/catalog-5999.jpg`

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

export function getNoticeCrop(code: string, setReference?: string): NoticeCropDefinition | null {
  const normalized = code.toUpperCase()
  if (setReference === '5036') return CROPS_5036[normalized] ?? null
  if (setReference === '5999') return CROPS_5999[normalized] ?? null
  return CROPS_5999[normalized] ?? CROPS_5036[normalized] ?? null
}
