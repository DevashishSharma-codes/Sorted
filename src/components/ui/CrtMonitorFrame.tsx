import React from 'react'
import { PixelGlobe } from './PixelGlobe'
import { ArrowLeft } from 'lucide-react'
import { BouncingDvdLogoBg } from './BouncingDvdLogoBg'
import { AestheticHalftoneVideoBg } from './AestheticHalftoneVideoBg'

interface CrtMonitorFrameProps {
  viewMode: 'intro' | 'loading' | 'folders' | 'player'
  transitionPhase: 'idle' | 'collapsing' | 'expanding'
  onEnterPlayer: () => void
  onBackToIntro: () => void
  onBackToFolders?: () => void
  introContent?: React.ReactNode
  loadingContent?: React.ReactNode
  foldersContent?: React.ReactNode
  playerContent: React.ReactNode
}

export function CrtMonitorFrame({
  viewMode,
  transitionPhase,
  onEnterPlayer,
  onBackToIntro,
  onBackToFolders,
  introContent,
  loadingContent,
  foldersContent,
  playerContent,
}: CrtMonitorFrameProps) {
  const isCollapsing = transitionPhase === 'collapsing'
  const isExpanding = transitionPhase === 'expanding'
  const isTransitioning = isCollapsing || isExpanding
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (viewMode === 'intro' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [viewMode])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#12110e] flex items-center justify-center select-none font-sans">
      {/* ============================================================== */}
      {/* 1. CRT SCREEN INNER VIEWPORT (Framed inside the physical tube) */}
      {/* ============================================================== */}
      <div
        className={`relative w-full h-full sm:w-[94vw] sm:h-[94vh] max-w-[1920px] max-h-[1080px] overflow-hidden flex items-center justify-center animate-crt-flick ${
          viewMode === 'player'
            ? 'bg-white'
            : viewMode === 'folders' || viewMode === 'loading'
            ? 'bg-[#2b6eb5]'
            : 'bg-[#e62b2b]'
        }`}
      >
        {/* ============================================================== */}
        {/* INNER SCREEN DISPLAY WITH TV-OFF / TV-ON ANIMATION             */}
        {/* ============================================================== */}
        <div
          className={`relative w-full h-full flex items-center justify-center ${
            isCollapsing ? 'animate-tv-off' : isExpanding ? 'animate-tv-on' : ''
          }`}
        >
          {/* ------------------------------------------------------------ */}
          {/* VIEW 1: RETRO INTRO SCREEN (Vibrant bright red, DVD screensaver) */}
          {/* ------------------------------------------------------------ */}
          {viewMode === 'intro' && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#e62b2b]">
              {/* Duotone Photocopy Video Background: crisp black xerox silhouettes on vibrant bright red */}
              <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none select-none">
                <video
                  ref={videoRef}
                  src="/arpit_bala_bg.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover grayscale contrast-[200%] brightness-[115%] mix-blend-multiply opacity-80"
                />
              </div>

              {/* Bouncing DVD Screensaver Background Logo Inside CRT (z-5) */}
              {introContent && (
                <div className="absolute inset-0 z-5 pointer-events-none">
                  {introContent}
                </div>
              )}

              {/* 3. Top Bar: Spinning Retro Pixel Earth Globe + System Tag (z-10) */}
              <div className="absolute top-6 inset-x-8 sm:top-10 sm:inset-x-14 z-10 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-2.5">
                  <PixelGlobe size={30} />
                  <span className="hidden sm:inline-block font-mono text-[10px] text-[#faf7ee]/90 font-semibold tracking-widest uppercase">
                    SYS // CH-01
                  </span>
                </div>
              </div>

              {/* 4. Center Content: "Sorted" + Circle Arrow Button */}
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center gap-6 sm:gap-7">
                {/* 1. Main Title: Sorted */}
                <h1
                  className="text-7xl sm:text-8xl md:text-9xl font-bold italic tracking-tight text-[#faf7ee] m-0 leading-none select-none drop-shadow-md"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Cambria, serif' }}
                >
                  Sorted
                </h1>

                {/* 2. Circle Designer Arrow Button (Balanced proportion: not too big, not too small) */}
                <button
                  onClick={onEnterPlayer}
                  className="group w-11 h-11 sm:w-12 sm:h-12 inline-flex items-center justify-center bg-[#faf7ee] hover:bg-white text-neutral-900 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all outline-none cursor-pointer"
                  title="Enter Sorted"
                  aria-label="Enter Sorted"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-neutral-900 transition-transform duration-200 group-hover:translate-y-0.5"
                  >
                    {/* Exact Designer Arrow from user reference, balanced proportion */}
                    <path d="M 9.05,1.25 L 9.74,4.29 L 10.36,8.64 L 10.73,14.09 L 10.73,18.28 L 10.65,18.28 L 10.32,17.09 L 9.66,15.49 L 8.47,13.23 L 6.79,10.77 L 5.23,9.05 L 1.95,12.21 L 2.4,12.37 L 3.83,13.19 L 5.19,14.17 L 6.5,15.32 L 7.53,16.35 L 8.55,17.54 L 9.99,19.55 L 10.97,21.44 L 11.3,22.3 L 11.38,22.71 L 12.57,22.71 L 12.98,21.44 L 13.85,19.75 L 14.83,18.28 L 16.06,16.76 L 17.5,15.28 L 19.14,13.89 L 20.45,12.98 L 22.01,12.16 L 18.69,9.05 L 17.7,10.11 L 16.92,11.1 L 15.2,13.72 L 14.01,16.14 L 13.27,18.32 L 13.23,14.05 L 13.6,8.64 L 14.22,4.29 L 14.54,2.65 L 14.91,1.25 Z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* VIEW 2: 10-SECONDS SCREENSAVER LOADING SCREEN                */}
          {/* ------------------------------------------------------------ */}
          {viewMode === 'loading' && (
            <div className="relative w-full h-full bg-white overflow-hidden">
              {loadingContent}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* VIEW 3: RETRO OS WINDOW WITH MULTIPLE FOLDERS                */}
          {/* ------------------------------------------------------------ */}
          {viewMode === 'folders' && (
            <div className="relative w-full h-full overflow-hidden">
              {foldersContent}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* VIEW 4: 3D OPTICAL TURNTABLE PLAYER (Aesthetic Halftone BG)  */}
          {/* ------------------------------------------------------------ */}
          {viewMode === 'player' && (
            <div className="relative w-full h-full bg-white overflow-hidden">
              {/* Aesthetic Halftone Black & White Waves and Clouds Video Background (z-0) */}
              <div className="absolute inset-0 z-0">
                <AestheticHalftoneVideoBg />
              </div>

              {/* 3D Optical Turntable Scene (z-10, floating over halftone waves & clouds) */}
              <div className="relative w-full h-full z-10 pointer-events-auto">
                {playerContent}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CRT TV-OFF & GLITCH TRANSITION OVERLAYS (z-25 to z-27)         */}
        {/* ============================================================== */}
        {isTransitioning && (
          <>
            {/* Intense TV Static Noise Glitch Burst */}
            <div className="absolute inset-0 z-25 crt-analog-grain animate-static-burst pointer-events-none opacity-90 mix-blend-screen bg-white/20" />

            {/* Horizontal CRT White Flash Slit Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-26 pointer-events-none bg-white animate-flash-line shadow-[0_0_15px_#fff,0_0_35px_#38bdf8]" />

            {/* Tube Blackout Backing during collapse */}
            {isCollapsing && (
              <div className="absolute inset-0 z-24 pointer-events-none bg-black/60 transition-opacity duration-200" />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* RETRO CRT SCREEN EFFECTS (z-20 to z-23)                        */}
        {/* ONLY on intro screen (user requested NO overlay on player screen) */}
        {/* ============================================================== */}
        {viewMode === 'intro' && (
          <>
            {/* Analog TV Grain / Static Noise running over everything */}
            <div className="absolute inset-0 z-20 crt-analog-grain animate-grain pointer-events-none opacity-20 mix-blend-overlay" />

            {/* Horizontal CRT Scanlines cutting cleanly across without crushing red brightness */}
            <div className="absolute inset-0 z-21 crt-tube-lines pointer-events-none opacity-18 mix-blend-multiply" />

            {/* Rolling CRT Scanline beam */}
            <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none z-22 animate-crt-scan opacity-20 mix-blend-screen" />

            {/* CRT Vignette & Screen Edge Curvature */}
            <div className="absolute inset-0 z-23 crt-tube-vignette pointer-events-none opacity-20" />
          </>
        )}
      </div>

      {/* Top-Right Back Button when in player mode */}
      {viewMode === 'player' && (
        <div className="absolute top-4 right-6 z-50 flex items-center">
          <button
            onClick={onBackToFolders || onBackToIntro}
            className="flex items-center gap-1.5 text-xs text-neutral-800 hover:text-neutral-950 font-bold uppercase tracking-wider transition-all cursor-pointer bg-white/90 hover:bg-white px-4 py-2 rounded-full border border-neutral-300 shadow-md outline-none"
            title="Return to folders screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-600" />
            <span>Folders</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. AUTHENTIC CRT MONITOR BEZEL OVERLAY (1920x1080)             */}
      {/* ============================================================== */}
      <img
        src="/crt_monitor_frame_clean.png"
        alt="CRT Monitor"
        className="absolute inset-0 w-full h-full object-fill z-30 pointer-events-none select-none"
      />

      {/* Embossed SORTED brand logo on the bottom plastic bezel */}
      <div className="absolute bottom-[1.4%] left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none flex items-center justify-center">
        <span
          className="font-black text-xl sm:text-2xl md:text-3xl tracking-[0.25em] uppercase text-[#554f3b] px-6 py-0.5"
          style={{
            textShadow: '0.5px 1px 0px rgba(255, 255, 255, 0.45), -0.5px -1px 0px rgba(25, 24, 18, 0.65)',
            backgroundColor: '#8d896f',
            borderRadius: '4px',
          }}
        >
          SORTED
        </span>
      </div>
    </div>
  )
}
