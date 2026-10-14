import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DiscData } from '../../data/discCatalog'
import { soundEngine } from '../../audio/DriveSoundEngine'
import {
  Disc,
  Play,
  Pause,
  Eject,
  Sparkles,
  User,
  Sliders,
  Flame,
  X,
} from 'lucide-react'

interface SongDetailOverlayProps {
  disc: DiscData | null
  onEject: () => void
}

export function SongDetailOverlay({ disc, onEject }: SongDetailOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeTab, setActiveTab] = useState<'track' | 'model' | 'rider'>('track')
  const [duotoneFilter, setDuotoneFilter] = useState<'bw' | 'cyan' | 'acid' | 'pink'>('acid')
  const [selectedOutfit, setSelectedOutfit] = useState<number>(1)
  const [distortLevel, setDistortLevel] = useState<number>(85)

  useEffect(() => {
    if (disc) {
      setIsPlaying(true)
    }
  }, [disc])

  if (!disc) return null

  const togglePlayback = () => {
    if (isPlaying) {
      soundEngine.stopMusic()
      setIsPlaying(false)
    } else {
      soundEngine.playMusic(disc.id)
      setIsPlaying(true)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-x-4 top-20 bottom-8 md:inset-x-12 md:top-24 md:bottom-12 z-50 pointer-events-auto flex items-center justify-center p-2 sm:p-4"
      >
        {/* Backdrop glass */}
        <div
          className="absolute inset-0 bg-black/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Main Punk Zine Dossier Container */}
        <div className="relative w-full max-w-5xl h-full max-h-[820px] rounded-3xl bg-[#0d0f15]/95 border-2 border-white/15 overflow-hidden flex flex-col z-10 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
          {/* Top Tape & Title Bar */}
          <div className="bg-[#141722] border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
                    SORTED AUDIO PLAYER // OPTICAL DRIVE 01
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    DISC READ OK
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  MEDIA: {disc.capacityText} // {disc.topLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Eject Button */}
              <button
                onClick={onEject}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-rose-900/20"
                title="Eject Disc"
              >
                <Eject className="w-4 h-4" />
                EJECT DISC ⏏
              </button>

              <button
                onClick={onEject}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-[#0e1017]">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-t-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border-t-2 ${
                activeTab === 'track'
                  ? 'bg-[#181a24] text-white border-indigo-500'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Disc className="w-3.5 h-3.5 text-indigo-400" />
              TRACK & AUDIO WAVE
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-4 py-2 rounded-t-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border-t-2 ${
                activeTab === 'model'
                  ? 'bg-[#181a24] text-white border-amber-500'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              ARTIST CUTOUT MODEL
            </button>
            <button
              onClick={() => setActiveTab('rider')}
              className={`px-4 py-2 rounded-t-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border-t-2 ${
                activeTab === 'rider'
                  ? 'bg-[#181a24] text-white border-pink-500'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              DOSSIER & TOUR RIDER
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0a0c12]">
            {activeTab === 'track' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Left Column: Xerox Cover & Controls */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-white/20 bg-black aspect-[3/4] max-h-[360px] shadow-2xl">
                    <img
                      src={disc.imagePath}
                      alt={disc.artist}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        duotoneFilter === 'bw'
                          ? 'contrast-150 grayscale'
                          : duotoneFilter === 'cyan'
                          ? 'contrast-150 sepia hue-rotate-180 saturate-200'
                          : duotoneFilter === 'acid'
                          ? 'contrast-200 hue-rotate-45 saturate-200'
                          : 'contrast-175 hue-rotate-300 saturate-200'
                      }`}
                    />
                    {/* Xerox Halftone Overlay Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
                    
                    {/* Floating Punk Stamp */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-[11px] px-2.5 py-1 -rotate-6 shadow-md border border-white/30 tracking-wider">
                      {disc.contractStatus}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-yellow-400 text-black font-mono font-black text-xs px-2.5 py-1 rotate-3 shadow-md border border-black/40">
                      {disc.bpm} BPM
                    </div>
                  </div>

                  {/* Playback Transport */}
                  <div className="p-4 rounded-2xl bg-[#141724] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlayback}
                          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </button>
                        <div>
                          <div className="text-sm font-bold text-white font-mono">{disc.trackName}</div>
                          <div className="text-xs text-slate-400 font-mono">STATUS: {isPlaying ? 'PLAYING NOW' : 'PAUSED'}</div>
                        </div>
                      </div>
                      <span className="font-mono text-sm text-cyan-400 font-bold">{disc.duration}</span>
                    </div>

                    {/* Animated Equalizer Bars */}
                    <div className="h-8 flex items-end gap-1.5 p-1 rounded-lg bg-black/60 border border-white/5">
                      {[40, 75, 95, 60, 85, 30, 90, 100, 65, 45, 80, 95, 70, 50, 85, 60].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-indigo-500 via-purple-500 to-emerald-400 rounded-sm transition-all duration-150"
                          style={{
                            height: isPlaying ? `${Math.max(15, Math.round(h * Math.random()))}%` : '15%',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Song & Artist Details */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="p-6 rounded-2xl bg-[#141724] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                        ARTIST FILE // {disc.title}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        GENRE: {disc.genre}
                      </span>
                    </div>

                    <h1 className="text-3xl font-black font-display text-white tracking-tight">
                      {disc.artist}
                    </h1>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {disc.bio}
                    </p>

                    {/* Sound Distortion Slider */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <Sliders className="w-3.5 h-3.5" /> FUZZ & ANALOG DISTORTION
                        </span>
                        <span>{distortLevel}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={distortLevel}
                        onChange={(e) => setDistortLevel(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Photocopy Duotone Switcher */}
                  <div className="p-4 rounded-2xl bg-[#141724] border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      Xerox Duotone Palette:
                    </span>
                    <div className="flex items-center gap-2">
                      {(['bw', 'acid', 'cyan', 'pink'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setDuotoneFilter(mode)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                            duotoneFilter === mode
                              ? 'bg-white text-black shadow-md'
                              : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">REPRESENTED BY SORTED AGENCY</div>
                      <div className="text-xs text-indigo-300 font-mono">BOOKINGS & MANAGEMENT INQUIRIES OPEN</div>
                    </div>
                    <button
                      onClick={() => alert(`Inquiry initiated for ${disc.artist}! Agency manager will contact you.`)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      REQUEST BOOKING
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ARTIST CUTOUT MODEL TAB */}
            {activeTab === 'model' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-center">
                {/* Left: Model Controls & Parts */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-[#141724] border border-white/10 space-y-3">
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      PUNK CUTOUT MANNEQUIN
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Custom torn paper DIY zine cutout model. Swap outfits and attitude poses.
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-mono text-slate-300">SELECT CUTOUT POSE:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedOutfit(1)}
                          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                            selectedOutfit === 1
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="font-bold">#01 RIOT SCREAMER</div>
                          <div className="text-[10px] opacity-75">Studded Leather & Mic</div>
                        </button>
                        <button
                          onClick={() => setSelectedOutfit(2)}
                          className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                            selectedOutfit === 2
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="font-bold">#02 LOW SLUNG BASS</div>
                          <div className="text-[10px] opacity-75">Beanie & Torn Denim</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#141724] border border-white/10 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-300">ATTITUDE METRICS:</h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">DECIBEL OUTPUT:</span>
                        <span className="text-rose-400 font-bold">128 dB (EAR DAMAGE)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">AMPLIFIER FEEDBACK:</span>
                        <span className="text-yellow-400 font-bold">CRITICAL HIGH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">MANAGEMENT STATUS:</span>
                        <span className="text-emerald-400 font-bold">UNCOMPROMISING</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: The Full Cutout Figure */}
                <div className="lg:col-span-7 flex items-center justify-center">
                  <div className="relative max-w-sm rounded-3xl p-4 bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center">
                    <motion.img
                      key={selectedOutfit}
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 20 }}
                      src={selectedOutfit === 1 ? '/artists/model-1.jpg' : '/artists/model-2.jpg'}
                      alt="Punk Artist Model"
                      className="max-h-[500px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                    />

                    {/* Stamped tape decal */}
                    <div className="absolute top-8 right-4 bg-yellow-300 text-black font-mono font-black text-xs px-3 py-1 rotate-12 shadow-lg border border-black">
                      SORTED MANNEQUIN #0{selectedOutfit}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOUR RIDER & CONTRACT TAB */}
            {activeTab === 'rider' && (
              <div className="p-6 rounded-2xl bg-[#141724] border border-white/10 space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-pink-400">OFFICIAL MANAGEMENT DOCUMENT</span>
                    <h3 className="text-xl font-bold font-mono text-white">CONFIDENTIAL TOUR RIDER & TECH SPEC</h3>
                  </div>
                  <span className="bg-red-500 text-white font-mono text-xs px-2.5 py-1 font-bold -rotate-3">
                    NON-NEGOTIABLE
                  </span>
                </div>

                <div className="space-y-4 text-sm font-mono">
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <div className="text-xs text-slate-400">HOSPITALITY & GREEN ROOM REQUIREMENTS:</div>
                    <div className="text-slate-200">{disc.rider}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <div className="text-xs text-slate-400">SOUND REINFORCEMENT:</div>
                    <div className="text-slate-200">
                      Must hit a minimum continuous 115 dBA at front of house. Subwoofers must reproduce sub-harmonics down to 25 Hz.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <div className="text-xs text-slate-400">MERCHANDISE & ZINES:</div>
                    <div className="text-slate-200">
                      Agency retains 100% of xerox zine, cassette, and vinyl sales. No venue cuts permitted.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
