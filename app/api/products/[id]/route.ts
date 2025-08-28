import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic" // Εξασφαλίζει ότι το endpoint δεν κάνει cache
export const revalidate = 0 // Απενεργοποιεί το caching

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Για λόγους debugging
    console.log("Fetching product with ID:", id)

    // Ανάκτηση προϊόντος από τη βάση δεδομένων
    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Για λόγους debugging
    console.log("Product found:", product)

    // Ανάκτηση εικόνων του προϊόντος
    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true })

    if (imagesError) {
      console.error("Error fetching product images:", imagesError)
    }

    // Για λόγους debugging
    console.log("Images found:", images?.length || 0)

    return NextResponse.json({ product, images: images || [] })
  } catch (error) {
    console.error("Error in product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Προσθήκη μεθόδου PUT για ενημέρωση προϊόντος
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = createClient()
    const data = await request.json()

    console.log("Updating product with ID:", id, "Data:", data)

    // Προσθήκη του updated_at αν δεν υπάρχει
    if (!data.updated_at) {
      data.updated_at = new Date().toISOString()
    }

    const { data: updatedProduct, error } = await supabase.from("products").update(data).eq("id", id).select()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product", details: error }, { status: 500 })
    }

    // Revalidate paths to ensure fresh data
    revalidatePath("/shop")
    revalidatePath("/admin/products")
    revalidatePath(`/shop/${id}`)

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct[0],
    })
  } catch (error) {
    console.error("Error in product update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
