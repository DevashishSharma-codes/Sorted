import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { DISCS, type DiscData } from '../../data/discCatalog'
import { createCdTexture } from '../../textures/CdTextureGenerator'
import { soundEngine } from '../../audio/DriveSoundEngine'

interface DvdPlayerSceneProps {
  onDiscLoaded: (disc: DiscData) => void
  onDiscEjected: () => void
  activeDiscId: number | null
  isActive?: boolean
}

interface DiscMeshItem {
  mesh: THREE.Group
  frontMesh: THREE.Mesh
  data: DiscData
  initialPos: THREE.Vector3
  initialRot: THREE.Euler
  baseZ: number
}

function createSoftShadowTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const center = size / 2
  const maxR = size / 2

  // Multi-stop radial gradient for ultra-smooth physical desk drop shadow on white
  const grad = ctx.createRadialGradient(center, center, maxR * 0.40, center, center, maxR)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)')
  grad.addColorStop(0.48, 'rgba(0, 0, 0, 0.28)')
  grad.addColorStop(0.72, 'rgba(0, 0, 0, 0.12)')
  grad.addColorStop(0.88, 'rgba(0, 0, 0, 0.035)')
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(center, center, maxR, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

export function DvdPlayerScene({
  onDiscLoaded,
  onDiscEjected,
  activeDiscId,
  isActive = false,
}: DvdPlayerSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredDisc, setHoveredDisc] = useState<DiscData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isOverTray, setIsOverTray] = useState(false)
  const [trayState, setTrayState] = useState<'open' | 'closing' | 'closed' | 'opening'>('closed')
  const [isDriveBusy, setIsDriveBusy] = useState(true)

  const trayStateRef = useRef<'open' | 'closing' | 'closed' | 'opening'>('closed')
  trayStateRef.current = trayState
  const isDriveBusyRef = useRef(true)
  isDriveBusyRef.current = isDriveBusy
  const isOverTrayRef = useRef(false)

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const driveGroupRef = useRef<THREE.Group | null>(null)
  const trayMeshRef = useRef<THREE.Group | null>(null)
  const discMeshesRef = useRef<DiscMeshItem[]>([])
  const loadedDiscRef = useRef<THREE.Group | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Drag and Drop State
  const draggingDiscRef = useRef<DiscMeshItem | null>(null)
  const isDraggingRef = useRef(false)
  const dragOffset = useRef(new THREE.Vector3())
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const dragStartPointer = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)

  // Raycaster & Mouse Vector
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // Center coordinate of tray well in world space (flush with top bezel without clipping)
  const trayWellCenter = new THREE.Vector3(0, 1.341, 0.035)

  // -----------------------------------------------------------------
  // DYNAMIC STACKING: Bring disc to top visually and in 3D depth
  // -----------------------------------------------------------------
  const bringDiscToTop = useCallback((discItem: DiscMeshItem) => {
    const allDiscs = discMeshesRef.current.filter((d) => d.mesh !== loadedDiscRef.current)
    const otherDiscs = allDiscs
      .filter((d) => d !== discItem)
      .sort((a, b) => a.baseZ - b.baseZ)

    const step = 0.025
    otherDiscs.forEach((d, idx) => {
      const order = (idx + 1) * 10
      d.baseZ = 0.18 + idx * step
      d.initialPos.z = d.baseZ
      if (d !== draggingDiscRef.current) {
        d.mesh.position.z = d.baseZ
      }
      d.mesh.rotation.x = 0
      d.mesh.rotation.y = 0
      d.initialRot.x = 0
      d.initialRot.y = 0

      d.mesh.renderOrder = order
      d.mesh.children.forEach((child) => {
        if (child.name.includes('shadow')) {
          child.renderOrder = order + 1
        } else if (child.name.includes('back')) {
          child.renderOrder = order + 2
        } else if (child.name.includes('rim') || child.name.includes('hub')) {
          child.renderOrder = order + 4
        } else {
          child.renderOrder = order + 3
        }
      })
    })

    const topIdx = otherDiscs.length
    const topOrder = (topIdx + 1) * 10
    const newTopZ = 0.18 + topIdx * step

    discItem.baseZ = newTopZ
    discItem.initialPos.z = newTopZ
    discItem.mesh.rotation.x = 0
    discItem.mesh.rotation.y = 0
    discItem.initialRot.x = 0
    discItem.initialRot.y = 0

    discItem.mesh.renderOrder = topOrder
    discItem.mesh.children.forEach((child) => {
      if (child.name.includes('shadow')) {
        child.renderOrder = topOrder + 1
      } else if (child.name.includes('back')) {
        child.renderOrder = topOrder + 2
      } else if (child.name.includes('rim') || child.name.includes('hub')) {
        child.renderOrder = topOrder + 4
      } else {
        child.renderOrder = topOrder + 3
      }
    })

    return newTopZ
  }, [])

  // -----------------------------------------------------------------
  // SOUND & ANIMATION: Load disc into drive and close tray
  // -----------------------------------------------------------------
  const loadDiscIntoDrive = useCallback((disc: DiscData, isDroppedOnTray: boolean = false) => {
    if (isDriveBusyRef.current || trayStateRef.current !== 'open') return

    const discObj = discMeshesRef.current.find((d) => d.data.id === disc.id)
    if (!discObj || !trayMeshRef.current || !sceneRef.current) return

    // Immediately lock drive and lock this disc as loaded so NO loop or pointer event can touch it
    isDriveBusyRef.current = true
    setIsDriveBusy(true)
    loadedDiscRef.current = discObj.mesh
    draggingDiscRef.current = null
    isDraggingRef.current = false
    setIsDragging(false)
    setHoveredDisc(null)
    setIsOverTray(false)
    isOverTrayRef.current = false

    soundEngine.playDiscDrop()

    const targetPos = trayWellCenter.clone()
    const targetRot = new THREE.Euler(0, 0, 0)
    const startPos = discObj.mesh.position.clone()
    const startRot = discObj.mesh.rotation.clone()

    // If dragged and dropped directly over the tray, snap down into spindle recess in 120ms with NO high arc
    // If clicked from desk, fly gracefully up from desk in 450ms with subtle arc
    const flightDuration = isDroppedOnTray ? 120 : 450
    const arcHeight = isDroppedOnTray ? 0 : 0.45
    const startTime = performance.now()

    function animateFlight(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / flightDuration, 1)
      const ease = isDroppedOnTray
        ? 1 - Math.pow(1 - progress, 3) // easeOutCubic
        : 0.5 - Math.cos(progress * Math.PI) / 2 // easeInOut

      discObj!.mesh.position.lerpVectors(startPos, targetPos, ease)
      if (arcHeight > 0) {
        discObj!.mesh.position.z += Math.sin(progress * Math.PI) * arcHeight
      }
      discObj!.mesh.rotation.x = THREE.MathUtils.lerp(startRot.x, targetRot.x, ease)
      discObj!.mesh.rotation.y = THREE.MathUtils.lerp(startRot.y, targetRot.y, ease)
      discObj!.mesh.rotation.z = THREE.MathUtils.lerp(startRot.z, targetRot.z, ease)

      if (progress < 1) {
        requestAnimationFrame(animateFlight)
      } else {
        // Firmly seat in tray well
        discObj!.mesh.position.copy(targetPos)
        discObj!.mesh.rotation.set(0, 0, 0)
        discObj!.mesh.scale.set(1, 1, 1)

        // Attach to tray group so it moves together into the chassis
        trayMeshRef.current!.attach(discObj!.mesh)

        // 2. Start motorized tray closing animation into top chassis
        soundEngine.playTrayClose()
        setTrayState('closing')
        trayStateRef.current = 'closing'

        const trayCloseStart = performance.now()
        const trayDuration = 800
        const trayStartPos = trayMeshRef.current!.position.clone()
        const trayClosedPos = new THREE.Vector3(0, 1.663, -0.01)

        function animateTrayClose(tNow: number) {
          const tElapsed = tNow - trayCloseStart
          const tProgress = Math.min(tElapsed / trayDuration, 1)
          const tEase = 0.5 - Math.cos(tProgress * Math.PI) / 2

          trayMeshRef.current!.position.lerpVectors(trayStartPos, trayClosedPos, tEase)

          if (tProgress < 1) {
            requestAnimationFrame(animateTrayClose)
          } else {
            setTrayState('closed')
            trayStateRef.current = 'closed'
            // 3. Spindle spin-up sound & track playback
            soundEngine.playSpinUp(() => {
              isDriveBusyRef.current = false
              setIsDriveBusy(false)
              soundEngine.playMusic(disc.id)
              onDiscLoaded(disc)
            })
          }
        }
        requestAnimationFrame(animateTrayClose)
      }
    }

    requestAnimationFrame(animateFlight)
  }, [onDiscLoaded])

  // -----------------------------------------------------------------
  // SOUND & ANIMATION: Eject loaded disc
  // -----------------------------------------------------------------
  const ejectDisc = useCallback(() => {
    if (trayStateRef.current !== 'closed' || !loadedDiscRef.current || !trayMeshRef.current) return

    isDriveBusyRef.current = true
    setIsDriveBusy(true)
    soundEngine.stopMusic()
    soundEngine.playTrayOpen()
    setTrayState('opening')
    trayStateRef.current = 'opening'

    const trayOpenStart = performance.now()
    const trayDuration = 750
    const trayStartPos = trayMeshRef.current.position.clone()
    const trayOpenPos = new THREE.Vector3(0, 0, 0)

    function animateTrayOpen(tNow: number) {
      const tElapsed = tNow - trayOpenStart
      const tProgress = Math.min(tElapsed / trayDuration, 1)
      const tEase = 0.5 - Math.cos(tProgress * Math.PI) / 2

      trayMeshRef.current!.position.lerpVectors(trayStartPos, trayOpenPos, tEase)

      if (tProgress < 1) {
        requestAnimationFrame(animateTrayOpen)
      } else {
        setTrayState('open')
        trayStateRef.current = 'open'
        onDiscEjected()

        // Detach disc from tray back to scene root
        const discObj = discMeshesRef.current.find((d) => d.mesh === loadedDiscRef.current)
        if (discObj && sceneRef.current) {
          sceneRef.current.attach(discObj.mesh)

          // Fly back to its resting desk position
          const returnStart = performance.now()
          const curPos = discObj.mesh.position.clone()
          const curRot = discObj.mesh.rotation.clone()

          function animateReturn(rNow: number) {
            const rElapsed = rNow - returnStart
            const rProgress = Math.min(rElapsed / 600, 1)
            const rEase = 0.5 - Math.cos(rProgress * Math.PI) / 2

            discObj!.mesh.position.lerpVectors(curPos, discObj!.initialPos, rEase)
            discObj!.mesh.position.z += Math.sin(rProgress * Math.PI) * 0.4
            discObj!.mesh.rotation.x = THREE.MathUtils.lerp(curRot.x, discObj!.initialRot.x, rEase)
            discObj!.mesh.rotation.y = THREE.MathUtils.lerp(curRot.y, discObj!.initialRot.y, rEase)
            discObj!.mesh.rotation.z = THREE.MathUtils.lerp(curRot.z, discObj!.initialRot.z, rEase)

            if (rProgress < 1) {
              requestAnimationFrame(animateReturn)
            } else {
              loadedDiscRef.current = null
              isDriveBusyRef.current = false
              setIsDriveBusy(false)
            }
          }
          requestAnimationFrame(animateReturn)
        } else {
          loadedDiscRef.current = null
          isDriveBusyRef.current = false
          setIsDriveBusy(false)
        }
      }
    }
    requestAnimationFrame(animateTrayOpen)
  }, [onDiscEjected])

  // Handle eject trigger from parent
  useEffect(() => {
    if (activeDiscId === null && trayStateRef.current === 'closed' && loadedDiscRef.current) {
      ejectDisc()
    }
  }, [activeDiscId, ejectDisc])

  // -----------------------------------------------------------------
  // 3D SCENE INITIALIZATION
  // -----------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene
    // Transparent scene background allows the yellowish-beige video backdrop to show through
    scene.background = null

    // Camera: Positioned and framed to keep top drive and bottom discs completely inside CRT screen
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0.22, 7.6)
    camera.lookAt(0, 0.22, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Lighting setup for authentic optical reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35)
    scene.add(ambientLight)

    const keySpot = new THREE.DirectionalLight(0xffffff, 0.55)
    keySpot.position.set(0.3, 3.5, 5.0)
    scene.add(keySpot)

    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 0.3)
    rimLight.position.set(-3.0, 1.5, 4.0)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xfef08a, 0.2)
    fillLight.position.set(3.0, -2.5, 3.5)
    scene.add(fillLight)

    // -----------------------------------------------------------------
    // 1. OPTICAL DRIVE CHASSIS & MOTORIZED TRAY (Attached at screen top)
    // -----------------------------------------------------------------
    const driveGroup = new THREE.Group()
    driveGroup.position.set(0, isActive ? 0.00 : 2.4, 0)
    driveGroupRef.current = driveGroup
    scene.add(driveGroup)

    const textureLoader = new THREE.TextureLoader()
    const casingTexture = textureLoader.load('/dvd_casing.png?t=' + Date.now())
    casingTexture.colorSpace = THREE.SRGBColorSpace

    const trayTexture = textureLoader.load('/dvd_tray.png?t=' + Date.now())
    trayTexture.colorSpace = THREE.SRGBColorSpace

    const casingMat = new THREE.MeshStandardMaterial({
      map: casingTexture,
      transparent: true,
      roughness: 0.45,
      metalness: 0.25,
      side: THREE.DoubleSide,
    })

    const trayMat = new THREE.MeshStandardMaterial({
      map: trayTexture,
      transparent: true,
      roughness: 0.55,
      metalness: 0.10,
      side: THREE.DoubleSide,
    })

    // Top Metal Bezel (flush to screen top)
    const casingW = 1.85
    const casingH = casingW * (210 / 824)
    const casingGeo = new THREE.PlaneGeometry(casingW, casingH)
    const chassisMesh = new THREE.Mesh(casingGeo, casingMat)
    chassisMesh.position.set(0, 2.35, 0.08)
    chassisMesh.name = 'drive_chassis'
    driveGroup.add(chassisMesh)

    // Motorized Extending Tray
    const trayGroup = new THREE.Group()
    trayGroup.position.set(0, 1.663, -0.01) // Starts retracted inside top chassis
    trayMeshRef.current = trayGroup
    driveGroup.add(trayGroup)

    const trayW = casingW * (826 / 824)
    const trayH = trayW * (802 / 826)
    const trayBedGeo = new THREE.PlaneGeometry(trayW, trayH)
    const trayBedMesh = new THREE.Mesh(trayBedGeo, trayMat)
    const trayCenterY = 2.237 - trayH / 2 // = 1.337
    trayBedMesh.position.set(0, trayCenterY, 0.02)
    trayBedMesh.name = 'tray_bed'
    trayGroup.add(trayBedMesh)

    // -----------------------------------------------------------------
    // 2. AUTHENTIC 3D CDS (Desk Scatter Matching Reference Screenshot)
    // -----------------------------------------------------------------
    const cdInnerHoleR = 0.064 // Exact optical spindle hole ratio matching CD image
    const cdRadius = 0.68

    // Authentic positions for the 4 real CDs kept safely inside CRT screen bounds
    const discConfigs = [
      // 1. Arpit Bala (Blue Playlist Audio CD, Left Desk)
      { pos: new THREE.Vector3(-1.75, -0.28, 0.18), rot: new THREE.Euler(0, 0, 0.12) },
      // 2. Chaar Diwaari (Golden Holographic CD-R, Center-Left Desk)
      { pos: new THREE.Vector3(-0.62, -0.68, 0.205), rot: new THREE.Euler(0, 0, -0.20) },
      // 3. Karan Kanchan (CD-R74 with Red Swoosh, Center-Right Desk)
      { pos: new THREE.Vector3(0.62, -0.68, 0.23), rot: new THREE.Euler(0, 0, 0.16) },
      // 4. Karhisab (Iridescent CD-R "A LOT", Right Desk)
      { pos: new THREE.Vector3(1.75, -0.28, 0.255), rot: new THREE.Euler(0, 0, -0.14) },
    ]

    const discsCollection: DiscMeshItem[] = []
    const softShadowTexture = createSoftShadowTexture()

    DISCS.forEach((disc, idx) => {
      const discGroup = new THREE.Group()
      const cfg = discConfigs[idx] || discConfigs[0]
      discGroup.position.copy(cfg.pos)
      discGroup.rotation.copy(cfg.rot)
      discGroup.name = `disc_${disc.id}`

      // A. Soft Realistic Desk Contact Drop Shadow
      const shadowGeo = new THREE.PlaneGeometry(cdRadius * 2.30, cdRadius * 2.30)
      const shadowMat = new THREE.MeshBasicMaterial({
        map: softShadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
      shadowMesh.position.set(0.038, -0.046, -0.012)
      shadowMesh.name = `disc_${disc.id}_shadow`
      discGroup.add(shadowMesh)

      // B. Back Data Face: Reflective Polycarbonate Mirror
      const backGeo = new THREE.RingGeometry(cdInnerHoleR, cdRadius * 0.998, 64, 1)
      const backMat = new THREE.MeshStandardMaterial({
        color: 0xd8e2ed,
        metalness: 0.95,
        roughness: 0.12,
        side: THREE.BackSide,
      })
      const backMesh = new THREE.Mesh(backGeo, backMat)
      backMesh.position.set(0, 0, -0.008)
      backMesh.name = `disc_${disc.id}_back`
      discGroup.add(backMesh)

      // C. Front Printed Label Face: True Ring Geometry with real center hole
      const frontGeo = new THREE.RingGeometry(cdInnerHoleR, cdRadius, 64, 1)

      // Use actual provided CD texture image if available, else generated procedural texture
      let labelTexture: THREE.Texture
      if (disc.textureUrl) {
        labelTexture = textureLoader.load(disc.textureUrl + '?v=' + Date.now())
        labelTexture.colorSpace = THREE.SRGBColorSpace
        labelTexture.anisotropy = 16
      } else {
        labelTexture = createCdTexture(disc)
      }

      const frontMat = new THREE.MeshStandardMaterial({
        map: labelTexture,
        transparent: true,
        roughness: 0.24,
        metalness: 0.48,
        side: THREE.FrontSide,
      })

      const frontMesh = new THREE.Mesh(frontGeo, frontMat)
      frontMesh.position.set(0, 0, 0.008)
      frontMesh.name = `disc_${disc.id}_front`
      discGroup.add(frontMesh)

      // D. Clear Polycarbonate 3D Outer Rim Bevel
      const rimGeo = new THREE.RingGeometry(cdRadius * 0.985, cdRadius * 1.008, 64, 1)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.10,
        metalness: 0.20,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
      const rimMesh = new THREE.Mesh(rimGeo, rimMat)
      rimMesh.position.set(0, 0, 0.009)
      rimMesh.name = `disc_${disc.id}_rim`
      discGroup.add(rimMesh)

      // E. Clear Inner Hub Ring (Spindle Ridge)
      const hubGeo = new THREE.RingGeometry(cdInnerHoleR, cdInnerHoleR * 1.95, 64, 1)
      const hubMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity: 0.30,
        side: THREE.DoubleSide,
      })
      const hubMesh = new THREE.Mesh(hubGeo, hubMat)
      hubMesh.position.set(0, 0, 0.009)
      hubMesh.name = `disc_${disc.id}_hub`
      discGroup.add(hubMesh)

      // Initialize renderOrder based on index
      const order = (idx + 1) * 10
      discGroup.renderOrder = order
      shadowMesh.renderOrder = order + 1
      backMesh.renderOrder = order + 2
      frontMesh.renderOrder = order + 3
      rimMesh.renderOrder = order + 4
      hubMesh.renderOrder = order + 4

      scene.add(discGroup)
      discsCollection.push({
        mesh: discGroup,
        frontMesh,
        data: disc,
        initialPos: cfg.pos.clone(),
        initialRot: cfg.rot.clone(),
        baseZ: cfg.pos.z,
      })
    })

    discMeshesRef.current = discsCollection

    // -----------------------------------------------------------------
    // ANIMATION & RENDER LOOP
    // -----------------------------------------------------------------
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Subtle resting float when idle, not dragging, not busy, and not the loaded disc
      if (!isDriveBusyRef.current && trayStateRef.current === 'open') {
        discsCollection.forEach((d, i) => {
          if (
            d.mesh !== loadedDiscRef.current &&
            d !== draggingDiscRef.current
          ) {
            d.mesh.position.y = d.initialPos.y + Math.sin(elapsedTime * 1.4 + i * 1.1) * 0.015
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // -----------------------------------------------------------------
    // RESIZE LISTENER
    // -----------------------------------------------------------------
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // -----------------------------------------------------------------
  // DYNAMIC ENTRANCE: Optical player descends from above & tray glides down open
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!isActive) {
      // When leaving player view (e.g. clicking Back), reset drive to top and tray to closed
      if (driveGroupRef.current) {
        driveGroupRef.current.position.y = 2.4
      }
      if (trayMeshRef.current) {
        trayMeshRef.current.position.set(0, 1.663, -0.01)
      }
      setTrayState('closed')
      trayStateRef.current = 'closed'
      isDriveBusyRef.current = true
      return
    }

    // When entering player screen (viewMode === 'player'):
    // 1. Smoothly descend the optical drive chassis from above the screen (y = 2.4 -> 0)
    if (!driveGroupRef.current || !trayMeshRef.current) return

    isDriveBusyRef.current = true
    setIsDriveBusy(true)
    setTrayState('closed')
    trayStateRef.current = 'closed'

    const driveStart = performance.now()
    const driveDuration = 600
    const startY = 2.4
    const targetY = 0.00

    let trayAnimationStarted = false

    function animateDriveDescent(now: number) {
      const elapsed = now - driveStart
      const progress = Math.min(elapsed / driveDuration, 1)
      // Smooth physical deceleration (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4)

      if (driveGroupRef.current) {
        driveGroupRef.current.position.y = startY + (targetY - startY) * ease
      }

      // 2. As the drive chassis locks into place at the top edge (~250ms), start motorized tray sliding down
      if (elapsed >= 250 && !trayAnimationStarted) {
        trayAnimationStarted = true
        soundEngine.playTrayOpen()
        setTrayState('opening')
        trayStateRef.current = 'opening'

        const trayStart = performance.now()
        const trayDuration = 800
        const trayStartPos = new THREE.Vector3(0, 1.663, -0.01)
        const trayOpenPos = new THREE.Vector3(0, 0, 0)

        function animateTrayGlide(tNow: number) {
          const tElapsed = tNow - trayStart
          const tProgress = Math.min(tElapsed / trayDuration, 1)
          const tEase =
            tProgress < 0.5
              ? 4 * tProgress * tProgress * tProgress
              : 1 - Math.pow(-2 * tProgress + 2, 3) / 2

          if (trayMeshRef.current) {
            trayMeshRef.current.position.lerpVectors(trayStartPos, trayOpenPos, tEase)
          }

          if (tProgress < 1) {
            requestAnimationFrame(animateTrayGlide)
          } else {
            setTrayState('open')
            trayStateRef.current = 'open'
            isDriveBusyRef.current = false
            setIsDriveBusy(false)
          }
        }
        requestAnimationFrame(animateTrayGlide)
      }

      if (progress < 1) {
        requestAnimationFrame(animateDriveDescent)
      }
    }

    requestAnimationFrame(animateDriveDescent)
  }, [isActive])

  // Helper to update mouse coordinates from client pointer event
  const updateMouse = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  // -----------------------------------------------------------------
  // POINTER DOWN: Pick up CD or prepare drag
  // -----------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const camera = cameraRef.current
    if (!container || !camera) return

    updateMouse(e)
    raycaster.current.setFromCamera(mouse.current, camera)

    // Check click on closed drive to eject
    if (trayStateRef.current === 'closed') {
      const chassisIntersect = raycaster.current.intersectObjects(sceneRef.current?.children || [], true)
      const hitChassis = chassisIntersect.find(
        (hit) => hit.object.name === 'drive_chassis' || hit.object.name === 'tray_bed'
      )
      const isChassisArea = Math.abs(mouse.current.x) < 0.35 && mouse.current.y > 0.60
      if (hitChassis || isChassisArea) {
        ejectDisc()
        return
      }
    }

    if (isDriveBusyRef.current) return

    // Check intersection with any CD (excluding currently loaded disc)
    const candidateDiscs = discMeshesRef.current.filter((d) => d.mesh !== loadedDiscRef.current)
    const candidateMeshes = candidateDiscs.map((d) => d.frontMesh)
    const intersects = raycaster.current.intersectObjects(candidateMeshes, false)

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object
      const discItem = candidateDiscs.find((d) => d.frontMesh === hitMesh)

      if (discItem) {
        bringDiscToTop(discItem)
        draggingDiscRef.current = discItem
        isDraggingRef.current = true
        dragStartPointer.current = { x: e.clientX, y: e.clientY }
        hasMovedRef.current = false

        // Create drag plane parallel to camera passing through disc
        dragPlane.current.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 0, 1),
          discItem.mesh.position
        )

        // Calculate offset from grab point to disc center
        const planeIntersect = new THREE.Vector3()
        raycaster.current.ray.intersectPlane(dragPlane.current, planeIntersect)
        dragOffset.current.copy(discItem.mesh.position).sub(planeIntersect)

        // Capture pointer
        try {
          container.setPointerCapture(e.pointerId)
        } catch {
          // ignore
        }

        // Lift disc very subtly (+0.03) over resting discs with NO scale change
        discItem.mesh.position.z = discItem.baseZ + 0.03
        discItem.mesh.scale.set(1, 1, 1)
        soundEngine.playDiscPickup()
      }
    }
  }

  // -----------------------------------------------------------------
  // POINTER MOVE: Smooth dragging across screen + dynamic velocity tilt
  // -----------------------------------------------------------------
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const camera = cameraRef.current
    if (!camera || isDriveBusyRef.current) return

    updateMouse(e)
    raycaster.current.setFromCamera(mouse.current, camera)

    // 1. DRAGGING MODE: Move carried disc with cursor
    if (isDraggingRef.current && draggingDiscRef.current) {
      const dx = e.clientX - dragStartPointer.current.x
      const dy = e.clientY - dragStartPointer.current.y
      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true
        setIsDragging(true)
      }

      const planeIntersect = new THREE.Vector3()
      if (raycaster.current.ray.intersectPlane(dragPlane.current, planeIntersect)) {
        const targetPos = planeIntersect.add(dragOffset.current)
        const disc = draggingDiscRef.current

        // Clamp to screen bounds
        targetPos.x = THREE.MathUtils.clamp(targetPos.x, -2.6, 2.6)
        targetPos.y = THREE.MathUtils.clamp(targetPos.y, -1.8, 1.8)

        disc.mesh.position.x = targetPos.x
        disc.mesh.position.y = targetPos.y
        disc.mesh.position.z = disc.baseZ + 0.04 // subtle lift over resting discs
        disc.mesh.scale.set(1, 1, 1) // strictly 1.0
        disc.mesh.rotation.x = 0
        disc.mesh.rotation.y = 0

        const shadow = disc.mesh.children.find((c) => c.name.includes('shadow'))
        if (shadow) {
          shadow.scale.set(1.08, 1.08, 1)
          shadow.position.set(0.045, -0.058, -0.015)
        }

        // Detect if hovered over tray well for loading
        const distToTray = Math.hypot(targetPos.x - trayWellCenter.x, targetPos.y - trayWellCenter.y)
        const over = distToTray < 0.80 && trayStateRef.current === 'open'
        isOverTrayRef.current = over
        setIsOverTray(over)
      }
      return
    }

    // 2. HOVER MODE: Raycast discs for cursor state & bring hovered disc to top without getting bigger
    const candidateDiscs = discMeshesRef.current.filter((d) => d.mesh !== loadedDiscRef.current)
    const candidateMeshes = candidateDiscs.map((d) => d.frontMesh)
    const intersects = raycaster.current.intersectObjects(candidateMeshes, false)

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object
      const discItem = candidateDiscs.find((d) => d.frontMesh === hitMesh)
      if (discItem) {
        setHoveredDisc(discItem.data)
        bringDiscToTop(discItem)
        // Keep size and depth identical - DO NOT get bigger on hover
        discItem.mesh.position.z = discItem.baseZ
        discItem.mesh.scale.set(1, 1, 1)
        discItem.mesh.rotation.x = 0
        discItem.mesh.rotation.y = 0
        return
      }
    }

    // Reset unhovered discs
    discMeshesRef.current.forEach((d) => {
      if (d.mesh !== loadedDiscRef.current && d !== draggingDiscRef.current) {
        d.mesh.position.z = d.baseZ
        d.mesh.position.y = d.initialPos.y
        d.mesh.rotation.x = 0
        d.mesh.rotation.y = 0
        d.mesh.scale.set(1, 1, 1)
      }
    })
    setHoveredDisc(null)
  }

  // -----------------------------------------------------------------
  // POINTER UP: Drop disc at new desk position OR into open tray well
  // -----------------------------------------------------------------
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (container) {
      try {
        container.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }

    if (isDraggingRef.current && draggingDiscRef.current) {
      const disc = draggingDiscRef.current
      const wasOver = isOverTrayRef.current
      const hasMoved = hasMovedRef.current

      isDraggingRef.current = false
      setIsDragging(false)
      setIsOverTray(false)
      isOverTrayRef.current = false

      disc.mesh.scale.set(1, 1, 1)

      // Calculate distance from current disc position to the tray well center
      const distToTray = Math.hypot(disc.mesh.position.x - trayWellCenter.x, disc.mesh.position.y - trayWellCenter.y)
      const isDroppedInTray = (wasOver || distToTray < 0.85) && trayStateRef.current === 'open'

      if (hasMoved) {
        if (isDroppedInTray) {
          // Dropped right over the open tray: load disc directly and stay in the player!
          loadDiscIntoDrive(disc.data, true)
        } else {
          // Dropped on the desk: bring to top so it rests on top of any overlapping CD!
          const topZ = bringDiscToTop(disc)
          disc.mesh.rotation.x = 0
          disc.mesh.rotation.y = 0
          disc.initialPos.copy(disc.mesh.position)
          disc.initialPos.z = topZ
          disc.mesh.scale.set(1, 1, 1)

          const shadow = disc.mesh.children.find((c) => c.name.includes('shadow'))
          if (shadow) {
            shadow.scale.set(1, 1, 1)
            shadow.position.set(0.038, -0.046, -0.012)
          }

          // Soft tactile drop sound and gentle spring landing
          soundEngine.playDiscDrop()
          const startZ = disc.mesh.position.z
          const targetZ = topZ
          const dropStart = performance.now()

          function animateDrop(now: number) {
            const elapsed = now - dropStart
            const progress = Math.min(elapsed / 120, 1)
            disc.mesh.position.z = THREE.MathUtils.lerp(startZ, targetZ, progress)
            if (progress < 1) {
              requestAnimationFrame(animateDrop)
            }
          }
          requestAnimationFrame(animateDrop)
          draggingDiscRef.current = null
        }
      } else {
        // Quick click without drag: load into tray
        disc.mesh.rotation.x = 0
        disc.mesh.rotation.y = 0
        disc.mesh.scale.set(1, 1, 1)
        if (trayStateRef.current === 'open') {
          loadDiscIntoDrive(disc.data, false)
        } else {
          draggingDiscRef.current = null
        }
      }
    }
  }

  // Cursor style calculation
  const getCursorStyle = () => {
    if (isDragging) return 'grabbing'
    if (hoveredDisc) return 'grab'
    if (trayState === 'closed') return 'pointer'
    return 'default'
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full select-none"
      style={{ cursor: getCursorStyle(), touchAction: 'none' }}
    >
      {/* ------------------------------------------------------------- */}
      {/* "Insert a disc to begin" Speech Bubble Tooltip                */}
      {/* ------------------------------------------------------------- */}
      {trayState === 'open' && !loadedDiscRef.current && !isDriveBusy && (
        <div
          className={`absolute top-[28%] left-[54%] -translate-y-1/2 pointer-events-none transition-all duration-300 z-20 flex items-center ${
            isOverTray ? 'scale-110 opacity-100' : 'opacity-90'
          }`}
        >
          {/* Triangular pointer speech notch */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#fef3c7]" />
          {/* Cream bubble matching reference screenshot */}
          <div className="bg-[#fef3c7] text-[#1c1917] px-3.5 py-1.5 rounded-full shadow-lg border border-[#fde68a] text-[13px] font-medium tracking-tight whitespace-nowrap">
            {isOverTray ? 'Drop disc to play' : isDragging ? 'Drop into drive' : 'Insert a disc to begin'}
          </div>
        </div>
      )}
    </div>
  )
}
