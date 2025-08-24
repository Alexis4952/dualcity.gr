import { createSupabaseAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()

    // Έλεγχος αν υπάρχει ο πίνακας users
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "users")

    if (tablesError) {
      console.error("Error checking if users table exists:", tablesError)
      return NextResponse.json({ error: "Error checking if users table exists" }, { status: 500 })
    }

    // Αν δεν υπάρχει ο πίνακας users, τον δημιουργούμε
    if (!tables || tables.length === 0) {
      // Δημιουργία του πίνακα users
      const { error: createTableError } = await supabase.rpc("create_users_table")

      if (createTableError) {
        console.error("Error creating users table:", createTableError)
        return NextResponse.json({ error: "Error creating users table" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Users table created successfully" })
    }

    return NextResponse.json({ success: true, message: "Users table already exists" })
  } catch (error) {
    console.error("Unexpected error setting up users table:", error)
    return NextResponse.json({ error: "Unexpected error setting up users table" }, { status: 500 })
  }
}
