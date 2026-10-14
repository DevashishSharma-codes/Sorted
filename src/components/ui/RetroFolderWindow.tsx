import { useState } from 'react'

interface RetroFolderWindowProps {
  onOpenPlayer: () => void
  onBackToIntro: () => void
}

interface FolderItem {
  id: string
  name: string
  isPlayer?: boolean
  description: string
}

const FOLDERS: FolderItem[] = [
  {
    id: 'dvd_player',
    name: 'DVD_Player',
    isPlayer: true,
    description: 'Launch Optical Turntable Audio Drive',
  },
  {
    id: 'unreleased_stems',
    name: 'Unreleased_Stems',
    description: 'Raw vocal tracks & studio stems',
  },
  {
    id: 'visual_archive',
    name: 'Visual_Archive',
    description: 'Arpit Bala VHS music video clips',
  },
  {
    id: 'audio_density_44k',
    name: 'Audio_Density_44k',
    description: 'High-definition 16-bit 44.1kHz masters',
  },
  {
    id: 'bala_sessions',
    name: 'Bala_Sessions',
    description: 'Late night rehearsal recordings',
  },
  {
    id: 'secret_demos',
    name: 'Secret_Demos',
    description: 'Unpublished draft compositions',
  },
]

export function RetroFolderWindow({
  onOpenPlayer,
  onBackToIntro,
}: RetroFolderWindowProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>('dvd_player')
  const [statusMessage, setStatusMessage] = useState<string>(
    'Select a folder. Click DVD_Player to open optical CD player.'
  )

  const handleFolderClick = (folder: FolderItem) => {
    setSelectedFolder(folder.id)
    if (folder.isPlayer) {
      setStatusMessage('Opening Sorted Optical CD Player...')
      onOpenPlayer()
    } else {
      setStatusMessage(`[Locked]: ${folder.name} is archived. Open DVD_Player first.`)
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-3 sm:p-6 select-none font-sans">
      {/* ============================================================== */}
      {/* 0. WINDOWS XP BLISS WALLPAPER BACKGROUND (z-0)                 */}
      {/* ============================================================== */}
      <img
        src="/windows_xp_bliss.jpg"
        alt="Windows XP Bliss Wallpaper"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />

      {/* ============================================================== */}
      {/* RETRO WINDOW CONTAINER (Matching User's Reference Screenshot)  */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-4xl h-[88%] bg-[#ece9d8] rounded-t-2xl border-[3px] border-[#0038cb] shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
        
        {/* ------------------------------------------------------------ */}
        {/* 1. VIBRANT BLUE TITLE BAR (Matching Reference Image)         */}
        {/* ------------------------------------------------------------ */}
        <div className="relative h-10 sm:h-11 bg-gradient-to-r from-[#0055ea] via-[#0b66fe] to-[#0055ea] flex items-center justify-between px-3 sm:px-4 shadow-sm border-b border-[#0038cb]">
          {/* Top gloss highlight reflection line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/40 pointer-events-none" />

          {/* Left: Star Icon + Title Text */}
          <div className="flex items-center gap-2.5">
            {/* Five-pointed White Star matching reference image */}
            <span
              className="text-white text-lg sm:text-xl font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] select-none"
              style={{ lineHeight: 1 }}
            >
              ★
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] font-sans">
              Sorted Explorer - [C:\Sorted\Files]
            </span>
          </div>

          {/* Right: Three Glossy Window Buttons matching reference image */}
          <div className="flex items-center gap-1.5">
            {/* Minimize button: Glossy Blue with minus sign */}
            <button
              onClick={onBackToIntro}
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md bg-gradient-to-b from-[#4a90fe] via-[#1d64e8] to-[#0d4ec4] border border-[#7cb1ff] text-white flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] active:scale-95 transition-transform cursor-pointer"
              title="Minimize to Intro"
            >
              <span className="text-xs font-black leading-none -mt-1.5">_</span>
            </button>

            {/* Maximize button: Glossy Blue with square box */}
            <button
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md bg-gradient-to-b from-[#4a90fe] via-[#1d64e8] to-[#0d4ec4] border border-[#7cb1ff] text-white flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] active:scale-95 transition-transform cursor-pointer"
              title="Maximize"
            >
              <div className="w-2.5 h-2.5 border-2 border-white rounded-[1px]" />
            </button>

            {/* Close button: Glossy Red/Orange with white X */}
            <button
              onClick={onBackToIntro}
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md bg-gradient-to-b from-[#ff5a36] via-[#e12a06] to-[#b91c1c] border border-[#ffa38f] text-white flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] active:scale-95 transition-transform cursor-pointer"
              title="Close and return to Intro"
            >
              <span className="text-xs font-black leading-none">✕</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 2. CLASSIC EXPLORER TOOLBAR & ADDRESS BAR                    */}
        {/* ------------------------------------------------------------ */}
        <div className="bg-[#ece9d8] border-b border-[#d8d2bd] px-3 py-1 flex items-center gap-3 text-xs text-neutral-800">
          <div className="flex items-center gap-2">
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
              File
            </span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
              Edit
            </span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
              View
            </span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
              Favorites
            </span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
              Help
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#beb7a0]" />

          <div className="flex-1 flex items-center gap-2 bg-white px-2 py-0.5 rounded border border-[#7f9db9] text-[11px] font-mono text-neutral-600 truncate">
            <span className="font-bold text-neutral-400">Address:</span>
            <span>C:\Sorted\Files\</span>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. WINDOW INTERIOR BODY (Beige canvas with folder grid)      */}
        {/* ------------------------------------------------------------ */}
        <div className="flex-1 bg-[#ece9d8] p-4 sm:p-8 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {FOLDERS.map((folder, index) => {
              const isSelected = selectedFolder === folder.id

              return (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`group relative flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#316ac5]/20 border-[#316ac5]'
                      : 'border-transparent hover:bg-[#316ac5]/10 hover:border-[#316ac5]/40'
                  }`}
                >
                  {/* Badge for the first / main DVD player folder */}
                  {index === 0 && (
                    <div className="absolute -top-1.5 right-2 z-10 bg-amber-400 text-neutral-900 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow border border-amber-500 animate-pulse">
                      PLAY
                    </div>
                  )}

                  {/* Windows Folder SVG Icon */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                    {folder.isPlayer ? (
                      /* Special Optical DVD Player Folder Icon */
                      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
                        {/* Folder back tab */}
                        <path
                          d="M6 14C6 11.7909 7.79086 10 10 10H24L29 17H54C56.2091 17 58 18.7909 58 21V50C58 52.2091 56.2091 54 54 54H10C7.79086 54 6 52.2091 6 50V14Z"
                          fill="#d97706"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />
                        {/* Folder front pocket */}
                        <path
                          d="M6 24C6 21.7909 7.79086 20 10 20H54C56.2091 20 58 21.7909 58 24V50C58 52.2091 56.2091 54 54 54H10C7.79086 54 6 52.2091 6 50V24Z"
                          fill="#fbbf24"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />
                        {/* Gloss highlight */}
                        <path d="M8 22H56V26H8V22Z" fill="#fde68a" />
                        {/* Shiny Optical CD disc emerging from folder */}
                        <circle cx="42" cy="38" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="42" cy="38" r="5" fill="#fcd34d" stroke="#1e293b" strokeWidth="1" />
                        <circle cx="42" cy="38" r="2" fill="#ffffff" />
                      </svg>
                    ) : (
                      /* Classic Windows Yellow Folder Icon */
                      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
                        {/* Folder back tab */}
                        <path
                          d="M6 14C6 11.7909 7.79086 10 10 10H24L29 17H54C56.2091 17 58 18.7909 58 21V50C58 52.2091 56.2091 54 54 54H10C7.79086 54 6 52.2091 6 50V14Z"
                          fill="#d97706"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />
                        {/* Folder front pocket */}
                        <path
                          d="M6 24C6 21.7909 7.79086 20 10 20H54C56.2091 20 58 21.7909 58 24V50C58 52.2091 56.2091 54 54 54H10C7.79086 54 6 52.2091 6 50V24Z"
                          fill="#fbbf24"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />
                        {/* Gloss highlight */}
                        <path d="M8 22H56V26H8V22Z" fill="#fde68a" />
                      </svg>
                    )}
                  </div>

                  {/* Folder Name Label */}
                  <span
                    className={`mt-2 text-xs sm:text-sm font-semibold text-center leading-snug px-2 py-0.5 rounded break-all select-none ${
                      isSelected
                        ? 'bg-[#000080] text-white font-bold'
                        : 'text-neutral-900 group-hover:text-blue-900'
                    }`}
                  >
                    {folder.name}
                  </span>

                  {/* Subtext description */}
                  <span className="text-[10px] text-neutral-500 text-center mt-0.5 line-clamp-1">
                    {folder.description}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 4. CLASSIC STATUS BAR                                        */}
        {/* ------------------------------------------------------------ */}
        <div className="h-6 sm:h-7 bg-[#ece9d8] border-t border-[#d8d2bd] px-3 flex items-center justify-between text-[11px] text-neutral-700">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold">6 objects</span>
            <span className="text-neutral-400">|</span>
            <span className="truncate">{statusMessage}</span>
          </div>

          <button
            onClick={onBackToIntro}
            className="text-[10px] text-neutral-500 hover:text-neutral-800 underline cursor-pointer ml-2 whitespace-nowrap"
          >
            Back to Intro
          </button>
        </div>
      </div>
    </div>
  )
}
