"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface CartoonAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
  hairColor?: string
  skinTone?: string
  shirtColor?: string
}

export default function CartoonAvatar({
  emotion = "neutral",
  hairColor = "#6b4423",
  skinTone = "#ffcbb8",
  shirtColor = "#f5f5f5",
}: CartoonAvatarProps) {
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

    // Προσθήκη rim light για cartoon εφέ
    const rimLight = new THREE.DirectionalLight(0x9090ff, 0.6)
    rimLight.position.set(0, 0, -1)
    scene.add(rimLight)

    // Δημιουργία κάμερας
    const camera = new THREE.PerspectiveCamera(
      40,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0.2, 1.2) // Τοποθέτηση κάμερας για να βλέπουμε το πρόσωπο
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
    controls.minDistance = 0.8
    controls.maxDistance = 2
    controls.maxPolarAngle = Math.PI / 1.5 // Περιορισμός περιστροφής προς τα κάτω
    controls.minPolarAngle = Math.PI / 4 // Περιορισμός περιστροφής προς τα πάνω
    controls.target.set(0, 0.2, 0) // Στόχευση στο κέντρο του προσώπου
    controls.update()
    controlsRef.current = controls

    // Δημιουργία του 3D μοντέλου
    createCartoonAvatar(hairColor, skinTone, shirtColor)

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
        modelRef.current.position.y = Math.sin(time * 0.5) * 0.01
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
  }, [hairColor, skinTone, shirtColor])

  // Δημιουργία cartoon avatar
  const createCartoonAvatar = (hairColor: string, skinTone: string, shirtColor: string) => {
    if (!sceneRef.current) return

    // Μετατροπή χρωμάτων από hex σε THREE.Color
    const hairColorObj = new THREE.Color(hairColor)
    const skinToneObj = new THREE.Color(skinTone)
    const shirtColorObj = new THREE.Color(shirtColor)

    // Δημιουργία του μοντέλου
    const avatarGroup = new THREE.Group()

    // Υλικά με cartoon shading
    const createCartoonMaterial = (color: THREE.Color) => {
      return new THREE.MeshToonMaterial({
        color: color,
        specular: 0x111111,
        shininess: 1,
      })
    }

    // Κεφάλι (πιο ωοειδές για cartoon look)
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    // Παραμόρφωση για πιο ωοειδές σχήμα
    const headPositions = headGeometry.attributes.position
    for (let i = 0; i < headPositions.count; i++) {
      const vertex = new THREE.Vector3()
      vertex.fromBufferAttribute(headPositions, i)

      // Πλάτυνση στα πλάγια
      vertex.x *= 0.8

      // Επιμήκυνση προς τα κάτω
      if (vertex.y < 0) {
        vertex.y *= 1.2
      }

      // Πλάτυνση στο πίσω μέρος
      if (vertex.z < 0) {
        vertex.z *= 0.9
      }

      // Μικρή προεξοχή για το σαγόνι
      if (vertex.y < -0.2 && vertex.z > 0) {
        vertex.z += 0.05
      }

      headPositions.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }
    headGeometry.computeVertexNormals()

    const headMaterial = createCartoonMaterial(skinToneObj)
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 0.2
    avatarGroup.add(head)

    // Αυτιά (μεγαλύτερα για cartoon look)
    const earGeometry = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI)
    const earMaterial = createCartoonMaterial(skinToneObj)

    // Αριστερό αυτί
    const leftEar = new THREE.Mesh(earGeometry, earMaterial)
    leftEar.position.set(-0.4, 0.2, 0)
    leftEar.rotation.y = Math.PI / 2
    leftEar.scale.z = 0.5
    avatarGroup.add(leftEar)

    // Δεξί αυτί
    const rightEar = new THREE.Mesh(earGeometry, earMaterial)
    rightEar.position.set(0.4, 0.2, 0)
    rightEar.rotation.y = -Math.PI / 2
    rightEar.scale.z = 0.5
    avatarGroup.add(rightEar)

    // Μαλλιά (στυλιζαρισμένα για cartoon look)
    const hairGroup = new THREE.Group()

    // Βασικό σχήμα μαλλιών
    const hairBaseGeometry = new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2)
    const hairBaseMaterial = createCartoonMaterial(hairColorObj)
    const hairBase = new THREE.Mesh(hairBaseGeometry, hairBaseMaterial)
    hairBase.position.y = 0.2
    hairBase.position.y += 0.25
    hairGroup.add(hairBase)

    // Μπροστινά μαλλιά (φράντζα)
    const frontHairGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.2)
    const frontHair = new THREE.Mesh(frontHairGeometry, hairBaseMaterial)
    frontHair.position.set(0, 0.65, 0.35)
    frontHair.rotation.x = Math.PI / 8
    hairGroup.add(frontHair)

    // Πλαϊνά μαλλιά
    const sideHairGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.4)

    // Αριστερά
    const leftSideHair = new THREE.Mesh(sideHairGeometry, hairBaseMaterial)
    leftSideHair.position.set(-0.4, 0.5, 0.1)
    leftSideHair.rotation.z = -Math.PI / 12
    hairGroup.add(leftSideHair)

    // Δεξιά
    const rightSideHair = new THREE.Mesh(sideHairGeometry, hairBaseMaterial)
    rightSideHair.position.set(0.4, 0.5, 0.1)
    rightSideHair.rotation.z = Math.PI / 12
    hairGroup.add(rightSideHair)

    // Τούφες μαλλιών στο πάνω μέρος
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const radius = 0.2

      const tuftGeometry = new THREE.ConeGeometry(0.1, 0.25, 8)
      const tuft = new THREE.Mesh(tuftGeometry, hairBaseMaterial)

      tuft.position.x = Math.sin(angle) * radius
      tuft.position.z = Math.cos(angle) * radius
      tuft.position.y = 0.7

      // Τυχαία περιστροφή για κάθε τούφα
      tuft.rotation.x = ((Math.random() - 0.5) * Math.PI) / 2
      tuft.rotation.z = ((Math.random() - 0.5) * Math.PI) / 2

      hairGroup.add(tuft)
    }

    avatarGroup.add(hairGroup)

    // Μάτια (μεγαλύτερα για cartoon look)
    const eyeGeometry = new THREE.SphereGeometry(0.12, 32, 32)
    const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

    // Αριστερό μάτι
    const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial)
    leftEye.position.set(-0.15, 0.25, 0.4)
    leftEye.scale.z = 0.1
    avatarGroup.add(leftEye)

    // Δεξί μάτι
    const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial)
    rightEye.position.set(0.15, 0.25, 0.4)
    rightEye.scale.z = 0.1
    avatarGroup.add(rightEye)

    // Ίριδες (καφέ)
    const irisGeometry = new THREE.SphereGeometry(0.06, 32, 32)
    const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x613b15 })

    const leftIris = new THREE.Mesh(irisGeometry, irisMaterial)
    leftIris.position.set(-0.15, 0.25, 0.48)
    leftIris.userData = { isPartOfFace: true, type: "iris", side: "left" }
    avatarGroup.add(leftIris)

    const rightIris = new THREE.Mesh(irisGeometry, irisMaterial)
    rightIris.position.set(0.15, 0.25, 0.48)
    rightIris.userData = { isPartOfFace: true, type: "iris", side: "right" }
    avatarGroup.add(rightIris)

    // Κόρες
    const pupilGeometry = new THREE.SphereGeometry(0.025, 32, 32)
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    leftPupil.position.set(-0.15, 0.25, 0.54)
    leftPupil.userData = { isPartOfFace: true, type: "pupil", side: "left" }
    avatarGroup.add(leftPupil)

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    rightPupil.position.set(0.15, 0.25, 0.54)
    rightPupil.userData = { isPartOfFace: true, type: "pupil", side: "right" }
    avatarGroup.add(rightPupil)

    // Φρύδια
    const eyebrowGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.02)
    const eyebrowMaterial = createCartoonMaterial(hairColorObj)

    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    leftEyebrow.position.set(-0.15, 0.4, 0.45)
    leftEyebrow.userData = { isPartOfFace: true, type: "eyebrow", side: "left" }
    avatarGroup.add(leftEyebrow)

    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    rightEyebrow.position.set(0.15, 0.4, 0.45)
    rightEyebrow.userData = { isPartOfFace: true, type: "eyebrow", side: "right" }
    avatarGroup.add(rightEyebrow)

    // Μύτη (απλοποιημένη για cartoon look)
    const noseGeometry = new THREE.SphereGeometry(0.07, 32, 32)
    const noseMaterial = createCartoonMaterial(new THREE.Color(skinTone).multiplyScalar(0.9))
    const nose = new THREE.Mesh(noseGeometry, noseMaterial)
    nose.position.set(0, 0.15, 0.5)
    nose.scale.set(0.6, 0.6, 0.6)
    avatarGroup.add(nose)

    // Στόμα
    const mouthGeometry = new THREE.BoxGeometry(0.25, 0.03, 0.01)
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xd35656 })
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.position.set(0, 0, 0.5)
    mouth.position.y = -0.05
    mouth.userData = { isPartOfFace: true, type: "mouth" }
    avatarGroup.add(mouth)

    // Λαιμός
    const neckGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 32)
    const neckMaterial = createCartoonMaterial(skinToneObj)
    const neck = new THREE.Mesh(neckGeometry, neckMaterial)
    neck.position.y = -0.3
    avatarGroup.add(neck)

    // Μπλούζα
    const shirtGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.4, 32)
    const shirtMaterial = createCartoonMaterial(shirtColorObj)
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial)
    shirt.position.y = -0.6
    avatarGroup.add(shirt)

    // Γιακάς μπλούζας
    const collarGeometry = new THREE.TorusGeometry(0.18, 0.04, 16, 32, Math.PI)
    const collarMaterial = createCartoonMaterial(shirtColorObj.clone().multiplyScalar(0.9))
    const collar = new THREE.Mesh(collarGeometry, collarMaterial)
    collar.position.set(0, -0.4, 0.1)
    collar.rotation.x = Math.PI / 2
    avatarGroup.add(collar)

    // Προσθήκη στη σκηνή
    sceneRef.current.add(avatarGroup)
    modelRef.current = avatarGroup

    // Περιστροφή για να κοιτάζει προς τα εμπρός
    avatarGroup.rotation.y = Math.PI

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
          faceParts.mouth.scale.set(1, 2, 1)
          faceParts.mouth.position.y = -0.05
          faceParts.mouth.rotation.z = 0.1
          faceParts.mouth.geometry = new THREE.BoxGeometry(0.25, 0.05, 0.01)
        }
        // Ανεβασμένα φρύδια
        if (faceParts.eyebrowleft) faceParts.eyebrowleft.position.y = 0.42
        if (faceParts.eyebrowright) faceParts.eyebrowright.position.y = 0.42
        break

      case "thinking":
        // Σκεπτικό στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(0.7, 1, 1)
          faceParts.mouth.position.y = -0.07
          faceParts.mouth.rotation.z = 0
        }
        // Ασύμμετρα φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 0.4
          faceParts.eyebrowleft.rotation.z = 0.2
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 0.45
          faceParts.eyebrowright.rotation.z = -0.1
        }
        break

      case "surprised":
        // Έκπληκτο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(0.8, 2, 1)
          faceParts.mouth.position.y = -0.05
          faceParts.mouth.rotation.z = 0
          faceParts.mouth.geometry = new THREE.CircleGeometry(0.05, 32)
        }
        // Ψηλά φρύδια
        if (faceParts.eyebrowleft) faceParts.eyebrowleft.position.y = 0.48
        if (faceParts.eyebrowright) faceParts.eyebrowright.position.y = 0.48
        // Μεγαλύτερες κόρες
        if (faceParts.pupilleft) faceParts.pupilleft.scale.set(1.2, 1.2, 1.2)
        if (faceParts.pupilright) faceParts.pupilright.scale.set(1.2, 1.2, 1.2)
        break

      case "confused":
        // Μπερδεμένο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(1.2, 0.7, 1)
          faceParts.mouth.position.y = -0.07
          faceParts.mouth.rotation.z = 0.2
        }
        // Ασύμμετρα φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 0.38
          faceParts.eyebrowleft.rotation.z = -0.2
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 0.45
          faceParts.eyebrowright.rotation.z = 0.1
        }
        break

      default: // neutral
        // Ουδέτερο στόμα
        if (faceParts.mouth) {
          faceParts.mouth.scale.set(1, 1, 1)
          faceParts.mouth.position.y = -0.05
          faceParts.mouth.rotation.z = 0
          faceParts.mouth.geometry = new THREE.BoxGeometry(0.25, 0.03, 0.01)
        }
        // Κανονικά φρύδια
        if (faceParts.eyebrowleft) {
          faceParts.eyebrowleft.position.y = 0.4
          faceParts.eyebrowleft.rotation.z = 0
        }
        if (faceParts.eyebrowright) {
          faceParts.eyebrowright.position.y = 0.4
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
      <div ref={containerRef} className="w-64 h-64 md:w-80 md:h-80 relative" style={{ background: "transparent" }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 z-10 rounded-lg">
            <div className="w-16 h-16 border-4 border-t-cyan-500 border-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        )}
      </div>
    </div>
  )
}
