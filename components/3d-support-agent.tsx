"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { motion, AnimatePresence } from "framer-motion"

interface SupportAgentProps {
  thinking: boolean
  message?: string
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
  agentType: "male" | "female"
}

export default function SupportAgent({ thinking, message, emotion, agentType }: SupportAgentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const animationMixerRef = useRef<THREE.AnimationMixer | null>(null)
  const animationsRef = useRef<THREE.AnimationAction[]>([])
  const frameIdRef = useRef<number>(0)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Αρχικοποίηση της 3D σκηνής
  useEffect(() => {
    if (!containerRef.current) return

    // Δημιουργία σκηνής
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827) // Σκούρο φόντο
    sceneRef.current = scene

    // Προσθήκη φωτισμού
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Δημιουργία κάμερας
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 1.2, 2.2) // Τοποθέτηση κάμερας για να βλέπουμε τον χαρακτήρα
    cameraRef.current = camera

    // Δημιουργία renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Περιορισμός για καλύτερη απόδοση
    renderer.outputEncoding = THREE.sRGBEncoding
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Προσθήκη controls για περιστροφή
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.0
    controls.maxDistance = 4
    controls.maxPolarAngle = Math.PI / 1.5 // Περιορισμός περιστροφής προς τα κάτω
    controls.minPolarAngle = 0 // Επιτρέπουμε πλήρη περιστροφή προς τα πάνω
    controls.target.set(0, 1.2, 0) // Στόχευση στο κέντρο του μοντέλου
    controls.update()
    controlsRef.current = controls

    // Φόρτωση του 3D μοντέλου
    loadModel()

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      // Ενημέρωση των controls
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // Ενημέρωση του animation mixer
      if (animationMixerRef.current) {
        const delta = clockRef.current.getDelta()
        animationMixerRef.current.update(delta)
      }

      // Render της σκηνής
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // Προσαρμογή μεγέθους σε αλλαγές παραθύρου
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameIdRef.current)

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

  // Φόρτωση του 3D μοντέλου
  const loadModel = () => {
    if (!sceneRef.current) return

    try {
      // Δημιουργία απλού ανθρώπινου μοντέλου προγραμματιστικά
      const group = new THREE.Group()

      // Δημιουργία κεφαλιού
      const headGeometry = new THREE.SphereGeometry(0.25, 32, 32)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xf2c8a1,
        roughness: 0.7,
        metalness: 0.1,
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 1.5
      group.add(head)

      // Δημιουργία σώματος
      const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.7, 32)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: agentType === "male" ? 0x2c3e50 : 0x8e44ad,
        roughness: 0.8,
        metalness: 0.2,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 1.0
      group.add(body)

      // Δημιουργία ποδιών
      const legGeometry = new THREE.CylinderGeometry(0.07, 0.05, 0.8, 32)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        roughness: 0.8,
        metalness: 0.2,
      })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.1, 0.4, 0)
      group.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.1, 0.4, 0)
      group.add(rightLeg)

      // Δημιουργία χεριών
      const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 32)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: agentType === "male" ? 0x2c3e50 : 0x8e44ad,
        roughness: 0.8,
        metalness: 0.2,
      })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.3, 1.1, 0)
      leftArm.rotation.z = Math.PI / 6
      group.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.3, 1.1, 0)
      rightArm.rotation.z = -Math.PI / 6
      group.add(rightArm)

      // Προσθήκη ματιών
      const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16)
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(-0.08, 1.55, 0.2)
      group.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(0.08, 1.55, 0.2)
      group.add(rightEye)

      // Προσθήκη στόματος
      const mouthGeometry = new THREE.BoxGeometry(0.1, 0.03, 0.03)
      const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
      const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
      mouth.position.set(0, 1.4, 0.2)
      group.add(mouth)

      // Προσθήκη στη σκηνή
      sceneRef.current.add(group)
      modelRef.current = group

      // Δημιουργία απλού animation mixer
      const mixer = new THREE.AnimationMixer(group)
      animationMixerRef.current = mixer

      // Δημιουργία απλών animations
      const createSimpleAnimation = (name: string, transformFunction: (time: number) => void) => {
        const tracks: THREE.KeyframeTrack[] = []
        const times = [0, 1, 2, 3, 4]
        const values: number[] = []

        // Δημιουργία keyframes
        times.forEach((time) => {
          const t = { y: 0, rotZ: 0 }
          transformFunction(time)
          values.push(t.y, t.rotZ)
        })

        const track = new THREE.NumberKeyframeTrack(`${name}.position[1]`, times, values)

        const clip = new THREE.AnimationClip(name, 4, [track])
        return mixer.clipAction(clip)
      }

      // Δημιουργία απλών animations για διαφορετικά συναισθήματα
      const idleAction = createSimpleAnimation("idle", (time) => {
        return { y: Math.sin(time * 0.5) * 0.02, rotZ: 0 }
      })

      const happyAction = createSimpleAnimation("happy", (time) => {
        return { y: Math.sin(time * 1.5) * 0.05, rotZ: Math.sin(time) * 0.1 }
      })

      const thinkingAction = createSimpleAnimation("thinking", (time) => {
        return { y: Math.sin(time * 0.3) * 0.01, rotZ: Math.sin(time * 0.2) * 0.05 }
      })

      animationsRef.current = [idleAction, happyAction, thinkingAction]

      // Εκκίνηση του idle animation
      idleAction.play()

      setIsLoading(false)
    } catch (error) {
      console.error("Σφάλμα δημιουργίας μοντέλου:", error)
      setError("Δεν ήταν δυνατή η δημιουργία του 3D μοντέλου.")
      setIsLoading(false)
    }
  }

  // Αναπαραγωγή animation βάσει συναισθήματος
  useEffect(() => {
    if (emotion === "happy") {
      playAnimation("happy")
    } else if (emotion === "thinking") {
      playAnimation("thinking")
    } else if (emotion === "surprised") {
      playAnimation("surprised")
    } else if (emotion === "confused") {
      playAnimation("confused")
    } else {
      playAnimation("idle")
    }
  }, [emotion])

  // Αναπαραγωγή συγκεκριμένου animation
  const playAnimation = (animName: string) => {
    if (!animationMixerRef.current || animationsRef.current.length === 0) return

    // Σταμάτημα όλων των τρεχόντων animations
    animationsRef.current.forEach((action) => action.stop())

    // Εύρεση του ζητούμενου animation
    // const animation = animationsRef.current.find((anim) => anim.getClip().name.toLowerCase().includes(animName))

    // if (animation) {
    //   animation.reset().play()
    // } else {
    //   // Fallback στο idle animation αν δεν βρεθεί το ζητούμενο
    //   const idleAnim = animationsRef.current.find((anim) => anim.getClip().name.toLowerCase().includes("idle"))
    //   if (idleAnim) {
    //     idleAnim.reset().play()
    //   }
    // }
    if (!animationMixerRef.current || animationsRef.current.length === 0) return

    // Σταμάτημα όλων των τρεχόντων animations
    animationsRef.current.forEach((action) => {
      if (action) action.stop()
    })

    // Επιλογή animation με βάση το συναίσθημα
    let selectedAnimation = animationsRef.current[0] // default to idle

    if (animName === "happy" && animationsRef.current[1]) {
      selectedAnimation = animationsRef.current[1]
    } else if (animName === "thinking" && animationsRef.current[2]) {
      selectedAnimation = animationsRef.current[2]
    }

    // Εκκίνηση του επιλεγμένου animation
    if (selectedAnimation) {
      selectedAnimation.reset().play()
    }

    // Αν έχουμε μοντέλο, ενημερώνουμε την έκφραση του προσώπου
    if (modelRef.current) {
      // Βρίσκουμε το στόμα (υποθέτουμε ότι είναι το τελευταίο παιδί)
      const mouth = modelRef.current.children.find(
        (child) => child.geometry && child.geometry.type === "BoxGeometry",
      ) as THREE.Mesh | undefined

      if (mouth) {
        // Αλλαγή του στόματος ανάλογα με το συναίσθημα
        if (animName === "happy") {
          mouth.scale.set(1, 1.5, 1)
          mouth.position.y = 1.42
        } else if (animName === "thinking") {
          mouth.scale.set(0.7, 1, 1)
          mouth.position.y = 1.38
        } else if (animName === "surprised") {
          mouth.scale.set(0.8, 2, 1)
          mouth.position.y = 1.4
        } else if (animName === "confused") {
          mouth.scale.set(1.2, 0.7, 1)
          mouth.rotation.z = 0.2
          mouth.position.y = 1.38
        } else {
          // Neutral
          mouth.scale.set(1, 1, 1)
          mouth.rotation.z = 0
          mouth.position.y = 1.4
        }
      }
    }
  }

  return (
    <div className="relative">
      {/* 3D Viewer Container */}
      <div ref={containerRef} className="w-64 h-96 md:w-80 md:h-[500px] rounded-lg overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            <div className="w-16 h-16 border-4 border-t-cyan-500 border-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm">Φόρτωση μοντέλου... {Math.round(loadingProgress)}%</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            <p className="text-red-500 text-center p-4">{error}</p>
          </div>
        )}
      </div>

      {/* Συννεφάκι σκέψης */}
      <AnimatePresence>
        {thinking && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl max-w-xs z-10 thinking-bubble"
          >
            <p className="text-gray-800 text-sm md:text-base">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
