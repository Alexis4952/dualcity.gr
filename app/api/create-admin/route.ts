import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Δημιουργία του Supabase client
    const supabase = createSupabaseAdminClient()

    // Έλεγχος αν υπάρχει ήδη ο αρχικός admin
    const { data: existingAdmins, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .eq("username", "admin")
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing admin:", checkError)
      return NextResponse.json({ success: false, error: `Database error: ${checkError.message}` }, { status: 500 })
    }

    // Αν υπάρχει ήδη ο αρχικός admin, επιστρέφουμε επιτυχία
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Admin already exists",
          adminExists: true,
        },
        { status: 200 },
      )
    }

    // Δημιουργία του αρχικού admin
    const { data: newAdmin, error: createError } = await supabase
      .from("admins")
      .insert([
        {
          username: "admin",
          password: "admin",
          role: "admin",
        },
      ])
      .select()

    if (createError) {
      console.error("Error creating admin:", createError)
      return NextResponse.json(
        { success: false, error: `Failed to create admin: ${createError.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, message: "Admin created successfully", adminExists: false },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in create-admin API:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Internal server error: ${error.message || "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
