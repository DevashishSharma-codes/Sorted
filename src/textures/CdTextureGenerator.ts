import * as THREE from 'three'
import type { DiscData } from '../data/discCatalog'

/**
 * Generates photorealistic retro CD textures matching the exact reference designs
 * from previouslyinstalled.com (Blue creative & graphics, Silver computer tools,
 * Grey cd & dvd tools, Yellow multimedia, White/Red programming, White ruled interactive tools).
 */
export function createCdTexture(disc: DiscData): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const center = size / 2
  const outerR = size * 0.485
  const hubOuterR = size * 0.20
  const hubInnerR = size * 0.082

  ctx.save()

  // 1. Clip to circular outer disc perimeter
  ctx.beginPath()
  ctx.arc(center, center, outerR, 0, Math.PI * 2)
  ctx.clip()

  // Base background fill
  ctx.fillStyle = disc.primaryColor
  ctx.fillRect(0, 0, size, size)

  // 2. Realistic optical disc metallic radial gradient sheen
  const grad = ctx.createRadialGradient(center, center, hubOuterR, center, center, outerR)
  if (disc.id === 2) {
    // Disc 2: Metallic silver disc
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.40)')
    grad.addColorStop(0.25, 'rgba(220, 225, 235, 0.20)')
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)')
    grad.addColorStop(0.75, 'rgba(195, 205, 220, 0.15)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.35)')
  } else if (disc.id === 4) {
    // Disc 4: Golden Yellow
    grad.addColorStop(0, 'rgba(255, 245, 180, 0.30)')
    grad.addColorStop(0.4, 'rgba(220, 160, 0, 0.15)')
    grad.addColorStop(0.7, 'rgba(255, 255, 210, 0.35)')
    grad.addColorStop(1, 'rgba(200, 140, 0, 0.20)')
  } else {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
    grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.06)')
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.30)')
    grad.addColorStop(0.85, 'rgba(0, 0, 0, 0.10)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.20)')
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // 3. Holographic rainbow diffraction spectrum flares (especially prominent on Silver disc 2 & light discs)
  if (disc.id === 2 || disc.primaryColor === '#e2e8f0') {
    const flareAngles = [-0.65, 0.55, 1.85, 2.75]
    flareAngles.forEach((ang) => {
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(ang)

      // Double-sided diffraction cone
      const rainbowGrad = ctx.createLinearGradient(-140, 0, 140, 0)
      rainbowGrad.addColorStop(0.0, 'rgba(255, 0, 128, 0.0)')
      rainbowGrad.addColorStop(0.15, 'rgba(0, 220, 255, 0.35)')
      rainbowGrad.addColorStop(0.35, 'rgba(0, 255, 140, 0.40)')
      rainbowGrad.addColorStop(0.55, 'rgba(255, 235, 20, 0.45)')
      rainbowGrad.addColorStop(0.75, 'rgba(255, 80, 40, 0.38)')
      rainbowGrad.addColorStop(0.90, 'rgba(255, 0, 220, 0.30)')
      rainbowGrad.addColorStop(1.0, 'rgba(255, 0, 128, 0.0)')

      ctx.fillStyle = rainbowGrad
      ctx.beginPath()
      ctx.moveTo(-25, hubOuterR)
      ctx.lineTo(25, hubOuterR)
      ctx.lineTo(150, outerR)
      ctx.lineTo(-150, outerR)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
  }

  // 4. Subtle concentric microgroove rings
  ctx.lineWidth = 1
  for (let r = hubOuterR + 15; r < outerR - 10; r += 28) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.beginPath()
    ctx.arc(center, center, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Helper function for authentic marker handwriting with slight texture
  const drawMarker = (
    text: string,
    x: number,
    y: number,
    angle: number,
    fontSize: number,
    color = '#111827'
  ) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = color
    ctx.font = `italic 700 ${fontSize}px "Segoe Print", "Chalkboard SE", "Comic Sans MS", "Plus Jakarta Sans", cursive, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // Slight marker blur / bleed
    ctx.shadowColor = color
    ctx.shadowBlur = 1.5
    ctx.fillText(text, 0, 0)
    ctx.shadowBlur = 0
    ctx.restore()
  }

  // 5. INDIVIDUAL DISC STYLES MATCHING REFERENCE SCREENSHOT
  if (disc.id === 1) {
    // =================================================================
    // 1. Blue Disc ("creative & graphics")
    // =================================================================
    // White curved strip on bottom-left sweeping from 7 o'clock to 9 o'clock
    ctx.save()
    ctx.beginPath()
    ctx.arc(center, center, outerR * 0.96, Math.PI * 0.65, Math.PI * 1.15, false)
    ctx.arc(center, center, outerR * 0.68, Math.PI * 1.15, Math.PI * 0.65, true)
    ctx.closePath()
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Handwriting inside the white band: "creative & graphics"
    drawMarker('creative & graphics', center - 230, center + 140, -0.48, 48, '#0f172a')
    ctx.restore()

    // 1x - 52x stamp badge in top-left
    ctx.save()
    ctx.translate(center - 220, center - 160)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(0, 0, 52, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('1x - 52x', 0, -4)
    ctx.font = '13px sans-serif'
    ctx.fillText('COMPATIBLE', 0, 18)
    ctx.restore()

    // CD-R & 80 Minutos / 700 Mb on right
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('CD-R', center + 340, center + 110)
    ctx.font = '16px monospace'
    ctx.fillText('80 Minutos', center + 340, center + 140)
    ctx.fillText('700 MB', center + 340, center + 165)
  } else if (disc.id === 2) {
    // =================================================================
    // 2. Silver Disc ("computer tools" 48X)
    // =================================================================
    // Marker handwriting angled upward across left: "computer tools"
    drawMarker('computer tools', center - 180, center - 40, -0.42, 62, '#0f172a')

    // 48X badge on bottom right
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 44px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('48X', center + 160, center + 220)
    ctx.font = '16px monospace'
    ctx.fillText('80min / 700MB', center + 160, center + 250)

    // CD-R logo
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('CD-R', center + 160, center + 175)
  } else if (disc.id === 3) {
    // =================================================================
    // 3. Grey Disc ("cd & dvd tools" with technical grid box)
    // =================================================================
    // Marker handwriting across top left: "cd & dvd tools"
    drawMarker('cd & dvd tools', center - 160, center - 160, -0.32, 60, '#0f172a')

    // Stamped spec box on upper right
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 3
    const boxX = center + 140
    const boxY = center - 240
    const boxW = 160
    const boxH = 150
    ctx.strokeRect(boxX, boxY, boxW, boxH)
    ctx.beginPath()
    ctx.moveTo(boxX, boxY + 50)
    ctx.lineTo(boxX + boxW, boxY + 50)
    ctx.moveTo(boxX, boxY + 100)
    ctx.lineTo(boxX + boxW, boxY + 100)
    ctx.stroke()

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('700mb', boxX + boxW / 2, boxY + 34)
    ctx.fillText('52x', boxX + boxW / 2, boxY + 84)
    ctx.fillText('80min', boxX + boxW / 2, boxY + 134)

    // Ruled lines across bottom half
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)'
    ctx.lineWidth = 2
    for (let ly = center + 140; ly < center + 340; ly += 38) {
      ctx.beginPath()
      ctx.moveTo(center - 300, ly)
      ctx.lineTo(center + 300, ly)
      ctx.stroke()
    }

    // CD-R text at bottom left
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 30px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('CD-R', center - 240, center + 260)
  } else if (disc.id === 4) {
    // =================================================================
    // 4. Yellow Disc ("Double Density CD-R 1.3GB Multimedia")
    // =================================================================
    // Double Density CD-R in orange/red on top left
    ctx.fillStyle = '#c2410c'
    ctx.font = 'italic bold 26px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Double Density', center - 380, center - 50)
    ctx.font = 'bold 44px monospace'
    ctx.fillText('CD-R', center - 380, center - 5)

    // 1.3GB on top right
    ctx.fillStyle = '#c2410c'
    ctx.font = 'bold 48px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('1.3GB', center + 380, center - 20)

    // Compact disc logo
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('COMPACT DISC', center + 380, center + 15)

    // Large prominent black sharpie handwriting in center-bottom: "Multimedia"
    drawMarker('Multimedia', center, center + 180, 0.05, 78, '#0a0a0a')
  } else if (disc.id === 5) {
    // =================================================================
    // 5. White/Red Disc ("CD-R74 programming")
    // =================================================================
    // Curved red swoosh arc on left side
    ctx.save()
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.arc(center, center, outerR * 0.76, Math.PI * 0.72, Math.PI * 1.55)
    ctx.stroke()
    ctx.restore()

    // CD-R74 in bold red
    ctx.save()
    ctx.translate(center - 190, center + 20)
    ctx.rotate(-0.35)
    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 50px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('CD-R74', 0, 0)
    ctx.restore()

    // Marker handwriting: "programming" curved on right
    drawMarker('programming', center + 180, center + 80, 0.85, 60, '#1e293b')

    // Disc logo
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 18px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('74 MIN / 650 MB', center + 160, center - 160)
  } else {
    // =================================================================
    // 6. White Ruled Disc ("interactive tools" / 12x)
    // =================================================================
    // 12x speed badge at top left
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 30px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('12x', center - 280, center - 160)

    // Marker handwriting: "inte..." / "interactive tools"
    drawMarker('interactive tools', center + 60, center - 180, 0.12, 62, '#0f172a')

    // Ruled Title and Date lines
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'left'

    ctx.fillText('TITLE', center - 300, center + 160)
    ctx.beginPath()
    ctx.moveTo(center - 220, center + 160)
    ctx.lineTo(center + 280, center + 160)
    ctx.stroke()

    ctx.fillText('DATE', center - 300, center + 230)
    ctx.beginPath()
    ctx.moveTo(center - 220, center + 230)
    ctx.lineTo(center + 280, center + 230)
    ctx.stroke()
  }

  // 6. Authentic outer perimeter compact disc laser etching
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
  ctx.font = 'bold 14px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('COMPACT DISC // RECORDABLE // 700MB 80MIN', center, size - 26)

  // 7. Clear polycarbonate inner clamping hub
  ctx.beginPath()
  ctx.arc(center, center, hubOuterR, 0, Math.PI * 2)
  // Transparent polycarbonate look with faint plastic shine
  ctx.fillStyle = 'rgba(235, 240, 248, 0.55)'
  ctx.fill()

  // Fine concentric plastic ridges in hub
  ctx.strokeStyle = 'rgba(180, 195, 215, 0.65)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(center, center, hubOuterR - 2, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(center, center, hubOuterR * 0.74, 0, Math.PI * 2)
  ctx.stroke()

  // Serial laser etching in inner hub ring
  ctx.save()
  ctx.translate(center, center)
  ctx.rotate(0.4)
  ctx.fillStyle = 'rgba(70, 85, 105, 0.75)'
  ctx.font = 'bold 12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`*IFPI L011* SORTED-MEDIA-00${disc.id}`, 0, hubOuterR * 0.88)
  ctx.restore()

  // 8. Spindle center hole: completely cut out so the background shows through
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(center, center, hubInnerR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}
