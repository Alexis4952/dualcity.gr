import { NextResponse } from "next/server"
import { markProductAsSold } from "@/lib/db/products"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    // Πρώτα βεβαιωνόμαστε ότι υπάρχει η στήλη "sold"
    try {
      console.log("Checking if 'sold' column exists...")
      const setupResponse = await fetch(new URL("/api/setup-sold-column", request.url).toString())
      const setupData = await setupResponse.json()

      if (!setupResponse.ok) {
        console.warn("Warning: Could not verify 'sold' column:", setupData)
      } else {
        console.log("Sold column setup result:", setupData)
      }
    } catch (setupError) {
      console.warn("Error checking sold column:", setupError)
    }

    const body = await request.json()
    const { productId, sold } = body

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    console.log(`API: Marking product ${productId} as ${sold ? "sold" : "available"}`)

    // Απευθείας ενημέρωση του προϊόντος με SQL αν η συνάρτηση markProductAsSold αποτύχει
    try {
      const updatedProduct = await markProductAsSold(productId, sold)

      if (!updatedProduct) {
        throw new Error(`Failed to update product ${productId} sold status to ${sold}`)
      }

      // Revalidate paths to ensure fresh data
      revalidatePath("/shop")
      revalidatePath("/admin/products")
      revalidatePath(`/shop/${productId}`)

      return NextResponse.json({
        success: true,
        message: `Product marked as ${sold ? "sold" : "available"} successfully`,
        data: updatedProduct,
      })
    } catch (markError) {
      console.error("Error in markProductAsSold:", markError)

      // Fallback: Απευθείας ενημέρωση με SQL
      console.log("Attempting direct SQL update...")
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing Supabase environment variables",
          },
          { status: 500 },
        )
      }

      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase
        .from("products")
        .update({
          sold: sold,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .select()

      if (error) {
        console.error("Error in direct SQL update:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update product sold status",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 },
        )
      }

      // Revalidate paths to ensure fresh data
      revalidatePath("/shop")
      revalidatePath("/admin/products")
      revalidatePath(`/shop/${productId}`)

      return NextResponse.json({
        success: true,
        message: `Product marked as ${sold ? "sold" : "available"} successfully (direct SQL)`,
        data: data?.[0] || { id: productId, sold },
      })
    }
  } catch (error) {
    console.error("Error in mark product as sold API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "An unexpected error occurred while updating product sold status",
      },
      { status: 500 },
    )
  }
}
