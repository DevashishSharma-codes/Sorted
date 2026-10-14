import React, { useState, useEffect } from 'react'
import type { DiscData } from '../../data/discCatalog'

interface RetroMonitorDesktopProps {
  activeDisc: DiscData | null
  isSoundMuted: boolean
  onToggleSound: () => void
  onEjectDisc?: () => void
  children?: React.ReactNode
}

export function RetroMonitorDesktop({
  activeDisc,
  isSoundMuted,
  onToggleSound,
  onEjectDisc: _onEjectDisc,
  children,
}: RetroMonitorDesktopProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  // Real digital clock for retro taskbar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      const minStr = minutes < 10 ? '0' + minutes : minutes
      setCurrentTime(`${hours}:${minStr} ${ampm}`)
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (activeDisc) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [activeDisc])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-100 flex items-center justify-center select-none font-sans p-2 md:p-3 box-border">
      {/* ============================================================== */}
      {/* 1. OUTER VINTAGE MONITOR HOUSING (Beige CRT Bezel)            */}
      {/* ============================================================== */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#f0ebe0] via-[#e5dfd2] to-[#d8d1c2] p-3 md:p-4 flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.12),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-3px_-3px_6px_rgba(0,0,0,0.15)] border-4 border-[#c8c0b0]">
        
        {/* Top Monitor Ridge & Optical Drive Mounting Recess */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#faf6ee] to-[#ded7c8] rounded-t-xl border-b border-[#bcb4a2] flex items-center justify-between px-6 pointer-events-none">
          <div className="w-16 h-1 bg-[#c0b8a6] rounded-full opacity-60"></div>
          <div className="w-24 h-1 bg-[#c0b8a6] rounded-full opacity-60"></div>
          <div className="w-16 h-1 bg-[#c0b8a6] rounded-full opacity-60"></div>
        </div>

        {/* ============================================================ */}
        {/* 2. INNER CRT SCREEN BEZEL & GLASS TUBE (Clean White Screen)  */}
        {/* ============================================================ */}
        <div className="relative w-full flex-1 rounded-xl bg-white overflow-hidden flex flex-col border-[4px] border-[#9ca3af] shadow-[inset_0_0_12px_rgba(0,0,0,0.08)]">
          
          {/* ========================================================== */}
          {/* 3. CLASSIC WINDOWS DESKTOP ENVIRONMENT (Clean White BG)     */}
          {/* ========================================================== */}
          <div className="relative w-full flex-1 bg-white overflow-hidden flex flex-col">
            
            {/* Desktop Icons Column (Left) */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 pointer-events-auto">
              
              {/* My Computer */}
              <div
                onClick={() => setSelectedIcon('my_computer')}
                className={`flex flex-col items-center w-18 p-1 cursor-pointer rounded transition-colors ${
                  selectedIcon === 'my_computer' ? 'bg-[#000080] text-white' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
                  {/* CRT Monitor Icon */}
                  <rect x="3" y="3" width="26" height="20" rx="2" fill="#d4d0c8" stroke="#333" strokeWidth="1.5" />
                  <rect x="5" y="5" width="22" height="15" fill="#000080" />
                  <rect x="6" y="6" width="20" height="13" fill="#1084d0" />
                  {/* Stand */}
                  <rect x="12" y="23" width="8" height="4" fill="#808080" stroke="#333" strokeWidth="1" />
                  <rect x="8" y="27" width="16" height="3" rx="1" fill="#d4d0c8" stroke="#333" strokeWidth="1" />
                </svg>
                <span className={`text-[11px] font-semibold text-center leading-tight mt-1 px-1 rounded ${
                  selectedIcon === 'my_computer' ? 'text-white' : 'text-neutral-800'
                }`}>
                  My Computer
                </span>
              </div>

              {/* CD-ROM Drive (D:) */}
              <div
                onClick={() => setSelectedIcon('cd_drive')}
                className={`flex flex-col items-center w-18 p-1 cursor-pointer rounded transition-colors ${
                  selectedIcon === 'cd_drive' ? 'bg-[#000080] text-white' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="10" width="28" height="16" rx="2" fill="#d4d0c8" stroke="#333" strokeWidth="1.5" />
                  <rect x="5" y="13" width="22" height="3" fill="#808080" />
                  <circle cx="16" cy="18" r="7" fill="#fcd34d" stroke="#b45309" strokeWidth="1" />
                  <circle cx="16" cy="18" r="2.5" fill="#d4d0c8" stroke="#333" strokeWidth="1" />
                  <rect x="23" y="21" width="3" height="2" fill="#22c55e" />
                </svg>
                <span className={`text-[11px] font-semibold text-center leading-tight mt-1 px-1 rounded ${
                  selectedIcon === 'cd_drive' ? 'text-white' : 'text-neutral-800'
                }`}>
                  Audio CD (D:)
                </span>
              </div>

              {/* Sorted Music Folder */}
              <div
                onClick={() => setSelectedIcon('music_folder')}
                className={`flex flex-col items-center w-18 p-1 cursor-pointer rounded transition-colors ${
                  selectedIcon === 'music_folder' ? 'bg-[#000080] text-white' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
                  <path d="M4 8C4 6.89543 4.89543 6 6 6H13L16 9H26C27.1046 9 28 9.89543 28 11V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V8Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                  <path d="M4 12H28V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V12Z" fill="#fbbf24" />
                </svg>
                <span className={`text-[11px] font-semibold text-center leading-tight mt-1 px-1 rounded ${
                  selectedIcon === 'music_folder' ? 'text-white' : 'text-neutral-800'
                }`}>
                  Sorted Music
                </span>
              </div>

              {/* Recycle Bin */}
              <div
                onClick={() => setSelectedIcon('recycle_bin')}
                className={`flex flex-col items-center w-18 p-1 cursor-pointer rounded transition-colors ${
                  selectedIcon === 'recycle_bin' ? 'bg-[#000080] text-white' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
                  <path d="M7 9L9 26H23L25 9H7Z" fill="#9ca3af" stroke="#333" strokeWidth="1.5" />
                  <line x1="5" y1="9" x2="27" y2="9" stroke="#333" strokeWidth="2" />
                  <rect x="12" y="6" width="8" height="3" fill="#d4d0c8" stroke="#333" strokeWidth="1" />
                  <line x1="12" y1="13" x2="12" y2="22" stroke="#4b5563" strokeWidth="1.5" />
                  <line x1="16" y1="13" x2="16" y2="22" stroke="#4b5563" strokeWidth="1.5" />
                  <line x1="20" y1="13" x2="20" y2="22" stroke="#4b5563" strokeWidth="1.5" />
                </svg>
                <span className={`text-[11px] font-semibold text-center leading-tight mt-1 px-1 rounded ${
                  selectedIcon === 'recycle_bin' ? 'text-white' : 'text-neutral-800'
                }`}>
                  Recycle Bin
                </span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 4. CLASSIC WINDOWS 95/98 RETRO APPLICATION WINDOW        */}
            {/* Positioned right below the optical drive bay            */}
            {/* ======================================================== */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[520px] max-w-[92vw] z-0 pointer-events-auto shadow-[4px_4px_16px_rgba(0,0,0,0.6)]">
              <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#404040] p-[3px] rounded-t-sm">
                
                {/* Title Bar */}
                <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] px-2 py-1 flex items-center justify-between text-white font-bold text-xs select-none shadow-sm">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm">💿</span>
                    <span className="tracking-wide drop-shadow-[1px_1px_0px_#000]">
                      Sorted CD Audio Player - [Drive D:]
                    </span>
                  </div>
                  {/* Window Buttons */}
                  <div className="flex items-center gap-1">
                    <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#404040] text-black text-[9px] font-bold flex items-center justify-center active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white">
                      _
                    </button>
                    <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#404040] text-black text-[9px] font-bold flex items-center justify-center active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white">
                      □
                    </button>
                    <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#404040] text-black text-[9px] font-bold flex items-center justify-center active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white">
                      ✕
                    </button>
                  </div>
                </div>

                {/* Menu Bar */}
                <div className="flex gap-3 px-2 py-0.5 text-xs text-black border-b border-[#808080] bg-[#c0c0c0]">
                  <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><u>F</u>ile</span>
                  <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><u>D</u>isc</span>
                  <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><u>V</u>iew</span>
                  <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><u>O</u>ptions</span>
                  <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer"><u>H</u>elp</span>
                </div>

                {/* Window Body: Retro Digital CD Display & Status */}
                <div className="p-2 space-y-2 bg-[#d4d0c8]">
                  {/* Digital LCD Track Status */}
                  <div className="bg-[#05130d] border-t-2 border-l-2 border-[#404040] border-b-2 border-r-2 border-white p-2 rounded-sm flex items-center justify-between font-mono text-emerald-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                      <span className="text-xs font-bold tracking-wider">
                        {activeDisc ? `TRACK 01: [${activeDisc.title.toUpperCase()}]` : 'NO DISC INSERTED - [DRIVE READY]'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-300">
                      {activeDisc ? '03:42' : '00:00'}
                    </span>
                  </div>

                  {/* Equalizer Visualizer & Secondary Info */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-800 px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-700">Artist:</span>
                      <span className="font-bold text-neutral-950">
                        {activeDisc ? activeDisc.artist : 'Drag a CD into drive'}
                      </span>
                    </div>
                    {/* Retro Equalizer Bars */}
                    <div className="flex items-end gap-1 h-4">
                      {[12, 16, 8, 14, 18, 10, 15, 9].map((height, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-xs transition-all duration-300 ${
                            isPlaying
                              ? 'bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500 animate-pulse'
                              : 'bg-neutral-400 h-2'
                          }`}
                          style={{
                            height: isPlaying ? `${(height / 18) * 100}%` : '20%',
                            animationDelay: `${i * 120}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-neutral-700 border-t border-[#808080] bg-[#c0c0c0]">
                  <span>{activeDisc ? 'Audio Density 16-bit 44.1kHz' : 'Please insert a disc to begin'}</span>
                  <span>{activeDisc ? 'Status: Playing' : 'Status: Idle'}</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 5. 3D WEBGL INTERACTIVE CANVAS LAYER                    */}
            {/* Contains the optical drive & physical draggable CDs     */}
            {/* ======================================================== */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {children}
            </div>

          </div>

          {/* ========================================================== */}
          {/* 6. CLASSIC WINDOWS 95/98 TASKBAR                           */}
          {/* ========================================================== */}
          <div className="h-8 bg-[#c0c0c0] border-t-2 border-white border-b border-[#404040] flex items-center justify-between px-1.5 z-40 select-none shadow-md">
            
            {/* Left: Start Button & Active Task */}
            <div className="flex items-center gap-1.5">
              {/* Start Button */}
              <button
                onClick={() => setStartMenuOpen(!startMenuOpen)}
                className={`flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-black border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#404040] bg-[#c0c0c0] cursor-pointer outline-none active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white ${
                  startMenuOpen ? 'border-t-[#404040] border-l-[#404040] border-b-white border-r-white bg-[#d4d0c8]' : ''
                }`}
              >
                {/* Windows 4-Color Flag Icon */}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M1 2L7 1V7H1V2Z" fill="#f87171" />
                  <path d="M9 1L15 0V7H9V1Z" fill="#38bdf8" />
                  <path d="M1 9H7V15L1 14V9Z" fill="#4ade80" />
                  <path d="M9 9H15V16L9 15V9Z" fill="#facc15" />
                </svg>
                <span>Start</span>
              </button>

              {/* Active Program Button in Taskbar */}
              <div className="flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold text-black bg-[#d4d0c8] border-t-2 border-l-2 border-[#404040] border-b-2 border-r-2 border-white shadow-inner max-w-[180px] truncate">
                <span className="text-xs">💿</span>
                <span className="truncate">Sorted Audio Player</span>
              </div>
            </div>

            {/* Right: System Tray & Clock */}
            <div className="flex items-center gap-3 bg-[#c0c0c0] border-t border-l border-[#808080] border-b border-r border-white px-2 py-0.5 text-xs text-black">
              {/* Tagline subtle text */}
              <span className="hidden md:inline text-[10px] text-neutral-600 font-medium">
                Revisiting the programs that once filled my computer
              </span>
              
              <div className="h-3 w-[1px] bg-[#808080] hidden md:block" />

              {/* Audio Sound Toggle */}
              <button
                onClick={onToggleSound}
                title={isSoundMuted ? 'Turn Sound On' : 'Turn Sound Off'}
                className="flex items-center gap-1 cursor-pointer hover:bg-black/10 px-1 py-0.5 rounded outline-none border-0 bg-transparent"
              >
                <span className="text-xs">{isSoundMuted ? '🔇' : '🔊'}</span>
                <span className="text-[10px] font-semibold">{isSoundMuted ? 'Muted' : 'Sound on'}</span>
              </button>

              <div className="h-3 w-[1px] bg-[#808080]" />

              {/* Retro Digital Clock */}
              <span className="font-mono text-xs font-semibold tracking-tight text-neutral-900">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Retro Start Menu Popup */}
          {startMenuOpen && (
            <div className="absolute bottom-8 left-1 w-52 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#404040] shadow-[4px_4px_12px_rgba(0,0,0,0.6)] z-50 flex">
              {/* Left Brand Banner */}
              <div className="w-7 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center py-2 text-white font-black text-xs tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
                Sorted 98
              </div>
              {/* Menu Items */}
              <div className="flex-1 py-1 text-xs text-black flex flex-col">
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer">
                  <span>💿</span>
                  <span>Eject Disc</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer">
                  <span>📁</span>
                  <span>Browse All Discs</span>
                </div>
                <div className="h-[1px] bg-[#808080] my-1 mx-2" />
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer">
                  <span>⚙️</span>
                  <span>Audio Settings</span>
                </div>
                <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer">
                  <span>❓</span>
                  <span>About Sorted</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* 7. BOTTOM MONITOR CHIN & HARDWARE CONTROLS                   */}
        {/* ============================================================ */}
        <div className="h-10 md:h-12 flex items-center justify-between px-4 md:px-8 mt-1 pointer-events-auto">
          {/* Left Brand / Model Badge */}
          <div className="flex items-center gap-2">
            <span className="font-black text-sm md:text-base tracking-wider text-[#6b6455] uppercase drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              SORTED
            </span>
            <span className="text-[10px] text-[#8c8474] font-semibold tracking-widest hidden sm:inline">
              SyncMaster 17GLi
            </span>
          </div>

          {/* Center: Monitor Adjustment Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {['MENU', '◄', '►', 'AUTO'].map((btn) => (
              <button
                key={btn}
                className="w-7 md:w-8 h-4 md:h-5 rounded-xs bg-[#c9c2b0] border-t border-l border-white border-b border-r border-[#8a8270] text-[8px] md:text-[9px] font-bold text-[#5c5547] flex items-center justify-center active:border-t-[#8a8270] active:border-l-[#8a8270] active:border-b-white active:border-r-white cursor-pointer"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Right: Power Button & LED */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-[9px] text-[#787160] font-semibold hidden sm:inline">POWER</span>
            </div>
            <button
              title="Monitor Power"
              className="w-8 md:w-10 h-6 md:h-7 rounded-sm bg-[#b5ad9b] border-t border-l border-white border-b-2 border-r-2 border-[#5c5547] flex items-center justify-center text-[10px] text-[#403a2f] font-bold active:border-t-[#5c5547] active:border-l-[#5c5547] active:border-b-white active:border-r-white cursor-pointer shadow-sm"
            >
              ⏻
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
