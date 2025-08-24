import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Δημιουργία Supabase client με service role key για πλήρη δικαιώματα
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Έλεγχος αν υπάρχει η στήλη "sold" στον πίνακα "products" με απευθείας SQL
    const { data: columnsData, error: columnsError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "products")
      .eq("column_name", "sold")

    if (columnsError) {
      console.error("Error checking if column exists:", columnsError)
      return NextResponse.json(
        {
          success: false,
          message: "Δεν ήταν δυνατός ο έλεγχος της στήλης 'sold'",
          error: columnsError,
        },
        { status: 500 },
      )
    }

    // Αν η στήλη υπάρχει ήδη
    if (columnsData && columnsData.length > 0) {
      console.log("Column 'sold' already exists in table 'products'")
      return NextResponse.json({
        success: true,
        message: "Η στήλη 'sold' υπάρχει ήδη στον πίνακα 'products'",
        columnExists: true,
      })
    }

    console.log("Column 'sold' does not exist in table 'products', adding it...")

    // Προσθήκη της στήλης "sold" στον πίνακα "products" με απευθείας SQL
    const { error: alterError } = await supabaseAdmin.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE;
    `)

    if (alterError) {
      console.error("Error adding 'sold' column:", alterError)
      return NextResponse.json(
        {
          success: false,
          message: "Δεν ήταν δυνατή η προσθήκη της στήλης 'sold'",
          error: alterError,
        },
        { status: 500 },
      )
    }

    console.log("Column 'sold' added successfully to table 'products'")
    return NextResponse.json({
      success: true,
      message: "Η στήλη 'sold' προστέθηκε επιτυχώς στον πίνακα 'products'",
      columnAdded: true,
    })
  } catch (error) {
    console.error("Error in setup-sold-column API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά τη ρύθμιση της στήλης 'sold'",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
