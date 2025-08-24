import { NextResponse } from "next/server"
import { checkAndUpdateDiscounts } from "@/lib/db/products"

export async function GET() {
  try {
    const success = await checkAndUpdateDiscounts()

    if (success) {
      return NextResponse.json({ success: true, message: "Discounts updated successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to update discounts" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in update-discounts API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
