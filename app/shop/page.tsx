import { ShopPageClient } from "./ShopPageClient"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Αποτρέπουμε το caching της σελίδας
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ShopPage() {
  try {
    // Δημιουργία του Supabase client
    const supabase = createSupabaseServerClient()

    // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις
    try {
      // Καλούμε απευθείας το API για τον έλεγχο των εκπτώσεων
      const { data, error } = await supabase.rpc("check_and_update_discounts")
      if (error) {
        console.error("Error checking discounts via RPC:", error)
      } else {
        console.log("Successfully checked discounts via RPC:", data)
      }
    } catch (checkError) {
      console.error("Error in discount check:", checkError)
    }

    // Φόρτωση προϊόντων
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading products:", error)
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Σφάλμα</h1>
            <p className="text-gray-400">Υπήρξε ένα πρόβλημα κατά τη φόρτωση του καταστήματος.</p>
            <p className="text-gray-500 mt-2">{error.message}</p>
          </div>
        </div>
      )
    }

    // Φόρτωση εικόνων για κάθε προϊόν
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const { data: images, error: imagesError } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", product.id)
          .order("is_main", { ascending: false })

        if (imagesError) {
          console.error(`Error loading images for product ${product.id}:`, imagesError)
          return { ...product, images: [] }
        }

        return { ...product, images: images || [] }
      }),
    )

    // Καταγραφή για αποσφαλμάτωση
    console.log(`Loaded ${productsWithImages.length} products with images`)

    // Καταγραφή των προϊόντων με έκπτωση και των πωλημένων προϊόντων
    const discountedProducts = productsWithImages.filter((p) => p.on_sale)
    const soldProducts = productsWithImages.filter((p) => p.sold)

    console.log(`Found ${discountedProducts.length} products with discounts`)
    console.log(`Found ${soldProducts.length} sold products`)

    return <ShopPageClient products={productsWithImages} />
  } catch (error) {
    console.error("Unexpected error in ShopPage:", error)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Απρόσμενο Σφάλμα</h1>
          <p className="text-gray-400">Υπήρξε ένα απρόσμενο πρόβλημα κατά τη φόρτωση του καταστήματος.</p>
          <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    )
  }
}
