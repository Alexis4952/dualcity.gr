import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching products from API...")
    const supabase = createSupabaseServerClient()

    // Πρώτα ελέγχουμε και ενημερώνουμε τις εκπτώσεις
    try {
      // Καλούμε απευθείας το RPC function για τον έλεγχο των εκπτώσεων
      const { data, error } = await supabase.rpc("check_and_update_discounts")
      if (error) {
        console.error("Error checking discounts via RPC:", error)
      } else {
        console.log("Successfully checked discounts via RPC:", data)
      }
    } catch (checkError) {
      console.error("Error in discount check:", checkError)
    }

    // Παίρνουμε όλα τα προϊόντα
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (productsError) {
      console.error("Error fetching products:", productsError)
      return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
    }

    // Για κάθε προϊόν, παίρνουμε τις εικόνες του
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const { data: images, error: imagesError } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", product.id)
          .order("is_main", { ascending: false })

        if (imagesError) {
          console.error(`Error fetching images for product ${product.id}:`, imagesError)
          return { ...product, images: [] }
        }

        return { ...product, images: images || [] }
      }),
    )

    // Καταγραφή για αποσφαλμάτωση
    const discountedProducts = productsWithImages.filter((p) => p.on_sale)
    const soldProducts = productsWithImages.filter((p) => p.sold)

    console.log(`API: Found ${discountedProducts.length} products with discounts`)
    console.log(`API: Found ${soldProducts.length} sold products`)

    console.log(`Fetched ${productsWithImages.length} products with images`)

    // Προσθέτουμε headers για αποφυγή caching
    const headers = new Headers({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    return NextResponse.json(
      { success: true, products: productsWithImages },
      {
        status: 200,
        headers: headers,
      },
    )
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
