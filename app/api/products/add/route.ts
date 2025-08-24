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

    console.log("Received product data:", data)

    // Έλεγχος αν υπάρχουν τα απαραίτητα πεδία
    if (!data.title || !data.description || !data.price) {
      return NextResponse.json(
        { success: false, message: "Λείπουν απαραίτητα πεδία (τίτλος, περιγραφή ή τιμή)" },
        { status: 400 },
      )
    }

    // Προσθήκη του προϊόντος στη βάση δεδομένων
    const { data: productData, error: productError } = await supabaseAdmin
      .from("products")
      .insert([
        {
          title: data.title,
          description: data.description,
          price: Number.parseFloat(data.price),
          category: data.category || "other",
          on_sale: false,
          sold: false,
        },
      ])
      .select()

    if (productError) {
      console.error("Error adding product:", productError)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά την προσθήκη του προϊόντος", error: productError instanceof Error ? productError.message : "Unknown error" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Το προϊόν προστέθηκε επιτυχώς",
      product: productData?.[0] || null,
    })
  } catch (error) {
    console.error("Error in add-product API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά την προσθήκη του προϊόντος",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
