import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Δημιουργία του Supabase client με το service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Λήψη των δεδομένων από το request
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string
    const isMain = formData.get("isMain") === "true"

    if (!file || !productId) {
      return NextResponse.json(
        { success: false, message: "Λείπουν απαραίτητα δεδομένα (αρχείο ή ID προϊόντος)" },
        { status: 400 },
      )
    }

    // Δημιουργία μοναδικού ονόματος αρχείου
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}.${fileExtension}`
    const filePath = `products/${productId}/${fileName}`

    // Μετατροπή του File σε ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Ανέβασμα του αρχείου στο Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά το ανέβασμα του αρχείου", error: uploadError.message },
        { status: 500 },
      )
    }

    // Λήψη του public URL του αρχείου
    const { data: publicUrlData } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)
    const publicUrl = publicUrlData.publicUrl

    // Αποθήκευση των πληροφοριών της εικόνας στη βάση δεδομένων
    const { error: imageError } = await supabaseAdmin.from("product_images").insert([
      {
        product_id: productId,
        url: publicUrl,
        is_main: isMain,
      },
    ])

    if (imageError) {
      console.error("Error saving image data:", imageError)
      return NextResponse.json(
        { success: false, message: "Σφάλμα κατά την αποθήκευση των δεδομένων της εικόνας", error: imageError.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Η εικόνα ανέβηκε επιτυχώς",
      url: publicUrl,
    })
  } catch (error) {
    console.error("Error in upload-image API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Σφάλμα κατά το ανέβασμα της εικόνας",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
