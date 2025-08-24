import { NextResponse } from "next/server"
import { setupSupabase } from "@/lib/supabase/setup"

// Αυτό το endpoint θα εκτελείται κατά την εκκίνηση της εφαρμογής
export async function GET() {
  try {
    await setupSupabase()
    return NextResponse.json({ success: true, message: "Supabase setup completed" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { success: false, message: "Supabase setup failed", error: String(error) },
      { status: 500 },
    )
  }
}
