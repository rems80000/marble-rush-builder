import { useEffect, useRef } from 'react'
import type { ImageCrop } from '../types'

interface Props {
  imageUrl: string
  crop: ImageCrop
  code: string
  size: number
  className?: string
  variant?: 'tile' | 'cutout'
}

export default function NoticePieceImage({ imageUrl, crop, code, size, className, variant = 'tile' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    const source = new Image()
    source.decoding = 'async'
    source.onload = () => {
      if (cancelled || !canvasRef.current) return
      const canvas = canvasRef.current
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * ratio)
      canvas.height = Math.round(size * ratio)
      const context = canvas.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (variant === 'tile') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      // La version "cutout" retire les marges contenant le code et la quantité,
      // puis rend le papier blanc transparent pour la scène isométrique.
      const insetX = variant === 'cutout' ? crop.width * 0.08 : 0
      const insetTop = variant === 'cutout' ? crop.height * 0.16 : 0
      const insetBottom = variant === 'cutout' ? crop.height * 0.14 : 0
      const sourceWidth = crop.width - insetX * 2
      const sourceHeight = crop.height - insetTop - insetBottom
      const scale = Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight)
      const drawWidth = sourceWidth * scale
      const drawHeight = sourceHeight * scale
      context.drawImage(
        source,
        crop.x + insetX,
        crop.y + insetTop,
        sourceWidth,
        sourceHeight,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      )

      if (variant === 'cutout') {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
        const pixelCount = canvas.width * canvas.height
        const visited = new Uint8Array(pixelCount)
        const queue = new Int32Array(pixelCount)
        let queueStart = 0
        let queueEnd = 0

        const canRemove = (pixelIndex: number) => {
          const dataIndex = pixelIndex * 4
          const alpha = pixels.data[dataIndex + 3] ?? 0
          if (alpha === 0) return true
          const red = pixels.data[dataIndex] ?? 0
          const green = pixels.data[dataIndex + 1] ?? 0
          const blue = pixels.data[dataIndex + 2] ?? 0
          const minimum = Math.min(red, green, blue)
          const maximum = Math.max(red, green, blue)
          const brightness = (red + green + blue) / 3
          return brightness > 132 && maximum - minimum < 38
        }

        const enqueue = (pixelIndex: number) => {
          if (pixelIndex < 0 || pixelIndex >= pixelCount || visited[pixelIndex]) return
          visited[pixelIndex] = 1
          if (!canRemove(pixelIndex)) return
          queue[queueEnd++] = pixelIndex
        }

        // On part de tous les bords. Une ligne sombre appartenant à la pièce
        // bloque naturellement la propagation et protège son intérieur.
        for (let x = 0; x < canvas.width; x += 1) {
          enqueue(x)
          enqueue((canvas.height - 1) * canvas.width + x)
        }
        for (let y = 0; y < canvas.height; y += 1) {
          enqueue(y * canvas.width)
          enqueue(y * canvas.width + canvas.width - 1)
        }

        while (queueStart < queueEnd) {
          const pixelIndex = queue[queueStart++]!
          pixels.data[pixelIndex * 4 + 3] = 0
          const x = pixelIndex % canvas.width
          if (x > 0) enqueue(pixelIndex - 1)
          if (x < canvas.width - 1) enqueue(pixelIndex + 1)
          if (pixelIndex >= canvas.width) enqueue(pixelIndex - canvas.width)
          if (pixelIndex < pixelCount - canvas.width) enqueue(pixelIndex + canvas.width)
        }

        // Nettoyage des derniers halos très clairs non reliés au bord.
        for (let dataIndex = 0; dataIndex < pixels.data.length; dataIndex += 4) {
          const red = pixels.data[dataIndex] ?? 0
          const green = pixels.data[dataIndex + 1] ?? 0
          const blue = pixels.data[dataIndex + 2] ?? 0
          const minimum = Math.min(red, green, blue)
          const maximum = Math.max(red, green, blue)
          if ((red + green + blue) / 3 > 242 && maximum - minimum < 16) pixels.data[dataIndex + 3] = 0
        }

        // Les chiffres, codes et lignes de tableau sont des petits composants
        // isolés. On conserve les masses principales de l'objet et on retire
        // les fragments trop petits ou trop fins.
        const componentVisited = new Uint8Array(pixelCount)
        const components: { indices: number[]; minX: number; maxX: number; minY: number; maxY: number }[] = []
        for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
          if (componentVisited[pixelIndex] || (pixels.data[pixelIndex * 4 + 3] ?? 0) < 28) continue
          const indices: number[] = []
          const componentQueue = [pixelIndex]
          componentVisited[pixelIndex] = 1
          let minX = canvas.width
          let maxX = 0
          let minY = canvas.height
          let maxY = 0
          while (componentQueue.length > 0) {
            const current = componentQueue.pop()!
            indices.push(current)
            const x = current % canvas.width
            const y = Math.floor(current / canvas.width)
            minX = Math.min(minX, x)
            maxX = Math.max(maxX, x)
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y)
            const neighbours = [current - 1, current + 1, current - canvas.width, current + canvas.width]
            neighbours.forEach((next) => {
              if (next < 0 || next >= pixelCount || componentVisited[next]) return
              const nextX = next % canvas.width
              if (Math.abs(nextX - x) > 1 || (pixels.data[next * 4 + 3] ?? 0) < 28) return
              componentVisited[next] = 1
              componentQueue.push(next)
            })
          }
          components.push({ indices, minX, maxX, minY, maxY })
        }
        const largestArea = Math.max(1, ...components.map((component) => component.indices.length))
        components.forEach((component) => {
          const width = component.maxX - component.minX + 1
          const height = component.maxY - component.minY + 1
          if (component.indices.length >= largestArea * 0.055 && width > 3 && height > 3) return
          component.indices.forEach((pixelIndex) => { pixels.data[pixelIndex * 4 + 3] = 0 })
        })
        context.putImageData(pixels, 0, 0)
      }
    }
    source.src = imageUrl
    return () => { cancelled = true }
  }, [crop.height, crop.width, crop.x, crop.y, imageUrl, size, variant])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${code}, image recadrée depuis la notice`}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.18),
        flexShrink: 0,
        display: 'block',
        background: variant === 'tile' ? '#fff' : 'transparent',
        filter: variant === 'cutout' ? 'drop-shadow(0 8px 6px rgba(15,23,42,.28))' : undefined,
      }}
    />
  )
}
