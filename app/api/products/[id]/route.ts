import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    console.log("Fetching product with ID:", id)

    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product found:", product)

    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("position", { ascending: true })

    if (imagesError) {
      console.error("Error fetching product images:", imagesError)
    }

    console.log("Images found:", images?.length || 0)

    return NextResponse.json({ product, images: images || [] })
  } catch (error) {
    console.error("Error in product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = createClient()
    const data = await request.json()

    console.log("Updating product with ID:", id, "Data:", data)

    if (!data.updated_at) {
      data.updated_at = new Date().toISOString()
    }

    const { data: updatedProduct, error } = await supabase.from("products").update(data).eq("id", id).select()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product", details: error }, { status: 500 })
    }

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
