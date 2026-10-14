import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Maximize2, Minimize2, Play, Pause, RotateCcw } from 'lucide-react'

interface DvdScreensaverProps {
  isOpen: boolean
  onClose: () => void
  imageSrc?: string
}

export function DvdScreensaver({
  isOpen,
  onClose,
  imageSrc = '/retro_vhs_logo.png',
}: DvdScreensaverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [bounceCount, setBounceCount] = useState(0)
  const [cornerHitCount, setCornerHitCount] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showCornerFlash, setShowCornerFlash] = useState(false)

  // Motion physics state in refs for 60fps+ stutter-free animation
  const posRef = useRef({ x: 100, y: 100 })
  const velRef = useRef({ vx: 220, vy: 165 }) // Classic non-45-degree trajectory
  const logoSizeRef = useRef({ width: 220, height: 330 }) // 2:3 aspect ratio matching 1024x1536
  const lastTimeRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const logoElementRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<number | null>(null)

  // Ratio of visual content padding inside 1024x1536 image
  // Bounding box of non-transparent pixels: minX: 168, maxX: 856, minY: 206, maxY: 1372
  const paddingRatio = {
    left: 168 / 1024,
    right: (1024 - 856) / 1024,
    top: 206 / 1536,
    bottom: (1536 - 1372) / 1536,
  }

  // Handle controls auto-hide after inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false)
    }, 3200)
  }, [])

  // Keyboard shortcut listener (Escape, F, Space)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer()
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        } else {
          onClose()
        }
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPaused((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, resetControlsTimer])

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleResetPosition = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    posRef.current = {
      x: Math.max(10, Math.random() * (rect.width - logoSizeRef.current.width - 20)),
      y: Math.max(10, Math.random() * (rect.height - logoSizeRef.current.height - 20)),
    }
    velRef.current = {
      vx: (Math.random() > 0.5 ? 1 : -1) * 220,
      vy: (Math.random() > 0.5 ? 1 : -1) * 165,
    }
  }

  // Main animation loop
  useEffect(() => {
    if (!isOpen) return

    // Initialize starting position
    const initW = window.innerWidth
    const initH = window.innerHeight
    const lw = logoSizeRef.current.width
    const lh = logoSizeRef.current.height
    posRef.current = {
      x: Math.floor((initW - lw) * 0.25),
      y: Math.floor((initH - lh) * 0.3),
    }
    velRef.current = { vx: 220, vy: 165 }
    lastTimeRef.current = performance.now()

    const animate = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05) // cap at 50ms to prevent jumping
      lastTimeRef.current = now

      if (!isPaused && containerRef.current && logoElementRef.current) {
        const bounds = containerRef.current.getBoundingClientRect()
        const width = bounds.width
        const height = bounds.height

        const w = logoSizeRef.current.width
        const h = logoSizeRef.current.height

        let { x, y } = posRef.current
        let { vx, vy } = velRef.current

        // Calculate visual bounds so face, CD, and VIDEO text bounce exactly on edges
        const visualLeftPad = w * paddingRatio.left
        const visualRightPad = w * paddingRatio.right
        const visualTopPad = h * paddingRatio.top
        const visualBottomPad = h * paddingRatio.bottom

        x += vx * speedMultiplier * dt
        y += vy * speedMultiplier * dt

        let hitX = false
        let hitY = false

        // Left boundary collision
        if (x + visualLeftPad <= 0) {
          x = -visualLeftPad
          vx = Math.abs(vx)
          hitX = true
        }
        // Right boundary collision
        else if (x + w - visualRightPad >= width) {
          x = width - w + visualRightPad
          vx = -Math.abs(vx)
          hitX = true
        }

        // Top boundary collision
        if (y + visualTopPad <= 0) {
          y = -visualTopPad
          vy = Math.abs(vy)
          hitY = true
        }
        // Bottom boundary collision
        else if (y + h - visualBottomPad >= height) {
          y = height - h + visualBottomPad
          vy = -Math.abs(vy)
          hitY = true
        }

        if (hitX || hitY) {
          setBounceCount((c) => c + 1)
          if (hitX && hitY) {
            // Iconic Corner Hit!
            setCornerHitCount((c) => c + 1)
            setShowCornerFlash(true)
            window.setTimeout(() => setShowCornerFlash(false), 800)
          }
        }

        posRef.current = { x, y }
        velRef.current = { vx, vy }

        // High-performance hardware-accelerated transform
        logoElementRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    resetControlsTimer()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isOpen, isPaused, speedMultiplier, resetControlsTimer])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      onPointerMove={resetControlsTimer}
      onClick={resetControlsTimer}
      className="fixed inset-0 z-50 bg-[#000000] select-none overflow-hidden cursor-default"
      style={{ touchAction: 'none' }}
    >
      {/* Corner Hit Celebration Aura */}
      {showCornerFlash && (
        <div className="absolute inset-0 pointer-events-none bg-cyan-400/20 animate-pulse transition-opacity duration-500 z-10" />
      )}

      {/* ============================================================== */}
      {/* BOUNCING LOGO ELEMENT: Fixed Camera, Zero Distortions          */}
      {/* ============================================================== */}
      <div
        ref={logoElementRef}
        className="absolute top-0 left-0 will-change-transform pointer-events-none"
        style={{
          width: `${logoSizeRef.current.width}px`,
          height: `${logoSizeRef.current.height}px`,
        }}
      >
        <img
          src={imageSrc}
          alt="Retro VHS Portrait and Video Disc"
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* ============================================================== */}
      {/* FLOATING RETRO CONTROL OVERLAY (Auto-fades on idle)           */}
      {/* ============================================================== */}
      <div
        className={`absolute inset-x-0 top-0 p-6 flex justify-between items-center transition-opacity duration-300 z-30 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top-left Retro Title & Stats */}
        <div className="flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 shadow-xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-semibold tracking-wider text-neutral-300 uppercase">
            DVD Screensaver
          </span>
          <span className="text-xs font-mono text-neutral-500">|</span>
          <span className="text-xs font-mono text-neutral-400">
            Bounces: <strong className="text-cyan-300">{bounceCount}</strong>
          </span>
          {cornerHitCount > 0 && (
            <span className="text-xs font-mono text-amber-300 font-bold">
              • Corner Hits: {cornerHitCount}
            </span>
          )}
        </div>

        {/* Top-right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer shadow-lg outline-none"
            title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Speed Presets */}
          <div className="flex bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-800 p-1 shadow-lg text-xs font-mono">
            {[0.75, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  speedMultiplier === spd
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Reset position */}
          <button
            onClick={handleResetPosition}
            className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer shadow-lg outline-none"
            title="Randomize Position"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer shadow-lg outline-none"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Screensaver */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-rose-400 border border-neutral-800 transition-colors cursor-pointer shadow-lg outline-none"
            title="Exit Screensaver (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`absolute inset-x-0 bottom-4 flex justify-center items-center transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-80' : 'opacity-0'
        }`}
      >
        <span className="text-[11px] font-mono text-neutral-500 bg-neutral-950/70 px-3 py-1 rounded-full border border-neutral-800/60">
          Press [Space] to pause • [F] for Fullscreen • [Esc] to exit
        </span>
      </div>
    </div>
  )
}
