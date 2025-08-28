import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const adminId = cookies().get("adminId")?.value
  const adminUsername = cookies().get("adminUsername")?.value

  return NextResponse.json({
    isLoggedIn: !!adminId && !!adminUsername,
    adminId,
    adminUsername,
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
    timestamp: new Date().toISOString(),
  })
}
