import { NextResponse } from "next/server"
import { checkAndUpdateDiscounts } from "@/lib/db/products"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("Checking discounts...")

    // Χρησιμοποιούμε τη συνάρτηση από το lib/db/products.ts
    const result = await checkAndUpdateDiscounts()

    if (result && result.success) {
      console.log("Discounts checked and updated successfully:", result)
      return NextResponse.json({
        success: true,
        message: "Discounts checked and updated successfully",
        data: result,
      })
    } else {
      console.error("Failed to check and update discounts")
      return NextResponse.json({ success: false, error: "Failed to check and update discounts" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error checking discounts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
