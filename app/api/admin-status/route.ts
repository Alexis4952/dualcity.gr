import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const adminId = cookieStore.get("adminId")?.value
  const adminUsername = cookieStore.get("adminUsername")?.value

  return NextResponse.json({
    isLoggedIn: !!adminId && !!adminUsername,
    adminId,
    adminUsername,
    cookies: Object.fromEntries(
      cookieStore
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
    timestamp: new Date().toISOString(),
  })
}
