import { getProductById, getProductImages } from "@/lib/db/products"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { V66Background } from "@/components/v66-background"
import Navbar from "@/components/navbar"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  const images = await getProductImages(id)

  if (!product) {
    notFound()
  }

  // Καταγραφή για αποσφαλμάτωση
  console.log("Product data:", {
    id: product.id,
    title: product.title,
    price: product.price,
    on_sale: product.on_sale,
    discount_percentage: product.discount_percentage,
    discount_price: product.discount_price,
    discount_start_date: product.discount_start_date,
    discount_end_date: product.discount_end_date,
    sold: product.sold,
  })

  // Ενημέρωση της συνάρτησης formatPrice για να χειρίζεται την ειδική τιμή -1
  // Αντικαταστήστε την υπάρχουσα συνάρτηση formatPrice με αυτή:
  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Ρωτήστε τιμή"
    }
    return price.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Κατηγορίες προϊόντων
  const categories: Record<string, string> = {
    vehicles: "Οχήματα",
    weapons: "Όπλα",
    properties: "Ιδιοκτησίες",
    clothing: "Ρούχα",
    other: "Άλλα",
  }

  // Εύρεση κύριας εικόνας
  const mainImage = images.find((img) => img.is_main) || images[0]

  return (
    <div className="relative min-h-screen">
      <V66Background />
      <Navbar />
      <div className="container mx-auto p-4 pt-24 relative z-10">
        <div className="mb-6">
          <Link href="/shop">
            <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Πίσω στο Κατάστημα
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Εικόνες προϊόντος */}
          <div className="space-y-4 relative">
            <div className="aspect-video overflow-hidden rounded-lg border border-gray-800 bg-black/50 backdrop-blur-sm">
              {mainImage ? (
                <img
                  src={mainImage.url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <span className="text-gray-500">Δεν υπάρχει διαθέσιμη εικόνα</span>
                </div>
              )}
            </div>

            {/* Ένδειξη ΠΩΛΗΘΗΚΕ - Βελτιωμένη εμφάνιση */}
            {product.sold && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="border-4 border-red-600 rounded-lg px-8 py-4 transform rotate-[-20deg] bg-black/80">
                  <span className="text-red-600 font-bold text-4xl">ΠΩΛΗΘΗΚΕ</span>
                </div>
              </div>
            )}

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      image.is_main ? "border-primary" : "border-gray-800"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Πληροφορίες προϊόντος */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-white">
            {/* Ένδειξη ΠΩΛΗΘΗΚΕ στην κορυφή των πληροφοριών */}
            {product.sold && (
              <div className="mb-4 bg-red-900/30 border border-red-600 rounded-lg p-3 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-400 font-semibold">
                  Αυτό το προϊόν έχει πωληθεί και δεν είναι πλέον διαθέσιμο.
                </span>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              {product.category && (
                <Badge variant="outline" className="text-white border-gray-600">
                  {categories[product.category] || product.category}
                </Badge>
              )}
            </div>

            {/* Εμφάνιση badge έκπτωσης */}
            {product.on_sale && product.discount_percentage && (
              <div className="mb-4">
                <Badge variant="destructive" className="text-white bg-red-600 hover:bg-red-700 text-sm py-1 px-2">
                  Έκπτωση {product.discount_percentage}%
                </Badge>

                {/* Εμφάνιση ημερομηνιών προσφοράς */}
                {product.discount_start_date && product.discount_end_date && (
                  <div className="mt-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Προσφορά: {new Date(product.discount_start_date).toLocaleDateString()} -{" "}
                    {new Date(product.discount_end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}

            {/* Ενημέρωση του τμήματος εμφάνισης τιμής */}
            {/* Αντικαταστήστε το μπλοκ κώδικα που εμφανίζει την τιμή με αυτό: */}
            <div className="mb-6">
              {/* Εμφάνιση τιμής με έκπτωση */}
              {product.price === -1 ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">Ρωτήστε τιμή</span>
                </div>
              ) : product.on_sale && product.discount_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.discount_price)}€</span>
                  <span className="text-xl line-through text-gray-400">{formatPrice(product.price)}€</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}€</span>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Περιγραφή</h2>
              <p className="text-gray-300">{product.description}</p>
            </div>

            {product.long_description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Αναλυτική Περιγραφή</h2>
                <div className="text-gray-300 space-y-2">
                  {product.long_description.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Χαρακτηριστικά</h2>
                <ul className="list-disc list-inside text-gray-300">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Βελτιωμένο κουμπί για πωλημένα προϊόντα */}
            <Button
              className={`w-full mt-4 ${
                product.sold
                  ? "bg-red-900/50 hover:bg-red-900/50 border border-red-600 text-red-400 cursor-not-allowed"
                  : ""
              }`}
              size="lg"
              disabled={product.sold}
            >
              {product.sold ? (
                <span className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Μη Διαθέσιμο - Έχει Πωληθεί
                </span>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Προσθήκη στο Καλάθι
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
