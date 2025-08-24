import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminId = cookieStore.get("adminId")?.value
    const adminUsername = cookieStore.get("adminUsername")?.value

    if (!adminId || !adminUsername) {
      return NextResponse.json({ isLoggedIn: false, admin: null })
    }

    // Έλεγχος αν το cookie είναι έγκυρο
    const cookieStore2 = await cookies()
  } catch (error) {
    console.error("Error fetching admin status:", error)
    return NextResponse.json({ isLoggedIn: false, admin: null })
  }
}
