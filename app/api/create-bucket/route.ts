import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Έλεγχος αν υπάρχει ήδη ο bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά τον έλεγχο των buckets",
          error: listError instanceof Error ? listError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "images")

    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: "Ο bucket 'images' υπάρχει ήδη",
      })
    }

    // Δημιουργία του bucket
    const { error: createError } = await supabase.storage.createBucket("images", {
      public: true,
    })

    if (createError) {
      return NextResponse.json(
        {
          success: false,
          message: "Σφάλμα κατά τη δημιουργία του bucket",
          error: createError instanceof Error ? createError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ο bucket 'images' δημιουργήθηκε επιτυχώς",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά τη δημιουργία του bucket",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
