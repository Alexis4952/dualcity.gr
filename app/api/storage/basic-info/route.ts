import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    console.log("Getting basic storage info...")

    // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase environment variables",
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey,
          },
        },
        { status: 500 },
      )
    }

    // Δημιουργία του Supabase client απευθείας με τις μεταβλητές περιβάλλοντος
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Λήψη λίστας buckets
    console.log("Listing buckets...")
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json(
        {
          success: false,
          error: bucketsError.message,
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey,
          },
        },
        { status: 500 },
      )
    }

    // Συλλογή πληροφοριών για κάθε bucket
    const bucketsInfo = []

    for (const bucket of buckets || []) {
      try {
        console.log(`Listing files in bucket ${bucket.name}...`)
        const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list()

        if (filesError) {
          console.error(`Error listing files in bucket ${bucket.name}:`, filesError)
          bucketsInfo.push({
            name: bucket.name,
            error: filesError.message,
            files: [],
          })
        } else {
          bucketsInfo.push({
            name: bucket.name,
            files: files || [],
          })
        }
      } catch (error) {
        console.error(`Error processing bucket ${bucket.name}:`, error)
        bucketsInfo.push({
          name: bucket.name,
          error: error.message || "Unknown error",
          files: [],
        })
      }
    }

    console.log("Storage info retrieved successfully")
    return NextResponse.json({
      success: true,
      buckets: buckets || [],
      bucketsInfo,
      env: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      },
    })
  } catch (error) {
    console.error("Unexpected error getting storage info:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
      { status: 500 },
    )
  }
}
