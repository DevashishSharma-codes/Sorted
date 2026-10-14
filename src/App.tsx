import { useState } from 'react'
import { DvdPlayerScene } from './components/3d/DvdPlayerScene'
import { CrtMonitorFrame } from './components/ui/CrtMonitorFrame'
import { ScreensaverLoadingScreen } from './components/ui/ScreensaverLoadingScreen'
import { RetroFolderWindow } from './components/ui/RetroFolderWindow'
import type { DiscData } from './data/discCatalog'
import { soundEngine } from './audio/DriveSoundEngine'

export function App() {
  const [activeDisc, setActiveDisc] = useState<DiscData | null>(null)
  const [viewMode, setViewMode] = useState<'intro' | 'loading' | 'folders' | 'player'>('intro')
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'collapsing' | 'expanding'>('idle')

  const handleDiscLoaded = (disc: DiscData) => {
    setActiveDisc(disc)
  }

  const handleDiscEjected = () => {
    setActiveDisc(null)
  }

  // 1. Arrow button on intro screen clicked: start 10s screensaver loading screen
  const handleStartLoading = () => {
    if (transitionPhase !== 'idle') return

    soundEngine.playCrtGlitch()
    setTransitionPhase('collapsing')

    setTimeout(() => {
      setViewMode('loading')
      setTransitionPhase('expanding')

      setTimeout(() => {
        setTransitionPhase('idle')
      }, 260)
    }, 240)
  }

  // 2. 10s screensaver loading finishes (or user skips): open folders screen
  const handleLoadingComplete = () => {
    if (transitionPhase !== 'idle') return

    soundEngine.playCrtGlitch()
    setTransitionPhase('collapsing')

    setTimeout(() => {
      setViewMode('folders')
      setTransitionPhase('expanding')

      setTimeout(() => {
        setTransitionPhase('idle')
      }, 260)
    }, 240)
  }

  // 3. User clicks on the first folder (DVD_Player): open 3D DVD player
  const handleOpenPlayer = () => {
    if (transitionPhase !== 'idle') return

    soundEngine.playCrtGlitch()
    setTransitionPhase('collapsing')

    setTimeout(() => {
      setViewMode('player')
      setTransitionPhase('expanding')

      setTimeout(() => {
        setTransitionPhase('idle')
      }, 260)
    }, 240)
  }

  // 4. Return from DVD player to folders screen
  const handleBackToFolders = () => {
    if (transitionPhase !== 'idle') return

    soundEngine.playCrtGlitch()
    setTransitionPhase('collapsing')

    setTimeout(() => {
      setViewMode('folders')
      setTransitionPhase('expanding')

      setTimeout(() => {
        setTransitionPhase('idle')
      }, 260)
    }, 240)
  }

  // 5. Return from folders screen to intro screen
  const handleBackToIntro = () => {
    if (transitionPhase !== 'idle') return

    soundEngine.playCrtGlitch()
    setTransitionPhase('collapsing')

    setTimeout(() => {
      setViewMode('intro')
      setTransitionPhase('expanding')

      setTimeout(() => {
        setTransitionPhase('idle')
      }, 260)
    }, 240)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#12110e] select-none text-neutral-900 font-sans">
      <CrtMonitorFrame
        viewMode={viewMode}
        transitionPhase={transitionPhase}
        onEnterPlayer={handleStartLoading}
        onBackToIntro={handleBackToIntro}
        onBackToFolders={handleBackToFolders}
        loadingContent={
          <ScreensaverLoadingScreen
            durationSeconds={10}
            onComplete={handleLoadingComplete}
          />
        }
        foldersContent={
          <RetroFolderWindow
            onOpenPlayer={handleOpenPlayer}
            onBackToIntro={handleBackToIntro}
          />
        }
        playerContent={
          <DvdPlayerScene
            onDiscLoaded={handleDiscLoaded}
            onDiscEjected={handleDiscEjected}
            activeDiscId={activeDisc ? activeDisc.id : null}
            isActive={viewMode === 'player' && transitionPhase !== 'collapsing'}
          />
        }
      />
    </div>
  )
}

export default App
