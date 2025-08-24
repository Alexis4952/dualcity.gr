import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    // Παίρνουμε όλους τους admin
    const { data: admins, error } = await supabase.from("admins").select("id, username, role, created_at, last_login")

    if (error) {
      console.error("Error fetching admins:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
    }

    // Επιστρέφουμε τους admin (μόνο για debugging)
    return NextResponse.json({ success: true, admins }, { status: 200 })
  } catch (error) {
    console.error("Error in check-admins API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
