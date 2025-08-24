import { NextResponse } from "next/server"
import { checkAndUpdateDiscounts } from "@/lib/db/products"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("Manual check and update discounts triggered")

    const success = await checkAndUpdateDiscounts()

    // Revalidate paths to ensure fresh data
    revalidatePath("/shop")
    revalidatePath("/admin/products")

    return NextResponse.json({
      success,
      message: success ? "Οι εκπτώσεις ενημερώθηκαν επιτυχώς" : "Υπήρξε πρόβλημα κατά την ενημέρωση των εκπτώσεων",
    })
  } catch (error) {
    console.error("Error in manual check and update discounts:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
