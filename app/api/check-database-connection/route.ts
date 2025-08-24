import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    console.log("Checking database connection...")

    // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Καταγραφή των διαθέσιμων μεταβλητών περιβάλλοντος (χωρίς τις τιμές για λόγους ασφαλείας)
    console.log("Environment variables available:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseAnonKey,
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase credentials:", { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey })
      return NextResponse.json(
        {
          status: "error",
          error: "Missing Supabase credentials",
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey,
          },
        },
        { status: 500 },
      )
    }

    // Δημιουργία του Supabase client απευθείας με τις μεταβλητές περιβάλλοντος
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Έλεγχος σύνδεσης με τη βάση δεδομένων χρησιμοποιώντας τη νέα συνάρτηση
    console.log("Checking database connection with get_current_timestamp function...")

    try {
      // Χρήση της συνάρτησης get_current_timestamp που μόλις δημιουργήσαμε
      const { data: timestampData, error: timestampError } = await supabase.rpc("get_current_timestamp")

      if (timestampError) {
        console.error("Error calling get_current_timestamp:", timestampError)
        throw timestampError
      }

      console.log("Database connection successful using get_current_timestamp")
      return NextResponse.json({
        status: "ok",
        message: "Database connection successful",
        timestamp: timestampData,
        method: "get_current_timestamp",
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
        },
      })
    } catch (rpcError) {
      console.error("RPC error:", rpcError)

      // Εναλλακτικά, δοκιμάζουμε να ελέγξουμε τον πίνακα products που γνωρίζουμε ότι υπάρχει
      console.log("Trying to check products table...")
      try {
        const { data: productsData, error: productsError } = await supabase.from("products").select("count").limit(1)

        if (productsError) {
          console.error("Error checking products table:", productsError)
          throw productsError
        }

        console.log("Database connection successful using products table")
        return NextResponse.json({
          status: "ok",
          message: "Database connection successful",
          data: productsData,
          method: "products_table",
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey,
          },
        })
      } catch (productsError) {
        console.error("Products table error:", productsError)

        // Τελευταία προσπάθεια - έλεγχος του πίνακα admins
        console.log("Trying to check admins table...")
        try {
          const { data: adminsData, error: adminsError } = await supabase.from("admins").select("count").limit(1)

          if (adminsError) {
            console.error("Error checking admins table:", adminsError)
            throw adminsError
          }

          console.log("Database connection successful using admins table")
          return NextResponse.json({
            status: "ok",
            message: "Database connection successful",
            data: adminsData,
            method: "admins_table",
            env: {
              hasUrl: !!supabaseUrl,
              hasKey: !!supabaseAnonKey,
            },
          })
        } catch (adminsError) {
          console.error("All connection attempts failed")
          return NextResponse.json(
            {
              status: "error",
              error: "Could not connect to database after multiple attempts",
              details: {
                rpcError,
                productsError,
                adminsError,
              },
              env: {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseAnonKey,
              },
            },
            { status: 500 },
          )
        }
      }
    }
  } catch (error) {
    console.error("Unexpected error checking database connection:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
      { status: 500 },
    )
  }
}
