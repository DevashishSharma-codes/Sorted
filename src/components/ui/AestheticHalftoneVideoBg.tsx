import { useState } from 'react'

interface AestheticHalftoneVideoBgProps {
  className?: string
}

type BgMode = 'combo' | 'waves' | 'clouds'

export function AestheticHalftoneVideoBg({ className = '' }: AestheticHalftoneVideoBgProps) {
  const [mode, setMode] = useState<BgMode>('combo')

  return (
    <div className={`relative w-full h-full bg-white overflow-hidden pointer-events-none select-none ${className}`}>
      {/* ============================================================== */}
      {/* HIGH-KEY VIDEO LAYERS (BLACK & WHITE / MOSTLY WHITE)           */}
      {/* ============================================================== */}

      {/* Layer 1: Ocean Waves (Deep foaming ripples & crests) */}
      {(mode === 'combo' || mode === 'waves') && (
        <video
          key="waves-video"
          src="/waves_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 grayscale contrast-[190%] brightness-[135%] mix-blend-multiply ${
            mode === 'combo' ? 'opacity-65' : 'opacity-80'
          }`}
        />
      )}

      {/* Layer 2: Ethereal Billowing Clouds (Atmospheric high-key drift) */}
      {(mode === 'combo' || mode === 'clouds') && (
        <video
          key="clouds-video"
          src="/clouds_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 grayscale contrast-[180%] brightness-[130%] mix-blend-multiply ${
            mode === 'combo' ? 'opacity-40' : 'opacity-75'
          }`}
        />
      )}

      {/* ============================================================== */}
      {/* HALFTONE SCREENPRINT DOT RASTER OVERLAY                         */}
      {/* Creates the iconic newspaper / risograph / photocopy dot grid  */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.75) 1.25px, transparent 1.25px)',
          backgroundSize: '6px 6px',
        }}
      />

      {/* Secondary diagonal fine screen for authentic offset print angle (45 deg) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.12) 0px, rgba(0, 0, 0, 0.12) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Soft Vignette & Paper Fiber Bleach Overlay for Crisp White Aesthetics */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.75)_100%)]" />

      {/* ============================================================== */}
      {/* SUBTLE INTERACTIVE MODE SWITCHER (Bottom Right)               */}
      {/* Lets user effortlessly toggle Waves + Clouds / Waves / Clouds  */}
      {/* ============================================================== */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-neutral-300 shadow-sm text-[10px] font-mono tracking-wider text-neutral-600 uppercase select-none transition-all hover:bg-white">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
        <span className="text-neutral-400 font-semibold mr-1">BG:</span>
        <button
          type="button"
          onClick={() => setMode('combo')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
            mode === 'combo'
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
          title="Blended Waves & Clouds"
        >
          Waves+Clouds
        </button>
        <span className="text-neutral-300">/</span>
        <button
          type="button"
          onClick={() => setMode('waves')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
            mode === 'waves'
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
          title="Ocean Waves Only"
        >
          Waves
        </button>
        <span className="text-neutral-300">/</span>
        <button
          type="button"
          onClick={() => setMode('clouds')}
          className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
            mode === 'clouds'
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
          title="Clouds Only"
        >
          Clouds
        </button>
      </div>
    </div>
  )
}
