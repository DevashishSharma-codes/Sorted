export function RetroCrtOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden crt-overlay-root"
      aria-hidden="true"
    >
      {/* Layer 1: Dreamy early-2000s blue CRT tint, phosphor glow & ambient glass vignette */}
      <div className="absolute inset-0 pointer-events-none crt-blue-glow" />

      {/* Layer 2: CRT Aperture Grille Scanlines & Subpixel Phosphor Grid */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines" />

      {/* Layer 3: Analog Film Grain & Screen Texture */}
      <div className="absolute inset-0 pointer-events-none crt-grain" />

      {/* Layer 4: Subtle Bezel Curvature & Tube Vignette Shadow */}
      <div className="absolute inset-0 pointer-events-none crt-vignette" />

      {/* Layer 5: Glass Reflection Glare (Very subtle diagonal sweep) */}
      <div className="absolute inset-0 pointer-events-none crt-glare" />
    </div>
  )
}
