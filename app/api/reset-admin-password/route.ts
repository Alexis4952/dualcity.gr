import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createSupabaseAdminClient()

    // Έλεγχος αν υπάρχει ο admin χρήστης
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .eq("username", "admin")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing admin:", checkError)
      return NextResponse.json({ success: false, error: "Σφάλμα κατά τον έλεγχο για υπάρχοντα admin" }, { status: 500 })
    }

    if (!existingAdmin) {
      console.log("Admin user not found, creating new admin user")

      // Δημιουργία του admin χρήστη
      const { error: createError } = await supabase.from("admins").insert([
        {
          username: "admin",
          password: "admin",
          role: "admin",
        },
      ])

      if (createError) {
        console.error("Error creating admin user:", createError)
        return NextResponse.json(
          { success: false, error: "Σφάλμα κατά τη δημιουργία του admin χρήστη" },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Ο admin χρήστης δημιουργήθηκε με επιτυχία με κωδικό: admin",
      })
    }

    // Ενημέρωση του κωδικού πρόσβασης του admin
    const { error: updateError } = await supabase.from("admins").update({ password: "admin" }).eq("username", "admin")

    if (updateError) {
      console.error("Error updating admin password:", updateError)
      return NextResponse.json(
        { success: false, error: "Σφάλμα κατά την ενημέρωση του κωδικού πρόσβασης" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ο κωδικός πρόσβασης του admin επαναφέρθηκε σε: admin",
    })
  } catch (error) {
    console.error("Unexpected error during admin password reset:", error)
    return NextResponse.json(
      { success: false, error: "Απρόσμενο σφάλμα κατά την επαναφορά του κωδικού πρόσβασης" },
      { status: 500 },
    )
  }
}
