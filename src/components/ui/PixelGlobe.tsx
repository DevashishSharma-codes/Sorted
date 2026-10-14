import { useEffect, useRef } from 'react'

export function PixelGlobe({ size = 32 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let offset = 0

    // Bitmap representation of world continents on a 32x16 grid
    const worldGrid = [
      '..####...######..',
      '.######.########.',
      '########..#####..',
      '..####.....###...',
      '..###....#####...',
      '...##...#######..',
      '........######...',
      '........#####....',
      '........####.....',
      '.......####......',
      '......#####......',
      '.....#####.......',
      '....######.......',
      '....#####........',
      '.....###.........',
      '......#..........',
    ]

    const render = () => {
      ctx.clearRect(0, 0, size, size)

      const radius = size / 2
      const cx = radius
      const cy = radius

      // Draw ocean sphere
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2)
      ctx.clip()

      // Ocean deep blue background
      ctx.fillStyle = '#1e3a8a'
      ctx.fillRect(0, 0, size, size)

      // Ocean highlight / shading for 3D sphere look
      const oceanGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 2, cx, cy, radius)
      oceanGrad.addColorStop(0, '#3b82f6')
      oceanGrad.addColorStop(0.7, '#1d4ed8')
      oceanGrad.addColorStop(1, '#0f172a')
      ctx.fillStyle = oceanGrad
      ctx.fillRect(0, 0, size, size)

      // Draw green continents wrapped horizontally around cylinder/sphere
      ctx.fillStyle = '#22c55e'
      const rows = worldGrid.length
      const cols = worldGrid[0].length
      const pxSize = size / 16

      offset = (offset + 0.12) % cols

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols * 2; x++) {
          const sampleX = Math.floor((x + offset) % cols)
          if (worldGrid[y][sampleX] === '#') {
            // Spherical projection on x: compress edges
            const normalizedX = (x / (cols * 2)) * 2 - 1
            if (normalizedX >= -1 && normalizedX <= 1) {
              const sphereX = cx + normalizedX * radius * 0.95
              const sphereY = (y / rows) * size
              ctx.fillRect(sphereX, sphereY, pxSize * 1.2, pxSize * 1.1)
            }
          }
        }
      }

      // Outer CRT glass shine overlay
      const shine = ctx.createLinearGradient(0, 0, size, size)
      shine.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
      shine.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)')
      shine.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx.fillStyle = shine
      ctx.fillRect(0, 0, size, size)

      ctx.restore()

      // Crisp border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      animId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="inline-block rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] select-none pointer-events-none"
    />
  )
}
