import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("Fetching featured products...")
    const supabase = createSupabaseServerClient()

    // Παίρνουμε τα πρώτα 3 προϊόντα από τη βάση δεδομένων
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        description,
        price,
        category
      `)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching products:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    // Για κάθε προϊόν, παίρνουμε την κύρια εικόνα του
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const { data: images, error: imagesError } = await supabase
          .from("product_images")
          .select("url, is_main")
          .eq("product_id", product.id)
          .order("is_main", { ascending: false })
          .limit(1)

        if (imagesError) {
          console.error(`Error fetching images for product ${product.id}:`, imagesError)
          return {
            ...product,
            image_url: "/bustling-city-market.png",
          }
        }

        return {
          ...product,
          image_url: images && images.length > 0 ? images[0].url : "/bustling-city-market.png",
        }
      }),
    )

    // Προσθέτουμε cache headers για καλύτερη απόδοση
    const headers = new Headers()
    headers.append("Cache-Control", "public, max-age=300, s-maxage=600")

    return NextResponse.json({ products: productsWithImages }, { headers })
  } catch (error) {
    console.error("Error in featured products API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
