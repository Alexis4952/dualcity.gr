import { NextResponse } from "next/server"
import { updateProductDiscount } from "@/lib/db/products"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, discountPercentage, startDate, endDate } = body

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    console.log(`API: Adding discount to product ${productId}:`, {
      discountPercentage,
      startDate,
      endDate,
    })

    const updatedProduct = await updateProductDiscount(
      productId,
      discountPercentage ? Number(discountPercentage) : null,
      startDate,
      endDate,
    )

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Failed to update product discount" }, { status: 500 })
    }

    // Revalidate paths to ensure fresh data
    revalidatePath("/shop")
    revalidatePath("/admin/products")
    revalidatePath(`/shop/${productId}`)

    return NextResponse.json({
      success: true,
      message: discountPercentage
        ? `Discount of ${discountPercentage}% applied successfully`
        : "Discount removed successfully",
      data: updatedProduct,
    })
  } catch (error) {
    console.error("Error in add discount API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
