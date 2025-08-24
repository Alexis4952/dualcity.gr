"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface RealisticHumanModelProps {
  gender: "male" | "female"
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
}

export default function RealisticHumanModel({ gender, emotion }: RealisticHumanModelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const frameIdRef = useRef<number>(0)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const [isLoading, setIsLoading] = useState(true)

  // Αρχικοποίηση της 3D σκηνής
  useEffect(() => {
    if (!containerRef.current) return

    // Δημιουργία σκηνής
    const scene = new THREE.Scene()
    scene.background = null // Διαφανές φόντο
    sceneRef.current = scene

    // Προσθήκη φωτισμού
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
    backLight.position.set(-1, 0.5, -1)
    scene.add(backLight)

    // Δημιουργία κάμερας
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 1.7, 2.5) // Τοποθέτηση κάμερας για να βλέπουμε τον χαρακτήρα
    cameraRef.current = camera

    // Δημιουργία renderer με διαφανές φόντο
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
    controls.minDistance = 1.5
    controls.maxDistance = 4
    controls.maxPolarAngle = Math.PI / 1.5 // Περιορισμός περιστροφής προς τα κάτω
    controls.minPolarAngle = Math.PI / 4 // Περιορισμός περιστροφής προς τα πάνω
    controls.target.set(0, 1.5, 0) // Στόχευση στο κέντρο του μοντέλου
    controls.update()
    controlsRef.current = controls

    // Δημιουργία του 3D μοντέλου
    createRealisticHuman(gender)

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      // Ενημέρωση των controls
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // Ενημέρωση του μοντέλου με βάση το συναίσθημα
      updateModelEmotion(emotion)

      // Μικρή κίνηση αναπνοής για το μοντέλο
      if (modelRef.current) {
        const time = clockRef.current.getElapsedTime()
        modelRef.current.position.y = Math.sin(time * 0.5) * 0.02 + 0.02
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
  }, [gender])

  // Δημιουργία ρεαλιστικού ανθρώπινου μοντέλου
  const createRealisticHuman = (gender: "male" | "female") => {
    if (!sceneRef.current) return

    // Δημιουργία του μοντέλου
    const humanGroup = new THREE.Group()

    // Χρώματα με βάση το φύλο
    const skinColor = gender === "male" ? 0xe0b69e : 0xf2d2c2
    const hairColor = gender === "male" ? 0x3a3a3a : 0x6b4b35
    const clothesColor = gender === "male" ? 0x2c3e50 : 0x8e44ad

    // Κεφάλι
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.7,
      metalness: 0.1,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.7
    humanGroup.add(head)

    // Μαλλιά
    if (gender === "male") {
      // Κοντά μαλλιά για άνδρα
      const hairGeometry = new THREE.SphereGeometry(0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5)
      const hairMaterial = new THREE.MeshStandardMaterial({
        color: hairColor,
        roughness: 1.0,
        metalness: 0.0,
      })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.y = 1.7
      hair.rotation.x = -0.2
      humanGroup.add(hair)
    } else {
      // Μακριά μαλλιά για γυναίκα
      const hairGeometry = new THREE.SphereGeometry(0.27, 32, 32)
      const hairMaterial = new THREE.MeshStandardMaterial({
        color: hairColor,
        roughness: 1.0,
        metalness: 0.0,
      })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.y = 1.7
      hair.scale.y = 1.1

      // Κόψιμο του κάτω μέρους των μαλλιών
      const hairCutGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.6)
      const hairCutMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const hairCut = new THREE.Mesh(hairCutGeometry, hairCutMaterial)
      hairCut.position.y = 1.55

      // Χρήση του constructive solid geometry για να κόψουμε τα μαλλιά
      const hairCSG = new THREE.Group()
      hairCSG.add(hair)
      humanGroup.add(hairCSG)
    }

    // Λαιμός
    const neckGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 32)
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.7,
      metalness: 0.1,
    })
    const neck = new THREE.Mesh(neckGeometry, neckMaterial)
    neck.position.y = 1.5
    humanGroup.add(neck)

    // Σώμα
    const bodyGeometry = new THREE.CylinderGeometry(0.25, gender === "male" ? 0.3 : 0.35, 0.6, 32)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.8,
      metalness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 1.2
    humanGroup.add(body)

    // Ώμοι
    const shoulderGeometry = new THREE.SphereGeometry(0.12, 32, 16)
    const shoulderMaterial = new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.8,
      metalness: 0.2,
    })

    const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial)
    leftShoulder.position.set(-0.25, 1.4, 0)
    humanGroup.add(leftShoulder)

    const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial)
    rightShoulder.position.set(0.25, 1.4, 0)
    humanGroup.add(rightShoulder)

    // Χέρια
    const armGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.5, 32)
    const armMaterial = new THREE.MeshStandardMaterial({
      color: clothesColor,
      roughness: 0.8,
      metalness: 0.2,
    })

    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.25, 1.15, 0)
    leftArm.rotation.z = Math.PI / 12
    humanGroup.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.25, 1.15, 0)
    rightArm.rotation.z = -Math.PI / 12
    humanGroup.add(rightArm)

    // Χέρια
    const handGeometry = new THREE.SphereGeometry(0.06, 32, 16)
    const handMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.7,
      metalness: 0.1,
    })

    const leftHand = new THREE.Mesh(handGeometry, handMaterial)
    leftHand.position.set(-0.32, 0.9, 0)
    humanGroup.add(leftHand)

    const rightHand = new THREE.Mesh(handGeometry, handMaterial)
    rightHand.position.set(0.32, 0.9, 0)
    humanGroup.add(rightHand)

    // Μέση
    const waistGeometry = new THREE.CylinderGeometry(
      gender === "male" ? 0.3 : 0.35,
      gender === "male" ? 0.28 : 0.4,
      0.2,
      32,
    )
    const waistMaterial = new THREE.MeshStandardMaterial({
      color: 0x34495e,
      roughness: 0.8,
      metalness: 0.2,
    })
    const waist = new THREE.Mesh(waistGeometry, waistMaterial)
    waist.position.y = 0.9
    humanGroup.add(waist)

    // Πόδια
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.8, 32)
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x34495e,
      roughness: 0.8,
      metalness: 0.2,
    })

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.12, 0.4, 0)
    humanGroup.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.12, 0.4, 0)
    humanGroup.add(rightLeg)

    // Παπούτσια
    const shoeGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.2)
    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.8,
      metalness: 0.4,
    })

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial)
    leftShoe.position.set(-0.12, 0.025, 0.05)
    humanGroup.add(leftShoe)

    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial)
    rightShoe.position.set(0.12, 0.025, 0.05)
    humanGroup.add(rightShoe)

    // Πρόσωπο - Μάτια
    const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16)
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const pupilGeometry = new THREE.SphereGeometry(0.015, 16, 16)
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: gender === "male" ? 0x3a3a3a : 0x6b4b35 })

    // Αριστερό μάτι
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.08, 1.72, 0.2)
    humanGroup.add(leftEye)

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    leftPupil.position.set(-0.08, 1.72, 0.23)
    humanGroup.add(leftPupil)

    // Δεξί μάτι
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.08, 1.72, 0.2)
    humanGroup.add(rightEye)

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    rightPupil.position.set(0.08, 1.72, 0.23)
    humanGroup.add(rightPupil)

    // Φρύδια
    const eyebrowGeometry = new THREE.BoxGeometry(0.08, 0.01, 0.01)
    const eyebrowMaterial = new THREE.MeshBasicMaterial({ color: hairColor })

    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    leftEyebrow.position.set(-0.08, 1.78, 0.23)
    humanGroup.add(leftEyebrow)

    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    rightEyebrow.position.set(0.08, 1.78, 0.23)
    humanGroup.add(rightEyebrow)

    // Μύτη
    const noseGeometry = new THREE.ConeGeometry(0.03, 0.07, 32)
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.7,
      metalness: 0.1,
    })
    const nose = new THREE.Mesh(noseGeometry, noseMaterial)
    nose.position.set(0, 1.68, 0.25)
    nose.rotation.x = -Math.PI / 2
    humanGroup.add(nose)

    // Στόμα
    const mouthGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.01)
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xcc6666 })
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.position.set(0, 1.62, 0.24)
    humanGroup.add(mouth)

    // Αποθήκευση αναφορών για τα μέρη του προσώπου για animations
    mouth.userData = { isPartOfFace: true, type: "mouth" }
    leftEyebrow.userData = { isPartOfFace: true, type: "eyebrow", side: "left" }
    rightEyebrow.userData = { isPartOfFace: true, type: "eyebrow", side: "right" }
    leftPupil.userData = { isPartOfFace: true, type: "pupil", side: "left" }
    rightPupil.userData = { isPartOfFace: true, type: "pupil", side: "right" }

    // Προσθήκη στη σκηνή
    sceneRef.current.add(humanGroup)
    modelRef.current = humanGroup

    setIsLoading(false)
  }

  // Ενημέρωση του μοντέλου με βάση το συναίσθημα
  const updateModelEmotion = (emotion: string) => {
    if (!modelRef.current) return

    // Εύρεση των μερών του προσώπου
    const faceParts: Record<string, THREE.Mesh> = {}

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isPartOfFace) {
        const type = child.userData.type
        const side = child.userData.side || ""
        const key = `${type}${side}`
        faceParts[key] = child
      }
    })

    // Ενημέρωση με βάση το συναίσθημα
    switch (emotion) {
      case "happy":
        // Χαμογελαστό στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(1, 1.5, 1)
          faceParts.mouth.position.y = 1.63
          faceParts.mouth.rotation.z = 0.1
        }
        // Ανεβασμένα φρύδια
        if (faceParts.eyebrowleft) faceParts.eyebrowleft.position.y = 1.79
        if (faceParts.eyebrowright) faceParts.eyebrowright.position.y = 1.79
        break

      case "thinking":
        // Σκεπτικό στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(0.7, 1, 1)
          faceParts.mouth.position.y = 1.61
          faceParts.mouth.rotation.z = 0
        }
        // Ασύμμετρα φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 1.78
          faceParts.eyebrowleft.rotation.z = 0.2
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 1.77
          faceParts.eyebrowright.rotation.z = -0.1
        }
        break

      case "surprised":
        // Έκπληκτο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(0.8, 2, 1)
          faceParts.mouth.position.y = 1.62
          faceParts.mouth.rotation.z = 0
        }
        // Ψηλά φρύδια
        if (faceParts.eyebrowleft) faceParts.eyebrowleft.position.y = 1.81
        if (faceParts.eyebrowright) faceParts.eyebrowright.position.y = 1.81
        // Μεγαλύτερες κόρες
        if (faceParts.pupilleft) faceParts.pupilleft.scale.set(1.2, 1.2, 1.2)
        if (faceParts.pupilright) faceParts.pupilright.scale.set(1.2, 1.2, 1.2)
        break

      case "confused":
        // Μπερδεμένο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(1.2, 0.7, 1)
          faceParts.mouth.position.y = 1.61
          faceParts.mouth.rotation.z = 0.2
        }
        // Ασύμμετρα φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 1.77
          faceParts.eyebrowleft.rotation.z = -0.2
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 1.8
          faceParts.eyebrowright.rotation.z = 0.1
        }
        break

      default: // neutral
        // Ουδέτερο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(1, 1, 1)
          faceParts.mouth.position.y = 1.62
          faceParts.mouth.rotation.z = 0
        }
        // Κανονικά φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 1.78
          faceParts.eyebrowleft.rotation.z = 0
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 1.78
          faceParts.eyebrowright.rotation.z = 0
        }
        // Κανονικές κόρες
        if (faceParts.pupilleft) faceParts.pupilleft.scale.set(1, 1, 1)
        if (faceParts.pupilright) faceParts.pupilright.scale.set(1, 1, 1)
        break
    }
  }

  return (
    <div className="relative">
      {/* 3D Viewer Container */}
      <div ref={containerRef} className="w-64 h-96 md:w-80 md:h-[500px] relative" style={{ background: "transparent" }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 z-10 rounded-lg">
            <div className="w-16 h-16 border-4 border-t-cyan-500 border-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm">Φόρτωση μοντέλου...</p>
          </div>
        )}
      </div>
    </div>
  )
}
