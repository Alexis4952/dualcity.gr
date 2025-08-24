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
          error: "Missing Supabase environment variables",
          count: 0,
        },
        { status: 500 },
      )
    }

    // Δημιουργία του Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Καταμέτρηση των προϊόντων
    const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error counting products:", error)
      return NextResponse.json(
        {
          status: "error",
          error: error.message,
          count: 0,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "ok",
      count: count || 0,
    })
  } catch (error) {
    console.error("Unexpected error counting products:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Unknown error",
        count: 0,
      },
      { status: 500 },
    )
  }
}
