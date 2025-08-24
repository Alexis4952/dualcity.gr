import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    // Χρησιμοποιούμε το service role key για να έχουμε πλήρη δικαιώματα
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Παίρνουμε το productId από τα query params
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Λείπει το ID του προϊόντος",
        },
        { status: 400 },
      )
    }

    // Παίρνουμε πρώτα τις εικόνες του προϊόντος
    const { data: imageData, error: imageError } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("product_id", productId)

    if (imageError) {
      console.error("Error fetching product images:", imageError)
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά την ανάκτηση των εικόνων του προϊόντος",
          error: imageError instanceof Error ? imageError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Διαγραφή των αρχείων από το storage
    if (imageData && imageData.length > 0) {
      try {
        // Διαγραφή του φακέλου του προϊόντος
        const { data: storageData, error: storageError } = await supabaseAdmin.storage
          .from("images")
          .remove([`products/${productId}`])

        if (storageError) {
          console.error("Error deleting product folder from storage:", storageError)
        }
      } catch (storageError) {
        console.error("Error in storage deletion:", storageError)
        // Συνεχίζουμε με τη διαγραφή από τη βάση δεδομένων
      }
    }

    // Διαγραφή των εγγραφών από τον πίνακα product_images
    const { error: deleteError } = await supabaseAdmin.from("product_images").delete().eq("product_id", productId)

    if (deleteError) {
      console.error("Error deleting product images from database:", deleteError)
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά τη διαγραφή των εικόνων από τη βάση δεδομένων",
          error: deleteError instanceof Error ? deleteError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Οι εικόνες του προϊόντος διαγράφηκαν επιτυχώς",
    })
  } catch (error) {
    console.error("Error in delete-product-images API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά τη διαγραφή των εικόνων του προϊόντος",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
