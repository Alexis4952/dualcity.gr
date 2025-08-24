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
          error: bucketsError instanceof Error ? bucketsError.message : "Unknown error",
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
            error: filesError instanceof Error ? filesError.message : "Unknown error",
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        bucketsInfo.push({
          name: bucket.name,
          error: errorMessage,
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
      { status: 500 },
    )
  }
}
