import { motion, AnimatePresence } from 'framer-motion'
import { DISCS, type DiscData } from '../../data/discCatalog'
import { X, Play } from 'lucide-react'

interface RosterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectDisc: (disc: DiscData) => void
}

export function RosterDrawer({ isOpen, onClose, onSelectDisc }: RosterDrawerProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="w-full max-w-xl h-full bg-[#0c0e14] border-l border-white/10 p-6 overflow-y-auto flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">ARCHIVE CATALOG</span>
                <h2 className="text-2xl font-black font-display text-white">ALL ROSTER DISCS</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {DISCS.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDisc(d)
                    onClose()
                  }}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center font-bold font-mono text-xs shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: d.primaryColor, color: d.accentColor }}
                    >
                      #0{d.id}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {d.artist}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {d.trackName} — <span className="text-cyan-400">{d.bpm} BPM</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors">
                    <Play className="w-3 h-3 fill-current" /> LOAD
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs font-mono text-slate-500 flex justify-between items-center">
            <span>SORTED MANAGEMENT ARCHIVE 2026</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
