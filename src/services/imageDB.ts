// ─── IndexedDB service for piece image storage ────────────────────────────────
// Stores images as blobs (not base64) to avoid localStorage size limits.
// Object store: "images" — key = piece code (e.g. "T-04"), value = Blob

const DB_NAME = 'marble_rush_images'
const DB_VERSION = 1
const STORE = 'images'

let _db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result
      resolve(_db)
    }
    req.onerror = () => reject(req.error)
  })
}

// Cache of blob URLs so we don't revoke + recreate on every render
const _blobUrlCache = new Map<string, string>()

/** Save (or overwrite) an image for a piece code. Returns the blob URL. */
export async function saveImage(code: string, blob: Blob): Promise<string> {
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, code)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  // Revoke old URL if present
  const old = _blobUrlCache.get(code)
  if (old) URL.revokeObjectURL(old)
  const url = URL.createObjectURL(blob)
  _blobUrlCache.set(code, url)
  return url
}

/** Get a blob URL for a piece code. Returns null if not stored. */
export async function getImageUrl(code: string): Promise<string | null> {
  if (_blobUrlCache.has(code)) return _blobUrlCache.get(code)!
  const db = await openDB()
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(code)
    req.onsuccess = () => resolve(req.result as Blob | undefined)
    req.onerror = () => reject(req.error)
  })
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  _blobUrlCache.set(code, url)
  return url
}

/** Delete the image for a piece code. */
export async function deleteImage(code: string): Promise<void> {
  const old = _blobUrlCache.get(code)
  if (old) {
    URL.revokeObjectURL(old)
    _blobUrlCache.delete(code)
  }
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(code)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Returns all piece codes that have a stored image. */
export async function getAllImageCodes(): Promise<string[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAllKeys()
    req.onsuccess = () => resolve(req.result as string[])
    req.onerror = () => reject(req.error)
  })
}

/** Compress + convert a File to WebP Blob (max 400px, quality 0.82). */
export async function compressToWebP(file: File, maxPx = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/webp',
        0.82,
      )
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })
}

/** Crop a region from a File and return a WebP Blob. */
export async function cropAndCompress(
  file: File,
  crop: { x: number; y: number; width: number; height: number },
  maxPx = 400,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(crop.width, crop.height))
      const w = Math.round(crop.width * scale)
      const h = Math.round(crop.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/webp',
        0.82,
      )
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })
}
