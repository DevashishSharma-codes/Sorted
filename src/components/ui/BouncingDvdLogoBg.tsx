import { useEffect, useRef } from 'react'

interface BouncingDvdLogoBgProps {
  imageSrc?: string
}

// High-contrast vibrant colors optimized for white background with high pop
const COLOR_PRESETS = [
  { name: 'Electric Teal', filter: 'none' },
  { name: 'Canary Yellow', filter: 'hue-rotate(235deg) saturate(3.0) contrast(1.15)' },
  { name: 'Electric Lime', filter: 'hue-rotate(295deg) saturate(2.8) contrast(1.15)' },
  { name: 'Sky Cyan', filter: 'hue-rotate(20deg) saturate(2.2) contrast(1.15)' },
  { name: 'Sapphire Blue', filter: 'hue-rotate(48deg) saturate(2.2) contrast(1.15)' },
  { name: 'Crimson Red', filter: 'hue-rotate(185deg) saturate(2.8) contrast(1.15)' },
  { name: 'Vibrant Magenta', filter: 'hue-rotate(140deg) saturate(2.6) contrast(1.15)' },
  { name: 'Mint Aqua', filter: 'hue-rotate(320deg) saturate(2.2) contrast(1.15)' },
]

export function BouncingDvdLogoBg({
  imageSrc = '/retro_vhs_logo.png',
}: BouncingDvdLogoBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Motion physics refs for 60fps+ hardware-accelerated movement
  const posRef = useRef({ x: 80, y: 120 })
  const velRef = useRef({ vx: 185, vy: 140 }) // Classic diagonal trajectory (~37 degrees)
  const sizeRef = useRef({ width: 240, height: 360 }) // 2:3 aspect ratio matching original 1024x1536
  const lastTimeRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const colorIndexRef = useRef(0)

  // Visual non-transparent content padding ratios:
  // Source image 1024x1536, bounding box: minX: 168, maxX: 856, minY: 206, maxY: 1372
  const paddingRatio = {
    left: 168 / 1024,
    right: (1024 - 856) / 1024,
    top: 206 / 1536,
    bottom: (1536 - 1372) / 1536,
  }

  useEffect(() => {
    // Determine responsive logo size based on viewport
    const updateSize = () => {
      const minDim = Math.min(window.innerWidth, window.innerHeight)
      if (minDim < 640) {
        sizeRef.current = { width: 170, height: 255 }
      } else if (minDim < 900) {
        sizeRef.current = { width: 210, height: 315 }
      } else {
        sizeRef.current = { width: 250, height: 375 }
      }

      if (logoRef.current) {
        logoRef.current.style.width = `${sizeRef.current.width}px`
        logoRef.current.style.height = `${sizeRef.current.height}px`
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // Initial position: center-left
    posRef.current = {
      x: Math.max(20, Math.floor((window.innerWidth - sizeRef.current.width) * 0.2)),
      y: Math.max(20, Math.floor((window.innerHeight - sizeRef.current.height) * 0.3)),
    }

    lastTimeRef.current = performance.now()

    const animate = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      const screenW = containerRef.current?.clientWidth || window.innerWidth
      const screenH = containerRef.current?.clientHeight || window.innerHeight

      // CRT bezel safe margins so logo bounces inside the visible glass screen
      const padLeft = 28
      const padRight = 28
      const padTop = 24
      const padBottom = 24

      const { width: w, height: h } = sizeRef.current
      let { x, y } = posRef.current
      let { vx, vy } = velRef.current

      // Calculate visual edges of face, CD disc, and "VIDEO" text
      const visualPadLeft = w * paddingRatio.left
      const visualPadRight = w * paddingRatio.right
      const visualPadTop = h * paddingRatio.top
      const visualPadBottom = h * paddingRatio.bottom

      x += vx * dt
      y += vy * dt

      let bounced = false

      // Left edge bounce
      if (x + visualPadLeft <= padLeft) {
        x = padLeft - visualPadLeft
        vx = Math.abs(vx)
        bounced = true
      }
      // Right edge bounce
      else if (x + w - visualPadRight >= screenW - padRight) {
        x = screenW - padRight - w + visualPadRight
        vx = -Math.abs(vx)
        bounced = true
      }

      // Top edge bounce
      if (y + visualPadTop <= padTop) {
        y = padTop - visualPadTop
        vy = Math.abs(vy)
        bounced = true
      }
      // Bottom edge bounce
      else if (y + h - visualPadBottom >= screenH - padBottom) {
        y = screenH - padBottom - h + visualPadBottom
        vy = -Math.abs(vy)
        bounced = true
      }

      // Classic DVD screensaver behavior: Cycle to next color on every edge / corner bounce!
      if (bounced) {
        colorIndexRef.current = (colorIndexRef.current + 1) % COLOR_PRESETS.length
        if (imgRef.current) {
          imgRef.current.style.filter = COLOR_PRESETS[colorIndexRef.current].filter
        }
      }

      posRef.current = { x, y }
      velRef.current = { vx, vy }

      if (logoRef.current) {
        logoRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="absolute top-0 left-0 will-change-transform pointer-events-none"
        style={{
          width: `${sizeRef.current.width}px`,
          height: `${sizeRef.current.height}px`,
        }}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Retro VHS Portrait and Video Disc Logo"
          className="w-full h-full object-contain pointer-events-none select-none block transition-[filter] duration-150 ease-out"
          draggable={false}
        />
      </div>
    </div>
  )
}
