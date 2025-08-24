import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    // Καταγραφή των διαθέσιμων μεταβλητών περιβάλλοντος (χωρίς τις τιμές για λόγους ασφαλείας)
    const envKeys = Object.keys(process.env).filter((key) => key.includes("SUPABASE"))

    return NextResponse.json({
      status: "ok",
      env: {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseKey,
        availableEnvKeys: envKeys,
      },
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
