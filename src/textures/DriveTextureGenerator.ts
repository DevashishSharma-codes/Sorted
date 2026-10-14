import * as THREE from 'three'

/**
 * Procedural texture generator replicating the exact reference optical drive:
 * 1. Horizontal brushed stainless steel with stamped '≡ sorted' branding,
 *    recessed screw dimples, and sheet metal seam notches.
 * 2. Injection-molded matte black/charcoal polymer tray with 120mm & 80mm
 *    concentric tiers, corner molded shelves, retaining tabs, and runner tracks.
 * 3. Authentic retro computer beige plastic with chamfered bottom bevel.
 */

export function createGalvanizedChassisTexture(): THREE.CanvasTexture {
  const width = 2048
  const height = 660 // Exact aspect ratio matching reference top plate
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // 1. Base brushed steel gradient (satin metallic sheen from reference photo)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#9ea6af')
  bgGrad.addColorStop(0.25, '#b2bac3')
  bgGrad.addColorStop(0.5, '#bcc4cd')
  bgGrad.addColorStop(0.75, '#b0b8c1')
  bgGrad.addColorStop(1, '#9ba3ac')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 2. High-density horizontal brushed metal grain
  for (let y = 0; y < height; y += 1) {
    if (Math.random() > 0.25) {
      const alpha = 0.02 + Math.random() * 0.05
      ctx.fillStyle = Math.random() > 0.5
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha * 0.7})`
      ctx.fillRect(0, y, width, 1)
    }
  }

  // 3. Vertical soft anisotropic lighting bands
  const sheen = ctx.createLinearGradient(0, 0, width, 0)
  sheen.addColorStop(0, 'rgba(0, 0, 0, 0.08)')
  sheen.addColorStop(0.2, 'rgba(255, 255, 255, 0.12)')
  sheen.addColorStop(0.4, 'rgba(0, 0, 0, 0.04)')
  sheen.addColorStop(0.65, 'rgba(255, 255, 255, 0.15)')
  sheen.addColorStop(0.85, 'rgba(0, 0, 0, 0.06)')
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.12)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, width, height)

  // 4. Stamped horizontal crease line across near top
  const creaseY = 64
  // Dark crease shadow
  ctx.fillStyle = 'rgba(40, 45, 52, 0.55)'
  ctx.fillRect(0, creaseY - 2, width, 3)
  // Sharp highlight line
  ctx.fillStyle = 'rgba(250, 253, 255, 0.75)'
  ctx.fillRect(0, creaseY + 1, width, 3)

  // 5. Top-left and top-right corner chamfer notch details (matching photo)
  // Left corner tab notch
  ctx.fillStyle = '#6e7681'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(80, 0)
  ctx.lineTo(120, 40)
  ctx.lineTo(120, 60)
  ctx.lineTo(0, 60)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.fillRect(118, 0, 3, 40)

  // Right corner tab notch
  ctx.fillStyle = '#6e7681'
  ctx.beginPath()
  ctx.moveTo(width, 0)
  ctx.lineTo(width - 80, 0)
  ctx.lineTo(width - 120, 40)
  ctx.lineTo(width - 120, 60)
  ctx.lineTo(width, 60)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.fillRect(width - 121, 0, 3, 40)

  // 6. Side folded seams & tabs on left and right edges
  const seamW = 34
  // Left seam
  ctx.fillStyle = 'rgba(30, 35, 42, 0.65)'
  ctx.fillRect(seamW, 0, 3, height)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.fillRect(seamW + 3, 0, 2, height)
  // Right seam
  ctx.fillStyle = 'rgba(30, 35, 42, 0.65)'
  ctx.fillRect(width - seamW - 5, 0, 3, height)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.fillRect(width - seamW - 2, 0, 2, height)

  // 7. Embossed/Stamped "≡ sorted" branding in the center (EXACT MATCH!)
  const centerX = width / 2
  const logoY = height * 0.46

  ctx.save()
  // Stamped shadow pass (upper-left inner indentation)
  ctx.fillStyle = '#454c55'
  drawLogo(ctx, centerX - 1.5, logoY - 1.5)

  // Stamped highlight pass (lower-right reflection)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  drawLogo(ctx, centerX + 1.5, logoY + 1.5)

  // Stamped face fill (deep etched metal tone)
  ctx.fillStyle = '#565e68'
  drawLogo(ctx, centerX, logoY)
  ctx.restore()

  function drawLogo(c: CanvasRenderingContext2D, cx: number, cy: number) {
    c.save()
    // A. Icon "≡" (3 stacked horizontal rounded bars)
    const iconW = 44
    const barH = 7
    const barR = 3.5
    const barGap = 6.5
    const iconX = cx - 145
    const topBarY = cy - barH * 1.5 - barGap

    for (let i = 0; i < 3; i++) {
      const by = topBarY + i * (barH + barGap)
      c.beginPath()
      c.roundRect(iconX, by, iconW, barH, barR)
      c.fill()
    }

    // B. Text "sorted"
    c.font = '600 58px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif'
    c.textAlign = 'left'
    c.textBaseline = 'middle'
    c.letterSpacing = '-0.5px'
    c.fillText('sorted', iconX + iconW + 20, cy)
    c.restore()
  }

  // 8. Stamped circular dimples & Philips screws in upper corners
  function drawScrewInDimple(cx: number, cy: number, dimpleR: number) {
    // Concave dimple gradient
    const dimple = ctx.createRadialGradient(cx - dimpleR * 0.2, cy - dimpleR * 0.2, dimpleR * 0.4, cx, cy, dimpleR)
    dimple.addColorStop(0, 'rgba(0, 0, 0, 0.38)')
    dimple.addColorStop(0.7, 'rgba(40, 45, 52, 0.20)')
    dimple.addColorStop(0.92, 'rgba(255, 255, 255, 0.65)')
    dimple.addColorStop(1, 'rgba(0, 0, 0, 0.15)')
    ctx.fillStyle = dimple
    ctx.beginPath()
    ctx.arc(cx, cy, dimpleR, 0, Math.PI * 2)
    ctx.fill()

    // Screw head dome
    const screwR = dimpleR * 0.66
    const screwGrad = ctx.createRadialGradient(cx - screwR * 0.35, cy - screwR * 0.35, 2, cx, cy, screwR)
    screwGrad.addColorStop(0, '#f8fafc')
    screwGrad.addColorStop(0.4, '#cbd3dc')
    screwGrad.addColorStop(0.85, '#8c95a0')
    screwGrad.addColorStop(1, '#5c646e')
    ctx.fillStyle = screwGrad
    ctx.beginPath()
    ctx.arc(cx, cy, screwR, 0, Math.PI * 2)
    ctx.fill()

    // Bevel ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, screwR, -Math.PI * 0.85, -Math.PI * 0.15)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(30, 35, 40, 0.55)'
    ctx.beginPath()
    ctx.arc(cx, cy, screwR, Math.PI * 0.15, Math.PI * 0.85)
    ctx.stroke()

    // Fine Philips '+' crosshead slot
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(0.3)
    const armL = screwR * 0.72
    const armW = screwR * 0.20

    // Deep slot
    ctx.fillStyle = '#1e2126'
    ctx.fillRect(-armL, -armW / 2, armL * 2, armW)
    ctx.fillRect(-armW / 2, -armL, armW, armL * 2)

    // Center circular deep punch
    ctx.beginPath()
    ctx.arc(0, 0, armW * 0.65, 0, Math.PI * 2)
    ctx.fill()

    // Inner bevel highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(-armL, armW / 2 - 1, armL * 2, 1)
    ctx.fillRect(armW / 2 - 1, -armL, 1, armL * 2)
    ctx.restore()
  }

  const screwY = height * 0.44
  const screwInset = 165
  drawScrewInDimple(screwInset, screwY, 52)
  drawScrewInDimple(width - screwInset, screwY, 52)

  // 9. Bottom edge highlight line
  const bottomBevel = ctx.createLinearGradient(0, height - 6, 0, height)
  bottomBevel.addColorStop(0, 'rgba(255, 255, 255, 0.7)')
  bottomBevel.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
  ctx.fillStyle = bottomBevel
  ctx.fillRect(0, height - 6, width, 6)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createTrayPlasticTexture(): THREE.CanvasTexture {
  const size = 2048
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 1. Dark charcoal/graphite matte plastic base (#1f2227)
  ctx.fillStyle = '#202328'
  ctx.fillRect(0, 0, size, size)

  // 2. High-frequency micro-stippling noise (injection molded polymer)
  const imgData = ctx.getImageData(0, 0, size, size)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 11
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Coordinate references matching 3D UV space
  const cx = size / 2
  const cy = size * 0.50

  // 3. 120mm Outer Circular Recess Well (Radius ~720)
  const r120 = 720
  ctx.save()
  // Recessed floor slight shadow
  const wellGrad = ctx.createRadialGradient(cx, cy, 320, cx, cy, r120)
  wellGrad.addColorStop(0, 'rgba(0, 0, 0, 0.16)')
  wellGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.28)')
  wellGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)')
  ctx.fillStyle = wellGrad
  ctx.beginPath()
  ctx.arc(cx, cy, r120, 0, Math.PI * 2)
  ctx.fill()

  // 120mm outer highlight groove rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(cx, cy, r120, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.lineWidth = 3.0
  ctx.beginPath()
  ctx.arc(cx, cy, r120 - 4, 0, Math.PI * 2)
  ctx.stroke()

  // 4. 80mm Stepped Crescent Ledge (Radius ~500)
  const r80 = 500
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(cx, cy, r80, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.lineWidth = 3.0
  ctx.beginPath()
  ctx.arc(cx, cy, r80 - 4, 0, Math.PI * 2)
  ctx.stroke()

  // 5. Spindle Inner Arc Highlight (Radius ~360)
  const rSpindle = 360
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(cx, cy, rSpindle, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.lineWidth = 2.0
  ctx.beginPath()
  ctx.arc(cx, cy, rSpindle - 3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 6. Corner Raised Panels (Top-left, top-right, bottom-left, bottom-right)
  function drawCornerBevels(x: number, y: number, w: number, h: number, _flipX: boolean) {
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
    ctx.lineWidth = 2.5
    ctx.strokeRect(x, y, w, h)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }

  // Top-left and top-right molded corner panels
  drawCornerBevels(170, 180, 240, 480, false)
  drawCornerBevels(size - 410, 180, 240, 480, true)

  // Bottom-left and bottom-right molded corner panels
  drawCornerBevels(170, size - 640, 240, 420, false)
  drawCornerBevels(size - 410, size - 640, 240, 420, true)

  // 7. Side Guide Rails with Track Channels
  const railW = 140
  // Left rail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.fillRect(40, 0, railW, size)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)'
  ctx.fillRect(40 + railW, 0, 3, size)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(80, 0, 45, size) // Central runner track groove

  // Right rail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.fillRect(size - 40 - railW, 0, railW, size)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)'
  ctx.fillRect(size - 40 - railW - 3, 0, 3, size)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(size - 80 - 45, 0, 45, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createBeigePlasticTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Authentic 90s PC Ivory/Beige tone (#ded7c8)
  ctx.fillStyle = '#ded7c8'
  ctx.fillRect(0, 0, size, size)

  // Subtle warm polymer micro-grain
  const imgData = ctx.getImageData(0, 0, size, size)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 7
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.85))
  }
  ctx.putImageData(imgData, 0, 0)

  // Top highlight edge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.fillRect(0, 0, size, 4)

  // Bottom chamfer shadow (#a8a192)
  const bottomChamfer = ctx.createLinearGradient(0, size - 36, 0, size)
  bottomChamfer.addColorStop(0, 'rgba(0, 0, 0, 0)')
  bottomChamfer.addColorStop(1, 'rgba(0, 0, 0, 0.32)')
  ctx.fillStyle = bottomChamfer
  ctx.fillRect(0, size - 36, size, 36)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
