import { useState, useEffect, useRef } from 'react'
import { BouncingDvdLogoBg } from './BouncingDvdLogoBg'

interface ScreensaverLoadingScreenProps {
  onComplete: () => void
  durationSeconds?: number
}

const TRANSFER_FILES = [
  'Arpit_Bala_Vocals_24bit.wav',
  'Sort_It_4_Ya_Master_Stem.cda',
  'Karan_Kanchan_Beat_140bpm.aiff',
  'Chaar_Diwaari_Sub_Bass.flac',
  'Gulaab_Audio_Density_Mix.pcm',
  'Sorted_Archive_Catalog.dat',
  'CRT_Electron_Shader_Cache.bin',
]

const RETRO_STATUS_MESSAGES = [
  'Searching optical disc directory...',
  'Reading sector blocks 0x00FF to 0x7E00...',
  'Decompressing 16-bit 44.1kHz audio buffers...',
  'Buffering Arpit Bala session stems...',
  'Transferring audio tracks to memory...',
  'Mounting virtual folder file system...',
  'Finalizing Sorted OS desktop...',
]

export function ScreensaverLoadingScreen({
  onComplete,
  durationSeconds = 10,
}: ScreensaverLoadingScreenProps) {
  const [progress, setProgress] = useState(0) // 0 to 100
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const completedRef = useRef(false)

  // 10-second timer countdown
  useEffect(() => {
    const startTime = performance.now()
    const totalMs = durationSeconds * 1000

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const currentProgress = Math.min((elapsed / totalMs) * 100, 100)
      const remaining = Math.max(0, (totalMs - elapsed) / 1000)

      setProgress(currentProgress)
      setSecondsRemaining(remaining)

      const fileIdx = Math.min(
        Math.floor((currentProgress / 100) * TRANSFER_FILES.length),
        TRANSFER_FILES.length - 1
      )
      setCurrentFileIndex(fileIdx)

      if (elapsed >= totalMs && !completedRef.current) {
        completedRef.current = true
        clearInterval(interval)
        onComplete()
      }
    }, 40)

    return () => clearInterval(interval)
  }, [durationSeconds, onComplete])

  const handleSkip = () => {
    if (!completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }

  // Calculate segmented progress bar blocks (classic Windows 24 blocks)
  const totalBlocks = 24
  const activeBlocks = Math.min(Math.floor((progress / 100) * totalBlocks), totalBlocks)

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none font-sans">
      {/* ============================================================== */}
      {/* 0. WINDOWS XP BLISS WALLPAPER BACKGROUND (z-0)                 */}
      {/* ============================================================== */}
      <img
        src="/windows_xp_bliss.jpg"
        alt="Windows XP Bliss Wallpaper"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />

      {/* ============================================================== */}
      {/* 1. BOUNCING DVD SCREENSAVER LOGO OVER BLISS BG (z-1)           */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <BouncingDvdLogoBg imageSrc="/retro_vhs_logo.png" />
      </div>

      {/* Inline styles for the iconic retro flying paper & spinning CD animations */}
      <style>{`
        @keyframes flyDoc1 {
          0% { transform: translate(0, 0) scale(0.85) rotate(-14deg); opacity: 0; }
          12% { opacity: 1; }
          50% { transform: translate(52px, -24px) scale(1) rotate(4deg); opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translate(105px, 2px) scale(0.85) rotate(16deg); opacity: 0; }
        }
        @keyframes flyDoc2 {
          0% { transform: translate(0, 0) scale(0.85) rotate(-8deg); opacity: 0; }
          12% { opacity: 1; }
          50% { transform: translate(52px, -20px) scale(1) rotate(8deg); opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translate(105px, 4px) scale(0.85) rotate(20deg); opacity: 0; }
        }
        @keyframes flyDoc3 {
          0% { transform: translate(0, 0) scale(0.85) rotate(-16deg); opacity: 0; }
          12% { opacity: 1; }
          50% { transform: translate(52px, -26px) scale(1) rotate(2deg); opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translate(105px, 0px) scale(0.85) rotate(14deg); opacity: 0; }
        }
        @keyframes spinCdRom {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ============================================================== */}
      {/* 2. AUTHENTIC RETRO WINDOWS 95/98 FILE TRANSFER DIALOG BOX (z-10)*/}
      {/* ============================================================== */}
      <div className="relative z-10 w-[92vw] max-w-[460px] bg-[#d4d0c8] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#404040] shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-[3px] rounded-sm">
        
        {/* Title Bar: Classic Windows Navy Blue with Title and [X] button */}
        <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] px-2 py-1 flex items-center justify-between text-white font-bold text-xs shadow-sm select-none">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm">📁</span>
            <span className="tracking-wide drop-shadow-[1px_1px_0px_#000] text-[11px] sm:text-xs">
              Copying Files... (Please Wait)
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="w-4 h-4 bg-[#d4d0c8] border-t border-l border-white border-b border-r border-[#404040] text-black text-[9px] font-bold flex items-center justify-center active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white cursor-pointer"
            title="Skip loading"
          >
            ✕
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs text-neutral-900">
          
          {/* ========================================================== */}
          {/* THE ICONIC RETRO FLYING PAPERS ANIMATION                   */}
          {/* ========================================================== */}
          <div className="relative h-20 bg-[#ece9d8] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white rounded-sm p-3 flex items-center justify-between overflow-hidden shadow-inner">
            
            {/* Left Source Folder */}
            <div className="flex flex-col items-center z-10">
              <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-sm">
                <path d="M4 10C4 8.89543 4.89543 8 6 8H18L22 13H42C43.1046 13 44 13.8954 44 15V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="#e59d22" stroke="#a0600a" strokeWidth="1.5" />
                <path d="M4 17C4 15.8954 4.89543 15 6 15H42C43.1046 15 44 15.8954 44 17V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V17Z" fill="#ffc73b" stroke="#a0600a" strokeWidth="1.5" />
                <path d="M6 16H42V19H6V16Z" fill="#ffe37a" />
              </svg>
              <span className="text-[9px] font-bold text-neutral-700 mt-0.5">D:\SORTED</span>
            </div>

            {/* Flying Documents Stage */}
            <div className="relative flex-1 h-full mx-2 overflow-visible">
              {/* Flying Sheet 1 */}
              <div
                className="absolute top-1/2 left-2 -translate-y-1/2 w-6 h-8 bg-white border border-neutral-600 shadow-sm rounded-[1px] p-0.5 pointer-events-none"
                style={{ animation: 'flyDoc1 1.6s linear infinite' }}
              >
                <div className="w-full h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-4/5 h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-full h-0.5 bg-blue-600 mb-0.5" />
                <div className="w-3/5 h-0.5 bg-neutral-400" />
              </div>

              {/* Flying Sheet 2 (staggered delay) */}
              <div
                className="absolute top-1/2 left-2 -translate-y-1/2 w-6 h-8 bg-white border border-neutral-600 shadow-sm rounded-[1px] p-0.5 pointer-events-none"
                style={{ animation: 'flyDoc2 1.6s linear infinite 0.55s' }}
              >
                <div className="w-full h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-3/4 h-0.5 bg-emerald-600 mb-0.5" />
                <div className="w-full h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-2/3 h-0.5 bg-neutral-400" />
              </div>

              {/* Flying Sheet 3 (staggered delay) */}
              <div
                className="absolute top-1/2 left-2 -translate-y-1/2 w-6 h-8 bg-white border border-neutral-600 shadow-sm rounded-[1px] p-0.5 pointer-events-none"
                style={{ animation: 'flyDoc3 1.6s linear infinite 1.1s' }}
              >
                <div className="w-full h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-full h-0.5 bg-amber-600 mb-0.5" />
                <div className="w-4/5 h-0.5 bg-neutral-400 mb-0.5" />
                <div className="w-1/2 h-0.5 bg-neutral-400" />
              </div>
            </div>

            {/* Right Destination Folder with Spinning Optical CD */}
            <div className="flex flex-col items-center z-10 relative">
              <div className="relative">
                <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-sm">
                  <path d="M4 10C4 8.89543 4.89543 8 6 8H18L22 13H42C43.1046 13 44 13.8954 44 15V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
                  <path d="M4 17C4 15.8954 4.89543 15 6 15H42C43.1046 15 44 15.8954 44 17V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V17Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
                  <path d="M6 16H42V19H6V16Z" fill="#fde68a" />
                </svg>
                {/* Spinning Optical Mini-CD badge */}
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full border border-neutral-700 bg-gradient-to-tr from-cyan-400 via-yellow-200 to-pink-400 shadow flex items-center justify-center"
                  style={{ animation: 'spinCdRom 2.5s linear infinite' }}
                >
                  <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-neutral-700 mt-0.5">C:\Sorted</span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RETRO TRANSFER DETAILS (Classic Windows Copy Text)         */}
          {/* ========================================================== */}
          <div className="space-y-1 font-mono text-[11px] text-neutral-800">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 truncate">Transferring:</span>
              <span className="font-bold text-blue-900 truncate max-w-[240px]">
                {TRANSFER_FILES[currentFileIndex]}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-neutral-500">Status:</span>
              <span className="font-semibold text-neutral-700 truncate max-w-[240px]">
                {RETRO_STATUS_MESSAGES[currentFileIndex]}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-neutral-600">Time remaining:</span>
              <span className="font-bold text-neutral-900 tabular-nums">
                ~{Math.ceil(secondsRemaining)} second{Math.ceil(secondsRemaining) === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* THE ICONIC SEGMENTED CHUNKY BLUE PROGRESS BAR              */}
          {/* ========================================================== */}
          <div className="space-y-1.5">
            <div className="relative w-full h-5 bg-white border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-[2px] flex gap-[2px] overflow-hidden">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-opacity duration-75 ${
                    i < activeBlocks ? 'bg-[#000080]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>{Math.round(progress)}% Complete</span>
              <span>10.0s Total</span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RETRO WINDOWS 95/98 SKIP / CANCEL BUTTON                  */}
          {/* ========================================================== */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSkip}
              className="bg-[#d4d0c8] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white px-5 py-1 text-xs font-semibold text-neutral-900 shadow-sm cursor-pointer outline-none hover:bg-[#dedad2]"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
