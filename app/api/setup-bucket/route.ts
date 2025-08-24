import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Έλεγχος αν υπάρχουν οι απαραίτητες μεταβλητές περιβάλλοντος
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase URL configuration. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.",
        },
        { status: 500 },
      )
    }

    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing Supabase service key configuration. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.",
        },
        { status: 500 },
      )
    }

    // Δημιουργία του Supabase client με το service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Έλεγχος αν υπάρχει το bucket "images"
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά τον έλεγχο των buckets", error: bucketsError instanceof Error ? bucketsError.message : "Unknown error" },
        { status: 500 },
      )
    }

    const imagesBucket = buckets?.find((bucket) => bucket.name === "images")

    if (imagesBucket) {
      // Το bucket υπάρχει ήδη
      return NextResponse.json({ success: true, message: "Το bucket 'images' υπάρχει ήδη", exists: true })
    }

    // Δημιουργία του bucket "images"
    const { error } = await supabaseAdmin.storage.createBucket("images", {
      public: true,
    })

    if (error) {
      console.error("Error creating bucket:", error)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά τη δημιουργία του bucket", error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Το bucket 'images' δημιουργήθηκε επιτυχώς" })
  } catch (error) {
    console.error("Error in setup-bucket API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά τη ρύθμιση του bucket",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
