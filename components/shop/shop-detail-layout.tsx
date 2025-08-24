"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import ProductImageGallery from "./product-image-gallery"
import BackButton from "@/components/back-button"

interface ShopDetailLayoutProps {
  slug: string
}

export default function ShopDetailLayout({ slug }: ShopDetailLayoutProps) {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Φόρτωση δεδομένων προϊόντος
  useEffect(() => {
    // Προσομοίωση φόρτωσης δεδομένων
    const timer = setTimeout(() => {
      // Δεδομένα προϊόντος με βάση το slug
      const productData = getProductBySlug(slug)
      setProduct(productData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  // Συνάρτηση για λήψη προϊόντος με βάση το slug
  const getProductBySlug = (slug: string) => {
    // Εδώ θα μπορούσατε να κάνετε API call ή να φορτώσετε από τη βάση δεδομένων
    // Για τώρα, επιστρέφουμε στατικά δεδομένα
    const products = {
      "bahama-mamas": {
        id: "1",
        name: "Bahama Mamas Nightclub",
        description: "Ένα πολυτελές nightclub με πίστα χορού, VIP περιοχές και μπαρ.",
        longDescription:
          "Το Bahama Mamas είναι ένα πολυτελές nightclub με σύγχρονο σχεδιασμό. Διαθέτει μεγάλη πίστα χορού, πολλαπλά μπαρ, VIP περιοχές και ειδικό φωτισμό. Ιδανικό για events και roleplay νυχτερινής διασκέδασης.",
        price: 1500,
        category: "mlo",
        images: ["/vibrant-nightclub.png", "/nightclub-vip-lounge.png", "/neon-nightclub.png"],
        features: [
          "Πλήρως λειτουργικά μπαρ",
          "VIP περιοχές",
          "Σύστημα φωτισμού DJ",
          "Χώρος προσωπικού",
          "Υψηλής ποιότητας εσωτερικός σχεδιασμός",
        ],
      },
      burgershot: {
        id: "2",
        name: "Burgershot Restaurant",
        description: "Ένα πλήρως λειτουργικό εστιατόριο γρήγορου φαγητού με κουζίνα και χώρο πελατών.",
        longDescription:
          "Το Burgershot είναι ένα πλήρως λειτουργικό εστιατόριο γρήγορου φαγητού με λεπτομερή σχεδιασμό. Περιλαμβάνει χώρο πελατών, ταμεία, κουζίνα, αποθήκη και γραφείο διευθυντή. Ιδανικό για roleplay επιχειρήσεων εστίασης.",
        price: 1200,
        category: "mlo",
        images: ["/bustling-burger-joint.png", "/market-stall-display.png"],
        features: [
          "Πλήρως εξοπλισμένη κουζίνα",
          "Χώρος πελατών με τραπέζια",
          "Ταμεία και μενού",
          "Αποθήκη προμηθειών",
          "Γραφείο διευθυντή",
        ],
      },
      pizzeria: {
        id: "3",
        name: "Italian Pizzeria",
        description: "Μια αυθεντική ιταλική πιτσαρία με ξυλόφουρνο και παραδοσιακό σχεδιασμό.",
        longDescription:
          "Η Italian Pizzeria είναι ένα αυθεντικό ιταλικό εστιατόριο με παραδοσιακό σχεδιασμό. Διαθέτει ξυλόφουρνο για πίτσες, άνετο χώρο πελατών, μπαρ και κουζίνα. Ο χώρος είναι διακοσμημένος με ιταλικά στοιχεία για μια αυθεντική ατμόσφαιρα.",
        price: 1100,
        category: "mlo",
        images: ["/bustling-city-market.png"],
        features: [
          "Αυθεντικός ξυλόφουρνος",
          "Παραδοσιακή διακόσμηση",
          "Χώρος πελατών με τραπέζια",
          "Πλήρως εξοπλισμένη κουζίνα",
          "Μπαρ με ποτά",
        ],
      },
      "bean-machine": {
        id: "4",
        name: "Bean Machine Coffee Shop",
        description: "Μια μοντέρνα καφετέρια με χώρο πελατών και πλήρη εξοπλισμό καφέ.",
        longDescription:
          "Το Bean Machine είναι μια σύγχρονη καφετέρια με κομψό σχεδιασμό. Διαθέτει μπαρ καφέ με πλήρη εξοπλισμό, άνετο χώρο πελατών με καναπέδες και τραπέζια, και μικρή αποθήκη. Ιδανικό για roleplay καφετέριας και κοινωνικών συναντήσεων.",
        price: 950,
        category: "mlo",
        images: ["/market-stall-display.png"],
        features: [
          "Πλήρως εξοπλισμένο μπαρ καφέ",
          "Άνετος χώρος πελατών",
          "Καναπέδες και τραπέζια",
          "Σύγχρονη διακόσμηση",
          "Αποθήκη προμηθειών",
        ],
      },
      koi: {
        id: "5",
        name: "Koi Japanese Restaurant",
        description: "Ένα πολυτελές ιαπωνικό εστιατόριο με sushi bar και παραδοσιακή διακόσμηση.",
        longDescription:
          "Το Koi είναι ένα πολυτελές ιαπωνικό εστιατόριο με κομψό σχεδιασμό. Διαθέτει sushi bar, παραδοσιακά ιαπωνικά τραπέζια, ιδιωτικά δωμάτια για VIP, και πλήρως εξοπλισμένη κουζίνα. Η διακόσμηση περιλαμβάνει παραδοσιακά ιαπωνικά στοιχεία.",
        price: 1350,
        category: "mlo",
        images: ["/bustling-city-market.png", "/market-stall-display.png"],
        features: [
          "Sushi bar",
          "Παραδοσιακά ιαπωνικά τραπέζια",
          "Ιδιωτικά VIP δωμάτια",
          "Πλήρως εξοπλισμένη κουζίνα",
          "Αυθεντική ιαπωνική διακόσμηση",
        ],
      },
      "ottos-autos": {
        id: "6",
        name: "Otto's Autos Dealership",
        description: "Μια μεγάλη αντιπροσωπεία αυτοκινήτων με εκθεσιακό χώρο και γραφεία.",
        longDescription:
          "Το Otto's Autos είναι μια μεγάλη αντιπροσωπεία αυτοκινήτων με σύγχρονο σχεδιασμό. Διαθέτει εκθεσιακό χώρο για οχήματα, γραφεία πωλήσεων, χώρο αναμονής πελατών, και συνεργείο. Ιδανικό για roleplay πώλησης και επισκευής οχημάτων.",
        price: 1600,
        category: "mlo",
        images: ["/vibrant-nightclub.png"],
        features: [
          "Μεγάλος εκθεσιακός χώρος",
          "Γραφεία πωλήσεων",
          "Χώρος αναμονής πελατών",
          "Συνεργείο επισκευής",
          "Αποθήκη ανταλλακτικών",
        ],
      },
    }

    return products[slug as keyof typeof products] || null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <BackButton />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Το προϊόν δεν βρέθηκε</h2>
          <p>Δυστυχώς, το προϊόν που αναζητάτε δεν είναι διαθέσιμο.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Αριστερή στήλη - Εικόνες */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>

        {/* Δεξιά στήλη - Πληροφορίες */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Badge variant="outline" className="mr-2">
              {product.category === "mlo" ? "MLO Μαγαζί" : product.category}
            </Badge>
            <span className="text-2xl font-bold text-green-500">{product.price}€</span>
          </div>

          <p className="text-gray-200 mb-6">{product.longDescription}</p>

          <h3 className="text-xl font-semibold mb-3">Χαρακτηριστικά:</h3>
          <ul className="list-disc list-inside mb-6 space-y-1">
            {product.features.map((feature: string, index: number) => (
              <li key={index} className="text-gray-300">
                {feature}
              </li>
            ))}
          </ul>

          <Button className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Προσθήκη στο καλάθι
          </Button>
        </div>
      </div>

      {/* Προτεινόμενα προϊόντα */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Προτεινόμενα προϊόντα</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Εδώ θα μπορούσατε να προσθέσετε προτεινόμενα προϊόντα */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              <p className="text-gray-400">Προτεινόμενο προϊόν</p>
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-1">Άλλο MLO Προϊόν</h3>
              <p className="text-sm text-gray-400">Σύντομη περιγραφή του προτεινόμενου προϊόντος.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              <p className="text-gray-400">Προτεινόμενο προϊόν</p>
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-1">Άλλο MLO Προϊόν</h3>
              <p className="text-sm text-gray-400">Σύντομη περιγραφή του προτεινόμενου προϊόντος.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              <p className="text-gray-400">Προτεινόμενο προϊόν</p>
            </div>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-1">Άλλο MLO Προϊόν</h3>
              <p className="text-sm text-gray-400">Σύντομη περιγραφή του προτεινόμενου προϊόντος.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
