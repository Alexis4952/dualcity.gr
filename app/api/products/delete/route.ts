import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    // Χρησιμοποιούμε το service role key για να παρακάμψουμε τις πολιτικές RLS
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ success: false, message: "Δεν παρέχθηκε ID προϊόντος" }, { status: 400 })
    }

    console.log(`Διαγραφή προϊόντος με ID: ${productId}`)

    // Πρώτα διαγράφουμε όλες τις εικόνες του προϊόντος από τη βάση δεδομένων
    const { error: imagesError } = await supabaseAdmin.from("product_images").delete().eq("product_id", productId)

    if (imagesError) {
      console.error(`Σφάλμα κατά τη διαγραφή εικόνων για το προϊόν ${productId}:`, imagesError)
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά τη διαγραφή εικόνων",
          error: imagesError,
        },
        { status: 500 },
      )
    }

    // Μετά διαγράφουμε το προϊόν
    const { error: productError } = await supabaseAdmin.from("products").delete().eq("id", productId)

    if (productError) {
      console.error(`Σφάλμα κατά τη διαγραφή του προϊόντος ${productId}:`, productError)
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά τη διαγραφή του προϊόντος",
          error: productError,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Το προϊόν διαγράφηκε επιτυχώς",
    })
  } catch (error) {
    console.error("Σφάλμα στο API διαγραφής προϊόντος:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Εσωτερικό σφάλμα διακομιστή",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
