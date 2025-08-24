import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("Storage delete API called")

    // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
    const cookieStore = await cookies()
    const adminId = cookieStore.get("adminId")?.value
    const adminUsername = cookieStore.get("adminUsername")?.value

    if (!adminId || !adminUsername) {
      console.error("Storage delete API: User not authenticated as admin")
      return NextResponse.json({ success: false, error: "Δεν είστε συνδεδεμένος ως διαχειριστής" }, { status: 401 })
    }

    console.log(`Storage delete API: Admin authenticated - ${adminUsername} (${adminId})`)

    // Λήψη παραμέτρων από το request
    const body = await request.json()
    const { bucket } = body

    if (!bucket) {
      return NextResponse.json({ success: false, error: "Δεν καθορίστηκε το bucket" }, { status: 400 })
    }

    console.log(`Attempting to delete files from bucket: ${bucket}`)

    const supabase = createSupabaseServerClient()

    // Λήψη λίστας αρχείων στο bucket
    const { data: files, error: filesError } = await supabase.storage.from(bucket).list()

    if (filesError) {
      console.error(`Error listing files in bucket ${bucket}:`, filesError)
      return NextResponse.json(
        { success: false, error: `Σφάλμα κατά τη λήψη λίστας αρχείων: ${filesError instanceof Error ? filesError.message : "Unknown error"}` },
        { status: 500 },
      )
    }

    console.log(`Found ${files.length} files to delete in bucket ${bucket}`)

    // Διαγραφή όλων των αρχείων
    let deletedCount = 0
    const errors = []

    for (const file of files) {
      try {
        if (file.name) {
          // Βεβαιωνόμαστε ότι υπάρχει όνομα αρχείου
          const { error: deleteError } = await supabase.storage.from(bucket).remove([file.name])

          if (deleteError) {
            console.error(`Error deleting file ${file.name}:`, deleteError)
            errors.push({ file: file.name, error: deleteError instanceof Error ? deleteError.message : "Unknown error" })
          } else {
            deletedCount++
          }
        }
      } catch (error) {
        console.error(`Error processing file deletion for ${file.name}:`, error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        errors.push({ file: file.name, error: errorMessage })
      }
    }

    // Καταγραφή της ενέργειας στα admin logs
    try {
      const { error: logError } = await supabase.from("admin_logs").insert([
        {
          admin_id: adminId,
          action: "delete_storage_files",
          details: {
            bucket,
            deletedCount,
            totalFiles: files.length,
            errors: errors.length > 0 ? errors : undefined,
          },
        },
      ])

      if (logError) {
        console.error("Error logging admin action:", logError)
      }
    } catch (logError) {
      console.error("Error logging admin action:", logError)
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      totalFiles: files.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Unexpected error in storage delete API:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ success: false, error: `Απρόσμενο σφάλμα: ${errorMessage}` }, { status: 500 })
  }
}
