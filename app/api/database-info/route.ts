import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          status: "error",
          error: "Missing Supabase credentials",
        },
        { status: 500 },
      )
    }

    // Δημιουργία του Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Συλλογή πληροφοριών για τους πίνακες
    const tables = [
      { name: "products", description: "Προϊόντα" },
      { name: "product_images", description: "Εικόνες προϊόντων" },
      { name: "admins", description: "Διαχειριστές" },
      { name: "admin_logs", description: "Καταγραφές ενεργειών διαχειριστών" },
    ]

    // Συλλογή στατιστικών για κάθε πίνακα
    const tableStats = await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await supabase.from(table.name).select("*", { count: "exact", head: true })

          return {
            name: table.name,
            description: table.description,
            count: error ? null : count,
            error: error ? error.message : null,
          }
        } catch (e) {
          return {
            name: table.name,
            description: table.description,
            count: null,
            error: e.message,
          }
        }
      }),
    )

    // Ανάκτηση της τρέχουσας ημερομηνίας/ώρας από τη βάση δεδομένων
    const { data: timestamp, error: timestampError } = await supabase.rpc("get_current_timestamp")

    return NextResponse.json({
      status: "ok",
      timestamp: timestamp || null,
      timestampError: timestampError ? timestampError.message : null,
      tables: tableStats,
      databaseUrl: supabaseUrl.replace(/^(https?:\/\/[^:]+)(.*)$/, "$1"),
    })
  } catch (error) {
    console.error("Error getting database info:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
