import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Δημιουργία του Supabase client με το service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Λήψη των δεδομένων από το request
    const data = await request.json()

    console.log("Received product update data:", data)

    // Έλεγχος αν υπάρχουν τα απαραίτητα πεδία
    if (!data.id || !data.title || !data.description || !data.price) {
      return NextResponse.json(
        { success: false, message: "Λείπουν απαραίτητα πεδία (id, τίτλος, περιγραφή ή τιμή)" },
        { status: 400 },
      )
    }

    // Ενημέρωση του προϊόντος στη βάση δεδομένων
    const { data: productData, error: productError } = await supabaseAdmin
      .from("products")
      .update({
        title: data.title,
        description: data.description,
        price: Number.parseFloat(data.price),
        category: data.category || "other",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()

    if (productError) {
      console.error("Error updating product:", productError)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά την ενημέρωση του προϊόντος", error: productError instanceof Error ? productError.message : "Unknown error" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Το προϊόν ενημερώθηκε επιτυχώς",
      product: productData?.[0] || null,
    })
  } catch (error) {
    console.error("Error in update-product API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά την ενημέρωση του προϊόντος",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
