import { createClient } from "@supabase/supabase-js"

// Χρησιμοποιούμε το service role key που έχει πλήρη δικαιώματα
export async function setupSupabase() {
  try {
    // Δημιουργία client με το service role key
    const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    console.log("Checking if images bucket exists...")

    // Έλεγχος αν υπάρχει ο bucket
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()

    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError)
      return
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "images")

    if (!bucketExists) {
      console.log("Creating images bucket...")

      // Δημιουργία του bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Error creating images bucket:", createError)
        return
      }

      console.log("Images bucket created successfully!")
    } else {
      console.log("Images bucket already exists.")
    }

    // Σημείωση: Οι πολιτικές πρόσβασης (policies) πρέπει να οριστούν μέσω του Supabase Dashboard
    console.log("Supabase storage setup completed.")
    console.log("Note: Make sure to set up appropriate access policies in the Supabase Dashboard:")
    console.log("1. Create a policy for public read access to the 'images' bucket")
    console.log("2. Create a policy for authenticated users to upload to the 'images' bucket")
  } catch (error) {
    console.error("Error setting up Supabase:", error)
  }
}
