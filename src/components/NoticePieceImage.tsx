import { useEffect, useRef } from 'react'
import type { ImageCrop } from '../types'

interface Props {
  imageUrl: string
  crop: ImageCrop
  code: string
  size: number
  className?: string
}

export default function NoticePieceImage({ imageUrl, crop, code, size, className }: Props) {
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
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(canvas.width / crop.width, canvas.height / crop.height)
      const drawWidth = crop.width * scale
      const drawHeight = crop.height * scale
      context.drawImage(
        source,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      )
    }
    source.src = imageUrl
    return () => { cancelled = true }
  }, [crop.height, crop.width, crop.x, crop.y, imageUrl, size])

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
        background: '#fff',
      }}
    />
  )
}
