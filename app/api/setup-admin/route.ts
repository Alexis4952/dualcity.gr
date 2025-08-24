import { NextResponse } from "next/server"

export async function GET() {
  // Απλά επιστρέφουμε μια επιτυχή απάντηση χωρίς να κάνουμε κανένα αίτημα στη βάση δεδομένων
  return NextResponse.json(
    {
      success: true,
      message: "Admin setup is handled manually. Please contact your system administrator.",
      adminExists: true,
    },
    { status: 200 },
  )
}
