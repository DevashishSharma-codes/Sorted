import { useState } from 'react'
import { DvdPlayerScene } from './components/3d/DvdPlayerScene'
import type { DiscData } from './data/discCatalog'
import { soundEngine } from './audio/DriveSoundEngine'
import { Volume2, VolumeX } from 'lucide-react'

export function App() {
  const [activeDisc, setActiveDisc] = useState<DiscData | null>(null)
  const [isSoundMuted, setIsSoundMuted] = useState(soundEngine.getIsMuted())

  const handleDiscLoaded = (disc: DiscData) => {
    setActiveDisc(disc)
  }

  const handleDiscEjected = () => {
    setActiveDisc(null)
  }

  const toggleSound = () => {
    const isUnmuted = soundEngine.toggleMute()
    setIsSoundMuted(!isUnmuted)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white select-none text-neutral-900 font-sans">
      {/* 1. TOP-LEFT BRAND */}
      <header className="absolute top-0 left-0 z-30 p-8 pointer-events-none">
        <h1 className="text-3xl font-black font-sans tracking-tight text-neutral-900 m-0 leading-tight">
          Sorted
        </h1>
      </header>

      {/* 2. TOP-RIGHT SOUND CONTROLS matching reference */}
      <div className="absolute top-0 right-0 z-30 p-8">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-950 font-medium transition-colors cursor-pointer bg-transparent border-0 outline-none"
        >
          {isSoundMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-neutral-600" />
              <span>Sound off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-neutral-700" />
              <span>Sound on</span>
            </>
          )}
        </button>
      </div>

      {/* 3. MAIN 3D SCENE: Optical drive attached at the very top + Draggable CDs */}
      <main className="w-full h-full">
        <DvdPlayerScene
          onDiscLoaded={handleDiscLoaded}
          onDiscEjected={handleDiscEjected}
          activeDiscId={activeDisc ? activeDisc.id : null}
        />
      </main>

      {/* 4. BOTTOM LABELS matching reference */}
      <footer className="absolute bottom-0 inset-x-0 z-20 px-8 py-6 flex justify-between items-center text-xs text-neutral-500 pointer-events-none">
        <p className="m-0">Revisiting the programs that once filled my computer</p>
        <p className="m-0 hover:text-neutral-950 transition-colors pointer-events-auto cursor-pointer font-medium">
          Browse all at once
        </p>
      </footer>
    </div>
  )
}

export default App
