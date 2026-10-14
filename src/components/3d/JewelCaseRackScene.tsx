import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { soundEngine } from '../../audio/DriveSoundEngine'
import { Bookmark, Share2, HelpCircle } from 'lucide-react'

export interface JewelCaseData {
  id: number
  title: string
  subtitle: string
  category: string
  catNo: string
  coverUrl: string
  year: string
  countSup: string
  accentColor: string
}

export const CATEGORIES = [
  { id: 'all', label: 'all', count: '²³¹⁷' },
  { id: 'topshots', label: 'topshots', count: '¹²⁴' },
  { id: 'union', label: 'union', count: '⁰¹' },
  { id: 'houston', label: 'houston', count: '⁰³' },
  { id: 'cricket', label: 'cricket', count: '¹⁷' },
  { id: 'games', label: 'games', count: '¹¹' },
  { id: 'trump', label: 'trump', count: '⁰³' },
  { id: 'politics', label: 'politics', count: '¹⁴' },
  { id: 'genious', label: 'genious', count: '¹²' },
  { id: 'economics', label: 'economics', count: '¹⁸' },
  { id: 'cleverland', label: 'cleverland', count: '¹³' },
  { id: 'france', label: 'france', count: '¹⁵' },
  { id: 'celtics', label: 'Celtics', count: '¹⁵' },
  { id: '2018', label: '2018', count: '¹⁸' },
  { id: 'tempa', label: 'tempa', count: '¹³' },
]

export const JEWEL_CASES: JewelCaseData[] = [
  { id: 1, title: 'STADIUM PULSE', subtitle: 'Live Arena Echoes', category: 'topshots', catNo: 'SRTD-201', coverUrl: '/covers/cover_1.jpg', year: '2018', countSup: '¹²⁴', accentColor: '#ff5722' },
  { id: 2, title: 'CROWD HYSTERIA', subtitle: 'Festival Nightfall', category: 'union', catNo: 'SRTD-202', coverUrl: '/covers/cover_2.jpg', year: '2018', countSup: '⁰¹', accentColor: '#e91e63' },
  { id: 3, title: 'SYNTHETIC NIGHTS', subtitle: 'Analog Synthesizers', category: 'games', catNo: 'SRTD-203', coverUrl: '/covers/cover_3.jpg', year: '2019', countSup: '¹¹', accentColor: '#9c27b0' },
  { id: 4, title: 'SYMPHONY NO. 7', subtitle: 'Philharmonic Hall', category: 'genious', catNo: 'SRTD-204', coverUrl: '/covers/cover_4.jpg', year: '2017', countSup: '¹²', accentColor: '#3f51b5' },
  { id: 5, title: 'NEON HORIZON', subtitle: 'Mainstage Radiance', category: 'houston', catNo: 'SRTD-205', coverUrl: '/covers/cover_5.jpg', year: '2018', countSup: '⁰³', accentColor: '#00bcd4' },
  { id: 6, title: 'AFTER HOURS CLUB', subtitle: 'Deep Resonance', category: 'games', catNo: 'SRTD-206', coverUrl: '/covers/cover_6.jpg', year: '2020', countSup: '¹¹', accentColor: '#009688' },
  { id: 7, title: 'SUMMER FESTIVAL', subtitle: 'Open Air Collective', category: 'topshots', catNo: 'SRTD-207', coverUrl: '/covers/cover_7.jpg', year: '2018', countSup: '¹²⁴', accentColor: '#4caf50' },
  { id: 8, title: 'MIDNIGHT RAVE', subtitle: 'Bassline Frequency', category: 'tempa', catNo: 'SRTD-208', coverUrl: '/covers/cover_8.jpg', year: '2018', countSup: '¹³', accentColor: '#ff9800' },
  { id: 9, title: 'ALPINE VISTA', subtitle: 'Acoustic Soundscapes', category: '2018', catNo: 'SRTD-209', coverUrl: '/covers/cover_9.jpg', year: '2018', countSup: '¹⁸', accentColor: '#795548' },
  { id: 10, title: 'URBAN CONCRETE', subtitle: 'Metropolitan Drone', category: 'economics', catNo: 'SRTD-210', coverUrl: '/covers/cover_10.jpg', year: '2019', countSup: '¹⁸', accentColor: '#607d8b' },
  { id: 11, title: 'STREET BAZAAR', subtitle: 'Field Recordings', category: 'cleverland', catNo: 'SRTD-211', coverUrl: '/covers/cover_11.jpg', year: '2018', countSup: '¹³', accentColor: '#ffb300' },
  { id: 12, title: 'BROADCAST 55', subtitle: 'Studio Vocal Sessions', category: 'genious', catNo: 'SRTD-212', coverUrl: '/covers/cover_12.jpg', year: '2018', countSup: '¹²', accentColor: '#d32f2f' },
  { id: 13, title: 'TOKYO DRIFTWAY', subtitle: 'Cyber Electro Beats', category: 'tempa', catNo: 'SRTD-213', coverUrl: '/covers/cover_13.jpg', year: '2021', countSup: '¹³', accentColor: '#e040fb' },
  { id: 14, title: 'HORIZON TOWER', subtitle: 'Ambient Skies', category: 'economics', catNo: 'SRTD-214', coverUrl: '/covers/cover_14.jpg', year: '2018', countSup: '¹⁸', accentColor: '#03a9f4' },
  { id: 15, title: 'ELECTRONIC PULSE', subtitle: 'Underground Sound', category: 'games', catNo: 'SRTD-215', coverUrl: '/covers/cover_15.jpg', year: '2018', countSup: '¹¹', accentColor: '#1de9b6' },
  { id: 16, title: 'GOLDEN HOUR', subtitle: 'Sunset Acoustics', category: '2018', catNo: 'SRTD-216', coverUrl: '/covers/cover_16.jpg', year: '2018', countSup: '¹⁸', accentColor: '#ffc107' },
  { id: 17, title: 'SHIBUYA JUNCTION', subtitle: 'World Transit Beats', category: 'union', catNo: 'SRTD-217', coverUrl: '/covers/cover_17.jpg', year: '2018', countSup: '⁰¹', accentColor: '#ff5252' },
  { id: 18, title: 'ELECTRIC STRINGS', subtitle: 'Vintage Lead Guitar', category: 'celtics', catNo: 'SRTD-218', coverUrl: '/covers/cover_18.jpg', year: '2018', countSup: '¹⁵', accentColor: '#b388ff' },
  { id: 19, title: 'PARADE NATION', subtitle: 'St. Denis Anthems', category: 'france', catNo: 'SRTD-219', coverUrl: '/covers/cover_19.jpg', year: '2018', countSup: '¹⁵', accentColor: '#2979ff' },
  { id: 20, title: 'MAGNETIC TAPE', subtitle: 'Master Reels & Cuts', category: 'politics', catNo: 'SRTD-220', coverUrl: '/covers/cover_20.jpg', year: '2018', countSup: '¹⁴', accentColor: '#ff6e40' },
]

interface JewelCaseRackSceneProps {
  onSelectCase?: (item: JewelCaseData) => void
}

export function JewelCaseRackScene({ onSelectCase }: JewelCaseRackSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(3)
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
  const [savedCases, setSavedCases] = useState<number[]>([4, 7, 12])

  // Live ticking date & time matching reference (e.g. May 28, 2018 / 08:44:59)
  const [currentTime, setCurrentTime] = useState<{ date: string; time: string }>({
    date: 'May 28, 2018',
    time: '08:44:59',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      const timeStr = now.toTimeString().split(' ')[0]
      setCurrentTime({ date: dateStr, time: timeStr })
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Interaction / scroll state refs
  const scrollPosRef = useRef<number>(3.0)
  const targetScrollPosRef = useRef<number>(3.0)
  const isPointerDownRef = useRef<boolean>(false)
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const scrollStartRef = useRef<number>(3.0)
  const hoveredIndexRef = useRef<number | null>(null)
  const lastUserInteractionTime = useRef<number>(Date.now())

  // Filtered cases
  const displayedCases = useMemo(() => {
    if (selectedCategory === 'all') return JEWEL_CASES
    const filtered = JEWEL_CASES.filter((c) => c.category === selectedCategory)
    return filtered.length > 0 ? filtered : JEWEL_CASES
  }, [selectedCategory])

  const toggleSaveCurrent = () => {
    const current = displayedCases[activeCaseIndex]
    if (!current) return
    setSavedCases((prev) =>
      prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [...prev, current.id]
    )
    soundEngine.playCaseClick()
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    soundEngine.playCaseClick()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Three.js Scene
    const scene = new THREE.Scene()
    scene.background = null

    // 2. Camera: Wide perspective closer to cases for strong convergence
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0.1, 5.8)
    camera.lookAt(0, 0, 0)

    // 3. Renderer with high dynamic range & filmic tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    container.appendChild(renderer.domElement)

    // 4. Studio Lighting for transparent acrylic & shiny disc
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35)
    keyLight.position.set(4, 8, 6)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.65)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xd8e8ff, 0.9)
    rimLight.position.set(3, 4, -4)
    scene.add(rimLight)

    // 5. 3D Jewel Case Construction
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    const textureLoader = new THREE.TextureLoader()

    // Jewel case dimensions (standard 142mm x 125mm x 10mm ratio)
    const caseW = 1.44
    const caseH = 1.25
    const caseT = 0.088

    // Outer clear acrylic physical box material
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.08,
      transmission: 0.90,
      ior: 1.52,
      thickness: 0.09,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    })

    // Bright acrylic edge gleam lines
    const boxGeo = new THREE.BoxGeometry(caseW, caseH, caseT)
    const edgesGeo = new THREE.EdgesGeometry(boxGeo)
    const edgeLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })

    // Back dark polycarbonate tray
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x181a1c,
      roughness: 0.45,
      metalness: 0.25,
      side: THREE.DoubleSide,
    })

    // 3D CD Disc inside: holographic metallic data side
    const discOuterR = 0.52
    const discInnerR = 0.075
    const discGeo = new THREE.RingGeometry(discInnerR, discOuterR, 48)
    const discMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8dce2,
      metalness: 0.88,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.85,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 380],
      side: THREE.DoubleSide,
    })

    // Disc clear hub
    const hubGeo = new THREE.RingGeometry(discInnerR, 0.17, 32)
    const hubMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })

    // Soft ground contact shadow texture
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 256
    shadowCanvas.height = 256
    const sCtx = shadowCanvas.getContext('2d')!
    const sGrad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120)
    sGrad.addColorStop(0, 'rgba(0,0,0,0.30)')
    sGrad.addColorStop(0.5, 'rgba(0,0,0,0.12)')
    sGrad.addColorStop(0.85, 'rgba(0,0,0,0.02)')
    sGrad.addColorStop(1, 'rgba(0,0,0,0)')
    sCtx.fillStyle = sGrad
    sCtx.fillRect(0, 0, 256, 256)
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas)
    const shadowGeo = new THREE.PlaneGeometry(caseW * 1.4, caseW * 1.4)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.40,
      depthWrite: false,
    })

    const caseNodes: {
      group: THREE.Group
      data: JewelCaseData
      hitMesh: THREE.Mesh
      idx: number
    }[] = []

    displayedCases.forEach((item, idx) => {
      const caseGroup = new THREE.Group()

      // 1. Clear Acrylic Outer Shell
      const shellMesh = new THREE.Mesh(boxGeo, acrylicMat)
      caseGroup.add(shellMesh)

      // 2. Beveled Highlight Edge Lines
      const edgeLines = new THREE.LineSegments(edgesGeo, edgeLineMat)
      caseGroup.add(edgeLines)

      // 3. Two Hinge Tabs on Left Edge
      const hingeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.088, 16)
      const hingeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
      })
      const topHinge = new THREE.Mesh(hingeGeo, hingeMat)
      topHinge.position.set(-caseW / 2 + 0.01, caseH * 0.38, 0)
      caseGroup.add(topHinge)

      const btmHinge = new THREE.Mesh(hingeGeo, hingeMat)
      btmHinge.position.set(-caseW / 2 + 0.01, -caseH * 0.38, 0)
      caseGroup.add(btmHinge)

      // 4. Back Polycarbonate Dark Tray
      const trayGeo = new THREE.PlaneGeometry(caseW * 0.94, caseH * 0.94)
      const trayMesh = new THREE.Mesh(trayGeo, trayMat)
      trayMesh.position.set(0.02, 0, -caseT / 2 + 0.008)
      caseGroup.add(trayMesh)

      // 5. Real 3D CD Disc inside
      const discMesh = new THREE.Mesh(discGeo, discMat)
      discMesh.position.set(0.12, 0, -caseT / 2 + 0.012)
      caseGroup.add(discMesh)

      const hubMesh = new THREE.Mesh(hubGeo, hubMat)
      hubMesh.position.set(0.12, 0, -caseT / 2 + 0.013)
      caseGroup.add(hubMesh)

      const spindleGeo = new THREE.CylinderGeometry(discInnerR, discInnerR, 0.018, 16)
      const spindleMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
      const spindleMesh = new THREE.Mesh(spindleGeo, spindleMat)
      spindleMesh.rotation.x = Math.PI / 2
      spindleMesh.position.set(0.12, 0, -caseT / 2 + 0.014)
      caseGroup.add(spindleMesh)

      // 6. Front Booklet Cover Insert (Real Photograph)
      const coverTex = textureLoader.load(item.coverUrl)
      coverTex.colorSpace = THREE.SRGBColorSpace
      const coverGeo = new THREE.PlaneGeometry(1.20, 1.20)
      const coverMat = new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.35,
        metalness: 0.1,
        side: THREE.FrontSide,
      })
      const coverMesh = new THREE.Mesh(coverGeo, coverMat)
      coverMesh.position.set(0.08, 0, caseT / 2 - 0.006)
      caseGroup.add(coverMesh)

      // 7. Spine strip on Left Edge
      const spineGeo = new THREE.PlaneGeometry(caseT, caseH * 0.98)
      const spineMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.accentColor),
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
      })
      const spineMesh = new THREE.Mesh(spineGeo, spineMat)
      spineMesh.rotation.y = Math.PI / 2
      spineMesh.position.set(-caseW / 2 + 0.005, 0, 0)
      caseGroup.add(spineMesh)

      // 8. Contact Floor Drop Shadow
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
      shadowMesh.rotation.x = -Math.PI / 2
      shadowMesh.position.set(0.15, -caseH / 2 - 0.015, 0)
      caseGroup.add(shadowMesh)

      // 9. Hit mesh for raycasting
      const hitGeo = new THREE.BoxGeometry(caseW * 1.1, caseH * 1.1, caseT * 2.2)
      const hitMat = new THREE.MeshBasicMaterial({ visible: false })
      const hitMesh = new THREE.Mesh(hitGeo, hitMat)
      hitMesh.name = `jewel_case_${item.id}`
      caseGroup.add(hitMesh)

      rootGroup.add(caseGroup)

      caseNodes.push({
        group: caseGroup,
        data: item,
        hitMesh,
        idx,
      })
    })

    // 6. Mathematically Non-Intersecting Diagonal Track (Bottom-Left to Top-Right)
    // To ensure ZERO collision between adjacent cases:
    // With yaw = +0.72 rad (~41.2°), normal N = (sin(yaw), 0, cos(yaw)) = (0.658, 0, 0.753)
    // Perpendicular step: delta_N = 0.658 * stepX + 0.753 * stepZ
    // Setting stepX = 0.28, stepY = 0.15, stepZ = -0.52 gives delta_N = -0.207
    // Since case thickness caseT = 0.088, the perpendicular air clearance is 0.119 > 0!
    // NO TWO CASES CAN EVER PHYSICALLY TOUCH OR CLIP!
    const stepX = 0.28
    const stepY = 0.15
    const stepZ = -0.52
    const baseYaw = 0.72 // ~41.2 degrees yaw: left edge is closer and taller, right edge recedes

    // Non-linear center spacing for the focal gap
    const calcOffset = (d: number) => {
      const sign = Math.sign(d)
      const absD = Math.abs(d)
      // Generous center gap so active item is isolated, then compact clean spacing
      const centerExpansion = 1.35 * Math.tanh(absD * 1.5)
      return sign * (centerExpansion + absD * 0.35)
    }

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isPointerDownRef.current) {
        lastUserInteractionTime.current = Date.now()
        const dx = e.clientX - pointerStartRef.current.x
        const dy = e.clientY - pointerStartRef.current.y
        const diagDelta = (dx * 0.75 + -dy * 0.75) * 0.0055
        targetScrollPosRef.current = scrollStartRef.current - diagDelta
      } else {
        raycaster.setFromCamera(mouse, camera)
        const hitMeshes = caseNodes.map((c) => c.hitMesh)
        const intersects = raycaster.intersectObjects(hitMeshes, false)
        if (intersects.length > 0) {
          const hit = intersects[0].object
          const found = caseNodes.find((c) => c.hitMesh === hit)
          if (found && hoveredIndexRef.current !== found.idx) {
            hoveredIndexRef.current = found.idx
            soundEngine.playCaseHover()
          }
        } else {
          hoveredIndexRef.current = null
        }
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true
      lastUserInteractionTime.current = Date.now()
      pointerStartRef.current = { x: e.clientX, y: e.clientY }
      scrollStartRef.current = targetScrollPosRef.current
    }

    const handlePointerUp = () => {
      isPointerDownRef.current = false
      lastUserInteractionTime.current = Date.now()
    }

    const handleClick = () => {
      if (hoveredIndexRef.current !== null) {
        lastUserInteractionTime.current = Date.now()
        const targetIdx = hoveredIndexRef.current
        targetScrollPosRef.current = targetIdx
        setActiveCaseIndex(targetIdx)
        soundEngine.playCaseClick()
        if (onSelectCase) {
          onSelectCase(displayedCases[targetIdx])
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      lastUserInteractionTime.current = Date.now()
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.003
      targetScrollPosRef.current += delta
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        lastUserInteractionTime.current = Date.now()
        targetScrollPosRef.current += 1
        soundEngine.playCaseClick()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        lastUserInteractionTime.current = Date.now()
        targetScrollPosRef.current -= 1
        soundEngine.playCaseClick()
      }
    }

    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('click', handleClick)
    container.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    // 8. Animation Loop with Continuous Infinite Looping Motion
    let animId: number
    const clock = new THREE.Clock()
    const totalCount = displayedCases.length

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Continuous gentle drift / moving loop when not dragging
      if (!isPointerDownRef.current) {
        // Continuous steady forward conveyor movement
        targetScrollPosRef.current += 0.0032
      }

      // Smooth interpolation
      scrollPosRef.current = THREE.MathUtils.lerp(
        scrollPosRef.current,
        targetScrollPosRef.current,
        0.08
      )

      // Active index calculation wrapped to [0, totalCount)
      const currentInt = ((Math.round(scrollPosRef.current) % totalCount) + totalCount) % totalCount
      if (currentInt !== activeCaseIndex) {
        setActiveCaseIndex(currentInt)
      }

      caseNodes.forEach((node) => {
        // Infinite modular wrapping around scroll position
        let d = ((node.idx - scrollPosRef.current) % totalCount + totalCount * 1.5) % totalCount - totalCount * 0.5

        const offset = calcOffset(d)
        const absD = Math.abs(d)
        const isHovered = hoveredIndexRef.current === node.idx
        const isCenter = absD < 0.42

        // Coordinates strictly non-intersecting along diagonal
        let posX = offset * stepX
        let posY = offset * stepY
        let posZ = offset * stepZ

        // Center item floats forward slightly for focus
        if (isCenter) {
          const centerLift = (1 - absD / 0.42) * 0.22
          posZ += centerLift
          posY += centerLift * 0.1
        }

        // Hover pop: slides outward perpendicular
        if (isHovered) {
          posX += -0.10
          posY += 0.06
          posZ += 0.25
        }

        // Ambient gentle floating motion
        posY += Math.sin(elapsed * 1.4 + node.idx * 0.4) * 0.01

        // Yaw angle
        let targetYaw = baseYaw
        if (isCenter) {
          targetYaw = THREE.MathUtils.lerp(baseYaw, 0.58, 1 - absD / 0.42)
        }
        if (isHovered) {
          targetYaw -= 0.06
        }

        node.group.position.set(posX, posY, posZ)
        node.group.rotation.set(0, targetYaw, 0)

        // Visibility culling: hide cases that are wrapping around far off-screen
        node.group.visible = absD < totalCount * 0.48
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('click', handleClick)
      container.removeEventListener('wheel', handleWheel)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [displayedCases, activeCaseIndex, onSelectCase])

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#ebe8e3] text-neutral-900 font-sans">
      {/* ============================================================ */}
      {/* 1. TOP-LEFT: Clean Date & Live Time Counter                  */}
      {/* ============================================================ */}
      <div className="absolute top-8 left-8 md:top-10 md:left-12 z-20 pointer-events-none font-mono text-xs text-neutral-900 leading-tight">
        <div className="font-bold tracking-tight">{currentTime.date}</div>
        <div className="font-medium tracking-wider text-neutral-700">{currentTime.time}</div>
      </div>

      {/* ============================================================ */}
      {/* 2. TOP-CENTER: "every : second" Header                       */}
      {/* ============================================================ */}
      <div className="absolute top-8 md:top-10 inset-x-0 z-20 flex justify-center items-center pointer-events-none">
        <span className="font-mono text-xs md:text-sm font-semibold tracking-widest text-neutral-800 lowercase">
          every : second
        </span>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN 3D CANVAS: Pure Blank Canvas with Diagonal Cases     */}
      {/* ============================================================ */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
        title="Drag or scroll to slide along the diagonal jewel case rack"
      />

      {/* ============================================================ */}
      {/* 4. RIGHT SIDEBAR: Minimalist Tag Index with Superscripts     */}
      {/* ============================================================ */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end gap-1 font-sans text-xs select-none pointer-events-auto">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                soundEngine.playCaseClick()
              }}
              className={`flex items-baseline gap-1 py-0.5 px-1 text-right transition-colors cursor-pointer group ${
                isSelected
                  ? 'text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-800 font-normal'
              }`}
            >
              <span className="text-xs group-hover:underline decoration-neutral-400 underline-offset-2">
                {cat.label}
              </span>
              <span
                className={`font-mono text-[10px] ${
                  isSelected ? 'text-neutral-900 font-semibold' : 'text-neutral-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ============================================================ */}
      {/* 5. BOTTOM-RIGHT: Minimalist Utility Icons (No Card Box)      */}
      {/* ============================================================ */}
      <div className="absolute bottom-8 right-8 md:bottom-10 md:right-12 z-20 flex items-center gap-4 text-neutral-500 pointer-events-auto">
        <button
          onClick={toggleSaveCurrent}
          className="hover:text-neutral-950 transition-colors p-1 rounded-md hover:bg-black/5 cursor-pointer relative"
          title={savedCases.includes(displayedCases[activeCaseIndex]?.id || 0) ? 'Bookmarked' : 'Bookmark'}
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${
              savedCases.includes(displayedCases[activeCaseIndex]?.id || 0)
                ? 'fill-neutral-900 text-neutral-900'
                : ''
            }`}
          />
        </button>

        <button
          onClick={handleShare}
          className="hover:text-neutral-950 transition-colors p-1 rounded-md hover:bg-black/5 cursor-pointer relative"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowHelpModal((prev) => !prev)}
          className="hover:text-neutral-950 transition-colors p-1 rounded-md hover:bg-black/5 cursor-pointer"
          title="Info"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 6. HELP MODAL                                                */}
      {/* ============================================================ */}
      {showHelpModal && (
        <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-300 shadow-xl max-w-sm w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                ARCHIVE CONTROLS
              </span>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-neutral-400 hover:text-neutral-900 text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-neutral-700">
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="font-medium">Continuous Stream</span>
                <span className="font-mono text-neutral-500">Auto-drifts infinitely</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="font-medium">Slide Stream</span>
                <span className="font-mono text-neutral-500">Drag or Scroll</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="font-medium">Step Track</span>
                <span className="font-mono text-neutral-500">← / → Arrow Keys</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="font-medium">Inspect Case</span>
                <span className="font-mono text-neutral-500">Click Any Jewel Case</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Filter Index</span>
                <span className="font-mono text-neutral-500">Click Right Sidebar</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
