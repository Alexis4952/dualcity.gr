import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("Storage info API called")

    // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
    const adminId = cookies().get("adminId")?.value
    const adminUsername = cookies().get("adminUsername")?.value

    if (!adminId || !adminUsername) {
      console.error("Storage info API: User not authenticated as admin")
      return NextResponse.json({ success: false, error: "Δεν είστε συνδεδεμένος ως διαχειριστής" }, { status: 401 })
    }

    console.log(`Storage info API: Admin authenticated - ${adminUsername} (${adminId})`)

    const supabase = createSupabaseServerClient()

    // Λήψη λίστας buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json(
        { success: false, error: `Σφάλμα κατά τη λήψη λίστας buckets: ${bucketsError.message}` },
        { status: 500 },
      )
    }

    console.log(`Found ${buckets.length} buckets`)

    // Συλλογή πληροφοριών για κάθε bucket
    const bucketsInfo = []
    let totalSize = 0

    for (const bucket of buckets) {
      try {
        // Λήψη λίστας αρχείων στο bucket
        const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list()

        if (filesError) {
          console.error(`Error listing files in bucket ${bucket.name}:`, filesError)
          bucketsInfo.push({
            name: bucket.name,
            size: 0,
            files: 0,
            error: filesError.message,
          })
          continue
        }

        // Υπολογισμός μεγέθους bucket (προσεγγιστικά)
        // Σημείωση: Το Supabase API δεν παρέχει άμεσα το μέγεθος των αρχείων
        // Χρησιμοποιούμε μια προσέγγιση με βάση τον αριθμό των αρχείων
        const estimatedSize = files.length * 0.5 // 0.5 MB ανά αρχείο κατά μέσο όρο

        bucketsInfo.push({
          name: bucket.name,
          size: estimatedSize,
          files: files.length,
        })

        totalSize += estimatedSize
      } catch (error) {
        console.error(`Error processing bucket ${bucket.name}:`, error)
        bucketsInfo.push({
          name: bucket.name,
          size: 0,
          files: 0,
          error: error.message,
        })
      }
    }

    // Υπολογισμός συνολικής χρήσης
    const totalStorageLimit = 1024 // 1 GB (προεπιλεγμένο όριο για το δωρεάν πλάνο Supabase)
    const usedSize = totalSize
    const percentUsed = (usedSize / totalStorageLimit) * 100

    return NextResponse.json({
      success: true,
      info: {
        totalSize: totalStorageLimit,
        usedSize,
        percentUsed,
        buckets: bucketsInfo,
      },
    })
  } catch (error) {
    console.error("Unexpected error in storage info API:", error)
    return NextResponse.json({ success: false, error: `Απρόσμενο σφάλμα: ${error.message}` }, { status: 500 })
  }
}
